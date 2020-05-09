
import * as MSG  from "./Message"
//import { Dictionary } from "../Generics/Dictionary";


import { _decorator, Component, Node } from 'cc';
import { Dictionary } from "../Generics/XDictionary";
const { ccclass, property } = _decorator;



class CallbackStoreStruct {
    constructor(callback:MSG.MessageCallback,caller:any){
        this.Callback = callback;
        this.Caller = caller;
    }
    Callback:MSG.MessageCallback;
    Caller:any
}

export class MessageManager {
    constructor(){
        console.log("初始化MessageManager");
        
    }
  
    private static _instance: MessageManager = new MessageManager();
    private messageDict:Dictionary<CallbackStoreStruct[]> = new Dictionary<CallbackStoreStruct[]>();//注册的消息字典,键是消息名字，值是对应的回调数组
    private callbacksCallerDict:Dictionary<any> = new Dictionary<any>();
    private showDebugMessages:boolean = false;
    public static getInstance() : MessageManager{
        return this._instance;
    }

    /**
     * 注册一个消息回调，参数是消息名称和消息回调 
     * 填消息回调的时候记得写第三个参数this
             */
    public Register(msgName:string,callback:MSG.MessageCallback,caller:any = null) {
        if(this.showDebugMessages)
        console.log("注册" + msgName);
        var newCBKstruct = new CallbackStoreStruct(callback,caller);
        if(this.messageDict.has(msgName)){
            var callbacks = this.messageDict.get(msgName);
            if(callbacks.indexOf(newCBKstruct) === -1)//回调不存在，插入
            {
                callbacks.push(newCBKstruct);
                this.callbacksCallerDict.set(callback.toString(),caller);
            }
        } else {
            var callbacks: CallbackStoreStruct[] = [newCBKstruct];
            this.messageDict.set(msgName,callbacks); 
            this.callbacksCallerDict.set(callback.toString(),caller);
        }
    }
    /**
     * 发送一个消息，参数是消息名称和你要附加的数据
     * 所有绑定到这个消息的回调函数都会传入你填入的data参数然后执行
     * 如果没有数据 可以不填 默认是null
             */
    public Send(msgName:string,param1?:any,param2?:any,param3?:any){
        //this.eventTarget.emit(msgName,new GameMessage.Message(msgName,data));
        if(this.showDebugMessages)
        console.log("Send" + msgName);

        var callbacks = this.messageDict.get(msgName);
        if(callbacks === undefined){
            console.log(`消息${msgName}没有绑定回调`);
            return
            } 
            callbacks.forEach(callback => {
                callback.Callback.call(callback.Caller,param1,param2,param3);
              });
        
    }
        /**
     * 移除一个已经注册的消息回调，参数是消息名称和消息回调
     * 如果不填回调，就移除该消息的所有回调
     * 请注意，对于非常驻的监听，一定要在适当的位置移除，否则可能会导致游戏物体已经删除
     * 但仍然保留了监听的情况
             */
    public Drop(msgName:string,callback:MSG.MessageCallback = null){
        //this.eventTarget.off(msgName,callback);
        var callbacks = this.messageDict.get(msgName);
        if(callbacks === undefined) {
            console.log(`消息${msgName}回调组不存在`)
            return false;
        }
        if(callback === null) {
            console.log("没有提供回调，删除消息下的全部回调函数");
            this.messageDict.delete(msgName);
            return true;
        }

        var index = -1;
        //console.log("试图删除：" + callback.toString());
        for(let i = 0; i <callbacks.length; i++){
            if(callbacks[i].Callback = callback) index = i;break;
        }
        if(index === -1){//如果不存在这个函数，就返回
             console.log(callback.toString()+ "回调不存在");return false;
        } 

        if(this.showDebugMessages)
        console.log("回调存在 删除" + index);

        callbacks.splice(index,1);
        if(callbacks.length === 0){//如果删完以后没有回调了，就删掉这个消息
            this.messageDict.delete(msgName);
        } else {//否则更新回调数组
            this.messageDict.set(msgName,callbacks);
        }
        return true;
        
    }

    /**
     * 清空所有注册过的消息,场景切换之前调用一下
     */
    public Clear(){
        this.messageDict.clear();
    }

    public setShowDebugLog(showDebug:boolean){
        this.showDebugMessages = showDebug;
    }


}
