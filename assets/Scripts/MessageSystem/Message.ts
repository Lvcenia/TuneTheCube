// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
// import { _decorator, Component, Node } from 'cc';
// const { ccclass, property } = _decorator;

//     /**
//      * 游戏事件的消息列表，请使用类似下面的命名方式
//      */

// export const GameEventMsg = {
//     Game_Started : "Game_Started",
    

// }
//   /**
//    * UI操作的消息列表，请使用类似下面的命名方式,注意逗号和空行
//    */
// export const UIEventMsg = {
//     StartButton_Pressed:"StratButton_Pressed",



// }

// /**
//  * 定义消息回调函数
//  */
// export interface  MessageCallback{
// 	(param1?:any,param2?:any,param3?:any): any;
// }

// /**
//  * 消息数据类
//  */
// export class Message {
//     constructor(name:string,data:any){
//         this.MessageName = name;
//         //console.log("构造 " + this.MessageName);
//         this.Data = data;
//         //console.log("构造 " +this.Data);
//     }
//     public MessageName :string;
//     public Data: any;
// }
