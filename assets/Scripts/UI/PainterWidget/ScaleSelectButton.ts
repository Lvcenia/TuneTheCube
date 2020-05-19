import { _decorator, Component, Node, ButtonComponent, EventHandler } from 'cc';
import { MessageManager } from '../../MessageSystem/MessageManager';
import { PaintMessages } from './PainterWidget';
const { ccclass, property } = _decorator;

@ccclass('ScaleSelectButton')
export class ScaleSelectButton extends Component {

    @property
    private scaleName:string;

    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start () {
        // Your initialization goes here.

    }
    setScaleName(scaleName:string){
        this.scaleName = scaleName;
    }

    onClick(){
        MessageManager.getInstance().Send(PaintMessages.SwitchScale,this.scaleName);
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
