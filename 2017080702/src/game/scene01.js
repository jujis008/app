/**
 * Created by yungu on 16/11/4.
 */

var UI_ZODER=100;

var Scene01=cc.Layer.extend({


    ctor: function (sceneId) {
        this._super();
        this.sceneId = sceneId;

        var size=cc.director.getWinSize();
        var w=cc.view.getVisibleSize().width;
        var h=cc.view.getVisibleSize().height;

        var bgSp=new cc.Sprite("res/ui/main/icon2_main.png");
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

        bgSp.setScale(scl);
        this.addChild(bgSp);

        var rightTopNode = parseUI("res/ui/main/rightTop.json", RIGHT_TOP);
        this.addChild(rightTopNode);

        //元宝
        this.yuanbao=ccui.helper.seekWidgetByName(rightTopNode, "t1");
        this.yuanbao.setString(myPlayerInfo.gold+"");

        // //钻石
        // var zuanshi=ccui.helper.seekWidgetByName(leftBottomNode, "t2");
        // zuanshi.setString(myPlayerInfo.diamond);
        //

        var goldButton = ccui.helper.seekWidgetByName(rightTopNode, "gold");
        goldButton.addTouchEventListener(this.shopClicked,this);

        // var diamondButton = ccui.helper.seekWidgetByName(leftBottomNode, "diamond");
        // diamondButton.addTouchEventListener(this.shopClicked,this);


        var leftTopNode = parseUI("res/ui/main/leftTop.json", LEFT_TOP);
        this.addChild(leftTopNode);

        //ID
        var idLab=ccui.helper.seekWidgetByName(leftTopNode, "id");
        idLab.setString("ID:"+myPlayerInfo.uid);
        //名字
        var nameLab=ccui.helper.seekWidgetByName(leftTopNode, "name");
        nameLab.setString(myPlayerInfo.name);

        //头像
        this.headBg=ccui.helper.seekWidgetByName(leftTopNode, "icon");
        this.headBg.setLocalZOrder(2);
        //this.headBg.visible=false;

        var headName=myPlayerInfo.uid+"_head.png";
        var headIconPath=getSkinPath(headName);
        if(checkFileExit(headIconPath))
        {
            var headSprite=new cc.Sprite(headIconPath);
            headSprite.x=this.headBg.x;
            headSprite.y=this.headBg.y;
            changeHead(headSprite,1);
            this.headBg.getParent().addChild(headSprite,1);
        }
        else{
            pushDownLoadQueue(headName,2,myPlayerInfo.headUrl);
        }


        var centerBottomNode = parseUI("res/ui/main/centerBottom.json", CENTER_BOTTOM);
        this.addChild(centerBottomNode);

        //介绍
        var jieshao = ccui.helper.seekWidgetByName(centerBottomNode, "jieshao");
        jieshao.addTouchEventListener(this.jieshaoClicked,this);
        jieshao.visible=true;

        //邮件
        var mail = ccui.helper.seekWidgetByName(centerBottomNode, "mail");
        mail.addTouchEventListener(this.mailClicked,this);

        //战绩
        var zhanji = ccui.helper.seekWidgetByName(centerBottomNode, "zhanji");
        zhanji.addTouchEventListener(this.zhanjiClicked,this);

        //排行
        var paihang = ccui.helper.seekWidgetByName(centerBottomNode, "paihang");
        paihang.addTouchEventListener(this.paihangClicked,this);

        //商店
        var shop = ccui.helper.seekWidgetByName(centerBottomNode, "shop");
        shop.addTouchEventListener(this.shopClicked,this);

        var centerTopNode = parseUI("res/ui/main/centerTop.json", CENTER_TOP);
        this.addChild(centerTopNode);
        
        var centerNode = parseUI("res/ui/main/center2.json",RIGHT_CENTER);
        this.addChild(centerNode);

        //创建房间
        var chuangjian1 = ccui.helper.seekWidgetByName(centerNode, "chuangjian1");
        chuangjian1.addTouchEventListener(this.chuangjianClicked,this);

        // var chuangjian2 = ccui.helper.seekWidgetByName(centerNode, "chuangjian2");
        // chuangjian2.addTouchEventListener(this.chuangjianClicked,this);


        //加入房间
        var jiaru1 = ccui.helper.seekWidgetByName(centerNode, "jiaru1");
        jiaru1.addTouchEventListener(this.jiaruClicked,this);

        // var jiaru2 = ccui.helper.seekWidgetByName(centerNode, "jiaru2");
        // jiaru2.addTouchEventListener(this.jiaruClicked,this);

        //消息
        this.msgPanel=ccui.helper.seekWidgetByName(centerNode, "msg");
        this.msgPanel.visible=false;
        // this.msg1=ccui.helper.seekWidgetByName(centerNode, "msg1");
        // this.msg1.visible=false;


        var txtLab=ccui.helper.seekWidgetByName(this.msgPanel, "text");
        txtLab.orgX=txtLab.x;
        txtLab.orgY=txtLab.y;
        txtLab.visible=false;

        //var rightBottomNode = null;

        // rightBottomNode=parseUI("res/ui/main/rightBottom.json", RIGHT_CENTER);
        // this.addChild(rightBottomNode);

        //分享
        var share = ccui.helper.seekWidgetByName(centerBottomNode, "b1");
        share.addTouchEventListener(this.shareClicked,this);

        //设置
        var set = ccui.helper.seekWidgetByName(centerBottomNode, "b2");
        set.addTouchEventListener(this.setClicked,this);

//        //返回
//        var returnB = ccui.helper.seekWidgetByName(rightTopNode, "b3");
//        returnB.addTouchEventListener(this.returnClicked,this);


        // var rightTopNode = parseUI("res/ui/main/rightTop.json", RIGHT_TOP);
        // this.addChild(rightTopNode);




        EventManager.getInstance().regist("DOWN_LOAD_FINISHED_EVENT",this,this.downLoadFinished);
       // EventManager.getInstance().regist("key_back_event",this,this.backEvent);

        var that=this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (key, event) {


            },
            onKeyReleased: function (key, event) {

                if(key==6)
                {
                    that.backEvent(null,that);

                }
            }
        }, this);

        Service.getInstance().regist(CHECK_OLD_ROOM_RESPONSE,this,this.onReceive);
        Service.getInstance().regist(JOIN_ROOM_RESPONSE,this,this.onReceive);
        Service.getInstance().regist(GONGGAO_NOTIFY,this,this.onReceive);
        Service.getInstance().regist(ROLEINFO_NOTIFY,this,this.onReceive);


        EventManager.getInstance().regist("SHOP_EVENT",this,this.shopEvent);


        socketMgr.close2();


        var getLayer=new GetServerLayer(2,"",function(state)
        {

            if(state==0)
            {
                var req=new CheckOldRoomRequest();
                req.uid=myPlayerInfo.uid;
                socketMgr.socket2.send(CHECK_OLD_ROOM_REQUEST,req);

            }
            else{
                socketMgr.close2();

            }
        });
        this.addChild(getLayer,100);




        var req=new GetRoleInfoRequest();
        req.uid=myPlayerInfo.uid;
        socketMgr.socket.send(GET_ROLE_INFO_REQUEST,req);

        playBgMusic(1);

        gameState=GAME_NONE;


        if(goodsArr.length<=0)
        {
            var req={};
            Service.getInstance().sendHttpRequest(GOOD_LIST_REQUEST,req,this.goodListCallBack.bind(this));


        }



        this.scheduleOnce(this.resetState, 3.0);



    },
    resetState:function(dt)
    {
        finishState=0;
    },
    goodListCallBack:function (obj) {

        cc.log("obj.state:"+obj.state);
        if(obj.state==0)
        {
            goodsArr=obj.goods;
            var len=goodsArr.length;
            var str="";
            for(var i=0;i<len;i++)
            {
                var g=goodsArr[i];
                if(i==(len-1))
                {
                    str+=g.id;
                }
                else{
                    str+=g.id+",";
                }
                
            }

            setGoodsId(str);

        }

    },
    onReceive:function(msgNumber,body,target)
    {

        switch(msgNumber)
        {

            case CHECK_OLD_ROOM_RESPONSE:
            {
                cc.log("[检查房间应答:"+body.state+"]");

                if(body.state==0)//0:没有未完成的牌局,1:有
                {


                }
                else
                {

                    if(target.loadLayer!=null)
                    {
                        target.loadLayer.removeFromParent(true);
                        target.loadLayer=null;
                    }
                    target.loadLayer=new LoadLayer();
                    target.addChild(target.loadLayer,100);


                    var req=new JoinRoomRequest();
                    req.uid=myPlayerInfo.uid;
                    req.roomId=body.roomId;
                    socketMgr.socket2.send(JOIN_ROOM_REQUEST,req);

                    JOIN_ROOM_TYPE=1;

                }




            }
                break;
            case JOIN_ROOM_RESPONSE:
            {
                cc.log("[加入房间应答:"+body.state+"]");

                if(body.state==0)
                {


                    SceneManager.getInstance().changeScene(ROOM_SCENE,REPLACE_SCENE);




                }
                else if(body.state==-2)
                {
                    var obj={};
                    obj.state=-2;
                    obj.txt=body.txt;
                    EventManager.getInstance().fireEvent("JOIN_ROOM_FAILED_EVENT",obj);



                }
                else if(body.state==-3)
                {
                    var obj={};
                    obj.state=-1;
                    EventManager.getInstance().fireEvent("JOIN_ROOM_FAILED_EVENT",obj);

                    if(target.loadLayer!=null)
                    {
                        target.loadLayer.removeFromParent(true);
                        target.loadLayer=null;
                    }

                    var dialog=new DialogLayer();
                    dialog.show("[无此房间]");
                    target.addChild(dialog,100);


                }
                else
                {

                    var obj={};
                    obj.state=-1;
                    EventManager.getInstance().fireEvent("JOIN_ROOM_FAILED_EVENT",obj);

                    if(target.loadLayer!=null)
                    {
                        target.loadLayer.removeFromParent(true);
                        target.loadLayer=null;
                    }

                    var dialog=new DialogLayer();
                    dialog.show("[已经满员]");
                    target.addChild(dialog,100);


                    return;

                }




            }
                break;
            case GONGGAO_NOTIFY:
            {
                cc.log("公告");

                target.msgPanel.visible=true;
                //target.msg1.visible=true;
                
                var txt=ccui.helper.seekWidgetByName(target.msgPanel, "text");
                txt.visible=false;

                if(target.msgLab!=undefined&&target.msgLab!=null)
                {
                    target.msgLab.removeFromParent(true);
                    target.msgLab=null;
                }

                target.msgLab = txt.clone();//new cc.LabelTTF(body.txt, FONT_NAME_APP, 20);
                target.msgLab.visible=true;
                // target.msgLab.setColor(cc.color(255,255,255));
                // target.msgLab.setAnchorPoint(0.5,0.5);
                // target.msgLab.x=txt.orgX;
                // target.msgLab.y=txt.orgY;
                target.msgLab.setString(body.txt);
                target.msgPanel.addChild(target.msgLab);

                // var panelH=target.msgPanel.getContentSize().height;

                // var h=target.msgLab.getContentSize().height;
                // target.msgLab.y-=panelH;
                // var dis=target.msgLab.y+h+panelH;
                // var t=(h+panelH)/50;
                // //cc.log("w:::::::"+t);
                // var moveAction = cc.moveTo(t, cc.p(target.msgLab.x,dis));
                // var moveAction2 = cc.moveTo(0, cc.p(target.msgLab.x,target.msgLab.y));
                // var actionArray=[];
                // actionArray.push(moveAction);
                // actionArray.push(moveAction2);
                // var actionSequence = cc.sequence(actionArray).repeatForever();
                // target.msgLab.runAction(actionSequence);

                // target.msgLab = new cc.LabelTTF(body.txt, FONT_NAME_APP, 20);
                // target.msgLab.setColor(cc.color(255,255,255));
                // target.msgLab.setAnchorPoint(0,0.5);
                // target.msgLab.x=txt.orgX;
                // target.msgLab.y=txt.orgY;
                // target.msgPanel.addChild(target.msgLab);
                //
                var panelW=target.msgPanel.getContentSize().width;
                
                var w=target.msgLab.getContentSize().width;
                target.msgLab.x+=panelW;
                var dis=target.msgLab.x-w-panelW;
                var t=(w+panelW)/50;
                //cc.log("w:::::::"+t);
                var moveAction = cc.moveTo(t, cc.p(dis,target.msgLab.y));
                var moveAction2 = cc.moveTo(0, cc.p(target.msgLab.x,target.msgLab.y));
                var actionArray=[];
                actionArray.push(moveAction);
                actionArray.push(moveAction2);
                var actionSequence = cc.sequence(actionArray).repeatForever();
                target.msgLab.runAction(actionSequence);


            }
                break;
            case ROLEINFO_NOTIFY:
            {
                cc.log("用户信息更新");

                var a=myPlayerInfo.gold;
                myPlayerInfo.gold=body.user.gold;
                target.yuanbao.setString(myPlayerInfo.gold+"");

                a=myPlayerInfo.gold-a;
                if(a>0)
                {
                    var dialog=new DialogLayer();
                    dialog.show("[恭喜！增加钻石："+a+"]");
                    target.addChild(dialog,100);
                }


            }
                break;


        }


    },
    shareClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                var layer=new BindLayer(this.sceneId);
                this.addChild(layer,UI_ZODER);

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


                var layer=new SetLayer(this.sceneId,1);
                this.addChild(layer,UI_ZODER);

                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },
    returnClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
               // SceneManager.getInstance().changeScene(SCENE_LOGIN,REPLACE_SCENE);

                if(this.exitLayer==undefined||this.exitLayer==null)
                {
                    this.exitLayer=new TouchLayer();
                    this.addChild(this.exitLayer,100000);

                    var node = parseUI("res/ui/sub/tishi.json", CENTER);
                    this.exitLayer.addChild(node);

                    var b1= ccui.helper.seekWidgetByName(node, "b1");
                    b1.addTouchEventListener(this.exitClicked,this);

                    var b2= ccui.helper.seekWidgetByName(node, "b2");
                    b2.addTouchEventListener(this.cancleClicked,this);

                    var t= ccui.helper.seekWidgetByName(node, "t");
                    t.setString("确定关闭程序吗?");
                    t.setFontSize(25);
                    t.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);

                    playEffect(TOUCH_SOUND);
                }


            }
                break;


            default:
                break;
        }


    },
    exitClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {

                exitApp();

                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },
    cancleClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {

                this.exitLayer.removeFromParent(true);
                this.exitLayer=null;

                playEffect(TOUCH_SOUND);


            }
                break;


            default:
                break;
        }


    },

    datingClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {

                var tip=new TipInfoLayer("本功能暂未开放,敬请期待");
                this.addChild(tip,UI_ZODER);

                playEffect(TOUCH_SOUND);

            }
                break;


            default:
                break;
        }


    },
    chuangjianClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                if(SHOW_RULE_LAYER==1)
                {
                    var layer=new RuleLayer(this.sceneId);
                    this.addChild(layer,UI_ZODER);
                }
                else{
                    var layer=new CreateRoomLayer(this.sceneId);
                    this.addChild(layer,UI_ZODER);
                }


                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },
    jiaruClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {

                var layer=new JoinRoomLayer(this.sceneId);
                this.addChild(layer,UI_ZODER);

                playEffect(TOUCH_SOUND);


            }
                break;


            default:
                break;
        }


    },

    jieshaoClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                var layer=new JieShaoLayer(this.sceneId);
                this.addChild(layer,UI_ZODER);

                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },
    mailClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                var layer=new MailLayer(this.sceneId);
                this.addChild(layer,UI_ZODER);

                playEffect(TOUCH_SOUND);

            }
                break;


            default:
                break;
        }


    },
    zhanjiClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                var layer=new ZhanJiLayer(this.sceneId);
                this.addChild(layer,UI_ZODER);

                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },
    paihangClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {

                cc.log("########排行===================");
                var layer=new PaiHangLayer(this.sceneId);
                this.addChild(layer,UI_ZODER);

                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },
    shopClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                var layer=new ShopLayer(this.sceneId);
                this.addChild(layer,UI_ZODER);

                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },
    shopEvent:function (obj,target) {

        var layer=new ShopLayer(this.sceneId);
        target.addChild(layer,UI_ZODER);
    },
    backEvent:function (obj,target) {

        target.returnClicked(obj, ccui.Widget.TOUCH_ENDED);

    },
    downLoadFinished:function (obj,target) {
        var path=obj.savePath;
        var filePath=path.split("/");
        var fileName="";
        if(filePath.length>0) {
            fileName = filePath[filePath.length - 1];

        }
        var fix=getFix(fileName);
        cc.log("#########downfinished:"+fix+" "+fileName);
        if(fix==".spx")
        {

        }
        else if(fix==".png"||fix==".jpg"){

            cc.log("######下载完成#scene01:" + filePath);

            var headName=myPlayerInfo.uid+"_head.png";
            var headIconPath=getSkinPath(headName);
            if(checkFileExit(headIconPath))
            {
                var headSprite=new cc.Sprite(headIconPath);
                headSprite.x=target.headBg.x;
                headSprite.y=target.headBg.y;
                changeHead(headSprite,1);
                target.headBg.getParent().addChild(headSprite,1);
            }


        }

    },
    onExit:function () {
        this._super();
        EventManager.getInstance().unregist(this);
        Service.getInstance().clear();

    },


});
