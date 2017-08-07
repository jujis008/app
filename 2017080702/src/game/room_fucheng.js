/**
 * Created by yungu on 16/12/21.
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
var ACTION_TOUCH_CARD2=23;//
var ACTION_TAKE_IN2=24;
var ACTION_KE_BAOPAI=25;
var ACTION_BAOPAI=26;//爆牌
var ACTION_DANSHUANG_SHEN=27;//歪胡子单双神
var ACTION_KE_TI=28;//:可提
var ACTION_KE_PAO=29;//:可跑
var ACTION_KE_TI2=30;//1:通过偎转提
var ACTION_KE_PAO2=31;//1:通过碰转跑
var ACTION_KE_WEI=32;//可歪
var ACTION_SI_SHOU=33;//死手,
var ACTION_KE_JU_SHOU=34;//可举手,
var ACTION_JU_SHOU=35;//举手,
var ACTION_TOUCH2=36;// 摸
var ACTION_TOUCH3=37;// 醒牌


var ROOM_NO_STATE=0;
var ROOM_GAMEING_STATE=1;
var ROOM_WAIT_PUT_STATE=2;
var ROOM_WAIT_SELECTED_STATE=3;
var ROOM_WAIT_READY_STATE=4;

var TABLE_DESKER_ZOEDER=1000;

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
var WORLD_BAO=13;
var WORLD_SISHOU=14;
var WORLD_DANSHEN=15;
var WORLD_SHUANGSHEN=16;
var WORLD_JUSHOU=17;
var WORLD_FANXING=18;
var WORLD_YOUSHEN=19;
var WORLD_MEISHEN=20;

var CARD_SPRITE_TAG=1000;

var DELEAY_TEST=0;
var DELEAY_T=0.2;
var MOVE_DELEAY_T=0.05;


var PLAYER_TYPE=0;
var ZHUANGJIA_TYPE=1;
var XIANJIA_TYPE=2;

var OLD_CARD=0;
//var BIG_CARD_SCL=0.8;
var SMALL_CARD_SCL=1;
//var SMALL_CARD_SCL2=0.3;


var WAIT_SHOW_TIME=0.2;

var createRoomObj={};

var isSetAck=1;

var checkTouchCardCount=3;

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

var RoomSceneFuCheng=cc.Layer.extend({


    ctor: function (sceneId) {
        this._super();


        this.sceneId=sceneId;



        var room_bg=cc.sys.localStorage.getItem("room_bg");
        var bgIndex=-1;
        if(room_bg!=undefined&&room_bg!="")
        {
            bgIndex=parseInt(room_bg);


        }
        else{
            bgIndex=1;

        }

        this.resetBg(bgIndex);


        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);



        Service.getInstance().regist(ROOM_INFO_NOTIFY,this,this.onReceive);
        Service.getInstance().regist(FLUSH_ROOM_NOTIFY,this,this.onReceive);
        Service.getInstance().regist(FLOWS_NOTIFY,this,this.onReceive);
        Service.getInstance().regist(OPERATE_CARD_RESPONSE,this,this.onReceive);
        Service.getInstance().regist(PASS_OPERATE_RESPONSE,this,this.onReceive);
        Service.getInstance().regist(ROOM_INFO_FLUSH_NOTIFY,this,this.onReceive);
        Service.getInstance().regist(PUT_CARD_RESPONSE,this,this.onReceive);
        Service.getInstance().regist(GAME_FINISHED_NOTIFY,this,this.onReceive);
        Service.getInstance().regist(READY_RESPONSE,this,this.onReceive);
        Service.getInstance().regist(OFF_LINE_NOTIFY,this,this.onReceive);
        Service.getInstance().regist(ROOM_PLAYER_CARDS_NOTIFY,this,this.onReceive);
        Service.getInstance().regist(YUYIN_NOTIFY,this,this.onReceive);
        Service.getInstance().regist(MSG_RESPONSE,this,this.onReceive);
        Service.getInstance().regist(DISMISS_NOTIFY,this,this.onReceive);
        Service.getInstance().regist(DISMISS_RESPONSE,this,this.onReceive);
        Service.getInstance().regist(ROLEINFO_NOTIFY,this,this.onReceive);
        Service.getInstance().regist(PLAY_EFFECT_RESPONSE,this,this.onReceive);
        Service.getInstance().regist(ACK_RESPONSE,this,this.onReceive);
        Service.getInstance().regist(SI_SHOU_RESPONSE,this,this.onReceive);




        EventManager.getInstance().regist("DOWN_LOAD_FINISHED_EVENT",this,this.downLoadFinished);
        EventManager.getInstance().regist("CHI_FINISHED_EVENT",this,this.chiFinishedEvent);
        EventManager.getInstance().regist("ROOM_BG_CHANGE_EVENT",this,this.resetBgEvent);


        this.effectQueue=[];
        this.ackQueue=[];
        this.hasNotifyFlows={};

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



        if(CARD_TYPE==1)
        {
            this.y_a=30;
            this.gap_h=111*SMALL_CARD_SCL-30;
            this.gap_w=77*SMALL_CARD_SCL;

            this.gap_w2=32;
            this.gap_h2=36;

            this.bigCard_h=178;

        }
        else{

            this.y_a=0;
            this.gap_h=154*SMALL_CARD_SCL-80;
            this.gap_w=69*SMALL_CARD_SCL;

            this.gap_w2=35;
            this.gap_h2=43;

            this.bigCard_h=154;
        }








        this.deskLeftCardCount=80;
        this.wordQueue=[];
        this.wordShowCount=0;
        this.hasClearCards=false;

        this.offLineUser={};

        if(gameState!=GAME_PLAYING_IN_ROOM)
        {
            playBgMusic(2);
        }


        this.lineSp=new cc.Sprite("res/ui/room_fucheng/line_room.png");
        this.addChild(this.lineSp);
        this.lineSp.visible=false;

         this.schedule(this.testAck, 10);


        ParticleManager.getInstance().buildParticlePool("res/particle/weiraoxingxing_particles.plist",10);

        this.touchMoveParticle= ParticleManager.getInstance().useParticle("res/particle/weiraoxingxing_particles.plist");
        this.addChild(this.touchMoveParticle,TABLE_DESKER_ZOEDER+100);
        this.touchMoveParticle.visible=false;

        this.hasCheckedIp={};
        this.schedule(this.ipCheck, 5.0);


        this.operateResponseQueue=[];

        this.tmpNodeArr=[];

        this.myState=0;


        this.player_state=0;
        this.fanxing_card=[];//桂林翻醒card
        this.putCardByType=-1;


        this.gap_w2_2=35;
        this.gap_h2_2=43;



    },

    resetCardType:function()
    {



        if(this.roomInfo==undefined)
        {
            return;
        }

        CARD_TYPE++;
        if(CARD_TYPE>2)
        {
            CARD_TYPE=0;
        }


        if(CARD_TYPE==0)
        {
            cardPath="room_fucheng/card2";


            this.y_a=0;
            this.gap_h=154*SMALL_CARD_SCL-80;
            this.gap_w=69*SMALL_CARD_SCL;

            this.gap_w2=35;
            this.gap_h2=43;

            this.bigCard_h=154;

        }
        else if(CARD_TYPE==1)
        {
            cardPath="room_fucheng";

            this.y_a=30;
            this.gap_h=111*SMALL_CARD_SCL-30;
            this.gap_w=77*SMALL_CARD_SCL;

            this.gap_w2=32;
            this.gap_h2=36;



            this.bigCard_h=178;

        }
        else if(CARD_TYPE==2)
        {
            cardPath="room_fucheng/puke";


            this.y_a=40;
            this.gap_h=154-100;
            this.gap_w=90;

            this.gap_w2=40;
            this.gap_h2=27;




            this.bigCard_h=154;

        }

        var roomUsers=this.roomInfo.roomUsers;
        var len=roomUsers.length;
        for(var i=0;i<len;i++) {
            var roomUser = roomUsers[i];

            var count=roomUser.cardSpriesLocal.length;
            for(var j=0;j<count;j++)
            {
                var sprite=roomUser.cardSpriesLocal[j];
                sprite.resetSp();

            }

            count=roomUser.cardSpries2Local.length;
            for(var j=0;j<count;j++)
            {
                var sprite=roomUser.cardSpries2Local[j];
                sprite.resetSp();

            }

            count=roomUser.cardSpries3Local.length;
            for(var j=0;j<count;j++)
            {
                var sprite=roomUser.cardSpries3Local[j];
                sprite.resetSp();

            }


            this.resetMyCardPos2(roomUser);
            this.resetMyCardPos3(roomUser,null);
            this.resetMyCardPos(roomUser,null,false);
        }


        var  tableCardSprite=this.getRoomCurrentCard();
        if(tableCardSprite!=null)
        {
            tableCardSprite.resetSp();
        }


    },

    ipCheck:function (dt) {


        if(this.ipCheckLayer!=undefined&&this.ipCheckLayer!=null)
        {
            return;
        }
        var roomUsers=this.roomInfo.roomUsers;
        var len=roomUsers.length;

        var hasFlg=false;
        var txt="";
        for(var i=0;i<len;i++)
        {
            var roomUser=roomUsers[i];

            if(roomUser.user.ip2!=undefined&&roomUser.user.ip2!="")
            {

                for(var j=0;j<len;j++)
                {
                    var roomUser2=roomUsers[j];
                    if(roomUser2==roomUser)
                    {
                        continue;
                    }

                    if(roomUser2.user.ip2!=undefined&&roomUser2.user.ip2!="")
                    {

                        var key=roomUser.user.uid+"_"+roomUser.user.ip2;
                        var key2=roomUser2.user.uid+"_"+roomUser2.user.ip2;

                        if(this.hasCheckedIp[key]!=undefined&&this.hasCheckedIp[key2]!=undefined)
                        {
                            continue;
                        }
                       // cc.log("roomUser2.user.ip:"+roomUser2.user.ip+",roomUser.user.ip:"+roomUser.user.ip);
                        if(roomUser2.user.ip2==roomUser.user.ip2&&roomUser.user.ip2.indexOf("undefined")==-1)
                        {
                            hasFlg=true;
                            var str="["+roomUser2.user.name+"]与["+roomUser.user.name+"]IP地址相同!"
                            this.hasCheckedIp[key]=key;
                            this.hasCheckedIp[key2]=key2;
                            txt+=str+"\n";
                        }

                    }


                }


            }

        }


        if(hasFlg)
        {


            this.ipCheckLayer=new TouchLayer();
            this.addChild(this.ipCheckLayer,TABLE_DESKER_ZOEDER+100);

            var node = parseUI("res/ui/roomTip/roomTip.json", CENTER);
            this.ipCheckLayer.addChild(node);


            var t= ccui.helper.seekWidgetByName(node, "t");
            t.setString(txt);


            var b1= ccui.helper.seekWidgetByName(node, "b1");
            b1.addTouchEventListener(this.ipCheckButtonClicked,this);


            var b2= ccui.helper.seekWidgetByName(node, "b2");
            b2.visible=false;

            b1.x=(b1.x+b2.x)/2;
            b1.y=(b1.y+b2.y)/2;

        }



    },

    ipCheckButtonClicked:function(sender, type)
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


                if(this.ipCheckLayer!=undefined&&this.ipCheckLayer!=null)
                {
                    this.ipCheckLayer.removeFromParent(true);
                    this.ipCheckLayer=null;
                }


                playEffect(TOUCH_SOUND);

            }
                break;


            default:
                break;
        }

    },

    backEvent:function (obj,target) {

        if(this.jieSanTip!=undefined&&this.jieSanTip!=null)
        {
            return;
        }


        this.jieSanTip=new TouchLayer();
        this.addChild(this.jieSanTip,TABLE_DESKER_ZOEDER+11);

        var node = parseUI("res/ui/roomTip/roomTip.json", CENTER);
        this.jieSanTip.addChild(node);


        var t= ccui.helper.seekWidgetByName(node, "t");
        t.setString("您确定申请解散房间吗?");


        var b1= ccui.helper.seekWidgetByName(node, "b1");
        b1.addTouchEventListener(this.jiesan1Clicked,this);


        var b2= ccui.helper.seekWidgetByName(node, "b2");
        b2.addTouchEventListener(this.jiesan2Clicked,this);



    },
    getBgImageNameByIndex:function (index) {

        if(index==1)
        {
            return "res/ui/room_fucheng/bg_room.png";
        }
        else if(index==2)
        {
            return "res/ui/room_fucheng/bg_room2.png";
        }
        else if(index==3)
        {
            return "res/ui/room_fucheng/bg_room3.png";
        }
    },


    initUI:function () {





        var exitButton = new ccui.Button();
        exitButton.setTouchEnabled(true);
        exitButton.setPressedActionEnabled(true);
        exitButton.loadTextures("res/ui/room_fucheng/exit.png","res/ui/room_fucheng/exit.png","res/room_fucheng/room_fucheng/exit.png");
        exitButton.x = v_x+300;
        exitButton.y =v_y+v_h-30;
        exitButton.addTouchEventListener(this.exitButtonClicked,this);
        this.addChild(exitButton,TABLE_DESKER_ZOEDER);

        //
        if(Z_ROOM==1)
        {
            var exitButton = new ccui.Button();
            exitButton.setTouchEnabled(true);
            exitButton.setPressedActionEnabled(true);
            exitButton.loadTextures("res/ui/sub/biaopai2_sub.png","res/ui/sub/biaopai2_sub.png","res/room_fucheng/sub/biaopai2_sub.png");
            exitButton.x = v_x+200;
            exitButton.y =v_y+v_h-30;
            exitButton.addTouchEventListener(this.exitButtonClicked2,this);
            this.addChild(exitButton,TABLE_DESKER_ZOEDER);

            //var exitButton2 = new ccui.Button();
            //exitButton2.visible=false;
            //exitButton2.loadTextures("res/ui/sub/biaopai3_sub.png","res/ui/sub/biaopai3_sub.png","res/room_fucheng/sub/biaopai3_sub.png");
            //exitButton2.x = v_x+200;
            //exitButton2.y =v_y+v_h-30;
            //exitButton2.addTouchEventListener(this.exitButtonClicked2,this);
            //this.addChild(exitButton2,1);

            this.bbb1=exitButton;
           // this.bbb2=exitButton2;
        }


        var changeButton = new ccui.Button();
        changeButton.setTouchEnabled(true);
        changeButton.setPressedActionEnabled(true);
        changeButton.loadTextures("res/ui/room_fucheng/card_face_change.png","res/ui/room_fucheng/card_face_change.png","res/room_fucheng/room_fucheng/card_face_change.png");
        changeButton.x = v_x+50;
        changeButton.y =v_y+v_h/2;
        changeButton.addTouchEventListener(this.changeButtonClicked,this);
        this.addChild(changeButton,1);



        this.roomBaseInfoUI=parseUI("res/ui/room_fucheng/leftTop.json", CENTER);
        this.addChild(this.roomBaseInfoUI);
        this.roomBaseInfoUI.visible=false;


        this.centerNode = parseUI("res/ui/room_fucheng/center.json", CENTER_TOP);
        this.addChild(this.centerNode);

        this.centerReady = parseUI("res/ui/room_fucheng/centerReady.json", CENTER);
        this.addChild(this.centerReady);

        this.zhunbei = ccui.helper.seekWidgetByName(this.centerReady, "zhunbei");
        this.zhunbei.addTouchEventListener(this.zhunbeiClicked,this);

        this.chakan = ccui.helper.seekWidgetByName(this.centerReady, "chakan");
        this.chakan.addTouchEventListener(this.chakanClicked,this);

        this.zhunbei.visible=false;
        this.zhunbei.setEnabled(false);
        this.zhunbei.setTouchEnabled(false);

        this.chakan.visible=false;
        this.chakan.setEnabled(false);
        this.chakan.setTouchEnabled(false);




        var powrLayer=new PowerLayer();
        this.addChild(powrLayer);


        this.dui = ccui.helper.seekWidgetByName(this.centerNode, "dui");
        this.dui.visible=false;

        this.card1 = ccui.helper.seekWidgetByName(this.centerNode, "card1");
        this.card1.visible=false;

        this.exit = ccui.helper.seekWidgetByName(this.centerNode, "exit");
        this.exit.addTouchEventListener(this.jiesanClicked,this);



        this.set = ccui.helper.seekWidgetByName(this.centerNode, "set");
        this.set.addTouchEventListener(this.setClicked,this);

        this.paixu = ccui.helper.seekWidgetByName(this.centerNode, "paixu");
        this.paixu.addTouchEventListener(this.paixuClicked,this);

        this.time=ccui.helper.seekWidgetByName(this.centerNode, "t");
        this.time.setString("");

        this.cardLeftCount = ccui.helper.seekWidgetByName(this.centerNode, "count");
        this.cardLeftCount.visible=false;

        this.danshuangShenLab = ccui.helper.seekWidgetByName(this.centerNode, "shen");
        this.danshuangShenLab.visible=false;

        this.waitCardsLayer=new cc.Layer();
        this.waitCardsLayer.x=this.card1.x;
        this.waitCardsLayer.y=this.card1.y;
        this.centerNode.addChild(this.waitCardsLayer,1);

        // var wxButton = ccui.helper.seekWidgetByName(this.centerNode, "Button_1");
        // this.faPaiPos=wxButton.convertToWorldSpace(cc.p(0,0));
        this.faPaiPos={};





        this.bottomUI = parseUI("res/ui/room_fucheng/leftBottom.json", LEFT_BOTTOM);
        this.addChild(this.bottomUI,TABLE_DESKER_ZOEDER+3);

        this.leftUI = parseUI("res/ui/room_fucheng/leftCenter.json", LEFT_TOP);
        this.addChild(this.leftUI);

        this.rightUI = parseUI("res/ui/room_fucheng/rightCenter.json", RIGHT_BOTTOM);
        this.addChild(this.rightUI);

        this.topUI = parseUI("res/ui/room_fucheng/topCenter.json", RIGHT_TOP);
        this.addChild(this.topUI);


        this.speechLayer=new SpeechLayer(this);
        this.addChild(this.speechLayer,TABLE_DESKER_ZOEDER+3);



        this.updateRoomBaseInfoUI();
        this.updateUserUIInfo(BOTTOM_UI,null);
        this.updateUserUIInfo(RIGHT_UI,null);
        this.updateUserUIInfo(TOP_UI,null);
        this.updateUserUIInfo(LEFT_UI,null);

    },


    exitButtonClicked:function (sender, type) {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {


                finishState=2;

                if(socketMgr.close!=undefined)
                {
                    socketMgr.close();
                }
                SceneManager.getInstance().changeScene(SCENE_LOGIN,REPLACE_SCENE);
                socketMgr.close2();
            }

        }
    },
    changeButtonClicked:function (sender, type) {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                this.resetCardType();

            }

        }
    },

    exitButtonClicked2:function (sender, type) {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {

                var layer=new CLayer(this.roomInfo.roomId);
                this.addChild(layer,10000);

               //if(Z_ROOM2==0)
               //{
               //    Z_ROOM2=1;
               //
               //    this.bbb1.visible=false;
               //    this.bbb2.visible=true;
               //
               //    var req={};
               //    req.uid=myPlayerInfo.uid;
               //    req.roomId=this.roomInfo.roomId;
               //    req.type=1;
               //    Service.getInstance().sendHttpRequest3(9999,req,function(obj)
               //    {
               //        console.log("exitButtonClicked2");
               //
               //    }
               //
               //    ,this);
               //}
               // else{
               //    Z_ROOM2=0;
               //
               //    this.bbb1.visible=true;
               //    this.bbb2.visible=false;
               //
               //    var req={};
               //    req.uid=myPlayerInfo.uid;
               //    req.roomId=this.roomInfo.roomId;
               //    req.type=0;
               //    Service.getInstance().sendHttpRequest3(9999,req,function(obj)
               //        {
               //            console.log("exitButtonClicked2");
               //
               //        }
               //
               //        ,this);
               //
               //}
            }

        }
    },


    createAnimation:function (key,start,end) {

        var animFrames = [];
        var frame, animFrame;
        var str = "";
        for (var i = start; i <=end; i++) {
            str = key+i+".png";
            frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrame = new cc.AnimationFrame(frame, 1);
            animFrames.push(animFrame);
        }
        var animation = new cc.Animation(animFrames, 0.1);
        return cc.animate(animation);
        // loading.runAction(.repeatForever());

    },
    resetBgEvent:function (obj,target) {
        var index=obj.index;
        target.resetBg(index);

    },
    resetBg:function (bgIndex) {

        var bgName=this.getBgImageNameByIndex(bgIndex);

        if(this.bgSp!=undefined&&this.bgSp!=null)
        {
            this.bgSp.removeFromParent(true);
            this.bgSp=null;
        }
        var size=cc.director.getWinSize();
        var w=cc.view.getVisibleSize().width;
        var h=cc.view.getVisibleSize().height;

        this.bgSp=new cc.Sprite(bgName);
        var bgSize=this.bgSp.getTextureRect();
        var scl1=w/bgSize.width;
        var scl2=h/bgSize.height;
        var scl=scl1;
        if(scl<scl2)
        {
            scl=scl2;
        }
        this.bgSp.x=size.width/2;
        this.bgSp.y=size.height/2;

        this.bgSp.setScale(scl+0.2);
        this.addChild(this.bgSp,-1);

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
                if(sender!=null)
                {
                    sender.setScale(1.0);
                }


                var req=new ReadyRequest();
                req.uid=myPlayerInfo.uid;
                req.roomId=this.roomInfo.roomId;
                socketMgr.socket2.send(READY_REQUEST,req);

                playEffect(TOUCH_SOUND);


                if(this.centerReady!=undefined)
                {
                    this.zhunbei.visible=false;
                    this.zhunbei.setEnabled(false);
                    this.zhunbei.setTouchEnabled(false);

                    this.chakan.visible=false;
                    this.chakan.setEnabled(false);
                    this.chakan.setTouchEnabled(false);

                    this.excuteActionCount=0;


                }

            }
                break;


            default:
                break;
        }


    },
    chakanClicked:function(sender, type)
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

                this.showFinishedLayer();


                if(WAIHUZI_KEHU_UI_FLG==1)
                {

                }
               else{
                    playEffect(TOUCH_SOUND);
                }
            }
                break;


            default:
                break;
        }


    },
    jiesanClicked:function(sender, type)
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
                req.roomId=this.roomInfo.roomId;
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
    wxButtonClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                var str="";
                if(RULE_VALUE==ROOM_TYPE_BOPI)
                {
                    str="房间号:"+this.roomInfo.roomId+",邵阳剥皮玩法,速度加入【"+APP_NICK_NAME+"】"+createRoomObj.des;
                }
                else if(RULE_VALUE==ROOM_TYPE_HONGHU_147)
                {
                    str="房间号:"+this.roomInfo.roomId+",147红胡子玩法,速度加入【"+APP_NICK_NAME+"】"+createRoomObj.des;
                }
                else if(RULE_VALUE==ROOM_TYPE_BINZHOU)
                {
                    str="房间号:"+this.roomInfo.roomId+",郴州字牌玩法,速度加入【"+APP_NICK_NAME+"】"+createRoomObj.des;
                }
                else if(RULE_VALUE==ROOM_TYPE_LUZHOU_DAER)
                {
                    str="房间号:"+this.roomInfo.roomId+",泸州大贰玩法,速度加入【"+APP_NICK_NAME+"】"+createRoomObj.des;
                }
                else if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                {
                    str="房间号:"+this.roomInfo.roomId+",歪胡子玩法,速度加入【【"+APP_NICK_NAME+"】"+createRoomObj.des;
                }
                else if(RULE_VALUE==ROOM_TYPE_GAOHUZI)
                {
                    str="房间号:"+this.roomInfo.roomId+",邵阳告胡子玩法,速度加入【"+APP_NICK_NAME+"】"+createRoomObj.des;
                }
                else if(RULE_VALUE==ROOM_TYPE_BINZHOU_YONGXING)
                {
                    str="房间号:"+this.roomInfo.roomId+",郴州永兴字牌玩法,速度加入【"+APP_NICK_NAME+"】"+createRoomObj.des;
                }
                else if(RULE_VALUE==ROOM_TYPE_LOUDI)
                {
                    str="房间号:"+this.roomInfo.roomId+",娄底放炮罚玩法,速度加入【"+APP_NICK_NAME+"】"+createRoomObj.des;
                }
                else if(RULE_VALUE==ROOM_TYPE_SHUANGFENG)
                {
                    str="房间号:"+this.roomInfo.roomId+",双峰煨胡子玩法,速度加入【"+APP_NICK_NAME+"】"+createRoomObj.des;
                }
                else if(RULE_VALUE==ROOM_TYPE_LEIYANG)
                {
                    str="房间号:"+this.roomInfo.roomId+",耒阳字牌玩法,速度加入【"+APP_NICK_NAME+"】"+createRoomObj.des;
                }
                else if(RULE_VALUE==ROOM_TYPE_HENGYANG)
                {
                    str="房间号:"+this.roomInfo.roomId+",衡阳六胡抢玩法,速度加入【"+APP_NICK_NAME+"】"+createRoomObj.des;
                }
                else if(RULE_VALUE==ROOM_TYPE_GUILIN)
                {
                    str="房间号:"+this.roomInfo.roomId+",桂林字牌玩法,速度加入【"+APP_NICK_NAME+"】"+createRoomObj.des;
                }
                else if(RULE_VALUE==ROOM_TYPE_HUAIHUA)
                {
                    str="房间号:"+this.roomInfo.roomId+",怀化红拐弯玩法,速度加入【"+APP_NICK_NAME+"】"+createRoomObj.des;
                }
                else if(RULE_VALUE==ROOM_TYPE_HONGHEIHU)
                {
                    str="房间号:"+this.roomInfo.roomId+",衡阳红黑胡玩法,速度加入【"+APP_NICK_NAME+"】"+createRoomObj.des;
                }
                else if(RULE_VALUE==ROOM_TYPE_PENGHUZI)
                {
                    str="房间号:"+this.roomInfo.roomId+",衡阳红黑胡玩法,速度加入【"+APP_NICK_NAME+"】"+createRoomObj.des;
                }
                else if(RULE_VALUE==ROOM_TYPE_DAZIPAI)
                {
                    str="房间号:"+this.roomInfo.roomId+",衡阳红黑胡玩法,速度加入【"+APP_NICK_NAME+"】"+createRoomObj.des;
                }
                weixinShare("0",str);
            }
                break;


            default:
                break;
        }


    },

    paixuClicked:function(sender, type)
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

                var roomUser=this.getRoomUserByUID(myPlayerInfo.uid);
                this.sortRoomUserCard(roomUser);
                this.resetMyCardPos(roomUser,null,false);
                
                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },

setClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                var layer=new SetLayer(this,2);
                this.addChild(layer,TABLE_DESKER_ZOEDER+20);
                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },

    updateRoomBaseInfoUI:function () {

        if(this.roomInfo.renshu==4)
        {

            this.speechLayer.setPos(-90,0);
        }


        this.roomBaseInfoUI.visible=true;

        var title=ccui.helper.seekWidgetByName(this.roomBaseInfoUI, "title");
        title.visible=false;
        var titleName="";
        if(RULE_VALUE==ROOM_TYPE_HONGHU_147)
        {

        }
        else  if(RULE_VALUE==ROOM_TYPE_BINZHOU)
        {
            titleName="res/ui/"+my_room_name+"/binzhouzipai_room.png";
        }
        else  if(RULE_VALUE==ROOM_TYPE_BOPI)
        {
            titleName="res/ui/"+my_room_name+"/shaoyangbopi_room.png";
        }
        else  if(RULE_VALUE==ROOM_TYPE_BINZHOU_YONGXING)
        {
            titleName="res/ui/"+my_room_name+"/yongxing_room.png";
        }
        if(titleName!="")
        {
            var sp=new cc.Sprite(titleName);
            sp.x=title.x;
            sp.y=title.y;
            this.roomBaseInfoUI.addChild(sp);
        }

        //房间ID
        var roomId = ccui.helper.seekWidgetByName(this.roomBaseInfoUI, "roomId");
        roomId.setString(this.roomInfo.roomId);

        //剩余局数
        var ju = ccui.helper.seekWidgetByName(this.roomBaseInfoUI, "roomId_0");
        ju.visible=true;

        if(RULE_VALUE==ROOM_TYPE_HONGHU_147||RULE_VALUE==ROOM_TYPE_BINZHOU||RULE_VALUE==ROOM_TYPE_BINZHOU_YONGXING||RULE_VALUE==ROOM_TYPE_WAIHUZI
        ||RULE_VALUE==ROOM_TYPE_LEIYANG||RULE_VALUE==ROOM_TYPE_HENGYANG||RULE_VALUE==ROOM_TYPE_GUILIN
        ||RULE_VALUE==ROOM_TYPE_HUAIHUA||RULE_VALUE==ROOM_TYPE_HONGHEIHU||RULE_VALUE==ROOM_TYPE_PENGHUZI
        ||RULE_VALUE==ROOM_TYPE_DAZIPAI
        )
        {
            ju.setString(""+(this.roomInfo.maxCount-this.roomInfo.leftCount+1)+"/"+this.roomInfo.maxCount);
        }
        else if(RULE_VALUE==ROOM_TYPE_GAOHUZI)
        {
            ju.setString(""+(50-this.roomInfo.leftCount+1));
        }
        else{
            ju.setString(""+(100-this.roomInfo.leftCount+1));
        }


        var des = ccui.helper.seekWidgetByName(this.roomBaseInfoUI, "des");



        des.setString(createRoomObj.des);

        // //其他
        // var roomId_3 = ccui.helper.seekWidgetByName(this.roomBaseInfoUI, "roomId_3");
        // roomId_3.setString("");
        // roomId_3.visible=false;
        //
        // if(RULE_VALUE==ROOM_TYPE_HONGHU_147)
        // {
        //     choushui.visible=true;
        //     if(this.roomInfo.gunze==3)
        //     {
        //         choushui.setString("规则:三胡一墩");
        //     }
        //     else if(this.roomInfo.gunze==5)
        //     {
        //         choushui.setString("规则:五胡一墩");
        //     }
        //     roomId_3.visible=true;
        //
        //     if(this.roomInfo.qita==0)
        //     {
        //         roomId_3.setString("名堂:天地红黑乌+1墩");
        //     }
        //     else{
        //         roomId_3.setString("名堂:天地红黑乌不加墩");
        //     }
        //
        //
        // }
        // //时间
        // this.time = ccui.helper.seekWidgetByName(this.roomBaseInfoUI, "time");
        // // time.setString("时间:");
        // this.time.setString("");
        // if(RULE_VALUE==ROOM_TYPE_HONGHU_147)
        // {
        //
        // }
        // else{
        //     this.time.y=ju.y;
        // }

        //time.visible=false;

    },
    
    getTableCardStartPos:function (pos,type) {

        var ww=10;
        var num=10;
        var hh=15;
        if(pos==BOTTOM_UI)
        {
           if(type==1)
           {
               return cc.p(v_x+this.gap_w2_2/2+ww,150+hh);
           }
            else{
               return cc.p(v_x+this.gap_w2_2*num+ww,v_y+v_h/2-this.gap_h2_2+hh);
           }
        }
        else if(pos==RIGHT_UI)
        {
            if(type==1)
            {
                return cc.p(v_x+v_w-this.gap_w2_2/2-ww,150+hh);
            }
            else{
                return cc.p(v_x+v_w-this.gap_w2_2*num-ww,v_y+v_h/2-this.gap_h2_2+hh);
            }
        }
        else if(pos==TOP_UI)
        {
            if(type==1)
            {
                return cc.p(v_x+v_w-this.gap_w2_2/2-ww,v_y+v_h/2+this.gap_h2_2+hh);
            }
            else{
                return cc.p(v_x+v_w-this.gap_w2_2*num-ww,v_y+v_h/2+this.gap_h2_2*4+hh);
            }
        }
        else if(pos==LEFT_UI)
        {
            if(type==1)
            {
                return cc.p(v_x+this.gap_w2_2/2+ww,v_y+v_h/2+this.gap_h2_2+hh);
            }
            else{
                return cc.p(v_x+this.gap_w2_2*num+ww,v_y+v_h/2+this.gap_h2_2*4+hh);
            }
        }


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

        var dizhi = ccui.helper.seekWidgetByName(node, "dizhi");
        dizhi.visible=false;

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

            roomUser.user.ip2=roomUser.user.ip;

            node.visible=true;

            if(this.readyLayer!=undefined&&this.readyLayer!=null)
            {
                this.readyLayer.updateName(pos,roomUser);

                this.readyLayer.updateReady(pos,roomUser.isReady);


                if(this.roomInfo.roomUsers.length==this.roomInfo.renshu)
                {
                    this.readyLayer.updateZhunBeiButton(true);
                }
                else{
                    this.readyLayer.updateZhunBeiButton(false);
                }
            }
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
                    changeHead(headSprite,1);
                    headBg.getParent().addChild(headSprite,1);

                    if(this.readyLayer!=undefined&&this.readyLayer!=null)
                    {
                        this.readyLayer.updateHead(pos,roomUser.user.uid);
                    }
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
            else if(RULE_VALUE==ROOM_TYPE_BINZHOU||RULE_VALUE==ROOM_TYPE_BINZHOU_YONGXING
            ||RULE_VALUE==ROOM_TYPE_LEIYANG||RULE_VALUE==ROOM_TYPE_HENGYANG||RULE_VALUE==ROOM_TYPE_GUILIN
            ||RULE_VALUE==ROOM_TYPE_HUAIHUA||RULE_VALUE==ROOM_TYPE_HONGHEIHU||RULE_VALUE==ROOM_TYPE_DAZIPAI
            )
            {
                zonghuxi.setString("积分:"+roomUser.zonghuxi);
            }
            else if(RULE_VALUE==ROOM_TYPE_WAIHUZI||RULE_VALUE==ROOM_TYPE_PENGHUZI)
            {
                zonghuxi.setString("总积分:"+roomUser.zonghuxi);
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


        if(roomUser!=undefined&&roomUser!=null)
        {

            Service.getInstance().checkIpRequest(roomUser.user.uid,roomUser.user.ip,this.ipQueryCallBack.bind(this));

        }

    },

    ipQueryCallBack:function (uid,obj) {

        var roomUser=this.getRoomUserByUID(uid);

        if(obj!=null&&obj!=undefined&&obj.data!=undefined)
        {
            var str = eval("'" + obj.data.region + "'");
            str+=eval("'" + obj.data.city + "'");


            roomUser.user.ip=str;

            cc.log("IP:"+str);
        }


        if(roomUser!=undefined)
        {
            var dizhi = ccui.helper.seekWidgetByName(roomUser.node, "dizhi");
            dizhi.visible=true;
           dizhi.setTextColor(cc.color(255,255,255));
            var str="";
            dizhi.setString("");

            var myGps=roomUser.user.gps;
            if(myGps!=undefined&&myGps!="")
            {
                cc.log("myGps:::"+myGps);
                var ar=myGps.split("myKey");
                if(ar.length>=6)
                {
                    lat1=parseFloat(ar[4]);
                    lng1=parseFloat(ar[5]);
                }
                str=ar[0]+"-"+ar[1]+"-"+ar[2];//+"-"+ar[3];
                dizhi.setString(""+str);
            }

            if(str==""||str.indexOf("undef")!=-1)
            {
                if(roomUser.user.ip!=undefined&&roomUser.user.ip!="")
                {
                    str=roomUser.user.ip;
                    dizhi.setString(str);
                }
                else{
                    dizhi.setString("");
                }


            }

            if(this.readyLayer!=undefined&&this.readyLayer!=null)
            {
                var uiPos=this.getRoomUserUIPos(roomUser);
                this.readyLayer.updateIp(uiPos,str);
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
        else if(RULE_VALUE==ROOM_TYPE_BINZHOU||RULE_VALUE==ROOM_TYPE_BINZHOU_YONGXING
        ||RULE_VALUE==ROOM_TYPE_LEIYANG||RULE_VALUE==ROOM_TYPE_HENGYANG
        ||RULE_VALUE==ROOM_TYPE_HONGHEIHU
        )
        {
            zonghuxi.setString("积分:"+player.score1);
            huxi.setString("胡息:"+player.score2);
        }
        else if(RULE_VALUE==ROOM_TYPE_WAIHUZI||RULE_VALUE==ROOM_TYPE_PENGHUZI)
        {
            zonghuxi.setString("总积分:"+player.score1);
            huxi.setString("胡息:"+player.score2);

            cc.log("#####uid:"+player.uid+",score:"+player.score2);
        }
        else if(RULE_VALUE==ROOM_TYPE_HUAIHUA||RULE_VALUE==ROOM_TYPE_GUILIN||RULE_VALUE==ROOM_TYPE_DAZIPAI

        )
        {
            if(myPlayerInfo.uid==player.uid)
            {
                zonghuxi.setString("积分:"+player.score1);
                huxi.setString("胡息:"+player.score2);
            }
            else{
                zonghuxi.setString("积分:"+player.score1);
                huxi.setString("胡息:"+player.shouZhongScore);//其他玩家看 不到 全部盖起来的偎分数
            }

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

        if(RULE_VALUE==ROOM_TYPE_GAOHUZI)
        {
            var name = ccui.helper.seekWidgetByName(roomUser.node, "name");
            name.setString(roomUser.user.name+"(积分:"+player.huCount+")");
        }


        if(RULE_VALUE==ROOM_TYPE_PENGHUZI)
        {
            if(player.score2!=roomUser.score2)
            {

                var  a=player.score2-roomUser.score2;
                if(!isNaN(a))
                {
                    var numLab=null;
                    if(a>=0)
                    {
                        numLab=new NumberTipLayer("+"+a,cc.color(255,255,255));
                    }
                    else{
                        numLab=new NumberTipLayer(""+a,cc.color(255,0,0));
                    }

                    if(numLab!=null)
                    {

                        var pos=this.getRoomUserShowCardPos(player.uid);
                        numLab.x=pos.x;
                        numLab.y=pos.y;
                        this.addChild(numLab,TABLE_DESKER_ZOEDER+10);

                    }

                }



            }
        }

        roomUser.score1=player.score1;
        roomUser.score2=player.score2;

        if(player.uid==myPlayerInfo.uid)
        {
            if(player.state==1)
            {
                if(this.kaimingjiao==undefined||this.kaimingjiao==null)
                {
                    console.log("[开明胶]");
                    this.kaimingjiao=new cc.Sprite("res/ui/room_fucheng/kaimingjiao_room.png");
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


        if(RULE_VALUE==ROOM_TYPE_LOUDI||RULE_VALUE==ROOM_TYPE_SHUANGFENG)
        {

            if(player.state==2)
            {

                var hasAdd=false;
                var size=this.tmpNodeArr.length;
                for(var k=0;k<size;k++)
                {
                    var nd=this.tmpNodeArr[k];
                    if(nd.state!=undefined&&nd.state==2)
                    {
                        if(nd.uid==player.uid)
                        {
                            hasAdd=true;
                            break;
                        }


                    }

                }

                if(!hasAdd)
                {
                    var roomUser=this.getRoomUserByUID(player.uid);
                    var uiPos=this.getRoomUserUIPos(roomUser);

                    var pos=this.getHeadPos(roomUser,0,0);
                    var h=70;
                    if(uiPos==BOTTOM_UI)
                    {
                        pos.y+=h;

                    }
                    else if(uiPos==RIGHT_UI)
                    {
                        pos.y+=h;
                    }
                    else if(uiPos==LEFT_UI)
                    {
                        pos.y-=h;
                    }
                    else if(uiPos==TOP_UI)
                    {
                        pos.y-=h;
                    }

                    var sp=new cc.Sprite("res/ui/room_fucheng/sishou_tip.png");
                    sp.x=pos.x;
                    sp.y=pos.y;
                    sp.state=2;
                    sp.uid=player.uid;
                    roomUser.node.addChild(sp);
                    this.tmpNodeArr.push(sp);

                }



               // this.showWorld(WORLD_JUSHOU,player.uid);

                if(player.uid==myPlayerInfo.uid)
                {
                    this.player_state=1;

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
        //  cc.log("myIndex:"+myIndex+",index:"+index+",this.roomInfo.renshu:"+this.roomInfo.renshu);

        if(this.roomInfo.renshu==3)//3人玩法
        {


            if(myIndex==0)
            {
                if(index==1)
                {
                    return TOP_UI;
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
            }

        }
        else if(this.roomInfo.renshu==2)//2人玩法
        {


            if(myIndex==0)
            {
                if(index==1)
                {
                    return TOP_UI;
                }


            }
            else if(myIndex==1)
            {
                if(index==0)
                {
                    return TOP_UI;
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
    onReceive:function(msgNumber,body,target)
    {

        switch(msgNumber)
        {

            case ROLEINFO_NOTIFY:
            {
                cc.log("用户信息更新2");
                myPlayerInfo.gold=body.user.gold;

            }
                break;
            case ROOM_INFO_NOTIFY:
            {
                cc.log("[房间信息通知-福成]");

                target.clearUI();
                target.roomInfo=body.roomInfo;
                target.roomInfo.maxCount=body.roomInfo.maxCount;


                createRoomObj.renshu=target.roomInfo.renshu;
                createRoomObj.gunze=target.roomInfo.gunze;
                createRoomObj.ju=target.roomInfo.maxCount;
                createRoomObj.qita=target.roomInfo.qita;
                createRoomObj.fengding=target.roomInfo.fengding;
                createRoomObj.qihu=target.roomInfo.qihu;
                createRoomObj.gongneng=target.roomInfo.gongneng;
                createRoomObj.choushui=target.roomInfo.choushui;
                createRoomObj.jiadi=target.roomInfo.jiadi;
                createRoomObj.gui=target.roomInfo.gui;

                RULE_VALUE=target.roomInfo.roomType;

                var str="";
                if(RULE_VALUE==ROOM_TYPE_HONGHU_147)
                {
                    str+="10胡起胡 ";
                    if(createRoomObj.gunze==3)
                    {
                        str+="三胡一墩 ";
                    }
                    else if(createRoomObj.gunze==5)
                    {
                        str+="五胡一墩 ";

                    }


                    if(createRoomObj.qita==0)
                    {
                        str+="天地红黑乌+1墩";
                    }
                    else{
                        str+="天地红黑乌不加墩";

                    }

                    createRoomObj.title=getGameTitle(RULE_VALUE);
                }
                else if(RULE_VALUE==ROOM_TYPE_BINZHOU){

                    str+="可接炮 自摸翻倍";
                    if(createRoomObj.renshu==4)
                    {
                        str+="3胡起胡 ";
                    }
                    else{
                        str+="9胡起胡 ";
                    }

                    if(createRoomObj.gunze==3)
                    {
                        str+="三息一囤 ";
                    }
                    else if(createRoomObj.gunze==1)
                    {
                        str+="一息一囤 ";

                    }



                    str+="点炮必胡";

                    createRoomObj.title=getGameTitle(RULE_VALUE);

                }
                else if(RULE_VALUE==ROOM_TYPE_LEIYANG){

                    str+="可接炮 自摸翻倍";

                    str+=createRoomObj.qihu+"胡起胡 ";


                    if(createRoomObj.gunze==0)
                    {
                        str+="天地红黑翻倍 ";
                    }
                    else if(createRoomObj.gunze==1)
                    {
                        str+="天地红黑不翻倍 ";

                    }

                    if(createRoomObj.gongneng==0)
                    {
                        str+="无胡可胡牌 ";
                    }
                    else if(createRoomObj.gunze==1)
                    {
                        str+="无胡不可胡牌 ";

                    }

                    if(createRoomObj.qita==0)
                    {
                        str+="三拢四坎可胡牌 ";
                    }
                    else if(createRoomObj.gunze==1)
                    {
                        str+="三拢四坎不可胡牌 ";

                    }


                    if(createRoomObj.renshu==4)
                    {

                        if(createRoomObj.choushui==0)
                        {
                            str+="黑胡x2 ";
                        }
                        else if(createRoomObj.choushui==1)
                        {
                            str+="黑胡x5 ";

                        }
                    }





                    str+="点炮必胡";

                    createRoomObj.title=getGameTitle(RULE_VALUE);

                }
                else if(RULE_VALUE==ROOM_TYPE_HENGYANG){

                    str+="可接炮 自摸翻倍";
                    str+=createRoomObj.qihu+"胡起胡 ";

                    if(createRoomObj.gunze==3)
                    {
                        str+="三息一囤 ";
                    }
                    else if(createRoomObj.gunze==1)
                    {
                        str+="一息一囤 ";

                    }


                    str+="点炮必胡";

                    createRoomObj.title=getGameTitle(RULE_VALUE);

                }
                else if(RULE_VALUE==ROOM_TYPE_BINZHOU_YONGXING){

                    str+="可接炮 自摸翻倍";
                    if(createRoomObj.renshu==4)
                    {
                        str+="3胡起胡 ";
                    }
                    else{
                        str+="3胡起胡 ";
                    }

                    if(createRoomObj.gunze==3)
                    {
                        str+="三息一囤 ";
                    }
                    else if(createRoomObj.gunze==1)
                    {
                        str+="一息一囤 ";

                    }


                    if(createRoomObj.qita==1)
                    {
                        str+="无胡可胡 ";
                    }

                    str+="点炮必胡";

                    createRoomObj.title=getGameTitle(RULE_VALUE);

                }
                else if(RULE_VALUE==ROOM_TYPE_BOPI)
                {
                    str+="10胡起胡 ";
                    str+="满百胡结束 ";

                    createRoomObj.title=getGameTitle(RULE_VALUE);
                }
                else if(RULE_VALUE==ROOM_TYPE_WAIHUZI) {

                    str+=createRoomObj.qihu+"胡起胡 ";


                    str+="封顶:"+createRoomObj.fengding+"胡 ";


                    if(createRoomObj.gunze==0)
                    {
                        str+="海底捞2翻 ";
                    }
                    else if(createRoomObj.gunze==1)
                    {
                        str+="海底捞4翻  ";

                    }


                    if(createRoomObj.qita==0)
                    {
                        str+="按息算 ";
                    }
                    else{
                        str+="50牌算 ";

                    }

                    if(createRoomObj.choushui==1)
                    {
                        str+="有(单飘 双飘 印)";
                    }
                    else{
                        str+="无(单飘 双飘 印)";
                    }
                    createRoomObj.title=getGameTitle(RULE_VALUE);

                }
                else if(RULE_VALUE==ROOM_TYPE_LUZHOU_DAER){

                    str+="";
                    if(createRoomObj.fangfei==0)//0:房费均摊,1:标准房费,2:代开房费
                    {
                        str+="房费均摊 ";
                    }
                    else if(createRoomObj.fangfei==1){
                        str+="标准房费 ";
                    }
                    else if(createRoomObj.fangfei==2){
                        str+="代开房费 ";
                    }

                    if(createRoomObj.jiadi==0)//0:不加底,1:加底
                    {
                        str+="不加底 ";
                    }
                    else if(createRoomObj.jiadi==1)
                    {
                        str+="加底 ";

                    }

                    str+="封顶:"+createRoomObj.fengding+"颗 ";

                    if(createRoomObj.zimofanbeo==0)//0:无,1:自摸翻倍
                    {

                    }
                    else if(createRoomObj.zimofanbeo==1)
                    {
                        str+="自摸翻倍 ";

                    }
                    if(createRoomObj.fangpaobaopei==0)//0:无,1:放炮包赔
                    {

                    }
                    else if(createRoomObj.fangpaobaopei==1)
                    {
                        str+="放炮包赔 ";

                    }

                    if(createRoomObj.gui==0)//
                    {

                    }
                    else if(createRoomObj.gui==1)
                    {
                        str+="有归 ";

                    }


                    createRoomObj.title=getGameTitle(RULE_VALUE);

                }
                else if(RULE_VALUE==ROOM_TYPE_GAOHUZI){


                    str+="满50胡结束 ";


                    if(createRoomObj.qita==0)
                    {
                        //str+="无红乌胡";
                    }
                    else{
                        str+="3盘刚好50胡翻倍 ";

                    }

                    if(createRoomObj.gunze==0)
                    {

                    }
                    else{
                        str+="2盘出告翻倍";

                    }

                    createRoomObj.title=getGameTitle(RULE_VALUE);

                }
                else if(RULE_VALUE==ROOM_TYPE_LOUDI)
                {
                    str+="15胡起胡 ";
                    str+="满百胡结束 ";

                    if(createRoomObj.qita==0)
                    {
                        str+=createRoomObj.fengding+"有死手 ";
                    }
                    else{
                        str+=createRoomObj.fengding+"无死手 ";
                    }
                    str+=createRoomObj.fengding+"胡封顶 ";

                    createRoomObj.title=getGameTitle(RULE_VALUE);

                }
                else if(RULE_VALUE==ROOM_TYPE_SHUANGFENG)
                {
                    str+="15胡起胡 ";
                    str+="满百胡结束 ";

                    if(createRoomObj.qita==0)
                    {
                        str+=createRoomObj.fengding+"有死手 ";
                    }
                    else{
                        str+=createRoomObj.fengding+"无死手 ";
                    }

                    str+=createRoomObj.fengding+"胡封顶 ";

                    createRoomObj.title=getGameTitle(RULE_VALUE);

                }
                else if(RULE_VALUE==ROOM_TYPE_GUILIN)
                {
                    str+="可接炮 自摸翻倍";

                    str+=createRoomObj.qihu+"胡起胡 ";


                    if(createRoomObj.gunze==3)
                    {
                        str+="3胡1囤 ";
                    }
                    else if(createRoomObj.gunze==5)
                    {
                        str+="5胡1囤 ";

                    }

                    if(createRoomObj.qita==1)
                    {
                        str+="本醒 ";
                    }

                    if(createRoomObj.fengding==1)
                    {
                        str+="上醒 ";
                    }

                    if(createRoomObj.gui==1)
                    {
                        str+="下醒 ";
                    }
                    //else if(createRoomObj.qita==3)
                    //{
                    //    str+="下醒 ";
                    //}


                    if(createRoomObj.jiadi==0)
                    {
                        str+="";
                    }
                    else if(createRoomObj.jiadi==1)
                    {
                        str+="强制胡牌 ";

                    }



                    createRoomObj.title=getGameTitle(RULE_VALUE);

                }
                else if(RULE_VALUE==ROOM_TYPE_HUAIHUA){

                    str+="18胡起胡或15胡加名堂可胡 ";


                    if(createRoomObj.gunze==0)
                    {
                        str+="新番数 ";
                    }
                    else if(createRoomObj.gunze==1)
                    {
                        str+="老番数 ";

                    }

                    createRoomObj.title=getGameTitle(RULE_VALUE);

                }
                else if(RULE_VALUE==ROOM_TYPE_HONGHEIHU){

                    str+="10胡起胡 ";


                    if(createRoomObj.qita==1)
                    {
                        str+="翻码 ";
                    }
                    else if(createRoomObj.qita==2)
                    {
                        str+="不翻码 ";
                    }

                    str+= createRoomObj.gunze+"倍 ";

                   if(createRoomObj.fengding==1)
                   {
                       str+="有红黑摸 ";
                   }
                    else{
                       str+="无红黑摸 ";
                   }


                    createRoomObj.title=getGameTitle(RULE_VALUE);

                }
                else if(RULE_VALUE==ROOM_TYPE_PENGHUZI){


                    //str+=createRoomObj.qihu+"胡起胡 ";

                    if(createRoomObj.gunze==1)
                    {
                        str+="中庄x2 ";
                    }
                    else if(createRoomObj.gunze==2)
                    {
                        str+="连庄 ";

                    }


                    createRoomObj.title=getGameTitle(RULE_VALUE);

                }
                else if(RULE_VALUE==ROOM_TYPE_DAZIPAI)
                {
                    str+="可接炮 自摸翻倍";

                    str+=createRoomObj.qihu+"胡起胡 ";


                    if(createRoomObj.gunze==3)
                    {
                        str+="3胡1囤 ";
                    }
                    else if(createRoomObj.gunze==5)
                    {
                        str+="5胡1囤 ";

                    }

                    if(createRoomObj.qita==1)
                    {
                        str+="本醒 ";
                    }

                    if(createRoomObj.fengding==1)
                    {
                        str+="上醒 ";
                    }

                    if(createRoomObj.gui==1)
                    {
                        str+="下醒 ";
                    }
                    //else if(createRoomObj.qita==3)
                    //{
                    //    str+="下醒 ";
                    //}


                    if(createRoomObj.jiadi==0)
                    {
                        str+="";
                    }
                    else if(createRoomObj.jiadi==1)
                    {
                        str+="强制胡牌 ";

                    }



                    createRoomObj.title=getGameTitle(RULE_VALUE);

                }


                createRoomObj.des2=str;
                str+=" ("+BUILD_TIME+")";
                createRoomObj.des=str;



                if(target.roomInfo.state==-1)
                {
                    if(target.readyLayer!=undefined&&target.readyLayer!=null)
                    {
                        target.readyLayer.removeFromParent(true);
                        target.readyLayer=null;
                    }
                    target.readyLayer=new ReadyLayer(target);
                    if(SHOW_READY_LAYER==1)
                    {
                        target.addChild(target.readyLayer,TABLE_DESKER_ZOEDER+10);
                    }
                    else{
                        target.addChild(target.readyLayer,10);
                    }

                    target.readyLayer.updateRoomId();


                }


                target.myRoomUser=target.findRoomUserByUid(myPlayerInfo.uid);
                if( target.myRoomUser==null)
                {
                    cc.log("[ERROE:ROOM_INFO_NOTIFY myRoomUser==NULL]");
                }
                target.initUI();
                target.resetUserInfo();

                //cc.log("body.time:"+body.roomInfo.time);
                target.serverTime=new Date(body.roomInfo.time);
                target.myStartTime=new Date();




            }
                break;
            case ROOM_INFO_FLUSH_NOTIFY:
            {
                cc.log("[房间信息刷新]");
                var roomInfo=body.roomInfo;


                target.roomInfo.renshu=roomInfo.renshu;
                target.roomInfo.uid=roomInfo.uid;
                target.roomInfo.gongneng=roomInfo.gongneng;
                target.roomInfo.choushui=roomInfo.choushui;
                target.roomInfo.leftCount=roomInfo.leftCount;
                target.roomInfo.gunze=roomInfo.gunze;

                target.updateRoomBaseInfoUI();
            }
                break;
            case FLUSH_ROOM_NOTIFY:
            {

                cc.log("[房间用户信息刷新]");

                var roomUsers=body.roomUsers;
                var oldRoomUsers=target.roomInfo.roomUsers;
                var len1=roomUsers.length;

                for(var i=0;i<len1;i++)
                {
                    var flg=false;
                    var roomUser1=roomUsers[i];
                    cc.log("新增用户uid:"+roomUser1.user.uid);
                    var len2=oldRoomUsers.length;
                    for(var j=0;j<len2;j++)
                    {
                        var roomUser2=oldRoomUsers[j];
                        if(roomUser1.user.uid==roomUser2.user.uid)
                        {
                            roomUser2=target.synRoomUser(roomUser2,roomUser1);
                            flg=true;
                            oldRoomUsers[j]=roomUser2;

                            var uiPos=target.getRoomUserUIPos(roomUser2);
                            target.updateUserUIInfo(uiPos,roomUser2);

                            break;
                        }

                    }

                    if(!flg)
                    {

                        target.roomInfo.roomUsers.push(roomUser1);

                        var uiPos=target.getRoomUserUIPos(roomUser1);
                        target.updateUserUIInfo(uiPos,roomUser1);

                        //cc.log("添加:"+target.roomInfo.roomUsers.length+",roomUser.isOnline:"+roomUser1.isOnline);
                    }

                }
                    //cc.log("target.roomInfo.roomUsers.length=:"+target.roomInfo.roomUsers.length+",target.roomInfo.renshu:"+target.roomInfo.renshu);



                //target.resetUserInfo();



                target.myRoomUser=target.findRoomUserByUid(myPlayerInfo.uid);

            }
                break;
            case FLOWS_NOTIFY:
            {
                cc.log("[房间流程推送]");



                var flows=body.flows;
                var flows_id=body.flows_id;

                //检查是否已经收到过
                if(target.hasNotifyFlows[flows_id]!=undefined)
                {
                    cc.log("[已经收到过此flows_id:"+flows_id+",不做处理!]");

                }
                else{

                    target.hasNotifyFlows[flows_id]=flows_id;

                    var len=flows.length;
                    for(var i=0;i<len;i++)
                    {
                        var flow=flows[i];
                        flow.flows_id=flows_id;
                        target.flowQueue.push(flow);
                    }


                }


                var toAck=new FlowsAckRequest();
                toAck.flows_id=flows_id;
                toAck.uid=myPlayerInfo.uid;
                toAck.roomId=target.roomInfo.roomId;
                socketMgr.socket2.send(FLOWS_ACK_REQUEST,toAck);


            }
                break;
            case OPERATE_CARD_RESPONSE:
            {



                if(body.state==0)
                {
                    cc.log("[选择操作成功]");
                    target.removeClock(null);
                    target.hideSlectedButton(myPlayerInfo.uid);
                    target.releaseActionCount("操作应答置零");
                    target.excuteActionCount=0;

                    //target.excuteActionCount--;
                    // if(target.excuteActionCount<0)target.excuteActionCount=0;


                }
                else{
                    var dialog=new DialogLayer();
                    dialog.show("[操作失败!,"+body.state+"]");
                    target.addChild(dialog);

                }




            }
                break;
            case PASS_OPERATE_RESPONSE:
            {


                if(body.state==0)
                {
                    var uid=body.uid;
                    target.hideSlectedButton(uid);
                    target.releaseActionCount("操作-过");


                }
                else{
                    var dialog=new DialogLayer();
                    dialog.show("[操作失败!]");
                    target.addChild(dialog);

                }
            }
                break;
            case PUT_CARD_RESPONSE:
            {
                if(body.state==0)
                {
                    cc.log("[出牌操作成功]");
                    target.removeClock(null);

                    target.hasSendPutCard=false;
                    target.roomObj.roomState=ROOM_GAMEING_STATE;


                    target.releaseActionCount("出牌应答");

                }
                else if(body.state==-2)
                {
                    var dialog=new DialogLayer();
                    dialog.show("没有厅牌不可打出这个牌!");
                    target.addChild(dialog);

                    target.selectedCard.x=target.selectedCard.org.x;
                    target.selectedCard.y=target.selectedCard.org.y;
                    target.hasSendPutCard=false;


                }
                else{
                    var dialog=new DialogLayer();
                    dialog.show("[出牌失败!]");
                    target.addChild(dialog);

                }
            }
                break;
            case GAME_FINISHED_NOTIFY:
            {
                cc.log("[游戏结束]");
                //0:小局结束,1:全局结束
                target.gameFinishedNotify=body;

                if(body.state==0)
                {

                }
                else if(body.state==2||body.state==3)
                {
                    target.showFinishedLayer();
                }
                else{

                }


            }
                break;
            case READY_RESPONSE:
            {
                cc.log("[用户准备好:"+body.uid+"]");

                target.removeClock(body.uid);


                if(target.readyLayer!=undefined&&target.readyLayer!=null)
                {
                    var roomUser=target.getRoomUserByUID(body.uid);
                    var uiPos=target.getRoomUserUIPos(roomUser);
                    target.readyLayer.updateReady(uiPos,0);
                }

            }
                break;
            case OFF_LINE_NOTIFY:
            {
                cc.log("[玩家下线:"+body.uid+"]");

                target.setUserOnLine(body.uid,false);

            }
                break;
            case ROOM_PLAYER_CARDS_NOTIFY:
            {


                cc.log("[玩家当前的牌推送]");
                var playerCards=body.playerCards;
                var tableCard=body.tableCard;

                var len=playerCards.length;
                for(var i=0;i<len;i++)
                {
                    var player=playerCards[i];
                    var uid=player.uid;

                    target.setZhuangXian(uid,player.roleType);

                    var roomUser=target.getRoomUserByUID(uid);

                    roomUser.cardSpriesLocal=[];
                    roomUser.colsLocal=[];

                    roomUser.cardSpries2Local=[];
                    roomUser.cols2Local=[];

                    roomUser.cardSpries3Local=[];

                    var cLen=player.cards1.length;
                    for(var j=0;j<cLen;j++)
                    {
                        var card=player.cards1[j];
                        if(tableCard!=null&&card.c_id==tableCard.c_id)
                        {
                            tableCard=null;
                        }
                        var cardSprite=new CardSprite();
                        cardSprite.createCard(card);
                        cardSprite.changeToSmall();
                        cardSprite.x=-100;
                        cardSprite.y=-100;
                        cardSprite.uid=uid;
                        cardSprite.setTag(CARD_SPRITE_TAG);
                        target.addChild(cardSprite,TABLE_DESKER_ZOEDER);

                        roomUser.cardSpriesLocal.push(cardSprite);

                        if(card.isBack==1)
                        {
                            cardSprite.changeToBg(false);
                        }


                    }
                    //cc.log("###uid:"+uid+",cards1:"+cLen+",name:"+roomUser.user.name);
                    target.sortRoomUserCard(roomUser);
                    target.resetMyCardPos(roomUser,null,false);

                    cLen=player.cards2.length;
                    for(var j=0;j<cLen;j++)
                    {
                        var groupCard=player.cards2[j];
                        var arr=groupCard.cards;

                        var cLen2=arr.length;
                        for(var k=0;k<cLen2;k++)
                        {
                            var card=arr[k];
                            if(tableCard!=null&&card.c_id==tableCard.c_id)
                            {
                                tableCard=null;
                            }
                            var cardSprite=new CardSprite();
                            cardSprite.createCard(card);
                            cardSprite.changeToSmall();
                            cardSprite.x=0;
                            cardSprite.y=0;
                            cardSprite.uid=uid;
                            cardSprite.setTag(CARD_SPRITE_TAG);
                            target.addChild(cardSprite,TABLE_DESKER_ZOEDER);
                            roomUser.cardSpries2Local.push(cardSprite);

                            if(card.isBack==1)
                            {
                                cardSprite.changeToBg(false);
                            }
                           // cc.log("card.flg3::"+card.flg3);
                            if(card.flg3==1)//0:,1:摸得牌,2:打出的牌
                            {
                                cardSprite.isChangeColor=true;
                            }
                            if(card.flg3==2)//0:,1:摸得牌,2:打出的牌
                            {
                                cardSprite.isPut=1;
                            }
                        }
                        if(cLen2>0)
                        {
                            roomUser.cols2Local.push(arr);
                        }

                    }
                    target.resetMyCardPos2(roomUser);

                    cLen=player.cards3.length;
                    for(var j=0;j<cLen;j++)
                    {
                        var card=player.cards3[j];
                        if(tableCard!=null&&card.c_id==tableCard.c_id)
                        {
                            tableCard=null;
                        }
                        var cardSprite=new CardSprite();
                        cardSprite.createCard(card);
                        cardSprite.changeToSmall2();
                        cardSprite.x=0;
                        cardSprite.y=0;
                        cardSprite.uid=uid;
                        cardSprite.setTag(CARD_SPRITE_TAG);
                        target.addChild(cardSprite,TABLE_DESKER_ZOEDER);
                        roomUser.cardSpries3Local.push(cardSprite);

                        if(card.flg3==1)//0:,1:摸得牌,2:打出的牌
                        {
                            cardSprite.isChangeColor=true;
                        }
                        if(card.flg3==2)//0:,1:摸得牌,2:打出的牌
                        {
                            cardSprite.isPut=1;
                        }

                        if(card.isBack==1)
                        {
                            cardSprite.changeToBg(false);
                        }
                    }
                    target.resetMyCardPos3(roomUser,null);


                }


                var cardUid=body.tableCardUid;
                if(tableCard!=null&&tableCard.value!=0)
                {

                    var pos=target.getRoomUserShowCardPos(cardUid);
                    var cardSprite=new CardSprite();
                    cardSprite.createCard(tableCard);

                    //cc.log("cardFlgcardFlg:"+body.cardFlg);
                    if(body.cardFlg==1)
                    {
                        if(myPlayerInfo.uid==body.actionUid)
                        {

                            cardSprite.changeToBig();
                        }
                        else{
                            cardSprite.changeToBg(true);

                        }

                    }
                    else{
                        cardSprite.changeToBig();
                    }

                    cardSprite.x=pos.x;
                    cardSprite.y=pos.y;
                    cardSprite.uid=cardUid;
                    cardSprite.setTag(CARD_SPRITE_TAG);
                    target.addChild(cardSprite,TABLE_DESKER_ZOEDER);

                    target.roomInfo.currentCard=cardSprite;
                }

                target.deskLeftCardCount=body.leftCardCount;

              //  if(target.roomObj!=undefined&&target.roomObj.roomState!=ROOM_NO_STATE)
                {
                    target.updateDeskLeftCount();
                }



                if(body.flow!=undefined&&body.flow!=null)
                {
                    var players=body.flow.players;
                    var len=players.length;
                    if(len>0)
                    {
                        stopBgMusic();
                    }
                }


                target.flowQueue.push(body.flow);


                target.lineSp.visible=true;
                target.lineSp.x=v_x+v_w/2;
                target.lineSp.y=v_y+v_h/2;

                //  cc.log("#####:"+body.leftCardCount);

            }
                break;
            case YUYIN_NOTIFY:
            {

                var uid=body.uid;
                var fileName=body.fileName;
                cc.log("玩家语音通知:"+fileName);
                target.speechLayer.playRecord(uid,fileName);


            }
                break;
            case MSG_RESPONSE:
            {
                cc.log("聊天信息");
                var uid=body.uid;
                var biaoqing=body.biaoqing;
                var msg=body.msg;

                var layer=new LiaoTianTipLayer(target,uid,biaoqing,msg);
                target.addChild(layer,TABLE_DESKER_ZOEDER+4);

            }
                break;
            case DISMISS_NOTIFY:
            {
                console.log("解散房间消息");

                if(target.jiesanLayer!=undefined&&target.jiesanLayer!=null)
                {
                    target.jiesanLayer.removeFromParent(true);
                    target.jiesanLayer=null;
                }
                target.jiesanLayer=new JieSanLayer(target,body);
                target.addChild(target.jiesanLayer,TABLE_DESKER_ZOEDER+11);
            }
                break;
            case DISMISS_RESPONSE:
            {
                console.log("退出房间应答:"+body.state);
                //0:等待玩家同意,1:直接退出,2:房间解散
                if(body.state==1)
                {
                    SceneManager.getInstance().changeScene(SCENE_01,REPLACE_SCENE);
                    socketMgr.close2();

                }
                else if(body.state==2)
                {
                    var dialog=new DialogLayer();
                    dialog.show(body.txt);
                    target.addChild(dialog,TABLE_DESKER_ZOEDER+100);

                    target.scheduleOnce(target.jiesanRoomTime, 2.0);

                }
            }
                break;
            case PLAY_EFFECT_RESPONSE:
            {
                cc.log("特效播放");

                var fromUid=body.fromUid;
                var toUid=body.toUid;
                var value=body.type;

                var sp=null;
                if(value==1)
                {
                    var frame = cc.spriteFrameCache.getSpriteFrame("zhandan_1.png");
                    sp= new cc.Sprite(frame);

                    //sp.animate=target.createAnimation("zhandan_",1,12);
                }
                else if(value==2)
                {
                    var frame = cc.spriteFrameCache.getSpriteFrame("zuanshi_3.png");
                    sp= new cc.Sprite(frame);
                    //sp.animate=target.createAnimation("zuanshi_",1,14);
                }
                else if(value==3)
                {
                    var frame = cc.spriteFrameCache.getSpriteFrame("hua_1.png");
                    sp= new cc.Sprite(frame);
                    //sp.animate=target.createAnimation("hua_",1,7);
                }
                else if(value==4)
                {
                    var frame = cc.spriteFrameCache.getSpriteFrame("jidan_1.png");
                    sp= new cc.Sprite(frame);
                    //sp.animate=target.createAnimation("jidan_",1,8);

                }
                else{
                    cc.log("特效类型错误!!!!!!:"+value);
                }
                sp.value=value;
                sp.fromUid=fromUid;
                sp.toUid=toUid;
                sp.visible=false;
                target.addChild(sp,TABLE_DESKER_ZOEDER+100);
                target.effectQueue.push(sp);


            }
                break;
            case ACK_RESPONSE:
            {
                cc.log("ack 服务器应答");
                target.ackQueue=[];

            }
                break;
            case SI_SHOU_RESPONSE:
            {
                //

                if(body.uid==myPlayerInfo.uid)
                {
                    target.player_state=1;
                }

                if(body.state==1)
                {
                    target.removeClock(null);
                    target.hasSendPutCard=false;
                    target.roomObj.roomState=ROOM_GAMEING_STATE;
                    target.releaseActionCount("【死手应答】");
                }



            }
                break;
        }


    },
    jiesanRoomTime:function (dt) {

        SceneManager.getInstance().changeScene(SCENE_01,REPLACE_SCENE);
        socketMgr.close2();

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
                var labSp=new cc.Sprite("res/ui/room_fucheng/lixian_room.png");
                labSp.x=pos.x;
                labSp.y=pos.y;
                roomUser.node.addChild(labSp,10);
                this.offLineUser[uid]=labSp;
            }
        }


        if(this.readyLayer!=undefined&&this.readyLayer!=null)
        {
            var roomUser=this.getRoomUserByUID(uid);
            var uiPos=this.getRoomUserUIPos(roomUser);
            this.readyLayer.updateOnline(uiPos,isOnline);
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

        this.cardLeftCount.setString(""+this.deskLeftCardCount);

        // this.wxButton.visible=false;
        // this.wxButton.setEnabled(false);
        // this.wxButton.setTouchEnabled(false);

        if(this.waitCardsLayer!=null)
        {
            this.waitCardsLayer.removeAllChildren();

        }


        for(var i=0;i<this.deskLeftCardCount;i++)
        {
            var sp=new cc.Sprite("res/ui/room_fucheng/card_room.png");
            sp.y+=i*2;
            this.waitCardsLayer.addChild(sp);

            //cc.log("########:"+this.deskLeftCardCount);
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
    fowLogic:function (dt) {

        if(this.excuteActionCount<=0)
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

                if(flow.flows_id!=undefined)
                {
                    this.currentFlowsId=flow.flows_id;
                }
                else{
                    this.currentFlowsId=0;
                }


            }
        }
        // if(this.excuteActionCount==0&&this.flowQueue.length==0)
        // {
        //     cc.log("[无动作可播放]");
        // }
        // else{
        //     cc.log("[无动作可播放this.excuteActionCount:"+this.excuteActionCount+"]"+this.flowQueue.length);
        // }

        if(this.time!=undefined&&this.time!=null&&this.myStartTime!=undefined)
        {


            var dis=new Date().getTime()-this.myStartTime.getTime();
            var a=this.serverTime.getTime()+dis;
            //cc.log("dis:"+dis+",a:"+a);
            var str=new Date(a).Format("hh:mm:ss");//yyyy/MM/dd
            this.time.setString(str);


        }

        if(isSetAck==1)
        {
            var akcCount=this.ackQueue.length;
            for(var i=0;i<akcCount;i++)
            {
                var ackObj=this.ackQueue[i];
                ackObj.waitTime+=dt;
                if(ackObj.waitTime>10)
                {
                    cc.log("ack超过10s,重新发送");
                    socketMgr.socket2.send(ACK_REQUEST,ackObj.req);
                    ackObj.waitTime=0;
                }

            }
        }


    },
    getServerTime:function () {

        var dis=new Date().getTime()-this.myStartTime.getTime();
        var a=this.serverTime.getTime()+dis;
        var str=new Date(a).Format("yyyy/MM/dd hh:mm:ss");//
        return str;
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
            case ACTION_TOUCH_CARD2:
            {
                cc.log("["+name+":发出庄家最后一张牌-actionCount:"+count+"]");
            }
                break;
            case ACTION_TAKE_IN2:
            {
                cc.log("["+name+":发出庄家最后一张牌收起-actionCount:"+count+"]");
            }
                break;
            case ACTION_KE_BAOPAI:
            {
                cc.log("["+name+":可爆牌-actionCount:"+count+"]");
            }
                break;
            case ACTION_BAOPAI:
            {
                cc.log("["+name+":爆牌-actionCount:"+count+"]");
            }
                break;
            case ACTION_DANSHUANG_SHEN:
            {
                cc.log("["+name+":单双神-actionCount:"+count+"]");
            }
                break;
            case ACTION_KE_TI:
            {
                cc.log("["+name+":可提-actionCount:"+count+"]");
            }
                break;
            case ACTION_KE_TI2:
            {
                cc.log("["+name+":可提2-actionCount:"+count+"]");
            }
                break;
            case ACTION_KE_PAO:
            {
                cc.log("["+name+":可跑-actionCount:"+count+"]");
            }
                break;
            case ACTION_KE_PAO2:
            {
                cc.log("["+name+":可跑2-actionCount:"+count+"]");
            }
                break;
            case ACTION_KE_WEI:
            {
                cc.log("["+name+":可偎-actionCount:"+count+"]");
            }
                break;
            case ACTION_SI_SHOU:
            {
                cc.log("["+name+":死手-actionCount:"+count+"]");
            }
                break;
            case ACTION_KE_JU_SHOU:
            {
                cc.log("["+name+":可举手-actionCount:"+count+"]");
            }
                break;
            case ACTION_JU_SHOU:
            {
                cc.log("["+name+":举手-actionCount:"+count+"]");
            }
                break;
            case ACTION_TOUCH2:
            {
                cc.log("["+name+":摸牌2-actionCount:"+count+"]");
            }
                break;
            case ACTION_TOUCH3:
            {
                cc.log("["+name+":摸牌3-actionCount:"+count+"]");
            }
                break;



            default:
            {
                cc.log("["+name+":动作-未知-actionCount:"+count+"]");
            }
                break;
        }
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

            zhuang.setLocalZOrder(100);
        }
        else if(roleType==XIANJIA_TYPE){
            //var xian = ccui.helper.seekWidgetByName(node, "xian");
            xian.visible=true;

            xian.setLocalZOrder(100);

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

                        if(player.uid==myPlayerInfo.uid)
                        {
                            this.myState=0;
                        }
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

                        if(action.ack==1&&isSetAck==1)//0:非反馈动作,1:需要反馈动作
                        {
                            var req=new AckRequest();
                            req.uid=myPlayerInfo.uid;
                            req.roomId=this.roomInfo.roomId;
                            req.type=action.type;
                            req.flows_id=flow.flows_id;
                            socketMgr.socket2.send(ACK_REQUEST,req);
                            cc.log("[ACK发送]");

                            var ackObj={};
                            ackObj.req=req;
                            ackObj.waitTime=0;
                            this.ackQueue.push(ackObj);
                            // if(this.ackQueue==undefined)
                            // {
                            //     this.ackQueue=[];
                            // }
                            // var obj={};
                            // obj.t=0;
                            // obj.action=action;
                            // this.ackQueue.push(obj);


                        }

                        switch(action.type)
                        {
                            case ACTION_FAPAI://发牌
                            {
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
                            case ACTION_KE_WEI:
                            {
                                this.actionkeWei(player,action);
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
                            case ACTION_TOUCH2:
                            {
                                this.actionTouch2(player,action);
                            }
                                break;
                            case ACTION_TOUCH3:
                            {
                                this.actionTouch3(player,action);
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
                            case ACTION_TOUCH_CARD2:
                            {
                                this.actionTouchCard2(player,action);
                            }
                                break;
                            case ACTION_TAKE_IN2:
                            {
                                this.actionTakeIn2(player,action);
                            }
                                break;
                            case ACTION_KE_BAOPAI:
                            {
                                this.actionKeBaoPai(player,action);
                            }
                                break;
                            case ACTION_BAOPAI:
                            {
                                this.actionBaoPai(player,action);
                            }
                                break;
                            case ACTION_DANSHUANG_SHEN:
                            {
                                this.actionDanShuangShen(player,action);
                            }
                                break;
                            case ACTION_KE_TI:
                            {
                                this.actionKeTi(player,action);
                            }
                                break;
                            case ACTION_KE_TI2:
                            {
                                this.actionKeTi2(player,action);
                            }
                                break;
                            case ACTION_KE_PAO:
                            {
                                this.actionKePao(player,action);
                            }
                                break;
                            case ACTION_KE_PAO2:
                            {
                                this.actionKePao2(player,action);
                            }
                                break;
                            case ACTION_SI_SHOU:
                            {
                                this.actionSiShou(player,action);
                            }
                                break;
                            case ACTION_KE_JU_SHOU:
                            {
                                this.actionKeJuShou(player,action);
                            }
                                break;
                            case ACTION_JU_SHOU:
                            {
                                this.actionJuShou(player,action);
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
                    req.uid=myPlayerInfo.uid;
                    req.roomId=this.roomInfo.roomId;;
                    req.type=action.type;
                    socketMgr.socket2.send(ACK_REQUEST,req);
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

        socketMgr.close2();

    },
    showFinishedLayer:function () {


        if(this.roomTip!=null&&this.roomTip!=undefined)
        {
            this.roomTip.removeFromParent(true);
            this.roomTip=null;
        }

        if(this.gameFinishedNotify!=undefined&&this.gameFinishedNotify!=null)
        {

            if(UI_TYPE==1)
            {

              

                this.finishedLayer=new FinishFuChengLayer(this.gameFinishedNotify,this);
                this.addChild(this.finishedLayer,TABLE_DESKER_ZOEDER+100);




            }
            else{
                this.finishedLayer=new FinishLayer(this.gameFinishedNotify,this);
                this.addChild(this.finishedLayer,TABLE_DESKER_ZOEDER+100);
            }

            this.zhunbei.visible=true;
            this.zhunbei.setEnabled(true);
            this.zhunbei.setTouchEnabled(true);

            this.chakan.visible=true;
            this.chakan.setEnabled(true);
            this.chakan.setTouchEnabled(true);



            if(this.gameFinishedNotify.state==0)
            {
                //this.gameFinishedNotify.startTime=new Date().getTime();
                // this.schedule(this.finishedLayerTime, 0.1);
            }


            this.hasClearCards=false;


            this.showUserLeftCards();

        }





    },
    nextGameStart:function (sender, type) {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                this.hideFinishedLayer();
                this.hideSlectedButton(myPlayerInfo.uid);

                var req=new ReadyRequest();
                req.uid=myPlayerInfo.uid;
                req.roomId=this.roomInfo.roomId;
                socketMgr.socket2.send(READY_REQUEST,req);
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

        if(this.hupaiCardSp!=undefined)
        {
            var huCount=this.hupaiCardSp.length;
            for(var i=0;i<huCount;i++)
            {
                var sp=this.hupaiCardSp[i];
                sp.removeFromParent();
            }
            this.hupaiCardSp=[];
            this.hupaiTishi.visible=false;
        }


    },
    showWorld:function (worldType,uid) {

        var obj={};
        obj.type=worldType;
        obj.uid=uid;
        this.wordQueue.push(obj);



    },
    showUserLeftCards:function () {

        var roomUsers=this.roomInfo.roomUsers;
        var len=roomUsers.length;
        for(var i=0;i<len;i++) {
            var roomUser = roomUsers[i];
            this.resetMyCardPos(roomUser,null,true);
        }

    },
    clearLast:function () {


        if(this.readyLayer!=undefined&&this.readyLayer!=null)
        {
            this.readyLayer.removeFromParent(true);
            this.readyLayer=null;
        }

        if(this.centerReady!=undefined)
        {
            this.zhunbei.visible=false;
            this.zhunbei.setEnabled(false);
            this.zhunbei.setTouchEnabled(false);

            this.chakan.visible=false;
            this.chakan.setEnabled(false);
            this.chakan.setTouchEnabled(false);


        }





        if(!this.hasClearCards)
        {
            this.clearAllCard();
            this.hasClearCards=true;
        }
        this.lineSp.visible=true;
        this.lineSp.x=v_x+v_w/2;
        this.lineSp.y=v_y+v_h/2;

        this.roomObj.roomState=ROOM_GAMEING_STATE;

        this.hideFinishedLayer();
        this.hideSlectedButton(myPlayerInfo.uid);
        this.removeClock(null);

        gameState=GAME_PLAYING_IN_ROOM;
        stopBgMusic();


        var tmpCount=this.tmpNodeArr.length;
        for(var i=0;i<tmpCount;i++)
        {
            var a=this.tmpNodeArr[i];
            a.removeFromParent(true);

        }
        this.tmpNodeArr=[];

        if(this.siShouButton!=null&&this.siShouButton!=undefined)
        {
            this.siShouButton.removeFromParent(true);
            this.siShouButton=null;

        }

        this.player_state=0;
        this.fanxing_card=[];//桂林翻醒card

        this.putCardByType=-1;



    },
    actionDanShuangShen:function (player,action) {

        if(player.uid!=myPlayerInfo.uid)
        {
            this.releaseActionCount("单双神完成-非本人");
            return;
        }
        cc.log("单双神=====");

        this.clearLast();





        this.faPaiPos=this.centerNode.convertToWorldSpace(cc.p(this.dui.x,this.dui.y));

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
                cardSprite.changeToBig();
                cardSprite.x=this.faPaiPos.x;
                cardSprite.y=this.faPaiPos.y;
                var scl=cardSprite.getSpScale();
                cardSprite.setScl(0);
                cardSprite.setTag(CARD_SPRITE_TAG);
                this.addChild(cardSprite,100);

                var pos=this.getRoomUserShowCardPos(player.uid);

                var moveAction = cc.moveTo(0.1+DELEAY_TEST, pos);
                var delayAction=cc.delayTime(0.5+DELEAY_TEST);
                var actionCallbackFunction = cc.callFunc(this.danshuangShenFinishCallFunction, this, cardSprite);
                var actionArray=[];
                actionArray.push(moveAction);
                actionArray.push(delayAction);
                actionArray.push(actionCallbackFunction);
                // cc.log("####1#");
                var actionSequence = cc.sequence(actionArray);
                var scaleTo=cc.scaleTo(0.1,scl);

                cardSprite.runAction(actionSequence);
                cardSprite.runActionWithSp(scaleTo);


                if(cardSprite.card.value%2==0)
                {
                    this.showWorld(WORLD_SHUANGSHEN,player.uid);

                    playEffect(operSound.shuangshen.n);

                }
                else{
                    this.showWorld(WORLD_DANSHEN,player.uid);

                    playEffect(operSound.danshen.n);

                }



                break;
            }

        }

    },
    danshuangShenFinishCallFunction:function (cardSprite) {

        this.danshuangShenLab.visible=true;

        if(cardSprite.card.value%2==0)
        {
            this.danshuangShenLab.setString("双神");
        }
        else{
            this.danshuangShenLab.setString("单神");
        }
        cardSprite.removeFromParent(true);
        this.releaseActionCount("单双神完成");
    },
    actionFaPai:function (player,action) {

        this.clearLast();

        var roomUser=this.getRoomUserByUID(player.uid);
        roomUser.cardSpriesLocal=[];
        roomUser.moveActionCount=0;

        var node=roomUser.node;
        var uiPos=this.getRoomUserUIPos(roomUser);
        var pos={x:0,y:0};
        var winSize=cc.winSize;

        this.faPaiPos=this.centerNode.convertToWorldSpace(cc.p(this.dui.x,this.dui.y));
       // this.faPaiPos.x=this.dui.x+this.centerNode.x;
        //this.faPaiPos.y=this.dui.y+this.centerNode.y;

        var rotation=0;
        if(uiPos==BOTTOM_UI)
        {
            pos.x=v_x+v_w/2;
            pos.y=100;

            cc.log("[name:"+roomUser.user.name+"-BOTTOM_UI-"+roomUser.index+"]");
        }
        else if(uiPos==RIGHT_UI)
        {
            // pos.x=v_x+v_w-100;
            // pos.y=v_y+v_h/2;

            pos.x=v_x+v_w/2;
            pos.y=100;

            //rotation=90;
            cc.log("[name:"+roomUser.user.name+"-RIGHT_UI]"+roomUser.index+"]");
        }
        else if(uiPos==TOP_UI)
        {
             pos.x=v_x+v_w-100;
             pos.y=this.dui.y+this.centerNode.y;


            rotation=90;

            cc.log("[name:"+roomUser.user.name+"-TOP_UI]");
        }
        else if(uiPos==LEFT_UI)
        {
            pos.x=v_x+100;
            pos.y=this.dui.y+this.centerNode.y;

            rotation=-90;

             cc.log("[name:"+roomUser.user.name+"-LEFT_UI]");
        }

        cc.log("#########pos:"+pos.x+","+pos.y);
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
            this.resetMyCardPos(roomUser,null,false);

            this.releaseActionCount("发牌移动完成");

            // cc.log("this.excuteActionCount:"+this.excuteActionCount);

        }


    },
    resetMyCardPos3:function (roomUser,cardSp) {

        var cardsArr1=roomUser.cardSpries3Local;
        var cardsArr2=[];
        var cardsArr=[];

        if(RULE_VALUE==ROOM_TYPE_PENGHUZI)
        {


            var roomUsers=this.roomInfo.roomUsers;
            var len=roomUsers.length;
            for(var i=0;i<len;i++) {
                var roomUser2 = roomUsers[i];
                if(roomUser2==roomUser)
                {
                    continue;
                }

                if(roomUser2.cols2Local==undefined||roomUser2.cols2Local==null)
                {
                    continue;
                }

                var len2=roomUser2.cols2Local.length;
                for(var j=0;j<len2;j++) {
                    var arr = roomUser2.cols2Local[j];
                    var size = arr.length;

                    if(size==3)
                    {
                        var a1=arr[0];
                        var a2=arr[1];
                        var a3=arr[2];

                        if(a1.type==a2.type&&a1.value==a2.value&&a1.type==a3.type&&a1.value==a3.value)
                        {
                            if(a1.isBack==1||a2.isBack==1||a3.isBack==1)
                            {
                                continue;
                            }

                            // 0:,1:摸得牌,2:打出的牌
                            if(a1.flg3==2&&a1.uid==roomUser.user.uid)
                            {
                                var cardSprite = this.getCardSpriteByCardId2(roomUser2, a1.c_id);
                                cardsArr2.push(cardSprite);
                                cardSprite.changeToSmall2();

                                cc.log("$$$$$$$1");
                            }
                            else  if(a2.flg3==2&&a2.uid==roomUser.user.uid)
                            {
                                var cardSprite = this.getCardSpriteByCardId2(roomUser2, a2.c_id);
                                cardsArr2.push(cardSprite);
                                cardSprite.changeToSmall2();

                                cc.log("$$$$$$$2");
                            }
                            else  if(a3.flg3==2&&a3.uid==roomUser.user.uid)
                            {
                                var cardSprite = this.getCardSpriteByCardId2(roomUser2, a3.c_id);
                                cardsArr2.push(cardSprite);
                                cardSprite.changeToSmall2();

                                cc.log("$$$$$$$3");
                            }


                        }



                    }

                }



            }

            if(cardsArr2.length>0)
            {

                if(cardsArr1!=undefined)
                {
                    var count=cardsArr1.length;
                    for(var i=0;i<count;i++)
                    {
                        var card=cardsArr1[i].card;

                        var flg=false;
                        var count2=cardsArr.length;
                        for(var j=0;j<count2;j++)
                        {
                            var card2=cardsArr[j].card;
                            if(card.index<card2.index)
                            {
                                cardsArr.splice(j,0,cardsArr1[i]);
                                flg=true;
                                break;
                            }


                        }

                        if(!flg)
                        {
                            cardsArr.push(cardsArr1[i]);
                        }

                    }

                }


                var count=cardsArr2.length;
                for(var i=0;i<count;i++)
                {
                    var card=cardsArr2[i].card;

                    var flg=false;
                    var count2=cardsArr.length;
                    for(var j=0;j<count2;j++)
                    {
                        var card2=cardsArr[j].card;
                        if(card.index<card2.index)
                        {
                            cardsArr.splice(j,0,cardsArr2[i]);
                            flg=true;
                            break;
                        }


                    }

                    if(!flg)
                    {
                        cardsArr.push(cardsArr2[i]);
                    }

                }


            }
            else{
                cardsArr=cardsArr1;
            }

        }
        else
        {
            cardsArr=cardsArr1;
        }

        if(cardsArr==undefined||cardsArr==null||cardsArr.length<=0)
        {
            return;
        }

        var len=cardsArr.length;

        cc.log("len::::"+len);
        for(var i=0;i<len;i++)
        {
            var cardSprite=cardsArr[i];

            var pos=this.getHeadPos(roomUser,0,0);
            var uiPos=this.getRoomUserUIPos(roomUser);

            var hasAddCount=i+1;



            var hangIndex=parseInt(hasAddCount/5);
            var hangIndex2=parseInt(hasAddCount)%5;
            var xp=0;
            var yp=0;
            if(hangIndex<=0)
            {
                hangIndex=1;
            }
            else{
                if(hangIndex2!=0)
                {
                    hangIndex+=1;


                }

            }

            var init_x=-this.gap_w2_2;

            xp=init_x+(hasAddCount-(hangIndex-1)*5-1)*this.gap_w2;//(hasAddCount-(hangIndex-1)*5-1)*this.gap_w2_2-this.gap_w2_2;
            yp=-(hangIndex-1)*this.gap_h2;


            var pos=this.getTableCardStartPos(uiPos,2);
           // pos.x+=(hasAddCount-1)*this.gap_w2;
            pos.x+=xp;
            pos.y+=yp;


            if(cardSp!=null&&cardSp.card.c_id==cardSprite.card.c_id)
            {
                return pos;
            }
            else if(cardSp!=null)
            {
                continue;
            }

            cardSprite.x=pos.x;
            cardSprite.y=pos.y;


            cc.log("$$$$$$$$$$$$$$$$$$$$$$$$$:"+cardSprite.card.flg3);
            if(cardSprite.card.flg3==1)
            {
                cardSprite.setBlue();
            }


            if(cardSprite.card.flg3==2)
            {
                cardSprite.setRed();
            }

            cardSprite.setLocalZOrder(1);

            //if(OLD_CARD==1)
            {
                //cardSprite.setScl(SMALL_CARD_SCL2);
            }

        }





    },
    resetMyCardPos:function (roomUser,myCard,isShowOtherCard) {

        if(roomUser.colsLocal==undefined)
        {
            return cc.p(0,0);
        }
        var start_zorder=300;
        var scl_c=0.7;
        
        var uiPos=this.getRoomUserUIPos(roomUser);
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
                    cardSprite.setLocalZOrder(size-j+start_zorder);
                    cardSprite.changeToSmall();
                    // if(OLD_CARD==1)
                    {
                        //cardSprite.setScl(SMALL_CARD_SCL);
                    }


                    if(size==3||size==4)
                    {
                        var sameCount=0;
                        for(var k=0;k<size;k++) {
                            var card2 = arr[k];
                            if(card2==card)
                            {
                                continue;
                            }
                            if(card2.type==card.type&&card2.value==card.value)
                            {
                                sameCount++;
                            }


                        }
                        if(RULE_VALUE!=ROOM_TYPE_WAIHUZI)
                        {
                            if(sameCount>=2)
                            {
                                cardSprite.setGray();
                            }

                        }

                        //     var c1=arr[0];
                        // var c2=arr[1];
                        // var c3=arr[2];
                        // if(c1.type==c2.type&&c1.value==c2.value&&c1.type==c3.type&&c1.value==c3.value)
                        // {
                        //     cardSprite.setGray();
                        // }

                    }
                }
                init_x+=this.gap_w;
            }
        }
        else if(uiPos==RIGHT_UI)
        {

            var x=v_x+v_w-this.gap_w2*scl_c;
            var y=v_y+300;


            var len=roomUser.colsLocal.length;
            var init_x=x;

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
                            myPos.y=y+(j*this.gap_h2*scl_c);

                            cc.log("#####2:"+myPos.x+","+myPos.y);

                            return myPos;
                        }

                        continue;
                    }

                    var cardSprite=this.getCardSpriteByCardId(roomUser,card.c_id);
                    cardSprite.visible=isShowOtherCard;
                    cardSprite.x=init_x;
                    cardSprite.y=y+(j*this.gap_h2*scl_c);
                    cardSprite.setLocalZOrder(size-j+start_zorder);
                    cardSprite.changeToSmall2();
                    //if(OLD_CARD==1)
                    {
                        cardSprite.setScl(scl_c);
                    }

                }
                init_x-=this.gap_w2*scl_c;
            }
        }
        else if(uiPos==TOP_UI)
        {

            var x=v_x+v_w-200;
            var y=v_y+v_h-this.gap_h2*3*scl_c;


            var len=roomUser.colsLocal.length;
            var init_x=x;

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
                            myPos.y=y+(j*this.gap_h2*scl_c);

                            cc.log("#####3:"+myPos.x+","+myPos.y);

                            return myPos;
                        }

                        continue;
                    }

                    var cardSprite=this.getCardSpriteByCardId(roomUser,card.c_id);
                    cardSprite.visible=isShowOtherCard;
                    cardSprite.x=init_x;
                    cardSprite.y=y+(j*this.gap_h2*scl_c);
                    cardSprite.setLocalZOrder(size-j+start_zorder);
                    cardSprite.changeToSmall2();
                    //if(OLD_CARD==1)
                    {
                        cardSprite.setScl(scl_c);
                    }

                }
                init_x-=this.gap_w2*scl_c;
            }

        }
        else if(uiPos==LEFT_UI)
        {

            var x=v_x+200;
            var y=v_y+v_h-this.gap_h2*3*scl_c;


            var len=roomUser.colsLocal.length;
            var init_x=x;

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
                            myPos.y=y+(j*this.gap_h2*scl_c);

                            cc.log("#####4:"+myPos.x+","+myPos.y);
                            return myPos;
                        }

                        continue;
                    }

                    var cardSprite=this.getCardSpriteByCardId(roomUser,card.c_id);
                    cardSprite.visible=isShowOtherCard;
                    cardSprite.x=init_x;
                    cardSprite.y=y+(j*this.gap_h2*scl_c);
                    cardSprite.setLocalZOrder(size-j+start_zorder);
                    cardSprite.changeToSmall2();

                    // if(OLD_CARD==1)
                    {
                        cardSprite.setScl(scl_c);
                    }
                }
                init_x+=this.gap_w2*scl_c;
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


        if(RULE_VALUE==ROOM_TYPE_GUILIN||RULE_VALUE==ROOM_TYPE_WAIHUZI||RULE_VALUE==ROOM_TYPE_HUAIHUA||RULE_VALUE==ROOM_TYPE_DAZIPAI
            ||RULE_VALUE==ROOM_TYPE_PENGHUZI
        )
        {
            //全部盖的牌 只有自己可以看到

            if(RULE_VALUE==ROOM_TYPE_WAIHUZI&&WAIHUZI_QISHOU_QING_SHOW==1)
            {

               // if(roomUser!=null&&roomUser.user.uid==myPlayerInfo.uid)
                {
                    var isAllBack=true;
                    var lCount=tmpArr.length;
                    for(var i=0;i<lCount;i++)
                    {
                        var cc=tmpArr[i];
                        if(cc.isBack==0)
                        {
                            isAllBack=false;
                        }

                    }
                    if(lCount>0)
                    {
                        if(isAllBack)
                        {
                            var c=tmpArr[lCount-1];
                            c.isSelfSee=true;
                        }
                    }


                }
            }
            else{
                if(roomUser!=null&&roomUser.user.uid==myPlayerInfo.uid)
                {
                    var isAllBack=true;
                    var lCount=tmpArr.length;
                    for(var i=0;i<lCount;i++)
                    {
                        var cc=tmpArr[i];
                        if(cc.isBack==0)
                        {
                            isAllBack=false;
                        }

                    }
                    if(lCount>0)
                    {
                        if(isAllBack)
                        {
                            var c=tmpArr[lCount-1];
                            c.isSelfSee=true;
                        }
                    }


                }
            }





        }

        if(tmpArr.length==4)
        {
            var tmpArr2=[];
            for(var i=0;i<4;i++)
            {
                var cc=tmpArr[i];
                if(cc.isBack==1&&(cc.isSelfSee==undefined))
                {
                    tmpArr2.push(cc);
                }

            }

            for(var i=0;i<4;i++)
            {
                var cc=tmpArr[i];
                if(cc.isBack==0||cc.isSelfSee!=undefined)
                {
                    tmpArr2.push(cc);
                }

            }

            return tmpArr2;

        }
        else{
            return tmpArr;
        }




    },

    getPosOfCardInMyCards2:function (roomUser,checkCard) {

        var uiPos=this.getRoomUserUIPos(roomUser);
        var node=roomUser.node;
        var head = ccui.helper.seekWidgetByName(node, "head");
        //var pos=head.convertToWorldSpace(cc.p(0,0));

        var pos=this.getTableCardStartPos(uiPos,1);

        var g_w=this.gap_w2;
        var g_h=this.gap_h2;

        if(uiPos==BOTTOM_UI)
        {

            var x=pos.x;
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
                init_x+=g_w;
            }
        }
        else if(uiPos==RIGHT_UI)
        {

            var x=pos.x;
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

            var x=pos.x;
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
        else if(uiPos==LEFT_UI)
        {

            var x=pos.x;
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
                init_x+=g_w;
            }


        }

        return cc.p(0,0);

    },
    resetMyCardPos2:function (roomUser) {

        var uiPos=this.getRoomUserUIPos(roomUser);
        var node=roomUser.node;
        var head = ccui.helper.seekWidgetByName(node, "head");
        //var pos=head.convertToWorldSpace(cc.p(0,0));

        var pos=this.getTableCardStartPos(uiPos,1);

        var g_w=this.gap_w2;
        var g_h=this.gap_h2;



        if(uiPos==BOTTOM_UI)
        {

            var x=pos.x;
            var y=pos.y;

            var len=roomUser.cols2Local.length;
            var init_x=x;

            for(var i=0;i<len;i++)
            {
                var arr=roomUser.cols2Local[i];
                var size=arr.length;

                var sortArr=this.resetSort(roomUser,arr);

                sortArr=this.checkPeng_PengHuzi(sortArr);
                size=sortArr.length;

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
                    if(card.isBack==1&&card.isSelfSee==undefined)
                    {
                        //背面
                        cardSprite.changeToBg(false);
                    }

                    if(cardSprite.card.flg3==1)
                    {
                        cardSprite.setBlue();
                    }


                    if(cardSprite.card.flg3==2)
                    {
                        cardSprite.setRed();
                    }

                    //if(cardSprite.isChangeColor!=undefined&&cardSprite.isChangeColor)
                    //{
                    //    cardSprite.setBlue();
                    //}
                    //
                    //
                    //if(cardSprite.isPut!=undefined&&cardSprite.isPut==1)
                    //{
                    //    cardSprite.setRed();
                    //}

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

            var x=pos.x;
            var y=pos.y;

            var len=roomUser.cols2Local.length;
            var init_x=x;

            for(var i=0;i<len;i++)
            {
                var arr=roomUser.cols2Local[i];
                var size=arr.length;
                var sortArr=this.resetSort(roomUser,arr);

                sortArr=this.checkPeng_PengHuzi(sortArr);
                size=sortArr.length;


                for(var j=0;j<size;j++)
                {
                    var card=sortArr[j];
                    var cardSprite=this.getCardSpriteByCardId2(roomUser,card.c_id);
                    cardSprite.visible=true;

                    cardSprite.x=init_x;
                    cardSprite.y=y+(j*g_h);
                    cardSprite.setLocalZOrder(size-j);
                    cardSprite.changeToSmall2();
                    if(card.isBack==1&&card.isSelfSee==undefined)
                    {
                        //背面
                        cardSprite.changeToBg(false);
                    }
                    //if(OLD_CARD==1)
                    {
                        //cardSprite.setScl(SMALL_CARD_SCL2);
                    }

                    //if(cardSprite.isChangeColor!=undefined&&cardSprite.isChangeColor)
                    //{
                    //    cardSprite.setBlue();
                    //}
                    //
                    //if(cardSprite.isPut!=undefined&&cardSprite.isPut==1)
                    //{
                    //    cardSprite.setRed();
                    //}

                    if(cardSprite.card.flg3==1)
                    {
                        cardSprite.setBlue();
                    }


                    if(cardSprite.card.flg3==2)
                    {
                        cardSprite.setRed();
                    }


                }
                init_x-=g_w;
            }
        }
        else if(uiPos==TOP_UI)
        {

            var x=pos.x;
            var y=pos.y;

            var len=roomUser.cols2Local.length;
            var init_x=x;

            for(var i=0;i<len;i++)
            {
                var arr=roomUser.cols2Local[i];
                var size=arr.length;

                var sortArr=this.resetSort(roomUser,arr);

                sortArr=this.checkPeng_PengHuzi(sortArr);
                size=sortArr.length;


                for(var j=0;j<size;j++)
                {
                    var card=sortArr[j];
                    var cardSprite=this.getCardSpriteByCardId2(roomUser,card.c_id);
                    cardSprite.visible=true;

                    cardSprite.x=init_x;
                    cardSprite.y=y+(j*g_h);
                    cardSprite.setLocalZOrder(size-j);
                    cardSprite.changeToSmall2();
                    if(card.isBack==1&&card.isSelfSee==undefined)
                    {
                        //背面
                        cardSprite.changeToBg(false);
                    }
                    //if(OLD_CARD==1)
                    {
                        //cardSprite.setScl(SMALL_CARD_SCL2);
                    }

                    //if(cardSprite.isChangeColor!=undefined&&cardSprite.isChangeColor)
                    //{
                    //    cardSprite.setBlue();
                    //}
                    //
                    //if(cardSprite.isPut!=undefined&&cardSprite.isPut==1)
                    //{
                    //    cardSprite.setRed();
                    //}

                    if(cardSprite.card.flg3==1)
                    {
                        cardSprite.setBlue();
                    }


                    if(cardSprite.card.flg3==2)
                    {
                        cardSprite.setRed();
                    }

                }
                init_x-=g_w;
            }
        }
        else if(uiPos==LEFT_UI)
        {

            var x=pos.x;
            var y=pos.y;

            var len=roomUser.cols2Local.length;
            var init_x=x;

            for(var i=0;i<len;i++)
            {
                var arr=roomUser.cols2Local[i];
                var size=arr.length;

                var sortArr=this.resetSort(roomUser,arr);

                sortArr=this.checkPeng_PengHuzi(sortArr);
                size=sortArr.length;

                for(var j=0;j<size;j++)
                {
                    var card=sortArr[j];
                    var cardSprite=this.getCardSpriteByCardId2(roomUser,card.c_id);
                    cardSprite.visible=true;

                    cardSprite.x=init_x;
                    cardSprite.y=y+(j*g_h);
                    cardSprite.setLocalZOrder(size-j);
                    cardSprite.changeToSmall2();
                    if(card.isBack==1&&card.isSelfSee==undefined)
                    {
                        //背面
                        cardSprite.changeToBg(false);
                    }
                    //if(OLD_CARD==1)
                    {
                        //  cardSprite.setScl(SMALL_CARD_SCL2);
                    }

                    //if(cardSprite.isChangeColor!=undefined&&cardSprite.isChangeColor)
                    //{
                    //    cardSprite.setBlue();
                    //}
                    //
                    //if(cardSprite.isPut!=undefined&&cardSprite.isPut==1)
                    //{
                    //    cardSprite.setRed();
                    //}

                    if(cardSprite.card.flg3==1)
                    {
                        cardSprite.setBlue();
                    }


                    if(cardSprite.card.flg3==2)
                    {
                        cardSprite.setRed();
                    }

                }
                init_x+=g_w;
            }


        }




    },
    checkPeng_PengHuzi:function(arr)
    {

        if(RULE_VALUE==ROOM_TYPE_PENGHUZI)
        {
            if(arr.length!=3)
            {
                return arr;
            }
            var arr2=[];
            var a1=arr[0];
            var a2=arr[1];
            var a3=arr[2];

            if(a1.type==a2.type&&a1.value==a2.value&&a1.type==a3.type&&a1.value==a3.value)
            {
                if(a1.isBack==1||a2.isBack==1||a3.isBack==1)
                {
                    return arr;
                }

                var uid=null;

                if(a1.flg3==2)
                {
                    arr2.push(a2);
                    arr2.push(a3);

                    uid=a1.uid;



                }
                else  if(a2.flg3==2)
                {

                    arr2.push(a1);
                    arr2.push(a3);

                    uid=a2.uid;


                }
                else  if(a3.flg3==2)
                {
                    arr2.push(a1);
                    arr2.push(a2);

                    uid=a3.uid;

                }

                if(uid!=null)
                {

                    var roomUser=this.getRoomUserByUID(uid);
                    this.resetMyCardPos3(roomUser,null);
                    cc.log("####################1111");
                    return arr2;
                }
                else{
                    return arr;
                }


            }
            else {
                return arr;
            }



        }


        return arr;


    },
    //resetAllUserCardPos3:function()
    //{
    //
    //    var roomUsers=this.roomInfo.roomUsers;
    //    var len=roomUsers.length;
    //    for(var i=0;i<len;i++) {
    //        var roomUser2 = roomUsers[i];
    //        this.resetMyCardPos3(roomUser2);
    //
    //    }
    //
    //},

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
        var one_two_three=[];
        var daxiaoDui=[];
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


        if(RULE_VALUE!=ROOM_TYPE_WAIHUZI)
        {

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


        //1/2/3
        len=tmpArray.length;
        for(var i=0;i<len;i++)
        {
            var card1=tmpArray[i];

            if(hasChecked[card1.c_id]!=undefined)
            {
                continue;
            }

            if(card1.value==1)
            {
                var c1=this.getCardByTypeValue(tmpArray,card1.type,2,hasChecked);
                var c2=this.getCardByTypeValue(tmpArray,card1.type,3,hasChecked);

                if(c1!=null&&c2!=null)
                {
                    var arr=[];
                    arr.push(card1);
                    arr.push(c1);
                    arr.push(c2);
                    one_two_three.push(arr);
                    hasChecked[c1.c_id]=c1;
                    hasChecked[c2.c_id]=c2;
                    hasChecked[card1.c_id]=card1;

                }

            }
            else if(card1.value==2)
            {
                var c1=this.getCardByTypeValue(tmpArray,card1.type,1,hasChecked);
                var c2=this.getCardByTypeValue(tmpArray,card1.type,3,hasChecked);

                if(c1!=null&&c2!=null)
                {
                    var arr=[];

                    arr.push(card1);
                    arr.push(c1);
                    arr.push(c2);
                    one_two_three.push(arr);
                    hasChecked[c1.c_id]=c1;
                    hasChecked[c2.c_id]=c2;
                    hasChecked[card1.c_id]=card1;

                }
            }
            else if(card1.value==3)
            {
                var c1=this.getCardByTypeValue(tmpArray,card1.type,1,hasChecked);
                var c2=this.getCardByTypeValue(tmpArray,card1.type,2,hasChecked);

                if(c1!=null&&c2!=null)
                {

                    var arr=[];

                    arr.push(card1);
                    arr.push(c1);
                    arr.push(c2);
                    one_two_three.push(arr);
                    hasChecked[c1.c_id]=c1;
                    hasChecked[c2.c_id]=c2;
                    hasChecked[card1.c_id]=card1;

                }
            }


        }


        //2/7/10
        len=tmpArray.length;
        for(var i=0;i<len;i++)
        {
            var card1=tmpArray[i];

            if(hasChecked[card1.c_id]!=undefined)
            {
                continue;
            }

            if(card1.value==2)
            {
                var c1=this.getCardByTypeValue(tmpArray,card1.type,7,hasChecked);
                var c2=this.getCardByTypeValue(tmpArray,card1.type,10,hasChecked);

                if(c1!=null&&c2!=null)
                {
                    var arr=[];
                    arr.push(card1);
                    arr.push(c1);
                    arr.push(c2);
                    two_7_array.push(arr);
                    hasChecked[c1.c_id]=c1;
                    hasChecked[c2.c_id]=c2;
                    hasChecked[card1.c_id]=card1;

                }

            }
            else if(card1.value==7)
            {
                var c1=this.getCardByTypeValue(tmpArray,card1.type,2,hasChecked);
                var c2=this.getCardByTypeValue(tmpArray,card1.type,10,hasChecked);

                if(c1!=null&&c2!=null)
                {
                    var arr=[];

                    arr.push(card1);
                    arr.push(c1);
                    arr.push(c2);
                    two_7_array.push(arr);
                    hasChecked[c1.c_id]=c1;
                    hasChecked[c2.c_id]=c2;
                    hasChecked[card1.c_id]=card1;

                }
            }
            else if(card1.value==10)
            {
                var c1=this.getCardByTypeValue(tmpArray,card1.type,2,hasChecked);
                var c2=this.getCardByTypeValue(tmpArray,card1.type,7,hasChecked);

                if(c1!=null&&c2!=null)
                {

                    var arr=[];

                    arr.push(card1);
                    arr.push(c1);
                    arr.push(c2);
                    two_7_array.push(arr);
                    hasChecked[c1.c_id]=c1;
                    hasChecked[c2.c_id]=c2;
                    hasChecked[card1.c_id]=card1;

                }
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


        //大小对
        len=tmpArray.length;
        for(var i=0;i<len;i++) {
            var card1 = tmpArray[i];

            if (hasChecked[card1.c_id] != undefined) {
                continue;
            }
            var type_c=card1.type;
            if(type_c==0)
            {
                type_c=1;
            }
            else{
                type_c=0;
            }
            var cArray = this.getArrayCardByTypeValue(tmpArray,type_c, card1.value, hasChecked);
            if(cArray.length>=1)
            {

                var arr2=[];
                arr2.push(cArray[0]);
                arr2.push(card1);
                daxiaoDui.push(arr2);

                hasChecked[cArray[0].c_id]=cArray[0];
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

        if(RULE_VALUE!=ROOM_TYPE_WAIHUZI)
        {


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


            size=daxiaosandaArray.length;
            cc.log("[大小三搭:"+size+"]");
            for(var i=0;i<size;i++)
            {
                var arr=daxiaosandaArray[i];
                roomUser.colsLocal.push(arr);
            }

            size=towArray.length;
            cc.log("[二张:"+size+"]");
            for(var i=0;i<size;i++)
            {
                var arr=towArray[i];
                roomUser.colsLocal.push(arr);
            }



            size=daxiaoDui.length;
            cc.log("[大小二张:"+size+"]");
            for(var i=0;i<size;i++)
            {
                var arr=daxiaoDui[i];
                roomUser.colsLocal.push(arr);
            }

            size=one_two_three.length;
            cc.log("[123:"+size+"]");
            for(var i=0;i<size;i++)
            {
                var arr=one_two_three[i];
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

            var hasCol=roomUser.colsLocal.length;
            if(hasCol<10)
            {
                var an=10-hasCol;
                size=otherArray.length;
                var aCount=0;
                var tmp_arr=[];

                var i=0;
                for(;i<size&&aCount<(an-1);i++,aCount++)
                {
                    var c=otherArray[i];
                    tmp_arr.push(c);
                    roomUser.colsLocal.push(tmp_arr);
                    tmp_arr=[];
                }

                tmp_arr=[];
                for(;i<size;i++)
                {
                    var c=otherArray[i];
                    tmp_arr.push(c);
                }
                if(tmp_arr.length>0)
                {
                    roomUser.colsLocal.push(tmp_arr);
                    tmp_arr=[];
                }

            }
            else{

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
            }


            var count=roomUser.colsLocal.length;
            for(var i=0;i<count;i++)
            {
                var arr1=roomUser.colsLocal[i];
                var a1=arr1[0];

                for(var j=i+1;j<count;j++)
                {
                    var arr2=roomUser.colsLocal[j];
                    var a2=arr2[0];

                    if(a1.value>a2.value||(a1.value==a2.value&&a1.type<a2.type))
                    {

                        roomUser.colsLocal[i]=arr2;
                        roomUser.colsLocal[j]=arr1;
                        a1=a2;
                        arr1=arr2;
                    }

                }

            }

        }
        else{

            //先显示小字，再大字

            var size=fourArray.length;
            cc.log("[四张:"+size+"]");
            for(var i=0;i<size;i++)
            {
                var arr=fourArray[i];
                if(arr[0].type!=0)
                {
                    roomUser.colsLocal.push(arr);
                }

            }

            size=threeArray.length;
            cc.log("[三张:"+size+"]");
            for(var i=0;i<size;i++)
            {
                var arr=threeArray[i];
                if(arr[0].type!=0)
                {
                    roomUser.colsLocal.push(arr);
                }

            }

            size=two_7_array.length;
            cc.log("[二七十:"+size+"]");
            for(var i=0;i<size;i++)
            {
                var arr=two_7_array[i];
                if(arr[0].type!=0)
                {
                    roomUser.colsLocal.push(arr);
                }
            }


            size=one_two_three.length;
            cc.log("[123:"+size+"]");
            for(var i=0;i<size;i++)
            {
                var arr=one_two_three[i];
                roomUser.colsLocal.push(arr);
            }

            size=daxiaosandaArray.length;
            cc.log("[大小三搭:"+size+"]");
            for(var i=0;i<size;i++)
            {
                var arr=daxiaosandaArray[i];
                if(arr[0].type!=0)
                {
                    roomUser.colsLocal.push(arr);
                }
            }

            size=shunziArray.length;
            cc.log("[顺子:"+size+"]");
            for(var i=0;i<size;i++)
            {
                var arr=shunziArray[i];
                if(arr[0].type!=0)
                {
                    roomUser.colsLocal.push(arr);
                }
            }

            size=towArray.length;
            cc.log("[二张:"+size+"]");
            for(var i=0;i<size;i++)
            {
                var arr=towArray[i];
                if(arr[0].type!=0)
                {
                    roomUser.colsLocal.push(arr);
                }
            }

            size=daxiaoDui.length;
            cc.log("[大小二张:"+size+"]");
            for(var i=0;i<size;i++)
            {
                var arr=daxiaoDui[i];
                roomUser.colsLocal.push(arr);
            }


            size=shunzi2_array.length;
            cc.log("[半顺:"+size+"]");
            for(var i=0;i<size;i++)
            {
                var arr=shunzi2_array[i];
                if(arr[0].type!=0)
                {
                    roomUser.colsLocal.push(arr);
                }
            }

            size=otherArray.length;
            cc.log("[其他:"+size+"]");
            var tmp_arr=[];
            for(var i=0;i<size;i++)
            {
                var c=otherArray[i];

                if(c.type!=0)
                {
                    tmp_arr.push(c);
                }


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




            size=fourArray.length;
            cc.log("[四张:"+size+"]");
            for(var i=0;i<size;i++)
            {
                var arr=fourArray[i];
                if(arr[0].type==0)
                {
                    roomUser.colsLocal.push(arr);
                }

            }

            size=threeArray.length;
            cc.log("[三张:"+size+"]");
            for(var i=0;i<size;i++)
            {
                var arr=threeArray[i];
                if(arr[0].type==0)
                {
                    roomUser.colsLocal.push(arr);
                }

            }

            size=two_7_array.length;
            cc.log("[二七十:"+size+"]");
            for(var i=0;i<size;i++)
            {
                var arr=two_7_array[i];
                if(arr[0].type==0)
                {
                    roomUser.colsLocal.push(arr);
                }
            }

            size=daxiaosandaArray.length;
            cc.log("[大小三搭:"+size+"]");
            for(var i=0;i<size;i++)
            {
                var arr=daxiaosandaArray[i];
                if(arr[0].type==0)
                {
                    roomUser.colsLocal.push(arr);
                }
            }

            size=shunziArray.length;
            cc.log("[顺子:"+size+"]");
            for(var i=0;i<size;i++)
            {
                var arr=shunziArray[i];
                if(arr[0].type==0)
                {
                    roomUser.colsLocal.push(arr);
                }
            }

            size=towArray.length;
            cc.log("[二张:"+size+"]");
            for(var i=0;i<size;i++)
            {
                var arr=towArray[i];
                if(arr[0].type==0)
                {
                    roomUser.colsLocal.push(arr);
                }
            }

            size=shunzi2_array.length;
            cc.log("[半顺:"+size+"]");
            for(var i=0;i<size;i++)
            {
                var arr=shunzi2_array[i];
                if(arr[0].type==0)
                {
                    roomUser.colsLocal.push(arr);
                }
            }

            size=otherArray.length;
            cc.log("[其他:"+size+"]");
            var tmp_arr=[];
            for(var i=0;i<size;i++)
            {
                var c=otherArray[i];

                if(c.type==0)
                {
                    tmp_arr.push(c);
                }


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
        var pos={x:head.x,y:head.y};//head.convertToWorldSpace(cc.p(0,0));
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
            this.resetMyCardPos(roomUser,null,false);
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
        tiObj.actionType=actionType;
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


                if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                {

                        cardSprite=this.getCardSpriteByCardId2(roomUser,card.c_id);

                        if(cardSprite==null)
                        {
                            cardSprite=this.getCardSpriteByCardId(roomUser,card.c_id);

                        }



                }
                else{
                    if(actionType==ACTION_TI2||actionType==ACTION_PAO2)
                    {
                        cardSprite=this.getCardSpriteByCardId2(roomUser,card.c_id);
                    }
                    else{

                        cardSprite=this.getCardSpriteByCardId(roomUser,card.c_id);
                    }
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
                cardSprite.card.flg3=card.flg3;
                cardSprite.card.index=card.index;
                cardSprite.card.uid=card.uid;

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

                if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                {
                    this.resetMyCardPos(roomUser,null,false);
                }
            }
            else{
                this.moveRoomUserCardSprite(roomUser,tiObj.groupCards,2);
            }

            //cc.log("tiObj.groupCards.length:"+this.tiQueue.length+","+this.tiNext);
        }

    },
    actionKeTi:function (player,action) {

        cc.log("#0:"+action.type);
        this.showSelectedButton(player,action);
    },
    actionTi:function (player,action) {

        this.buildMoveAction(player,action,ACTION_TI);
        this.showWorld(WORLD_TI,player.uid);


        this.putCardByType=ACTION_TI;


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
    actionKeTi2:function (player,action) {

        this.putCardByType=ACTION_TI2;

        this.showSelectedButton(player,action);
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
    actionKePao:function (player,action) {

        this.showSelectedButton(player,action);
    },

    actionPao:function (player,action) {

        this.buildMoveAction(player,action,ACTION_PAO);
        this.showWorld(WORLD_PAO,player.uid);

        this.putCardByType=ACTION_PAO;

        var roomUser=this.getRoomUserByUID(player.uid);
        if(roomUser.user.sex==1)
        {
            playEffect(operSound.pao.v);
        }
        else{
            playEffect(operSound.pao.n);
        }
    },
    actionKePao2:function (player,action) {

        this.showSelectedButton(player,action);
    },
    actionSiShou:function(player,action)
    {
        this.showWorld(WORLD_SISHOU,player.uid);

        playEffect(operSound.sishou.n);

    },
    actionKeJuShou:function(player,action)
    {
        this.showSelectedButton(player,action);
    },
    actionJuShou:function(player,action)
    {
        var roomUser=this.getRoomUserByUID(player.uid);
        var uiPos=this.getRoomUserUIPos(roomUser);

        var pos=this.getHeadPos(roomUser,0,0);
        var h=70;
        if(uiPos==BOTTOM_UI)
        {
            pos.y+=h;

        }
        else if(uiPos==RIGHT_UI)
        {
            pos.y+=h;
        }
        else if(uiPos==LEFT_UI)
        {
            pos.y-=h;
        }
        else if(uiPos==TOP_UI)
        {
            pos.y-=h;
        }

        var sp=new cc.Sprite("res/ui/room_fucheng/jushou_tip.png");
        sp.x=pos.x;
        sp.y=pos.y;
        roomUser.node.addChild(sp);
        this.tmpNodeArr.push(sp);

        this.showWorld(WORLD_JUSHOU,player.uid);
    },
    actionPao2:function (player,action) {

        this.buildMoveAction(player,action,ACTION_PAO2);
        this.showWorld(WORLD_PAO,player.uid);

        this.putCardByType=ACTION_PAO2;

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

        if(uid==myPlayerInfo.uid)
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



        if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
        {
            if(this.roomObj.roomState==ROOM_WAIT_PUT_STATE&&this.roomObj.uid==myPlayerInfo.uid)
            {
                this.removeClock(null);
                this.hasSendPutCard=false;
                this.roomObj.roomState=ROOM_GAMEING_STATE;
                if(this.shouSp!=undefined&&this.shouSp!=null)
                {
                    this.shouSp.removeFromParent(true);
                    this.shouSp=null;

                    if(this.outPutButton!=null&&this.outPutButton!=undefined)
                    {
                        this.outPutButton.removeFromParent(true);
                        this.outPutButton=null;
                    }

                }
                if(this.selectedCard!=null)
                {
                    this.selectedCard.clearColor();
                    this.selectedCard=null;
                }

            }

        }
    },
    showSelectedButton:function (player,action) {


        if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
        {
            if(action.type3.length>0&&action.type3[0]==-1)
            {
                this.showSelectedButton2(player,action);
                return;
            }

        }


        var width_button=120;

        if(player.uid==myPlayerInfo.uid)
        {


            if(this.selectedLayer==undefined||this.selectedLayer==null)
            {

                //cc.log("#1");

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
                    button.loadTextures("res/ui/room_fucheng/close_room.png","res/ui/room_fucheng/close_room.png","res/ui/room_fucheng/close_room.png");
                    button.setScale(0.8);
                    button.addTouchEventListener(this.selCloseClicked.bind(this),this);
                    button.x=-this.selectedLayer.count*width_button;
                    this.selectedLayer.count++;
                    this.selectedLayer.addChild(button);

                    this.guoButton=button;
                    this.guoButton.action=null;
                }


                this.myState=1;


            }

            if(action.type==ACTION_KE_TI)
            {
                //cc.log("#3");
                if(this.selectedLayer.hasKeTi==undefined)
                {
                   // cc.log("#4");

                    this.keTiAction=action;

                    this.selectedLayer.hasKeTi=true;




                    if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                    {

                        if(this.selectedLayer.hasKePao==undefined&&this.selectedLayer.hasKePao2==undefined)
                        {
                            var button = new ccui.Button();
                            button.setTouchEnabled(true);
                            button.setPressedActionEnabled(true);
                            button.loadTextures("res/ui/room_fucheng/qing_room.png","res/ui/room_fucheng/qing_room.png","res/ui/room_fucheng/qing_room.png");
                            button.setScale(0.8);
                            button.addTouchEventListener(this.liuClicked.bind(this),this);
                            button.x=-this.selectedLayer.count*width_button;
                            this.selectedLayer.count++;
                            this.selectedLayer.addChild(button);
                        }

                    }
                    else{
                        var button = new ccui.Button();
                        button.setTouchEnabled(true);
                        button.setPressedActionEnabled(true);
                        button.loadTextures("res/ui/room_fucheng/qing_room.png","res/ui/room_fucheng/qing_room.png","res/ui/room_fucheng/qing_room.png");
                        button.setScale(0.8);
                        button.addTouchEventListener(this.tiClicked.bind(this),this);
                        button.x=-this.selectedLayer.count*width_button;
                        this.selectedLayer.count++;
                        this.selectedLayer.addChild(button);
                    }


                }


            }
            else if(action.type==ACTION_KE_TI2)
            {
                if(this.selectedLayer.hasKeTi2==undefined)
                {
                    this.keTiAction=action;

                    this.selectedLayer.hasKeTi2=true;


                    if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                    {

                        if(this.selectedLayer.hasKePao==undefined&&this.selectedLayer.hasKePao2==undefined)
                        {
                            var button = new ccui.Button();
                            button.setTouchEnabled(true);
                            button.setPressedActionEnabled(true);
                            button.loadTextures("res/ui/room_fucheng/qing_room.png","res/ui/room_fucheng/qing_room.png","res/ui/room_fucheng/qing_room.png");
                            button.setScale(0.8);
                            button.addTouchEventListener(this.liuClicked.bind(this),this);
                            button.x=-this.selectedLayer.count*width_button;
                            this.selectedLayer.count++;
                            this.selectedLayer.addChild(button);
                        }

                    }
                    else{

                        var button = new ccui.Button();
                        button.setTouchEnabled(true);
                        button.setPressedActionEnabled(true);
                        button.loadTextures("res/ui/room_fucheng/qing_room.png","res/ui/room_fucheng/qing_room.png","res/ui/room_fucheng/qing_room.png");
                        button.setScale(0.8);
                        button.addTouchEventListener(this.tiClicked.bind(this),this);
                        button.x=-this.selectedLayer.count*width_button;
                        this.selectedLayer.count++;
                        this.selectedLayer.addChild(button);
                    }

                }


            }
            else  if(action.type==ACTION_KE_PAO)
            {
                if(this.selectedLayer.hasKePao==undefined)
                {
                    this.kePaoAction=action;

                    this.selectedLayer.hasKePao=true;

                    if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                    {

                        if(this.selectedLayer.hasKeTi==undefined&&this.selectedLayer.hasKeTi2==undefined)
                        {

                            var button = new ccui.Button();
                            button.setTouchEnabled(true);
                            button.setPressedActionEnabled(true);
                            button.loadTextures("res/ui/room_fucheng/piao_room.png","res/ui/room_fucheng/piao_room.png","res/ui/room_fucheng/piao_room.png");
                            button.setScale(0.8);
                            button.addTouchEventListener(this.liuClicked.bind(this),this);
                            button.x=-this.selectedLayer.count*width_button;
                            this.selectedLayer.count++;
                            this.selectedLayer.addChild(button);

                        }

                    }
                    else{

                        var button = new ccui.Button();
                        button.setTouchEnabled(true);
                        button.setPressedActionEnabled(true);
                        button.loadTextures("res/ui/room_fucheng/piao_room.png","res/ui/room_fucheng/piao_room.png","res/ui/room_fucheng/piao_room.png");
                        button.setScale(0.8);
                        button.addTouchEventListener(this.paoClicked.bind(this),this);
                        button.x=-this.selectedLayer.count*width_button;
                        this.selectedLayer.count++;
                        this.selectedLayer.addChild(button);
                    }


                }


            }
            else  if(action.type==ACTION_KE_PAO2)
            {
                if(this.selectedLayer.hasKePao2==undefined)
                {
                    this.kePaoAction=action;

                    this.selectedLayer.hasKePao2=true;

                    if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                    {

                        if(this.selectedLayer.hasKeTi==undefined&&this.selectedLayer.hasKeTi2==undefined)
                        {

                            var button = new ccui.Button();
                            button.setTouchEnabled(true);
                            button.setPressedActionEnabled(true);
                            button.loadTextures("res/ui/room_fucheng/piao_room.png","res/ui/room_fucheng/piao_room.png","res/ui/room_fucheng/piao_room.png");
                            button.setScale(0.8);
                            button.addTouchEventListener(this.liuClicked.bind(this),this);
                            button.x=-this.selectedLayer.count*width_button;
                            this.selectedLayer.count++;
                            this.selectedLayer.addChild(button);

                        }

                    }
                    else{
                        var button = new ccui.Button();
                        button.setTouchEnabled(true);
                        button.setPressedActionEnabled(true);
                        button.loadTextures("res/ui/room_fucheng/piao_room.png","res/ui/room_fucheng/piao_room.png","res/ui/room_fucheng/piao_room.png");
                        button.setScale(0.8);
                        button.addTouchEventListener(this.paoClicked.bind(this),this);
                        button.x=-this.selectedLayer.count*width_button;
                        this.selectedLayer.count++;
                        this.selectedLayer.addChild(button);
                    }

                }


            }
            else if(action.type==ACTION_KE_WEI)
            {
                if(this.selectedLayer.hasWei==undefined)
                {
                    this.keWeiAction=action;

                    this.selectedLayer.hasWei=true;
                    var button = new ccui.Button();
                    button.setTouchEnabled(true);
                    button.setPressedActionEnabled(true);
                    button.loadTextures("res/ui/room_fucheng/wai_room.png","res/ui/room_fucheng/wai_room.png","res/ui/room_fucheng/wai_room.png");
                    button.setScale(0.8);
                    button.addTouchEventListener(this.weiClicked.bind(this),this);
                    button.x=-this.selectedLayer.count*width_button;
                    this.selectedLayer.count++;
                    this.selectedLayer.addChild(button);
                }

            }
            else if(action.type==ACTION_KECHI)
            {
                if(this.selectedLayer.hasChi==undefined)
                {
                    this.keChiAction=action;

                    this.selectedLayer.hasChi=true;
                    var button = new ccui.Button();
                    button.setTouchEnabled(true);
                    button.setPressedActionEnabled(true);
                    button.loadTextures("res/ui/room_fucheng/chi_room.png","res/ui/room_fucheng/chi_room.png","res/ui/room_fucheng/chi_room.png");
                    button.setScale(0.8);
                    button.addTouchEventListener(this.chiClicked.bind(this),this);
                    button.x=-this.selectedLayer.count*width_button;
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
                    button.loadTextures("res/ui/room_fucheng/peng_room.png","res/ui/room_fucheng/peng_room.png","res/ui/room_fucheng/peng_room.png");
                    button.setScale(0.8);
                    button.addTouchEventListener(this.pengClicked.bind(this),this);
                    button.x=-this.selectedLayer.count*width_button;
                    this.selectedLayer.count++;
                    this.selectedLayer.addChild(button);

                    cc.log("碰x:"+button.x);
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
                    button.loadTextures("res/ui/room_fucheng/hu_room.png","res/ui/room_fucheng/hu_room.png","res/ui/room_fucheng/hu_room.png");
                    button.setScale(0.8);
                    button.addTouchEventListener(this.huClicked.bind(this),this);
                    button.x=-this.selectedLayer.count*width_button;
                    this.selectedLayer.count++;
                    this.selectedLayer.addChild(button);

                    cc.log("胡x:"+button.x);
                }
                if(action.type==ACTION_KEHU)
                {
                    this.guoButton.action=action;
                }

            }
            else if(action.type==ACTION_KE_BAOPAI)
            {
                if(this.selectedLayer.hasBaoPai==undefined)
                {

                    this.selectedLayer.hasBaoPai=true;
                    var button = new ccui.Button();
                    button.setTouchEnabled(true);
                    button.setPressedActionEnabled(true);
                    button.loadTextures("res/ui/room_fucheng/baopai_room.png","res/ui/room_fucheng/baopai_room.png","res/ui/room_fucheng/baopai_room.png");
                    button.setScale(0.8);
                    button.addTouchEventListener(this.baoPaiClicked.bind(this),this);
                    button.x=-this.selectedLayer.count*width_button;
                    this.selectedLayer.count++;
                    this.selectedLayer.addChild(button);
                }

            }
            else if(action.type==ACTION_KE_JU_SHOU)
            {
                if(this.selectedLayer.hasJuShou==undefined)
                {

                    this.selectedLayer.hasJuShou=true;
                    var button = new ccui.Button();
                    button.setTouchEnabled(true);
                    button.setPressedActionEnabled(true);
                    button.loadTextures("res/ui/room_fucheng/jushou_room.png","res/ui/room_fucheng/jushou_room.png","res/ui/room_fucheng/jushou_room.png");
                    button.setScale(0.8);
                    button.addTouchEventListener(this.juShouClicked.bind(this),this);
                    button.x=-this.selectedLayer.count*width_button;
                    this.selectedLayer.count++;
                    this.selectedLayer.addChild(button);
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

        //this.showClock(player,ROOM_WAIT_SELECTED_STATE);


    },

    showSelectedButton2:function (player,action) {

        console.log("[showSelectedButton2 enter]");

        var width_button=120;

        if(player.uid==myPlayerInfo.uid)
        {


            if(this.selectedLayer==undefined||this.selectedLayer==null)
            {

                this.selectedLayer=new cc.Layer();
                this.addChild(this.selectedLayer,TABLE_DESKER_ZOEDER);
                this.selectedLayer.count=0;
                this.selectedLayer.x=v_x+v_w-100;
                this.selectedLayer.y=v_y+300;
            }

            if(action.type==ACTION_KE_TI)
            {
                //cc.log("#3");
                if(this.selectedLayer.hasKeTi==undefined)
                {
                    // cc.log("#4");

                    this.keTiAction=action;

                    this.selectedLayer.hasKeTi=true;


                    if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                    {

                        if(this.selectedLayer.hasKePao==undefined&&this.selectedLayer.hasKePao2==undefined)
                        {
                            var button = new ccui.Button();
                            button.setTouchEnabled(true);
                            button.setPressedActionEnabled(true);
                            button.loadTextures("res/ui/room_fucheng/qing_room.png","res/ui/room_fucheng/qing_room.png","res/ui/room_fucheng/qing_room.png");
                            button.setScale(0.8);
                            button.addTouchEventListener(this.liuClicked.bind(this),this);
                            button.x=-this.selectedLayer.count*width_button;
                            this.selectedLayer.count++;
                            this.selectedLayer.addChild(button);
                        }

                    }
                    else{
                        var button = new ccui.Button();
                        button.setTouchEnabled(true);
                        button.setPressedActionEnabled(true);
                        button.loadTextures("res/ui/room_fucheng/qing_room.png","res/ui/room_fucheng/qing_room.png","res/ui/room_fucheng/qing_room.png");
                        button.setScale(0.8);
                        button.addTouchEventListener(this.tiClicked.bind(this),this);
                        button.x=-this.selectedLayer.count*width_button;
                        this.selectedLayer.count++;
                        this.selectedLayer.addChild(button);
                    }

                }


            }
            else if(action.type==ACTION_KE_TI2)
            {
                if(this.selectedLayer.hasKeTi2==undefined)
                {
                    this.keTiAction=action;

                    this.selectedLayer.hasKeTi2=true;

                    if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                    {

                        if(this.selectedLayer.hasKePao==undefined&&this.selectedLayer.hasKePao2==undefined)
                        {
                            var button = new ccui.Button();
                            button.setTouchEnabled(true);
                            button.setPressedActionEnabled(true);
                            button.loadTextures("res/ui/room_fucheng/qing_room.png","res/ui/room_fucheng/qing_room.png","res/ui/room_fucheng/qing_room.png");
                            button.setScale(0.8);
                            button.addTouchEventListener(this.liuClicked.bind(this),this);
                            button.x=-this.selectedLayer.count*width_button;
                            this.selectedLayer.count++;
                            this.selectedLayer.addChild(button);
                        }

                    }
                    else{
                        var button = new ccui.Button();
                        button.setTouchEnabled(true);
                        button.setPressedActionEnabled(true);
                        button.loadTextures("res/ui/room_fucheng/qing_room.png","res/ui/room_fucheng/qing_room.png","res/ui/room_fucheng/qing_room.png");
                        button.setScale(0.8);
                        button.addTouchEventListener(this.tiClicked.bind(this),this);
                        button.x=-this.selectedLayer.count*width_button;
                        this.selectedLayer.count++;
                        this.selectedLayer.addChild(button);
                    }

                }


            }
            else  if(action.type==ACTION_KE_PAO)
            {
                if(this.selectedLayer.hasKePao==undefined)
                {
                    this.kePaoAction=action;

                    this.selectedLayer.hasKePao=true;
                    if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                    {

                        if(this.selectedLayer.hasKeTi==undefined&&this.selectedLayer.hasKeTi2==undefined)
                        {

                            var button = new ccui.Button();
                            button.setTouchEnabled(true);
                            button.setPressedActionEnabled(true);
                            button.loadTextures("res/ui/room_fucheng/piao_room.png","res/ui/room_fucheng/piao_room.png","res/ui/room_fucheng/piao_room.png");
                            button.setScale(0.8);
                            button.addTouchEventListener(this.liuClicked.bind(this),this);
                            button.x=-this.selectedLayer.count*width_button;
                            this.selectedLayer.count++;
                            this.selectedLayer.addChild(button);

                        }

                    }
                    else{
                        var button = new ccui.Button();
                        button.setTouchEnabled(true);
                        button.setPressedActionEnabled(true);
                        button.loadTextures("res/ui/room_fucheng/piao_room.png","res/ui/room_fucheng/piao_room.png","res/ui/room_fucheng/piao_room.png");
                        button.setScale(0.8);
                        button.addTouchEventListener(this.paoClicked.bind(this),this);
                        button.x=-this.selectedLayer.count*width_button;
                        this.selectedLayer.count++;
                        this.selectedLayer.addChild(button);
                    }

                }


            }
            else  if(action.type==ACTION_KE_PAO2)
            {
                if(this.selectedLayer.hasKePao2==undefined)
                {
                    this.kePaoAction=action;

                    this.selectedLayer.hasKePao2=true;

                    if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                    {

                        if(this.selectedLayer.hasKeTi==undefined&&this.selectedLayer.hasKeTi2==undefined)
                        {

                            var button = new ccui.Button();
                            button.setTouchEnabled(true);
                            button.setPressedActionEnabled(true);
                            button.loadTextures("res/ui/room_fucheng/piao_room.png","res/ui/room_fucheng/piao_room.png","res/ui/room_fucheng/piao_room.png");
                            button.setScale(0.8);
                            button.addTouchEventListener(this.liuClicked.bind(this),this);
                            button.x=-this.selectedLayer.count*width_button;
                            this.selectedLayer.count++;
                            this.selectedLayer.addChild(button);

                        }

                    }
                    else{
                        var button = new ccui.Button();
                        button.setTouchEnabled(true);
                        button.setPressedActionEnabled(true);
                        button.loadTextures("res/ui/room_fucheng/piao_room.png","res/ui/room_fucheng/piao_room.png","res/ui/room_fucheng/piao_room.png");
                        button.setScale(0.8);
                        button.addTouchEventListener(this.paoClicked.bind(this),this);
                        button.x=-this.selectedLayer.count*width_button;
                        this.selectedLayer.count++;
                        this.selectedLayer.addChild(button);
                    }

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
                    button.loadTextures("res/ui/room_fucheng/hu_room.png","res/ui/room_fucheng/hu_room.png","res/ui/room_fucheng/hu_room.png");
                    button.setScale(0.8);
                    button.addTouchEventListener(this.huClicked.bind(this),this);
                    button.x=-this.selectedLayer.count*width_button;
                    this.selectedLayer.count++;
                    this.selectedLayer.addChild(button);

                    cc.log("胡x:"+button.x);
                }


            }



        }

        this.excuteActionCount--;
        if(this.excuteActionCount<0)
        {
            this.excuteActionCount=0;
        }

    },

    headClicked:function (sender, type) {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                var uid=sender.uid;
                cc.log("[头像 clicked,uid:"+uid+"]");
                var roomUser=this.getRoomUserByUID(uid);
                var layer=new InfoLayer(this,roomUser);
                this.addChild(layer,TABLE_DESKER_ZOEDER+5);
                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }

    },
    baoPaiClicked:function (sender, type) {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {

                cc.log("[爆牌 clicked]");

                var req=new OperateCardRequest();
                req.uid=myPlayerInfo.uid;
                req.roomId=this.roomInfo.roomId;
                req.type=3;//0:碰,1:吃,2:胡,3:爆牌
                req.flowsId=this.currentFlowsId;
                socketMgr.socket2.send(OPERATE_CARD_REQUEST,req);

              
                this.hideSlectedButton(req.uid);

                playEffect(TOUCH_SOUND);

            }
                break;


            default:
                break;
        }

    },
    juShouClicked:function (sender, type) {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                cc.log("[举手 clicked]");
                var req=new OperateCardRequest();
                req.uid=myPlayerInfo.uid;
                req.roomId=this.roomInfo.roomId;
                req.type=7;//0:碰,1:吃,2:胡,3:爆牌,7:举手
                req.flowsId=this.currentFlowsId;
                socketMgr.socket2.send(OPERATE_CARD_REQUEST,req);

                this.hideSlectedButton(req.uid);

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
                req.uid=myPlayerInfo.uid;
                req.roomId=this.roomInfo.roomId;
                req.type=2;//0:碰,1:吃,2:胡
                req.flowsId=this.currentFlowsId;
                socketMgr.socket2.send(OPERATE_CARD_REQUEST,req);

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
                req.uid=myPlayerInfo.uid;
                req.roomId=this.roomInfo.roomId;;
                req.type=0;//0:碰,1:吃,2:胡
                req.flowsId=this.currentFlowsId;
                socketMgr.socket2.send(OPERATE_CARD_REQUEST,req);

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

    liuClicked:function (sender, type) {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                cc.log("[溜]");


                var liuAction=null;
                if(this.selectedLayer.hasKeTi!=undefined||this.selectedLayer.hasKeTi2!=undefined)
                {
                    liuAction=this.keTiAction;
                    var groupCards=this.keTiAction.groupCards;
                    var count=groupCards.length;
                    for(var i=0;i<count;i++)
                    {
                        var groudCard=groupCards[i];
                        groudCard.sendReqType=4;

                    }

                    cc.log("[溜-清");

                }


                if(this.selectedLayer.hasKePao!=undefined||this.selectedLayer.hasKePao2!=undefined)
                {

                    if(liuAction==null)
                    {
                        liuAction=this.kePaoAction;
                        var groupCards=this.kePaoAction.groupCards;
                        var count=groupCards.length;
                        for(var i=0;i<count;i++)
                        {
                            var groudCard=groupCards[i];
                            groudCard.sendReqType=5;

                        }
                    }
                    else{


                        var groupCards=this.kePaoAction.groupCards;
                        var count=groupCards.length;
                        for(var i=0;i<count;i++)
                        {
                            var groudCard=groupCards[i];
                            groudCard.sendReqType=5;

                            liuAction.groupCards.push(groudCard);

                        }

                    }

                    cc.log("[溜-飘");

                }


                if(liuAction==null)
                {
                    cc.log("liuAction===null!!!!");
                }

                if(liuAction.groupCards.length==1)
                {
                    var groudCard = liuAction.groupCards[0];
                    var cards = groudCard.cards;

                    var req=new OperateCardRequest();
                    req.uid=myPlayerInfo.uid;
                    req.roomId=this.roomInfo.roomId;
                    req.type=groudCard.sendReqType;
                    var count = cards.length;
                    for (var j = 0; j < count; j++) {
                        var card = cards[j];
                        req.cardIds.push(card.c_id);
                    }
                    req.flowsId=this.currentFlowsId;
                    socketMgr.socket2.send(OPERATE_CARD_REQUEST,req);


                    this.hideSlectedButton(req.uid);
                }
                else{

                    if(this.chiLayer==undefined||this.chiLayer==null)
                    {
                        var roomUser=this.getRoomUserByUID(myPlayerInfo.uid);
                        this.chiLayer=new ChiLayer(this.sceneId,this.roomInfo,roomUser,liuAction,this.getRoomCurrentCard(),this);
                        this.addChild(this.chiLayer,TABLE_DESKER_ZOEDER);

                        this.chiLayer.x=v_x+v_w-400;
                        this.chiLayer.y=v_y+v_h-200;

                        // playEffect(TOUCH_SOUND);

                    }

                }



                playEffect(TOUCH_SOUND);


            }
                break;


            default:
                break;
        }

    },

    tiClicked:function (sender, type) {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                cc.log("[提]");

                // var req=new OperateCardRequest();
                // req.uid=myPlayerInfo.uid;
                // req.roomId=this.roomInfo.roomId;;
                // req.type=4;//0:碰,1:吃,2:胡,3:爆牌 4:提,5:跑
                // req.flowsId=this.currentFlowsId;
                // socketMgr.socket.send(OPERATE_CARD_REQUEST,req);
                //
                //
                // this.hideSlectedButton(req.uid);

                var groupCards=this.keTiAction.groupCards;
                if(groupCards.length==1)
                {
                    var groudCard = groupCards[0];
                    var cards = groudCard.cards;

                    var req=new OperateCardRequest();
                    req.uid=myPlayerInfo.uid;
                    req.roomId=this.roomInfo.roomId;
                    req.type=4;
                    var count = cards.length;
                    for (var j = 0; j < count; j++) {
                        var card = cards[j];
                        req.cardIds.push(card.c_id);
                    }
                    req.flowsId=this.currentFlowsId;
                    socketMgr.socket2.send(OPERATE_CARD_REQUEST,req);


                    this.hideSlectedButton(req.uid);
                }
                else{

                    if(this.chiLayer==undefined||this.chiLayer==null)
                    {
                        var roomUser=this.getRoomUserByUID(myPlayerInfo.uid);
                        this.chiLayer=new ChiLayer(this.sceneId,this.roomInfo,roomUser,this.keTiAction,this.getRoomCurrentCard(),this);
                        this.addChild(this.chiLayer,TABLE_DESKER_ZOEDER);

                        this.chiLayer.x=v_x+v_w-400;
                        this.chiLayer.y=v_y+v_h-200;

                        // playEffect(TOUCH_SOUND);

                    }

                }



                playEffect(TOUCH_SOUND);


            }
                break;


            default:
                break;
        }

    },
    paoClicked:function (sender, type) {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                cc.log("[跑]");

                //var req=new OperateCardRequest();
                //req.uid=myPlayerInfo.uid;
                //req.roomId=this.roomInfo.roomId;;
                //req.type=5;//0:碰,1:吃,2:胡,3:爆牌 4:提,5:跑
                //req.flowsId=this.currentFlowsId;
                //socketMgr.socket.send(OPERATE_CARD_REQUEST,req);

                var groupCards=this.kePaoAction.groupCards;
                if(groupCards.length==1)
                {
                    var groudCard = groupCards[0];
                    var cards = groudCard.cards;

                    var req=new OperateCardRequest();
                    req.uid=myPlayerInfo.uid;
                    req.roomId=this.roomInfo.roomId;
                    req.type=5;
                    var count = cards.length;
                    for (var j = 0; j < count; j++) {
                        var card = cards[j];
                        req.cardIds.push(card.c_id);
                    }
                    req.flowsId=this.currentFlowsId;
                    socketMgr.socket2.send(OPERATE_CARD_REQUEST,req);


                    this.hideSlectedButton(req.uid);
                }
                else{
                    if(this.chiLayer==undefined||this.chiLayer==null)
                    {
                        var roomUser=this.getRoomUserByUID(myPlayerInfo.uid);
                        this.chiLayer=new ChiLayer(this.sceneId,this.roomInfo,roomUser,this.kePaoAction,this.getRoomCurrentCard(),this);
                        this.addChild(this.chiLayer,TABLE_DESKER_ZOEDER);

                        this.chiLayer.x=v_x+v_w-400;
                        this.chiLayer.y=v_y+v_h-200;


                    }

                }






              //

                playEffect(TOUCH_SOUND);


            }
                break;


            default:
                break;
        }

    },
    weiClicked:function (sender, type) {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                cc.log("[歪]");

                var req=new OperateCardRequest();
                req.uid=myPlayerInfo.uid;
                req.roomId=this.roomInfo.roomId;;
                req.type=6;//0:碰,1:吃,2:胡,3:爆牌 4:提,5:跑,6:歪
                req.flowsId=this.currentFlowsId;
                socketMgr.socket2.send(OPERATE_CARD_REQUEST,req);
                
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
                    var roomUser=this.getRoomUserByUID(myPlayerInfo.uid);
                    this.chiLayer=new ChiLayer(this.sceneId,this.roomInfo,roomUser,this.keChiAction,this.getRoomCurrentCard(),this);
                    this.addChild(this.chiLayer,TABLE_DESKER_ZOEDER);

                    this.chiLayer.x=v_x+v_w-400;
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
                        req.uid=myPlayerInfo.uid;
                        req.roomId=this.roomInfo.roomId;
                        req.flowsId=this.currentFlowsId;
                        socketMgr.socket2.send(PASS_OPERATE_REQUEST,req);
                        this.hideSlectedButton(req.uid);
                    }
                }
                else{
                    var req=new PassOperateRequest();
                    req.uid=myPlayerInfo.uid;
                    req.roomId=this.roomInfo.roomId;;
                    req.flowsId=this.currentFlowsId;
                    socketMgr.socket2.send(PASS_OPERATE_REQUEST,req);
                    this.hideSlectedButton(req.uid);
                }



                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }

    },
    chuPaiClicked:function(sender, type)
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

                if(this.selectedCard==null||this.selectedCard==undefined)
                {
                    return;
                }
                if(!this.selectedCard.isRed2())
                {
                    return;
                }

                var req=new PutCardRequest();
                req.uid=myPlayerInfo.uid;
                req.roomId=this.roomInfo.roomId;
                req.c_id=this.selectedCard.card.c_id;
                socketMgr.socket2.send(PUT_CARD_REQUEST,req);

                this.showSelectedCard(this.selectedCard);

                this.hasSendPutCard=true;



                this.hasPutCard();


                this.selectedCard.clearColor();
                this.selectedCard=null;

                if(this.outPutButton!=null&&this.outPutButton!=undefined)
                {
                    this.outPutButton.removeFromParent(true);
                    this.outPutButton=null;
                }


                if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                {
                    this.hideSlectedButton(myPlayerInfo.uid);
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
                    req.uid=myPlayerInfo.uid;
                    req.roomId=this.roomInfo.roomId;
                    req.flowsId=this.currentFlowsId;
                    socketMgr.socket2.send(PASS_OPERATE_REQUEST,req);
                    this.hideSlectedButton(req.uid);
                }
                else if(type==2)
                {



                    var pos=this.getRoomUserShowCardPos(this.selectedCard.uid);

                    this.selectedCard.x=pos.x;
                    this.selectedCard.y=pos.y;

                    var req=new PutCardRequest();
                    req.uid=myPlayerInfo.uid;
                    req.roomId=this.roomInfo.roomId;
                    req.c_id=this.selectedCard.card.c_id;
                    cc.log("[发送出牌请求c_id:"+req.c_id+"]");
                    socketMgr.socket2.send(PUT_CARD_REQUEST,req);

                    this.showSelectedCard(this.selectedCard);

                    this.hasSendPutCard=true;

                    if(this.outPutButton!=null&&this.outPutButton!=undefined)
                    {
                        this.outPutButton.removeFromParent(true);
                        this.outPutButton=null;
                    }

                    this.hasPutCard();

                    this.selectedCard.clearColor();
                    this.selectedCard=null;


                    if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                    {
                        this.hideSlectedButton(myPlayerInfo.uid);
                    }

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
                    this.selectedCard.changeToSmall();
                    this.selectedCard.clearColor();
                    this.selectedCard=null;

                }
                playEffect(TOUCH_SOUND);

            }
                break;


            default:
                break;
        }

    },
    actionKeChi:function (player,action) {

        this.showSelectedButton(player,action);
    },
    actionChi:function (player,action) {

        this.buildMoveAction(player,action,ACTION_CHI);

        this.putCardByType=ACTION_CHI;

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

        this.showSelectedButton(player,action);
    },
    actionKeHu2:function (player,action) {

        if(KEHU2_AUTO_REQ==1)
        {
            if(player.uid==myPlayerInfo.uid)
            {

                var req=new OperateCardRequest();
                req.uid=myPlayerInfo.uid;
                req.roomId=this.roomInfo.roomId;
                req.type=2;//0:碰,1:吃,2:胡
                req.flowsId=this.currentFlowsId;
                socketMgr.socket2.send(OPERATE_CARD_REQUEST,req);
                this.hideSlectedButton(req.uid);

                playEffect(TOUCH_SOUND);
            }
        }
        else{
            this.showSelectedButton(player,action);
        }

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
            else if(RULE_VALUE==ROOM_TYPE_BOPI){
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
            else if(RULE_VALUE==ROOM_TYPE_BOPI){
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
            else if(RULE_VALUE==ROOM_TYPE_BOPI){
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





    },
    actionHuangZhuang:function (player,action) {

        this.showWorld(WORLD_HUANGZHUANG,player.uid);

    },
    actionNo:function (player,action) {


        //0:,1:天胡,2:地胡,3:自摸胡,4:脱庄,5:闲加分
        if(action.type2==4)
        {
            var roomUser=this.getRoomUserByUID(player.uid);
            if(myPlayerInfo.uid!=player.uid)
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
    actionTakeIn2:function (player,action)
    {
        var roomUser=this.getRoomUserByUID(player.uid);

        roomUser.cardSpriesLocal.push(this.roomInfo.currentCard);
        this.card21ActionFinishedCallBack(this.roomInfo.currentCard);

    },
    actionTouchCard2:function (player,action)
    {

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
                var scl=cardSprite.getSpScale();
                cardSprite.x=v_x+v_w/2;
                cardSprite.y=v_y+v_h/2;
                cardSprite.uid=roomUser.user.uid;
                cardSprite.setScl(0);
                cardSprite.setTag(CARD_SPRITE_TAG);

                cardSprite.setLight(true);

                this.addChild(cardSprite,TABLE_DESKER_ZOEDER);

                var pos=this.getRoomUserShowCardPos(cardSprite.uid);

                var delayAction=cc.delayTime(DELEAY_T+DELEAY_TEST);
                var moveAction = cc.moveTo(0.1+DELEAY_TEST, pos);
                var actionCallbackFunction = cc.callFunc(this.touchCard2ActionFinishedCallBack, this, cardSprite);
                var actionArray=[];
                actionArray.push(moveAction);
                actionArray.push(delayAction);
                actionArray.push(actionCallbackFunction);
                var actionSequence = cc.sequence(actionArray);
                cardSprite.runAction(actionSequence);

                var scaleTo=cc.scaleTo(0.1,scl);
                cardSprite.runActionWithSp(scaleTo);

                this.subAndUpdateDeskLeftCount();





                break;
            }



        }


    },
    touchCard2ActionFinishedCallBack:function (cardSprite) {

        this.roomInfo.currentCard=cardSprite;

        this.releaseActionCount("最后一张牌移动完成");


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
                var scl=cardSprite.getSpScale();
                cardSprite.x=v_x+v_w/2;
                cardSprite.y=v_y+v_h/2;
                cardSprite.uid=roomUser.user.uid;
                cardSprite.setScl(0);
                cardSprite.setTag(CARD_SPRITE_TAG);

                cardSprite.setLight(true);

                this.addChild(cardSprite,TABLE_DESKER_ZOEDER);

                var pos=this.getRoomUserShowCardPos(cardSprite.uid);

                var delayAction=cc.delayTime(DELEAY_T+DELEAY_TEST);
                var moveAction = cc.moveTo(0.1+DELEAY_TEST, pos);
                var actionCallbackFunction = cc.callFunc(this.card21ActionFinishedCallBack, this, cardSprite);
                var actionArray=[];
                actionArray.push(moveAction);
                actionArray.push(delayAction);
                actionArray.push(actionCallbackFunction);
                var actionSequence = cc.sequence(actionArray);
                cardSprite.runAction(actionSequence);

                var scaleTo=cc.scaleTo(0.1,scl);
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
        if(cardSprite.uid==myPlayerInfo.uid)
        {
            pos=this.resetMyCardPos(roomUser,cardSprite.card,false);
        }
        else{
            pos=this.getHeadPos(roomUser,0,0);
        }

        cc.log("pos:::::::::"+pos.x+","+pos.y);

        // cc.log("####card21ActionFinishedCallBack####:"+pos.x+","+pos.y);
        cardSprite.changeToSmall();
       // cardSprite.setScl(SMALL_CARD_SCL);
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
        this.resetMyCardPos(roomUser,null,false);


    },

    actionKeBaoPai:function (player,action) {

        this.showSelectedButton(player,action);

    },

    actionBaoPai:function (player,action) {


        this.showWorld(WORLD_BAO,player.uid);
        if(player.uid==myPlayerInfo.uid)
        {
            //提示可胡的牌
            this.hupaiTishi.visible=true;
            var tishiBg=this.hupaiTishi;

            var init_x=tishiBg.x+90;
            var init_y=tishiBg.y+25;
            var gap_w=40;
            var gap_h=50;

            var x=init_x;
            var y=init_y;
            var cardCount=0;

            var groupCards=action.groupCards;
            var len=groupCards.length;
            for(var i=0;i<len;i++) {
                var groudCard = groupCards[i];
                var cards = groudCard.cards;
                var count = cards.length;
                for(var j=0;j<count;j++)
                {
                    var card=cards[j];

                    cc.log("可胡牌:"+card.type+","+card.value);

                    var cardSprite=new CardSprite();
                    cardSprite.createCard(card);
                    cardSprite.changeToSmall2();
                    cardSprite.x=x-cardCount*gap_w;
                    cardSprite.y=y;

                    this.hupaiCardSp.push(cardSprite);

                    //cardSprite.setScl(0);

                    tishiBg.getParent().addChild(cardSprite,1);

                    cardCount++;
                    if(cardCount%5==0)
                    {
                        x=init_x;
                        y-=gap_h;
                        cardCount=0;
                    }



                }



            }


        }

        // var roomUser=this.getRoomUserByUID(player.uid);
        // if(roomUser.user.sex==1)
        // {
        //     playEffect(operSound.peng.v);
        // }
        // else{
        //     playEffect(operSound.peng.n);
        // }


    },
    actionKePeng:function (player,action) {

        this.showSelectedButton(player,action);
    },
    actionPeng:function (player,action) {

        this.buildMoveAction(player,action,ACTION_PENG);
        this.showWorld(WORLD_PENG,player.uid);

        this.putCardByType=ACTION_PENG;

        var roomUser=this.getRoomUserByUID(player.uid);
        if(roomUser.user.sex==1)
        {
            playEffect(operSound.peng.v);
        }
        else{
            playEffect(operSound.peng.n);
        }

    },

    actionTouch3:function (player,action) {

        var hasFanXing=false;

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

                this.fanxing_card.push(card);


                if(j==0)
                {


                    var cardSprite=new CardSprite();
                    cardSprite.createCard(card);
                    cardSprite.changeToBig();
                    var scl=cardSprite.getSpScale();
                    cardSprite.x=this.dui.x;//v_x+v_w/2;
                    cardSprite.y=this.dui.y;//v_y+v_h/2;
                    cardSprite.uid=roomUser.user.uid;
                    cardSprite.setScl(0);
                    cardSprite.setTag(CARD_SPRITE_TAG);



                    cardSprite.setLight(true);

                    this.addChild(cardSprite,TABLE_DESKER_ZOEDER);

                    var pos=this.getRoomUserShowCardPos(cardSprite.uid);

                    var delayAction=cc.delayTime(DELEAY_T+DELEAY_TEST);
                    var moveAction = cc.moveTo(0.1+MOVE_DELEAY_T+DELEAY_TEST, pos);
                    var actionCallbackFunction = cc.callFunc(this.touch3ActionFinishedCallBack, this, cardSprite);
                    var actionArray=[];
                    actionArray.push(moveAction);
                    actionArray.push(delayAction);
                    actionArray.push(actionCallbackFunction);
                    var actionSequence = cc.sequence(actionArray);
                    cardSprite.runAction(actionSequence);

                    var scaleTo=cc.scaleTo(0.1,scl);
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


                    hasFanXing=true;


                    playEffect(card_name);
                }


            }




            break;


        }


        if(!hasFanXing)
        {
            this.showFinishedLayer();
            this.releaseActionCount("touch3动作执行完成");
        }
        else{
            if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
            {

                var isYouShen=false;

                if(action.type3!=undefined)
                {

                    var len=action.type3.length;

                    console.log("actionTouch3########type3:"+len);
                    for(var i=0;i<len;i++)
                    {
                        var tp=action.type3[i];

                        console.log("tp:"+tp);
                        if(tp==24)
                        {

                            playEffect(operSound.youshen.n);
                            isYouShen=true;
                            break;

                        }

                    }


                }

                if(!isYouShen)
                {
                    playEffect(operSound.meishen.n);

                    this.showWorld(WORLD_MEISHEN,player.uid);

                    console.log("无神");
                }
                else{

                    this.showWorld(WORLD_YOUSHEN,player.uid);

                    playEffect(operSound.youshen.n);

                    console.log("有神");
                }
            }
            else{
                this.showWorld(WORLD_FANXING,player.uid);
            }

        }

    },
    touch3ActionFinishedCallBack:function (cardSprite) {



    },

    actionTouch2:function (player,action) {

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
                if(player.uid==myPlayerInfo.uid)
                {
                    cardSprite.changeToBig();
                }
                else{
                    cardSprite.changeToBg(true);
                }


                cardSprite.x=this.dui.x;//v_x+v_w/2;
                cardSprite.y=this.dui.y;//v_y+v_h/2;
                cardSprite.uid=roomUser.user.uid;
                cardSprite.setScl(0);
                cardSprite.setTag(CARD_SPRITE_TAG);

                cardSprite.setLight(true);

                this.addChild(cardSprite,TABLE_DESKER_ZOEDER);

                var pos=this.getRoomUserShowCardPos(cardSprite.uid);

                var delayAction=cc.delayTime(DELEAY_T+DELEAY_TEST);
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



                if(card.isBack==1&&(RULE_VALUE==ROOM_TYPE_GUILIN||RULE_VALUE==ROOM_TYPE_HUAIHUA||RULE_VALUE==ROOM_TYPE_DAZIPAI
                        ||RULE_VALUE==ROOM_TYPE_PENGHUZI
                    ))
                {

                }
                else{

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
                }

                break;
            }



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
                var scl=cardSprite.getSpScale();
                cardSprite.x=this.dui.x;//v_x+v_w/2;
                cardSprite.y=this.dui.y;//v_y+v_h/2;
                cardSprite.uid=roomUser.user.uid;
                cardSprite.setScl(0);
                cardSprite.setTag(CARD_SPRITE_TAG);

                cardSprite.setLocalZOrder(11);

                cardSprite.setLight(true);

                this.addChild(cardSprite,TABLE_DESKER_ZOEDER);

                var pos=this.getRoomUserShowCardPos(cardSprite.uid);

                var delayAction=cc.delayTime(DELEAY_T+DELEAY_TEST);
                var moveAction = cc.moveTo(0.1+MOVE_DELEAY_T+DELEAY_TEST, pos);
                var actionCallbackFunction = cc.callFunc(this.touchActionFinishedCallBack, this, cardSprite);
                var actionArray=[];
                actionArray.push(moveAction);
                actionArray.push(delayAction);
                actionArray.push(actionCallbackFunction);
                var actionSequence = cc.sequence(actionArray);
                cardSprite.runAction(actionSequence);

                var scaleTo=cc.scaleTo(0.1,scl);
                cardSprite.runActionWithSp(scaleTo);

                this.subAndUpdateDeskLeftCount();


                cc.log("card is back@@@@:"+card.isBack+","+card.value);
                if(card.isBack==1&&(RULE_VALUE==ROOM_TYPE_GUILIN||RULE_VALUE==ROOM_TYPE_DAZIPAI))
                {

                }
                else{

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
                }



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
        this.resetMyCardPos(roomUser,null,false);

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

                cardSprite.card.flg3=card.flg3;
                cardSprite.card.index=card.index;

               // cc.log("##################:"+cardSprite.card.flg3)

                cardSprite.uid=roomUser.user.uid;
                cardSprite.changeToSmall2();

                cardSprite.setLight(false);

                var arrMove=[];
                arrMove.push(cardSprite);

                var groups=[];
                groups.push(arrMove);

                this.moveRoomUserCardSprite(roomUser,groups,3);

                //var hasAddCount=roomUser.cardSpries3Local.length-1;

                var hasAddCount=roomUser.cardSpries3Local.length;

                var hangIndex=parseInt(hasAddCount/5);
                var hangIndex2=parseInt(hasAddCount)%5;
                var xp=0;
                var yp=0;
                if(hangIndex<=0)
                {
                 

                    hangIndex=1;
                }
                else{
                    if(hangIndex2!=0)
                    {
                        hangIndex+=1;



                    }

                }
                cardSprite.roomUser=roomUser;

                var pos=null;
                //if(RULE_VALUE==ROOM_TYPE_PENGHUZI)
                //{
                //    pos=this.resetMyCardPos3(roomUser,cardSprite);
                //
                //    cc.log("###############pos:"+pos.x+","+pos.y);
                //}
                //else{

                    xp=(hasAddCount-(hangIndex-1)*5-1)*this.gap_w2-this.gap_w2;
                    yp=-(hangIndex-1)*this.gap_h2;

                    //var pos=this.getHeadPos(roomUser,0,0);
                    var uiPos=this.getRoomUserUIPos(roomUser);

                    pos=this.getTableCardStartPos(uiPos,2);
                    pos.x+=xp;
                    pos.y+=yp;
                //}




                // if(uiPos==BOTTOM_UI)
                // {
                //     pos.x=v_x+110;
                //     pos.y=v_y+110+60;
                //
                //
                //     pos.x+=hasAddCount*30;
                //     pos.y-=50;
                // }
                // else if(uiPos==RIGHT_UI)
                // {
                //     pos.x=pos.x-70-hasAddCount*30;
                //     pos.y=pos.y-90;
                //
                // }
                // else if(uiPos==TOP_UI)
                // {
                //     pos.x=pos.x-95-hasAddCount*30;
                //     pos.y=pos.y-115;
                //
                //
                // }
                // else{
                //     pos.x=pos.x+70+hasAddCount*30;
                //     pos.y=pos.y-70;
                // }

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

        //if(cardSprite.isPut!=undefined&&cardSprite.isPut==1)
        //{
        //    cardSprite.setRed();
        //}


        if(cardSprite.card.flg3==1)
        {
            cardSprite.setBlue();
        }


        if(cardSprite.card.flg3==2)
        {
            cardSprite.setRed();
        }

        cardSprite.setLocalZOrder(10);
        this.releaseActionCount("收牌动作完成");

        if(RULE_VALUE==ROOM_TYPE_PENGHUZI)
        {
            pos=this.resetMyCardPos3(cardSprite.roomUser,null);

          //  cc.log("###############pos:"+pos.x+","+pos.y);
        }
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
        this.addChild(layer,TABLE_DESKER_ZOEDER+4);


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
            var sp=new cc.Sprite("res/ui/room_fucheng/clock_room.png");
            sp.setScale(0.5);
            layer.addChild(sp);
            var txt = new cc.LabelTTF("20", FONT_NAME_APP, 25);
            txt.setColor(cc.color(255,255,255));
            txt.x=-2;
            txt.y=2;
            layer.addChild(txt);

            var uiPos=this.getRoomUserUIPos(roomUser);

            if(player.uid==myPlayerInfo.uid)
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

        this.showClock(player,ROOM_WAIT_PUT_STATE);

        if(player.uid==myPlayerInfo.uid&&(this.shouSp==undefined||this.shouSp==null))
        {

         
            this.outPutButton = new ccui.Button();
            this.outPutButton.loadTextures("res/ui/room_fucheng/chupai_room.png","res/ui/room_fucheng/chupai_room.png","res/ui/room_fucheng/chupai_room.png");
            this.outPutButton.addTouchEventListener(this.chuPaiClicked, this);
            this.outPutButton.x=v_x+v_w/2;
            this.outPutButton.y=v_y+v_h/2;
            this.addChild(this.outPutButton,TABLE_DESKER_ZOEDER+4);


            this.shouSp=new cc.Layer();
            var sp=new cc.Sprite("res/ui/room_fucheng/shou_room.png");
            this.shouSp.addChild(sp);

            var sp2=new cc.Sprite("res/ui/room_fucheng/huadongchupai_room.png");
            this.shouSp.addChild(sp2);
            sp2.y=-20;


            this.shouSp.x=v_x+v_w-200;
            this.shouSp.y=v_y+200;
            this.addChild(this.shouSp,TABLE_DESKER_ZOEDER+4);

            var moveAction = cc.moveTo(1.0, cc.p(0,50));
            var moveAction2 = cc.moveTo(0, cc.p(0,0));
            //var actionCallbackFunction = cc.callFunc(this.showMoveFinishedCallBack, this, this.shouSp);
            var actionArray=[];
            actionArray.push(moveAction);
            actionArray.push(moveAction2);
            var actionSequence = cc.sequence(actionArray).repeatForever();
            sp.runAction(actionSequence);




        }
    },


    actionPut:function (player,action) {

        if(player.uid==myPlayerInfo.uid)
        {
            if(this.shouSp!=undefined&&this.shouSp!=null)
            {
                this.shouSp.removeFromParent(true);
                this.shouSp=null;

                if(this.outPutButton!=null&&this.outPutButton!=undefined)
                {
                    this.outPutButton.removeFromParent(true);
                    this.outPutButton=null;
                }

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
                   // cardSprite.setScl(0);
                    cardSprite.setTag(CARD_SPRITE_TAG);
                    this.addChild(cardSprite,1);

                }
                else{
                    this.removeCardSpriteFromRoomUserLocal1(card.c_id);

                    cardSprite.changeToBig();
                   // cardSprite.setScl(0);
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


                var delayAction=cc.delayTime(DELEAY_T+DELEAY_TEST);
                var moveAction = cc.moveTo(0.1+MOVE_DELEAY_T+DELEAY_TEST, pos);
                var actionCallbackFunction = cc.callFunc(this.cardPutActionFinishedCallBack, this, cardSprite);
                var actionArray=[];
                actionArray.push(moveAction);
                actionArray.push(delayAction);
                actionArray.push(actionCallbackFunction);
                var actionSequence = cc.sequence(actionArray);
                cardSprite.runAction(actionSequence);
                // var scaleTo=cc.scaleTo(0.1+MOVE_DELEAY_T,1);
                // cardSprite.runActionWithSp(scaleTo);


                this.resetMyCardPos(this.myRoomUser,null,false);


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


                if(this.roomInfo.currentCard!=undefined)
                {
                    cc.log("[更新当前打出牌,oldType"+this.roomInfo.currentCard.card.type+",oldVelue:"+this.roomInfo.currentCard.card.value+",newType:"+cardSprite.card.type+",newValue:"+cardSprite.card.value+"]");
                }
                this.roomInfo.currentCard=cardSprite;

                
                playEffect(card_name);

                break;

            }



        }



    },
    cardPutActionFinishedCallBack:function (cardSprite) {



        this.releaseActionCount("出牌动作完成");




        cc.log("[出牌结束]");

    },
    actionHideButton:function (player,action) {

    },
    actionCancleTimeOut:function (player,action) {

    },
    actionkeWei:function(player,action)
    {
        this.showSelectedButton(player,action);
    },
    actionWei:function (player,action) {
        this.buildMoveAction(player,action,ACTION_WEI);
        this.showWorld(WORLD_WEI,player.uid);

        this.putCardByType=ACTION_WEI;

        var roomUser=this.getRoomUserByUID(player.uid);
        if(RULE_VALUE==ROOM_TYPE_LUZHOU_DAER)
        {
            if(roomUser.user.sex==1)
            {
                playEffect(operSound.peng.v);
            }
            else{
                playEffect(operSound.peng.n);
            }
        }
        else{
            if(roomUser.user.sex==1)
            {
                playEffect(operSound.wei.v);
            }
            else{
                playEffect(operSound.wei.n);
            }
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

        var lastSelectedCard=target.selectedCard;

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

                        if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                        {
                            checkTouchCardCount=5;

                        }
                        if(count<checkTouchCardCount)
                        {

                            target.selectedCard=cardSprite;
                            target.selectedCard.org={};
                            target.selectedCard.org.x=target.selectedCard.x;
                            target.selectedCard.org.y=target.selectedCard.y;

                            target.selectedCard.setLocalZOrder(160);
                            target.selectedCard.setRed2();
                            target.selectedCard.hasMoved=false;


                            if(lastSelectedCard!=undefined&&lastSelectedCard!=null&&lastSelectedCard!=target.selectedCard)
                            {
                                lastSelectedCard.clearColor();
                                lastSelectedCard.clickedCount=0;
                            }

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

        if(target.selectedCard!=null)
        {
            //target.selectedCard.orgOrder=target.selectedCard.getLocalZOrder();
            //target.selectedCard.setLocalZOrder(20);
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
        var dis=cc.pDistance(pos,target.lastPos);

        target.lastPos=pos;
        if(target.selectedCard!=null)
        {
            target.selectedCard.x+=subPos.x;
            target.selectedCard.y+=subPos.y;
        }

        if(dis>5&&target.selectedCard!=null&&(!target.selectedCard.hasMoved))
        {
            target.selectedCard.hasMoved=true;

            var sp=target.selectedCard.changeToBig();
            var r=sp.getTextureRect();
            target.selectedCard.y+=r.height/2;

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

            if(target.roomObj.roomState==ROOM_WAIT_PUT_STATE&&target.roomObj.uid==myPlayerInfo.uid)
            {
                //出牌
                var x=v_x;
                var y=v_y+v_h/2;
                var w=v_w;

                if(target.selectedCard.x>x&&target.selectedCard.x<(x+w)&&target.selectedCard.y>y)
                {

                    if((RULE_VALUE!=ROOM_TYPE_WAIHUZI)&&(RULE_VALUE!=ROOM_TYPE_GUILIN)
                        &&(RULE_VALUE!=ROOM_TYPE_DAZIPAI)&&(RULE_VALUE!=ROOM_TYPE_HUAIHUA)
                        &&(RULE_VALUE!=ROOM_TYPE_PENGHUZI)
                        &&target.checkHasWeiThiCard(target.selectedCard.card))
                    {

                        target.roomTip=new TouchLayer();
                        target.addChild(target.roomTip,TABLE_DESKER_ZOEDER+20);

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


                        if(target.outPutButton!=null&&target.outPutButton!=undefined)
                        {
                            target.outPutButton.removeFromParent(true);
                            target.outPutButton=null;
                        }

                        var req=new PutCardRequest();
                        req.uid=myPlayerInfo.uid;
                        req.roomId=target.roomInfo.roomId;
                        req.c_id=target.selectedCard.card.c_id;
                        cc.log("[发送出牌请求c_id:"+req.c_id+"]");
                        socketMgr.socket2.send(PUT_CARD_REQUEST,req);

                        target.showSelectedCard(target.selectedCard);

                        target.hasSendPutCard=true;

                        target.selectedCard.clearColor();
                        target.selectedCard=null;

                        target.hasPutCard();

                        if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                        {
                            target.hideSlectedButton(myPlayerInfo.uid);
                        }



                    }



                    return;

                }
                else{

                    if(target.selectedCard.clickedCount==undefined)
                    {
                        target.selectedCard.clickedCount=0;
                        target.selectedCard.clickedLastTime=new Date().getTime();
                    }


                    target.selectedCard.clickedCount++;

                    cc.log("target.selectedCard.clickedCount:"+target.selectedCard.clickedCount);

                    if(target.selectedCard.clickedCount>=2)
                    {
                        var currentT=new Date().getTime();
                        var t=currentT-target.selectedCard.clickedLastTime;
                        target.selectedCard.clickedLastTime=currentT;
                        t=t/1000;
                        cc.log("t:"+t)
                        if(t<=0.3)
                        {

                            var req=new PutCardRequest();
                            req.uid=myPlayerInfo.uid;
                            req.roomId=target.roomInfo.roomId;
                            req.c_id=target.selectedCard.card.c_id;
                            cc.log("[发送出牌请求2 c_id:"+req.c_id+"]");
                            socketMgr.socket2.send(PUT_CARD_REQUEST,req);

                            target.showSelectedCard(target.selectedCard);

                            target.hasSendPutCard=true;

                            target.selectedCard.clearColor();
                            target.selectedCard=null;

                            target.hasPutCard();

                            if(target.outPutButton!=null&&target.outPutButton!=undefined)
                            {
                                target.outPutButton.removeFromParent(true);
                                target.outPutButton=null;
                            }


                            if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                            {
                                target.hideSlectedButton(myPlayerInfo.uid);
                            }


                            return;
                        }


                    }



                }
                // else{
                //     target.selectedCard.x=target.selectedCard.org.x;
                //     target.selectedCard.y=target.selectedCard.org.y;
                // }

            }
            else{
                target.selectedCard.clearColor();
                target.selectedCard.changeToSmall();
            }
            if(target.selectedCard.hasMoved)
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

                    var huHuanCardSp=null;

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

                            if(RULE_VALUE!=ROOM_TYPE_WAIHUZI)
                            {
                                //检查是否为一坎
                                if(tmpArr.length==3)
                                {
                                    var t1=tmpArr[0];
                                    var t2=tmpArr[1];
                                    var t3=tmpArr[2];

                                    if(t1.type==t2.type&&t1.type==t3.type&&t1.value==t2.value&&t1.value==t3.value)
                                    {
                                        continue;
                                    }

                                }
                                else if(tmpArr.length==4)
                                {
                                    var t1=tmpArr[0];
                                    var t2=tmpArr[1];
                                    var t3=tmpArr[2];
                                    var t4=tmpArr[2];

                                    if(t1.type==t2.type&&t1.type==t3.type&&t1.type==t4.type&&t1.value==t2.value&&t1.value==t3.value&&t1.value==t4.value)
                                    {
                                        continue;
                                    }

                                }

                            }

                            if(cardSprite.hasContainsPos(cc.p(target.selectedCard.x,target.selectedCard.y)))
                            {
                                flg=true;

                                huHuanCardSp=cardSprite;

                                cc.log("##1");

                                break;
                            }
                        }
                        if(flg)
                        {

                            cc.log("#");
                            break;
                        }

                        if(size<4||isInThiCol)
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
                   // cc.log("##2");

                    if(huHuanCardSp!=null)
                    {
                        //target.selectedCard.x=huHuanCardSp.x;
                        //target.selectedCard.y=huHuanCardSp.y;
                        //
                        //huHuanCardSp.x=target.selectedCard.org.x;
                        //huHuanCardSp.y=target.selectedCard.org.y;
                        //


                        var len=target.myRoomUser.colsLocal.length
                        for(var i=0;i<len;i++)
                        {
                            var tmpArr=target.myRoomUser.colsLocal[i];
                            var size=tmpArr.length;
                            for(var j=0;j<size;j++)
                            {
                                var card=tmpArr[j];
                                if(card.c_id==target.selectedCard.card.c_id)
                                {
                                    tmpArr[j]=huHuanCardSp.card;

                                }
                                else if(card.c_id==huHuanCardSp.card.c_id)
                                {
                                    tmpArr[j]=target.selectedCard.card;
                                }

                            }


                        }

                        target.resetMyCardPos(target.myRoomUser,null,false);



                    }
                    else{
                        target.selectedCard.x=target.selectedCard.org.x;
                        target.selectedCard.y=target.selectedCard.org.y;
                    }



                }

            }



        }
    },

    hasPutCard:function()
    {

        //if (this.siShouButton!=undefined &&this.siShouButton != null) {
        //
        //    this.siShouButton.visible=false;
        //}
    },
    showSelectedCard:function (cardSprite) {

        cardSprite.changeToBig();
        var pos=this.getRoomUserShowCardPos(myPlayerInfo.uid);
        var moveAction = cc.moveTo(0.1+MOVE_DELEAY_T+DELEAY_TEST, pos);
        var actionArray=[];
        actionArray.push(moveAction);
        var actionSequence = cc.sequence(actionArray);
        cardSprite.runAction(actionSequence);

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
            this.resetMyCardPos(this.myRoomUser,null,false);
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

        target.hideSlectedButton(myPlayerInfo.uid);
    },
    downLoadFinished:function (obj,target) {

        if(target.roomInfo==undefined)
        {
            return;
        }
        var path=obj.path;
        var filePath=path.split("/");
        var fileName="";
        if(filePath.length>0) {
            fileName = filePath[filePath.length - 1];

        }
        var fix=getFix(fileName);
        //cc.log("#########downfinished:"+fix+" "+fileName);
        if(fix==".spx")
        {

        }
        else {

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
                    changeHead(headSprite,1);
                    headBg.getParent().addChild(headSprite,1);
                }

                if(target.readyLayer!=undefined&&target.readyLayer!=null)
                {
                    var uiPos=target.getRoomUserUIPos(roomUsr);
                    target.readyLayer.updateHead(uiPos,uid);
                }

            }


        }

    },
    getRoomUserShowCardPos:function (uid) {

        var roomUser=this.getRoomUserByUID(uid);
       // var pos=this.getPosOfPlayer(uid,350,0);
        var pos=cc.p(0,0);
        var uiPos=this.getRoomUserUIPos(roomUser);
        if(uiPos==BOTTOM_UI)
        {
            pos=cc.p(v_x+v_w/2,v_y+v_h/2);

        }
        else if(uiPos==RIGHT_UI)
        {

            pos=cc.p(v_x+v_w-400+195,v_y+v_h/2-this.bigCard_h+160);
        }
        else if(uiPos==TOP_UI)
        {

            pos=cc.p(v_x+v_w-400,v_y+v_h/2+this.bigCard_h);
        }
        else if(uiPos==LEFT_UI)
        {

            pos=cc.p(v_x+400,v_y+v_h/2+this.bigCard_h);
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
            var actionType=tiObj.actionType;

            for(var gIndex=0;gIndex<gSize;gIndex++)
            {
                var cardArr=groups[gIndex];
                var size=cardArr.length;
                cc.log("[第"+(gIndex+1)+"组:"+size+"]");

                var isQiShouQIng=true;

                if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                {

                    if(WAIHUZI_QISHOU_QING_SHOW==1)
                    {
                        isQiShouQIng=false;
                    }

                    if(size==4)
                    {
                        for(var i=0;i<size;i++) {
                            var cardSprite = cardArr[i];
                            console.log("###########cardSprite.card.flg:"+cardSprite.card.flg+",cardSprite.card.flg3:"+cardSprite.card.flg3);
                            if(cardSprite.card.flg!=1||cardSprite.card.flg3==2)
                            {
                                isQiShouQIng=false;
                                break;

                            }

                        }
                    }
                    else{
                        isQiShouQIng=false;
                    }


                }
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

                    if(cardSprite.uid==myPlayerInfo.uid)
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



                    if(RULE_VALUE==ROOM_TYPE_GUILIN||RULE_VALUE==ROOM_TYPE_DAZIPAI)
                    {
                        if(actionType==ACTION_TI||actionType==ACTION_WEI)
                        {

                            cardSprite.changeToBg(true);

                        }
                        else{
                            cardSprite.changeToBig();

                            //cardSprite.setScl(SMALL_CARD_SCL);
                        }

                    }
                    else if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                    {
                        if(isQiShouQIng)
                        {
                            cardSprite.changeToBg(true);
                            cardSprite.isQiShouQIng=isQiShouQIng;
                        }
                        else{

                            cardSprite.changeToBig();
                           // cardSprite.setScl(SMALL_CARD_SCL);

                        }

                    }
                    else if(RULE_VALUE==ROOM_TYPE_HUAIHUA||RULE_VALUE==ROOM_TYPE_PENGHUZI)
                    {
                        if(actionType==ACTION_WEI)
                        {

                            cardSprite.changeToBg(true);

                        }
                        else{
                            cardSprite.changeToBig();

                            //cardSprite.setScl(SMALL_CARD_SCL);
                        }
                    }
                    else{
                        cardSprite.changeToBig();

                        //cardSprite.setScl(SMALL_CARD_SCL);


                    }

                    cardSprite.actionType=actionType;

                    cardSprite.pos2=pos2;


                    var moveAction = cc.moveTo(0.1+MOVE_DELEAY_T, pos);
                    var actionCallbackFunction = cc.callFunc(this.tiMoveActionFinishCallFunction, this, cardSprite);
                    var delayAction2=cc.delayTime(DELEAY_T+DELEAY_TEST);
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

                    var r=70;

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
                    sp=new cc.Sprite("res/ui/room_fucheng/zchi_room.png");
                }
                    break;
                case WORLD_HU:
                {
                    sp=new cc.Sprite("res/ui/room_fucheng/zhu_room.png");
                }
                    break;
                case WORLD_PAO:
                {
                    if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                    {
                        sp=new cc.Sprite("res/ui/room_fucheng/zpiao_room.png");
                    }
                    else{
                        sp=new cc.Sprite("res/ui/room_fucheng/zpao_room.png");
                    }

                }
                    break;
                case WORLD_PENG:
                {
                    sp=new cc.Sprite("res/ui/room_fucheng/zpeng_room.png");
                }
                    break;
                case WORLD_TI:
                {
                    if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                    {
                        sp=new cc.Sprite("res/ui/room_fucheng/zqing_room.png");
                    }
                    else{
                        sp=new cc.Sprite("res/ui/room_fucheng/zti_room.png");
                    }

                }
                    break;
                case WORLD_WEI:
                {
                    if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                    {
                        sp=new cc.Sprite("res/ui/room_fucheng/zwai_room.png");
                    }
                    else{
                        sp=new cc.Sprite("res/ui/room_fucheng/zwei_room.png");
                    }

                }
                    break;
                case WORLD_BI:
                {
                    sp=new cc.Sprite("res/ui/room_fucheng/bi_room.png");
                }
                    break;
                case WORLD_HUANGZHUANG:
                {
                    sp=new cc.Sprite("res/ui/room_fucheng/huangzhuang_room.png");
                }
                    break;
                case WORLD_BU:
                {
                    sp=new cc.Sprite("res/ui/room_fucheng/bu_room.png");
                }
                    break;
                case WORLD_TIAN_HU:
                {
                    sp=new cc.Sprite("res/ui/room_fucheng/tianhu_room.png");
                }
                    break;
                case WORLD_DI_HU:
                {
                    sp=new cc.Sprite("res/ui/room_fucheng/dihu_room.png");
                }
                    break;
                case WORLD_ZI_MO:
                {
                    sp=new cc.Sprite("res/ui/room_fucheng/zimo_room.png");
                }
                    break;
                case WORLD_BAO:
                {
                    sp=new cc.Sprite("res/ui/room_fucheng/tingpai_room.png");
                }
                    break;
                case WORLD_SISHOU:
                {
                    sp=new cc.Sprite("res/ui/room_fucheng/zsishou_room.png");
                }
                    break;
                case WORLD_DANSHEN:
                {
                    sp=new cc.Sprite("res/ui/room_fucheng/zdanshen_room.png");
                }
                    break;
                case WORLD_SHUANGSHEN:
                {
                    sp=new cc.Sprite("res/ui/room_fucheng/zshuangshen_room.png");
                }
                    break;
                case WORLD_JUSHOU:
                {
                    sp=new cc.Sprite("res/ui/room_fucheng/zjushou_room.png");
                }
                    break;
                case WORLD_FANXING:
                {
                    sp=new cc.Sprite("res/ui/room_fucheng/fanxing_room.png");
                }
                    break;
                case WORLD_MEISHEN:
                {
                    sp=new cc.Sprite("res/ui/room_fucheng/zsmeishen_room.png");
                }
                    break;
                case WORLD_YOUSHEN:
                {
                    sp=new cc.Sprite("res/ui/room_fucheng/zsyoushen_room.png");
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


        var len=this.effectQueue.length;
        for(var i=0;i<len;i++)
        {
            var sp=this.effectQueue[i];

            var fromUser=this.getRoomUserByUID(sp.fromUid);
            var toUser=this.getRoomUserByUID(sp.toUid);
            if(fromUser==null||toUser==null)
            {
                cc.log("fromUser or toUser is null!!!");
                continue;
            }
            var pos1=this.getHeadPos(fromUser,0,0);
            cc.log("pos1:"+pos1.x+",pos2:"+pos1.y);
            sp.x=pos1.x;
            sp.y=pos1.y;
            sp.visible=true;

            var pos2=this.getHeadPos(toUser,0,0);
            var uiPos1=this.getRoomUserUIPos(fromUser);
            var uiPos2=this.getRoomUserUIPos(toUser);

            var disX=pos2.x-pos1.x;
            if(disX<0)disX=-disX;
            var type=1;
            var angle=60;
            if(disX<50)
            {
                type=2;
            }
            var hh=500;
            if(uiPos1==LEFT_UI&&uiPos2==TOP_UI)//TOP_UI
            {
                hh=-hh;
                angle=-angle;
               // cc.log("###1:"+hh);

            }
            else if(uiPos1==LEFT_UI&&uiPos2==RIGHT_UI)//TOP_UI
            {
                hh=0;
                angle=0;

                //cc.log("###2:"+hh);
            }
            else if(uiPos1==TOP_UI&&uiPos2==LEFT_UI)//TOP_UI
            {
                angle=-angle;
                hh=-hh;
               // cc.log("###3:"+hh);

            }
            else if(uiPos1==TOP_UI&&uiPos2==BOTTOM_UI)//TOP_UI
            {
                hh=0;
                angle=0;

                //cc.log("###4:"+hh);
            }
            else if(uiPos1==RIGHT_UI&&uiPos2==TOP_UI)
            {
                angle=-angle;
                hh=-hh;
               // cc.log("###5:"+hh);
            }
            else if(uiPos1==RIGHT_UI&&uiPos2==LEFT_UI)
            {
                hh=0;
                angle=0;

              //  cc.log("###6:"+hh);

            }

          //  cc.log("uiPos1:"+uiPos1+",uiPos2:"+uiPos2);


           // cc.log("bizerAction type:::::"+type);
            var anim=this.bizerAction(1.0,pos1,pos2,hh,angle,type);

            var actionCallbackFunction = cc.callFunc(this.effectMoveFinished, this, sp);
            var actionArray=[];
            actionArray.push(anim);
            actionArray.push(actionCallbackFunction);
            var seq=cc.sequence(actionArray);
            sp.runAction(seq);


        }

        this.effectQueue=[];

        if(RULE_VALUE==ROOM_TYPE_SHUANGFENG||RULE_VALUE==ROOM_TYPE_LOUDI)
        {
            if(this.roomInfo!=undefined&&this.roomInfo.qita==0)
            {


                if(this.roomObj.roomState==ROOM_WAIT_PUT_STATE&&(this.outPutButton!=undefined&&this.outPutButton!=null))
                {
                    if (this.putCardByType == ACTION_TI || this.putCardByType == ACTION_TI2 || this.putCardByType == ACTION_PAO || this.putCardByType == ACTION_PAO2
                        || this.putCardByType == ACTION_WEI
                    ) {


                        if (this.roomInfo != undefined && this.roomInfo.qita == 0) {
                            if (this.siShouButton == undefined || this.siShouButton == null) {
                                 console.log("####sishou31");
                                this.siShouButton = new ccui.Button();
                                this.siShouButton.loadTextures("res/ui/room_fucheng/sishou_button.png", "res/ui/room_fucheng/sishou_button.png", "res/ui/room_fucheng/sishou_button.png");
                                this.siShouButton.addTouchEventListener(this.sishouButtonClicked, this);
                                this.siShouButton.x = v_x + v_w - 200;
                                this.siShouButton.y = v_y + v_h / 2;
                                this.addChild(this.siShouButton, TABLE_DESKER_ZOEDER + 4);

                            }
                            else if (this.player_state == undefined || this.player_state == 0) {

                                 console.log("####sishou41");
                                this.siShouButton.visible = true;
                            }
                            else {
                                 console.log("####sishou51");
                                this.siShouButton.visible = false;
                            }


                        }

                    }
                    else{
                        if(this.siShouButton!=undefined&&this.siShouButton!=null)
                        {
                            console.log("####sishou61");
                            this.siShouButton.visible=false;
                        }
                    }

                }
                else{

                    if((this.outPutButton==undefined||this.outPutButton==null)&&(this.myState==0))
                    {
                        console.log("####sishou2");
                        if(this.siShouButton==undefined||this.siShouButton==null)
                        {
                            // console.log("####sishou3");
                            this.siShouButton = new ccui.Button();
                            this.siShouButton.loadTextures("res/ui/room_fucheng/sishou_button.png","res/ui/room_fucheng/sishou_button.png","res/ui/room_fucheng/sishou_button.png");
                            this.siShouButton.addTouchEventListener(this.sishouButtonClicked, this);
                            this.siShouButton.x=v_x+v_w-200;
                            this.siShouButton.y=v_y+v_h/2;
                            this.addChild(this.siShouButton,TABLE_DESKER_ZOEDER+4);

                        }

                         if(this.player_state==undefined||this.player_state==0){

                             console.log("####sishou4");
                            this.siShouButton.visible=true;
                        }
                        else{
                             console.log("####sishou5");
                            this.siShouButton.visible=false;
                        }



                    }
                    else{

                        if(this.siShouButton!=undefined&&this.siShouButton!=null)
                        {
                            console.log("####sishou6");
                            this.siShouButton.visible=false;
                        }

                    }
                }



               // console.log("####sishou1,"+(this.roomObj.roomState!=ROOM_WAIT_PUT_STATE)+","+(this.selectedLayer==undefined||this.selectedLayer==null));





            }


        }


    },
    sishouButtonClicked:function(sender, type)
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


                this.roomTip=new TouchLayer();
                this.addChild(this.roomTip,TABLE_DESKER_ZOEDER+20);

                var node = parseUI("res/ui/roomTip/roomTip.json", CENTER);
                this.roomTip.addChild(node);

                var t= ccui.helper.seekWidgetByName(node, "t");
                t.setString("是否确定死手，死手后不可胡牌?");

                var b1= ccui.helper.seekWidgetByName(node, "b1");
                b1.addTouchEventListener(this.sishouB1Clicked,this);

                var b2= ccui.helper.seekWidgetByName(node, "b2");
                b2.addTouchEventListener(this.sishouB2Clicked,this);



                playEffect(TOUCH_SOUND);

            }
                break;


            default:
                break;
        }

    },
    sishouB1Clicked:function(sender, type)
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

                var req=new SiShouRequest();
                req.uid=myPlayerInfo.uid;
                req.roomId=this.roomInfo.roomId;
                socketMgr.socket2.send(SI_SHOU_REQUEST,req);

                if(this.siShouButton!=null&&this.siShouButton!=undefined)
                {
                    this.siShouButton.visible=false;

                }


                if(this.shouSp!=undefined&&this.shouSp!=null)
                {
                    this.shouSp.removeFromParent(true);
                    this.shouSp=null;

                    if(this.outPutButton!=null&&this.outPutButton!=undefined)
                    {
                        this.outPutButton.removeFromParent(true);
                        this.outPutButton=null;
                    }

                }

               this.releaseActionCount("[死手]");


                if(this.roomTip!=null&&this.roomTip!=undefined)
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
    sishouB2Clicked:function(sender, type)
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

                playEffect(TOUCH_SOUND);

            }
                break;


            default:
                break;
        }

    },

    effectMoveFinished:function (sp) {

        cc.log("####effect1");
        var actionCallbackFunction = cc.callFunc(this.effectMoveFinished2, this, sp);
        var actionArray=[];

        var value=sp.value;
        var animate=null;
        if(value==1)
        {

            animate=this.createAnimation("zhandan_",1,12);

            playEffect("effect/ie_boom.mp3");
        }
        else if(value==2)
        {

            animate=this.createAnimation("zuanshi_",1,14);

            playEffect("effect/ie_diamond.mp3");
        }
        else if(value==3)
        {

            animate=this.createAnimation("hua_",1,7);

            playEffect("effect/ie_flower.mp3");
        }
        else if(value==4)
        {

            animate=this.createAnimation("jidan_",1,8);

            playEffect("effect/ie_egg.mp3");
        }
        else{
            cc.log("特效类型错误!!!!!!:"+value);
        }
        actionArray.push(animate);
        actionArray.push(actionCallbackFunction);
        var seq=cc.sequence(actionArray);
        sp.runAction(seq);


    },
    effectMoveFinished2:function (sp) {

        cc.log("####effect2");
        sp.removeFromParent(true);


    },
    bizerAction:function ( t,startPoint,endPoint,height,angle,type) {

         // 把角度转换为弧度
            var radian = angle*3.14159/180.0;
        if(type==1)
        {
            // 第一个控制点为抛物线左半弧的中点
           // var q1x = startPoint.x+(endPoint.x - startPoint.x)/4.0;
            var q1 = startPoint;//cc.p(q1x, height/4 + startPoint.y);//+Math.cos(radian)*q1x
            // 第二个控制点为整个抛物线的中点
            var q2x = startPoint.x + (endPoint.x - startPoint.x)/2.0;
            var q2 = cc.p(q2x, height/2 + startPoint.y);//+Math.cos(radian)*q2x

            //曲线配置

            var cfg = [
                q1,
                q2,
                endPoint
            ];
            //使用CCEaseInOut让曲线运动有一个由慢到快的变化，显得更自然
            return cc.bezierTo(t,cfg);//CCEaseInOut::create(,0.5);
        }
        else{
            // 第一个控制点为抛物线左半弧的中点
            //var q1x = startPoint.y+(endPoint.y - startPoint.y)/4.0;
            var q1 =startPoint;// cc.p(startPoint.x+height/4,q1x) ;//+Math.cos(radian)*q1x
            // 第二个控制点为整个抛物线的中点
            var q2x = startPoint.y + (endPoint.y - startPoint.y)/2.0;
            var q2 = cc.p(height/2 + startPoint.x,q2x);//+Math.cos(radian)*q2x

            //曲线配置

            var cfg = [
                q1,
                q2,
                endPoint
            ];
            //使用CCEaseInOut让曲线运动有一个由慢到快的变化，显得更自然
            return cc.bezierTo(t,cfg);//CCEaseInOut::create(,0.5);
        }

    },
    wordMoveActionFinishCallFunction:function (sp) {
        this.wordShowCount--;
        if(this.wordShowCount<0)this.wordShowCount=0;

        if(RULE_VALUE===ROOM_TYPE_WAIHUZI)
        {
            if(sp.type==WORLD_HU||sp.type==WORLD_ZI_MO||sp.type==WORLD_TIAN_HU||sp.type==WORLD_DI_HU)
            {
                sp.removeFromParent(true);
                this.releaseActionCount("#黄庄或者胡动作执行完成")
                return;
            }
        }

        if(sp.type==WORLD_HU||sp.type==WORLD_HUANGZHUANG||sp.type==WORLD_ZI_MO||sp.type==WORLD_TIAN_HU||sp.type==WORLD_DI_HU)
        {

            if(sp.type!=WORLD_HUANGZHUANG&&(RULE_VALUE==ROOM_TYPE_GUILIN||RULE_VALUE==ROOM_TYPE_DAZIPAI))
            {
                this.releaseActionCount("黄庄或者胡动作执行完成");
            }
            else if(sp.type!=WORLD_HUANGZHUANG&&RULE_VALUE==ROOM_TYPE_HONGHEIHU)
            {
                this.releaseActionCount("黄庄或者胡动作执行完成-ROOM_TYPE_HONGHEIHU");
            }
            else{
                this.showFinishedLayer();
                this.releaseActionCount("黄庄或者胡动作执行完成");
            }



        }
        else if(sp.type==WORLD_BU)
        {
            this.releaseActionCount("补牌完成");
        }
        else if(sp.type==WORLD_BAO)
        {
            this.releaseActionCount("听牌完成");
        }
        else if(sp.type==WORLD_SISHOU)
        {
            this.releaseActionCount("死手完成");
        }
        else  if(sp.type==WORLD_JUSHOU)
        {
            this.releaseActionCount("举手完成");
        }
        else if(sp.type==WORLD_FANXING)
        {
            this.releaseActionCount("翻醒完成");
            this.showFinishedLayer();
        }
        else if(sp.type==WORLD_MEISHEN||sp.type==WORLD_YOUSHEN)
        {
            this.releaseActionCount("神完成");
            this.showFinishedLayer();
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


                if(RULE_VALUE==ROOM_TYPE_GUILIN||RULE_VALUE==ROOM_TYPE_DAZIPAI)
                {

                    if(cardSprite.actionType==ACTION_TI||cardSprite.actionType==ACTION_WEI||cardSprite.actionType==ACTION_TI2)
                    {

                        cardSprite.changeToBg(false);


                    }
                    else{
                        cardSprite.changeToSmall2();
                    }


                }
                else if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                {
                    if(cardSprite.isQiShouQIng!=undefined)
                    {
                        cardSprite.changeToBg(false);
                    }
                    else{

                        cardSprite.changeToSmall2();
                    }

                }
                else if(RULE_VALUE==ROOM_TYPE_HUAIHUA) {

                    if (cardSprite.actionType == ACTION_WEI) {

                        cardSprite.changeToBg(false);


                    }
                    else{
                        cardSprite.changeToSmall2();
                    }

                }
                else if(RULE_VALUE==ROOM_TYPE_PENGHUZI)
                {

                    if (cardSprite.actionType == ACTION_WEI) {

                        cardSprite.changeToBg(false);


                    }
                    else{
                        cardSprite.changeToSmall2();
                    }

                    if(cardSprite.actionType==ACTION_PAO2)
                    {
                        if(cardSprite.card.flg3==2)
                        {
                            var rUser=this.getRoomUserByUID(cardSprite.card.uid);
                            if(rUser!=null)
                            {
                                cc.log("跑2=======reset  pos3===========================");
                                this.resetMyCardPos3(rUser,null);
                            }
                        }

                    }
                }
                else{
                    cardSprite.changeToSmall2();
                }

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


    getScoreByArr:function (arr) {

        var a=this.isTiOrPao(arr);
        var isRed=this.checkIsRed(arr);
        var type=arr[0].type;

        var worldPng=null;
        var score=0;

        if(arr.length==2)//将
        {
            var a_1=arr[0];
            var a_2=arr[1];
            if(a_1.type==a_2.type&&a_1.value==a_2.value)
            {
                worldPng="res/ui/finish_sihai/jiang_finish4.png";
            }

        }
        else if(a==1)//提
        {
            worldPng="res/ui/finish_sihai/ti_finish.png";

            if(RULE_VALUE==ROOM_TYPE_LUZHOU_DAER)
            {
                if(type==0)
                {
                    if(isRed)
                    {
                        score=18;
                    }
                    else{
                        score=15;
                    }

                }
                else{
                    if(isRed)
                    {
                        score=15;
                    }
                    else{
                        score=12;
                    }

                }
            }
            else{
                if(type==0)
                {

                    score=12;
                }
                else{
                    score=9;
                }
            }


        }
        else if(a==2)
        {
            //跑
            worldPng="res/ui/finish_sihai/pao_finish.png";
            if(RULE_VALUE==ROOM_TYPE_LUZHOU_DAER)
            {
                if(type==0)
                {
                    if(isRed)
                    {
                        score=15;
                    }
                    else{
                        score=12;
                    }

                }
                else{
                    if(isRed)
                    {
                        score=12;
                    }
                    else{
                        score=9;
                    }

                }
            }
            else {

                if(type==0)
                {
                    score=9;
                }
                else{
                    score=6;
                }
            }

        }
        else
        {
            a=this.isPengOrWeiorKan(arr);
            if(a==1)
            {
                //偎
                worldPng="res/ui/finish_sihai/wei_finish.png";
                if(RULE_VALUE==ROOM_TYPE_LUZHOU_DAER)
                {
                    if(type==0)
                    {
                        if(isRed)
                        {
                            score=9;
                        }
                        else{
                            score=3;
                        }

                    }
                    else{
                        if(isRed)
                        {
                            score=6;
                        }
                        else{
                            score=1;
                        }

                    }
                }
                else{
                    if(type==0)
                    {
                        score=6;
                    }
                    else{
                        score=3;
                    }
                }

            }
            else if(a==2)
            {
                //坎
                worldPng="res/ui/finish_sihai/kan_finish.png";

                if(RULE_VALUE==ROOM_TYPE_LUZHOU_DAER)
                {
                    if(type==0)
                    {
                        if(isRed)
                        {
                            score=12;
                        }
                        else{
                            score=9;
                        }

                    }
                    else{
                        if(isRed)
                        {
                            score=9;
                        }
                        else{
                            score=6;
                        }

                    }
                }
                else{
                    if(type==0)
                    {
                        score=6;
                    }
                    else{
                        score=3;
                    }
                }

            }
            else if(a==3)
            {
                //碰
                worldPng="res/ui/finish_sihai/peng_finish4.png";

                if(RULE_VALUE==ROOM_TYPE_LUZHOU_DAER)
                {
                    if(type==0)
                    {
                        if(isRed)
                        {
                            score=9;
                        }
                        else{
                            score=3;
                        }

                    }
                    else{
                        if(isRed)
                        {
                            score=6;
                        }
                        else{
                            score=1;
                        }

                    }
                }
                else{
                    if(type==0)
                    {
                        score=3;
                    }
                    else{
                        score=1;
                    }
                }

            }
            else{

                a=this.isOneTwoThreeOrTwoSevenTen(arr);

                if(RULE_VALUE==ROOM_TYPE_LUZHOU_DAER)
                {
                    if(a==1)
                    {
                        //1/2/3
                        if(type==0)
                        {
                            score=6;
                        }
                        else{
                            score=3;
                        }

                    }
                    else if(a==2)
                    {
                        //2 7 10
                        if(type==0)
                        {
                            score=9;
                        }
                        else{
                            score=6;
                        }

                    }
                }
                else{
                    if(a==1||a==2)
                    {
                        //1/2/3
                        if(type==0)
                        {
                            score=6;
                        }
                        else{
                            score=3;
                        }

                    }
                }


                if(a==1)
                {
                    //123
                    worldPng="res/ui/finish_sihai/shun_finish.png";
                }
                else if(a==2)
                {
                    //2/7/10
                    worldPng="res/ui/finish_sihai/bian_finish.png";
                }
                else{
                    var b=this.checkIsShunOrBian(arr);
                    if(b==1)
                    {
                        worldPng="res/ui/finish_sihai/shun_finish.png";
                    }
                    else if(b==2)
                    {
                        worldPng="res/ui/finish_sihai/bian_finish.png";
                    }
                }




            }

        }

        return {"worldPng":worldPng,"score":score};
    },
    checkIsRed:function (arr) {

        var isRed=true;
        var len=arr.length;
        for(var i=0;i<len;i++)
        {
            var c=arr[i];
            if(c.value!=2&&c.value!=7&&c.value!=10)
            {
                return false;
            }

        }


        return isRed;

    },
    isTiOrPao:function (arr) {

        if(arr.length!=4)
        {
            return 0;
        }
        var flg=true;
        var card=null;
        var len=arr.length;
        var isBack=false;
        for(var i=0;i<len;i++)
        {
            var c=arr[i];
            if(card==null)
            {
                card=c;
            }
            else{
                if(card.type!=c.type||card.value!=c.value)
                {
                    flg=false;
                    break;
                }

            }

            if(c.isBack==1)
            {
                isBack=true;
            }


        }
        if(!flg)
        {
            return 0;
        }

        if(isBack)
        {
            return 1;//提
        }
        else{
            return 2;//跑
        }


    },

    isPengOrWeiorKan:function (arr) {

        if(arr.length!=3)
        {
            return 0;
        }
        var flg=true;
        var card=null;
        var len=arr.length;
        var isBack=false;
        var isKan=true;
        for(var i=0;i<len;i++)
        {
            var c=arr[i];
            if(card==null)
            {
                card=c;
            }
            else{
                if(card.type!=c.type||card.value!=c.value)
                {
                    flg=false;
                    break;
                }



            }
            if(c.flg!=1)
            {
                isKan=false;
            }

            if(c.isBack==1)
            {
                isBack=true;
            }


        }
        if(!flg)
        {
            return 0;
        }
        if(isBack)
        {
            return 1;//偎
        }
        else if(isKan){

            return 2;//碰
        }
        else{
            return 3;//碰
        }


    },
    checkIsShunOrBian:function (arr) {


        if(arr.length!=3)
        {
            return 0;
        }


        //顺子


        var c1=arr[0];
        var c2=arr[1];
        var c3=arr[2];

        var minC=c1;
        if(minC.value>c2.value)
        {
            minC=c2;
        }
        if(minC.value>c3.value)
        {
            minC=c3;
        }
        for(var k=0;k<3;k++) {
            var cc = arr[k];
            if(cc==minC)
            {
                continue;
            }
            if(cc.value==(minC.value+1)&&(cc.type==minC.type))
            {

                for(var k2=0;k2<3;k2++) {
                    var cc2 = arr[k2];
                    if (cc2 == minC) {
                        continue;
                    }
                    if(cc2.value==(minC.value+2)&&(cc2.type==minC.type))
                    {
                        return 1;//顺子
                    }

                }

            }

        }


        //编子
        if(c1.value==c2.value&&c1.value==c3.value)
        {
            var typeCount=0;
            var typeFlg=c1.type;
            for(var k=0;k<3;k++) {
                var cc = arr[k];
                if(cc.type==typeFlg)
                {
                    typeCount++;
                }

            }

            if(typeCount==1||typeCount==2)
            {
                return 2;//编子
            }


        }

        return 0;

    },
    isOneTwoThreeOrTwoSevenTen:function (arr) {

        if(arr.length!=3)
        {
            return 0;
        }

        var c1=arr[0];
        var c2=arr[1];
        var c3=arr[2];

        if(c1.value==1||c2.value==1||c3.value==1)
        {


            for(var k=0;k<3;k++)
            {
                var cc=arr[k];
                if(cc.value==1)
                {
                    for(var k2=0;k2<3;k2++) {
                        var cc2 = arr[k2];
                        if(cc2.value==2)
                        {
                            for(var k3=0;k3<3;k3++) {
                                var cc3 = arr[k3];
                                if(cc3.value==3)
                                {

                                    return 1;//1/2/3


                                }

                            }

                        }

                    }

                }

            }

        }
        else if(c1.value==7||c2.value==7||c3.value==7)
        {


            for(var k=0;k<3;k++)
            {
                var cc=arr[k];
                if(cc.value==2)
                {
                    for(var k2=0;k2<3;k2++) {
                        var cc2 = arr[k2];
                        if(cc2.value==7)
                        {
                            for(var k3=0;k3<3;k3++) {
                                var cc3 = arr[k3];
                                if(cc3.value==10)
                                {
                                    return 2;//2/7/10


                                }

                            }

                        }

                    }

                }

            }

        }

        return 0;

    },
    onExit:function () {
        this._super();
        EventManager.getInstance().unregist(this);
        Service.getInstance().clear();

    },



});
