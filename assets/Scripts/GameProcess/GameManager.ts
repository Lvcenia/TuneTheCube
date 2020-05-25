import { _decorator, Component, Node } from 'cc';
import { MessageManager } from '../MessageSystem/MessageManager';
import { PaintMessages } from '../UI/PainterWidget/PainterWidget';
const { ccclass, property } = _decorator;



export const SystemMessages  = {
    ChangeRank:"ChangeRank",

}

@ccclass('GameManager')
export class GameManager extends Component {

    public static MaxRank:number = 10;

    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    private firstAutoShow:boolean = false;
    start () {
        // Your initialization goes here.
 
    }

    update(dt:number){
        // if(this.firstAutoShow === false)
        // {
        //     console.log("sssssss");
            
        //     this.ChangeRank(8);
        //     this.firstAutoShow = true;
        // }
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }

}
