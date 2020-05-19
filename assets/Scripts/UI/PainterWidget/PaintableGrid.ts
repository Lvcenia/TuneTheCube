import { _decorator, Component, Node, Color, SpriteComponent, systemEvent, SystemEvent } from 'cc';
import { PainterWidget, PaintMessages, PaintMode } from './PainterWidget';
import { MessageManager } from '../../MessageSystem/MessageManager';
import { PaintConfig } from '../../Painting/PaintConfig';
const { ccclass, property } = _decorator;

@ccclass('PaintableGrid')
export class PaintableGrid extends Component {

    /**主窗口的引用 */
    @property(PainterWidget)
    private painterWidget:PainterWidget = null;
    /**显示出来的颜色 */
    private displayColor:Color = Color.WHITE;

    /**格子的X坐标 */
    private X:number;
    /**格子的Z坐标 */
    private Z:number;

    private sprite:SpriteComponent = null;

    private isPainted:boolean = false;
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    onLoad(){
        this.node.on(Node.EventType.TOUCH_START,this.onClicked,this);
        this.node.on(Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        
    }

    start () {
        this.sprite = this.getComponent(SpriteComponent);
        // Your initialization goes here.
        
    }

    onTouchMove(){
        console.log("TOUCH MOVING");
        if(this.painterWidget.GetCurrentMode() === PaintMode.Paint)
        this.paintSelf();
        else this.eraseSelf();
    }

    setPainterWidget(widget:PainterWidget){
        this.painterWidget = widget;
    }
    setMatrixPosition(x:number,z:number){
        this.X = x;
        this.Z = z;
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
    onClicked(){
        console.log("TOUCH START");
        if(this.painterWidget.GetCurrentMode() === PaintMode.Paint)
        this.paintSelf();
        else this.eraseSelf();

    }

    paintSelf(){
        if(this.isPainted === false){
            this.displayColor = this.painterWidget.OnGridClicked(this.X,this.Z);
            this.sprite.color  = this.displayColor;
            this.isPainted = true;
        }
    }

    eraseSelf(){
        if(this.isPainted === true){
            this.displayColor = Color.WHITE;
            this.sprite.color  = this.displayColor;
            this.isPainted = false;
        }
    }

    

    
}
