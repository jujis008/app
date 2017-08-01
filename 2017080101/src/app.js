
var module={};

var AppLayer = cc.Layer.extend({
    sprite:null,
    nextPos:true,
    frameDt:0.01,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        appLayer=this;
        
        SceneManager.getInstance().setAppScene(this);
      
        this.schedule(this.gameLogic,0.01);
        this.schedule(this.netCheck,2.0);

        checkInstallWeiXin();

        //cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, this.onHide);
        //cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, this.onShow);
        //hasNewVersion=true;
     
        // if(loginSelectedFlg==0)
        // {
        //     //
        //     this._camera = new cc.Camera(cc.Camera.Mode.PERSPECTIVE, 60,size.width/size.height, 0, 3000);
        //     //this._camera = new cc.Camera(cc.Camera.Mode.ORTHOGRAPHIC,  size.width,size.height, 0, 1000);
        //     this._camera.setCameraFlag(cc.CameraFlag.USER1);
        //     this._camera.setPosition3D(cc.math.vec3(size.width/2,size.height/2,  (size.height*0.5)/Math.tan(30*0.01745329252)));//Math.atan(60*0.01745329252)*size.height
        //     //  this._camera.lookAt(cc.math.vec3(size.width/2,size.height/2,0));
        //     this.addChild(this._camera);
        // }
    

        // var eyePosOld=this._camera.getPosition3D();
        //
        // var eyePos={x:size.width/2,y:size.height/2,z:eyePosOld.z};
        //
        // this._camera.setPosition3D(eyePos);
        //
        //
        // this._camera.lookAt(cc.math.vec3(eyePos.x,eyePos.y,0), cc.math.vec3(0, 1, 0));


        //
        //
        // this._camera2 = new cc.Camera(cc.Camera.Mode.ORTHOGRAPHIC,  size.width,size.height, 0, 1000);
        // this._camera2.setCameraFlag(cc.CameraFlag.USER2);
        // this._camera2.setPosition3D(cc.math.vec3(0,0,1000));
        // //  this._camera.lookAt(cc.math.vec3(size.width/2,size.height/2,0));
        // this.addChild(this._camera2);

        EventManager.getInstance().regist("TIP_INFO_EVENT",this,this.tipInfo)

        EventManager.getInstance().regist("SOCKET_CLOSE_EVENT",this,this.socketError);

       

        return true;
    },
    netCheck:function (dt) {

        getNetWorkType();

        if(lastWifi_type==""&&wifi_type!="")
        {
            lastWifi_type=wifi_type;
        }
        else if(lastWifi_type!=wifi_type)
        {
            var str="";
            if(wifi_type=="no")
            {
                str="网络断开,请确认网络是否正常!"
            }
            else{

                str="网络由【"+lastWifi_type+"】切换到【"+wifi_type+"】需要重新连接!"

                // if(wifi_type!="wifi")
                // {
                //     str="切换到移动网络";
                // }
                // else{
                //     str="切换到wifi网络";
                // }
            }

            // var dialog=new DialogLayer();
            // dialog.show(str);
            // this.addChild(dialog,10);


            lastWifi_type=wifi_type;


            if(SceneManager.getInstance().currentSceneId!=SCENE_LOGIN)
            {
                // var layer=new SocketErrorLayer("",str);
                // this.addChild(layer,100);

                if(socketMgr.close!=undefined)
                {
                    socketMgr.close();
                }
            }



        }

    },
    socketError:function (obj,target) {

        if(SceneManager.getInstance().currentSceneId!=SCENE_LOGIN)
        {

            //var layer=new SocketErrorLayer("","");
            //target.addChild(layer,100);

            if(target.touchLayer2!=undefined&&target.touchLayer2!=null)
            {
                return;
            }
            target.touchLayer2=new TouchLayer();
            target.addChild(target.touchLayer2,100);

            var node = parseUI("res/ui/sub/tishi.json", CENTER);
            target.touchLayer2.addChild(node);


            var t= ccui.helper.seekWidgetByName(node, "t");
            t.setString("通信异常,请检查网络!");

            var b1= ccui.helper.seekWidgetByName(node, "b1");
            b1.addTouchEventListener(target.sureClicked,target);

            var b2= ccui.helper.seekWidgetByName(node, "b2");
            b2.visible=false;


            b1.x=(b1.x+b2.x)/2;


        }


    },
    sureClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                this.touchLayer2.removeFromParent(true);
                this.touchLayer2=null;
                socketMgr.close();
                SceneManager.getInstance().changeScene(SCENE_LOGIN,REPLACE_SCENE);

            }
                break;


            default:
                break;
        }


    },

    tipInfo:function (obj,target) {

        var dialog=new DialogLayer();
        dialog.show(obj.txt);
        target.addChild(dialog,1);
    },
    onHide:function () {
        cc.log("onHide");
        // gameState=1;
        // if(socketMgr.close!=undefined)
        // {
        //     //socketMgr.socket.close();
        //     //socketMgr.socket=null;
        //    // socketMgr.close();
        // }

    },
    onShow:function () {
        cc.log("dt:onShow");
        // if(gameState==1)
        // {
        //    // cc.log("=====onshow");
        //
        //     // var account=cc.sys.localStorage.getItem("wx_account");
        //     // if(account!=undefined&&account!="")
        //     // {
        //     //     SceneManager.getInstance().changeScene(SCENE_INIT,RUN_SCENE);
        //     //
        //     // }
        //     // else{
        //     //     SceneManager.getInstance().changeScene(SCENE_LOGIN,RUN_SCENE);
        //     //
        //     // }
        //
        //
        //    // SceneManager.getInstance().changeScene(SCENE_LOGIN,REPLACE_SCENE);
        // }

    },

    checkSocketQueue:function (socket,dt) {

        if(socket!=null&&socket.isConnected)
        {
            var len=socket.msgQueue.length;

            if(len>0)
            {
               // cc.log("queue############:"+len);
                var obj=socket.msgQueue[0];
                socket.msgQueue.splice(0,1);

                Service.getInstance().excute(obj.msgNumber,obj.body);

            }
            if(socket!=null)
            {
                len=socket.msgQueue2.length;
                //cc.log("msgQueue2:"+len);
                if(len>0)
                {
                    var obj=socket.msgQueue2[0];
                    socket.msgQueue2.splice(0,1);
                    Service.getInstance().excute(obj.msgNumber,obj.body);

                   // this.nextPos=false;

                }



            }

            if(socket!=null)
            {
                len=socket.msgQueue3.length;
                //cc.log("len=:"+len);
                if(len>0)
                {
                    var obj=socket.msgQueue3[0];
                    socket.msgQueue3.splice(0,1);
                    Service.getInstance().excute(obj.msgNumber,obj.body);
                }



            }

            if(socket.hasSendHeart)
            {
                socket.waitTime-=dt;
                if(socket.waitTime<=0)
                {
                    //
                    cc.log("心跳超时!");
                    socket.close();

                }

            }
            else{
                if(socket.waitSendTime==undefined)
                {
                    socket.waitSendTime=0;
                }
                socket.waitSendTime+=dt;
                if(socket.waitSendTime>5)
                {
                    var heart=new HeartClientToServerRequest();
                    socket.send(HEART_CLIENT_TO_SERVER_REQUEST,heart);
                    socket.hasSendHeart=true;
                    socket.waitTime=10;
                    socket.waitSendTime=0;

                   // cc.log("发送心跳");
                }

            }
            

        }

    },
    onExit:function () {

        this._super();
        EventManager.getInstance().unregist(this);
    },
    gameLogic:function(dt)
    {

        // if(this.lastDate1==undefined)
        // {
        //     this.lastDate1=new Date().getTime();
        // }
        // else {
        //     var aa = new Date().getTime() - this.lastDate1;
        //     this.lastDate1 = new Date().getTime();
        //     if (aa > 50) {
        //         cc.log("dt:" + aa);
        //     }
        //     this.frameDt=aa/1000;
        // }
        //

        lastGameDt=dt;

        if(SceneManager.getInstance().isChangSceneing)
        {
            return;
        }

        this.checkSocketQueue(socketMgr.socket2,dt);
        this.checkSocketQueue(socketMgr.socket,dt);


        var queueLen=downLoadQueue.length;
        if(queueLen>0&&nextDown)
        {

            var obj=downLoadQueue[0];
            downLoad(obj.path,obj.savePath);
            // for(var i=0;i<queueLen;i++)
            // {
            //     var obj=downLoadQueue[i];
            //     downLoad(obj.path,obj.savePath);
            // }
            downLoadQueue.splice(0,1);

            nextDown=false;
        }




        
    }
});
//
// var AppScene = cc.Scene.extend({
//
//     ctor:function () {
//
//         this.addChild(layer);
//     },
//     onEnter:function () {
//         this._super();
//
//     }
// });

