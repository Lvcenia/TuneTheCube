import { _decorator, Component, Node, AudioSourceComponent, AnimationComponent, AudioClip, ModelComponent, Color, renderer, loader, BoxColliderComponent, ITriggerEvent } from 'cc';
import { CellStatus } from './CellStatus';
import { AudioManager } from '../Audio/AudioManager';
import { NoteNameConvert } from '../Musicals/Musicals';
import { MessageManager } from '../MessageSystem/MessageManager';
const { ccclass, property } = _decorator;

@ccclass('CubeCellComponent')
export class CubeCellComponent extends Component {
    public cellStatus:CellStatus = new CellStatus();

    private audioSource:AudioSourceComponent = null;

    private anim:AnimationComponent = null;

    private audioClips:AudioClip[] = [];

    private modelComponent:ModelComponent = null;

    private colorRenderHandle:number = 0;

    private renderPass:renderer.Pass = null;

    private collider:BoxColliderComponent = null;

    onLoad(){
        MessageManager.getInstance().Register("CubeAudioPlayBegin",this.OnAudioPlayBegin,this);
    }

    start () {
        this.audioSource = this.getComponent(AudioSourceComponent);
        this.anim = this.getComponent(AnimationComponent);
        this.modelComponent = this.getComponent(ModelComponent);
        this.renderPass =  this.modelComponent.material.passes[0];
        this.colorRenderHandle = this.renderPass.getHandle('albedo');
        this.collider = this.getComponent(BoxColliderComponent);
        this.collider.on('onTriggerEnter',this.onTriggerEnter,this);

    }
    onTriggerEnter(event: ITriggerEvent){
        if(this.cellStatus.isPainted)
        {
            this.OnTriggered();
        }

    }

    public OnTriggered(){
        let notenameReal = this.cellStatus.NoteName;

        

        //有降号 转升号
        if(notenameReal.indexOf("b")!== -1)
        notenameReal.replace(notenameReal.slice(0,2),NoteNameConvert[notenameReal.slice(0,2)]);

        //升号转s
        console.log("ClipName before: " + notenameReal);
        notenameReal = notenameReal.replace("#","s");
        
        let clipName = notenameReal+"-"+"guitar";
        console.log("ClipName After: " + clipName);
        
        let audioClip = AudioManager.GetInstrumentClip(clipName);
        if(audioClip === null)
        {
            loader.loadRes("Audio/Instruments/" + clipName ,AudioClip,  (err, clip:AudioClip)=> {
                console.log("Cube Dynamic Loading");
                
                if(err)
                {
                    console.log("动态加载音频出错");
                    console.log(err);
                    return;
                }
                AudioManager.AudioIndex.set(name,clip);
                
                console.log("In audio manager");
                console.log(clip.name);
                this.audioSource.clip = clip;

                let s = <any>this.audioSource.clip;
                MessageManager.getInstance().Send("AudioPlay",s._audio,this.cellStatus);

            });
        }
        else {
            this.audioSource.clip = audioClip;
            let s = <any>this.audioSource.clip;
            //this.audioSource.play();
            console.log("In Cell",this.cellStatus);
            
            MessageManager.getInstance().Send("AudioPlay",s._audio,this.cellStatus);
        }


    }

    /**被绘制时 */
    public OnPainted(color:Color,noteNameWithOct:string){
        this.cellStatus.Color = color;
        this.setCellColor(color);
        this.cellStatus.NoteName = noteNameWithOct;
        this.cellStatus.isPainted = true;


        
    }

    private setCellColor(color:Color){
        console.log(color.x,color.y,color.z);
        this.renderPass.setUniform(this.colorRenderHandle,color);

    }
    /**擦除时 */
    public OnErased(){
        console.log("in Cube Onerased");
        this.cellStatus.Color = Color.WHITE;
        this.setCellColor(Color.WHITE);
        this.cellStatus.isPainted = false;

    }

    OnAudioPlayBegin(cellSt:CellStatus){
        if(cellSt === this.cellStatus)
        {
            this.anim.play("CubeTriggerred");
        }

    }

    // update (dt) {}
}
