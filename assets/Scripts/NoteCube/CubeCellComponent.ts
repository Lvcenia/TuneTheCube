import { _decorator, Component, Node, AudioSourceComponent, AnimationComponent, AudioClip, ModelComponent, Color, renderer, loader } from 'cc';
import { CellStatus } from './CellStatus';
import { AudioManager } from '../Audio/AudioManager';
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

    onLoad(){
        
    }

    start () {
        this.audioSource = this.getComponent(AudioSourceComponent);
        this.anim = this.getComponent(AnimationComponent);
        this.modelComponent = this.getComponent(ModelComponent);
        this.renderPass =  this.modelComponent.material.passes[0];
        this.colorRenderHandle = this.renderPass.getHandle('emissive');

    }

    public OnTriggered(){
        let clipName = this.cellStatus.NoteName+"-"+this.cellStatus.InstrumentType;
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

                this.audioSource.play();
            });
        }
        this.audioSource.clip = audioClip;
        this.audioSource.play();

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

    // update (dt) {}
}
