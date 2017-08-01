/**
 * Created by yungu on 16/7/28.
 */



var WebSocket = WebSocket || window.WebSocket || window.MozWebSocket;


var SocketIO = SocketIO || window.io;

var C_WSocket=function () {

    this.isConnected=false;
    this.msgQueue=[];
    this.msgQueue2=[];
    this.msgQueue3=[];
    this.sendId=0;
    this.scene=null;
    this.hasSendHeart=false;
    
    this.connect=function (ip,port) {


       //  this.socket = SocketIO.connect("http://192.168.1.100:8000/", {"force new connection" : true});
       //  //this.socket.tag = "Cocos2d-JS Client1";
       //
       //  //注册服务器端事件
       // // this.socket.on("callClientEvent", this.callClientEvent);
       //
       //  this.socket.on("connect", function() {
       //      cc.log('建立连接');
       //
       //      that.isConnected=true;
       //
       //  });
       //  this.socket.on("message", function(data) {
       //
       //      that.t2 = new Date();
       //      console.log(":通信时间差:"+(that.t2.getTime()-that.t1.getTime()));
       //
       //     // var data = evt.data;
       //      var buf = new Uint8Array(data);
       //      var byteBuf=ByteBufferManager.getInstance().getFromPool();//new ByteBuffer();
       //      //byteBuf.initBlank();
       //      byteBuf.setMsg(buf);
       //      var msgNumber=byteBuf.readInt16();
       //      //console.log("client msgNumber:"+msgNumber);
       //      var obj={};
       //      var body=MessageFactory.getInstance().build(msgNumber,byteBuf);
       //      obj.msgNumber=msgNumber;
       //      obj.body=body;
       //      ByteBufferManager.getInstance().appendToPool(byteBuf);
       //
       //      // cc.log("============:"+msgNumber);
       //      if(msgNumber==HEART_SERVER_TO_CLIENT_REQUEST) {
       //          // cc.log("============");
       //
       //          // var a=new Date()-0;
       //          //  cc.log("HEART_SERVER_TO_CLIENT_REQUEST");
       //
       //          var heart=new HeartClientToServerResponse();
       //          heart.m_id=this.m_id;
       //          socketMgr.socket.send(HEART_CLIENT_TO_SERVER_RESPONSE,heart);
       //
       //
       //      }
       //      else  if(msgNumber==HEART_SERVER_TO_CLIENT_RESPONSE) {
       //
       //          //cc.log("=======心跳收到====="+body.m_id+"   "+that.scene.uiLayer.lastMId);
       //          if (that.scene.uiLayer.lastMId == body.m_id) {
       //              that.scene.uiLayer.lastMId = 0;
       //              var recTime = new Date();
       //              that.scene.uiLayer.fpsTime = recTime - that.scene.uiLayer.sendTime;
       //          }
       //
       //      }
       //      else if(msgNumber==PLAYER_POSITION_NOTIFY)
       //      {
       //          that.msgQueue2=[];
       //          that.msgQueue2.push(obj);
       //      }
       //      else if(msgNumber==TU_BALL_NOTIFY){
       //          that.msgQueue3=[];
       //          that.msgQueue3.push(obj);
       //      }
       //      else{
       //          that.msgQueue.push(obj);
       //      }
       //  });
       //  this.socket.on("error", function() {
       //      cc.log('连接错误');
       //      that.isConnected=false;
       //      if(finishState==1)
       //      {
       //          return;
       //      }
       //      SceneManager.getInstance().changeScene(SCENE_INIT,REPLACE_SCENE);
       //  });
       //  this.socket.on("disconnect", function() {
       //      cc.log('连接关闭');
       //      that.isConnected=false;
       //      if(finishState==1)
       //      {
       //          return;
       //      }
       //      SceneManager.getInstance().changeScene(SCENE_INIT,REPLACE_SCENE);
       //  });



        //this.host = "ws://121.42.15.211:8000";
        this.host = "ws://"+ip+":"+port;
        cc.log('开始连接:'+this.host);
        this.socket = new WebSocket(this.host);
        var that=this;
        this.socket.binaryType = "arraybuffer";
        this.socket.onopen = function(evt){
            cc.log('建立连接');

            that.isConnected=true;

            // var req=new ChangeDirectRequest();
            // req.x=1;
            // req.y=2;
            // req.name="好123";
            // that.send(CHANGE_DIRECT_REQUEST,req);
        };
        this.close=function(){
            if (this.socket&&this.isConnected){
                cc.log("关闭");
                this.socket.close();
                this.socket = null;
                this.isConnected=false;

            }
        }
        this.socket.onmessage = function(evt){


            var data = evt.data;
            var buf = new Uint8Array(data);
           // console.log("  size:"+buf.length);
            var byteBuf=ByteBufferManager.getInstance().getFromPool();//new ByteBuffer();
            //byteBuf.initBlank();
            byteBuf.setMsg(buf);
            var msgNumber=byteBuf.readInt16();
           // console.log("client msgNumber:"+msgNumber+"  size:"+buf.length);
            var obj={};
            var body=MessageFactory.getInstance().build(msgNumber,byteBuf);
            obj.msgNumber=msgNumber;
            obj.body=body;
            ByteBufferManager.getInstance().appendToPool(byteBuf);

            if(msgNumber==HEART_SERVER_TO_CLIENT_REQUEST) {
               //  cc.log("接收到来自服务器心跳请求");

               // var a=new Date()-0;
              //  cc.log("HEART_SERVER_TO_CLIENT_REQUEST");

                var heart=new HeartClientToServerResponse();
                heart.m_id=this.m_id;
                that.send(HEART_CLIENT_TO_SERVER_RESPONSE,heart);


            }
            else  if(msgNumber==HEART_SERVER_TO_CLIENT_RESPONSE) {


                //cc.log("接收到来自服务器心跳应答");

                that.hasSendHeart=false;

                // if (that.scene.uiLayer.lastMId == body.m_id) {
                //     that.scene.uiLayer.lastMId = 0;
                //     var recTime = new Date().getTime();
                //     var a=recTime - that.scene.uiLayer.sendTime;//-lastGameDt*1000;
                //     a=parseInt(a);
                //     if(a<0)a=0;
                //     that.scene.uiLayer.fpsTime = a;
                //
                //    // cc.log("=======心跳收到====="+a+"  "+lastGameDt);
                // }

            }
            else{
                that.msgQueue.push(obj);
            }

       };

        this.socket.onerror = function(evt){
            cc.log('连接错误');
            that.isConnected=false;

            var obj2={};
            EventManager.getInstance().fireEvent("SOCKET_CLOSE_EVENT2",obj2);


            if(finishState==2)
            {
                return;
            }

            var obj={};
            EventManager.getInstance().fireEvent("SOCKET_CLOSE_EVENT",obj);
        };

        this.socket.onclose = function(evt){
            cc.log('连接关闭');
            that.isConnected=false;

            var obj2={};
            EventManager.getInstance().fireEvent("SOCKET_CLOSE_EVENT2",obj2);


            if(finishState==2)
            {
                return;
            }

            var obj={};
            EventManager.getInstance().fireEvent("SOCKET_CLOSE_EVENT",obj);
        };


    };
   
    this.send=function (msgNumber,body) {



        //cc.log("send:"+msgNumber);
        // var buf=new ByteBuffer();
        // buf.initBlank();
        var buf=ByteBufferManager.getInstance().getFromPool();
        //buf.initBlank();
        buf.putInt16(msgNumber);
        body.write(buf);

        var array = new Uint8Array(buf.buffer);
        var l = buf.count;
       // console.log("count:"+l)
        var buffer= new ArrayBuffer(l);
        var view = new Uint8Array(buffer)
        for (var i = 0; i < l; i++) {
            view[i] = array[i];
        }
        this.socket.send(view.buffer);//{ binary: true }

        // var a=this._arrayBufferToBase64(view.buffer);
        // cc.log("test:"+a);

       // this.socket.send(buf.buffer,buf.count);//{ binary: true }
        ByteBufferManager.getInstance().appendToPool(buf);


        this.t1 = new Date();



    };


}