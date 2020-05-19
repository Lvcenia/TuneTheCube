import { _decorator, Component, Node, Vec2, math, Vec3, Prefab, instantiate } from 'cc';
import { MessageManager } from '../../MessageSystem/MessageManager';
import { PaintMessages } from './PainterWidget';
import { NoteScale } from '../../Musicals/Musicals';
import { PaletteGrid } from './PaletteGrid';
const { ccclass, property } = _decorator;

@ccclass('ColorSelectRing')
export class ColorSelectRing extends Component {
    /**半径 */
    @property
    private radius:number = 100;
    
    @property(Prefab)
    paletteGridPrefab:Prefab = null;

   @property([PaletteGrid])
    private paletteGrids:PaletteGrid[] = new Array<PaletteGrid>(12);

    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    onLoad(){

        
        MessageManager.getInstance().Register(PaintMessages.OctavedCurScaleUpdated,this.onScaleChanged,this);
    }

    start () {
        // Your initialization goes here.
        
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }

    onScaleChanged(scale:NoteScale)
    {
        let notes = scale.Notes;

        for(let i = 0; i < notes.length; i++)
        {
            this.paletteGrids[i].updateNoteInfo(notes[i],scale.ScaleNoteColorDictionary.get(notes[i]));
        }
        this.RearrangeChildPosition(notes.length);

        
    }


    /**重排子节点的坐标 childNum是要被重排的个数 其他child会被隐藏 */
    public RearrangeChildPosition(childNum:number){
       
       console.log("in colorRing Rearranging " + childNum);
       for(let i = 0; i< childNum; i++){
            this.paletteGrids[i].node.active = true;
            this.paletteGrids[i].node.setPosition(this.calcChildPosition(i,childNum));
       }

       for(let i = childNum; i < 12; i++){
        this.paletteGrids[i].node.active = false;
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
