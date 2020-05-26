import { _decorator, Component, Node ,Color, color} from 'cc';
import { Dictionary } from '../Generics/XDictionary';
import { CubeManager } from '../NoteCube/CubeManager';
import { Notes, NoteScale, NoteNameConvert } from '../Musicals/Musicals';
import { PaintConfig } from './PaintConfig';
import { MessageManager } from '../MessageSystem/MessageManager';
import { PaintMessages as PaintMessages } from '../UI/PainterWidget/PainterWidget';
const { ccclass, property } = _decorator;

/**控制音与颜色关系的核心类
 * 类中保存了已经注册的调式和当前的八度
 * 颜色机制：
 * 每一个音（C-B）在作为调的主音时有一个确定的颜色
 * 当确定一个调式后，调中除主音以外的音会根据它到主音的距离动态地生成一个颜色
 * 这样的目的是让一个调中的颜色看起来尽量统一
 * 确定调式之后要确定八度，八度由0-8 饱和度和亮度逐渐上升
 * 返回给前端UI的数据是经过了调式颜色分析和八度分析处理之后的调式信息，其中包含了每个音对应的颜色
 */
@ccclass('Painter')
export class Painter extends Component {

    private static _instance: Painter;
    
    public static getInstance() : Painter{
        return this._instance;    
    }

    /**保存现有的调式 */
    private ScaleListDictionary:Dictionary<NoteScale>;

    /**当前的音阶 */
    private currentScale:NoteScale = null;

    /**cubemanager引用 */
    @property(CubeManager)
    private cubeManager:CubeManager = null;

    /**方便计算音符距离的数组 */
    private NotesArr = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

    /**音名和这个音作为调中主音时的颜色的字典 */
    private NoteColorsDictionary:Dictionary<Color>;

    /**绘制时音的颜色使用主音颜色，不随绘制时的音调改变 */
    private useFixedNoteColor:boolean = false;

    private currentLayer:number = 0;

    private storedCellColors:Color[][][];

    private currentOctave:number = 4;

    onLoad(){
        Painter._instance = this;
        console.log("初始化Painter");
        this.ScaleListDictionary = new Dictionary<NoteScale>();
        this.NoteColorsDictionary = new Dictionary<Color>();
        MessageManager.getInstance().Register(PaintMessages.PaintCell,this.PaintCell,this);
        MessageManager.getInstance().Register(PaintMessages.EraseCell,this.EraseCell,this);
        MessageManager.getInstance().Register(PaintMessages.SwitchOctave,this.OnSwitchOctave,this);
    }
    
    start(){

        this.initNoteColors();
        this.initScales();
        this.initColorArr();
        //初始定在C大调
        this.currentScale = this.ScaleListDictionary.get("半音音阶");
        this.EmitUpdateScaleMsg();
        
    }


    /**设置一个音阶，参数是调名标识和对应的音阶
     * 如 SetKeyScale("C大调",["C","D","E","F","G","A","B"]);
     */
    public SetKeyScale(keyName:string,notes:string[]){
        this.ScaleListDictionary.set(keyName,new NoteScale(keyName,notes));
    }

    /**设置CubeManager引用 */
    public SetCubeManager(cubeManager:CubeManager){
        this.cubeManager = cubeManager;
    }

    /**返回实际用于绘画的、包含八度的音调颜色信息 */
    public GetCurrentScaleOctaved():NoteScale{
        let currentScaleOctaved:NoteScale = NoteScale.Copy(this.currentScale);

        console.log("before ",this.currentScale);
        console.log("Copy: ",currentScaleOctaved);
        
        let isNoteExist:boolean = true;
        
      
        for(let i = 0;i < currentScaleOctaved.Notes.length; i++)
        {
            let notename = this.currentScale.Notes[i];
            console.log(notename);
            
            if(this.currentOctave == 0)
            {
                if(notename !== "A" && notename !== "A#" && notename != "Bb" &&notename !== "B")
                {
                    isNoteExist = false;
                    currentScaleOctaved.Notes[i] = 'NoExistence';
                }
            }

            if(this.currentOctave == 8)
            {
                if(notename !== "C")
                {
                    isNoteExist = false;
                    currentScaleOctaved.Notes[i] = 'NoExistence';
                }
            }

            if(isNoteExist)
            {
                currentScaleOctaved.ScaleNoteColorDictionary.set(notename + this.currentOctave.toString(),
                this.getColorOctaved(this.currentScale.ScaleNoteColorDictionary.get(notename),this.currentOctave));
            currentScaleOctaved.Notes[i] = notename + this.currentOctave.toString();
            }

            } 
        
        console.log("after ",this.currentScale);
        return currentScaleOctaved;

    }

    /**返回不包含八度的音调信息 */
    public GetScales():NoteScale[]{
        return this.ScaleListDictionary.getValues();       
    }

    /**（绘画时 切换音调*/
    public OnSwitchScale(toScale:string):NoteScale{
        if(this.ScaleListDictionary.has(toScale)){
            this.currentScale = this.ScaleListDictionary.get(toScale);
        }
        this.EmitUpdateScaleMsg();
        return this.currentScale;

    }

    public EmitUpdateScaleMsg(){
        MessageManager.getInstance().Send(PaintMessages.OctavedCurScaleUpdated,
            this.GetCurrentScaleOctaved());
    }

    public OnSwitchOctave(toOctave:number){
        this.currentOctave = toOctave;
        this.EmitUpdateScaleMsg();
    }

    /**前端一个方块的颜色改变时调用，通知CubeManager绘制一个方块 顺便记录对应位置的颜色 */
    public PaintCell(config:PaintConfig){
        this.cubeManager.OnCellPainted(config);
        this.storedCellColors[config.Layer][config.X][config.Z] = config.Color;
        
    }


    /**前端擦除一个方块的颜色时调用，通知CubeManager擦掉一个方块的颜色 同时将对应位置的颜色换为白色*/
    public EraseCell(config:PaintConfig){
        this.storedCellColors[config.Layer][config.X][config.Z] = Color.WHITE;
        this.cubeManager.OnCellErased(config);


    }

    /** 为一个音设置主音颜色*/
    public SetNoteColor(noteName:string,color:Color){
        if(Notes[noteName] === undefined)
        {
            console.log(`${noteName} 这个音不存在`);
            return;
        }
        this.NoteColorsDictionary.set(noteName,color);
    }

    /**音阶初始化 */
    private initScales(){
        //插入调信息
        this.SetKeyScale("C大调",["C","D","E","F","G","A","B"]);
        this.SetKeyScale("半音音阶",["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]);


        //生成调内颜色
        let scaleNames = this.ScaleListDictionary.getKeys();
        for(let i =0; i < scaleNames.length; i++){
            this.generateScaleColors(scaleNames[i]);
        }

    }

    /**音符颜色（主音时）初始化 */
    private initNoteColors(){
        this.SetNoteColor("C",color(133,224,84));
        this.SetNoteColor("C#",color(84,224,198));
        this.SetNoteColor("D",color(84,169,224));
        this.SetNoteColor("D#",color(107,84,224));
        this.SetNoteColor("E",color(189,84,224));
        this.SetNoteColor("F",color(224,84,117));
        this.SetNoteColor("F#",color(224,84,98));
        this.SetNoteColor("G",color(224,125,84));
        this.SetNoteColor("G#",color(224,190,84));
        this.SetNoteColor("A",color(196,224,84));
        this.SetNoteColor("A#",color(121,224,57));
        this.SetNoteColor("B",color(57,97,224));

    }

    private initColorArr(){
        //初始化结点数组
        this.storedCellColors = new Array<Array<Array<Color>>>(CubeManager.MaxRank);
        for(let y = 0; y < CubeManager.MaxRank ;y++)
        {
            this.storedCellColors[y] = new Array<Array<Color>>(CubeManager.MaxRank);
            for(let x = 0; x < CubeManager.MaxRank ; x++)
            {
                this.storedCellColors[y][x] = new Array<Color>(CubeManager.MaxRank);
            }

        }

    }

    /**计算两个音之间的距离（半音数） */
    private calcNoteDistance(note1:string,note2:string):number{
        //如果是带降号的 转成升号再比
        if(note1.indexOf("b") !== -1)
        note1 = NoteNameConvert[note1];
        if(note2.indexOf("b") !== -1)
        note2 = NoteNameConvert[note2];

        return Math.abs(this.NotesArr.indexOf(note1) - this.NotesArr.indexOf(note2));
    }

    /**给出一个音基于与另一个音(调内主音)的距离计算得到的颜色
     * 主要基于HSV做计算 距离越远的音，色相差距越大,但是基本保持在同一个大的色调中
     * 第一个参数baseNote是基准音
     * 第二个参数targetNote是要计算的音 
    */
    private getNonKeynoteColor(baseNote:string,targetNote:string):Color{
        //允许的色相偏移范围
        let hRrange = 0.14;
        let distance = this.calcNoteDistance(baseNote,targetNote);
        let baseColor = this.NoteColorsDictionary.get(baseNote);
        let targetColor = new cc.Color();
        //拿到基准HSV
        let baseHSV = baseColor.toHSV();
        targetColor = targetColor.fromHSV(baseHSV.h + hRrange*distance/12,baseHSV.s,baseHSV.v);

        return targetColor;
    }

    /**为指定的调设定每个调内音的颜色 */
    private generateScaleColors(keyName:string){
        let scale = this.ScaleListDictionary.get(keyName);
        if(scale === undefined)
        {
            console.log(`${keyName} 这个调不在Painter字典中`);
            return;
        }
        //设置每个音的颜色
        for(let i = 0; i < scale.Notes.length; ++i){
            if(i === 0){
                scale.ScaleNoteColorDictionary.set(scale.KeyNote,this.NoteColorsDictionary.get(scale.KeyNote));
            }
            scale.ScaleNoteColorDictionary.set(
                scale.Notes[i],
                this.getNonKeynoteColor(scale.KeyNote,scale.Notes[i])

            );
        }
    }

    private getColorOctaved(color:Color,octave:number):Color{
        let colorH = color.toHSV().h;
        let baseColorS = 0.45;
        let baseColorV = 0.45;

        let resColor = new Color();
        resColor = resColor.fromHSV(colorH,baseColorS + 0.2*octave,baseColorV + 0.2*baseColorV);
        return resColor;


    }


}
