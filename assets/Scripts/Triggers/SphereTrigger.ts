import { _decorator, Component, Node, AnimationComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SphereTrigger')
export class SphereTrigger extends Component {
    /* class member could be defined like this */
    // dummy = '';
    private anim:AnimationComponent = null;

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start () {
        this.anim = this.getComponent(AnimationComponent);
        // Your initialization goes here.
    }

    Work(){
        this.anim.play('SphereTrigger_Out');

    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
