import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;


export class Dictionary<V> {
  keys:string[] = [];
  items: {[key:string]:V};
  constructor() {
    this.items = {};
  }
  public has(key: string): boolean {
      //console.log("have :" + this.items[key] === undefined ? false:true);
    return (this.items[key]) === undefined ? false:true;
  }
  public set(key: string, val: V) {
    if(this.has(key) === false)
    this.keys.push(key);

    this.items[key] = val;
  }
  public delete(key: string): boolean {
    if (this.has(key)) {
      this.keys.splice(this.keys.indexOf(key));
      delete this.items[key];
      return true;
    }
    return false;
  }
  public get(key: string): V {
    return this.has(key) ? this.items[key] : undefined;
  }
  public getValues(): V[] {
    let values: V[] = [];
    for (let k in this.items) {
      if (this.has(k)) {
        values.push(this.items[k]);
      }
    }
    return values;
  }

  public getKeys():string[]{
    return this.keys;
  }

  public clear(){
    this.items = {};
  }
}
