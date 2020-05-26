import { _decorator, Component, Node, NodePool, Color, ButtonComponent, EventHandler, LayoutComponent, Prefab, UITransformComponent, UIOpacityComponent } from 'cc';
import { UIBaseWidget } from '../UIFrame/UIBaseWidget';
import { NoteScale } from '../../Musicals/Musicals';
import { MessageManager } from '../../MessageSystem/MessageManager';
import { PaintConfig } from '../../Painting/PaintConfig';
import { UIManager, UIPrefabNames } from '../UIFrame/UIManager';
import { PaintableGrid } from './PaintableGrid';
import { CubeManager } from '../../NoteCube/CubeManager';
import { AutoAdjustMatrixLayout } from './AutoAdjustMatrixLayout';
import { InstrumentTypes } from '../../Audio/AudioManager';
import { CellStatus } from '../../NoteCube/CellStatus';
const { ccclass, property } = _decorator;

/**绘制模式 可以为方块涂色或者擦除 */
export enum PaintMode {
    Paint = "Paint",
    Erase = "Erase"
}

export const PaintMessages = {
    //UI内部的
    UI_GridClicked:"UI_GridClicked",
    PaletteGridClicked:"PaletteGridClicked",






    //UI向后端的
    SwitchLayer:"SwitchLayer",
    ToNextLayer: "ToNextLayer",
    ToLastLayer :"ToLastLayer",
    SwitchScale : "SwitchScale",

    PaintCell :"GridPainted",
    EraseCell: "GridErased",
    SwitchOctave:"SwitchOctave",

    AddLayer:"AddLayer",
    RemoveLayer:"RemoveLayer",




    //系统级的
    ChangeRank:"ChangeRank",



    //后端向UI的
    OctavedCurScaleUpdated:"OctavedCurScaleUpdated",
    LayerSwitched:"LayerSwitched",

    LayerAdded:"LayerAdded",
    LayerRemoved:"LayerRemoved"

}

@ccclass('PainterWidget')
export class PainterWidget extends UIBaseWidget {

    /**绘画格子的容器 */
    @property(AutoAdjustMatrixLayout)
    private gridBoxLayout:AutoAdjustMatrixLayout = null;

    private gridsArr:PaintableGrid[][];

    /**绘画格子结点的对象池 */
    @property(NodePool)
    private gridNodePool:NodePool = null;


    private currentOctave:number = 4;

    /**不包含八度信息的音阶信息 */
    private ScaleList:NoteScale[] = [];

    /**当前的绘制模式  */
    private currentMode:PaintMode = PaintMode.Paint;

    /**当前的音 */
    private currentNote:string = "";

    /**当前音对应的颜色 */
    private currentPaintColor:Color = Color.WHITE;

    /**当前绘制的层 */
    private currnetLayerIndex:number = 0;

    /**当前的包含八度信息的音阶信息 */
    private currentOctavedScale:NoteScale = null;

    /**是否已经构建过一次 */
    private hasFirstBuild:boolean = false;

    /**当前的Rank */
    private Rank:number = -1;



    private currentInst:string = "";

    @property
    private gridBoxW:number = 350;
    @property
    private gridBoxH:number = 350;

    

    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    /** */
    onLoad(){
        super.onLoad();
        this.initGridsArr();
        MessageManager.getInstance().Register(PaintMessages.OctavedCurScaleUpdated,this.onOctavedCurScaleUpdated,this);
        MessageManager.getInstance().Register(PaintMessages.ChangeRank,this.generateGrids,this);
        MessageManager.getInstance().Register(PaintMessages.PaletteGridClicked,this.onPaletteGridClicked,this);
        MessageManager.getInstance().Register(PaintMessages.LayerSwitched,this.OnLayerSwitched,this);
        //MessageManager.getInstance().Register(PaintMessages.LayerAdded,this.on,this);
        this.currentInst = InstrumentTypes.VibratePhone;
    }

    start () {
        // Your initialization goes here.
        
        this.gridNodePool = UIManager.getInstance().GetWidgetPool(UIPrefabNames.PaintableGrid);
        //this.generateGrids(9);
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }

    private initGridsArr(){
        this.gridsArr = new Array<Array<PaintableGrid>>(CubeManager.MaxRank);
        for(let i = 0; i < CubeManager.MaxRank; i++)
        {
            this.gridsArr[i] = new Array<PaintableGrid>(CubeManager.MaxRank);
        }

    }

    public GetCurrentMode():PaintMode{
        return this.currentMode;

    }

    private generateGrids(rank:number){
        console.log("In generate Grids: " ,this.hasFirstBuild);
        
        if(this.hasFirstBuild === false)
        {
            for(let z = 0 ; z< rank; z++){
                for(let x = 0; x < rank; x++)
                {
                    
                    let gridNode = this.gridNodePool.get();
                    gridNode.getComponent(UITransformComponent).setContentSize(this.gridBoxW/(rank),this.gridBoxH/(rank));
                    console.log(gridNode.name);
                    let cmp:PaintableGrid = gridNode.getComponent(PaintableGrid);
                    this.gridsArr[x][z] = cmp;
                    cmp.setPainterWidget(this);
                    cmp.setMatrixPosition(x,z);
                    this.gridBoxLayout.node.addChild(gridNode);
                    
                }
            }
            this.hasFirstBuild = true;
            console.log("In generate Grids After change: " ,this.hasFirstBuild);
            this.Rank = rank;
            this.gridBoxLayout.onRankChanged(rank);
            return;
        }

        if(this.Rank === rank)
        return;

        if(this.Rank > rank)
        {
            //多了收回
            for(let x = rank; x< this.Rank; x++)
            {
                for(let z = rank; z < this.Rank; z++)
                {
                    console.log(x,z);
                    this.gridNodePool.put(this.gridsArr[x][z].node);
                }
            }
        }

        

        this.gridBoxLayout.node.removeAllChildren();

            for(let z = 0; z< rank; z++)
            {
                for(let x = 0; x < rank; x++)
                {
                    let gridNode:Node;
                    if(this.gridsArr[x][z] === undefined)
                    {
                        gridNode = this.gridNodePool.get();
                        let cmp:PaintableGrid = gridNode.getComponent(PaintableGrid);
                        this.gridsArr[x][z] = cmp;
                        cmp.setPainterWidget(this);
                        cmp.setMatrixPosition(x,z);
                    }
                    else gridNode = this.gridsArr[x][z].node;

                    //gridNode.getComponent(UITransformComponent).setContentSize(this.gridBoxW/(rank),this.gridBoxH/(rank));
                    this.gridBoxLayout.node.addChild(this.gridsArr[x][z].node);
                }
            }

        
        this.Rank = rank;

        this.gridBoxLayout.onRankChanged(rank);

    }

    ChangePaintMode(toggle,modeIndex:string){
        console.log("In ChangepaintMode ");
        console.log(modeIndex);
        switch (modeIndex) {
            case "paint":
                this.currentMode = PaintMode.Paint;
                break;
            case "erase":
                this.currentMode = PaintMode.Erase;
                break;

        }
    }
    

    /**图层切换后 更新前端的颜色显示和图层序号 */
    private OnLayerSwitched(toLayer:number,cellStats:CellStatus[][])
    {
        this.currnetLayerIndex = toLayer;
        for(let z = 0 ; z< this.Rank; z++){
            for(let x = 0; x < this.Rank; x++)
            {

                let cmp:PaintableGrid = this.gridsArr[x][z];
                cmp.UpdateColor(cellStats[x][z].Color);
                
            }
        }

    }

    public GetCurrentLayer(){
        return this.currnetLayerIndex;
    }

    //给增加一个八度的按钮调用的接口
    public OctavePlusOne(){
        if(this.currentOctave <= 7)
        this.switchOctave(this.currentOctave+1);

    }

    //给减少一个八度的按钮调用的接口
    public OctaveMinusOne(){
        if(this.currentOctave > 0)
        this.switchOctave(this.currentOctave-1);
    }

    private onOctavedCurScaleUpdated(curScaleOctaved:NoteScale){
        this.currentOctavedScale = curScaleOctaved;
        
        this.currentNote = this.currentOctavedScale.Notes[0];
        this.currentPaintColor = this.currentOctavedScale.ScaleNoteColorDictionary.get(this.currentNote);
        let notes = this.currentOctavedScale.Notes;
        // for(let i = 0; i <notes.length; i++)
        // {

        //    //console.log(this.currentOctavedScale.ScaleNoteColorDictionary.get(this.currentOctavedScale.Notes[i]).toHEX("#rrggbbaa"));
            
        // }
        
        
        
    }

    private switchOctave(toOctave:number){
        this.currentOctave = toOctave;
        MessageManager.getInstance().Send(PaintMessages.SwitchOctave,toOctave);

    }

    /**某个格子被点击时由格子调用 返回格子应该变成的颜色 */
    public OnGridClicked(x:number,z:number):Color{
        switch (this.currentMode) {
            case PaintMode.Erase:
                MessageManager.getInstance().Send(PaintMessages.EraseCell,new PaintConfig(this.currnetLayerIndex,
                    x,z,Color.WHITE,"","",this.currentInst));
                return Color.WHITE;
                    break;
                    
            case PaintMode.Paint:
                MessageManager.getInstance().Send(PaintMessages.PaintCell,new PaintConfig(this.currnetLayerIndex,
                    x,z,this.currentPaintColor,this.currentOctavedScale.Name,this.currentNote,this.currentInst));
        
                    return this.currentPaintColor;
                break;
            

                
        
            default:
                break;
        }



    }

    PrePaint(){
        let i = 0;
        for(let x = 0; x <this.Rank;x++)
        {
            for(let z = 0; x<this.Rank;z++)
            {
                this.currentPaintColor = this.currentOctavedScale.ScaleNoteColorDictionary.get(this.currentOctavedScale.Notes[i]);
                i++;
                if(i >= this.currentOctavedScale.Notes.length) i = 0;
                this.gridsArr[x][z].onClicked();
            }
        }
    }

    onPaletteGridClicked(notename:string,color:Color){
        console.log("In Change Color Callback " + notename,color.toHEX("#rrggbb"));
        this.currentNote = notename;
        this.currentPaintColor = color;
    }

    onChangeInstrument(instIndex:number){
        switch (instIndex) {
            case 0:
                this.currentInst = InstrumentTypes.VibratePhone;
                
                break;
            case 1:
                this.currentInst = InstrumentTypes.Guitar;
                
                break;
            case 2:
                
            break;
        
            default:
                break;
        }
    }

    Hide(){
        super.Hide();
        //this.opacityComp.opacity = 0;
    }
    Show(){
        super.Show();
        //this.opacityComp.opacity = 255;
    }

    AddLayerRequest(){

    }
}
