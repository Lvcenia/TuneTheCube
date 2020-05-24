import { _decorator, Component, Node, loader, AudioClip } from 'cc';
import { Dictionary } from '../Generics/XDictionary';
import { MessageManager } from '../MessageSystem/MessageManager';
const { ccclass, property } = _decorator;

export const InstrumentTypes = {
    Guitar:"guitar",
    VibratePhone:"VP",

}

@ccclass('AudioManager')
export class AudioManager extends Component {
    /* class member could be defined like this */
    // dummy = '';

    onLoad(){
        this.loadAllAudioClips();
    }
    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    //用来给方块引用的全局静态音频索引
    public static AudioIndex:Dictionary<AudioClip> = new Dictionary<AudioClip>();

    start () {
        // Your initialization goes here.
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }

    loadAllAudioClips()
    {
        loader.loadResDir("Audio/Instruments",AudioClip, function (err, assets:AudioClip[]) {
            console.log("Audio Manager Loading");
            
            if(err)
            {
                console.log("加载音频出错");
                console.log(err);
                return;
            }
            console.log("In audio manager");
            for(let i = 0 ; i < assets.length; i++)
            AudioManager.AudioIndex.set(assets[i].name,assets[i]);
        });
    }

    public static GetInstrumentClip(name:string):AudioClip{

        if(AudioManager.AudioIndex.has(name))
        {
            return AudioManager.AudioIndex.get(name);
        }

        else return null;
    }
}
