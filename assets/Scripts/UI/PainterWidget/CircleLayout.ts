import { _decorator, Component, Node, Vec2, math, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CircleLayout')
export class CircleLayout extends Component {
    /**半径 */
    @property
    private radius:number = 100;
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start () {
        // Your initialization goes here.
        this.RearrangeChildPosition(12);
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }

    /**重排子节点的坐标 childNum是要被重排的个数 其他child会被隐藏 */
    public RearrangeChildPosition(childNum:number){
       let children =  this.node.children;

       for(let i = 0; i< childNum; i++){
            children[i].active = true;
            children[i].setPosition(this.calcChildPosition(i,childNum));
       }

       for(let i = childNum; i < children.length;i++){
           children[i].active = false;
       }


    }

    /**计算子节点位置  */
    private calcChildPosition(index:number,total:number):Vec3{
        let angle = index*2*Math.PI/total;
        let x = this.radius * Math.sin(angle);
        let y = this.radius * Math.cos(angle);

        return new Vec3(x,y,0);

    }


}
