/**
 * Created by yungu on 16/11/4.
 */

var MailLayer=cc.Layer.extend({


    ctor: function (sceneId) {
        this._super();

        var touchLayer=new TouchLayer();
        this.addChild(touchLayer);

        var node = parseUI("res/ui/sub/mailLayer.json", CENTER);
        touchLayer.addChild(node);

        var b1= ccui.helper.seekWidgetByName(node, "b1");
        b1.addTouchEventListener(this.b1Clicked,this);

        var b2= ccui.helper.seekWidgetByName(node, "b2");
        b2.addTouchEventListener(this.b2Clicked,this);


        var close= ccui.helper.seekWidgetByName(node, "close");
        close.addTouchEventListener(this.closeClicked,this);




        Service.getInstance().regist(GET_INFO_RESPONSE,this,this.onReceive);

        this.lab= ccui.helper.seekWidgetByName(node, "t");
        this.lab.setString("");

        this.type=0;

        this.resetUI(this.type);

    },
    onReceive:function(msgNumber,body,target)
    {

        switch(msgNumber)
        {

            case GET_INFO_RESPONSE:
            {

                target.value=body.value;
                target.resetUI(target.type);
            }
                break;


        }


    },
    resetUI:function (type) {

        if(this.value==undefined)
        {
            var req=new GetInfoRequest();
            req.type=0
            socketMgr.socket.send(GET_INFO_REQUEST,req);

            return;
        }
        this.type=type;

        if(type==0)
        {
            this.lab.setString(this.value[0]);
        }
        else{
            this.lab.setString(this.value[1]);
        }
    },
    b1Clicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                this.resetUI(0);

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
                this.resetUI(1);

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
    onExit:function () {
        this._super();
        EventManager.getInstance().unregist(this);
        Service.getInstance().unregist(this);


    },

});