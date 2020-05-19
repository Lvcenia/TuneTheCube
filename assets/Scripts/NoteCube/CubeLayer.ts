import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export const LayerConfig = {
    MaxRank:10
} 

@ccclass('CubeLayer')
export class CubeLayer extends Component {

    private LayerID:number;

    private CellMatrix:Node[][];
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    onLoad(){
        this.CellMatrix = new Array<Array<Node>>();
    }

    start () {
        // Your initialization goes here.
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
