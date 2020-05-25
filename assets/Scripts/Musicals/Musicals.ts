import { _decorator, Component, Node, Color } from 'cc';
import { Dictionary } from '../Generics/XDictionary';
const { ccclass, property } = _decorator;



/**这个文件包含一些音乐概念相关的数据结构和函数的定义 */

/**所有的音符 值是字符串  */
export const Notes = {
    "C":"C",
    "C#":"C#",
    "Db":"Db",
    "D":"D",
    "D#":"D#",
    "Eb":"Eb",
    "E":"E",
    "F":"F",
    "F#":"F#",
    "Gb":"Gb",
    "G":"G",
    "G#":"G#",
    "Ab":"Ab",
    "A":"A",
    "A#":"A#",
    "Bb":"Bb",
    "B":"B"

}

/**同音不同名的转换 */
export const NoteNameConvert = {
    "Db":"C#",
    "Eb":"D#",
    "Gb":"F#",
    "Ab":"G#",
    "Bb":"A#",

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
        let newArr = [];
        for(let i = 0; i < source.Notes.length; ++i)
        {
            newArr.push(source.Notes[i]);
        }
        let s = new NoteScale(source.Name,newArr);
        let keys = source.ScaleNoteColorDictionary.getKeys();

        for(let i = 0; i < keys.length; ++i)
        {
            let origColor = source.ScaleNoteColorDictionary.get(keys[i]);
            let copyColor:Color = new Color(origColor.r,origColor.g,origColor.b,origColor.a);

            s.ScaleNoteColorDictionary.set(keys[i],copyColor);
        }

        return s;

    }
}