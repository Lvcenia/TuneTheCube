import { _decorator, Component, Node, NodePool, ScrollViewComponent, UITransformComponent, math, v3, v2, Vec2, Vec3 } from 'cc';
import { UIBaseWidget } from '../UIFrame/UIBaseWidget';
import { MessageManager } from '../../MessageSystem/MessageManager';
import { PaintMessages } from '../PainterWidget/PainterWidget';
const { ccclass, property } = _decorator;

@ccclass('LayerBoxWidget')
export class LayerBoxWidget extends UIBaseWidget {

    @property(NodePool)
    private itemNodePool:NodePool = null;

    @property(UITransformComponent)
    private ListLayoutTrans:UITransformComponent = null;

    @property(ScrollViewComponent)
    private scrollView:ScrollViewComponent = null;

    private currentItem:Node = null;

    private totalOffset:number = 0;

    private ItemHeight:number = 0;
    
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    onLoad(){
        this.scrollView.node.on(ScrollViewComponent.EventType.SCROLL_BEGAN,this.OnScrollBegan,this);
        this.scrollView.node.on(ScrollViewComponent.EventType.SCROLLING, this.OnScrolling, this);
        this.scrollView.node.on(ScrollViewComponent.EventType.SCROLL_ENG_WITH_THRESHOLD, this.OnScrollEnd_Threshold, this);
    }

    start () {
        
        // Your initialization goes here.
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
    public AddLayer(){

    }

    public DeleteLayer(){
        
    }

    public OnScrollBegan(scroll:ScrollViewComponent){
        this.totalOffset = scroll.getMaxScrollOffset().y;
        console.log("Max Capability: ",this.totalOffset);
        this.ItemHeight = scroll.content.children[0].getComponent(UITransformComponent).contentSize.y;

        

    }

    public OnScrolling(scroll:ScrollViewComponent){
        let curOfsY:number = scroll.getScrollOffset().y;
        if(curOfsY <= this.ItemHeight/2)
        {
            this.SelectLayer(0);
        }
        else {
            this.SelectLayer(Math.ceil((curOfsY-30)/this.ItemHeight)); 
        }
        
        
        

    }

    public OnScrollEnd_Threshold(scroll:ScrollViewComponent){
        console.log("Ended_Threshold");
        let curOfsY:number = scroll.getScrollOffset().y;
        //如果在顶部范围内，滚动到顶部
        if(curOfsY <= this.ItemHeight/2)
        {
            scroll.scrollTo(v2(0,0),1);
        }
        else {
            let toUnitNum = Math.ceil((curOfsY-30)/this.ItemHeight);
            let ofs = toUnitNum * this.ItemHeight;
            let perccentage = ofs/this.totalOffset;
            scroll.scrollTo(v2(0,0.5),1);
            
        }
    }

    public SelectLayer(layer:number){
        MessageManager.getInstance().Send(PaintMessages.SwitchLayer,layer);
    }

    
    
}
