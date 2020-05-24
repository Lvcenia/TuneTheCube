import { _decorator, Component, Node } from 'cc';
import { UIBaseWidget } from '../UIFrame/UIBaseWidget';
const { ccclass, property } = _decorator;

export const PageType = {
    Paint:"Paint",
    Scales:"Scales",
    Ranks:"Ranks",
    Settings:"Settings",
    Triggers:"Triggers"
}

@ccclass('MainWidgetContainer')
export class MainWidgetContainer extends UIBaseWidget {


    private currentPage:string = PageType.Paint;

    @property([Node])
    private widgets:Node[] = new Array<Node>();

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

    ShowPage(btn,pageIndex:number){
        for(let i = 0; i < 5; i ++)
        {
            let widget = this.widgets[i];
            if(!widget) break;

            if(i == pageIndex)
            {
                widget.active = true;
            }
            else widget.active = false;
        }
        super.Show();
    }
}
