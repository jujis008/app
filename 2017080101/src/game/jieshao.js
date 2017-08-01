/**
 * Created by yungu on 16/11/4.
 */


var JieShaoLayer=cc.Layer.extend({



    ctor: function (sceneId) {
        this._super();

        var touchLayer=new TouchLayer();
        this.addChild(touchLayer);

        var jsonName="";
        if(RULE_VALUE==ROOM_TYPE_BINZHOU)
        {
            jsonName="res/ui/sub/wanfaLayer_binzhou.json";
        }
        else if(RULE_VALUE==ROOM_TYPE_HONGHU_147)
        {
            jsonName="res/ui/sub/wanfaLayer_147.json";
        }
        else if(RULE_VALUE==ROOM_TYPE_BOPI)
        {
            jsonName="res/ui/sub/wanfaLayer.json";
        }
        else{
            jsonName="res/ui/sub/wanfaLayer_binzhou.json";
        }
        var node = parseUI(jsonName, CENTER);
        touchLayer.addChild(node);


        var close= ccui.helper.seekWidgetByName(node, "close");
        close.addTouchEventListener(this.closeClicked,this);

        var b1= ccui.helper.seekWidgetByName(node,"b1");
        var b2= ccui.helper.seekWidgetByName(node,"b2");
        var b3= ccui.helper.seekWidgetByName(node,"b3");
        var b4= ccui.helper.seekWidgetByName(node,"b4");

        b1.addTouchEventListener(this.b1Clicked,this);
        b2.addTouchEventListener(this.b2Clicked,this);
        b3.addTouchEventListener(this.b3Clicked,this);
        b4.addTouchEventListener(this.b4Clicked,this);


        this.scroll1= ccui.helper.seekWidgetByName(node, "scroll1");
        this.scroll2= ccui.helper.seekWidgetByName(node, "scroll2");
        this.scroll3= ccui.helper.seekWidgetByName(node, "scroll3");
        this.scroll4= ccui.helper.seekWidgetByName(node, "scroll4");

        this.scroll1.setScrollBarEnabled(false);
        this.scroll2.setScrollBarEnabled(false);
        this.scroll3.setScrollBarEnabled(false);
        this.scroll4.setScrollBarEnabled(false);

        this.scroll1.visible=false;
        this.scroll2.visible=false;
        this.scroll3.visible=false;

    },

    b1Clicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                this.scroll1.visible=true;
                this.scroll2.visible=false;
                this.scroll3.visible=false;
                this.scroll4.visible=false;
            }
                break;


            default:
                break;
        }


    },
    b2Clicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                this.scroll1.visible=false;
                this.scroll2.visible=true;
                this.scroll3.visible=false;
                this.scroll4.visible=false;
            }
                break;


            default:
                break;
        }


    },
    b3Clicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                this.scroll4.visible=false;
                this.scroll1.visible=false;
                this.scroll2.visible=false;
                this.scroll3.visible=true;
                this.scroll4.visible=false;
            }
                break;


            default:
                break;
        }


    },
    b4Clicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                this.scroll1.visible=false;
                this.scroll2.visible=false;
                this.scroll3.visible=false;
                this.scroll4.visible=true;
            }
                break;


            default:
                break;
        }


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