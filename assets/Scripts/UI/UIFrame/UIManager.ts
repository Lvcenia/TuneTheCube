import { _decorator, Component, Node, NodePool, loader, Prefab, instantiate } from 'cc';
import { UIBaseWidget } from './UIBaseWidget';
import { Dictionary } from '../../Generics/XDictionary';
const { ccclass, property } = _decorator;

export const UIPrefabNames = {
    WidgetTitle:"WidgetTitle",
    LayerBox:"LayerBox",
    LayerItem:"LayerItem",
    PaintableGrid:"PaintableGrid",
    PainterWidget:"PainterWidget"
}


@ccclass("UIManager")
export class UIManager extends Component {

    private static _instance: UIManager;

    public static getInstance() : UIManager{
        return this._instance;
    }

    /**当前已经打开的窗口堆栈 */
    private widgetStack:UIBaseWidget[] = [];

    /**UI相关prefab的对象池 */
    private nodePoolsDictionary:Dictionary<NodePool> = new Dictionary<NodePool>();

   

    @property({type:[Prefab]})
    private prefabs:Prefab[] = [];

    onLoad()
    {
        console.log("初始化UIManager");
        UIManager._instance = this;
        this.initWidgetPools();
    }

    start(){

    }
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    private initWidgetPools(){
        for(let i = 0; i < this.prefabs.length && this.prefabs[i] !== null ; i++ )
        {
            this.nodePoolsDictionary.set(this.prefabs[i].data.name,this.createPool(this.prefabs[i]));
        }
    }

    private createPool(prefab:Prefab):NodePool{
        //console.log(prefab.data.name);
        let num:number = 1;
        if(prefab.data.name === UIPrefabNames.PaintableGrid)
          num = 100;
        if(prefab.data.name === UIPrefabNames.WidgetTitle)
          num = 6;
        if(prefab.data.name === UIPrefabNames.LayerItem)
          num = 10;

        let pool:NodePool = new NodePool(prefab.data.name);

        for(let i = 0; i <num; i++)
        {
            console.log(prefab.data.name)
            pool.put(instantiate(prefab));
        }

        return pool;

    }

    public GetWidgetPool(poolName:string):NodePool{
        if(this.nodePoolsDictionary.has(poolName)){
            return this.nodePoolsDictionary.get(poolName);
        } else return null;

    }

    



    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
