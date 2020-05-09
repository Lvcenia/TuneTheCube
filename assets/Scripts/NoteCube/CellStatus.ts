import { _decorator, Color } from 'cc';
const { ccclass, property } = _decorator;

export class CellStatus{
    constructor(){

    }
    public CellID:string = "";
    public Layer:number = 0;
    public X:number = 0;
    public Z:number = 0;
    public Color:Color = Color.WHITE;
    public NoteName:string = "";
    public isPlaying:boolean = false;
    public isPainted:boolean = false;
    public isRepeatable:boolean = false;
    public InstrumentType = "Piano";
}