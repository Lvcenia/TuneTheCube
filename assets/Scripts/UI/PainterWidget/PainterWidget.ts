import { _decorator, Component, Node, NodePool, Color, ButtonComponent, EventHandler, LayoutComponent, Prefab, UITransformComponent, UIOpacityComponent } from 'cc';
import { UIBaseWidget } from '../UIFrame/UIBaseWidget';
import { ColorSelector } from './ColorSelector';
import { NoteScale } from '../../Musicals/Musicals';
import { MessageManager } from '../../MessageSystem/MessageManager';
import { PaintConfig } from '../../Painting/PaintConfig';
import { UIManager, UIPrefabNames } from '../UIFrame/UIManager';
import { PaintableGrid } from './PaintableGrid';
import { CubeManager } from '../../NoteCube/CubeManager';
const { ccclass, property } = _decorator;

/**绘制模式 可以为方块涂色或者擦除 */
export enum PaintMode {
    Paint,
    Erase
}

export const PaintMessages = {
    //UI内部的
    UI_GridClicked:"UI_GridClicked",






    //UI向后端的
    ToNextLayer: "ToNextLayer",
    ToLastLayer :"ToLastLayer",
    SwitchScale : "SwitchScale",
    SwitchCurrentColor:"SwitchCurrentColor",
    PaintCell :"GridPainted",
    EraseCell: "GridErased",
    SwitchOctave:"SwitchOctave",




    //系统级的
    ChangeRank:"ChangeRank",



    //后端向UI的
    OctavedCurScaleUpdated:"OctavedCurScaleUpdated",

}

@ccclass('PainterWidget')
export class PainterWidget extends UIBaseWidget {

    /**绘画格子的容器 */
    @property(LayoutComponent)
    private gridBoxLayout:LayoutComponent = null;

    @property(Prefab)
    private gridPrefab:Prefab=null;

    private gridsArr:PaintableGrid[][];

    /**绘画格子结点的对象池 */
    @property(NodePool)
    private gridNodePool:NodePool = null;

    /**选色条窗口的引用 */
    @property(ColorSelector)
    private colorSelector:ColorSelector = null;

    /**"画笔" 按钮的节点引用 */
    @property(ButtonComponent)
    private paintButton:ButtonComponent = null;

    /**"橡皮"按钮的节点引用 */
    @property(ButtonComponent)
    private eraseButton:ButtonComponent = null;

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

    private opacityComp:UIOpacityComponent = null;

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
        this.opacityComp = this.getComponent(UIOpacityComponent);
        this.initGridsArr();
        MessageManager.getInstance().Register(PaintMessages.OctavedCurScaleUpdated,this.onOctavedCurScaleUpdated,this);
        MessageManager.getInstance().Register(PaintMessages.ChangeRank,this.generateGrids,this);
    }

    start () {
        // Your initialization goes here.
        
        this.gridNodePool = UIManager.getInstance().GetWidgetPool(UIPrefabNames.PaintableGrid);
        this.generateGrids(9);
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
            this.Rank = rank;
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

                    gridNode.getComponent(UITransformComponent).setContentSize(this.gridBoxW/(rank),this.gridBoxH/(rank));
                    this.gridBoxLayout.node.addChild(this.gridsArr[x][z].node);
                }
            }

        
        this.Rank = rank;


        

    }

    testMSG()
    {
        MessageManager.getInstance().Send(PaintMessages.ChangeRank,10);
    }
    

    /**切换当前绘制层的时候 要切换Grids的显示颜色 */
    private OnSwitchLayer(toLayer:number){

    }

    public GetCurrentLayer(){
        return this.currnetLayerIndex;
    }

    //给增加一个八度的按钮调用的接口
    public OctavePlusOne(){
        this.switchOctave(this.currentOctave+1);

    }

    //给减少一个八度的按钮调用的接口
    public OctaveMinusOne(){
        this.switchOctave(this.currentOctave-1);
    }

    private onOctavedCurScaleUpdated(curScaleOctaved:NoteScale){
        this.currentOctavedScale = curScaleOctaved;
        
        this.currentNote = this.currentOctavedScale.Notes[5];
        this.currentPaintColor = this.currentOctavedScale.ScaleNoteColorDictionary.get(this.currentNote);
        for(let i = 0; i < this.currentOctavedScale.Notes.length; i++)
        {
            console.log(this.currentOctavedScale.ScaleNoteColorDictionary.get(this.currentOctavedScale.Notes[i]).toHEX("#rrggbbaa"));
        }
        
    }

    private switchOctave(toOctave:number){
        MessageManager.getInstance().Send(PaintMessages.SwitchOctave,toOctave);

    }

    /**某个格子被点击时由格子调用 返回格子应该变成的颜色 */
    public OnGridClicked(x:number,z:number):Color{
        MessageManager.getInstance().Send(PaintMessages.PaintCell,new PaintConfig(this.currnetLayerIndex,
            x,z,this.currentPaintColor,this.currentOctavedScale.Name,this.currentNote));

            return this.currentPaintColor;


    }

    Hide(){
        this.opacityComp.opacity = 0;
    }
    Show(){
        this.opacityComp.opacity = 255;
    }
}
