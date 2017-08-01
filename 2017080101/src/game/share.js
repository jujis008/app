/**
 * Created by yungu on 16/11/4.
 */

var ShareLayer=cc.Layer.extend({


    ctor: function (sceneId) {
        this._super();

        var touchLayer=new TouchLayer();
        this.addChild(touchLayer);

        var node = parseUI("res/ui/sub/shareLayer.json", CENTER);
        touchLayer.addChild(node);

        var copy= ccui.helper.seekWidgetByName(node, "copy");
        copy.addTouchEventListener(this.copyClicked,this);

        var close= ccui.helper.seekWidgetByName(node, "close");
        close.addTouchEventListener(this.closeClicked,this);

        var b1= ccui.helper.seekWidgetByName(node, "b1");
        b1.addTouchEventListener(this.b1Clicked,this);

        var b2= ccui.helper.seekWidgetByName(node, "b2");
        b2.addTouchEventListener(this.b2Clicked,this);



    },

    b1Clicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                weixinShare("0",APP_NICK_NAME+"欢迎广大玩家,赶快来开房。");

              
                playEffect(TOUCH_SOUND);
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
                weixinShare("1",APP_NICK_NAME+"欢迎广大玩家,赶快来开房。");

                playEffect(TOUCH_SOUND);
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

                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },
    copyClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                copyString(shareUrl);

                var dialog=new DialogLayer();
                dialog.show("复制成功");
                this.addChild(dialog,1);

                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },

    onExit:function () {
        this._super();
        EventManager.getInstance().unregist(this);

    },

});