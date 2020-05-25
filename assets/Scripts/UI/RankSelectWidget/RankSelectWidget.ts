import { _decorator, Component, Node, ToggleComponent } from 'cc';
import { UIBaseWidget } from '../UIFrame/UIBaseWidget';
import { MessageManager } from '../../MessageSystem/MessageManager';
import { PaintMessages } from '../PainterWidget/PainterWidget';
const { ccclass, property } = _decorator;

@ccclass('RankSelectWidget')
export class RankSelectWidget extends UIBaseWidget
{

    @property
    selectedRank:number = 3;
    
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start () {
        // Your initialization goes here.
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
    onRankToggleSelected(toggle:ToggleComponent,rank:number){
        this.selectedRank = rank;

    }

    onConfirm(){
        console.log("确认Rank");
        
        MessageManager.getInstance().Send(PaintMessages.ChangeRank,this.selectedRank);
    }
}
