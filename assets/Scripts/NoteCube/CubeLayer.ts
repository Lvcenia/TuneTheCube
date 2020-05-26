import { _decorator, Component, Node, Color, Vec3, NodePool, v3, instantiate } from 'cc';
import { CubeCellComponent } from './CubeCellComponent';
import { CubeManager } from './CubeManager';
import { MessageManager } from '../MessageSystem/MessageManager';
import { PaintMessages } from '../UI/PainterWidget/PainterWidget';
import { CellStatus } from './CellStatus';
import { AudioMessages } from '../Triggers/TriggerManager';
const { ccclass, property } = _decorator;

export const LayerConfig = {
    MaxRank:10
} 

export let CellNodePool:NodePool = new NodePool("cells");

@ccclass('CubeLayer')
export class CubeLayer extends Component {

    public LayerIndex:number;

    private cellMatrix:CubeCellComponent[][];

    private cellColors:Color[][];

    private cellStatusArr:CellStatus[][];

    private rank:number = 0;

    public intervalFactor:number = 1;

    public cubeLength:number;

    public hasFirstBuilt:boolean = false;
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    onLoad(){
        MessageManager.getInstance().Register(PaintMessages.SwitchLayer,this.OnLayerSelected,this);
        
    }

    start () {
        // Your initialization goes here.
        if(!this.hasFirstBuilt)
        this.initChildrenArrays();

    }



    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }

    initChildrenArrays(){
        this.cellMatrix = new Array<Array<CubeCellComponent>>(LayerConfig.MaxRank);
        for(let i = 0; i <this.cellMatrix.length; i++)
        {
            this.cellMatrix[i] = new Array<CubeCellComponent>(LayerConfig.MaxRank);
        }

        this.cellColors = new Array<Array<Color>>(LayerConfig.MaxRank);
        for(let i = 0; i < LayerConfig.MaxRank; i++)
        {
            this.cellColors[i] = new Array<Color>(LayerConfig.MaxRank);
        }
        this.cellStatusArr = new Array<Array<CellStatus>>(LayerConfig.MaxRank);
        for(let i = 0; i < LayerConfig.MaxRank; i++)
        {
            this.cellStatusArr[i] = new Array<CellStatus>(LayerConfig.MaxRank);
        }
    }


    RemoveCell(x:number,z:number){
        this.cellMatrix[x][z] = null;
        this.cellColors[x][z] = null;


    }


    SetCubeFormats(cubeLength:number,intervalFactor:number){
        this.cubeLength = cubeLength;
        this.intervalFactor = intervalFactor;
    }


    FirstBuildLayer(rank:number){
        let startPosition:Vec3;
        let intervlNum = rank - 1;


        let distance = (rank/2 - 0.5)*this.cubeLength + intervlNum/2 * this.intervalFactor * this.cubeLength;
        startPosition = v3(-1* distance,0,-1* distance);
        let instancePosition:Vec3 = v3(startPosition);
        let deltaPosition = this.cubeLength*(1+this.intervalFactor);

        //填充这一层的cells
        for(let x = 0; x < rank;x++)
        {
            for (let z = 0; z <rank; z++)
            {
                //创建结点
                let cellNode = CubeManager.getInstance().getCellNode();
                let cellCmp = cellNode.getComponent(CubeCellComponent);

   
                //记录组件和颜色引用
                this.cellMatrix[x][z] = cellCmp;
                this.cellColors[x][z] = cellCmp.cellStatus.Color;
                this.cellStatusArr[x][z] = cellCmp.cellStatus;

                //添加子节点 修改位置
                this.ArrangeCellPosition(cellNode,instancePosition);
 
                instancePosition.z+= deltaPosition;
                //更新方块内部信息
                cellCmp.cellStatus.X = x;
                cellCmp.cellStatus.Layer = this.LayerIndex;
                cellCmp.cellStatus.Z = z;
                
            }
            instancePosition.x+= deltaPosition;
            instancePosition.z = startPosition.z;
        }
        this.rank = rank;
        this.hasFirstBuilt = true;
        console.log(this.cellMatrix);
        
    }

    PaintCell(paintConfig){
        console.log("In Layer",this.LayerIndex,paintConfig);
        
        let cell = this.cellMatrix[paintConfig.X][paintConfig.Z];
        cell.OnPainted(paintConfig.Color,paintConfig.NoteName);
    }

    EraseCell(paintConfig){
        let cell = this.cellMatrix[paintConfig.X][paintConfig.Z];
        cell.OnErased();
    }

    ReBuildLayer(newRank:number){
        let startPosition:Vec3;
        let intervlNum = newRank - 1;


        let distance = (newRank/2 - 0.5)*this.cubeLength + intervlNum/2 * this.intervalFactor * this.cubeLength;
        startPosition = v3(-1* distance,0,-1* distance);
        let instancePosition:Vec3 = v3(startPosition);

        let deltaPosition = this.cubeLength*(1+this.intervalFactor);

        //不是第一次构建 且没改变Rank 直接返回
        if(newRank === this.rank)
        return;


        //如果新的rank比原来的小 就需要在每一维度都放回一些
        if(newRank < this.rank)
        {
                for(let x = 0 ; x < this.rank; x++)
                {
                    for(let z = 0 ; z < this.rank; z++)
                    {
                        let cellCmp = this.cellMatrix[x][z];
                        let Cell:Node = cellCmp.node;
                        //任意一维超过了新的rank 就把它放回去
                        if(x >= newRank  || z >= newRank )
                        {
                            CubeManager.getInstance().RemoveCell(Cell);
                            this.cellStatusArr[x][z] = null;
                            this.cellColors[x][z] = Color.WHITE;
                            this.cellMatrix[x][z] = null;
                        }
                        else {
                            //记录Cells
                            this.ArrangeCellPosition(Cell,instancePosition);
                            cellCmp.cellStatus.X = x;
                            cellCmp.cellStatus.Layer = this.LayerIndex;
                            cellCmp.cellStatus.Z = z;
                            instancePosition.z+= deltaPosition;

                        }
                    }
                    instancePosition.x+=deltaPosition;
                    instancePosition.z = startPosition.z;;
                }

        }


        //反之 需要在每个维度再取出若干个
        else if(newRank > this.rank)
        {

                for(let x = 0 ; x < newRank; x++)
                {
                    for(let z = 0 ; z < newRank; z++)
                    {
                        let newCell:Node;
                        let cellCmp:CubeCellComponent;
                        if(x >= this.rank || z >= this.rank)
                        {
                            newCell = CubeManager.getInstance().getCellNode();
                            cellCmp = newCell.getComponent(CubeCellComponent);
                            this.cellMatrix[x][z] = cellCmp;
                            this.cellStatusArr[x][z] = cellCmp.cellStatus;

                        } else {
                            
                            cellCmp = this.cellMatrix[x][z];
                            newCell = cellCmp.node;
                        }
                            this.ArrangeCellPosition(newCell,instancePosition);
                            instancePosition.z+= deltaPosition;
                            cellCmp.cellStatus.X = x;
                            cellCmp.cellStatus.Layer = this.LayerIndex;
                            cellCmp.cellStatus.Z = z;
                    }
                    instancePosition.x+=deltaPosition;
                    instancePosition.z = startPosition.z;;
                }
            }

            //修改自身存储的rank值
            this.rank = newRank;
}

    private ArrangeCellPosition(cell:Node,position:Vec3){
        cell.parent = this.node;
        cell.setPosition(position);
    }

    public BuildLayer(rank:number){
        if(this.hasFirstBuilt === false){
            this.FirstBuildLayer(rank);
        }
        else
            this.ReBuildLayer(rank);
    }

    OnLayerSelected(LayerIndex:number){
        if (this.LayerIndex === LayerIndex){
            this.node.setPosition(1.5,this.node.position.y,this.node.position.z);
            CubeManager.getInstance().currentLayerIndex = this.LayerIndex;
            MessageManager.getInstance().Send(PaintMessages.LayerSwitched,this.LayerIndex,this.cellStatusArr);
            //this.node.setRotation(0,45,0,0);
        } 
        else {
            this.node.setPosition(0,this.node.position.y,this.node.position.z);
            this.node.setRotation(0,0,0,0);
        }
    }

    PlayLayerAudios(deltaTime:number){

        let x = 0;
        let z = 0;
        let isInited:boolean = false;

        
        let playList:CubeCellComponent[] = [];

        for(let x = 0;x <this.rank; x++)
        {
            for (let z = 0; z <this.rank;z++)
            {
                    playList.push(this.cellMatrix[x][z]);
            }
        }

        let i = 0;
        if(playList.length === 0) return;

        let ID = setInterval(()=> {
            playList[i].OnTriggered();
            i++;

            if(i >= playList.length)
            {
                MessageManager.getInstance().Send(AudioMessages.LayerPlayEnded,this.LayerIndex);
                clearInterval(ID);
            }
        },deltaTime);


    }

 
}
