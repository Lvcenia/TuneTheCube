import { _decorator, Component, Node,math, CCObject,ToggleComponent, ButtonComponent} from 'cc';
import { MessageManager } from '../MessageSystem/MessageManager';
const { ccclass, property } = _decorator;

const {Vec2, Vec3, Quat} = math;

var movetime:number=0;//缩放距离

const v3_1 = new Vec3();
const qt_1 = new Quat();


@ccclass('CameraController')
export class CameraController extends Component {
    @property
    moveSpeed = 1;

    @property
    rotateSpeed = 1;
    
    @property({slide: true, range: [0.05, 0.5, 0.01]})
    damp = 0.2;


    _euler = new Vec3();
    _velocity = new Vec3();
    _position = new Vec3();
    _speedScale = 1;


    
    onLoad(){
        MessageManager.getInstance().Register("MainUIOpened",this.button1clicked,this);
        MessageManager.getInstance().Register("MainUIClosed",this.button2clicked,this);
        
        Vec3.copy(this._euler, this.node.eulerAngles);
        Vec3.copy(this._position, this.node.position);
    }

    button1clicked(){
        console.log("Camera Left");
        
        movetime=20;
    }

    button2clicked(){
        console.log("Camera Back");
        
        movetime=-20;
    }



    start () {
        // Your initialization goes here.
    }

    update(dt) {
        //方块缩放
        if(movetime>0){
            this._velocity.z = 1.2;
            this._velocity.x = 0.8;
            movetime--;
        }else if(movetime<0){
            this._velocity.z = -1.2;
            this._velocity.x = -0.8;
            movetime++; 
        }else{
            this._velocity.z=0;
            this._velocity.x =0;
        }

        // position
        Vec3.transformQuat(v3_1, this._velocity, this.node.rotation);
        Vec3.scaleAndAdd(this._position, this._position, v3_1, this.moveSpeed * this._speedScale);
        Vec3.lerp(v3_1, this.node.position, this._position, dt / this.damp);
        this.node.setPosition(v3_1);
        // rotation
        Quat.fromEuler(qt_1, this._euler.x, this._euler.y, this._euler.z);
        Quat.slerp(qt_1, this.node.rotation, qt_1, dt / this.damp);
        this.node.setRotation(qt_1);
    }

}
