/**
 * Created by yungu on 16/8/23.
 */
var Login=cc.Layer.extend({


    ctor: function (sceneId) {
        this._super();


        this.sceneId=sceneId;


        loginState=0;
        
        var size = cc.director.getWinSize();
        var w = cc.view.getVisibleSize().width;
        var h = cc.view.getVisibleSize().height;

        var that=this;

        var size=cc.director.getWinSize();
        var w=cc.view.getVisibleSize().width;
        var h=cc.view.getVisibleSize().height;

        var bgSp=new cc.Sprite("res/ui/login/dt_bg_login.png");
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


        var nodeLayer = parseUI("res/ui/login/loginUI.json", CENTER);
        this.addChild(nodeLayer);

        var login = ccui.helper.seekWidgetByName(nodeLayer, "login");

        var youke = ccui.helper.seekWidgetByName(nodeLayer, "youke");

        if(isWeiXin==1)
        {
            youke.visible=false;
            login.addTouchEventListener(this.loginClicked, this);

        }
        else{
            login.visible=false;
            youke.addTouchEventListener(this.loginClicked, this);


        }


        this.select1 = ccui.helper.seekWidgetByName(nodeLayer, "select1");
        this.select1.addTouchEventListener(this.select1Clicked, this);

        this.select2 = ccui.helper.seekWidgetByName(nodeLayer, "select2");
        this.select2.addTouchEventListener(this.select2Clicked, this);

        EventManager.getInstance().regist("wx_get_code_event",this,this.wxCallBackFunc);
        EventManager.getInstance().regist("SOCKET_CLOSE_EVENT",this,this.socketError);
        Service.getInstance().regist(ENTER_SCENE_RESPONSE,this,this.onReceive);

        this.setSelected(true);

        //cc.log("#1");
        getDeviceId();
       // cc.log("#2");

        stopBgMusic();

        //cc.log("#3");
        var buildLab = new cc.LabelTTF(BUILD_TIME, FONT_NAME_APP, 20);
        buildLab.setColor(cc.color(255,255,255));
        buildLab.x=v_x+v_w-60;
        buildLab.y=v_y+20;
        this.addChild(buildLab,1);

        //cc.log("#4");
        var wx_account=cc.sys.localStorage.getItem("wx_account");
        if(wx_account!=undefined&&wx_account!=null&&wx_account!="")
        {
            this.loadLayer=new LoadLayer();
            this.addChild(this.loadLayer);

            this.setSelected(true);
            this.scheduleOnce(this.loginNoClicked, 1.0);
            //cc.log("#6");
        }

        var effectSound=cc.sys.localStorage.getItem("effectSound");
        var musicSound=cc.sys.localStorage.getItem("musicSound");

        if(effectSound!=undefined&&effectSound!="")
        {
            effectVolume=parseFloat(effectSound);
            cc.audioEngine.setEffectsVolume(effectVolume);
        }
        else{
            effectVolume=1;
            cc.audioEngine.setEffectsVolume(effectVolume);
        }
        if(musicSound!=undefined&&musicSound!="")
        {
            musicVolume=parseFloat(musicSound);
            cc.audioEngine.setMusicVolume(musicVolume);
        }
        else{
            musicVolume=1;
            cc.audioEngine.setMusicVolume(musicVolume);
        }

        getLocation();

        //cc.log("#5");


        //this.schedule(this.test, 1.0);
    },



    test:function(dt)
    {
        getWifiSignal();
    },


    loginNoClicked:function (dt) {


        var wx_account=cc.sys.localStorage.getItem("wx_account");
        if(wx_account!=undefined&&wx_account!=null&&wx_account!="")
        {
            var wx_pwd=cc.sys.localStorage.getItem("wx_pwd");
            var headimgurl=cc.sys.localStorage.getItem("headimgurl");
            var name=cc.sys.localStorage.getItem("name");

            this.account=wx_account;
            this.headUrl=headimgurl;
            this.name=name;
            this.loginHttpReq();

        }


    },

    wxCallBackFunc:function (obj,target) {

        cc.log("######wxCallBackFunc##########1");
        if(obj.code=="")
        {
            if(target.loadLayer!=null)
            {
                target.loadLayer.removeFromParent(true);
                target.loadLayer=null;
            }
            return;
        }

        cc.log("######wxCallBackFunc##########2:"+obj.code);
        var req={};
        req.type=1;
        req.code=obj.code;
        Service.getInstance().sendHttpRequest(GET_WX_INFO_REQUEST,req,target.getInfoCallBack.bind(target));

        cc.log("######wxCallBackFunc##########3");
    },
    getInfoCallBack:function (obj) {

        cc.log("获取token==============:"+obj.openid+"  "+obj.name);



        var img=obj.headimgurl;

        cc.log("head img:"+img);

        var index=img.lastIndexOf("/");
        img=img.substring(0,index);
        img+="/132";
        //cc.log("img=====:"+img);


        myPlayerInfo.wxName=obj.name;

        cc.sys.localStorage.setItem("wx_account",obj.openid);
        cc.sys.localStorage.setItem("wx_pwd","123456");
        cc.sys.localStorage.setItem("headimgurl",img);
        cc.sys.localStorage.setItem("name",obj.name);

        this.account=obj.openid;
        this.headUrl=img;
        this.name=obj.name;
        if(obj.sex==1)
        {
            //男
            this.sex=0;
        }
        else{//2 女
            this.sex=1;
        }

        this.loginHttpReq();


    },
    setSelected:function (isSelected) {
        this.selectedXieYi=isSelected;

        if(isSelected)
        {
            this.select1.visible=false;
            this.select1.setEnabled(false);
            this.select1.setTouchEnabled(false);

            this.select2.visible=true;
            this.select2.setEnabled(true);
            this.select2.setTouchEnabled(true);

        }
        else{

            this.select1.visible=true;
            this.select1.setEnabled(true);
            this.select1.setTouchEnabled(true);

            this.select2.visible=false;
            this.select2.setEnabled(false);
            this.select2.setTouchEnabled(false);

        }

    },
    socketError:function (obj,target) {

        var dialog=new DialogLayer();
        dialog.show("连接错误!");
        target.addChild(dialog);

        if(target.loadLayer!=null)
        {
            target.loadLayer.removeFromParent(true);
            target.loadLayer=null;
        }

    },
    loginClicked:function (sender, type) {


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
                
                playEffect(TOUCH_SOUND);

                if(!this.selectedXieYi)
                {
                    var dialog=new DialogLayer();
                    dialog.show("请先选择同意用户协议!");
                    this.addChild(dialog);
                    return;
                }

                if(this.loadLayer!=null)
                {
                    this.loadLayer.removeFromParent(true);
                    this.loadLayer=null;
                }

                this.loadLayer=new LoadLayer();
                this.addChild(this.loadLayer);

                if(isWeiXin==1)//微信登录
                {

                    weixinLogin();

                }
                else{//游客登录

                    cc.log("游客登录-====");
                    this.sex=1;
                    this.account=deviceId;//"yungu1020";//
                    this.headUrl="http://120.77.168.28/head.png";//"http://192.168.1.100:7788/head.png";
                    this.name="游客";
                    this.loginHttpReq();

                    cc.log("deviceId:"+deviceId);
                }


            }
                break;


            default:
                break;
        }
    },
    select1Clicked:function (sender, type) {


        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {

                this.setSelected(true);

            }
                break;


            default:
                break;
        }
    },
    select2Clicked:function (sender, type) {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {

                this.setSelected(false);

            }
                break;


            default:
                break;
        }

    },
    loginHttpReq:function () {


        this.scheduleOnce(this.loginTime, 1.0);



    },
    loginTime:function (dt) {

        getLocation();
        var loginRequest={};
        loginRequest.account=this.account;
        loginRequest.pwd="123456";
        loginRequest.headUrl=this.headUrl;
        loginRequest.name=this.name;
        loginRequest.sex=this.sex;
        cc.log("[http登录 account:"+this.account+"  name:"+loginRequest.name+",headUrl:"+this.headUrl+"]");
        Service.getInstance().sendHttpRequest(LOGIN_REQUEST,loginRequest,this.loginHttpCallBack.bind(this));
    },
    loginHttpCallBack:function (obj) {


        if(obj==null||obj.state==-1)
        {
            var dialog=new DialogLayer();
            dialog.show("登录失败!");
            this.addChild(dialog);

            if(this.loadLayer!=null)
            {
                this.loadLayer.removeFromParent(true);
                this.loadLayer=null;
            }

            return;
        }
        cc.log("obj.accountState::"+obj.accountState);
        if(obj.accountState==1)
        {
            //账号被封wx_get_code_event

             var obj={};
             obj.txt="[您的账号被管理员封掉]";
             EventManager.getInstance().fireEvent("TIP_INFO_EVENT",obj);

            if(this.loadLayer!=null)
            {
                this.loadLayer.removeFromParent(true);
                this.loadLayer=null;
            }

            return;

        }
        myPlayerInfo.account=obj.account;
        myPlayerInfo.pwd=obj.pwd;
        myPlayerInfo.ip=obj.ip;
        myPlayerInfo.port=obj.port;
        myPlayerInfo.uid=obj.uid;
        myPlayerInfo.name=obj.name;
        myPlayerInfo.gold=obj.gold;
        myPlayerInfo.diamond=obj.diamond;
        myPlayerInfo.score=obj.score;
        myPlayerInfo.headUrl=obj.headUrl;
        myPlayerInfo.clientIp=obj.clientIp;
        cc.log("[获取服务器IP成功,ip"+myPlayerInfo.ip+",port:"+myPlayerInfo.port+",uid:"+myPlayerInfo.uid+",name:"+myPlayerInfo.name+"]");



        if(socketMgr.close!=undefined)
        {
            socketMgr.close();
        }

        var s=new C_WSocket();
        s.connect(myPlayerInfo.ip,myPlayerInfo.port);
        socketMgr.socket=s;

        socketMgr.close=function () {

            if(socketMgr.socket!=undefined&&socketMgr.socket!=null)
            {
                socketMgr.socket.close();
                socketMgr.socket=null;
            }
            if(socketMgr.socket2!=undefined&&socketMgr.socket2!=null)
            {
                socketMgr.socket2.close();
                socketMgr.socket2=null;
            }
        }

        socketMgr.close2=function () {


            if(socketMgr.socket2!=undefined&&socketMgr.socket2!=null)
            {
                finishState=2;
                socketMgr.socket2.close();
                socketMgr.socket2=null;
            }
        }



        this.schedule(this.update, 1.0);



    },


    update:function (dt) {

        if(socketMgr.socket.isConnected)
        {
            this.unschedule(this.update);

            var req=new EnterSceneRequest();
            req.name=myPlayerInfo.name;
            req.uid=myPlayerInfo.uid;
            req.gps=locationStr;
            req.ip=myPlayerInfo.clientIp;
            socketMgr.socket.send(ENTER_SCENE_REQUEST,req);
            cc.log("[发送进入游戏请求]");
        }



    },
    onReceive:function(msgNumber,body,target)
    {

        switch(msgNumber)
        {

            case ENTER_SCENE_RESPONSE:
            {
                cc.log("进入场景应答"+body.state);

                if(body.state==0)
                {
                    SceneManager.getInstance().changeScene(SCENE_01,REPLACE_SCENE);

                }
                else
                {

                    if(target.loadLayer!=undefined&&target.loadLayer!=null)
                    {
                        target.loadLayer.removeFromParent(true);
                        target.loadLayer=null;
                    }

                    if(body.state==-3)
                    {
                        var dialog=new DialogLayer();
                        dialog.show("[此账号已经在其他机器上登录!]");
                        target.addChild(dialog);
                    }
                    else{
                        var dialog=new DialogLayer();
                        dialog.show("[登录服务器失败!]");
                        target.addChild(dialog);
                    }

                    if(socketMgr.close!=undefined)
                    {

                        socketMgr.close();
                    }

                }




            }
                break;


        }


    },
    onExit:function () {
        this._super();
        EventManager.getInstance().unregist(this);
        Service.getInstance().clear();

    },

});
