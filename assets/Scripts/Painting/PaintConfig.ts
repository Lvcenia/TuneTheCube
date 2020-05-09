import { _decorator, Component, Node ,Color} from 'cc';
const { ccclass, property } = _decorator;

/**这个类是绘制时前端向后端传递的绘制参数 包含层、x、y、颜色 */

export class PaintConfig  {
    constructor(layer:number,x:number,z:number,color:Color,keyname:string,notename:string)
    {
        this.Layer = layer;
        this.X = x;
        this.Z = z;
        this.Color = color;
        this.KeyName = keyname;
        this.NoteName = notename;
    }
    public Layer:number;
    public X:number;
    public Z:number;
    public KeyName:string;
    public NoteName:string;
    public Color:Color;
}
