/**
 * Created by yungu on 16/11/7.
 */

var BOTTOM_UI=0;
var RIGHT_UI=1;
var TOP_UI=3;
var LEFT_UI=4;


//比 偎 提 跑 是强制动作
var ACTION_FAPAI=0;//发牌
var ACTION_TI=1;//1:提
var ACTION_PAO=2;//2:跑
var ACTION_KECHI=3;//3:可吃
var ACTION_CHI=4;//4:吃
var ACTION_KEHU=5;//5:可胡
var ACTION_HU=6;//6:胡
var ACTION_KEPENG=7;//7:可碰
var ACTION_PENG=8;//8:碰
var ACTION_WAIT_PUT=9;//9:等待出牌
var ACTION_PUT=10;//10:出牌
var ACTION_HIDE_BUTTON=11;// 11:隐藏选择按钮
var ACTION_CANCLE_TIMEOUT=12;// 12:取消超时等待
var ACTION_WEI=13;// 13:偎
var ACTION_TOUCH=14;// 14:摸
var ACTION_TAKE_IN=15;  //收
var ACTION_GET=16;  //补
var ACTION_TI2=17;//偎转提
var ACTION_PAO2=18;//1:通过碰转跑
var ACTION_HUANGZHUANG=19;//黄庄
var ACTION_KEHU2=20;//可胡2
var ACTION_NO=21;//无动作
var ACTION_CARD_MOVE_TO_CARDS1=22;//

var ROOM_NO_STATE=0;
var ROOM_GAMEING_STATE=1;
var ROOM_WAIT_PUT_STATE=2;
var ROOM_WAIT_SELECTED_STATE=3;
var ROOM_WAIT_READY_STATE=4;

var TABLE_DESKER_ZOEDER=100;

var WORLD_CHI=1;
var WORLD_HU=2;
var WORLD_PAO=3;
var WORLD_PENG=4;
var WORLD_TI=5;
var WORLD_WEI=6;
var WORLD_BI=7;
var WORLD_HUANGZHUANG=8;
var WORLD_BU=9;
var WORLD_TIAN_HU=10;
var WORLD_DI_HU=11;
var WORLD_ZI_MO=12;


var CARD_SPRITE_TAG=1000;

var DELEAY_TEST=0;
var DELEAY_T=0;
var MOVE_DELEAY_T=0.2;


var PLAYER_TYPE=0;
var ZHUANGJIA_TYPE=1;
var XIANJIA_TYPE=2;

var OLD_CARD=0;
var BIG_CARD_SCL=0.8;
var SMALL_CARD_SCL=0.7;
var SMALL_CARD_SCL2=0.3;


var WAIT_SHOW_TIME=0.3;

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


var PlayBackScene=cc.Layer.extend({


    ctor: function (sceneId,code,fileSize,httpurl) {
        this._super();

        this.playHistoryQueue=[];
        this.canOperBackOrFront=false;

        this.sceneId=sceneId;

        var size=cc.director.getWinSize();
        var w=cc.view.getVisibleSize().width;
        var h=cc.view.getVisibleSize().height;

        var bgSp=new cc.Sprite("res/ui/room/bg_room.png");
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

        var bar=new cc.Sprite("res/ui/room/banner_room.png");
        var bar_w=bar.getTextureRect().width;
        this.bar_h=bar.getTextureRect().height;
        var bar_scl=v_w/bar_w;
        bar.setScale(bar_scl);
        bar.x=v_x+v_w/2;
        bar.y=v_y+this.bar_h/2-5;
        this.addChild(bar);



       // Service.getInstance().regist(FLOWS_NOTIFY,this,this.onReceive);
       // Service.getInstance().regist(ROOM_INFO_NOTIFY,this,this.onReceive);
       // Service.getInstance().regist(PLAY_BACK_FINISH_INFO_NOTIFY,this,this.onReceive);


        EventManager.getInstance().regist("DOWN_LOAD_FINISHED_EVENT",this,this.downLoadFinished);
        EventManager.getInstance().regist("DOWN_LOAD_SIZE_EVENT",this,this.downLoadBar);



        this.nextFlow=true;
        this.flowQueue=[];
        this.excuteActionCount=0;
        this.schedule(this.fowLogic, 0.02);
        this.tiQueue=[];
        this.tiNext=0;
        this.schedule(this.actionUpdate, 0.02);

        this.roomObj={};
        this.roomObj.roomState=ROOM_NO_STATE;
        this.roomObj.players=[];

        this.y_a=this.bar_h+10;
        this.gap_h=70;
        this.gap_w=55;

        this.gap_w2=30;
        this.gap_h2=35;

        this.deskLeftCardCount=80;
        this.wordQueue=[];
        this.wordShowCount=0;
        this.hasClearCards=false;

        this.offLineUser={};

        if(gameState!=GAME_PLAYING_IN_ROOM)
        {
            playBgMusic(2);
        }


        this.lineSp=new cc.Sprite("res/ui/room/line_room.png");
        this.addChild(this.lineSp);
        this.lineSp.visible=false;

       // this.schedule(this.testAck, 10);


        ParticleManager.getInstance().buildParticlePool("res/particle/weiraoxingxing_particles.plist",10);

        this.touchMoveParticle= ParticleManager.getInstance().useParticle("res/particle/weiraoxingxing_particles.plist");
        this.addChild(this.touchMoveParticle,TABLE_DESKER_ZOEDER+100);
        this.touchMoveParticle.visible=false;


        this.roleUId=myPlayerInfo.uid;

        this.isStop=true;


        this.loadDataLayer=new cc.Layer();
        this.addChild(this.loadDataLayer,TABLE_DESKER_ZOEDER+100);

        cc.spriteFrameCache.addSpriteFrames("res/ui/playback/dian_playback.plist");

        var animFrames = [];
        var frame, animFrame;
        var str = "";
        for (var i = 1; i <=6; i++) {
            str = "dian"+i+".png";
            frame = cc.spriteFrameCache.getSpriteFrame(str);
           // cc.log("########:"+frame+"==="+str);
            animFrame = new cc.AnimationFrame(frame, 1);
            animFrames.push(animFrame);
        }
        var animation = new cc.Animation(animFrames, 0.1);

        frame = cc.spriteFrameCache.getSpriteFrame("dian1.png");
        var loading = new cc.Sprite(frame);
        var winSize=cc.director.getWinSize();
        loading.x=winSize.width/2;
        loading.y=winSize.height/2;
        this.loadDataLayer.addChild(loading);
        loading.runAction(cc.animate(animation).repeatForever());


        this.loadLab = new cc.LabelTTF("正在加载数据", FONT_NAME_APP, 25);
        this.loadLab.setColor(cc.color(161,51,4));
        var winSize=cc.director.getWinSize();
        this.loadLab.x=winSize.width/2;
        this.loadLab.y=winSize.height/2+30;
        this.loadDataLayer.addChild(this.loadLab);


         this.savePath=jsb.fileUtils.getWritablePath()+"a.bin";
        pushDownLoadQueue("a.bin",3,httpurl);

        this.fileSize=fileSize;


        this.setOperBar();
    },

    setOperBar:function () {

        if(this.operTouchLayer==undefined)
        {
            this.operTouchLayer=new TouchLayer();
            this.addChild(this.operTouchLayer,TABLE_DESKER_ZOEDER+200);

            var playBackLayer= parseUI("res/ui/playback/playBackLayer.json", CENTER);
            this.operTouchLayer.addChild(playBackLayer);

            this.jixu = ccui.helper.seekWidgetByName(playBackLayer, "jixu");
            this.jixu .addTouchEventListener(this.jixuClicked, this);
            this.jixu.visible=false;
            this.jixu.setEnabled(false);
            this.jixu.setTouchEnabled(false);

            this.zanting = ccui.helper.seekWidgetByName(playBackLayer, "zanting");
            this.zanting.addTouchEventListener(this.zantingClicked, this);

            this.fanhui = ccui.helper.seekWidgetByName(playBackLayer, "fanhui");
            this.fanhui.addTouchEventListener(this.fanhuiClicked, this);

            this.backGame = ccui.helper.seekWidgetByName(playBackLayer, "back");
            this.backGame.addTouchEventListener(this.backClicked, this);


            this.frontGame = ccui.helper.seekWidgetByName(playBackLayer, "front");
            this.frontGame.addTouchEventListener(this.frontClicked, this);


        }


    },
    jixuClicked:function (sender, type) {



        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                this.jixu.visible=false;
                this.jixu.setEnabled(false);
                this.jixu.setTouchEnabled(false);

                this.zanting.visible=true;
                this.zanting.setEnabled(true);
                this.zanting.setTouchEnabled(true);

                this.isStop=false;
            }
                break;


            default:
                break;
        }
    },
    zantingClicked:function (sender, type) {


        if(this.isStop)
        {
            return;
        }
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {

                this.jixu.visible=true;
                this.jixu.setEnabled(true);
                this.jixu.setTouchEnabled(true);

                this.zanting.visible=false;
                this.zanting.setEnabled(false);
                this.zanting.setTouchEnabled(false);

                this.isStop=true;

            }
                break;


            default:
                break;
        }
    },
    fanhuiClicked:function (sender, type) {


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
    backClicked:function (sender, type) {


        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {

                this.back();
            }
                break;


            default:
                break;
        }
    },
    frontClicked:function (sender, type) {


        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {

                this.front();
            }
                break;


            default:
                break;
        }
    },
    initUI:function () {


        this.centerNode = parseUI("res/ui/room/center.json", CENTER);
        this.addChild(this.centerNode);
        this.wxButton = ccui.helper.seekWidgetByName(this.centerNode, "Button_1");
        this.wxButton.visible=false;
        this.wxButton.setEnabled(false);
        this.wxButton.setTouchEnabled(false);



        this.dui = ccui.helper.seekWidgetByName(this.centerNode, "dui");
        this.dui.visible=false;

        this.card1 = ccui.helper.seekWidgetByName(this.centerNode, "card1");
        this.card1.visible=false;

        this.zi = ccui.helper.seekWidgetByName(this.centerNode, "zi");
        this.zi.visible=false;

        this.cardLeftCount = ccui.helper.seekWidgetByName(this.centerNode, "count");
        this.cardLeftCount.visible=false;

        this.waitCardsLayer=new cc.Layer();
        this.waitCardsLayer.x=this.card1.x;
        this.waitCardsLayer.y=this.card1.y;
        this.centerNode.addChild(this.waitCardsLayer,1);

        var wxButton = ccui.helper.seekWidgetByName(this.centerNode, "Button_1");
        this.faPaiPos=wxButton.convertToWorldSpace(cc.p(0,0));



        this.roomBaseInfoUI = parseUI("res/ui/room/leftTop.json", LEFT_TOP);
        this.addChild(this.roomBaseInfoUI);



        this.bottomUI = parseUI("res/ui/room/leftBottom.json", CENTER_BOTTOM);
        this.addChild(this.bottomUI,TABLE_DESKER_ZOEDER+3);

        this.leftUI = parseUI("res/ui/room/leftCenter.json", LEFT_CENTER);
        this.addChild(this.leftUI);

        this.rightUI = parseUI("res/ui/room/rightCenter.json", RIGHT_CENTER);
        this.addChild(this.rightUI);

        this.topUI = parseUI("res/ui/room/topCenter.json", CENTER_TOP);
        this.addChild(this.topUI);


        this.speechLayer=new SpeechLayer(this);
        this.addChild(this.speechLayer,81);


  

        this.updateRoomBaseInfoUI();
        this.updateUserUIInfo(BOTTOM_UI,null);
        this.updateUserUIInfo(RIGHT_UI,null);
        this.updateUserUIInfo(TOP_UI,null);
        this.updateUserUIInfo(LEFT_UI,null);



    },
    clearUI:function () {

        if(this.operButtonUI!=undefined)
        {
            this.operButtonUI.removeFromParent(true);
        }
        if(this.centerNode!=undefined)
        {
            this.centerNode.removeFromParent(true);
        }

        if(this.roomBaseInfoUI!=undefined)
        {
            this.roomBaseInfoUI.removeFromParent(true);
        }

        if(this.speechLayer!=undefined)
        {
            this.speechLayer.removeFromParent(true);
        }


        if(this.bottomUI!=undefined)
        {
            this.bottomUI.removeFromParent(true);
        }
        if(this.leftUI!=undefined)
        {
            this.leftUI.removeFromParent(true);
        }
        if(this.rightUI!=undefined)
        {
            this.rightUI.removeFromParent(true);
        }
        if(this.topUI!=undefined)
        {
            this.topUI.removeFromParent(true);
        }

    },




    updateRoomBaseInfoUI:function () {

        //房间ID
        var roomId = ccui.helper.seekWidgetByName(this.roomBaseInfoUI, "roomId");
        roomId.setString("房间ID:"+this.roomInfo.roomId);

        //剩余局数
        var ju = ccui.helper.seekWidgetByName(this.roomBaseInfoUI, "roomId_0");
        ju.setString("剩余局数:"+this.roomInfo.leftCount);

        if(RULE_VALUE==ROOM_TYPE_HONGHU_147)
        {
            ju.visible=true;
        }
        else{
            ju.visible=false;
        }
        //抽水
        var choushui = ccui.helper.seekWidgetByName(this.roomBaseInfoUI, "roomId_1");
        choushui.setString("抽水:"+this.roomInfo.choushui);
        choushui.visible=false;

        //其他
        var roomId_3 = ccui.helper.seekWidgetByName(this.roomBaseInfoUI, "roomId_3");
        roomId_3.setString("");
        roomId_3.visible=false;

        if(RULE_VALUE==ROOM_TYPE_HONGHU_147)
        {
            choushui.visible=true;
            if(this.roomInfo.gunze==3)
            {
                choushui.setString("规则:三胡一墩");
            }
            else if(this.roomInfo.gunze==5)
            {
                choushui.setString("规则:五胡一墩");
            }
            roomId_3.visible=true;

            if(this.roomInfo.qita==0)
            {
                roomId_3.setString("名堂:天地红黑乌+1墩");
            }
            else{
                roomId_3.setString("名堂:天地红黑乌不加墩");
            }


        }

        //时间
        this.time = ccui.helper.seekWidgetByName(this.roomBaseInfoUI, "time");
       // time.setString("时间:");
        this.time.setString("");
        this.time.y=ju.y;

        this.time.visible=false;

    },
    updateUserUIInfo:function (pos,roomUser) {

        var node=null;
        if(pos==BOTTOM_UI)
        {
            node=this.bottomUI;
        }
        else if(pos==RIGHT_UI)
        {
            node=this.rightUI;
        }
        else if(pos==TOP_UI)
        {
            node=this.topUI;
        }
        else if(pos==LEFT_UI)
        {
            node=this.leftUI;
        }

        var xian = ccui.helper.seekWidgetByName(node, "xian");
        var zhuang = ccui.helper.seekWidgetByName(node, "zhuang");
        xian.visible=false;
        zhuang.visible=false;

        var headBg = ccui.helper.seekWidgetByName(node, "head");
        var name = ccui.helper.seekWidgetByName(node, "name");
        var zonghuxi = ccui.helper.seekWidgetByName(node, "zonghuxi");
        var huxi = ccui.helper.seekWidgetByName(node, "huxi");
        headBg.setLocalZOrder(2);
        if(roomUser!=null)
        {
            headBg.addTouchEventListener(this.headClicked,this);
            headBg.uid=roomUser.user.uid;
        }


        if(roomUser==null)
        {
            name.setString("");
            zonghuxi.setString("");
            huxi.setString("");
            node.visible=false;
        }
        else{
            node.visible=true;
            
            if(headBg.hasAddIcon==undefined)
            {
                var uid=roomUser.user.uid;
                var headName=uid+"_head.png";
                var headIconPath=getSkinPath(headName);
                if(checkFileExit(headIconPath))
                {
                    var headSprite=new cc.Sprite(headIconPath);
                    headSprite.x=headBg.x;
                    headSprite.y=headBg.y;
                    headSprite.setScale(head_scale);
                    headBg.getParent().addChild(headSprite,1);
                }
                else{
                    cc.log("需要下载:"+headName+","+roomUser.user.headIcon);
                    pushDownLoadQueue(headName,2,roomUser.user.headIcon);
                }
                headBg.hasAddIcon=true;
            }


            name.setString(roomUser.user.name);
            if(RULE_VALUE==ROOM_TYPE_HONGHU_147)
            {
                zonghuxi.setString("总墩数:"+roomUser.zonghuxi);
            }
            else{
                zonghuxi.setString("总胡息:"+roomUser.zonghuxi);
            }

            huxi.setString("胡息:"+roomUser.huxi);


            roomUser.node=node;

           // cc.log("######2:,uid:"+roomUser.user.uid+",type:"+roomUser.type);
            this.setZhuangXian(roomUser.user.uid,roomUser.type);


            if(roomUser.isOnline==1)
            {
                this.setUserOnLine(roomUser.user.uid,true);
            }
            else{
                this.setUserOnLine(roomUser.user.uid,false);
            }
        }
    },

    getCardsByGroup:function (roomUser) {

        var mySprites=roomUser.cardSpriesLocal;
        var len=mySprites.length;
        //检查是否有3个一样
        var tmpCards={};
        for(var i=0;i<len;i++)
        {
            var sprite=mySprites[i];
            var cd=sprite.card;
            var type=cd.type;
            var value=cd.value;
            var key=type+"_"+value;
            var arr=tmpCards[key];
            if(arr==undefined)
            {
                arr=[];
                arr.push(cd);
                tmpCards[key]=arr;
            }
            else{
                arr.push(cd);
            }

        }

        return tmpCards;

    },

    getThreeGroup:function (roomUser) {

        var groups=this.getCardsByGroup(roomUser);
        var arr=[];
        for(var key in groups)
        {
            var list=groups[key];
            if(list.length==3)
            {
                arr.push(list);
            }

        }

        return arr;

    },

    updateHuXi:function(player)
    {
        var roomUser=this.getRoomUserByUID(player.uid);
        var uiPos=this.getRoomUserUIPos(roomUser);



        var zonghuxi = ccui.helper.seekWidgetByName(roomUser.node, "zonghuxi");
        var huxi = ccui.helper.seekWidgetByName(roomUser.node, "huxi");

        if(RULE_VALUE==ROOM_TYPE_HONGHU_147)
        {
            zonghuxi.setString("总墩数:"+player.score1);
            huxi.setString("胡息:"+player.score2);
        }
        else{
            if(uiPos==BOTTOM_UI)
            {
                zonghuxi.setString("总胡息:"+player.score1);
                //huxi.setString("胡息(桌面/手中):"+player.score2+"/"+player.shouZhongScore);
                huxi.setString("胡息:"+player.score2);
            }
            else{
                zonghuxi.setString("总胡息:"+player.score1);
                huxi.setString("胡息:"+player.score2);
            }
        }

        if(player.uid==this.roleUId)
        {
            if(player.state==1)
            {
                if(this.kaimingjiao==undefined||this.kaimingjiao==null)
                {
                    console.log("[开明胶]");
                    this.kaimingjiao=new cc.Sprite("res/ui/room/kaimingjiao_room.png");
                   // this.kaimingjiao.setScale(2);
                    this.kaimingjiao.x=v_x+v_w-150;
                    this.kaimingjiao.y=v_y+100;
                    this.addChild(this.kaimingjiao,TABLE_DESKER_ZOEDER);
                }


            }
            else{
                if(this.kaimingjiao!=undefined&&this.kaimingjiao!=null)
                {
                    this.kaimingjiao.removeFromParent(true);
                    this.kaimingjiao=null;
                }

            }
        }


    },
    getCardInRoomUserCards1:function (roomUser,type,value) {

        var result=[];
        var arr=roomUser.cardSpriesLocal;
        var len=arr.length;
        for(var i=0;i<len;i++)
        {
            var cardSp=arr[i];
            var card=cardSp.card;
            if(card.type==type&&card.value==value)
            {
                result.push(card);
            }

        }

        return result;
    },
    getRoomUserUIPos:function (roomUser) {

        var myIndex=this.myRoomUser.index;
        var index=roomUser.index;

        if(index==myIndex)
        {
            return BOTTOM_UI;
        }
        cc.log("myIndex:"+myIndex+",index:"+index+",this.roomInfo.renshu:"+this.roomInfo.renshu);

        if(this.roomInfo.renshu==3)//3人玩法
        {


            if(myIndex==0)
            {
                if(index==1)
                {
                    return RIGHT_UI;
                }
                else if(index==2)
                {
                    return LEFT_UI;

                }

            }
            else if(myIndex==1)
            {
                if(index==0)
                {
                    return LEFT_UI;
                }
                else if(index==2)
                {
                    return RIGHT_UI;


                }
            }
            else if(myIndex==2)
            {
                if(index==0)
                {
                    return RIGHT_UI;
                }
                else if(index==1)
                {
                    return LEFT_UI;

                    
                }
            }

        }
        else{//4人

            if(myIndex==0)
            {
                if(index==1)
                {
                    return RIGHT_UI;
                }
                else if(index==2)
                {
                    return TOP_UI;
                }
                else if(index==3)
                {
                    return LEFT_UI;
                }
            }
            else if(myIndex==1)
            {
                if(index==0)
                {
                    return LEFT_UI;
                }
                else if(index==2)
                {
                    return RIGHT_UI;
                }
                else if(index==3)
                {
                    return TOP_UI;
                }
            }
            else if(myIndex==2)
            {
                if(index==0)
                {
                    return TOP_UI;
                }
                else if(index==1)
                {
                    return LEFT_UI;
                }
                else if(index==3)
                {
                    return RIGHT_UI;
                }
            }
            else if(myIndex==3)
            {
                if(index==0)
                {
                    return RIGHT_UI;
                }
                else if(index==1)
                {
                    return TOP_UI;
                }
                else if(index==2)
                {
                    return LEFT_UI;
                }
            }

        }


    },
    resetUserInfo:function()
    {

        var roomUsers=this.roomInfo.roomUsers;
        var len=roomUsers.length;
        for(var i=0;i<len;i++)
        {
            var roomUser=roomUsers[i];
            var uiPos=this.getRoomUserUIPos(roomUser);
            this.updateUserUIInfo(uiPos,roomUser);

        }

    },

    getRoomUserByUID:function (uid) {

        var roomUsers=this.roomInfo.roomUsers;
        var len=roomUsers.length;
        for(var i=0;i<len;i++)
        {
            var roomUser=roomUsers[i];
            if(roomUser.user.uid==uid)
            {
                return roomUser;
            }
        }
        return null;
    },


    posClicked:function(sender, type)
    {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
            {
                sender.setScale(0.65);
            }
                break;
            case ccui.Widget.TOUCH_CANCELED:
            {
                sender.setScale(0.6);
            }
                break;
            case ccui.Widget.TOUCH_ENDED:
            {
                sender.setScale(0.6);

                this.selectePosLayer.removeFromParent(true);

                var index=sender.index;
                this.myRoomUser=this.roomInfo.roomUsers[index];
                this.roleUId=this.myRoomUser.user.uid;


                this.initUI();
                this.resetUserInfo();
                this.serverTime=new Date(this.roomInfo.time);
                this.myStartTime=new Date();

                this.waitSelectedPos=undefined;
                
                playEffect(TOUCH_SOUND);



            }
                break;


            default:
                break;
        }

    },

    onReceive:function(msgNumber,body,target)
    {
        cc.log("#################msgNumber:"+msgNumber);
        switch(msgNumber)
        {

            case ROOM_INFO_NOTIFY:
            {
                cc.log("[房间信息通知]");

                target.clearUI();
                target.roomInfo=body.roomInfo;

                RULE_VALUE=target.roomInfo.roomType;

                target.myRoomUser=target.findRoomUserByUid(target.roleUId);
                if(target.myRoomUser==null)
                {

                    target.waitSelectedPos=true;

                    var count=target.roomInfo.roomUsers.length;

                    target.selectePosLayer=new TouchLayer();
                    target.addChild(target.selectePosLayer,TABLE_DESKER_ZOEDER);

                    var node = parseUI("res/ui/sub/weizhiLayer.json", CENTER);
                    target.selectePosLayer.addChild(node);

                   // cc.log("count:::::"+count);
                    if(count==3)
                    {
                        var t4= ccui.helper.seekWidgetByName(node, "t4");
                        var b4= ccui.helper.seekWidgetByName(node, "b4");
                        t4.visible=false;
                        b4.visible=false;
                    }


                    for(var k=0;k<count;k++)
                    {
                        var key1="t"+(k+1);
                        var key2="b"+(k+1);

                        var roomUser=target.roomInfo.roomUsers[k];
                        var user=roomUser.user;

                        var t= ccui.helper.seekWidgetByName(node, key1);
                        var b= ccui.helper.seekWidgetByName(node, key2);
                        t.setString("玩家["+user.name+"]的位置");
                        b.index=k;
                        b.addTouchEventListener(target.posClicked,target);
                    }

                    return;

                }
                target.initUI();
                target.resetUserInfo();

                //cc.log("body.time:"+body.roomInfo.time);
                target.serverTime=new Date(body.roomInfo.time);
                target.myStartTime=new Date();



            }
                break;
            case FLOWS_NOTIFY:
            {
                cc.log("[房间流程推送]");

                var flows=body.flows;
                var len=flows.length;
                for(var i=0;i<len;i++)
                {
                    var flow=flows[i];
                    target.logFlow(flow);
                    target.flowQueue.push(flow);
                }
                target.isStop=false;


            }
                break;
            case PLAY_BACK_FINISH_INFO_NOTIFY:
            {
                cc.log("结算列表");
                target.gameFinishList=body.infos;

            }
                break;

        }


    },
    jiesanRoomTime:function (dt) {

        SceneManager.getInstance().changeScene(SCENE_01,REPLACE_SCENE);

    },
    setUserOnLine:function(uid,isOnline)
    {
        if(isOnline)
        {
            if(this.offLineUser[uid]!=undefined)
            {
                var lab=this.offLineUser[uid];
                lab.removeFromParent(true);
                delete this.offLineUser[uid];
            }

        }
        else{
            var roomUser=this.getRoomUserByUID(uid);
            if(roomUser!=undefined&&roomUser!=null&&this.offLineUser[uid]==undefined)
            {
                var pos=this.getHeadPos(roomUser,0,0);
               // var lab = new cc.LabelTTF("掉线", FONT_NAME_APP, 20);
                //lab.setColor(cc.color(0,0,255));

                //lab.x=pos.x;
                //lab.y=pos.y;
                var labSp=new cc.Sprite("res/ui/room/lixian_room.png");
                labSp.x=pos.x;
                labSp.y=pos.y;
                roomUser.node.addChild(labSp,10);
                this.offLineUser[uid]=labSp;
            }
        }

    },
    subAndUpdateDeskLeftCount:function () {

        this.deskLeftCardCount--;
        if(this.deskLeftCardCount<0)this.deskLeftCardCount=0;
        this.updateDeskLeftCount();
    },
    updateDeskLeftCount:function () {

        this.cardLeftCount.visible=true;
        this.dui.visible=true;
        this.zi.visible=true;
        this.cardLeftCount.setString(""+this.deskLeftCardCount);

        this.wxButton.visible=false;
        this.wxButton.setEnabled(false);
        this.wxButton.setTouchEnabled(false);

        if(this.waitCardsLayer!=null)
        {
            this.waitCardsLayer.removeAllChildren();

        }


        for(var i=0;i<this.deskLeftCardCount;i++)
        {
            var sp=new cc.Sprite("res/ui/room/card_room.png");
            sp.y+=i*2;
            this.waitCardsLayer.addChild(sp);

            cc.log("########:"+this.deskLeftCardCount);
        }

    },
    synRoomUser:function (oldRoomUser,newRoomUser) {

        newRoomUser.cardSpriesLocal=oldRoomUser.cardSpriesLocal;
        newRoomUser.colsLocal=oldRoomUser.colsLocal;

        newRoomUser.cardSpries2Local=oldRoomUser.cardSpries2Local;
        newRoomUser.cols2Local=oldRoomUser.cols2Local;

        newRoomUser.cardSpries3Local=oldRoomUser.cardSpries3Local;


        return newRoomUser;
    },
    back:function () {

        if(!this.canOperBackOrFront)
        {
            return;
        }
        if(this.playHistoryQueue.length<=0)
        {

            return;
        }
        var obj=this.playHistoryQueue[this.playHistoryQueue.length-1];
        this.playHistoryQueue.splice(this.playHistoryQueue.length-1,1);
        this.index=obj.copyIndex;
        this.flowIndex=obj.flowIndex;
        this.excuteActionCount=0;

        this.roomInfo.leftCount++;
        if(this.roomInfo.leftCount<0)this.roomInfo.leftCount=0;
        this.updateRoomBaseInfoUI();
        this.hasClearCards=false;

        this.canOperBackOrFront=false;


        if(this.playHistoryQueue.length<=0)
        {
            this.lastGameFlowCount=undefined;
        }
        else{
            var obj2=this.playHistoryQueue[this.playHistoryQueue.length-1]
            this.lastGameFlowCount=obj2.flowIndex;
            this.lastCopyIndex=obj2.copyIndex;
            this.playHistoryQueue.splice(this.playHistoryQueue.length-1,1);
            
        }

        cc.log(" this.roomInfo.leftCount:"+ this.roomInfo.leftCount+","+this.playHistoryQueue.length);
    },
    front:function () {


        if(!this.canOperBackOrFront)
        {
            return;
        }
        while(this.flowIndex<this.flowCount)
        {
            this.copyIndex=this.index;
            var tmpCount=this.readDataShort();
            var byteBuff=this.readDataBuf(tmpCount);

            var flow=new Flow();
            flow.read(byteBuff);
            this.flowIndex++;

            if(this.checkFlowHasFaPai(flow))
            {
                this.index=this.copyIndex;
                this.flowIndex-=1;

                this.roomInfo.leftCount--;
                if(this.roomInfo.leftCount<0)this.roomInfo.leftCount=0;
                this.updateRoomBaseInfoUI();
                this.hasClearCards=false;

                this.canOperBackOrFront=false;

                break;

            }

        }


    },

    checkFlowHasFaPai:function (flow) {

        if(flow.type==0)
        {
            return true;
        }
        // var players=flow.players;
        // var len=players.length;
        // for(var i=0;i<len;i++) {
        //     var player = players[i];
        //     var actions = player.actions;
        //     var actionCount = actions.length;
        //
        //     for (var j = 0; j < actionCount; j++) {
        //         var action = actions[j];
        //
        //         switch (action.type) {
        //             case ACTION_FAPAI://发牌
        //             {
        //
        //                 return true;
        //             }
        //                 break;
        //         }
        //     }
       // }

        return false;

    },
    fowLogic:function (dt) {

        if(this.isStop)
        {
            return;
        }
        if(this.excuteActionCount<=0&&(this.waitSelectedPos==undefined))
        {
            // if(this.lastFlowTime==undefined)
            // {
            //     this.lastFlowTime=0;
            // }
            // var ct=new Date().getTime();
            // var t=ct-this.lastFlowTime;


            if(this.flowQueue.length>0)//&&ct>=1000
            {
                //this.lastFlowTime=ct;

                var flow=this.flowQueue[0];
                this.flowQueue.splice(0,1);
                this.excuteFlow(flow);
            }
        }
        if(this.excuteActionCount==0&&this.flowQueue.length==0)
        {

            if(this.flowIndex<this.flowCount)
            {
                this.copyIndex=this.index;

                var tmpCount=this.readDataShort();
                var byteBuff=this.readDataBuf(tmpCount);

                var flow=new Flow();
                flow.read(byteBuff);
                this.flowQueue.push(flow);
                this.flowIndex++;

                if(this.checkFlowHasFaPai(flow))
                {
                    if(this.lastGameFlowCount==undefined)
                    {
                        this.lastGameFlowCount=0;
                        this.lastCopyIndex=0;

                    }
                    else{

                        var historyObj={};
                        historyObj.copyIndex=this.lastCopyIndex;
                        historyObj.flowIndex=this.lastGameFlowCount;
                        this.playHistoryQueue.push(historyObj);

                    }

                    this.lastGameFlowCount=this.flowIndex-1;
                    this.lastCopyIndex=this.copyIndex;

                }
                cc.log("添加流程:"+this.flowIndex+"/"+this.flowCount);
            }
            else{


                var count=this.gameFinishList.length;
                cc.log("总结算:"+count);
                for(var i=0;i<count;i++)
                {
                    var info=this.gameFinishList[i];
                    cc.log("总结算info.state:"+info.state);
                    if(info.state==1||info.state==2)
                    {
                        this.gameFinishedNotify=info;
                        this.showFinishedScoreLayer();
                        this.unschedule(this.fowLogic);
                        this.isStop=true;
                        break;
                    }

                }

            }





        }
        else{
            //cc.log("[流程this.excuteActionCount:"+this.excuteActionCount+"]"+this.flowQueue.length);
        }

        // if(this.time!=undefined&&this.time!=null&&this.myStartTime!=undefined)
        // {
        //
        //
        //     var dis=new Date().getTime()-this.myStartTime.getTime();
        //     var a=this.serverTime.getTime()+dis;
        //     //cc.log("dis:"+dis+",a:"+a);
        //     var str=new Date(a).Format("hh:mm:ss");//yyyy/MM/dd
        //     this.time.setString("时间:"+str);
        //
        //
        // }

    },
    logActionName:function (type,name,count) {

        switch(type) {
            case ACTION_FAPAI://发牌
            {
               cc.log("["+name+":动作-发牌-actionCount:"+count+"]");

            }
                break;
            case ACTION_TI:
            {

                cc.log("["+name+":动作-提-actionCount:"+count+"]");
            }
                break;
            case ACTION_PAO:
            {
                cc.log("["+name+":动作-跑-actionCount:"+count+"]");
            }
                break;
            case ACTION_KECHI:
            {
                cc.log("["+name+":动作-可吃-actionCount:"+count+"]");
            }
                break;
            case ACTION_CHI:
            {
                cc.log("["+name+":动作-吃-actionCount:"+count+"]");
            }
                break;
            case ACTION_KEHU:
            {
                cc.log("["+name+":动作-可胡-actionCount:"+count+"]");
            }
                break;
            case ACTION_KEHU2:
            {
                cc.log("["+name+":动作-可胡2-actionCount:"+count+"]");
            }
                break;
            case ACTION_HU:
            {
                cc.log("["+name+":动作-胡-actionCount:"+count+"]");
            }
                break;
            case ACTION_KEPENG:
            {
                cc.log("["+name+":动作-可碰-actionCount:"+count+"]");
            }
                break;
            case ACTION_PENG:
            {
                cc.log("["+name+":动作-碰-actionCount:"+count+"]");
            }
                break;
            case ACTION_WAIT_PUT:
            {
                cc.log("["+name+":动作-等待发牌-actionCount:"+count+"]");
            }
                break;
            case ACTION_PUT:
            {
                cc.log("["+name+":动作-发牌-actionCount:"+count+"]");
            }
                break;

            case ACTION_HIDE_BUTTON:
            {
                cc.log("["+name+":动作-隐藏按钮-actionCount:"+count+"]");
            }
                break;
            case ACTION_CANCLE_TIMEOUT:
            {
                cc.log("["+name+":动作-取消超时-actionCount:"+count+"]");
            }
                break;
            case ACTION_WEI:
            {
                cc.log("["+name+":动作-偎-actionCount:"+count+"]");
            }
                break;
            case ACTION_TOUCH:
            {
                cc.log("["+name+":动作-摸-actionCount:"+count+"]");
            }
                break;
            case ACTION_TAKE_IN:
            {
                cc.log("["+name+":动作-收-actionCount:"+count+"]");
            }
                break;
            case ACTION_GET:
            {
                cc.log("["+name+":动作-补-actionCount:"+count+"]");
            }
                break;
            case ACTION_TI2:
            {
                cc.log("["+name+":偎转提-actionCount:"+count+"]");
            }
                break;
            case ACTION_PAO2:
            {
                cc.log("["+name+":碰转跑-actionCount:"+count+"]");
            }
                break;
            case ACTION_HUANGZHUANG:
            {
                cc.log("["+name+":黄庄-actionCount:"+count+"]");
            }
                break;
            case ACTION_NO:
            {
                cc.log("["+name+":无动作-actionCount:"+count+"]");
            }
                break;
            case ACTION_CARD_MOVE_TO_CARDS1:
            {
                cc.log("["+name+":牌摸到玩家手中-第21张动作-actionCount:"+count+"]");
            }
                break;
            default:
            {
                cc.log("["+name+":动作-未知-actionCount:"+count+"]");
            }
                break;
        }
    },
    logFlow:function (flow) {

        cc.log("=======================start=======================");

        switch(flow.type)
        {

            case 0://刷新玩家信息
            {


            }
                break;
            case 1://动作
            {
                var players=flow.players;
                var len=players.length;
                // cc.log("[动作玩家:"+len+"]");
                for(var i=0;i<len;i++)
                {
                    var player=players[i];

                    var actions=player.actions;
                    var actionCount=actions.length;
                    if(actionCount<=0)
                    {
                        //cc.log("[此流程无动作可执行:"+player.name+"]");
                    }

                    for(var j=0;j<actionCount;j++)
                    {
                        var action=actions[j];
                        this.logActionName(action.type,player.uid,this.excuteActionCount);

                    }


                }


            }
                break;
            case 2://本局臭牌
            {
                cc.log("[本局臭局]");

                //this.showFinishedLayer();
            }
                break;



        }
        cc.log("=======================end=======================");


    },
   releaseActionCount:function (str) {

       if(this.excuteActionCount==0)
       {
           cc.log("注意:this.excuteActionCount已经为0");
       }

       this.excuteActionCount--;
       if(this.excuteActionCount<0)this.excuteActionCount=0;

       cc.log("[递减ActionCount]==="+str+",this.excuteActionCount:"+this.excuteActionCount);
   },
    resetActionCount:function (str) {



        this.excuteActionCount=0;

    },
    setZhuangXian:function (uid,roleType) {

        var roomUser=this.getRoomUserByUID(uid);
        var node=roomUser.node;

        var zhuang = ccui.helper.seekWidgetByName(node, "zhuang");
        zhuang.visible=false;

        var xian = ccui.helper.seekWidgetByName(node, "xian");
        xian.visible=false;

         cc.log("player.roleType:"+roleType+",uid:"+uid);
        if(roleType==ZHUANGJIA_TYPE)
        {
           // var zhuang = ccui.helper.seekWidgetByName(node, "zhuang");
            zhuang.visible=true;
        }
        else if(roleType==XIANJIA_TYPE){
            //var xian = ccui.helper.seekWidgetByName(node, "xian");
            xian.visible=true;

        }
    },
    excuteFlow:function (flow) {



        switch(flow.type)
        {

            case 0://刷新玩家信息
            {

               // cc.log("[开局玩家刷新]");
                var players=flow.players;
                var len=players.length;
                for(var i=0;i<len;i++) {
                    var player = players[i];

                   // cc.log("######1");
                    this.setZhuangXian(player.uid,player.roleType);
                }

                this.deskLeftCardCount=80;
                this.updateDeskLeftCount();
            }
                break;
            case 1://动作
            {
                var players=flow.players;
                var len=players.length;
               // cc.log("[动作玩家:"+len+"]");
                for(var i=0;i<len;i++)
                {
                    var player=players[i];

                    var actions=player.actions;
                    var actionCount=actions.length;
                    if(actionCount<=0)
                    {
                        cc.log("[此流程无动作可执行:"+player.name+"]");
                    }

                    for(var j=0;j<actionCount;j++)
                    {
                        var action=actions[j];

                        /*

                         var ACTION_FAPAI=0;//发牌
                         var ACTION_TI=1;//1:提
                         var ACTION_PAO=2;//2:跑
                         var ACTION_KECHI=3;//3:可吃
                         var ACTION_CHI=4;//4:吃
                         var ACTION_KEHU=5;//5:可胡
                         var ACTION_HU=6;//6:胡
                         var ACTION_KEPENG=7;//7:可碰
                         var ACTION_PENG=8;//8:碰
                         var ACTION_WAIT_PUT=9;//9:等待出牌
                         var ACTION_PUT=10;//10:出牌
                         var ACTION_HIDE_BUTTON=11;// 11:隐藏选择按钮
                         var ACTION_CANCLE_TIMEOUT=12;// 12:取消超时等待
                         var ACTION_WEI=13;// 13:偎

                         */
                        this.excuteActionCount++;

                        this.logActionName(action.type,player.name,this.excuteActionCount);


                        switch(action.type)
                        {
                            case ACTION_FAPAI://发牌
                            {

                                this.canOperBackOrFront=true;
                                
                                this.actionFaPai(player,action);
                                
                            }
                                break;
                            case ACTION_TI:
                            {

                                this.actionTi(player,action);
                            }
                                break;
                            case ACTION_PAO:
                            {
                                this.actionPao(player,action);
                            }
                                break;
                            case ACTION_PAO2:
                            {
                                this.actionPao2(player,action);
                            }
                                break;
                            case ACTION_KECHI:
                            {
                                this.actionKeChi(player,action);
                            }
                                break;
                            case ACTION_CHI:
                            {
                                this.actionChi(player,action);
                            }
                                break;
                            case ACTION_KEHU:
                            {
                                this.actionKeHu(player,action);
                            }
                                break;
                            case ACTION_KEHU2:
                            {
                                this.actionKeHu2(player,action);
                            }
                                break;
                            case ACTION_HU:
                            {
                                this.actionHu(player,action);
                            }
                                break;
                            case ACTION_KEPENG:
                            {
                                this.actionKePeng(player,action);
                            }
                                break;
                            case ACTION_PENG:
                            {
                                this.actionPeng(player,action);
                            }
                                break;
                            case ACTION_WAIT_PUT:
                            {
                                this.actionWaitPut(player,action);
                            }
                                break;
                            case ACTION_PUT:
                            {
                                this.actionPut(player,action);
                            }
                                break;

                            case ACTION_HIDE_BUTTON:
                            {
                                this.actionHideButton(player,action);
                            }
                                break;
                            case ACTION_CANCLE_TIMEOUT:
                            {
                                this.actionCancleTimeOut(player,action);
                            }
                                break;
                            case ACTION_WEI:
                            {
                                this.actionWei(player,action);
                            }
                                break;
                            case ACTION_TOUCH:
                            {
                                this.actionTouch(player,action);
                            }
                                break;
                            case ACTION_TAKE_IN:
                            {
                                this.actionTakeIn(player,action);
                            }
                                break;
                            case ACTION_GET:
                            {
                                this.actionGet(player,action);
                            }
                                break;
                            case ACTION_TI2:
                            {
                                this.actionWeiTi(player,action);
                            }
                                break;
                            case ACTION_HUANGZHUANG:
                            {
                                this.actionHuangZhuang(player,action);
                            }
                                break;
                            case ACTION_NO:
                            {
                                this.actionNo(player,action);
                            }
                                break;
                            case ACTION_CARD_MOVE_TO_CARDS1:
                            {
                                this.actionCard_21(player,action);
                            }
                                break;


                        }


                    }

                    this.updateHuXi(player);

                }


            }
                break;
            case 2://本局臭牌
            {
                cc.log("[本局臭局]");

                //this.showFinishedLayer();
            }
                break;



        }



    },
   testAck:function (dt) {

       if(this.ackQueue!=undefined&&this.ackQueue.length>0)
       {
           var len=this.ackQueue.length;
           for(var i=0;i<len;i++)
           {
               var obj=this.ackQueue[i];

               obj.t+=dt;
               if(obj.t>10)
               {
                   var action=obj.action;
                   var req=new AckRequest();
                   req.uid=this.roleUId;
                   req.roomId=this.roomInfo.roomId;;
                   req.type=action.type;
                   socketMgr.socket.send(ACK_REQUEST,req);
                   cc.log("[ACK发送]");

                   this.ackQueue.splice(i,1);
                   i--;
                   len--;
               }

           }


       }


   },
    hideFinishedLayer:function () {

        if(this.finishedLayer!=undefined&&this.finishedLayer!=null)
        {
            this.finishedLayer.removeFromParent(true);
            this.finishedLayer=null;

           // this.unschedule(this.finishedLayerTime);
        }

    },
    finishedLayerTime:function (dt) {

        if(this.gameFinishedNotify!=undefined&&this.gameFinishedNotify!=null)
        {
            var time=new Date().getTime();
            var t=30-(time-this.gameFinishedNotify.startTime)/1000;
            t=Math.round(t);
            if(t<0)t=0;

            if(this.gameFinishedNotify.state==0)
            {
                this.finishedLayer.setLeftTime(t);
            }
            // else{
            //     this.finishedT1.setString(""+t);
            // }

            cc.log("游戏等待计时:"+t);
            if(t<=0)
            {

                this.hideFinishedLayer();
            }

        }

    },
    showFinishedScoreLayer:function () {
        
        var layer=new FinishScoreLayer(this.gameFinishedNotify,this);
        this.addChild(layer,TABLE_DESKER_ZOEDER+100);

    },
    showFinishedLayer:function () {


        if(this.roomTip!=null&&this.roomTip!=undefined)
        {
            this.roomTip.removeFromParent(true);
            this.roomTip=null;
        }

        if(this.gameFinishedNotify!=undefined&&this.gameFinishedNotify!=null)
        {

            this.finishedLayer=new FinishLayer(this.gameFinishedNotify,this);
            this.addChild(this.finishedLayer,TABLE_DESKER_ZOEDER+100);

            if(this.gameFinishedNotify.state==0)
            {
                //this.gameFinishedNotify.startTime=new Date().getTime();
               // this.schedule(this.finishedLayerTime, 0.1);
            }


             this.hasClearCards=false;

           

        }





    },
    nextGameStart:function (sender, type) {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                this.hideFinishedLayer();
                this.hideSlectedButton(this.roleUId);

                var req=new ReadyRequest();
                req.uid=this.roleUId;
                req.roomId=this.roomInfo.roomId;
                socketMgr.socket.send(READY_REQUEST,req);
            }
                break;


            default:
                break;
        }

    },
   

    clearAllCard:function () {

        // if(this.deletedSP==undefined)
        // {
        //     this.deletedSP={};
        // }
        var roomUsers=this.roomInfo.roomUsers;
        var len=roomUsers.length;
        for(var i=0;i<len;i++)
        {
            var roomUser=roomUsers[i];

            // if(roomUser.cardSpriesLocal!=undefined) {
            //     var count = roomUser.cardSpriesLocal.length;
            //     for (var j = 0; j < count; j++) {
            //         var cardSprite = roomUser.cardSpriesLocal[j];
            //
            //         // if (this.deletedSP[cardSprite.card.c_id] != undefined) {
            //         //
            //         //     cc.log("[#1已经删除过此牌:"+roomUser.user.name+",type"+cardSprite.card.type+",value:"+cardSprite.card.value+"]");
            //         // }
            //         // this.deletedSP[cardSprite.card.c_id] = cardSprite;
            //
            //         cardSprite.removeFromParent(true);
            //     }
            //     roomUser.cardSpriesLocal=[];
            //
            //     if(roomUser.cardSpries2Local!=undefined)
            //     {
            //         count=roomUser.cardSpries2Local.length;
            //         for(var j=0;j<count;j++)
            //         {
            //             var cardSprite=roomUser.cardSpries2Local[j];
            //
            //             // if (this.deletedSP[cardSprite.card.c_id]!= undefined) {
            //             //
            //             //     var oldSp=this.deletedSP[cardSprite.card.c_id];
            //             //     cc.log("[#2已经删除过此牌:"+roomUser.user.name+",type"+cardSprite.card.type+",value:"+cardSprite.card.value+"]");
            //             //     var roomUser2=this.getRoomUserByUID(oldSp.uid);
            //             //     cc.log("oldSp: name:"+roomUser2.user.name);
            //             // }
            //             //this.deletedSP[cardSprite.card.c_id] = cardSprite;
            //
            //
            //             cardSprite.removeFromParent(true);
            //         }
            //         roomUser.cardSpries2Local=[];
            //
            //     }
            //     if(roomUser.cardSpries3Local!=undefined)
            //     {
            //         count=roomUser.cardSpries3Local.length;
            //         for(var j=0;j<count;j++)
            //         {
            //             var cardSprite=roomUser.cardSpries3Local[j];
            //
            //             // if (this.deletedSP[cardSprite.card.c_id] != undefined) {
            //             //
            //             //     cc.log("[#3已经删除过此牌:"+roomUser.user.name+",type"+cardSprite.card.type+",value:"+cardSprite.card.value+"]");
            //             // }
            //             // this.deletedSP[cardSprite.card.c_id] = cardSprite;
            //
            //
            //
            //             cardSprite.removeFromParent(true);
            //         }
            //         roomUser.cardSpries3Local=[];
            //     }
            //
            // }

            roomUser.cardSpriesLocal=[];
            roomUser.cardSpries2Local=[];
            roomUser.cardSpries3Local=[];
            roomUser.colsLocal=[];
            roomUser.cols2Local=[];


        }

        this.removeChildsByTag(CARD_SPRITE_TAG);


    },
    showWorld:function (worldType,uid) {

        var obj={};
        obj.type=worldType;
        obj.uid=uid;
        this.wordQueue.push(obj);



    },
    actionFaPai:function (player,action) {

        if(!this.hasClearCards)
        {
            this.clearAllCard();
            this.hasClearCards=true;
        }
        this.lineSp.visible=true;
        this.lineSp.x=v_x+v_w/2;
        this.lineSp.y=v_y+360;

        this.roomObj.roomState=ROOM_GAMEING_STATE;
        
        this.hideFinishedLayer();
        this.hideSlectedButton(this.roleUId);
        this.removeClock(null);

        gameState=GAME_PLAYING_IN_ROOM;
        stopBgMusic();

        var roomUser=this.getRoomUserByUID(player.uid);
        roomUser.cardSpriesLocal=[];
        roomUser.moveActionCount=0;

        var node=roomUser.node;
        var uiPos=this.getRoomUserUIPos(roomUser);
        var pos={x:0,y:0};
        var winSize=cc.winSize;

        this.faPaiPos.x=winSize.width/2;
        this.faPaiPos.y=winSize.height/2;

        var rotation=0;
        if(uiPos==BOTTOM_UI)
        {
            pos.x=v_x+v_w/2;
            pos.y=100;

            //cc.log("[name:"+roomUser.user.name+"-BOTTOM_UI-"+roomUser.index+"]");
        }
        else if(uiPos==RIGHT_UI)
        {
            pos.x=v_x+v_w-100;
            pos.y=v_y+v_h/2;

            rotation=90;
            //cc.log("[name:"+roomUser.user.name+"-RIGHT_UI]"+roomUser.index+"]");
        }
        else if(uiPos==TOP_UI)
        {
            pos.x=v_x+v_w/2;
            pos.y=v_y+v_h-100;

            rotation=180;

            //cc.log("[name:"+roomUser.user.name+"-TOP_UI]");
        }
        else if(uiPos==LEFT_UI)
        {
            pos.x=100;
            pos.y=v_y+v_h/2;

            rotation=-90;

           // cc.log("[name:"+roomUser.user.name+"-LEFT_UI]");
        }
        var hasMoveAction=false;
        var groupCards=action.groupCards;
        var len=groupCards.length;
        for(var i=0;i<len;i++)
        {
            var groudCard=groupCards[i];
            var cards=groudCard.cards;
            var count=cards.length;
         //   cc.log("count:::"+count);
            var zOrder=count;
            for(var j=0;j<count;j++)
            {
                var card=cards[j];
                var cardSprite=new CardSprite();
                cardSprite.createCard(card);
                cardSprite.changeToBg(true);
                cardSprite.x=this.faPaiPos.x;
                cardSprite.y=this.faPaiPos.y;
                cardSprite.uid=roomUser.user.uid;
                cardSprite.setRotate(rotation);
                cardSprite.setScl(0);
                cardSprite.setTag(CARD_SPRITE_TAG);
                this.addChild(cardSprite,zOrder);
                zOrder--;

                roomUser.moveActionCount++;



                var delayAction=cc.delayTime(j*(0.02));
                var moveAction = cc.moveTo(0.1+DELEAY_TEST, pos);
                var actionCallbackFunction = cc.callFunc(this.moveActionFinishCallFunction, this, cardSprite);
                 var actionArray=[];
                 actionArray.push(delayAction);
                 actionArray.push(moveAction);
                 actionArray.push(actionCallbackFunction);
               // cc.log("####1#");
                var actionSequence = cc.sequence(actionArray);
                var scaleTo=cc.scaleTo(0.5,1);
                //var ac=cc.spawn(scaleTo,actionSequence);
                cardSprite.runAction(actionSequence);
                cardSprite.runActionWithSp(scaleTo);

                hasMoveAction=true;
            }

        }

        if(!hasMoveAction)
        {
            this.releaseActionCount("发牌");
        }

        playEffect("sendcard.mp3");
    },
    moveActionFinishCallFunction : function(cardSprite){
       // cc.log("Action Finish Callback Function uid:"+cardSprite.uid);
        var roomUser=this.getRoomUserByUID(cardSprite.uid);
        roomUser.moveActionCount--;
        cardSprite.visible=false;
        roomUser.cardSpriesLocal.push(cardSprite);

        this.subAndUpdateDeskLeftCount();

        if(roomUser.moveActionCount<=0)
        {


            this.sortRoomUserCard(roomUser);
            this.resetMyCardPos(roomUser,null);

            this.releaseActionCount("发牌移动完成");

           // cc.log("this.excuteActionCount:"+this.excuteActionCount);

        }


    },
    resetMyCardPos3:function (roomUser) {

        var len=roomUser.cardSpries3Local.length;
        for(var i=0;i<len;i++)
        {
            var cardSprite=roomUser.cardSpries3Local[i];

            var pos=this.getHeadPos(roomUser,0,0);
            var uiPos=this.getRoomUserUIPos(roomUser);

            var hasAddCount=i;

            if(uiPos==BOTTOM_UI)
            {
                pos.x=v_x+110;
                pos.y=v_y+110+60;


                pos.x+=hasAddCount*30;
                pos.y-=50;
            }
            else if(uiPos==RIGHT_UI)
            {
                pos.x=pos.x-70-hasAddCount*30;
                pos.y=pos.y-90;

            }
            else if(uiPos==TOP_UI)
            {
                pos.x=pos.x-95-hasAddCount*30;
                pos.y=pos.y-115;


            }
            else{
                pos.x=pos.x+70+hasAddCount*30;
                pos.y=pos.y-70;
            }

            cardSprite.x=pos.x;
            cardSprite.y=pos.y;
            //if(OLD_CARD==1)
            {
                //cardSprite.setScl(SMALL_CARD_SCL2);
            }

        }





    },
    resetMyCardPos:function (roomUser,myCard) {

        if(roomUser.colsLocal==undefined)
        {
            return cc.p(0,0);
        }
        var uiPos=this.getRoomUserUIPos(roomUser);
        var headPos=this.getHeadPos(roomUser,0,0);

        var m_w=0;
        if(RULE_VALUE==ROOM_TYPE_HONGHU_147)
        {
            m_w=200;
        }
        var tmpH=30;
        var tmpW=25;

        if(uiPos==BOTTOM_UI)
        {
            var x=v_x+v_w/2;
            var y=v_y+this.y_a;


            var len=roomUser.colsLocal.length;
            var init_x=x-(len-1)/2*this.gap_w;

            for(var i=0;i<len;i++)
            {
                var arr=roomUser.colsLocal[i];
                var size=arr.length;
                for(var j=0;j<size;j++)
                {
                    var card=arr[j];

                    if(myCard!=null)
                    {


                        if(myCard.c_id==card.c_id)
                        {
                            var myPos=cc.p(0,0);
                            myPos.x=init_x;
                            myPos.y=y+(j*this.gap_h);

                            cc.log("#####1:"+myPos.x+","+myPos.y);
                            return myPos;
                        }

                        continue;
                    }

                    var cardSprite=this.getCardSpriteByCardId(roomUser,card.c_id);
                    cardSprite.visible=true;
                    cardSprite.x=init_x;
                    cardSprite.y=y+(j*this.gap_h);
                    cardSprite.setLocalZOrder(size-j);
                    cardSprite.changeToSmall();
                   // if(OLD_CARD==1)
                    {
                        cardSprite.setScl(SMALL_CARD_SCL);
                    }


                    if(size==3)
                    {
                        var c1=arr[0];
                        var c2=arr[1];
                        var c3=arr[2];
                        if(c1.type==c2.type&&c1.value==c2.value&&c1.type==c3.type&&c1.value==c3.value)
                        {
                            cardSprite.setGray();
                        }

                    }
                }
                init_x+=this.gap_w;
            }
        }
        else if(uiPos==RIGHT_UI)
        {

            var x=headPos.x+20-m_w;
            var y=headPos.y+110;


            var len=roomUser.colsLocal.length;


            for(var i=0;i<len;i++)
            {
                var arr=roomUser.colsLocal[i];
                var size=arr.length;
                for(var j=0;j<size;j++)
                {
                    var card=arr[j];

                    if(myCard!=null)
                    {


                        if(myCard.c_id==card.c_id)
                        {
                            var myPos=cc.p(0,0);
                            myPos.x=x;
                            myPos.y=y+(j*tmpW);

                            //cc.log("#####2:"+myPos.x+","+myPos.y);

                            return myPos;
                        }

                        continue;
                    }

                    var cardSprite=this.getCardSpriteByCardId(roomUser,card.c_id);
                    cardSprite.visible=true;
                    cardSprite.x=x;
                    cardSprite.y=y+(j*tmpW);
                    cardSprite.setLocalZOrder(size-j);
                    cardSprite.changeToSmall();
                    //if(OLD_CARD==1)
                    {
                        cardSprite.setScl(0.3);
                    }

                    if(size==3)
                    {
                        var c1=arr[0];
                        var c2=arr[1];
                        var c3=arr[2];
                        if(c1.type==c2.type&&c1.value==c2.value&&c1.type==c3.type&&c1.value==c3.value)
                        {
                            cardSprite.setGray();
                        }

                    }

                }
                x-=tmpW;
            }
        }
        else if(uiPos==TOP_UI)
        {



            var x=headPos.x+230;
            var y=headPos.y+90;

            var len=roomUser.colsLocal.length;
            x=x-(len-1)/2*tmpW;
            y-=4*tmpH;

            for(var i=0;i<len;i++)
            {
                var arr=roomUser.colsLocal[i];
                var size=arr.length;
                for(var j=0;j<size;j++)
                {
                    var card=arr[j];

                    if(myCard!=null)
                    {


                        if(myCard.c_id==card.c_id)
                        {
                            var myPos=cc.p(0,0);
                            myPos.x=x;
                            myPos.y=y+(j*tmpH);

                            cc.log("#####3:"+myPos.x+","+myPos.y);

                            return myPos;
                        }

                        continue;
                    }

                    var cardSprite=this.getCardSpriteByCardId(roomUser,card.c_id);
                    cardSprite.visible=true;
                    cardSprite.x=x;
                    cardSprite.y=y+(j*tmpH);
                    cardSprite.setLocalZOrder(size-j);
                    cardSprite.changeToSmall();
                    //if(OLD_CARD==1)
                    {
                        cardSprite.setScl(0.3);
                    }

                    if(size==3)
                    {
                        var c1=arr[0];
                        var c2=arr[1];
                        var c3=arr[2];
                        if(c1.type==c2.type&&c1.value==c2.value&&c1.type==c3.type&&c1.value==c3.value)
                        {
                            cardSprite.setGray();
                        }

                    }

                }
                x+=tmpW;
            }

        }
        else if(uiPos==LEFT_UI)
        {

            var x=headPos.x-20+m_w;
            var y=headPos.y+110;


            var len=roomUser.colsLocal.length;
           // var init_x=y-(len-1)/2*this.gap_h;

            for(var i=0;i<len;i++)
            {
                var arr=roomUser.colsLocal[i];
                var size=arr.length;
                for(var j=0;j<size;j++)
                {
                    var card=arr[j];

                    if(myCard!=null)
                    {


                        if(myCard.c_id==card.c_id)
                        {
                            var myPos=cc.p(0,0);
                            myPos.x=x;
                            myPos.y=y+j*tmpH;

                            cc.log("#####4:"+myPos.x+","+myPos.y);
                            return myPos;
                        }

                        continue;
                    }

                    var cardSprite=this.getCardSpriteByCardId(roomUser,card.c_id);
                    cardSprite.visible=true;
                    cardSprite.x=x;
                    cardSprite.y=y+j*tmpH;
                    cardSprite.setLocalZOrder(size-j);
                    cardSprite.changeToSmall();

                   // if(OLD_CARD==1)
                    {
                        cardSprite.setScl(0.3);
                    }

                    if(size==3)
                    {
                        var c1=arr[0];
                        var c2=arr[1];
                        var c3=arr[2];
                        if(c1.type==c2.type&&c1.value==c2.value&&c1.type==c3.type&&c1.value==c3.value)
                        {
                            cardSprite.setGray();
                        }

                    }
                }
                x+=tmpW;
            }


        }



    },

    resetSort:function (roomUser,arr) {

        var tmpArr=[];
        var size=arr.length;


        for(var j=0;j<size;j++) {
            var card = arr[j];

            var cardSprite=this.getCardSpriteByCardId2(roomUser,card.c_id);

            if(cardSprite.isChangeColor!=undefined&&cardSprite.isChangeColor)
            {

            }
            else if(cardSprite.isPut!=undefined&&cardSprite.isPut==1)
            {

            }
            else if(cardSprite.isBi!=undefined&&cardSprite.isBi)
            {

            }
            else{
                tmpArr.push(card);
            }


        }

        
        for(var j=0;j<size;j++) {
            var card = arr[j];

            var cardSprite=this.getCardSpriteByCardId2(roomUser,card.c_id);


            if(cardSprite.isChangeColor!=undefined&&cardSprite.isChangeColor)
            {
                tmpArr.push(card);
            }
            else if(cardSprite.isPut!=undefined&&cardSprite.isPut==1)
            {
                tmpArr.push(card);
            }
            else if(cardSprite.isBi!=undefined&&cardSprite.isBi)
            {
                tmpArr.push(card);
                //cc.log("#######reset cardSprite.isBi");
            }


        }


        return tmpArr;

    },

    getPosOfCardInMyCards2:function (roomUser,checkCard) {

        var uiPos=this.getRoomUserUIPos(roomUser);
        var node=roomUser.node;
        var head = ccui.helper.seekWidgetByName(node, "head");
        var pos=head.convertToWorldSpace(cc.p(0,0));

        var g_w=30;
        var g_h=30;

        if(uiPos==BOTTOM_UI)
        {

            var x=v_x+110;
            var y=v_y+110+50;

            var len=roomUser.cols2Local.length;
            var init_x=x;

            for(var i=0;i<len;i++)
            {
                var arr=roomUser.cols2Local[i];
                var size=arr.length;
                var sortArr=this.resetSort(roomUser,arr);

                for(var j=0;j<size;j++)
                {
                    var card=sortArr[j];

                    if(card.c_id==checkCard.c_id)
                    {
                        return cc.p(init_x,y+(j*g_h));
                    }

                }
                init_x+=g_w;
            }
        }
        else if(uiPos==RIGHT_UI)
        {

            var x=pos.x-30;
            var y=pos.y;

            var len=roomUser.cols2Local.length;
            var init_x=x;

            for(var i=0;i<len;i++)
            {
                var arr=roomUser.cols2Local[i];
                var size=arr.length;
                var sortArr=this.resetSort(roomUser,arr);

                for(var j=0;j<size;j++)
                {
                    var card=sortArr[j];

                    if(card.c_id==checkCard.c_id)
                    {
                        return cc.p(init_x,y+(j*g_h));
                    }



                }
                init_x-=g_w;
            }
        }
        else if(uiPos==TOP_UI)
        {

            var x=pos.x-55;
            var y=pos.y-25;

            var len=roomUser.cols2Local.length;
            var init_x=x;

            for(var i=0;i<len;i++)
            {
                var arr=roomUser.cols2Local[i];
                var size=arr.length;

                var sortArr=this.resetSort(roomUser,arr);

                for(var j=0;j<size;j++)
                {
                    var card=sortArr[j];

                    if(card.c_id==checkCard.c_id)
                    {
                        return cc.p(init_x,y+(j*g_h));
                    }


                }
                init_x-=g_w;
            }
        }
        else if(uiPos==LEFT_UI)
        {

            var x=pos.x+110;
            var y=pos.y+20;

            var len=roomUser.cols2Local.length;
            var init_x=x;

            for(var i=0;i<len;i++)
            {
                var arr=roomUser.cols2Local[i];
                var size=arr.length;

                var sortArr=this.resetSort(roomUser,arr);

                for(var j=0;j<size;j++)
                {
                    var card=sortArr[j];

                    if(card.c_id==checkCard.c_id)
                    {
                        return cc.p(init_x,y+(j*g_h));
                    }


                }
                init_x+=g_w;
            }


        }

        return cc.p(0,0);

    },
    resetMyCardPos2:function (roomUser) {

        var uiPos=this.getRoomUserUIPos(roomUser);
        var node=roomUser.node;
        var head = ccui.helper.seekWidgetByName(node, "head");
        var pos=head.convertToWorldSpace(cc.p(0,0));

        var g_w=this.gap_w2;
        var g_h=this.gap_h2;

        if(uiPos==BOTTOM_UI)
        {

            var x=v_x+110;
            var y=v_y+110+50;

            var len=roomUser.cols2Local.length;
            var init_x=x;

            for(var i=0;i<len;i++)
            {
                var arr=roomUser.cols2Local[i];
                var size=arr.length;

                var sortArr=this.resetSort(roomUser,arr);
               // cc.log("@@@@@@@@@:"+size);
                for(var j=0;j<size;j++)
                {
                    var card=sortArr[j];
                    cc.log("card c_id:"+j+"-"+card.c_id);
                    var cardSprite=this.getCardSpriteByCardId2(roomUser,card.c_id);
                    cardSprite.visible=true;

                    cardSprite.x=init_x;
                    cardSprite.y=y+(j*g_h);
                    cardSprite.setLocalZOrder(size-j);
                    cardSprite.changeToSmall2();
                    if(card.isBack==1)
                    {
                        //背面
                        cardSprite.changeToBg(false);
                    }
                    if(cardSprite.isChangeColor!=undefined&&cardSprite.isChangeColor)
                    {
                        cardSprite.setBlue();
                    }

                    if(cardSprite.isPut!=undefined&&cardSprite.isPut==1)
                    {
                        cardSprite.setRed();
                    }
                    //if(OLD_CARD==1)
                    {
                      //  cardSprite.setScl(SMALL_CARD_SCL2);
                    }

                }
                init_x+=g_w;
            }
        }
        else if(uiPos==RIGHT_UI)
        {

            var x=pos.x-30;
            var y=pos.y;

            var len=roomUser.cols2Local.length;
            var init_x=x;

            for(var i=0;i<len;i++)
            {
                var arr=roomUser.cols2Local[i];
                var size=arr.length;
                var sortArr=this.resetSort(roomUser,arr);

                for(var j=0;j<size;j++)
                {
                    var card=sortArr[j];
                    var cardSprite=this.getCardSpriteByCardId2(roomUser,card.c_id);
                    cardSprite.visible=true;

                    cardSprite.x=init_x;
                    cardSprite.y=y+(j*g_h);
                    cardSprite.setLocalZOrder(size-j);
                    cardSprite.changeToSmall2();
                    if(card.isBack==1)
                    {
                        //背面
                        cardSprite.changeToBg(false);
                    }
                    //if(OLD_CARD==1)
                    {
                        //cardSprite.setScl(SMALL_CARD_SCL2);
                    }

                    if(cardSprite.isChangeColor!=undefined&&cardSprite.isChangeColor)
                    {
                        cardSprite.setBlue();
                    }

                    if(cardSprite.isPut!=undefined&&cardSprite.isPut==1)
                    {
                        cardSprite.setRed();
                    }

                }
                init_x-=g_w;
            }
        }
        else if(uiPos==TOP_UI)
        {

            var x=pos.x-55;
            var y=pos.y-25;

            var len=roomUser.cols2Local.length;
            var init_x=x;

            for(var i=0;i<len;i++)
            {
                var arr=roomUser.cols2Local[i];
                var size=arr.length;

                var sortArr=this.resetSort(roomUser,arr);

                for(var j=0;j<size;j++)
                {
                    var card=sortArr[j];
                    var cardSprite=this.getCardSpriteByCardId2(roomUser,card.c_id);
                    cardSprite.visible=true;

                    cardSprite.x=init_x;
                    cardSprite.y=y+(j*g_h);
                    cardSprite.setLocalZOrder(size-j);
                    cardSprite.changeToSmall2();
                    if(card.isBack==1)
                    {
                        //背面
                        cardSprite.changeToBg(false);
                    }
                    //if(OLD_CARD==1)
                    {
                        //cardSprite.setScl(SMALL_CARD_SCL2);
                    }

                    if(cardSprite.isChangeColor!=undefined&&cardSprite.isChangeColor)
                    {
                        cardSprite.setBlue();
                    }

                    if(cardSprite.isPut!=undefined&&cardSprite.isPut==1)
                    {
                        cardSprite.setRed();
                    }
                }
                init_x-=g_w;
            }
        }
        else if(uiPos==LEFT_UI)
        {

            var x=pos.x+110;
            var y=pos.y+20;

            var len=roomUser.cols2Local.length;
            var init_x=x;

            for(var i=0;i<len;i++)
            {
                var arr=roomUser.cols2Local[i];
                var size=arr.length;

                var sortArr=this.resetSort(roomUser,arr);

                for(var j=0;j<size;j++)
                {
                    var card=sortArr[j];
                    var cardSprite=this.getCardSpriteByCardId2(roomUser,card.c_id);
                    cardSprite.visible=true;

                    cardSprite.x=init_x;
                    cardSprite.y=y+(j*g_h);
                    cardSprite.setLocalZOrder(size-j);
                    cardSprite.changeToSmall2();
                    if(card.isBack==1)
                    {
                        //背面
                        cardSprite.changeToBg(false);
                    }
                    //if(OLD_CARD==1)
                    {
                      //  cardSprite.setScl(SMALL_CARD_SCL2);
                    }

                    if(cardSprite.isChangeColor!=undefined&&cardSprite.isChangeColor)
                    {
                        cardSprite.setBlue();
                    }

                    if(cardSprite.isPut!=undefined&&cardSprite.isPut==1)
                    {
                        cardSprite.setRed();
                    }
                }
                init_x+=g_w;
            }


        }



    },

    getCardSpriteByCardId:function (roomUser,c_id) {

        var len=roomUser.cardSpriesLocal.length;
        for(var i=0;i<len;i++)
        {
            var cardSprite=roomUser.cardSpriesLocal[i];
            if(cardSprite.card.c_id==c_id)
            {
                return cardSprite;
            }
        }

        return null;

    },
    getCardSpriteByCardId2:function (roomUser,c_id) {

        var len=roomUser.cardSpries2Local.length;
      //  cc.log("getCardSpriteByCardId2 len:"+len);
        for(var i=0;i<len;i++)
        {
            var cardSprite=roomUser.cardSpries2Local[i];
           // cc.log("[getCardSpriteByCardId2]:"+cardSprite.card.c_id);
            if(cardSprite.card.c_id==c_id)
            {
                return cardSprite;
            }
        }

        return null;

    },
    sortRoomUserCard:function (roomUser) {

        var fourArray=[];
        var threeArray=[];
        var shunziArray=[];
        var daxiaosandaArray=[];
        var towArray=[];
        var two_7_array=[];
        var shunzi2_array=[];
        var otherArray=[];

        roomUser.colsLocal=[];

        var len=roomUser.cardSpriesLocal.length;
        var tmpArray=[];
        for(var i=0;i<len;i++)
        {
            var cardSprite=roomUser.cardSpriesLocal[i];
            tmpArray.push(cardSprite.card);
        }

        //三\四张检查
        var hasChecked={};
        len=tmpArray.length;
        cc.log("[发牌数:"+len+"]");
        for(var i=0;i<len;i++)
        {
            var card1=tmpArray[i];

            if(hasChecked[card1.c_id]!=undefined)
            {
                continue;
            }
            var tmpList=[];
            for(var j=0;j<len;j++)
            {
                var card2=tmpArray[j];
                if(card2==card1)
                {
                    continue;
                }
                if(hasChecked[card2.c_id]!=undefined)
                {
                    continue;
                }
                if(card1.type==card2.type&&card1.value==card2.value)
                {
                    tmpList.push(card2);

                }
            }

            tmpList.push(card1);
            if(tmpList.length==4)
            {
                var arr=[];
                for(var k=0;k<4;k++)
                {
                    var c=tmpList[k];
                    arr.push(c);
                    hasChecked[c.c_id]=c;
                }

                fourArray.push(arr);
            }
            else if(tmpList.length==3)
            {
                var arr=[];
                for(var k=0;k<3;k++)
                {
                    var c=tmpList[k];
                    arr.push(c);
                    hasChecked[c.c_id]=c;
                }

                threeArray.push(arr);

            }

        }

        //大小三搭
        len=tmpArray.length;
        for(var i=0;i<len;i++)
        {
            var card1=tmpArray[i];

            if(hasChecked[card1.c_id]!=undefined)
            {
                continue;
            }

            var arr=[];


            var cArray=this.getArrayCardByTypeValue(tmpArray,card1.type,card1.value,hasChecked);
            var cArray2=this.getArrayCardByTypeValue(tmpArray,this.getOtherType(card1.type),card1.value,hasChecked);
           // var c2=this.getCardByTypeValue(tmpArray,this.getOtherType(card1.type),card1.value,hasChecked);
            if(cArray.length==2&&cArray2.length==1)
            {

                arr.push(cArray[0]);
                arr.push(cArray[1]);
                arr.push(cArray2[0]);
                daxiaosandaArray.push(arr);

                hasChecked[cArray[0].c_id]=cArray[0];
                hasChecked[cArray[1].c_id]=cArray[1];
                hasChecked[cArray2[0].c_id]=cArray2[0];

            }
            else{
                cArray=this.getArrayCardByTypeValue(tmpArray,this.getOtherType(card1.type),card1.value,hasChecked);
                var cArray2=this.getArrayCardByTypeValue(tmpArray,card1.type,card1.value,hasChecked);
                if(cArray.length==2&&cArray2.length==1)
                {

                    arr.push(cArray[0]);
                    arr.push(cArray[1]);
                    arr.push(cArray2[0]);
                    daxiaosandaArray.push(arr);

                    hasChecked[cArray[0].c_id]=cArray[0];
                    hasChecked[cArray[1].c_id]=cArray[1];
                    hasChecked[cArray2[0].c_id]=cArray2[0];

                }

            }




        }

        //吊子
        len=tmpArray.length;
        for(var i=0;i<len;i++) {
            var card1 = tmpArray[i];

            if (hasChecked[card1.c_id] != undefined) {
                continue;
            }
            var cArray = this.getArrayCardByTypeValue(tmpArray, card1.type, card1.value, hasChecked);
            if(cArray.length==2)
            {
                towArray.push(cArray);

                hasChecked[cArray[0].c_id]=cArray[0];
                hasChecked[cArray[1].c_id]=cArray[1];

            }

        }




        //顺子
        len=tmpArray.length;
        for(var i=0;i<len;i++)
        {
            var card1=tmpArray[i];

            if(hasChecked[card1.c_id]!=undefined)
            {
                continue;
            }

            var arr=[];
            flg=false;
            var c1=this.getCardByTypeValue(tmpArray,card1.type,card1.value+1,hasChecked);
            var c2=this.getCardByTypeValue(tmpArray,card1.type,card1.value+2,hasChecked);
            if(c1!=null&&c2!=null)
            {
                flg=true;
                arr.push(card1);
                arr.push(c1);
                arr.push(c2);

            }
            else{
                c1=this.getCardByTypeValue(tmpArray,card1.type,card1.value-1,hasChecked);
                c2=this.getCardByTypeValue(tmpArray,card1.type,card1.value+1,hasChecked);
                if(c1!=null&&c2!=null)
                {
                    flg=true;


                    arr.push(c1);
                    arr.push(card1);
                    arr.push(c2);
                }
                else{
                    c1=this.getCardByTypeValue(tmpArray,card1.type,card1.value-2,hasChecked);
                    c2=this.getCardByTypeValue(tmpArray,card1.type,card1.value-1,hasChecked);
                    if(c1!=null&&c2!=null)
                    {
                        flg=true;

                        arr.push(c1);
                        arr.push(c2);
                        arr.push(card1);
                    }
                }


            }


            if(flg)
            {

                shunziArray.push(arr);
                hasChecked[c1.c_id]=c1;
                hasChecked[c2.c_id]=c2;
                hasChecked[card1.c_id]=card1;
            }

        }



        
        //半顺
        len=tmpArray.length;
        for(var i=0;i<len;i++)
        {
            var card1=tmpArray[i];

            if(hasChecked[card1.c_id]!=undefined)
            {
                continue;
            }

            var arr=[];
            flg=false;
            var c1=this.getCardByTypeValue(tmpArray,card1.type,card1.value+1,hasChecked);
            if(c1!=null)
            {
                flg=true;
                arr.push(card1);
                arr.push(c1);
            }
            else{
                c1=this.getCardByTypeValue(tmpArray,card1.type,card1.value-1,hasChecked);
                if(c1!=null)
                {
                    flg=true;
                    arr.push(c1);
                    arr.push(card1);
                }
            }

            if(flg)
            {
                shunzi2_array.push(arr);
                hasChecked[c1.c_id]=c1;
                hasChecked[card1.c_id]=card1;
            }

        }

        //其他
        len=tmpArray.length;
        for(var i=0;i<len;i++) {
            var card1 = tmpArray[i];

            if (hasChecked[card1.c_id] != undefined) {
                continue;
            }

            otherArray.push(card1);
        }



        var size=fourArray.length;
        cc.log("[四张:"+size+"]");
        for(var i=0;i<size;i++)
        {
            var arr=fourArray[i];
            roomUser.colsLocal.push(arr);
        }

        size=threeArray.length;
        cc.log("[三张:"+size+"]");
        for(var i=0;i<size;i++)
        {
            var arr=threeArray[i];
            roomUser.colsLocal.push(arr);
        }

        size=towArray.length;
        cc.log("[二张:"+size+"]");
        for(var i=0;i<size;i++)
        {
            var arr=towArray[i];
            roomUser.colsLocal.push(arr);
        }

        size=daxiaosandaArray.length;
        cc.log("[大小三搭:"+size+"]");
        for(var i=0;i<size;i++)
        {
            var arr=daxiaosandaArray[i];
            roomUser.colsLocal.push(arr);
        }


        size=shunziArray.length;
        cc.log("[顺子:"+size+"]");
        for(var i=0;i<size;i++)
        {
            var arr=shunziArray[i];
            roomUser.colsLocal.push(arr);
        }


        size=two_7_array.length;
        cc.log("[二七十:"+size+"]");
        for(var i=0;i<size;i++)
        {
            var arr=two_7_array[i];
            roomUser.colsLocal.push(arr);
        }


        size=shunzi2_array.length;
        cc.log("[半顺:"+size+"]");
        for(var i=0;i<size;i++)
        {
            var arr=shunzi2_array[i];
            roomUser.colsLocal.push(arr);
        }

        size=otherArray.length;
        cc.log("[其他:"+size+"]");
        var tmp_arr=[];
        for(var i=0;i<size;i++)
        {
            var c=otherArray[i];
            tmp_arr.push(c);
            if(tmp_arr.length>=3)
            {
                roomUser.colsLocal.push(tmp_arr);
                tmp_arr=[];
            }

        }
        if(tmp_arr.length>0)
        {
            roomUser.colsLocal.push(tmp_arr);
            tmp_arr=[];
        }

    },
    getOtherType:function (type) {

        if(type==0)
        {
            return 1;
        }
        else{
            return 0;
        }
    },
    getCardByTypeValue:function (cards,type,value,hasChecked) {

        var len=cards.length;
        for(var i=0;i<len;i++)
        {
            var c=cards[i];
            if(hasChecked[c.c_id]!=undefined)
            {
                continue;
            }
            if(c.type==type&&c.value==value)
            {
                return c;
            }

        }

        return null;

    },
    getArrayCardByTypeValue:function (cards,type,value,hasChecked) {

        var array=[];
        var len=cards.length;
        for(var i=0;i<len;i++)
        {
            var c=cards[i];
            if(hasChecked[c.c_id]!=undefined)
            {
                continue;
            }
            if(c.type==type&&c.value==value)
            {
                array.push(c);
            }

        }

        return array;

    },
    getPosOfPlayerReleative:function (uid,front,left) {
        var roomUser=this.getRoomUserByUID(uid);
        var uiPos=this.getRoomUserUIPos(roomUser);
        var pos={};
        if(uiPos==BOTTOM_UI)
        {
            pos.x=-left;
            pos.y=front;

        }
        else if(uiPos==RIGHT_UI)
        {
            pos.x=-front;
            pos.y=-left;

        }
        else if(uiPos==TOP_UI)
        {
            pos.x=left;
            pos.y=-front;

        }
        else if(uiPos==LEFT_UI)
        {
            pos.x=front;
            pos.y=left;

        }
        return pos;
    },
    getHeadPos:function (roomUser,front,left) {
        var head = ccui.helper.seekWidgetByName(roomUser.node, "head");
        var pos=head.convertToWorldSpace(cc.p(50,60));
        var pos2=this.getPosOfPlayerReleative(roomUser.user.uid,front,left);

        pos.x+=pos2.x;
        pos.y+=pos2.y;

        return pos;
    },
    getPosOfPlayer:function (uid,front,left) {
        var roomUser=this.getRoomUserByUID(uid);
        var uiPos=this.getRoomUserUIPos(roomUser);
        var pos={};
        if(uiPos==BOTTOM_UI)
        {
            pos.x=v_x+v_w/2-left;
            pos.y=front;

        }
        else if(uiPos==RIGHT_UI)
        {
            pos.x=v_x+v_w-front;
            pos.y=v_y+v_h/2-left;

        }
        else if(uiPos==TOP_UI)
        {
            pos.x=v_x+v_w/2+left;
            pos.y=v_y+v_h-front;

        }
        else if(uiPos==LEFT_UI)
        {
            pos.x=front;
            pos.y=v_y+v_h/2+left;

        }
        return pos;
    },
    getRoomCurrentCard:function () {
        var card=this.roomInfo.currentCard;
        if(card!=undefined&&card!=null)
        {
            return card;
        }
        return null;
    },

    moveRoomUserCardSprite2:function (roomUser,groups,type) {
        if(roomUser.cardSpries2Local==undefined)
        {
            roomUser.cardSpries2Local=[];
            roomUser.cols2Local=[];
        }

        var gSize=groups.length;
        for(var gIndex=0;gIndex<gSize;gIndex++)
        {
            var cardArr=groups[gIndex];

            var arr=[];
            var len=cardArr.length;
            for(var i=0;i<len;i++)
            {
                var cardSprite=cardArr[i];

                this.removeCardSpriteFromRoomUserLocal1(cardSprite.card.c_id);

                arr.push(cardSprite.card);

                var flg=false;
                var rCount=roomUser.cardSpries2Local.length;
                for(var rIndex=0;rIndex<rCount;rIndex++)
                {
                    var spp=roomUser.cardSpries2Local[rIndex];
                    if(spp.card.c_id==cardSprite.card.c_id)
                    {
                        flg=true;
                        break;
                    }

                }
                if(!flg)
                {
                    roomUser.cardSpries2Local.push(cardSprite);
                }


            }

            if(arr.length>0)
            {
                var arrSize=roomUser.cols2Local.length;

                for(var k=0;k<arrSize;k++)
                {
                    var arrList=roomUser.cols2Local[k];
                    var cSize=arrList.length;
                    for(var cIndex=0;cIndex<cSize;cIndex++)
                    {
                        var ccc=arrList[cIndex];

                        var cSize2=arr.length;
                        for(var cIndex2=0;cIndex2<cSize2;cIndex2++)
                        {

                            var cc2=arr[cIndex2];
                            if(ccc.c_id==cc2.c_id)
                            {

                                cc.log("重新设计col:"+k+",arr:"+arr.length);
                                roomUser.cols2Local[k]=arr;

                                return;

                            }

                        }

                    }

                }

            }
        }



        // }

    },
    moveRoomUserCardSprite:function (roomUser,groups,type) {
       if(roomUser.cardSpries2Local==undefined)
       {
           roomUser.cardSpries2Local=[];
           roomUser.cols2Local=[];
       }
        if(roomUser.cardSpries3Local==undefined)
        {
            roomUser.cardSpries3Local=[];
        }

        var gSize=groups.length;
        for(var gIndex=0;gIndex<gSize;gIndex++)
        {
            var cardArr=groups[gIndex];

            var arr=[];
            var len=cardArr.length;
            for(var i=0;i<len;i++)
            {
                var cardSprite=cardArr[i];

                this.removeCardSpriteFromRoomUserLocal1(cardSprite.card.c_id);

                arr.push(cardSprite.card);

                if(type==2)
                {
                    var rCount=roomUser.cardSpries2Local.length;
                    for(var rIndex=0;rIndex<rCount;rIndex++)
                    {
                        var spp=roomUser.cardSpries2Local[rIndex];
                        if(spp.card.c_id==cardSprite.card.c_id)
                        {
                            cc.log("##################################重复添加");
                            cc.log("name:"+roomUser.user.name+",type:"+spp.card.type+",value:"+spp.card.value);

                        }

                    }
                    roomUser.cardSpries2Local.push(cardSprite);

                }
                else if(type==3){

                    roomUser.cardSpries3Local.push(cardSprite);
                }
            }

            if(type==2)
            {
                if(arr.length>0)
                {
                    roomUser.cols2Local.push(arr);
                }

            }
        }


        // if(uid==myPlayerInfo.uid)
        // {
        if(type==2)
        {
            this.resetMyCardPos(roomUser,null);
        }

       // }

    },

    removeCardSpriteFromRoomUserLocal1:function (c_id) {

        var roomUsers=this.roomInfo.roomUsers;
        var len=roomUsers.length;
        for(var i=0;i<len;i++)
        {
            var roomUser=roomUsers[i];

            var flg=false;
            var count=roomUser.cardSpriesLocal.length;
            for(var j=0;j<count;j++)
            {
                var cardSprite=roomUser.cardSpriesLocal[j];
                if(cardSprite.card.c_id==c_id)
                {

                    roomUser.cardSpriesLocal.splice(j,1);
                    flg=true;
                    break;

                }
            }
            if(flg)
            {
                var count2=roomUser.colsLocal.length;
                for(var j=0;j<count2;j++)
                {
                    var arr=roomUser.colsLocal[j];
                    var size=arr.length;
                    for(var k=0;k<size;k++)
                    {
                        var card=arr[k];
                        if(card.c_id==c_id)
                        {
                            arr.splice(k,1);
                            break;
                        }

                    }

                }
                this.clearRoomUserColsLocal(roomUser);

                break;
            }




        }






    },

    clearRoomUserColsLocal:function (roomUser) {

        var len=roomUser.colsLocal.length;
        for(var i=0;i<len;i++)
        {
            var tmpArr=roomUser.colsLocal[i];
            if(tmpArr.length<=0)
            {
                roomUser.colsLocal.splice(i,1);
                i--;
                len--;
            }

        }
    },
    buildMoveAction:function (player,action,actionType) {

        var tableCardSprite=null;
        if(actionType==ACTION_CHI)
        {
            tableCardSprite=this.getRoomCurrentCard();
        }

        var roomUser=this.getRoomUserByUID(player.uid);
        var groupCards=action.groupCards;
        var len=groupCards.length;
        var tiObj={};
        tiObj.groupCards=[];
        cc.log("[buildMoveAction group count:"+len+"]");
        for(var i=0;i<len;i++) {
            var groudCard = groupCards[i];
            var cards = groudCard.cards;
            var count = cards.length;

            var groupCardTmp=[];
            tiObj.groupCards.push(groupCardTmp);

            var tike=0;
            for(var j=0;j<count;j++)
            {
                var card=cards[j];
                var cardSprite=null;
                if(actionType==ACTION_TI2||actionType==ACTION_PAO2)
                {
                    cardSprite=this.getCardSpriteByCardId2(roomUser,card.c_id);
                }
                else{

                    cardSprite=this.getCardSpriteByCardId(roomUser,card.c_id);
                }



                if(cardSprite==null)
                {
                    cardSprite=this.getRoomCurrentCard();
                    //
                    {
                        cardSprite.isChangeColor=true;

                    }


                }

                if(actionType==ACTION_CHI)
                {
                    if(len>1)
                    {
                        if(tableCardSprite!=null)
                        {
                            if(tableCardSprite.card.type==card.type&&tableCardSprite.card.value==card.value)
                            {
                                //比的那张牌 要放到前面
                                cardSprite.isBi=true;
                                cc.log("cardSprite.isBi==true");
                            }


                        }


                    }

                }


                cardSprite.setLight(false);

                if(cardSprite==null)
                {
                    cc.log("[错误:card id:"+card.c_id+"]");
                    break;
                }
                cardSprite.uid=roomUser.user.uid;
                groupCardTmp.push(cardSprite);

                 cardSprite.card.isBack=card.isBack;
                // if(actionType==ACTION_TI)
                // {
                //     tike++;
                //     if(tike<=3)
                //     {
                //         cardSprite.card.isBack=1;
                //
                //     }
                //
                //
                //
                // }
                // else if(actionType==ACTION_WEI)
                // {
                //     tike++;
                //     if(tike<=2)
                //     {
                //         cardSprite.card.isBack=1;
                //
                //     }
                // }
                // else  if(actionType==ACTION_TI2)
                // {
                //
                //     tike++;
                //     if(tike>1)
                //     {
                //         cardSprite.card.isBack=1;
                //
                //     }
                //
                // }

            }



        }

        if(tiObj.groupCards.length>0)
        {

            this.tiQueue.push(tiObj);
            if(actionType==ACTION_TI2||actionType==ACTION_PAO2)
            {
                this.moveRoomUserCardSprite2(roomUser,tiObj.groupCards,2);
            }
            else{
                this.moveRoomUserCardSprite(roomUser,tiObj.groupCards,2);
            }

            //cc.log("tiObj.groupCards.length:"+this.tiQueue.length+","+this.tiNext);
        }

    },
    actionTi:function (player,action) {

        this.buildMoveAction(player,action,ACTION_TI);
        this.showWorld(WORLD_TI,player.uid);




        var isQing=false;

        var groupCards=action.groupCards;
        var len=groupCards.length;
        for(var i=0;i<len;i++) {
            var groudCard = groupCards[i];
            var cards = groudCard.cards;
            var count = cards.length;

            for (var j = 0; j < count; j++) {
                var card = cards[j];
                if(card.flg!=1)//0:普通,1:开局发到的牌
                {
                    isQing=true;
                    break;
                }

            }

        }

        var roomUser=this.getRoomUserByUID(player.uid);
        if(isQing)
        {
            if(roomUser.user.sex==1)
            {
                playEffect(operSound.qing.v);
            }
            else{
                playEffect(operSound.qing.n);
            }

        }
        else{
            if(roomUser.user.sex==1)
            {
                playEffect(operSound.ti.v);
            }
            else{
                playEffect(operSound.ti.n);
            }

        }


    },
    actionWeiTi:function (player,action) {

        this.buildMoveAction(player,action,ACTION_TI2);
        this.showWorld(WORLD_TI,player.uid);

        var roomUser=this.getRoomUserByUID(player.uid);
        if(roomUser.user.sex==1)
        {
            playEffect(operSound.ti.v);
        }
        else{
            playEffect(operSound.ti.n);
        }
    },

    actionPao:function (player,action) {

        this.buildMoveAction(player,action,ACTION_PAO);
        this.showWorld(WORLD_PAO,player.uid);


        var roomUser=this.getRoomUserByUID(player.uid);
        if(roomUser.user.sex==1)
        {
            playEffect(operSound.pao.v);
        }
        else{
            playEffect(operSound.pao.n);
        }
    },
    actionPao2:function (player,action) {

        this.buildMoveAction(player,action,ACTION_PAO2);
        this.showWorld(WORLD_PAO,player.uid);

        var roomUser=this.getRoomUserByUID(player.uid);
        if(roomUser.user.sex==1)
        {
            playEffect(operSound.pao.v);
        }
        else{
            playEffect(operSound.pao.n);
        }

    },
    hideSlectedButton:function (uid)
    {

        if(uid==this.roleUId)
        {
            if(this.selectedLayer!=undefined&&this.selectedLayer!=null)
            {

                this.selectedLayer.removeFromParent(true);
                this.selectedLayer=null;

                // var hu = ccui.helper.seekWidgetByName(this.selectedLayer, "hu");
                // var peng = ccui.helper.seekWidgetByName(this.selectedLayer, "peng");
                // var chi = ccui.helper.seekWidgetByName(this.selectedLayer, "chi");
                // var close = ccui.helper.seekWidgetByName(this.selectedLayer, "close");
                //
                // this.selectedLayer.visible=false;
                // hu.setTouchEnabled(false);
                // hu.setEnabled(false);
                //
                // peng.setTouchEnabled(false);
                // peng.setEnabled(false);
                //
                // chi.setTouchEnabled(false);
                // chi.setEnabled(false);
                //
                // close.setTouchEnabled(false);
                // close.setEnabled(false);

                if(this.chiLayer!=undefined&&this.chiLayer!=null)
                {
                    this.chiLayer.removeFromParent(true);
                    this.chiLayer=null;
                }
            }
        }
        this.removeClock(uid);



    },
    showSelectedButton:function (player,action) {

        if(player.uid==this.roleUId)
        {


            if(this.selectedLayer==undefined||this.selectedLayer==null)
            {


                this.selectedLayer=new cc.Layer();
                this.addChild(this.selectedLayer,TABLE_DESKER_ZOEDER);
                this.selectedLayer.count=0;
                this.selectedLayer.x=v_x+v_w-100;
                this.selectedLayer.y=v_y+300;

                if(action.type!=ACTION_KEHU2)
                {
                    var button = new ccui.Button();
                    button.setTouchEnabled(true);
                    button.setPressedActionEnabled(true);
                    button.loadTextures("res/ui/room/close_room.png","res/ui/room/close_room.png","res/ui/room/close_room.png");
                    button.setScale(0.8);
                    button.addTouchEventListener(this.selCloseClicked.bind(this),this);
                    button.x=-this.selectedLayer.count*120;
                    this.selectedLayer.count++;
                    this.selectedLayer.addChild(button);

                    this.guoButton=button;
                    this.guoButton.action=null;
                }





            }

            if(action.type==ACTION_KECHI)
            {
                if(this.selectedLayer.hasChi==undefined)
                {
                    this.myCanSelectedAction=action;

                    this.selectedLayer.hasChi=true;
                    var button = new ccui.Button();
                    button.setTouchEnabled(true);
                    button.setPressedActionEnabled(true);
                    button.loadTextures("res/ui/room/chi_room.png","res/ui/room/chi_room.png","res/ui/room/chi_room.png");
                    button.setScale(0.8);
                    button.addTouchEventListener(this.chiClicked.bind(this),this);
                    button.x=-this.selectedLayer.count*120;
                    this.selectedLayer.count++;
                    this.selectedLayer.addChild(button);
                }


            }
            else if(action.type==ACTION_KEPENG)
            {
                if(this.selectedLayer.hasPeng==undefined)
                {

                    this.selectedLayer.hasPeng=true;
                    var button = new ccui.Button();
                    button.setTouchEnabled(true);
                    button.setPressedActionEnabled(true);
                    button.loadTextures("res/ui/room/peng_room.png","res/ui/room/peng_room.png","res/ui/room/peng_room.png");
                    button.setScale(0.8);
                    button.addTouchEventListener(this.pengClicked.bind(this),this);
                    button.x=-this.selectedLayer.count*120;
                    this.selectedLayer.count++;
                    this.selectedLayer.addChild(button);
                }

            }
            else if(action.type==ACTION_KEHU||action.type==ACTION_KEHU2)
            {
                if(this.selectedLayer.hasHu==undefined)
                {
                    this.selectedLayer.hasHu=true;
                    var button = new ccui.Button();
                    button.setTouchEnabled(true);
                    button.setPressedActionEnabled(true);
                    button.loadTextures("res/ui/room/hu_room.png","res/ui/room/hu_room.png","res/ui/room/hu_room.png");
                    button.setScale(0.8);
                    button.addTouchEventListener(this.huClicked.bind(this),this);
                    button.x=-this.selectedLayer.count*120;
                    this.selectedLayer.count++;
                    this.selectedLayer.addChild(button);
                }
                if(action.type==ACTION_KEHU)
                {
                    this.guoButton.action=action;
                }

            }

            // var hu = ccui.helper.seekWidgetByName(this.selectedLayer, "hu");
            // var peng = ccui.helper.seekWidgetByName(this.selectedLayer, "peng");
            // var chi = ccui.helper.seekWidgetByName(this.selectedLayer, "chi");
            // var close = ccui.helper.seekWidgetByName(this.selectedLayer, "close");
            //
            //
            // this.selectedLayer.visible=true;
            //
            //
            //
            // close.setTouchEnabled(true);
            // close.setEnabled(true);
            //
            // if(action.type==ACTION_KECHI)
            // {
            //     this.myCanSelectedAction=action;
            //
            //     chi.setTouchEnabled(true);
            //     chi.setEnabled(true);
            //
            // }
            // else if(action.type==ACTION_KEPENG)
            // {
            //     peng.setTouchEnabled(true);
            //     peng.setEnabled(true);
            // }
            // else if(action.type==ACTION_KEHU)
            // {
            //     hu.setTouchEnabled(true);
            //     hu.setEnabled(true);
            //
            // }

        }

        this.showClock(player,ROOM_WAIT_SELECTED_STATE);


    },

    headClicked:function (sender, type) {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                var uid=sender.uid;
                cc.log("[头像 clicked,uid:"+uid+"]");
                var roomUser=this.getRoomUserByUID(uid);
                var layer=new InfoLayer(this,roomUser);
                this.addChild(layer,TABLE_DESKER_ZOEDER+1);
                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }

    },
    huClicked:function (sender, type) {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {

                cc.log("[胡 clicked]");

                var req=new OperateCardRequest();
                req.uid=this.roleUId;
                req.roomId=this.roomInfo.roomId;
                req.type=2;//0:碰,1:吃,2:胡
                socketMgr.socket.send(OPERATE_CARD_REQUEST,req);

                // this.excuteActionCount--;
                // if(this.excuteActionCount<0)this.excuteActionCount=0;

                this.hideSlectedButton(req.uid);

                playEffect(TOUCH_SOUND);

            }
                break;


            default:
                break;
        }

    },
    pengClicked:function (sender, type) {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                cc.log("[碰]");

                var req=new OperateCardRequest();
                req.uid=this.roleUId;
                req.roomId=this.roomInfo.roomId;;
                req.type=0;//0:碰,1:吃,2:胡
                socketMgr.socket.send(OPERATE_CARD_REQUEST,req);

                // this.excuteActionCount--;
                // if(this.excuteActionCount<0)this.excuteActionCount=0;

                this.hideSlectedButton(req.uid);

                playEffect(TOUCH_SOUND);

            }
                break;


            default:
                break;
        }

    },
    chiClicked:function (sender, type) {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                cc.log("[吃]");

                //var roomUser=this.getRoomUserByUID(player.uid);
                //var groupCards=this.myCanSelectedAction.groupCards;
                if(this.chiLayer==undefined||this.chiLayer==null)
                {
                    var roomUser=this.getRoomUserByUID(this.roleUId);
                    this.chiLayer=new ChiLayer(this.sceneId,this.roomInfo,roomUser,this.myCanSelectedAction,this.getRoomCurrentCard());
                    this.addChild(this.chiLayer,TABLE_DESKER_ZOEDER);

                    this.chiLayer.x=v_x+v_w-200;
                    this.chiLayer.y=v_y+v_h-200;

                    playEffect(TOUCH_SOUND);

                }


            }
                break;


            default:
                break;
        }

    },
    selCloseClicked:function (sender, type) {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                cc.log("[放弃]");


                var action=sender.action;

                if(action!=null)
                {
                    if(action.type==ACTION_KEHU)
                    {
                        this.roomTip=new TouchLayer();
                        this.addChild(this.roomTip,TABLE_DESKER_ZOEDER+2);

                        var node = parseUI("res/ui/roomTip/roomTip.json", CENTER);
                        this.roomTip.addChild(node);

                        var b1= ccui.helper.seekWidgetByName(node, "b1");
                        b1.addTouchEventListener(this.roomTipB1Clicked,this);
                        b1.type=1;

                        var b2= ccui.helper.seekWidgetByName(node, "b2");
                        b2.addTouchEventListener(this.roomTipB2Clicked,this);
                        b2.type=1;

                    }
                    else{
                        var req=new PassOperateRequest();
                        req.uid=this.roleUId;
                        req.roomId=this.roomInfo.roomId;;
                        socketMgr.socket.send(PASS_OPERATE_REQUEST,req);
                        this.hideSlectedButton(req.uid);
                    }
                }
                else{
                    var req=new PassOperateRequest();
                    req.uid=this.roleUId;
                    req.roomId=this.roomInfo.roomId;;
                    socketMgr.socket.send(PASS_OPERATE_REQUEST,req);
                    this.hideSlectedButton(req.uid);
                }



                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }

    },

    roomTipB1Clicked:function(sender, type)
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

                if(this.roomTip!=null&&this.roomTip!=undefined)
                {
                    this.roomTip.removeFromParent(true);
                    this.roomTip=null;
                }

                var type=sender.type;
                if(type==1)//过
                {
                    var req=new PassOperateRequest();
                    req.uid=this.roleUId;
                    req.roomId=this.roomInfo.roomId;;
                    socketMgr.socket.send(PASS_OPERATE_REQUEST,req);
                    this.hideSlectedButton(req.uid);
                }
                else if(type==2)
                {
                    var pos=this.getRoomUserShowCardPos(this.selectedCard.uid);

                    this.selectedCard.x=pos.x;
                    this.selectedCard.y=pos.y;

                    var req=new PutCardRequest();
                    req.uid=this.roleUId;
                    req.roomId=this.roomInfo.roomId;
                    req.c_id=this.selectedCard.card.c_id;
                    cc.log("[发送出牌请求c_id:"+req.c_id+"]");
                    socketMgr.socket.send(PUT_CARD_REQUEST,req);
                    this.hasSendPutCard=true;

                }

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
                if(this.roomTip!=null&&this.roomTip!=undefined)
                {
                    this.roomTip.removeFromParent(true);
                    this.roomTip=null;
                }
                var type=sender.type;
                if(type==2)
                {
                    this.selectedCard.x=this.selectedCard.org.x;
                    this.selectedCard.y=this.selectedCard.org.y;

                }
                playEffect(TOUCH_SOUND);

            }
                break;


            default:
                break;
        }

    },
    actionKeChi:function (player,action) {

       // this.showSelectedButton(player,action);

        this.releaseActionCount("可吃");
    },
    actionChi:function (player,action) {

        this.buildMoveAction(player,action,ACTION_CHI);
        if(action.groupCards.length>1)
        {
            this.showWorld(WORLD_BI,player.uid);


        }
        else{
            this.showWorld(WORLD_CHI,player.uid);
        }
        var roomUser=this.getRoomUserByUID(player.uid);
        if(roomUser.user.sex==1)
        {
            if(action.groupCards.length>1)
            {
                playEffect(operSound.bi.v);
            }
            else{
                playEffect(operSound.chi.v);
            }

        }
        else{
            if(action.groupCards.length>1)
            {
                playEffect(operSound.bi.n);
            }
            else{
                playEffect(operSound.chi.n);
            }

        }
    },
    actionKeHu:function (player,action) {

      //  this.showSelectedButton(player,action);
        this.releaseActionCount("可胡");
    },
    actionKeHu2:function (player,action) {

        //this.showSelectedButton(player,action);
        this.releaseActionCount("可胡2");
    },
    actionHu:function (player,action) {

        if(action.type2==1)//1:天胡,2:地胡,3:自摸胡
        {
            if(RULE_VALUE==ROOM_TYPE_HONGHU_147)
            {
                var dialog=new DialogLayer();
                var lab=dialog.show("天胡+1墩");
                lab.setColor(cc.color(255,0,0));
                this.addChild(dialog,TABLE_DESKER_ZOEDER);
            }
            else{
                var dialog=new DialogLayer();
                var lab=dialog.show("天胡+10");
                lab.setColor(cc.color(255,0,0));
                this.addChild(dialog,TABLE_DESKER_ZOEDER);
            }


            this.showWorld(WORLD_TIAN_HU,player.uid);

        }
        else if(action.type2==2)
        {
            if(RULE_VALUE==ROOM_TYPE_HONGHU_147)
            {
                var dialog=new DialogLayer();
                var lab=dialog.show("地胡+1墩");
                lab.setColor(cc.color(255,0,0));
                this.addChild(dialog,TABLE_DESKER_ZOEDER);
            }
            else{
                var dialog=new DialogLayer();
                var lab=dialog.show("地胡+10");
                lab.setColor(cc.color(255,0,0));
                this.addChild(dialog,TABLE_DESKER_ZOEDER);
            }


            this.showWorld(WORLD_DI_HU,player.uid);
        }
        else if(action.type2==3)
        {
            if(RULE_VALUE==ROOM_TYPE_HONGHU_147)
            {
                var dialog=new DialogLayer();
                var lab=dialog.show("自摸+1墩");
                lab.setColor(cc.color(255,0,0));
                this.addChild(dialog,TABLE_DESKER_ZOEDER);
            }
            else{
                var dialog=new DialogLayer();
                var lab=dialog.show("自摸+10");
                lab.setColor(cc.color(255,0,0));
                this.addChild(dialog,TABLE_DESKER_ZOEDER);
            }


            this.showWorld(WORLD_ZI_MO,player.uid);
        }
        else{
            this.showWorld(WORLD_HU,player.uid);
        }

        var roomUser=this.getRoomUserByUID(player.uid);
        if(action.type2==3)
        {
            if(roomUser.user.sex==1)
            {
                playEffect(operSound.zimo.v);
            }
            else{
                playEffect(operSound.zimo.n);
            }
        }
        else{
            if(roomUser.user.sex==1)
            {
                playEffect(operSound.hu.v);
            }
            else{
                playEffect(operSound.hu.n);
            }
        }

        this.hasClearCards=false;



    },
    actionHuangZhuang:function (player,action) {

        this.showWorld(WORLD_HUANGZHUANG,player.uid);

        this.hasClearCards=false;

    },
    actionNo:function (player,action) {


        //0:,1:天胡,2:地胡,3:自摸胡,4:脱庄,5:闲加分
        if(action.type2==4)
        {
            var roomUser=this.getRoomUserByUID(player.uid);
            if(this.roleUId!=player.uid)
            {
                if(roomUser.user.sex==1)
                {
                    playEffect(operSound.xiahu.v);
                }
                else{
                    playEffect(operSound.xiahu.n);
                }
            }


        }
        this.releaseActionCount("无动作");
    },
    actionCard_21:function (player,action) {

        var roomUser=this.getRoomUserByUID(player.uid);
        var groupCards=action.groupCards;
        var len=groupCards.length;
        for(var i=0;i<len;i++) {
            var groudCard = groupCards[i];
            var cards = groudCard.cards;
            var count = cards.length;

            for(var j=0;j<count;j++)
            {
                var card=cards[j];
                var cardSprite=new CardSprite();
                cardSprite.createCard(card);
                cardSprite.changeToBig();
                cardSprite.x=v_x+v_w/2;
                cardSprite.y=v_y+v_h/2;
                cardSprite.uid=roomUser.user.uid;
                cardSprite.setScl(0);
                cardSprite.setTag(CARD_SPRITE_TAG);

                cardSprite.setLight(true);

                this.addChild(cardSprite,TABLE_DESKER_ZOEDER);

                var pos=this.getRoomUserShowCardPos(cardSprite.uid);

                var delayAction=cc.delayTime(0.5+DELEAY_TEST);
                var moveAction = cc.moveTo(0.1+DELEAY_TEST, pos);
                var actionCallbackFunction = cc.callFunc(this.card21ActionFinishedCallBack, this, cardSprite);
                var actionArray=[];
                actionArray.push(moveAction);
                actionArray.push(delayAction);
                actionArray.push(actionCallbackFunction);
                var actionSequence = cc.sequence(actionArray);
                cardSprite.runAction(actionSequence);

                var scaleTo=cc.scaleTo(0.1,1);
                cardSprite.runActionWithSp(scaleTo);

                this.subAndUpdateDeskLeftCount();


                roomUser.cardSpriesLocal.push(cardSprite);



                break;
            }



        }

    },
    card21ActionFinishedCallBack:function (cardSprite) {


        var roomUser=this.getRoomUserByUID(cardSprite.uid);
        this.sortRoomUserCard(roomUser);
        var pos=cc.p(0,0);
        if(cardSprite.uid==this.roleUId)
        {
            pos=this.resetMyCardPos(roomUser,cardSprite.card);
        }
        else{
            pos=this.getHeadPos(roomUser,0,0);
        }

       // cc.log("####card21ActionFinishedCallBack####:"+pos.x+","+pos.y);
        cardSprite.changeToSmall();
        cardSprite.setScl(SMALL_CARD_SCL);
        cardSprite.setLight(false);

        var delayAction=cc.delayTime(WAIT_SHOW_TIME+DELEAY_TEST);
        var moveAction = cc.moveTo(0.1+DELEAY_TEST, pos);
        var actionCallbackFunction = cc.callFunc(this.card21ActionFinishedCallBack2, this, cardSprite);
        var actionArray=[];
        actionArray.push(delayAction);
        actionArray.push(moveAction);
        actionArray.push(actionCallbackFunction);
        var actionSequence = cc.sequence(actionArray);
        cardSprite.runAction(actionSequence);


    },
    card21ActionFinishedCallBack2:function (cardSprite) {

        this.releaseActionCount("第21张牌移动完成");


        var roomUser=this.getRoomUserByUID(cardSprite.uid);
        this.sortRoomUserCard(roomUser);
        this.resetMyCardPos(roomUser,null);


    },


    actionKePeng:function (player,action) {

      //  this.showSelectedButton(player,action);

        this.releaseActionCount("可碰");
    },
    actionPeng:function (player,action) {

        this.buildMoveAction(player,action,ACTION_PENG);
        this.showWorld(WORLD_PENG,player.uid);

        var roomUser=this.getRoomUserByUID(player.uid);
        if(roomUser.user.sex==1)
        {
            playEffect(operSound.peng.v);
        }
        else{
            playEffect(operSound.peng.n);
        }

    },

    actionTouch:function (player,action) {

        var roomUser=this.getRoomUserByUID(player.uid);
        var groupCards=action.groupCards;
        var len=groupCards.length;
        for(var i=0;i<len;i++) {
            var groudCard = groupCards[i];
            var cards = groudCard.cards;
            var count = cards.length;

            for(var j=0;j<count;j++)
            {
                var card=cards[j];
                var cardSprite=new CardSprite();
                cardSprite.createCard(card);
                cardSprite.changeToBig();
                cardSprite.x=this.dui.x;//v_x+v_w/2;
                cardSprite.y=this.dui.y;//v_y+v_h/2;
                cardSprite.uid=roomUser.user.uid;
                cardSprite.setScl(0);
                cardSprite.setTag(CARD_SPRITE_TAG);

                cardSprite.setLight(true);

                this.addChild(cardSprite,TABLE_DESKER_ZOEDER);

                var pos=this.getRoomUserShowCardPos(cardSprite.uid);

                var delayAction=cc.delayTime(0.5+DELEAY_TEST);
                var moveAction = cc.moveTo(0.1+MOVE_DELEAY_T+DELEAY_TEST, pos);
                var actionCallbackFunction = cc.callFunc(this.touchActionFinishedCallBack, this, cardSprite);
                var actionArray=[];
                actionArray.push(moveAction);
                actionArray.push(delayAction);
                actionArray.push(actionCallbackFunction);
                var actionSequence = cc.sequence(actionArray);
                cardSprite.runAction(actionSequence);

                var scaleTo=cc.scaleTo(0.1,1);
                cardSprite.runActionWithSp(scaleTo);

                this.subAndUpdateDeskLeftCount();



                var card_name="card/";
                if(roomUser.user.sex==1)
                {

                    card_name+="v";
                }
                else{

                    card_name+="n";
                }

                if(card.type==0)
                {
                    card_name+=(10+card.value)+".mp3";
                }
                else{
                    card_name+=card.value+".mp3";
                }


                playEffect(card_name);


                break;
            }



        }

    },
    touchActionFinishedCallBack:function (cardSprite) {



        
        this.releaseActionCount("摸牌移动完成");

        if(this.roomInfo.currentCard!=undefined)
        {
            cc.log("[更新当前打出牌,oldType"+this.roomInfo.currentCard.card.type+",oldVelue:"+this.roomInfo.currentCard.card.value+",newType:"+cardSprite.card.type+",newValue:"+cardSprite.card.value+"]");
        }
        this.roomInfo.currentCard=cardSprite;

        cc.log("touch finished call back:"+this.excuteActionCount);

    },
    actionGet:function (player,action) {

        var roomUser=this.getRoomUserByUID(player.uid);
        var groupCards=action.groupCards;
        var len=groupCards.length;
        for(var i=0;i<len;i++) {
            var groudCard = groupCards[i];
            var cards = groudCard.cards;
            var count = cards.length;

            for (var j = 0; j < count; j++) {
                var card = cards[j];

                var cardSprite=new CardSprite();
                cardSprite.createCard(card);
                cardSprite.changeToSmall(true);
                cardSprite.uid=roomUser.user.uid;
                cardSprite.setScl(0);
                cardSprite.setTag(CARD_SPRITE_TAG);
                this.addChild(cardSprite,1);


                roomUser.cardSpriesLocal.push(cardSprite);

                this.subAndUpdateDeskLeftCount();
            }

        }

        this.showWorld(WORLD_BU,player.uid);


        this.sortRoomUserCard(roomUser);
        this.resetMyCardPos(roomUser,null);

       // this.releaseActionCount("补牌");

    },
    removeChildsByTag:function (tag) {

        var arr=this.getChildsByTag(this,tag);
        var len=arr.length;
        for(var i=0;i<len;i++)
        {
            var node=arr[i];
            node.removeFromParent(true);
        }
    },

    getChildsByTag:function (parent,tag) {

        var arr=[];
        var childs=parent.getChildren();
        var len=childs.length;
        for (var i = 0; i < len; i++) {
            var node = childs[i];
            if (node && node.tag === tag)
            {
                arr.push(node);

            }
            else{
                var list=this.getChildsByTag(node,tag);
                var size=list.length;
                for(var j=0;j<size;j++)
                {
                    arr.push(list[j]);
                }
            }
        }
        return arr;

    },
    getChildByTagAndCId:function(parent,tag,c_id)
    {
        var childs=parent.getChildren();
        var len=childs.length;
        for (var i = 0; i < len; i++) {
            var node = childs[i];
            if (node && node.tag === tag)
            {
                if(node.card.c_id==c_id)
                {
                    return node;
                }

            }
            else{
                var n=this.getChildByTagAndCId(node,tag,c_id);
                if(n!=null)
                {
                    return n;
                }
            }
        }
        return null;
    },
    actionTakeIn:function (player,action) {

        var roomUser=this.getRoomUserByUID(player.uid);
        var groupCards=action.groupCards;
        var len=groupCards.length;
        for(var i=0;i<len;i++) {
            var groudCard = groupCards[i];
            var cards = groudCard.cards;
            var count = cards.length;



            var tiObj=[];
            var tike=0;
            for(var j=0;j<count;j++)
            {
                var card=cards[j];
                var cardSprite=this.getRoomCurrentCard();

                if(cardSprite.card.c_id!=card.c_id)
                {
                    cardSprite=null;
                    cardSprite=this.getChildByTagAndCId(this,CARD_SPRITE_TAG,card.c_id);
                   // cc.log("##########cLen:"+cLen);
                    if(cardSprite==null)
                    {
                         cc.log("[桌面错误牌:card id:"+card.c_id+"]");
                         break;
                    }
                }
                cardSprite.uid=roomUser.user.uid;
                cardSprite.changeToSmall2();

                cardSprite.setLight(false);

                var arrMove=[];
                arrMove.push(cardSprite);

                var groups=[];
                groups.push(arrMove);

                this.moveRoomUserCardSprite(roomUser,groups,3);

                var hasAddCount=roomUser.cardSpries3Local.length-1;

                var pos=this.getHeadPos(roomUser,0,0);
                var uiPos=this.getRoomUserUIPos(roomUser);

                if(uiPos==BOTTOM_UI)
                {
                    pos.x=v_x+110;
                    pos.y=v_y+110+60;


                    pos.x+=hasAddCount*30;
                    pos.y-=50;
                }
                else if(uiPos==RIGHT_UI)
                {
                    pos.x=pos.x-70-hasAddCount*30;
                    pos.y=pos.y-90;

                }
                else if(uiPos==TOP_UI)
                {
                    pos.x=pos.x-95-hasAddCount*30;
                    pos.y=pos.y-115;


                }
                else{
                    pos.x=pos.x+70+hasAddCount*30;
                    pos.y=pos.y-70;
                }

                var delayAction=cc.delayTime(WAIT_SHOW_TIME+DELEAY_TEST);
                var moveAction = cc.moveTo(0.1+MOVE_DELEAY_T+DELEAY_TEST, pos);
                var actionCallbackFunction = cc.callFunc(this.takeInActionFinishedCallBack, this, cardSprite);
                var actionArray=[];
                actionArray.push(delayAction);
                actionArray.push(moveAction);
                actionArray.push(actionCallbackFunction);
                var actionSequence = cc.sequence(actionArray);
                cardSprite.runAction(actionSequence);

                //var scaleTo=cc.scaleTo(0.1,0.3);
               // cardSprite.runActionWithSp(scaleTo);

                break;

            }


        }

    },
    takeInActionFinishedCallBack:function (cardSprite) {

        if(cardSprite.isPut!=undefined&&cardSprite.isPut==1)
        {
            cardSprite.setRed();
        }

        this.releaseActionCount("收牌动作完成");

        cc.log("takeInActionFinishedCallBack finished call back:"+this.excuteActionCount);
    },

    showClock:function (player,roomState) {


        var hasCount=this.roomObj.players.length;
        for(var i=0;i<hasCount;i++)
        {
            var o=this.roomObj.players[i];

           // cc.log("############o.player.uid:"+o.player.uid+",player.uid:"+player.uid);

            if(o.player.uid==player.uid)
            {
                cc.log("############已经添加时间");
                return;
            }

        }

        var roomUser=this.getRoomUserByUID(player.uid);
        var node=roomUser.node;

        var head = ccui.helper.seekWidgetByName(node, "head");
        var pos=head.convertToWorldSpace(cc.p(50,60));

        this.roomObj.roomState=roomState;
        this.roomObj.uid=player.uid;
        var obj={};
        obj.startTime=new Date().getTime();
        obj.player=player;
        obj.maxTime=20;
        if(roomState==ROOM_WAIT_READY_STATE)
        {
            obj.maxTime=30;
        }
        var layer=new cc.Layer();
        this.addChild(layer,TABLE_DESKER_ZOEDER+1);


        if(NO_WAIT_TIME_OUT==1)
        {
             pos=head.convertToWorldSpace(cc.p(0,0));
            // var sp = ParticleManager.getInstance().useParticle("res/particle/weiraoxingxing_particles.plist");
            // layer.addChild(sp);
            // sp.x=0;
            // sp.y=0;
            // obj.particle=sp;
            //
            // var r=80;
            //
            // var moveAction = cc.moveTo(1, cc.p(r,0));
            // var moveAction2 = cc.moveTo(1, cc.p(r,r));
            // var moveAction3 = cc.moveTo(1, cc.p(0,r));
            // var moveAction4 = cc.moveTo(1, cc.p(0,0));
            // var actionArray=[];
            // actionArray.push(moveAction);
            // actionArray.push(moveAction2);
            // actionArray.push(moveAction3);
            // actionArray.push(moveAction4);
            // var actionSequence = cc.sequence(actionArray).repeatForever();
            // sp.runAction(actionSequence);

            // var txt = new cc.LabelTTF("20", FONT_NAME_APP, 25);
            // txt.setColor(cc.color(255,255,255));
            // txt.x=0;
            // txt.y=0;
            // txt.visible=false;
            // layer.addChild(txt);
            obj.timeLab=null;
        }
        else{
            var sp=new cc.Sprite("res/ui/room/clock_room.png");
            sp.setScale(0.5);
            layer.addChild(sp);
            var txt = new cc.LabelTTF("20", FONT_NAME_APP, 25);
            txt.setColor(cc.color(255,255,255));
            txt.x=-2;
            txt.y=2;
            layer.addChild(txt);

            var uiPos=this.getRoomUserUIPos(roomUser);

            if(player.uid==this.roleUId)
            {
                var pos2=this.getPosOfPlayerReleative(player.uid,-30,-75);
                pos.x+=pos2.x;
                pos.y+=pos2.y;
            }
            else if(uiPos==RIGHT_UI)
            {
                var pos2=this.getPosOfPlayerReleative(player.uid,30,60);
                pos.x+=pos2.x;
                pos.y+=pos2.y;

            }
            else if(uiPos==LEFT_UI)
            {
                var pos2=this.getPosOfPlayerReleative(player.uid,30,-60);
                pos.x+=pos2.x;
                pos.y+=pos2.y;

            }
            else{
                var pos2=this.getPosOfPlayerReleative(player.uid,70,60);
                pos.x+=pos2.x;
                pos.y+=pos2.y;
            }


            obj.timeLab=txt;
            playEffect2(TIME_SOUND);
        }




        layer.x=pos.x;
        layer.y=pos.y;

        obj.timeLayer=layer;
       this.roomObj.players.push(obj);
    },


    removeClock:function (uid) {

        if(uid==null)
        {
            var len=this.roomObj.players.length;
            for(var i=0;i<len;i++)
            {
                var obj=this.roomObj.players[i];
                obj.timeLayer.removeFromParent(true);
                
                if(obj.particle!=undefined)
                {
                    ParticleManager.getInstance().unUseParticle(obj.particle);
                }

            }
            this.roomObj.players=[];
        }
        else{
            var len=this.roomObj.players.length;
            for(var i=0;i<len;i++)
            {
                var obj=this.roomObj.players[i];
                if(obj.player.uid==uid)
                {

                    this.roomObj.players.splice(i,1);
                    obj.timeLayer.removeFromParent(true);

                    if(obj.particle!=undefined)
                    {
                        ParticleManager.getInstance().unUseParticle(obj.particle);
                    }

                    break;
                }

            }
        }
        var size=this.roomObj.players.length;
        if(size<=0)
        {
            stopEffect();
        }



    },
    actionWaitPut:function (player,action) {

        this.releaseActionCount("等待出牌");
    },


    actionPut:function (player,action) {

        if(player.uid==this.roleUId)
        {
            if(this.shouSp!=undefined&&this.shouSp!=null)
            {
                this.shouSp.removeFromParent(true);
                this.shouSp=null;
            }
        }
        var roomUser=this.getRoomUserByUID(player.uid);

        var groupCards=action.groupCards;
        var len=groupCards.length;
        for(var i=0;i<len;i++) {
            var groudCard = groupCards[i];
            var cards = groudCard.cards;
            var count = cards.length;
            for(var j=0;j<count;j++)
            {
                var card=cards[j];
                var cardSprite=this.getCardSpriteByCardId(roomUser,card.c_id);
                if(cardSprite==null)
                {

                    cardSprite=new CardSprite();
                    cardSprite.createCard(card);
                    cardSprite.changeToBig();
                    cardSprite.x=v_x+v_w/2;
                    cardSprite.y=v_y+v_h/2;
                    cardSprite.uid=roomUser.user.uid;
                    cardSprite.setScl(0);
                    cardSprite.setTag(CARD_SPRITE_TAG);
                    this.addChild(cardSprite,1);

                }
                else{
                    this.removeCardSpriteFromRoomUserLocal1(card.c_id);
                    cardSprite.changeToBig();
                    cardSprite.setScl(0);
                }

                cardSprite.isPut=1;

                cardSprite.setLocalZOrder(TABLE_DESKER_ZOEDER);
                cardSprite.visible=true;
               // var uiPos=this.getRoomUserUIPos(roomUser);
                // var pos=this.getPosOfPlayer(cardSprite.uid,300,0);
                //
                // if(uiPos==LEFT_UI||uiPos==RIGHT_UI)
                // {
                //     pos.y+=100;
                // }


                var uiPos=this.getRoomUserUIPos(roomUser);

                if(uiPos==TOP_UI)
                {
                    var headPos=this.getHeadPos(roomUser,0,0);
                    cardSprite.x=headPos.x;
                    cardSprite.y=headPos.y;

                    //pos=this.getHeadPos(roomUser,200,0);
                   // pos.y+=i*50-100;
                }
                else if(uiPos!=BOTTOM_UI){

                    var headPos=this.getHeadPos(roomUser,0,0);
                    cardSprite.x=headPos.x;
                    cardSprite.y=headPos.y;

                   // pos=this.getHeadPos(roomUser,300,0);
                   // pos.y+=i*50-100;
                }




                var pos=this.getRoomUserShowCardPos(player.uid);


                var delayAction=cc.delayTime(0.5+DELEAY_TEST);
                var moveAction = cc.moveTo(0.1+MOVE_DELEAY_T+DELEAY_TEST, pos);
                var actionCallbackFunction = cc.callFunc(this.cardPutActionFinishedCallBack, this, cardSprite);
                var actionArray=[];
                actionArray.push(moveAction);
                actionArray.push(delayAction);
                actionArray.push(actionCallbackFunction);
                var actionSequence = cc.sequence(actionArray);
                cardSprite.runAction(actionSequence);
                var scaleTo=cc.scaleTo(0.1+MOVE_DELEAY_T,1);
                cardSprite.runActionWithSp(scaleTo);


                 this.resetMyCardPos(roomUser,null);
                //

                var roomUser=this.getRoomUserByUID(player.uid);
                var card_name="card/";
                if(roomUser.user.sex==1)
                {

                    card_name+="v";
                }
                else{

                    card_name+="n";
                }

                if(card.type==0)
                {
                    card_name+=(10+card.value)+".mp3";
                }
                else{
                    card_name+=card.value+".mp3";
                }


                playEffect(card_name);

                break;

            }



        }



    },
    cardPutActionFinishedCallBack:function (cardSprite) {

        if(this.roomInfo.currentCard!=undefined)
        {
            cc.log("[更新当前打出牌,oldType"+this.roomInfo.currentCard.card.type+",oldVelue:"+this.roomInfo.currentCard.card.value+",newType:"+cardSprite.card.type+",newValue:"+cardSprite.card.value+"]");
        }

        this.releaseActionCount("出牌动作完成");
        this.roomInfo.currentCard=cardSprite;



        cc.log("[出牌结束]");

    },
    actionHideButton:function (player,action) {

    },
    actionCancleTimeOut:function (player,action) {

    },
    actionWei:function (player,action) {
        this.buildMoveAction(player,action,ACTION_WEI);
        this.showWorld(WORLD_WEI,player.uid);


        var roomUser=this.getRoomUserByUID(player.uid);
        if(roomUser.user.sex==1)
        {
            playEffect(operSound.wei.v);
        }
        else{
            playEffect(operSound.wei.n);
        }
    },

    checkHasWeiThiCard:function (card) {


        var roomUsers=this.roomInfo.roomUsers;
        var len=roomUsers.length;
        for(var i=0;i<len;i++)
        {
            var roomUser=roomUsers[i];
            var len2=roomUser.cols2Local.length;
            for(var j=0;j<len2;j++) {
                var arr = roomUser.cols2Local[j];
                var size=arr.length;
                if(size==3)
                {
                    var hasBack=false;
                    for(var k=0;k<size;k++)
                    {
                        var c=arr[k];
                        if(c.isBack==1&&c.value==card.value&&c.type==card.type)
                        {
                            hasBack=true;
                            break;
                        }

                    }


                    if(hasBack)
                    {
                        return true;
                    }

                }


            }



        }

        return false;
    },

    onTouchBegan:function (touch, event) {

        var target = event.getCurrentTarget();
        if(target.hasSendPutCard!=undefined&&target.hasSendPutCard)
        {
            return true;
        }
        var pos=touch.getLocation();
        target.selectedCard=null;
        target.lastPos=pos;

        target.touchMoveParticle.x=pos.x;
        target.touchMoveParticle.y=pos.y;
        target.touchMoveParticle.visible=true;


        if(target.myRoomUser!=undefined&&target.myRoomUser!=null&&target.myRoomUser.colsLocal!=undefined)
        {
            var len=target.myRoomUser.colsLocal.length;
            for(var i=0;i<len;i++) {
                var arr = target.myRoomUser.colsLocal[i];
                var size=arr.length;
                for(var j=0;j<size;j++)
                {
                    var card=arr[j];
                    var cardSprite=target.getCardSpriteByCardId(target.myRoomUser,card.c_id);

                    if(cardSprite.hasContainsPos(pos))
                    {
                        var count=1;
                        for(var k=0;k<size;k++) {
                            var card2 = arr[k];
                            if(card2.c_id==card.c_id)
                            {
                                continue;
                            }
                            if(card2.type==card.type&&card2.value==card.value)
                            {
                                count++;
                            }

                        }
                        if(count<3)
                        {

                            target.selectedCard=cardSprite;
                            target.selectedCard.org={};
                            target.selectedCard.org.x=target.selectedCard.x;
                            target.selectedCard.org.y=target.selectedCard.y;

                            //cc.log("选中##############");
                        }

                        break;

                    }

                }

                if(target.selectedCard!=null)
                {

                    break;
                }

            }


        }

        return true;
    },
    onTouchMoved:function (touch, event) {

        var target = event.getCurrentTarget();
        if(target.hasSendPutCard!=undefined&&target.hasSendPutCard)
        {
            return;
        }

        var pos = touch.getLocation();

        target.touchMoveParticle.x=pos.x;
        target.touchMoveParticle.y=pos.y;


        var subPos=cc.pSub(pos,target.lastPos);
        target.lastPos=pos;
        if(target.selectedCard!=null)
        {
            target.selectedCard.x+=subPos.x;
            target.selectedCard.y+=subPos.y;
        }
    },
    onTouchEnded:function (touch, event) {
        var target = event.getCurrentTarget();

        target.touchMoveParticle.visible=false;


        if(target.hasSendPutCard!=undefined&&target.hasSendPutCard)
        {
            return;
        }


        if(target.selectedCard!=null)
        {

            playEffect("huapai.mp3");

            if(target.roomObj.roomState==ROOM_WAIT_PUT_STATE&&target.roomObj.uid==target.roleUId)
            {
                //出牌
                var x=v_x;
                var y=v_y+360;
                var w=v_w;

                if(target.selectedCard.x>x&&target.selectedCard.x<(x+w)&&target.selectedCard.y>y)
                {

                    if(target.checkHasWeiThiCard(target.selectedCard.card))
                    {

                        target.roomTip=new TouchLayer();
                        target.addChild(target.roomTip,TABLE_DESKER_ZOEDER+2);

                        var node = parseUI("res/ui/roomTip/roomTip.json", CENTER);
                        target.roomTip.addChild(node);

                        var t= ccui.helper.seekWidgetByName(node, "t");
                        t.setString("该牌有玩家偎,打出该牌后将不能动张,是否打出?");

                        var b1= ccui.helper.seekWidgetByName(node, "b1");
                        b1.addTouchEventListener(target.roomTipB1Clicked,target);
                        b1.type=2;

                        var b2= ccui.helper.seekWidgetByName(node, "b2");
                        b2.addTouchEventListener(target.roomTipB2Clicked,target);
                        b2.type=2;

                    }
                    else{
                      //  var pos=target.getRoomUserShowCardPos(target.selectedCard.uid);

                       // target.selectedCard.x=pos.x;
                       // target.selectedCard.y=pos.y;

                        var req=new PutCardRequest();
                        req.uid=target.roleUId;
                        req.roomId=target.roomInfo.roomId;
                        req.c_id=target.selectedCard.card.c_id;
                        cc.log("[发送出牌请求c_id:"+req.c_id+"]");
                        socketMgr.socket.send(PUT_CARD_REQUEST,req);

                        target.hasSendPutCard=true;


                    }


                    return;

                }
                // else{
                //     target.selectedCard.x=target.selectedCard.org.x;
                //     target.selectedCard.y=target.selectedCard.org.y;
                // }

            }

            {

                var hasAction=false;

                var cardSize=target.selectedCard.getSize();
                var len=target.myRoomUser.colsLocal.length;
                var min_x=v_x+v_w/2-(len-1)/2*target.gap_w-cardSize.width/2;
                var max_x=v_x+v_w/2+(len-1)/2*target.gap_w+cardSize.width/2;
                var min_y=v_y+target.y_a;

                // cc.log("target.selectedCard.x:"+target.selectedCard.x+"<"+min_x);
                if(target.selectedCard.x<min_x)
                {
                    //cc.log("len:"+len);
                    if(len<10) {
                        target.selectedCard.moveType = 0;
                        var xx = v_x + v_w / 2 - (len-1) / 2 * target.gap_w-target.gap_w;
                        var pos = cc.p(xx, min_y);
                        var moveAction = cc.moveTo(0.1+DELEAY_TEST, pos);
                        var actionCallbackFunction = cc.callFunc(target.touchMoveFinished, target, target.selectedCard);
                        var actionArray = [];
                        actionArray.push(moveAction);
                        actionArray.push(actionCallbackFunction);
                        var actionSequence = cc.sequence(actionArray);
                        target.selectedCard.runAction(actionSequence);
                        hasAction=true;
                    }
                }
                else if(target.selectedCard.x>max_x)
                {
                    if(len<10) {
                        target.selectedCard.moveType = 1;
                        var xx = v_x + v_w / 2 + (len-1) / 2 * target.gap_w+target.gap_w;
                        var pos = cc.p(xx, min_y);
                        var moveAction = cc.moveTo(0.1+DELEAY_TEST, pos);
                        var actionCallbackFunction = cc.callFunc(target.touchMoveFinished, target, target.selectedCard);
                        var actionArray = [];
                        actionArray.push(moveAction);
                        actionArray.push(actionCallbackFunction);
                        var actionSequence = cc.sequence(actionArray);
                        target.selectedCard.runAction(actionSequence);
                        hasAction=true;
                    }

                }
                else{

                    var flg=false;
                    for(var i=0;i<len;i++)
                    {
                        var tmpArr=target.myRoomUser.colsLocal[i];
                        var size=tmpArr.length;
                        var isInThiCol=false;
                        for(var j=0;j<size;j++)
                        {
                            var card=tmpArr[j];
                            var cardSprite=target.getCardSpriteByCardId(target.myRoomUser,card.c_id);
                            if(cardSprite==target.selectedCard)
                            {
                                isInThiCol=true;
                                continue;
                            }
                            if(cardSprite.hasContainsPos(cc.p(target.selectedCard.x,target.selectedCard.y)))
                            {
                                flg==true;
                                break;
                            }
                        }
                        if(flg)
                        {
                            cc.log("#");
                            break;
                        }

                        if(size<3||isInThiCol)
                        {
                            var r_x=v_x+v_w/2-(len-1)/2*target.gap_w+i*target.gap_w-cardSize.width/2;
                            var r_y=v_y+target.y_a;
                            var r_w=cardSize.width;
                            var r_h=500;

                            //   cc.log("#("+target.selectedCard.x+","+target.selectedCard.y+")");
                            //   cc.log("("+r_x+","+r_y+","+r_w+","+r_h+")");
                            if(target.selectedCard.x>r_x&&target.selectedCard.x<(r_x+r_w)&&target.selectedCard.y>r_y&&target.selectedCard.y<(r_y+r_h))
                            {
                                target.selectedCard.moveType = 2;
                                target.selectedCard.moveCol=i;

                                var pos = cc.p(v_x+v_w/2-(len-1)/2*target.gap_w+i*target.gap_w, r_y+(size)*target.gap_h);
                                var moveAction = cc.moveTo(0.1+DELEAY_TEST, pos);
                                var actionCallbackFunction = cc.callFunc(target.touchMoveFinished, target, target.selectedCard);
                                var actionArray = [];
                                actionArray.push(moveAction);
                                actionArray.push(actionCallbackFunction);
                                var actionSequence = cc.sequence(actionArray);
                                target.selectedCard.runAction(actionSequence);

                                hasAction=true;
                                break;
                            }


                        }
                    }



                }

                if(!hasAction)
                {
                    target.selectedCard.x=target.selectedCard.org.x;
                    target.selectedCard.y=target.selectedCard.org.y;
                }

            }



        }
    },
    touchMoveFinished:function (cardSprite) {



        var len=this.myRoomUser.colsLocal.length;
        var hasDel=false;
        for(var i=0;i<len;i++)
        {
            var tmpArr=this.myRoomUser.colsLocal[i];
            var flg=false;
            var size=tmpArr.length;
            for(var j=0;j<size;j++)
            {
                var card=tmpArr[j];
                if(card.c_id==cardSprite.card.c_id)
                {
                    tmpArr.splice(j,1);
                    flg=true;
                    hasDel=true;
                    break;
                }

            }

            if(flg)
            {
                break;
            }

        }

        if(hasDel)
        {
            if(cardSprite.moveType==0)//左边
            {
                var arr=[];
                arr.push(cardSprite.card);

                this.myRoomUser.colsLocal.splice(0, 0, arr);
            }
            else if(cardSprite.moveType==1)//右边
            {
                var arr=[];
                arr.push(cardSprite.card);

                this.myRoomUser.colsLocal.push(arr);
            }
            else{
                var index=cardSprite.moveCol;
                var tmpArr=this.myRoomUser.colsLocal[index];
                tmpArr.push(cardSprite.card);
            }

           len=this.myRoomUser.colsLocal.length;
            for(var i=0;i<len;i++)
            {
                var tmpArr=this.myRoomUser.colsLocal[i];
                if(tmpArr.length<=0)
                {
                    this.myRoomUser.colsLocal.splice(i,1);
                    i--;
                    len--;
                }

            }

           // cc.log("touch move finished!!!");
            this.resetMyCardPos(this.myRoomUser,null);
        }

    },
    findRoomUserByUid:function(uid)
    {

        var roomUsers=this.roomInfo.roomUsers;
        var len=roomUsers.length;
        for(var i=0;i<len;i++)
        {
            var roomU=roomUsers[i];
            var user=roomU.user;
            if(user.uid==uid)
            {
                return roomU;
            }

        }

        return null;

    },
    chiFinishedEvent:function (obj,target) {

        //this.excuteActionCount--;
        //if(this.excuteActionCount<0)this.excuteActionCount=0;

        target.hideSlectedButton(this.roleUId);
    },
    downLoadBar:function (obj,target) {

        var count=obj.count;
        var maxCount=obj.maxCount;
        //cc.log("文件下载:"+count+"/"+maxCount);

        target.loadLab.setString("回放数据下载中:"+parseInt((count/1024))+"/"+parseInt(maxCount/1024)+"k");
    },
    downLoadFinished:function (obj,target) {

        var path=obj.path;
        var filePath=path.split("/");
        var fileName="";
        if(filePath.length>0) {
            fileName = filePath[filePath.length - 1];

        }
        var fix=getFix(fileName);

        if(target.roomInfo!=undefined)
        {

            //cc.log("#########downfinished:"+fix+" "+fileName);
            if(fix==".spx")
            {

            }
            else if(fix==".png"||fix==".jpg"){

                var headIconPath=obj.savePath;
                cc.log("######下载完成:" + headIconPath);
                if(checkFileExit(headIconPath))
                {

                    var p_s=headIconPath.split("/");
                    var str="";
                    if(p_s.length>0) {
                        str = p_s[p_s.length - 1];
                    }
                    var str_s=str.split("_");
                    var uid=str_s[0];
                    cc.log("下载的的头像用户UID:"+uid);
                    var roomUsr=target.findRoomUserByUid(uid);
                    if(roomUsr!=null)
                    {
                        var headBg = ccui.helper.seekWidgetByName(roomUsr.node, "head");
                        var headSprite=new cc.Sprite(headIconPath);
                        headSprite.x=headBg.x;
                        headSprite.y=headBg.y;
                        headSprite.setScale(head_scale);
                        headBg.getParent().addChild(headSprite,1);
                    }

                }


            }
        }

        if(fix==".bin")
        {

            cc.loader.loadBinary(obj.savePath,function (err,data) {

                target.data=data;
                target.index=0;

                var tmpCount=target.readDataShort();
                var byteBuff=target.readDataBuf(tmpCount);
                var roomInfoNotify=new RoomInfoNotify();
                roomInfoNotify.read(byteBuff);
                target.onReceive(ROOM_INFO_NOTIFY,roomInfoNotify,target);

                tmpCount=target.readDataShort();
                byteBuff=target.readDataBuf(tmpCount);

                var finishGameNotify=new PlayBackFinishInfoNotify();
                var infos=[];
                finishGameNotify.infos=infos;
                var finishCount=byteBuff.readShort();
                console.log("[结算数目:"+finishCount+"]");
                for(var k=0;k<finishCount;k++)
                {
                    var f=new PlayBackFinisheGameInfo();
                    f.read(byteBuff);
                    infos.push(f);
                }
                target.onReceive(PLAY_BACK_FINISH_INFO_NOTIFY,finishGameNotify,target);

                tmpCount=target.readDataShort();
                target.flowCount=tmpCount;
                target.flowIndex=0;

                target.isStop=false;
                target.setOperBar();

                if(target.loadDataLayer!=undefined&&target.loadDataLayer!=null)
                {
                    target.loadDataLayer.removeFromParent(true);
                    target.loadDataLayer=null;
                }


            })



        }

    },
    readDataShort:function () {

        var byteBuffer=new ByteBuffer()
        byteBuffer.initBlank();

        for(var i=0;i<2;i++)
        {
            byteBuffer.putUint8(this.data[this.index++]);
        }
        byteBuffer.offset=0;
        return byteBuffer.readShort();
    },
    readDataBuf:function (count) {

        var byteBuffer=new ByteBuffer()
        byteBuffer.initBlank();

        for(var i=0;i<count;i++)
        {
            byteBuffer.putUint8(this.data[this.index++]);
        }
        byteBuffer.offset=0;
        return byteBuffer;
    },
    getRoomUserShowCardPos:function (uid) {

        var roomUser=this.getRoomUserByUID(uid);
        var pos=this.getPosOfPlayer(uid,350,0);


        if(uid==this.roleUId)
        {


        }
        else{

            var uiPos=this.getRoomUserUIPos(roomUser);

            if(uiPos==TOP_UI)
            {

                pos=this.getHeadPos(roomUser,100,0);

            }
            else{


                pos=this.getHeadPos(roomUser,300,0);

            }


        }

        return pos;

    },
    actionUpdate:function (dt) {
        var len=this.tiQueue.length;
        while(len>0&&this.tiNext==0)
        {
            cc.log("[动作播放]");
            this.tiActionMoveCards=[];
            var tiObj=this.tiQueue[0];
            var groups=tiObj.groupCards;
            var gSize=groups.length;
            var gw=this.gap_w;

            for(var gIndex=0;gIndex<gSize;gIndex++)
            {
                var cardArr=groups[gIndex];
                var size=cardArr.length;
                cc.log("[第"+(gIndex+1)+"组:"+size+"]");
                for(var i=0;i<size;i++)
                {
                    var cardSprite=cardArr[i];
                    cardSprite.visible=true;


                    var pos=this.getRoomUserShowCardPos(cardSprite.uid);
                    var roomUser=this.getRoomUserByUID(cardSprite.uid);

                    var init_x=pos.x-(gSize-1)/gw;
                    pos.x=init_x+gIndex*gw;

                    var pos2=cc.p(0,0);
                    pos2.x=init_x+gIndex*this.gap_w2;
                    pos2.y=pos.y;
                    
                    if(cardSprite.uid==this.roleUId)
                    {



                        pos.y+=i*50-50;


                    }
                    else{


                        var uiPos=this.getRoomUserUIPos(roomUser);

                        if(uiPos==TOP_UI)
                        {
                            var headPos=this.getHeadPos(roomUser,0,0);
                            cardSprite.x=headPos.x;
                            cardSprite.y=headPos.y;

                            pos.y+=i*50-50;


                        }
                        else{
                            var headPos=this.getHeadPos(roomUser,0,0);
                            cardSprite.x=headPos.x;
                            cardSprite.y=headPos.y;

                            pos.y+=i*50-50;
                        }


                    }

                    pos2.y+=-50+i*this.gap_h2;

                    cardSprite.setLocalZOrder(size-i+TABLE_DESKER_ZOEDER);

                    cardSprite.changeToSmall();
                    cardSprite.setScl(SMALL_CARD_SCL);


                    cardSprite.pos2=pos2;


                    var moveAction = cc.moveTo(0.1+MOVE_DELEAY_T, pos);
                    var actionCallbackFunction = cc.callFunc(this.tiMoveActionFinishCallFunction, this, cardSprite);
                    var delayAction2=cc.delayTime(0.5+DELEAY_TEST);
                    var actionArray=[];

                    actionArray.push(moveAction);
                    actionArray.push(delayAction2);
                    actionArray.push(actionCallbackFunction);
                    var actionSequence = cc.sequence(actionArray);
                    cardSprite.runAction(actionSequence);

                   // var scaleTo=cc.scaleTo(0.1,0.8);
                   // cardSprite.runActionWithSp(scaleTo);

                    this.tiNext++;
                }

            }



            this.tiQueue.splice(0,1);


            break;
        }

        if(this.roomObj.roomState==ROOM_WAIT_PUT_STATE||this.roomObj.roomState==ROOM_WAIT_SELECTED_STATE||this.roomObj.roomState==ROOM_WAIT_READY_STATE)
        {
            var t=new Date().getTime();
            var players=this.roomObj.players;
            var count=players.length;
            for(var i=0;i<count;i++)
            {
                var obj=players[i];
                var t2=t-obj.startTime;
                var t3=obj.maxTime-t2/1000;
                if(t3<0)t3=0;
                t3=Math.round(t3);

                if(obj.timeLab!=null)
                {
                    obj.timeLab.setString(""+t3);
                }


                if(NO_WAIT_TIME_OUT!=1)
                {
                    if(t3<=0)
                    {

                        this.releaseActionCount("等待超时间:"+this.roomObj.roomState);

                        if(this.roomObj.roomState==ROOM_WAIT_SELECTED_STATE)
                        {


                            this.hideSlectedButton(obj.player.uid);
                        }
                        else{
                            this.roomObj.players.splice(i,1);
                            obj.timeLayer.removeFromParent(true);
                            if(obj.particle!=undefined)
                            {
                                ParticleManager.getInstance().unUseParticle(obj.particle);
                            }
                        }


                        break;
                    }
                }


                if(t2/1000>60&&obj.playEffect==undefined)
                {

                    var roomUser=this.getRoomUserByUID(obj.player.uid);
                    if(this.roomObj.roomState==ROOM_WAIT_PUT_STATE)
                    {
                        if(roomUser.user.sex==1)
                        {
                            playEffect("msg/"+effectSound.xianhua4.v);
                        }
                        else{
                            playEffect("msg/"+effectSound.xianhua4.n);
                        }

                        //cc.log("播放*******:"+roomUser.user.sex+"===="+effectSound.xianhua4.v);
                    }
                    else if(this.roomObj.roomState==ROOM_WAIT_SELECTED_STATE)
                    {

                        if(roomUser.user.sex==1)
                        {
                            playEffect("msg/"+effectSound.xianhua2.v);
                        }
                        else{
                            playEffect("msg/"+effectSound.xianhua2.n);
                        }


                    }
                    obj.playEffect=true;
                }


                if(obj.particle==undefined)
                {

                    //cc.log("obj##########:"+obj.player.uid);
                    var sp = ParticleManager.getInstance().useParticle("res/particle/weiraoxingxing_particles.plist");
                    obj.timeLayer.addChild(sp);
                    sp.x=0;
                    sp.y=0;
                    obj.particle=sp;

                    var r=80;

                    var moveAction = cc.moveTo(1, cc.p(r,0));
                    var moveAction2 = cc.moveTo(1, cc.p(r,r));
                    var moveAction3 = cc.moveTo(1, cc.p(0,r));
                    var moveAction4 = cc.moveTo(1, cc.p(0,0));
                    var actionArray=[];
                    actionArray.push(moveAction);
                    actionArray.push(moveAction2);
                    actionArray.push(moveAction3);
                    actionArray.push(moveAction4);
                    var actionSequence = cc.sequence(actionArray).repeatForever();
                    sp.runAction(actionSequence);

                }

            }

            if(NO_WAIT_TIME_OUT==1)
            {


                if(this.roomObj.roomState==ROOM_WAIT_READY_STATE)
                {
                    if(this.roomObj.players.length<=0)
                    {
                        this.roomObj.roomState=ROOM_GAMEING_STATE;
                        // cc.log("###this.excuteActionCount:"+this.excuteActionCount);
                    }
                }

              //  cc.log("t2/1000:"+(t2/1000));


            }
            else{
                if(this.roomObj.players.length<=0)
                {
                    this.roomObj.roomState=ROOM_GAMEING_STATE;
                    // cc.log("###this.excuteActionCount:"+this.excuteActionCount);
                }
            }


        }

        while(this.wordQueue.length>0&&this.wordShowCount==0)
        {
            var obj=this.wordQueue[0];
            this.wordQueue.splice(0,1);
            var uid=obj.uid;

            var roomUser=this.getRoomUserByUID(uid);
            var uiPos=this.getRoomUserUIPos(roomUser);

            var sp=null;
            switch(obj.type){
                case WORLD_CHI:
                {
                    sp=new cc.Sprite("res/ui/room/zchi_room.png");
                }
                    break;
                case WORLD_HU:
                {
                    sp=new cc.Sprite("res/ui/room/zhu_room.png");
                }
                    break;
                case WORLD_PAO:
                {
                    sp=new cc.Sprite("res/ui/room/zpao_room.png");
                }
                    break;
                case WORLD_PENG:
                {
                    sp=new cc.Sprite("res/ui/room/zpeng_room.png");
                }
                    break;
                case WORLD_TI:
                {
                    sp=new cc.Sprite("res/ui/room/zti_room.png");
                }
                    break;
                case WORLD_WEI:
                {
                    sp=new cc.Sprite("res/ui/room/zwei_room.png");
                }
                    break;
                case WORLD_BI:
                {
                    sp=new cc.Sprite("res/ui/room/bi_room.png");
                }
                    break;
                case WORLD_HUANGZHUANG:
                {
                    sp=new cc.Sprite("res/ui/room/huangzhuang_room.png");
                }
                    break;
                case WORLD_BU:
                {
                    sp=new cc.Sprite("res/ui/room/bu_room.png");
                }
                    break;
                case WORLD_TIAN_HU:
                {
                    sp=new cc.Sprite("res/ui/room/tianhu_room.png");
                }
                    break;
                case WORLD_DI_HU:
                {
                    sp=new cc.Sprite("res/ui/room/dihu_room.png");
                }
                    break;
                case WORLD_ZI_MO:
                {
                    sp=new cc.Sprite("res/ui/room/zimo_room.png");
                }
                    break;


            }

            if(sp==null)
            {
                break;
            }

            var pos=this.getPosOfPlayer(uid,0,0);
            sp.x=pos.x;
            sp.y=pos.y;
            sp.setScale(0);
            sp.type=obj.type;

            this.addChild(sp,TABLE_DESKER_ZOEDER+2);

            var pos2=cc.p(v_x+v_w/2,v_y+v_h/2+100);
            if(uiPos==BOTTOM_UI)
            {
                pos2.x+=100;
            }
            else if(uiPos==TOP_UI)
            {
                pos2.x+=100;
            }

            var moveAction = cc.moveTo(0.1+MOVE_DELEAY_T, pos2);
            var actionCallbackFunction = cc.callFunc(this.wordMoveActionFinishCallFunction, this, sp);
            var delayAction2=cc.delayTime(1);
            var actionArray=[];
            actionArray.push(moveAction);
            actionArray.push(delayAction2);
            actionArray.push(actionCallbackFunction);
            var actionSequence = cc.sequence(actionArray);

            var scaleTo=cc.scaleTo(0.1,1);

            var ac=cc.spawn(scaleTo,actionSequence);
            sp.runAction(ac);


            this.wordShowCount++;


            break;

        }

    },
    wordMoveActionFinishCallFunction:function (sp) {
        this.wordShowCount--;
        if(this.wordShowCount<0)this.wordShowCount=0;

        if(sp.type==WORLD_HU||sp.type==WORLD_HUANGZHUANG||sp.type==WORLD_ZI_MO||sp.type==WORLD_TIAN_HU||sp.type==WORLD_DI_HU)
        {
            this.showFinishedLayer();
            this.releaseActionCount("黄庄或者胡动作执行完成");

            if(RULE_VALUE==ROOM_TYPE_HONGHU_147)
            {
                this.roomInfo.leftCount--;
                if(this.roomInfo.leftCount<0)this.roomInfo.leftCount=0;
                this.updateRoomBaseInfoUI();





            }


        }
        else if(sp.type==WORLD_BU)
        {
            this.releaseActionCount("补牌完成");
        }




        sp.removeFromParent(true);




    },
    tiMoveActionFinishCallFunction:function (cardSprite) {

        this.tiNext--;
        this.tiActionMoveCards.push(cardSprite);
        if(this.tiNext<=0)
        {

            var uid=cardSprite.uid;
            var roomUser=this.getRoomUserByUID(uid);
            var head = ccui.helper.seekWidgetByName(roomUser.node, "head");




                var size=this.tiActionMoveCards.length;
                roomUser.tiCount=0;
                for(var j=0;j<size;j++)
                {
                    var cardSprite=this.tiActionMoveCards[j];

                    cardSprite.changeToSmall2();
                    cardSprite.x=cardSprite.pos2.x;
                    cardSprite.y=cardSprite.pos2.y;


                    var pos=this.getPosOfCardInMyCards2(roomUser,cardSprite.card);

                    var delayAction=cc.delayTime(WAIT_SHOW_TIME+DELEAY_TEST);
                    var moveAction = cc.moveTo(0.1+MOVE_DELEAY_T+DELEAY_TEST, pos);
                    var actionCallbackFunction = cc.callFunc(this.tiMoveActionFinishCallFunction2, this, cardSprite);
                    var actionArray=[];

                    actionArray.push(delayAction);
                    actionArray.push(moveAction);
                    actionArray.push(actionCallbackFunction);
                    var actionSequence = cc.sequence(actionArray);
                    cardSprite.runAction(actionSequence);

                   // var scaleTo=cc.scaleTo(0.1+DELEAY_T,0.3);
                   // cardSprite.runActionWithSp(scaleTo);

                    roomUser.tiCount++;

                }






        }
    },
    tiMoveActionFinishCallFunction2:function (cardSprite) {

        var uid=cardSprite.uid;
        var roomUser=this.getRoomUserByUID(uid);

        roomUser.tiCount--;
        if(roomUser.tiCount<=0)
        {
            this.resetMyCardPos2(roomUser);
            this.releaseActionCount("牌型动作移动完成");
        }


    },
    onExit:function () {
        this._super();
        EventManager.getInstance().unregist(this);
        Service.getInstance().unregist(this);

    },



});