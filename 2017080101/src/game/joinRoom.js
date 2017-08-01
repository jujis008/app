/**
 * Created by yungu on 16/11/13.
 */

var JoinRoomLayer=cc.Layer.extend({


    ctor: function (sceneId) {
        this._super();

        var touchLayer=new TouchLayer();
        this.addChild(touchLayer);

        this.node = parseUI("res/ui/join/joinLayer.json", CENTER);
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

        var del=ccui.helper.seekWidgetByName(this.node, "del");
        del.addTouchEventListener(this.delClicked,this);


        var close=ccui.helper.seekWidgetByName(this.node, "close");
        close.addTouchEventListener(this.closeClicked,this);

        // var sure=ccui.helper.seekWidgetByName(this.node, "sure");
        // sure.addTouchEventListener(this.sureClicked,this);


        this.resetUI();


        EventManager.getInstance().regist("JOIN_ROOM_FAILED_EVENT",this,this.joinRoomFailed);


    },
    joinRoomFailed:function (obj,target) {

        if(target.loadLayer!=null&&target.loadLayer!=undefined)
        {
            target.loadLayer.removeFromParent(true);
            target.loadLayer=null;
        }

        target.arr=[];
        target.resetUI();

        if(obj.state==-2)
        {

            target.roomTip=new TouchLayer();
            target.addChild(target.roomTip,100);

            var node = parseUI("res/ui/roomTip/roomTip.json", CENTER);
            target.roomTip.addChild(node);

            var b1= ccui.helper.seekWidgetByName(node, "b1");
            b1.addTouchEventListener(target.roomTipB1Clicked,target);


            var b2= ccui.helper.seekWidgetByName(node, "b2");
            b2.addTouchEventListener(target.roomTipB2Clicked,target);

            var t= ccui.helper.seekWidgetByName(node, "t");
            t.setString(obj.txt);
        }




    },
    roomTipB1Clicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                this.removeFromParent(true);

                var obj={};
                EventManager.getInstance().fireEvent("SHOP_EVENT",obj);


                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },
    roomTipB2Clicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                if(this.roomTip!=undefined&&this.roomTip!=null)
                {
                    this.roomTip.removeFromParent(true);
                    this.roomTip=null;
                }

                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },
    resetUI:function () {

        for(var i=0;i<6;i++)
        {
            var name="t"+(i+1);
            var t=ccui.helper.seekWidgetByName(this.node, name);
            t.setString("");
        }

        var len=this.arr.length;
        for(var i=0;i<len;i++)
        {
            var v=this.arr[i];

            var name="t"+(i+1);
            var t=ccui.helper.seekWidgetByName(this.node, name);
            t.setString(v+"");

        }


    },
    countClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
            {
                sender.setScale(1.15);
            }
                break;
            case ccui.Widget.TOUCH_CANCELED:
            {
                sender.setScale(1.1);
            }
                break;
            case ccui.Widget.TOUCH_ENDED:
            {
                sender.setScale(1.1);

                var v=sender.value;
                if(this.arr.length<6)
                {
                    this.arr.push(v);
                    this.resetUI();

                    if(this.arr.length>=6)
                    {


                        var that=this;
                        var roomId=""+that.arr[0]+that.arr[1]+that.arr[2]+that.arr[3]+that.arr[4]+that.arr[5];
                        var getLayer=new GetServerLayer(1,roomId,function(state)
                        {

                            if(state==0)
                            {

                                if(that.loadLayer!=null)
                                {
                                    that.loadLayer.removeFromParent(true);
                                    that.loadLayer=null;
                                }
                                that.loadLayer=new LoadLayer();
                                that.addChild(that.loadLayer,2);

                                var req=new JoinRoomRequest();
                                req.uid=myPlayerInfo.uid;
                                req.roomId=roomId;
                                socketMgr.socket2.send(JOIN_ROOM_REQUEST,req);

                            }
                            else{
                                var dialog=new DialogLayer();
                                dialog.show("[加入房间失败，请检查是否房间号正确!]");
                                that.addChild(dialog,100);

                                that.arr=[];
                                that.resetUI();

                            }
                        });


                        this.addChild(getLayer,100);


                    }
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
                sender.setScale(1.15);
            }
                break;
            case ccui.Widget.TOUCH_CANCELED:
            {
                sender.setScale(1.1);
            }
                break;
            case ccui.Widget.TOUCH_ENDED:
            {
                sender.setScale(1.1);
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
                sender.setScale(1.15);
            }
                break;
            case ccui.Widget.TOUCH_CANCELED:
            {
                sender.setScale(1.1);
            }
                break;
            case ccui.Widget.TOUCH_ENDED:
            {

                sender.setScale(1.1);

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
                sender.setScale(1.15);
            }
                break;
            case ccui.Widget.TOUCH_CANCELED:
            {
                sender.setScale(1.1);
            }
                break;
            case ccui.Widget.TOUCH_ENDED:
            {
                sender.setScale(1.1);

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
                if(this.arr.length<6)
                {
                    var dialog=new DialogLayer();
                    dialog.show("[房间号错误!]");
                    this.addChild(dialog);
                    return;
                }


                var that=this;

                var getLayer=new GetServerLayer(1,"",function(state)
                {

                    if(state==0)
                    {

                        if(that.loadLayer!=null)
                        {
                            that.loadLayer.removeFromParent(true);
                            that.loadLayer=null;
                        }
                        that.loadLayer=new LoadLayer();
                        that.addChild(that.loadLayer,2);

                        var req=new JoinRoomRequest();
                        req.uid=myPlayerInfo.uid;
                        req.roomId=""+that.arr[0]+that.arr[1]+that.arr[2]+that.arr[3]+that.arr[4]+that.arr[5];
                        socketMgr.socket2.send(JOIN_ROOM_REQUEST,req);

                    }
                });



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
        //Service.getInstance().clear();

    },



});