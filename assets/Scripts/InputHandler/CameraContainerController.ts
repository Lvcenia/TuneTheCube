import { _decorator, Component, Node,math} from 'cc';
const { ccclass, property } = _decorator;

const {Vec2, Vec3, Quat} = math;

const v2_1 = new Vec2();
const v2_2 = new Vec2();
const v3_1 = new Vec3();
const qt_1 = new Quat();


@ccclass('CameraContainerController')
export class CameraContainerController extends Component {
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
        cc.systemEvent.on(cc.SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
        Vec3.copy(this._euler, this.node.eulerAngles);
        Vec3.copy(this._position, this.node.position);
    }


 


    onTouchStart(){
        if (cc.game.canvas.requestPointerLock) cc.game.canvas.requestPointerLock();
    }

    onTouchMove(e){
        e.getStartLocation(v2_1);
            e.getDelta(v2_2);
            //符号
            this._euler.y -= v2_2.x * this.rotateSpeed * 0.1;
            this._euler.x += v2_2.y * this.rotateSpeed * 0.1;
    }

    onTouchEnd(e){
        if (document.exitPointerLock) document.exitPointerLock();
        e.getStartLocation(v2_1);
        if (v2_1.x < cc.winSize.width * 0.4) { // position
            this._velocity.x = 0;
            this._velocity.z = 0;
        }
//console.log(this.node.rotation.x,this.node.rotation.y,this.node.rotation.z,this.node.rotation.w)
    }



    start () {
        // Your initialization goes here.
    }


    update(dt) {
        // position
        Vec3.lerp(v3_1, this.node.position, this._position, dt / this.damp);
        this.node.setPosition(v3_1);
        // rotation
        Quat.fromEuler(qt_1, this._euler.x, this._euler.y, this._euler.z);
        Quat.slerp(qt_1, this.node.rotation, qt_1, dt / this.damp);
        this.node.setRotation(qt_1);

    }

}
