import { _decorator, Component, Node, Prefab,Vec3, instantiate, v3, ModelComponent, Color } from 'cc';
import { CubeCellComponent } from './CubeCellComponent';
import { Painter } from '../Painting/Painter';
import { PaintConfig } from '../Painting/PaintConfig';
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
    @property(Prefab)
    cellPrefab:Prefab = null;

    interval:number = 1;

    @property
    cubeLength:number = 1;

    @property
    intervalFactor:number = 0.1;


    cubeCellNodes:Node[][][] = new Array<Array<Array<Node>>>();

    cubeCellComponents:CubeCellComponent[][][] = new Array<Array<Array<CubeCellComponent>>>();

    

    // onLoad () {}

    start () {
        
        this.GenerateCells(10);

    }

    public GenerateCells(rank:number){
        if(rank > 10) 
        {
            console.log("阶数超过限制，按最大阶数10生成");
            rank = 10;
        }

        //z轴临时一维数组
        
        //xz平面临时二维数组
        

        this.cubeCellNodes = new Array()
            
        let startPosition:Vec3;
        let intervlNum = rank - 1;


            let distance = (rank/2 - 0.5)*this.cubeLength + intervlNum/2 * this.intervalFactor * this.cubeLength;
            startPosition = v3(-1* distance,-1* distance,-1* distance);
        
        
        let instancePosition:Vec3 = v3(startPosition);
        for(let y = 0; y < rank; y++ )//沿Y轴生成cell层
        {
            let arr_xz = [];//结点的临时数组
            let arr_xz_comp = [];//组件的临时数组
            for(let x = 0; x < rank; x++)//生成x-z平面 按x轴增加
            {
                let arr_z = [];
                let arr_z_comp = [];
                for(let z = 0; z < rank; z++)
                {
                    
                    let newCell = this.InstantiateCell(instancePosition);

                    instancePosition.z+= this.cubeLength + this.interval;
                    //按层记录Cells
                    arr_z[z] = newCell;
                    let cellCmp = newCell.getComponent(CubeCellComponent);
                    cellCmp.cellStatus.X = x;
                    cellCmp.cellStatus.Layer = y;
                    cellCmp.cellStatus.Z = z;
                    arr_z_comp[z] = cellCmp;
                    
                }
                arr_xz[x] = arr_z;
                arr_xz_comp[x] = arr_z_comp;
                instancePosition.x+=this.cubeLength + this.interval;
                instancePosition.z = startPosition.z;;

            }
            this.cubeCellNodes[y] = arr_xz;
            this.cubeCellComponents[y] = arr_xz_comp;
            instancePosition.y+= this.cubeLength + this.interval;
            instancePosition.x = startPosition.x;
            
        }


    }

    private InstantiateCell(position:Vec3):Node{
        let newCube:Node = instantiate(this.cellPrefab);//instantiate(this.cellPrefab);
        if(newCube.scale.x !== this.cubeLength)
        {
            this.cubeLength = newCube.scale.x;
        }
        if(this.interval !== this.cubeLength * this.intervalFactor)
        {
            this.interval = this.cubeLength*this.intervalFactor;
        }
        //console.log(newCube.name);
        this.node.addChild(newCube);

        newCube.setPosition(position);

         
        return newCube;
    }

    public OnCellPainted(paintConfig:PaintConfig){
        let cell = this.cubeCellComponents[paintConfig.Layer][paintConfig.X][paintConfig.Z];
        cell.OnPainted(paintConfig.Color,paintConfig.NoteName);
        
    }

    public OnCellErased(paintConfig:PaintConfig){
        let cell = this.cubeCellComponents[paintConfig.Layer][paintConfig.X][paintConfig.Z];
        cell.OnErased();
        
    }

    // update (dt) {}
}


