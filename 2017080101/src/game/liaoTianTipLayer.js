/**
 * Created by yungu on 16/11/28.
 */
var LiaoTianTipLayer=cc.Layer.extend({


    ctor: function (room,uid,biaoqing,msg) {
        this._super();

        this.room=room;




        var roomUser=this.room.getRoomUserByUID(uid);
        if(roomUser!=undefined&&roomUser!=null)
        {
            var pos=this.room.getHeadPos(roomUser,0,0);
            var uiPos=this.room.getRoomUserUIPos(roomUser);

            if(biaoqing!="")
            {
                this.x=pos.x;
                this.y=pos.y;

                /*
                 var BOTTOM_UI=0;
                 var RIGHT_UI=1;
                 var TOP_UI=3;
                 var LEFT_UI=4;
                 */

                if(uiPos==0)
                {
                    this.x+=20;
                }
                else if(uiPos==1){

                    this.x-=20;
                }
                else if(uiPos==3){

                    this.x-=20;
                }
                else if(uiPos==4){

                    this.x+=20;
                }

                console.log("biaoqing:"+biaoqing);

                var animFrames = [];
                var frame, animFrame;
                var key="";
                var frameCount=0;
                var startIndex=0;
                if(biaoqing=="e1")
                {
                    key="happy";
                    frameCount=5;
                    startIndex=1;
                }
                else if(biaoqing=="e2")
                {
                    key="huaixiao";
                    frameCount=5;
                    startIndex=0;
                }
                else if(biaoqing=="e3")
                {
                    key="han";
                    frameCount=5;
                    startIndex=0;
                }
                else if(biaoqing=="e4")
                {
                    key="jiong";
                    frameCount=7;
                    startIndex=0;
                }
                else if(biaoqing=="e5")
                {
                    key="lihai";
                    frameCount=0;
                    startIndex=0;
                }
                else if(biaoqing=="e6")
                {
                    key="se";
                    frameCount=5;
                    startIndex=0;
                }
                else if(biaoqing=="e7")
                {
                    key="shaoxiang";
                    frameCount=5;
                    startIndex=0;
                }
                else if(biaoqing=="e8")
                {
                    key="shihua";
                    frameCount=0;
                    startIndex=0;
                }
                else if(biaoqing=="e9")
                {
                    key="sleep";
                    frameCount=5;
                    startIndex=0;
                }
                else if(biaoqing=="e10")
                {
                    key="smaile";
                    frameCount=5;
                    startIndex=0;
                }
                else if(biaoqing=="e11")
                {
                    key="yun";
                    frameCount=5;
                    startIndex=0;
                }
                else if(biaoqing=="e12")
                {
                    key="zhiya";
                    frameCount=5;
                    startIndex=0;
                }
                else if(biaoqing=="e13")
                {
                    key="angry";
                    frameCount=7;
                    startIndex=0;
                }
                else if(biaoqing=="e14")
                {
                    key="fennu";
                    frameCount=3;
                    startIndex=0;
                }
                else if(biaoqing=="e15")
                {
                    key="touxiang";
                    frameCount=5;
                    startIndex=0;
                }
                else if(biaoqing=="e16")
                {
                    key="hezuoyukuai";
                    frameCount=0;
                    startIndex=0;
                }

                var str = "";
                for (var i = startIndex; i <=frameCount; i++) {
                    str = key+i+".png";
                    frame = cc.spriteFrameCache.getSpriteFrame(str);
                    animFrame = new cc.AnimationFrame(frame, 1);
                    animFrames.push(animFrame);
                }
                var animation = new cc.Animation(animFrames, 0.1);
                frame = cc.spriteFrameCache.getSpriteFrame(key+startIndex+".png");
                var sprite = new cc.Sprite(frame);
                sprite.runAction(cc.animate(animation).repeatForever());
                this.addChild(sprite);


            }
            else if(msg!=""){

                var len=msgDefault.length;
                for(var i=0;i<len;i++) {
                    var obj = msgDefault[i];
                    var txt = obj.txt;
                    if(txt==msg)//0:男,1:女,2:其他
                    {
                        if(roomUser.user.sex==1)
                        {
                            playEffect("msg/"+obj.v);
                        }
                        else{
                            playEffect("msg/"+obj.n);
                        }


                    }
                }

                /*
                 var BOTTOM_UI=0;
                 var RIGHT_UI=1;
                 var TOP_UI=3;
                 var LEFT_UI=4;
                 */
                var lab=null;
                var node=null;

                if(uiPos==0)
                {
                    node = parseUI("res/ui/liaotian/liaotianTip.json", LEFT_BOTTOM);
                    this.addChild(node);

                    lab=ccui.helper.seekWidgetByName(node, "t");
                }
                else if(uiPos==1){

                    node = parseUI("res/ui/liaotian/liaotianTip2.json", LEFT_BOTTOM);
                    this.addChild(node);

                    lab=ccui.helper.seekWidgetByName(node, "t");
                }
                else if(uiPos==4)
                {
                    node = parseUI("res/ui/liaotian/liaotianTip3.json", LEFT_BOTTOM);
                    this.addChild(node);
                    lab=ccui.helper.seekWidgetByName(node, "t");
                }
                else{
                    node = parseUI("res/ui/liaotian/liaotianTip4.json", LEFT_BOTTOM);
                    this.addChild(node);

                    lab=ccui.helper.seekWidgetByName(node, "t");
                }

                node.x=0;
                node.y=0;

                lab.setString(msg);
                this.x=pos.x;
                this.y=pos.y;
            }

        }
        this.schedule(this.waitTime, 3);


    },

    waitTime:function (dt) {

        this.removeFromParent(true);
    },


});