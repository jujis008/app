/**
 * Created by yungu on 2017/4/16.
 */
var NumberTipLayer=cc.Layer.extend({


    ctor: function (txt,color) {
        this._super();

        var lab = new cc.LabelTTF(txt, FONT_NAME_APP, 50);
        lab.setColor(color);
        this.addChild(lab,1);
        lab.setScale(0);

        var scaleTo1=cc.scaleTo(0.1,1);
        var delayAction=cc.delayTime(5.0);
        var actionCallbackFunction = cc.callFunc(this.callback1, this, lab);
        var actionArray=[];
        actionArray.push(scaleTo1);
        actionArray.push(delayAction);
        actionArray.push(actionCallbackFunction);
        var actionSequence = cc.sequence(actionArray);
        lab.runAction(actionSequence);



    },
    callback1:function (lab) {


        var scaleTo1=cc.scaleTo(0.1,0);
        var actionCallbackFunction = cc.callFunc(this.close, this, lab);
        var actionArray=[];
        actionArray.push(scaleTo1);
        actionArray.push(actionCallbackFunction);
        var actionSequence = cc.sequence(actionArray);
        lab.runAction(actionSequence);

    },
    close:function(lab)
    {
        this.removeFromParent(true);
    }

});