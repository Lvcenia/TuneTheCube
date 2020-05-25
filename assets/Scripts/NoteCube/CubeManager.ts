import { _decorator, Component, Node, Prefab,Vec3, instantiate, v3, ModelComponent, Color, NodePool } from 'cc';
import { CubeCellComponent } from './CubeCellComponent';
import { Painter } from '../Painting/Painter';
import { PaintConfig } from '../Painting/PaintConfig';
import { MessageManager } from '../MessageSystem/MessageManager';
import { PaintMessages } from '../UI/PainterWidget/PainterWidget';
import { CubeLayer } from './CubeLayer';
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

    @property
    public static MaxRank:number = 10;


    @property(Prefab)
    cellPrefab:Prefab = null;

    interval:number = 0.1;

    @property
    Rank:number = -1;

    @property
    cubeLength:number = 1;

    @property
    intervalFactor:number = 0.01;

    Layers:CubeLayer[] = [];

    cubeCellNodes:Node[][][]; //= new Array<Array<Array<Node>>>();

    cubeCellComponents:CubeCellComponent[][][] = new Array<Array<Array<CubeCellComponent>>>();

    cellNodePool:NodePool = new NodePool("Cells");

    //作为是否已经构建过
    private hasFirstBuild:boolean = false;

    

    onLoad () {
        MessageManager.getInstance().Register(PaintMessages.ChangeRank,this.BuildCellArrWithRank,this);
    }

    start () {
        
        this.BuildPoolandArrs();
        //this.GenerateCells(this.Rank);
        //this.BuildCellArrWithRank(this.Rank);
        
    }

    /**新建一个结点 */
    private getCellNode():Node{
        if(this.cellNodePool.size()>0)
        return this.cellNodePool.get();
        else return instantiate(this.cellPrefab);
    }

    /**设置结点的位置 */
    private ArrangeCellPosition(cellNode:Node,position:Vec3){
        if(cellNode.scale.x !== this.cubeLength)
        {
            this.cubeLength = cellNode.scale.x;
        }
        if(this.interval !== this.cubeLength * this.intervalFactor)
        {
            this.interval = this.cubeLength*this.intervalFactor;
        }
        //console.log(newCube.name);
        this.node.addChild(cellNode);

        cellNode.setPosition(position);


    }

    public OnCellPainted(paintConfig:PaintConfig){
        let cell = this.cubeCellComponents[paintConfig.Layer][paintConfig.X][paintConfig.Z];
        cell.OnPainted(paintConfig.Color,paintConfig.NoteName);
        
    }

    public OnCellErased(paintConfig:PaintConfig){
        let cell = this.cubeCellComponents[paintConfig.Layer][paintConfig.X][paintConfig.Z];
        cell.OnErased();
        
    }

    /**在初始化的时候统一创建1000个cell并且入池 */
    private BuildPoolandArrs(){
        //统一创建最大可能数量的结点
        for(let i = 0 ; i < CubeManager.MaxRank*CubeManager.MaxRank*CubeManager.MaxRank; i++)
        {
            let newCube:Node = instantiate(this.cellPrefab);//instantiate(this.cellPrefab);
            this.cellNodePool.put(newCube);
        }

        this.cubeCellNodes = new Array<Array<Array<Node>>>(CubeManager.MaxRank);

        //初始化结点数组
        for(let y = 0; y < CubeManager.MaxRank; y++)
        {
            this.cubeCellNodes[y] = new Array<Array<Node>>(CubeManager.MaxRank);
            for(let x = 0; x < CubeManager.MaxRank ; x++)
            {
                this.cubeCellNodes[y][x] = new Array<Node>(CubeManager.MaxRank);
            }

        }

        this.cubeCellComponents = new Array<Array<Array<CubeCellComponent>>>(CubeManager.MaxRank);

        //初始化组件数组
        for(let y = 0; y < CubeManager.MaxRank;y++)
        {
            this.cubeCellComponents[y] = new Array<Array<CubeCellComponent>>(CubeManager.MaxRank);
            for(let x = 0; x < CubeManager.MaxRank ; x++)
            {
                this.cubeCellComponents[y][x] = new Array<CubeCellComponent>(CubeManager.MaxRank);
            }

        }

    }


    /**根据新的Rank值重新构建方块体 */
    public BuildCellArrWithRank(newRank:number){
        if(newRank > CubeManager.MaxRank) 
        {
            console.log("阶数超过限制，按最大阶数10生成");
            newRank = CubeManager.MaxRank;
        }

        let startPosition:Vec3;
        let intervlNum = newRank - 1;


        let distance = (newRank/2 - 0.5)*this.cubeLength + intervlNum/2 * this.intervalFactor * this.cubeLength;
        startPosition = v3(-1* distance,-1* distance,-1* distance);
        
        
        let instancePosition:Vec3 = v3(startPosition);

        //如果是第一次构建
        if(this.hasFirstBuild === false)
        {
            for(let y = 0; y < newRank; y++ )//沿Y轴生成cell层
            {
                //let arr_xz = [];//结点的临时数组
                //let arr_xz_comp = [];//组件的临时数组
                for(let x = 0; x < newRank; x++)//生成x-z平面 按x轴增加
                {
                    //let arr_z = [];
                    //let arr_z_comp = [];
                    for(let z = 0; z < newRank; z++)
                    {
                        
                        let newCell = this.getCellNode(); 
                        this.ArrangeCellPosition(newCell,instancePosition);
    
                        instancePosition.z+= this.cubeLength + this.interval;
                        //按层记录Cells
                        this.cubeCellNodes[y][x][z] = newCell;
                        let cellCmp = newCell.getComponent(CubeCellComponent);
                        cellCmp.cellStatus.X = x;
                        cellCmp.cellStatus.Layer = y;
                        cellCmp.cellStatus.Z = z;
                        this.cubeCellComponents[y][x][z] = cellCmp;
                        //arr_z_comp[z] = cellCmp;
                        
                    }
                    //arr_xz[x] = arr_z;
                    //arr_xz_comp[x] = arr_z_comp;
                    instancePosition.x+=this.cubeLength + this.interval;
                    instancePosition.z = startPosition.z;;
    
                }
                //this.cubeCellNodes[y] = arr_xz;
                //this.cubeCellComponents[y] = arr_xz_comp;
                instancePosition.y+= this.cubeLength + this.interval;
                instancePosition.x = startPosition.x;
                
            }
            this.hasFirstBuild = true;
            this.Rank = newRank;
            return;

        }

        //不是第一次构建 且没改变 直接返回
        if(newRank === this.Rank)
        return;


        //如果新的rank比原来的小 就需要在每一维度都放回一些
        if(newRank < this.Rank)
        {
            for(let y = 0 ; y < this.Rank; y++)
            {
                for(let x = 0 ; x < this.Rank; x++)
                {
                    for(let z = 0 ; z < this.Rank; z++)
                    {
                        //任意一维超过了新的rank 就把它放回去
                        if(y >= newRank  || x >= newRank  || z >= newRank )
                        {
                            this.cellNodePool.put(this.cubeCellNodes[y][x][z]);
                            this.cubeCellNodes[y][x][z] = null;
                            this.cubeCellComponents[y][x][z] = null;
                        }
                        else {
                            let newCell = this.cubeCellNodes[y][x][z]; 
                            this.ArrangeCellPosition(newCell,instancePosition);
                            instancePosition.z+= this.cubeLength + this.interval;
                            //按层记录Cells
                            
                            let cellCmp = newCell.getComponent(CubeCellComponent);
                            cellCmp.cellStatus.X = x;
                            cellCmp.cellStatus.Layer = y;
                            cellCmp.cellStatus.Z = z;

                        }
                    }
                    instancePosition.x+=this.cubeLength + this.interval;
                    instancePosition.z = startPosition.z;;
                }
                instancePosition.y+= this.cubeLength + this.interval;
                instancePosition.x = startPosition.x;
            }

        }


        //反之 需要在每个维度再取出若干个
        else if(newRank > this.Rank)
        {
            for(let y = 0 ; y < newRank; y++)
            {
                for(let x = 0 ; x < newRank; x++)
                {
                    for(let z = 0 ; z < newRank; z++)
                    {
                        let newCell:Node;
                        let cellCmp:CubeCellComponent;
                        if(y>=this.Rank || x >= this.Rank || z >= this.Rank)
                        {
                            newCell = this.getCellNode();
                            cellCmp = newCell.getComponent(CubeCellComponent);
                            this.cubeCellNodes[y][x][z] = newCell;
                            this.cubeCellComponents[y][x][z] = cellCmp;
                        } else {
                            newCell = this.cubeCellNodes[y][x][z];
                            cellCmp = newCell.getComponent(CubeCellComponent);
                        }
                            this.ArrangeCellPosition(newCell,instancePosition);
                            instancePosition.z+= this.cubeLength + this.interval;
                            cellCmp.cellStatus.X = x;
                            cellCmp.cellStatus.Layer = y;
                            cellCmp.cellStatus.Z = z;
                        
                    }
                    instancePosition.x+=this.cubeLength + this.interval;
                    instancePosition.z = startPosition.z;;
                }

                instancePosition.y+= this.cubeLength + this.interval;
                instancePosition.x = startPosition.x;
            }

        }

        //修改自身存储的rank值
        this.Rank = newRank;
    }

    test()
    {
        this.BuildCellArrWithRank(3);
    }

    public RemoveCell(cell:Node){
        this.cellNodePool.put(cell);
       
    }

    public AddCubeLayer(){

    }

    public RemoveCubeLayer(){
        
    }



    // update (dt) {}
}


