import { _decorator, Component, Node, SliderComponent, Color, SpriteComponent, LabelComponent } from 'cc';
import { NoteScale } from '../../Musicals/Musicals';
import { MessageManager } from '../../MessageSystem/MessageManager';
import { PaintMessages } from './PainterWidget';
const { ccclass, property } = _decorator;


/**挂在调色板的色块上的脚本 由PainterWidget直接管理 */
@ccclass('PaletteGrid')
export class PaletteGrid extends Component {
    private currentNote:string = "";
    private currentColor:Color = Color.WHITE;

    

    private label:LabelComponent = null;

    private sprite:SpriteComponent = null;

    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator【【 if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    onLoad () {
        this.sprite = this.getComponent(SpriteComponent);
        this.label = this.getComponentInChildren(LabelComponent);
        
        // Your initialization goes here.
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
    public ChangeCurrentPaintColor(){
        MessageManager.getInstance().Send(PaintMessages.PaletteGridClicked,this.currentNote,this.currentColor);
    }

    /**切换音符、颜色时 */
    public updateNoteInfo(noteName:string,color:Color){
        this.currentColor = color;
        this.label.string = noteName;
        this.sprite.color = color;
        this.currentNote = noteName;

    }
}
