/**
 * Created by yungu on 16/12/14.
 */
var PlayBackTipLayer=cc.Layer.extend({


    ctor: function (sceneId) {
        this._super();


        var winSize=cc.winSize;
        var bgColor=cc.LayerColor.create(cc.color(0, 0, 0, 200));
        this.addChild(bgColor);
        bgColor.ignoreAnchor = false;
        bgColor.anchorX = 0;
        bgColor.anchorY = 0;
        bgColor.setContentSize(winSize.width, winSize.height);

        var touchLayer=new TouchLayer();
        this.addChild(touchLayer);

        this.node = parseUI("res/ui/join/playBackTip.json", CENTER);
        touchLayer.addChild(this.node);


        this.arr=[];

        for(var i=0;i<=9;i++)
        {
            var name="b"+i;
            var b=ccui.helper.seekWidgetByName(this.node, name);
            b.addTouchEventListener(this.countClicked,this);
            b.value=i;
        }

        var reset=ccui.helper.seekWidgetByName(this.node, "b10");
        reset.addTouchEventListener(this.resetClicked,this);

        // var del=ccui.helper.seekWidgetByName(this.node, "b11");
        // del.addTouchEventListener(this.delClicked,this);
        //

        var queren=ccui.helper.seekWidgetByName(this.node, "queren");
        queren.addTouchEventListener(this.sureClicked,this);

        var close=ccui.helper.seekWidgetByName(this.node, "close");
        close.addTouchEventListener(this.closeClicked,this);



        this.code="";
        this.resetUI();



    },


    resetUI:function () {

        var t=ccui.helper.seekWidgetByName(this.node, "code");
        t.setString("");

        var str="";
        var len=this.arr.length;
        for(var i=0;i<len;i++)
        {
            var v=this.arr[i];

            str+=v;


        }
        t.setString(str);
        this.code=str;
    },
    countClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
            {
                sender.setScale(1.05);
            }
                break;
            case ccui.Widget.TOUCH_CANCELED:
            {
                sender.setScale(1.0);
            }
                break;
            case ccui.Widget.TOUCH_ENDED:
            {
                sender.setScale(1.0);

                var v=sender.value;
                if(this.arr.length<=15)
                {
                    this.arr.push(v);
                    this.resetUI();

                   
                }

                playEffect(TOUCH_SOUND);

            }
                break;


            default:
                break;
        }


    },
    delClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
            {
                sender.setScale(1.05);
            }
                break;
            case ccui.Widget.TOUCH_CANCELED:
            {
                sender.setScale(1.0);
            }
                break;
            case ccui.Widget.TOUCH_ENDED:
            {
                sender.setScale(1.0);
                if(this.arr.length>0)
                {
                    this.arr.splice(this.arr.length-1,1);
                    this.resetUI();
                }
                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },
    resetClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
            {
                sender.setScale(1.05);
            }
                break;
            case ccui.Widget.TOUCH_CANCELED:
            {
                sender.setScale(1.0);
            }
                break;
            case ccui.Widget.TOUCH_ENDED:
            {

                sender.setScale(1.0);

                this.arr=[];
                this.resetUI();
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
            case ccui.Widget.TOUCH_BEGAN:
            {
                sender.setScale(1.05);
            }
                break;
            case ccui.Widget.TOUCH_CANCELED:
            {
                sender.setScale(1.0);
            }
                break;
            case ccui.Widget.TOUCH_ENDED:
            {
                sender.setScale(1.0);

                this.removeFromParent(true);
                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },

    sureClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                if(this.code=="")
                {
                    return;
                }
                var req=new PlayRequest();
                req.uid=myPlayerInfo.uid;
                req.code=this.code;
                socketMgr.socket.send(PLAY_REQUEST,req);

                playEffect(TOUCH_SOUND);
                this.removeFromParent(true);
            }
                break;


            default:
                break;
        }


    },
    onExit:function () {
        this._super();
        EventManager.getInstance().unregist(this);
        //Service.getInstance().clear();

    },



});