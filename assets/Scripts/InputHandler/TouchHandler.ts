import { _decorator, Component, Node, PhysicsRayResult, PhysicsSystem } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TouchHandler')
export class TouchHandler extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    private isLongPress:boolean = false;

    /**手指按下时间长短的计数器 */
    private pressTimeCounter:number = 0;

    start () {
        // Your initialization goes here.
    }

    update(deltaTime:number){

    }

    onTouchMove(){

    }

    onTouchDown(){


        //射线检测 拿到
        //if(PhysicsSystem.instance.raycastClosest()){

        
        
    }

    onTouchEnd(){

    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
