import { _decorator, Component, Node, Prefab,Vec3, instantiate, v3, ModelComponent, Color, NodePool, math } from 'cc';
import { CubeCellComponent } from './CubeCellComponent';
import { Painter } from '../Painting/Painter';
import { PaintConfig } from '../Painting/PaintConfig';
import { MessageManager } from '../MessageSystem/MessageManager';
import { PaintMessages } from '../UI/PainterWidget/PainterWidget';
import { CubeLayer, CellNodePool } from './CubeLayer';
const { ccclass, property } = _decorator;

/**所有子方块的父节点，在生成时位于整个大方块的左下角 
 * 方块分层都是基于Y轴的
 * 绘画时 原点在左上角 x-z坐标系（相当于俯视标准状态的cube）
 * (0,0)----------------------------------------------->x
 * |
 * |
 * |
 * |
 * |
 * |
 * |
 * |
 * |
 * |
 * |
 * |
 * |
 * |
 * z
*/

@ccclass('CubeManager')
export class CubeManager extends Component {

    private static instance:CubeManager;

    @property
    public static MaxRank:number = 10;


    @property(Prefab)
    cellPrefab:Prefab = null;

    @property(Prefab)
    layerPrefab:Prefab = null;

    interval:number = 0.1;

    @property
    Rank:number = -1;

    @property
    cubeLength:number = 1;

    @property
    intervalFactor:number = 0.01;

    Layers:CubeLayer[] = new Array<CubeLayer>();

    currentLayerNumber:number = 0;

    currentLayerIndex:number = 0;


    cellNodePool:NodePool = CellNodePool;

    layerPool:NodePool = new NodePool("layers");

    //作为是否已经构建过
    private hasFirstBuild:boolean = false;

    public static getInstance():CubeManager{
        return CubeManager.instance;
    }
    

    onLoad () {
        CubeManager.instance = this;
        MessageManager.getInstance().Register(PaintMessages.ChangeRank,this.BuildCellArrWithRank,this);
        
    }

    start () {
        this.BuildPoolandArrs();
        //this.GenerateCells(this.Rank);
        //this.BuildCellArrWithRank(this.Rank);
        
    }

    /**新建一个结点 */
    public getCellNode():Node{
        if(this.cellNodePool.size()>0)
        return this.cellNodePool.get();
        else return instantiate(this.cellPrefab);
    }

    public OnCellPainted(paintConfig:PaintConfig){
        this.Layers[paintConfig.Layer].PaintCell(paintConfig);
        
    }

    public OnCellErased(paintConfig:PaintConfig){
        this.Layers[paintConfig.Layer].EraseCell(paintConfig);
    }

    /**在初始化的时候统一创建1000个cell并且入池 */
    private BuildPoolandArrs(){
        //建立layer节点池
        for(let i = 0 ; i < 20; i++)
        {
            console.log("实例化图层");
            
            let layer:Node = instantiate(this.layerPrefab);
            this.layerPool.put(layer);
        }

        //统一创建最大可能数量的结点
        for(let i = 0 ; i < CubeManager.MaxRank*CubeManager.MaxRank*CubeManager.MaxRank; i++)
        {
            console.log("实例化方块");
            let newCube:Node = instantiate(this.cellPrefab);//instantiate(this.cellPrefab);
            this.cellNodePool.put(newCube);
        }

        

    }


    /**根据新的Rank值重新构建方块体 */
    public BuildCellArrWithRank(newRank:number){
        if(newRank > CubeManager.MaxRank) 
        {
            console.log("阶数超过限制，按最大阶数10生成");
            newRank = CubeManager.MaxRank;
        }

        this.ClearAllLayers();

        for(let y = 0; y < newRank; y++)
        {
            this.AddCubeLayer(y,newRank);
        }
    }

    public RemoveCell(cell:Node){
        this.cellNodePool.put(cell);
       
    }

    private ClearAllLayers(){
        for(let y = this.Layers.length -1 ; y >= 0 ; y--)
        {
            this.RemoveCubeLayer(y);
        }
    }

    private AdjustLayerPosition(Layer:CubeLayer,layerIndex:number){
        let intervlNum = this.currentLayerNumber - 1;
        let bottomPositionY = -1 * ((this.currentLayerNumber/2 - 0.5)*this.cubeLength + intervlNum/2 * this.intervalFactor * this.cubeLength);
        let targetPositionY = bottomPositionY + layerIndex * (this.cubeLength*(1+this.intervalFactor));
        Layer.node.parent = this.node;
        Layer.node.setPosition(0,targetPositionY,0);
    }

    private instantiateLayer():Node{
        if(this.layerPool.size()>0)
        return this.layerPool.get();
        else return instantiate(this.layerPrefab);
    }


    public AddCubeLayer(layerIndex:number,rank:number){
        this.currentLayerNumber += 1;
        if(this.currentLayerNumber > 20)
        {
            console.log("已达到上限20层");
            return;
        }

        if(layerIndex <= this.currentLayerIndex )
        {
            this.currentLayerIndex++;
        }

        let newLayerNode = this.instantiateLayer();
        let newLayer = newLayerNode.getComponent(CubeLayer);
        newLayer.start();
        newLayer.LayerIndex = layerIndex;
        this.Layers.splice(layerIndex,0,newLayer);

        newLayer.SetCubeFormats(this.cubeLength,this.intervalFactor);

        //填充
        newLayer.BuildLayer(rank);

        this.UpdateLayerIndexes();
        //调整所有layer位置
        for(let i = 0;i < this.currentLayerNumber;i++)
        {
            let l = this.Layers[i];
            console.log(i);
            
            this.AdjustLayerPosition(l,i);
        }

        MessageManager.getInstance().Send("LayerAdded",layerIndex);


    }

    public RemoveCubeLayer(layerIndex:number){

        console.log("正在移除",layerIndex,"总数",this.currentLayerNumber,"长度",this.Layers.length);
        
        this.currentLayerNumber -= 1;
        if(layerIndex <= this.currentLayerIndex)
        {
            this.currentLayerIndex -= 1;
        }
        this.layerPool.put(this.Layers[layerIndex].node);
        this.Layers.splice(layerIndex,1);

        this.UpdateLayerIndexes();

    }

    UpdateLayerIndexes()
    {
        for(let i = 0; i < this.Layers.length; ++i)
        {
            this.Layers[i].LayerIndex = i;
        }
    }


}


