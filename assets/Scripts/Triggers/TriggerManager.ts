import { _decorator, Component, Node } from 'cc';
import { MessageManager } from '../MessageSystem/MessageManager';
const { ccclass, property } = _decorator;

export const AudioMessages = {
    StartPlaySequence : "StartPlaySequence",
    StartPlaySphere : "StartPlaySphere",
    LayerPlayEnded:"LayerPlayEnded",
    StopPlay:"StopPlay"
}

@ccclass('TriggerManager')
export class TriggerManager extends Component {
    private static instance:TriggerManager;


    public static getInstance():TriggerManager{
        return TriggerManager.instance;
    }

    TriggerMode = "Sequence";

    @property
    SequenceInterval:number = 0;

    @property(Node)
    sphereTrigger:Node = null;
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    onLoad(){
        TriggerManager.instance = this;
    }

    start () {
        // Your initialization goes here.
    }

    OnStartPlay(){
        switch(this.TriggerMode){
            case "Sequence":
                if(this.sphereTrigger.active === true) this.sphereTrigger.active =false;
                MessageManager.getInstance().Send(AudioMessages.StartPlaySequence,this.SequenceInterval);
            break;
            case "StartPlaySphere":
                this.sphereTrigger.active = true;
                MessageManager.getInstance().Send(AudioMessages.StartPlaySphere);
        }
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
