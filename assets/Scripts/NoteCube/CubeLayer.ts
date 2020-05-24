import { _decorator, Component, Node, Color } from 'cc';
const { ccclass, property } = _decorator;

export const LayerConfig = {
    MaxRank:10
} 

@ccclass('CubeLayer')
export class CubeLayer extends Component {

    private LayerID:number;

    private cellMatrix:Node[][];

    private cellColors:Color[][];

    private rank:number = 0;
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    onLoad(){
        this.cellMatrix = new Array<Array<Node>>(LayerConfig.MaxRank);
        for(let i = 0; i < LayerConfig.MaxRank; i++)
        {
            this.cellMatrix[i] = new Array<Node>(LayerConfig.MaxRank);
        }

        this.cellColors = new Array<Array<Color>>(LayerConfig.MaxRank);
        for(let i = 0; i < LayerConfig.MaxRank; i++)
        {
            this.cellColors[i] = new Array<Color>(LayerConfig.MaxRank);
        }
    }

    start () {
        // Your initialization goes here.
    }

    SetLayerInfo(ID:number,rank:number){

    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
