/**
 * Created by yungu on 16/11/17.
 */
var SocketErrorLayer=cc.Layer.extend({


    ctor: function (sceneId,txt) {
        this._super();

       
        finishState=2;

        this.touchLayer2=new TouchLayer();
        this.addChild(this.touchLayer2);
        this.touchLayer2.visible=false;

        var node = parseUI("res/ui/sub/tishi.json", CENTER);
        this.touchLayer2.addChild(node);


        var t= ccui.helper.seekWidgetByName(node, "t");
        if(txt!="")
        {
            t.setString(txt);
        }
        else{
            t.setString("通信异常,请检查网络!");
        }

        var b1= ccui.helper.seekWidgetByName(node, "b1");
        b1.addTouchEventListener(this.sureClicked,this);

        var b2= ccui.helper.seekWidgetByName(node, "b2");
        b2.addTouchEventListener(this.closeClicked2,this);
        b2.visible=false;
        b2.setEnabled(false);
        b2.setTouchEnabled(false);

        b1.x=(b1.x+b2.x)/2;
        
        Service.getInstance().clear();
        Service.getInstance().regist(ENTER_SCENE_RESPONSE,this,this.onReceive);
        EventManager.getInstance().regist("SOCKET_CLOSE_EVENT2",this,this.socketError);


        this.schedule(this.update2, 3.0);

        this.startConnected=true;
        this.connectCount=0;
    },
    socketError:function (obj,target) {

        var dialog=new DialogLayer();
        if(target.connectCount>0)
        {
            dialog.show("[尝试重新连接:"+target.connectCount+"次失败!]");
        }
        else{
            dialog.show("[尝试重新连接失败!]");
        }

        target.addChild(dialog,20);

        if(target.loadLayer!=null)
        {
            target.loadLayer.removeFromParent(true);
            target.loadLayer=null;
        }

        if(target.touchLayer2.visible)
        {
            return;
        }
        if(target.connectCount>=5)
        {
            target.connectCount=0;
            target.touchLayer2.visible=true;
           // target.startConnected=false;
        }
        else{
            target.startConnected=true;
        }



    },

    sureClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {


                var s=new C_WSocket();
                s.connect(myPlayerInfo.ip,myPlayerInfo.port);
                socketMgr.socket=s;

                cc.log("Ip:"+myPlayerInfo.ip+",port:"+myPlayerInfo.port);
                if(this.loadLayer!=null)
                {
                    this.loadLayer.removeFromParent(true);
                    this.loadLayer=null;
                }

                this.loadLayer=new LoadLayer();
                this.addChild(this.loadLayer,20);

                 this.schedule(this.update, 1.0);


                this.touchLayer2.visible=false;
            }
                break;


            default:
                break;
        }


    },
    update2:function (dt) {

        if(!this.startConnected)
        {
            return;
        }
        this.startConnected=false;
        this.sureClicked(null,ccui.Widget.TOUCH_ENDED);
        this.connectCount++;

    },
    update:function (dt) {


        if(socketMgr.socket.isConnected)
        {

            cc.log("socketMgr.socket.isConnected Ip:"+myPlayerInfo.ip+",port:"+myPlayerInfo.port);

            this.unschedule(this.update);

            var req=new EnterSceneRequest();
            req.name=myPlayerInfo.name;
            req.uid=myPlayerInfo.uid;
            req.gps=locationStr;
            req.ip=myPlayerInfo.clientIp;
            socketMgr.socket.send(ENTER_SCENE_REQUEST,req);
            cc.log("[发送进入游戏请求2]");
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
                    Service.getInstance().clear();
                    finishState=0;
                    target.removeFromParent(true);
                    SceneManager.getInstance().changeScene(SCENE_01,REPLACE_SCENE);

                }
                else if(body.state==-2)
                {
                    
                    var dialog=new DialogLayer();
                    dialog.show("[您的账号被管理员封掉]");
                    target.addChild(dialog);
                    if(socketMgr.close!=undefined)
                    {
                        socketMgr.close();
                    }

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
    closeClicked2:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                Service.getInstance().clear();
                finishState=0;
                this.removeFromParent(true);
                SceneManager.getInstance().changeScene(SCENE_LOGIN,REPLACE_SCENE);
            }
                break;


            default:
                break;
        }


    },
    onExit:function () {
        this._super();
        EventManager.getInstance().unregist(this);


    },

});