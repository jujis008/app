/**
 * Created by yungu on 16/12/22.
 */
var ReadyLayer=cc.Layer.extend({


    ctor: function (room,type) {
        this._super();

        this.room=room;


        if(SHOW_READY_LAYER==1)
        {

            var size=cc.director.getWinSize();
            var w=cc.view.getVisibleSize().width;
            var h=cc.view.getVisibleSize().height;
            var bgSp=new cc.Sprite("res/ui/"+my_room_name+"/bg_room3.png");
            var bgSize=bgSp.getTextureRect();
            var scl1=w/bgSize.width;
            var scl2=h/bgSize.height;
            var scl=scl1;
            if(scl<scl2)
            {
                scl=scl2;
            }
            bgSp.x=size.width/2;
            bgSp.y=size.height/2;

            bgSp.setScale(scl+0.2);
            this.addChild(bgSp);

            var touchLayer=new TouchLayer();
            this.addChild(touchLayer);


            var right = parseUI("res/ui/"+my_room_name+"/readyRightLayer.json", RIGHT_TOP);
            touchLayer.addChild(right);

            this.title= ccui.helper.seekWidgetByName(right, "title");
            this.title.setString("");

            this.roomIdLab= ccui.helper.seekWidgetByName(right, "room");
            this.roomIdLab.setString("");

            var left = parseUI("res/ui/"+my_room_name+"/readyLeftLayer.json", LEFT_TOP);
            touchLayer.addChild(left);

            var node = parseUI("res/ui/"+my_room_name+"/readyLayer.json", CENTER);
            touchLayer.addChild(node);

            this.layerNode=node;

            var zhunbei= ccui.helper.seekWidgetByName(node, "zhunbei");
            zhunbei.visible=false;
            zhunbei.setEnabled(false);
            zhunbei.setTouchEnabled(false);
            zhunbei.addTouchEventListener(this.zhunbeiClicked,this);


            var yaoqing= ccui.helper.seekWidgetByName(node, "yaoqing");
            yaoqing.visible=true;
            yaoqing.setEnabled(true);
            yaoqing.setTouchEnabled(true);
            yaoqing.addTouchEventListener(this.yaoqingClicked,this);

            var b1= ccui.helper.seekWidgetByName(node, "b1");
            var b2= ccui.helper.seekWidgetByName(node, "b2");
            var b3= ccui.helper.seekWidgetByName(node, "b3");
            var b4= ccui.helper.seekWidgetByName(node, "b4");

            b1.visible=false;
            b2.visible=false;
            b3.visible=false;
            b4.visible=false;


            var b= ccui.helper.seekWidgetByName(left, "exit");
            b.addTouchEventListener(this.closeClicked,this);

            for(var i=1;i<=4;i++)
            {
                var key1="name"+i;
                var key2="ip"+i;
                var key3="d"+i;

                var k1= ccui.helper.seekWidgetByName(node, key1);
                var k2= ccui.helper.seekWidgetByName(node, key2);
                var k3= ccui.helper.seekWidgetByName(node, key3);

                k1.visible=false;
                k2.visible=false;
                k3.visible=false;

                k3.setLocalZOrder(5);

            }

            if(createRoomObj.renshu==3)
            {
                var a4= ccui.helper.seekWidgetByName(node, "a4");
                a4.visible=false;
            }
            else if(createRoomObj.renshu==2)
            {
                var a4= ccui.helper.seekWidgetByName(node, "a4");
                a4.visible=false;

                var a3= ccui.helper.seekWidgetByName(node, "a2");
                a3.visible=false;

            }


            this.des = ccui.helper.seekWidgetByName(node, "des");
            this.des.setString("");

        }
        else{

            var yaoqing = new ccui.Button();
            yaoqing.setTouchEnabled(true);
            yaoqing.setPressedActionEnabled(true);
            yaoqing.loadTextures("res/ui/room_fucheng/UIFriends_003_room.png","res/ui/room_fucheng/UIFriends_003_room.png","res/room_fucheng/room_fucheng/UIFriends_003_room.png");
            yaoqing.x = v_x+v_w/2;
            yaoqing.y =v_y+v_h/3;
            yaoqing.addTouchEventListener(this.yaoqingClicked,this);
            this.addChild(yaoqing);


        }

        var that=this;
        // cc.eventManager.addListener({
        //     event: cc.EventListener.KEYBOARD,
        //     onKeyPressed: function (key, event) {
        //
        //
        //     },
        //     onKeyReleased: function (key, event) {
        //
        //         if(key==6)
        //         {
        //             that.backEvent(null,that);
        //
        //         }
        //     }
        // }, this);
    },
    backEvent:function (obj,target) {

        if(this.jieSanTip!=undefined&&this.jieSanTip!=null)
        {
            return;
        }

        this.jieSanTip=new TouchLayer();
        this.addChild(this.jieSanTip,TABLE_DESKER_ZOEDER+5);

        var node = parseUI("res/ui/roomTip/roomTip.json", CENTER);
        this.jieSanTip.addChild(node);


        var t= ccui.helper.seekWidgetByName(node, "t");
        t.setString("您确定申请解散房间吗?");


        var b1= ccui.helper.seekWidgetByName(node, "b1");
        b1.addTouchEventListener(this.jiesan1Clicked,this);


        var b2= ccui.helper.seekWidgetByName(node, "b2");
        b2.addTouchEventListener(this.jiesan2Clicked,this);



    },
    onExit:function () {
        this._super();
        EventManager.getInstance().unregist(this);

    },

    getIndex:function (uiPos) {

        if(createRoomObj.renshu==3)
        {
            if(uiPos==BOTTOM_UI)
            {
                return 1;
            }
            else if(uiPos==TOP_UI)
            {
                return 2;
            }
            else if(uiPos==LEFT_UI)
            {
                return 3;
            }
        }
        else if(createRoomObj.renshu==2)
        {
            if(uiPos==BOTTOM_UI)
            {
                return 1;
            }
            else if(uiPos==TOP_UI)
            {
                return 3;
            }

        }
        else{
            if(uiPos==BOTTOM_UI)
            {
                return 1;
            }
            else if(uiPos==RIGHT_UI)
            {
                return 2;
            }
            else if(uiPos==TOP_UI)
            {
                return 3;
            }
            else if(uiPos==LEFT_UI)
            {
                return 4;
            }
        }


    },
    updateOnline:function (uiPos,isOnline) {


        if(SHOW_READY_LAYER!=1)
        {
            return;
        }

        var key="d"+this.getIndex(uiPos);
        var a= ccui.helper.seekWidgetByName(this.layerNode, key);
        a.visible=(!isOnline);
    },
    updateRoomId:function () {


        if(SHOW_READY_LAYER!=1)
        {
            return;
        }

        this.roomIdLab.setString(this.room.roomInfo.roomId);
        this.title.setString(createRoomObj.title+":"+createRoomObj.renshu+"人");
        this.des.setString(createRoomObj.des2);

        var lab = new cc.LabelTTF("("+BUILD_TIME+")", FONT_NAME_APP, 30);
        lab.setColor(cc.color(255,255,255));
        var winSize=cc.director.getWinSize();
        lab.x=v_x+v_w-100;
        lab.y=v_y+50;
        this.addChild(lab,1);
    },
    updateZhunBeiButton:function (flg) {


        if(SHOW_READY_LAYER!=1)
        {
            return;
        }

        if(this.room!=undefined)
        {
            var user=this.room.getRoomUserByUID(myPlayerInfo.uid);
            if(user!=undefined&&user!=null)
            {
                if(user.isReady==0)
                {
                    //准备好

                    var zhunbei= ccui.helper.seekWidgetByName(this.layerNode, "zhunbei");
                    zhunbei.visible=false;
                    zhunbei.setEnabled(false);
                    zhunbei.setTouchEnabled(false);

                    var yaoqing= ccui.helper.seekWidgetByName(this.layerNode, "yaoqing");
                    yaoqing.visible=false;
                    yaoqing.setEnabled(false);
                    yaoqing.setTouchEnabled(false);

                    return;
                }
            }
        }
        if(flg)
        {
            var zhunbei= ccui.helper.seekWidgetByName(this.layerNode, "zhunbei");
            zhunbei.visible=true;
            zhunbei.setEnabled(true);
            zhunbei.setTouchEnabled(true);

            var yaoqing= ccui.helper.seekWidgetByName(this.layerNode, "yaoqing");
            yaoqing.visible=false;
            yaoqing.setEnabled(false);
            yaoqing.setTouchEnabled(false);

            //var req=new ReadyRequest();
            //req.uid=myPlayerInfo.uid;
            //req.roomId=this.room.roomInfo.roomId;
            //socketMgr.socket.send(READY_REQUEST,req);



        }
        else{
            var zhunbei= ccui.helper.seekWidgetByName(this.layerNode, "zhunbei");
            zhunbei.visible=false;
            zhunbei.setEnabled(false);
            zhunbei.setTouchEnabled(false);

            var yaoqing= ccui.helper.seekWidgetByName(this.layerNode, "yaoqing");
            yaoqing.visible=true;
            yaoqing.setEnabled(true);
            yaoqing.setTouchEnabled(true);
        }


    },
    updateName:function (uiPos,roomUser) {


        if(SHOW_READY_LAYER!=1)
        {
            return;
        }

        var key="name"+this.getIndex(uiPos);
        var a= ccui.helper.seekWidgetByName(this.layerNode, key);
        a.setString(roomUser.user.name);
        a.visible=true;

    },
    updateHead:function (uiPos,uid) {


        if(SHOW_READY_LAYER!=1)
        {
            return;
        }
        cc.log("updateHead::"+uiPos);
        
        var key="a"+this.getIndex(uiPos);
        var a= ccui.helper.seekWidgetByName(this.layerNode, key);
        a.visible=false;


        var headName=uid+"_head.png";
        var headIconPath=getSkinPath(headName);
        if(checkFileExit(headIconPath))
        {
            
            var headSprite=new cc.Sprite(headIconPath);
            headSprite.x=a.x;
            headSprite.y=a.y;
            changeHead(headSprite,2);
            a.getParent().addChild(headSprite,1);


            var bg=new cc.Sprite("res/ui/"+my_room_name+"/icon21_room.png");
            a.getParent().addChild(bg,1);
            bg.x=a.x;
            bg.y=a.y;


        }




    },
    updateIp:function (uiPos,address) {


        if(SHOW_READY_LAYER!=1)
        {
            return;
        }
        var key="ip"+this.getIndex(uiPos);
        var a= ccui.helper.seekWidgetByName(this.layerNode, key);
        if(address.indexOf("undef")!=-1)
        {

        }
        else{
            a.setString(address);
        }


        a.visible=true;

    },
    updateReady:function (uiPos,isReady) {


        if(SHOW_READY_LAYER!=1)
        {
            return;
        }

        if(isReady==0)
        {
            var key="b"+this.getIndex(uiPos);
            var a= ccui.helper.seekWidgetByName(this.layerNode, key);
            a.visible=true;
        }
        else{
            var key="b"+this.getIndex(uiPos);
            var a= ccui.helper.seekWidgetByName(this.layerNode, key);
            a.visible=false;
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




                this.jieSanTip=new TouchLayer();
                this.addChild(this.jieSanTip,TABLE_DESKER_ZOEDER+5);

                var node = parseUI("res/ui/roomTip/roomTip.json", CENTER);
                this.jieSanTip.addChild(node);


                var t= ccui.helper.seekWidgetByName(node, "t");
                t.setString("您确定申请解散房间吗?");


                var b1= ccui.helper.seekWidgetByName(node, "b1");
                b1.addTouchEventListener(this.jiesan1Clicked,this);
                b1.type=1;

                var b2= ccui.helper.seekWidgetByName(node, "b2");
                b2.addTouchEventListener(this.jiesan2Clicked,this);
                b2.type=1;





                playEffect(TOUCH_SOUND);
            }
                break;



            default:
                break;
        }


    },

    jiesan1Clicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
            {
                sender.setScale(1.05);
            }
                break;
            case ccui.Widget.TOUCH_CANCELED:
            {
                sender.setScale(1);
            }
                break;
            case ccui.Widget.TOUCH_ENDED:
            {
                sender.setScale(1);


                if(this.jieSanTip!=undefined&&this.jieSanTip!=null)
                {
                    this.jieSanTip.removeFromParent(true);
                    this.jieSanTip=null;
                }



                var req=new DismissRequest();
                req.roomId=this.room.roomInfo.roomId;
                req.uid=myPlayerInfo.uid;
                socketMgr.socket2.send(DISMISS_REQUEST,req);


                playEffect(TOUCH_SOUND);

            }
                break;


            default:
                break;
        }

    },
    jiesan2Clicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
            {
                sender.setScale(1.05);
            }
                break;
            case ccui.Widget.TOUCH_CANCELED:
            {
                sender.setScale(1);
            }
                break;
            case ccui.Widget.TOUCH_ENDED:
            {
                sender.setScale(1);

                if(this.jieSanTip!=undefined&&this.jieSanTip!=null)
                {
                    this.jieSanTip.removeFromParent(true);
                    this.jieSanTip=null;
                }
                playEffect(TOUCH_SOUND);

            }
                break;


            default:
                break;
        }

    },
    zhunbeiClicked:function(sender, type)
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


                var req=new ReadyRequest();
                req.uid=myPlayerInfo.uid;
                req.roomId=this.room.roomInfo.roomId;
                socketMgr.socket2.send(READY_REQUEST,req);

                var zhunbei= ccui.helper.seekWidgetByName(this.layerNode, "zhunbei");
                zhunbei.visible=false;

            }
                break;


            default:
                break;
        }


    },
    yaoqingClicked:function(sender, type)
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


                var str="";
                if(RULE_VALUE==ROOM_TYPE_BOPI)
                {
                    str="邵阳剥皮,房间号["+this.room.roomInfo.roomId+"],";
                }
                else if(RULE_VALUE==ROOM_TYPE_HONGHU_147)
                {
                    str="147红胡子玩法,房间号["+this.room.roomInfo.roomId+"],";
                }
                else if(RULE_VALUE==ROOM_TYPE_BINZHOU)
                {
                    str="郴州字牌,房间号["+this.room.roomInfo.roomId+"],";
                }
                else if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                {
                    str="歪胡子,房间号["+this.room.roomInfo.roomId+"],";
                }
                else if(RULE_VALUE==ROOM_TYPE_BINZHOU_YONGXING)
                {
                    str="郴州永兴字牌,房间号["+this.room.roomInfo.roomId+"],";
                }
                else if(RULE_VALUE==ROOM_TYPE_LOUDI)
                {
                    str="娄底放炮罚,房间号["+this.room.roomInfo.roomId+"],";
                }
                else if(RULE_VALUE==ROOM_TYPE_SHUANGFENG)
                {
                    str="双峰煨胡子,房间号["+this.room.roomInfo.roomId+"],";
                }
                else if(RULE_VALUE==ROOM_TYPE_LEIYANG)
                {
                    str="耒阳字牌,房间号["+this.room.roomInfo.roomId+"],";
                }
                else if(RULE_VALUE==ROOM_TYPE_HENGYANG)
                {
                    str="衡阳六胡抢,房间号["+this.room.roomInfo.roomId+"],";
                }
                else if(RULE_VALUE==ROOM_TYPE_GUILIN)
                {
                    str="桂林字牌,房间号["+this.room.roomInfo.roomId+"],";
                }
                else if(RULE_VALUE==ROOM_TYPE_HONGHEIHU)
                {
                    str="衡阳红黑胡,房间号["+this.room.roomInfo.roomId+"],";
                }
                else if(RULE_VALUE==ROOM_TYPE_PENGHUZI)
                {
                    str="攸县碰胡子,房间号["+this.room.roomInfo.roomId+"],";
                }
                else if(RULE_VALUE==ROOM_TYPE_DAZIPAI)
                {
                    str="大字牌,房间号["+this.room.roomInfo.roomId+"],";
                }

                if(this.room.roomInfo.roomUsers!=undefined)
                {
                    var ju=this.room.roomInfo.maxCount+"";
                    if(this.room.roomInfo.maxCount==100)
                    {
                        ju="100胡"
                    }
                    else{
                        ju+="局";
                    }
                    var str2="来自["+myPlayerInfo.name+"]邀请,"+this.room.roomInfo.renshu+"人玩法,"+ju+",";
                    str2+=this.room.roomInfo.renshu+"缺"+(this.room.roomInfo.renshu-this.room.roomInfo.roomUsers.length)+"!";
                    str2+=","+createRoomObj.des2;
                    str+=str2;

                }
               cc.log("邀请*****:"+str);
                weixinShare("0",str);

               // weixinShareWithTitle(0,str,APP_NICK_NAME+"["+this.room.roomInfo.roomId+"]");
            }
                break;


            default:
                break;
        }


    },


});
