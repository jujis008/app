/**
 * Created by yungu on 2017/4/5.
 */
var GetServerLayer=cc.Layer.extend({


    ctor: function (type,obj,callBack) {
        this._super();

        var touchLayer=new TouchLayer();
        this.addChild(touchLayer);


        this.loadLayer=new LoadLayer();
        this.addChild(this.loadLayer,100);

        this.callBack=callBack;


        if(type==0||type==1||type==2)
        {
            Service.getInstance().regist(GET_IP_RESPONSE,this,this.onReceive);



            var req=new GetIpRequest();
            req.type=type;//0:创建房间,1:加入房间,2:检测未完成房间
            req.uid=myPlayerInfo.uid;
            req.roomId=obj;
            socketMgr.socket.send(GET_IP_REQUEST,req);

        }
        else if(type==4)//
        {

            this.connectToServer(obj);
        }
        Service.getInstance().regist(ENTER_SCENE_RESPONSE,this,this.onReceive);


    },


    onReceive:function(msgNumber,body,target)
    {

        switch(msgNumber)
        {

            case GET_IP_RESPONSE:
            {
                cc.log("[获取服务器ip应答:"+body.state+"]");

                if(body.type==0)//0:创建房间,1:加入房间,2:检测未完成房间
                {
                    target.connectToServer(body);

                }
                else if(body.type==1)
                {
                    if(body.state!=0)
                    {
                        target.close();
                        target.callBack(-1);
                    }
                    else{
                        target.connectToServer(body);
                    }
                }
                else if(body.type==2)
                {

                    if(body.state!=0)
                    {
                        target.close();
                        target.callBack(-1);
                    }
                    else{
                        target.connectToServer(body);
                    }

                }



            }
                break;
            case ENTER_SCENE_RESPONSE:
            {
                cc.log("GetServerLayer 进入场景应答"+body.state);

                if(body.state==0)
                {
                    target.callBack(0);

                    target.close();
                }
                else
                {


                    target.close();

                    if(socketMgr.close2!=undefined)
                    {
                        socketMgr.close2();
                    }

                    target.callBack(-1);

                }




            }
                break;


        }


    },

    connectToServer:function(obj)
    {

        cc.log("[连接："+obj.ip+":"+obj.port+"]");

        socketMgr.close2();

        var s=new C_WSocket();
        s.connect(obj.ip,obj.port);
        socketMgr.socket2=s;
        socketMgr.socket2.obj=obj;

        uploadUrl="http://"+obj.ip+":"+obj.uploadPort+"/upload";
        downLoadSpxUrl="http://"+obj.ip+":"+obj.tomcatPort+"/voice";

        console.log("uploadUrl:"+uploadUrl);
        console.log("downLoadSpxUrl:"+downLoadSpxUrl);

        this.schedule(this.update, 1.0);

    },
    update:function (dt) {

        if(socketMgr.socket2.isConnected)
        {
            this.unschedule(this.update);

            var req=new EnterSceneRequest();
            req.name=myPlayerInfo.name;
            req.uid=myPlayerInfo.uid;
            req.gps=locationStr;
            req.ip=myPlayerInfo.clientIp;
            socketMgr.socket2.send(ENTER_SCENE_REQUEST,req);
            cc.log("[发送进入游戏请求#2]");
        }



    },

    close:function()
    {
        this.removeFromParent(true);

    },

    onExit:function () {
        this._super();
        EventManager.getInstance().unregist(this);
        Service.getInstance().unregist(this);

    },


});