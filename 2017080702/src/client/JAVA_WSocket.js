/**
 * Created by yungu on 16/7/28.
 */


var onJavaOpen=function () {
    cc.log("js端on open");
    socketMgr.socket.isConnected=true;
}

var onJavaError=function () {

    cc.log('连接错误');
    socketMgr.socket.isConnected=false;
    if(finishState==1)
    {
        return;
    }
    SceneManager.getInstance().changeScene(SCENE_INIT,REPLACE_SCENE);

}
var onJavaClose=function () {

    cc.log('连接关闭');
    socketMgr.socket.isConnected=false;
    if(finishState==1)
    {
        return;
    }
    SceneManager.getInstance().changeScene(SCENE_INIT,REPLACE_SCENE);

}
var onJavaMessage=function (buf) {

    cc.log("js收到数据!!!");

    socketMgr.socket.onMessage(buf);
}
var JAVA_WSocket=function () {

    this.isConnected=false;
    this.msgQueue=[];
    this.msgQueue2=[];
    this.msgQueue3=[];
    this.sendId=0;
    this.scene=null;

    var that=this;

    this.connect=function (ip,port) {


        //java.connect("ws://"+ip+":"+port);

        if(cc.sys.os == cc.sys.OS_ANDROID){

            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JsInterface", "connect", "(Ljava/lang/String;)V", "ws://"+ip+":"+port);

        }

    };

    //=================web=================
    this._base64ToArrayBuffer=function(base64) {
        var binary_string =  window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array( len );
        for (var i = 0; i < len; i++)        {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }
    this._arrayBufferToBase64=function( buffer ) {
        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        return window.btoa( binary );
    }

    //==========================native=====

    this._base64ToArrayBuffer_native=function(base64) {
        var binary_string =  this._atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array( len );
        for (var i = 0; i < len; i++)        {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    this._arrayBufferToBase64_native=function( buffer ) {
        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        return  this._btoa( binary );
    }
    var base64hash = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    this._atob=function  (s) {
        s = s.replace(/\s|=/g, '');
        var cur,
            prev,
            mod,
            i = 0,
            result = [];


        while (i < s.length) {
            cur = base64hash.indexOf(s.charAt(i));
            mod = i % 4;


            switch (mod) {
                case 0:
                    //TODO
                    break;
                case 1:
                    result.push(String.fromCharCode(prev << 2 | cur >> 4));
                    break;
                case 2:
                    result.push(String.fromCharCode((prev & 0x0f) << 4 | cur >> 2));
                    break;
                case 3:
                    result.push(String.fromCharCode((prev & 3) << 6 | cur));
                    break;

            }


            prev = cur;
            i ++;
        }


        return result.join('');

    }

    // btoa method
    this._btoa=function  (s) {
        if (/([^\u0000-\u00ff])/.test(s)) {
            throw new Error('INVALID_CHARACTER_ERR');
        }
        var i = 0,
            prev,
            ascii,
            mod,
            result = [];


        while (i < s.length) {
            ascii = s.charCodeAt(i);
            mod = i % 3;


            switch(mod) {
                // 第一个6位只需要让8位二进制右移两位
                case 0:
                    result.push(base64hash.charAt(ascii >> 2));
                    break;
                //第二个6位 = 第一个8位的后两位 + 第二个8位的前4位
                case 1:
                    result.push(base64hash.charAt((prev & 3) << 4 | (ascii >> 4)));
                    break;
                //第三个6位 = 第二个8位的后4位 + 第三个8位的前2位
                //第4个6位 = 第三个8位的后6位
                case 2:
                    result.push(base64hash.charAt((prev & 0x0f) << 2 | (ascii >> 6)));
                    result.push(base64hash.charAt(ascii & 0x3f));
                    break;
            }


            prev = ascii;
            i ++;
        }


        // 循环结束后看mod, 为0 证明需补3个6位，第一个为最后一个8位的最后两位后面补4个0。另外两个6位对应的是异常的“=”；
        // mod为1，证明还需补两个6位，一个是最后一个8位的后4位补两个0，另一个对应异常的“=”
        if(mod == 0) {
            result.push(base64hash.charAt((prev & 3) << 4));
            result.push('==');
        } else if (mod == 1) {
            result.push(base64hash.charAt((prev & 0x0f) << 2));
            result.push('=');
        }


        return result.join('');
    }

    //===================

    this.onMessage=function (data) {

        that.t2 = new Date();
        console.log("通信时间差:"+(that.t2.getTime()-that.t1.getTime()));


        var dataBuf=this._base64ToArrayBuffer_native(data);
        var buf = new Uint8Array(dataBuf);
        var byteBuf=ByteBufferManager.getInstance().getFromPool();//new ByteBuffer();
        //byteBuf.initBlank();
        byteBuf.setMsg(buf);
        var msgNumber=byteBuf.readInt16();
       // console.log("解析后:"+msgNumber);
        var obj={};
        var body=MessageFactory.getInstance().build(msgNumber,byteBuf);
        obj.msgNumber=msgNumber;
        obj.body=body;
        ByteBufferManager.getInstance().appendToPool(byteBuf);

        // cc.log("============:"+msgNumber);
        if(msgNumber==HEART_SERVER_TO_CLIENT_REQUEST) {
            // cc.log("============");

            // var a=new Date()-0;
            //  cc.log("HEART_SERVER_TO_CLIENT_REQUEST");

            var heart=new HeartClientToServerResponse();
            heart.m_id=this.m_id;
            socketMgr.socket.send(HEART_CLIENT_TO_SERVER_RESPONSE,heart);


        }
        else  if(msgNumber==HEART_SERVER_TO_CLIENT_RESPONSE) {

            //cc.log("=======心跳收到====="+body.m_id+"   "+that.scene.uiLayer.lastMId);
            if (that.scene.uiLayer.lastMId == body.m_id) {
                that.scene.uiLayer.lastMId = 0;
                var recTime = new Date();
                that.scene.uiLayer.fpsTime = recTime - that.scene.uiLayer.sendTime;
            }
            console.log("服务器到客户端的时间差:"+(new Date().getTime()-Number(body.data)));


        }
        else if(msgNumber==PLAYER_POSITION_NOTIFY)
        {
            that.msgQueue2=[];
            that.msgQueue2.push(obj);
        }
        else if(msgNumber==TU_BALL_NOTIFY){
            that.msgQueue3=[];
            that.msgQueue3.push(obj);
        }
        else{
            that.msgQueue.push(obj);
        }

    }
    this.close=function(){

       // java.close();

        if(cc.sys.os == cc.sys.OS_ANDROID){

            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JsInterface", "close", "()V");

        }
    }

    this.send=function (msgNumber,body) {

        that.t1 = new Date();

        //cc.log("js端发送==========");
        var buf=ByteBufferManager.getInstance().getFromPool();
        //buf.initBlank();
        buf.putInt16(msgNumber);
        body.write(buf);

        var array = new Uint8Array(buf.buffer);
        var l = buf.count;
        // console.log("count:"+l)
        var buffer= new ArrayBuffer(l);
        var view = new Uint8Array(buffer)
        var str="";
        for (var i = 0; i < l; i++) {
            view[i] = array[i];
            str+=view[i];
        }
        cc.log("数据:"+str);
      //  var array2 = new Uint8Array(view.buffer);
//        java.send(array2);



        if(cc.sys.os == cc.sys.OS_ANDROID){

            var str=this._arrayBufferToBase64_native(view.buffer);
            cc.log(str);
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/JsInterface", "send", "(Ljava/lang/String;)V",str);

        }

        // this.socket.send(buf.buffer,buf.count);//{ binary: true }
        ByteBufferManager.getInstance().appendToPool(buf);






    };




}