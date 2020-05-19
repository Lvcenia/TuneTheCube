import { _decorator, Component, Node, NodePool } from 'cc';
import { UIBaseWidget } from '../UIFrame/UIBaseWidget';
const { ccclass, property } = _decorator;

@ccclass('LayerBoxWidget')
export class LayerBoxWidget extends UIBaseWidget {

    @property(NodePool)
    private itemNodePool:NodePool = null;
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
}
