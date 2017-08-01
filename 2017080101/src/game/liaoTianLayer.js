/**
 * Created by yungu on 16/11/28.
 */
var LiaoTianLayer=cc.Layer.extend({


    ctor: function (room) {
        this._super();

        this.room=room;

        var touchLayer=new TouchLayer();
        this.addChild(touchLayer);

        var node = parseUI("res/ui/liaotian/liaotianLayer.json", CENTER);
        touchLayer.addChild(node);

        var b= ccui.helper.seekWidgetByName(node, "close");
        b.addTouchEventListener(this.closeClicked,this);

        for(var i=1;i<=16;i++)
        {
            var key="e"+i;
            var b= ccui.helper.seekWidgetByName(node, key);
           // var b= ccui.helper.seekWidgetByName(e, "b");
            b.key=key;
            b.addTouchEventListener(this.biaoQingClicked,this);
        }

        this.textField= ccui.helper.seekWidgetByName(node, "te");
        this.textField.addEventListener(this.textFieldEvent, this);

        var scroll1=ccui.helper.seekWidgetByName(node, "scroll");
        scroll1.setScrollBarEnabled(false);

        this.scrollView=ccui.helper.seekWidgetByName(node, "scroll2");
        this.scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        this.scrollView.setTouchEnabled(true);
        this.pModel=ccui.helper.seekWidgetByName(this.scrollView, "p1");
        this.pModel.visible=false;
        this.scrollView.setScrollBarEnabled(false);

        var len=msgDefault.length;

        var gap_h=this.pModel.getContentSize().height;
        var ccc=this.scrollView.getInnerContainerSize();
        var ww=ccc.width;
        var hh=gap_h*len;
        var hTmp=hh-ccc.height;
        if(hTmp<0)hTmp=0;

        for(var i=0;i<len;i++)
        {
            var obj=msgDefault[i];
            var txt=obj.txt;
            var panel=this.pModel.clone();
            panel.visible=true;
            panel.x=this.pModel.x;
            panel.y=this.pModel.y-i*gap_h+hTmp;

            var bb= ccui.helper.seekWidgetByName(panel, "bb");
            bb.addTouchEventListener(this.bbClicked,this);
            bb.msg=txt;

            var t= ccui.helper.seekWidgetByName(panel, "t");
            t.setString(txt);

            this.scrollView.addChild(panel);
        }

        this.scrollView.setInnerContainerSize(cc.size(ww, hh));


        var sendButton= ccui.helper.seekWidgetByName(node, "Button_32");
        sendButton.addTouchEventListener(this.sendClicked,this);


        //var t= ccui.helper.seekWidgetByName(node, "t");
        //t.setString(txt);

    },
    textFieldEvent: function (textField, type) {
        switch (type) {
            case ccui.TextField.EVENT_ATTACH_WITH_IME:
                if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX)
                {
                    var winSize=cc.director.getWinSize();
                    this.runAction(cc.moveTo(0.225,
                        cc.p(0,  200)));
                }


                break;
            case ccui.TextField.EVENT_DETACH_WITH_IME:

                if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX)
                {
                     var winSize=cc.director.getWinSize();
                    this.runAction(cc.moveTo(0.175, cc.p(0, 0)));
                }


                break;
            case ccui.TextField.EVENT_INSERT_TEXT:

                break;
            case ccui.TextField.EVENT_DELETE_BACKWARD:

                break;
            default:
                break;
        }
    },

    sendClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                var str=this.textField.getString();
                if(str=="")
                {
                    return;
                }
                var req=new MsgRequest();
                req.uid=myPlayerInfo.uid;
                req.roomId=this.room.roomInfo.roomId;
                req.biaoqing="";
                req.msg=str;
                //cc.log("key:"+sender.key);
                socketMgr.socket2.send(MSG_REQUEST,req);

                this.removeFromParent(true);

                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },
    biaoQingClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                var req=new MsgRequest();
                req.uid=myPlayerInfo.uid;
                req.roomId=this.room.roomInfo.roomId;
                req.biaoqing=sender.key;
                req.msg="";
                //cc.log("key:"+sender.key);
                socketMgr.socket2.send(MSG_REQUEST,req);

                this.removeFromParent(true);

                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },
    bbClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                var req=new MsgRequest();
                req.uid=myPlayerInfo.uid;
                req.roomId=this.room.roomInfo.roomId;
                req.biaoqing="";
                req.msg=sender.msg;
                //cc.log("key:"+sender.key);
                socketMgr.socket2.send(MSG_REQUEST,req);
                this.removeFromParent(true);

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