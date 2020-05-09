import { _decorator, Component, Node, Color } from 'cc';
import { Dictionary } from '../Generics/XDictionary';
const { ccclass, property } = _decorator;



/**这个文件包含一些音乐概念相关的数据结构和函数的定义 */

/**所有的音符 值是字符串 字符串的实际值统一用升号 */
export const Notes = {
    "C":"C",
    "C#":"C#",
    "Db":"C#",
    "D":"D",
    "D#":"D#",
    "Eb":"D#",
    "E":"E",
    "F":"F",
    "F#":"F#",
    "Gb":"F#",
    "G":"G",
    "G#":"G#",
    "Ab":"G#",
    "A":"A",
    "A#":"A#",
    "Bb":"A#",
    "B":"B"

}

/**音阶数据类 */
export class NoteScale {
    constructor(name:string,notes:string[])
    {
        this.Name = name;
        this.Notes = notes;
        this.KeyNote = this.Notes[0];
        this.ScaleNoteColorDictionary = new Dictionary<Color>();

    }

    /**调名 */
    public Name:string = "default";
    /**音阶 */
    public Notes:string[] = [];
    /**主音 取音阶第一个 */
    public KeyNote:string = "";
    /**调内每一个音对应的颜色字典 */
    public ScaleNoteColorDictionary:Dictionary<Color>;

    public static Copy(source:NoteScale):NoteScale{
        let s = new NoteScale(source.Name,source.Notes);
        let keys = source.ScaleNoteColorDictionary.getKeys();
        for(let i = 0; i < keys.length; ++i)
        {
            s.ScaleNoteColorDictionary.set(keys[i],source.ScaleNoteColorDictionary.get(keys[i]));
        }
        return s;

    }
}