import { _decorator, Component, Node, Vec3, AudioSourceComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    private audioSource:AudioSourceComponent = null;


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
    PlaceCell(worldPos:Vec3,){

    }

    Move(direction:Vec3){

    }

    RotateAt(){

    }
}
