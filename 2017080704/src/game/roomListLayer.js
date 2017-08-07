/**
 * Created by yungu on 2017/4/17.
 */
var RoomListLayer=cc.Layer.extend({


    ctor: function (layer) {
        this._super();

        this.parentLayer=layer;
        this.parentLayer.setLocalZOrder(10000);


        var winSize=cc.winSize;
        var bgColor=cc.LayerColor.create(cc.color(0, 0, 0, 200));
        this.addChild(bgColor);
        bgColor.ignoreAnchor = false;
        bgColor.anchorX = 0;
        bgColor.anchorY = 0;
        bgColor.setContentSize(winSize.width, winSize.height);

        var touchLayer=new TouchLayer();
        this.addChild(touchLayer);

        var node = parseUI("res/ui/sub/roomList.json", CENTER);
        touchLayer.addChild(node);

        this.container=new cc.Layer();
        node.addChild(this.container);

        this.modelPanel= ccui.helper.seekWidgetByName(node, "p1");
        this.modelPanel.visible=false;


        var close= ccui.helper.seekWidgetByName(node, "close");
        close.addTouchEventListener(this.closeClicked,this);




        this.reqList();

        Service.getInstance().regist(GET_ROOMS_RESPONSE,this,this.onReceive);
        Service.getInstance().regist(DISMISS_RESPONSE,this,this.onReceive);


        this.timeLabes=[];

        this.schedule(this.update, 1.0);

    },
    reqList:function()
    {
        var req=new GetRoomsRequest();
        req.uid=myPlayerInfo.uid;
        cc.log("myPlayerInfo.uid:"+myPlayerInfo.uid);
        socketMgr.socket.send(GET_ROOMS_REQUEST,req);

    },
    resetUI:function(rooms)
    {

        this.container.removeAllChildren();
        this.timeLabes=[];

        var h=this.modelPanel.getContentSize().height;
        var len=rooms.length;
        for(var i=0;i<len;i++)
        {
            var room=rooms[i];

            var p=this.modelPanel.clone();
            p.visible=true;
            p.y-=(i*h);
            this.container.addChild(p);

            //房间ID
            var roomIdLab=ccui.helper.seekWidgetByName(p, "roomId");
            roomIdLab.setString(room.roomId);

            //类型
            var roomtypeLab=ccui.helper.seekWidgetByName(p, "type");
            roomtypeLab.setString(getGameTitle(room.roomType));

            //人数
            var roomnumLab=ccui.helper.seekWidgetByName(p, "num");
            var txt=room.count+"/"+room.playerCount;
            roomnumLab.setString(txt);

            //时间
            cc.log("room.leftTime:"+room.leftTime);
            var roomtimeLab=ccui.helper.seekWidgetByName(p, "time");
            roomtimeLab.setString(this.getTimeStr(room.leftTime));

            var obj={};
            obj.lab=roomtimeLab;
            obj.leftTime=room.leftTime;
            obj.time=new Date().getTime();
            obj.p=p;
            this.timeLabes.push(obj);

            var jiesan=ccui.helper.seekWidgetByName(p, "jiesan");
            var share=ccui.helper.seekWidgetByName(p, "share");
            var join=ccui.helper.seekWidgetByName(p, "join");

            if(room.count<room.playerCount)
            {
                //解散

                jiesan.addTouchEventListener(this.jiesanClicked,this);
                jiesan.room=room;


                //分享

                share.addTouchEventListener(this.shareClicked,this);
                share.room=room;

                //加入

                join.addTouchEventListener(this.joinClicked,this);
                join.room=room;

            }
            else{
                jiesan.visible=false;
                share.visible=false;
                join.visible=false;

            }

            obj.jiesan=jiesan;
            obj.share=share;
            obj.join=join;


        }


    },
    getTimeStr:function(time)
    {
        var t=parseInt(time);
        var a=parseInt(t/60);
        if(a>1)
        {
            var str="";
            if(a<9)
            {
               str+="0"+a;
            }
            else{
                str+=a;
            }

            var b=t-60*a;

            if(b<9)
            {
                str+=":0"+b;
            }
            else{
                str+=":"+b;
            }
            return str;
        }
        else{
            if(time<9)
            {
                return "00:0"+t;
            }
            else{
                return "00:"+t;
            }

        }


    },
    update:function(dt)
    {
        var len=this.timeLabes.length;
        for(var i=0;i<len;i++)
        {
            var obj=this.timeLabes[i];
            var lab=obj.lab;
            var leftTime=obj.leftTime;
            var time=obj.time;

            var t=new Date().getTime();
            var a=leftTime-(t-time)/1000;
            if(a<0)a=0;
            a=parseInt(a);
            lab.setString(this.getTimeStr(a));

            if(a<=0)
            {

                obj.jiesan.visible=false;
                obj.share.visible=false;
                obj.join.visible=false;

            }

        }


    },
    onReceive:function(msgNumber,body,target)
    {

        switch(msgNumber)
        {

            case GET_ROOMS_RESPONSE:
            {
                cc.log("[获取房间列表应答:"+body.rooms.length+"]");

                target.resetUI(body.rooms);




            }
                break;
            case DISMISS_RESPONSE:
            {
                cc.log("[解散自己开的房间:"+body.state+"]");
                if(body.state==2)
                {

                    target.reqList();

                }

            }
                break;


        }


    },
    jiesanClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
            {
                sender.setScale(0.8);
            }
                break;
            case ccui.Widget.TOUCH_CANCELED:
            {
                sender.setScale(0.7);
            }
                break;
            case ccui.Widget.TOUCH_ENDED:
            {

                sender.setScale(0.7);

                var that=this;
                var room=sender.room;

                var getLayer=new GetServerLayer(4,room,function(state)
                {

                    if(state==0)
                    {
                        var req=new DismissRequest();
                        req.roomId=room.roomId;
                        req.uid=myPlayerInfo.uid;
                        socketMgr.socket2.send(DISMISS_REQUEST,req);

                    }
                });
                this.addChild(getLayer,100);


            }
                break;



            default:
                break;
        }


    },
    shareClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
            {
                sender.setScale(0.8);
            }
                break;
            case ccui.Widget.TOUCH_CANCELED:
            {
                sender.setScale(0.7);
            }
                break;
            case ccui.Widget.TOUCH_ENDED:
            {
                sender.setScale(0.7);

                var room=sender.room;

                var str="玩家【"+myPlayerInfo.name+"】已经代开好房间【"+room.roomId+"】";
                str+=","+getGameTitle(room.roomType);
                weixinShare("0",str);

            }
                break;


            default:
                break;
        }


    },
    joinClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
            {
                sender.setScale(0.8);
            }
                break;
            case ccui.Widget.TOUCH_CANCELED:
            {
                sender.setScale(0.7);
            }
                break;
            case ccui.Widget.TOUCH_ENDED:
            {

                sender.setScale(0.7);

                var room=sender.room;
                var getLayer=new GetServerLayer(4,room,function(state)
                {

                    var req=new JoinRoomRequest();
                    req.uid=myPlayerInfo.uid;
                    req.roomId=room.roomId;
                    socketMgr.socket2.send(JOIN_ROOM_REQUEST,req);


                });
                this.addChild(getLayer,100);
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
                this.parentLayer.setLocalZOrder(1);
                this.removeFromParent(true);
                finishState=0;
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