import { _decorator, Component, Node, AnimationComponent } from 'cc';
const { ccclass, property } = _decorator;

export enum UIWidgetBehaviour {
    /**一块面板占据整个屏幕 */
    Section,
    /**弹出型的对话框 */
    Dialog,
    /**固定在某个位置的面板 */
    Static,
}

@ccclass('UIBaseWidget')
export class UIBaseWidget extends Component {
    
    protected WidgetBehaviour:UIWidgetBehaviour;
    protected WidgetTite:string;
    protected PrefabName:string;
    protected Anim:AnimationComponent;
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start () {
        this.Anim = this.getComponent(AnimationComponent);
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
    /**窗口显示函数 */
    Show(){

    }

    /**窗口隐藏函数 */
    Hide(){

    }
}
