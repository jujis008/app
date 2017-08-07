/**
 * Created by yungu on 16/11/21.
 */
var TipInfoLayer=cc.Layer.extend({


    ctor: function (txt) {
        this._super();

        var touchLayer=new TouchLayer();
        this.addChild(touchLayer);

        var node = parseUI("res/ui/tip/tipInfo.json", CENTER);
        touchLayer.addChild(node);

        var b= ccui.helper.seekWidgetByName(node, "b");
        b.addTouchEventListener(this.closeClicked,this);


        var t= ccui.helper.seekWidgetByName(node, "t");
        t.setString(txt);

    },
    closeClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                this.removeFromParent(true);
            }
                break;


            default:
                break;
        }


    },


});