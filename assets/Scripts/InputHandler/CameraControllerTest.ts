import { _decorator, Component, Node, Quat } from 'cc';
const { ccclass, property } = _decorator;

/**纯粹用来看帧率怎么样的测试脚本 不用时记得拿掉 */
@ccclass('CameraControllerTest')
export class CameraControllerTest extends Component {
    @property(Node)
    container:Node = null;
    @property
    isEnabled:boolean = false;
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start () {
        // Your initialization goes here.
    }

    update (deltaTime: number) {
        // Your update function goes here.
        if(this.isEnabled)
        {
            let deltaAngle = 0.1 * deltaTime
        
            if(this.container.rotation.y >= 360)
              this.container.setRotation(new Quat(0,0,0));
    
            this.container.setRotation(new Quat(0,this.container.rotation.y + deltaAngle,0));
            //this.node.setWorldRotation(new Quat(0,this.node.worldRotation.y -deltaAngle ));
        }

        
    }
}
