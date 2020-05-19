import { _decorator, Component, Node, SliderComponent, Color } from 'cc';
import { NoteScale } from '../../Musicals/Musicals';
const { ccclass, property } = _decorator;

@ccclass('ColorSelector')
export class ColorSelector extends Component {
    private currentNote:string;
    private currentColor:Color;

    
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
    onScaleChanged(toScale:NoteScale){

    }
}
