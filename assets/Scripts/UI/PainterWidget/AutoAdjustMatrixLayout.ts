import { _decorator, Component, Node, Vec3, UITransformComponent } from 'cc';
import { MessageManager } from '../../MessageSystem/MessageManager';
import { PaintMessages } from './PainterWidget';
const { ccclass, property } = _decorator;

@ccclass('AutoAdjustMatrixLayout')
export class AutoAdjustMatrixLayout extends Component {
    private rank = 0;
    /* class member could be defined like this */
    // dummy = '';
    @property
    private containerWidth = 400;

    private childUITransforms:UITransformComponent[] = [];

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    onLoad(){
        //MessageManager.getInstance().Register(PaintMessages.ChangeRank,this.onRankChanged,this);
    }

    start () {
        // Your initialization goes here.
    }

    onRankChanged(newRank:number){
        this.rank = newRank;
        this.RearrangeChildrenPosition();
    }

    public RearrangeChildrenPosition(){
        let chlidren:Node[] = this.node.children;

        let childWidth = this.containerWidth/this.rank;
        let startPosition:Vec3 = new Vec3(-1 *(this.rank -1)/2 * childWidth,(this.rank -1)/2 * childWidth,0);
        let instancePosition = new Vec3(startPosition);

        let i = 0;

        
        for(let y = 0; y < this.rank; y++)
        {
            for(let x = 0; x < this.rank ; x++)
            {
                if(chlidren[i])
                {
                    let childUItransform:UITransformComponent;
                    if(! this.childUITransforms[i])
                    {
                        childUItransform =chlidren[i].getComponent(UITransformComponent);
                        this.childUITransforms.push(childUItransform);
                    } else {
                        childUItransform = this.childUITransforms[i];
                    }

                    childUItransform.setContentSize(childWidth,childWidth);
                    chlidren[i].setPosition(instancePosition);
                }
                instancePosition.x += childWidth;
                i++;
            }
            instancePosition.y -= childWidth;
            instancePosition.x = startPosition.x;

        } 
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
