/**
 * Created by yungu on 16/12/1.
 */
var JieSanLayer=cc.Layer.extend({


    ctor: function (room,body) {
        this._super();

        this.room=room;

        var players=body.players;
        var leftTime=body.leftTime;


        var touchLayer=new TouchLayer();
        this.addChild(touchLayer);

        var node = parseUI("res/ui/jiesan/jiesanLayer.json", CENTER);
        touchLayer.addChild(node);

        var s= ccui.helper.seekWidgetByName(node, "s");
        var tongyi= ccui.helper.seekWidgetByName(node, "tongyi");
        var jujue= ccui.helper.seekWidgetByName(node, "jujue");
        s.visible=false;
        jujue.visible=false;
        tongyi.visible=false;
        var t= ccui.helper.seekWidgetByName(node, "t");
        var str="";
        var len=players.length;
        var isJujue=0;
        var isTongyi=0;
        var faqizheStr="";
        for(var i=0;i<len;i++)
        {
            var obj=players[i];
            var roomUser=room.getRoomUserByUID(obj.uid);
            if(roomUser==null)
            {
                continue;
            }
            var user=roomUser.user;
            if(obj.type==1)//0:选择者，1:发起者
            {
                faqizheStr="玩家["+user.name+"]申请解散房间\n";

                cc.log("#发起解散房间者");
            }
            else{//0:等待选择,1:同意,2:拒绝

                if(obj.state==0)
                {
                    str+="玩家["+user.name+"]等待选择\n";

                    if(myPlayerInfo.uid==obj.uid)
                    {
                        jujue.visible=true;
                        tongyi.visible=true;

                        jujue.addTouchEventListener(this.jujueClicked,this);
                        tongyi.addTouchEventListener(this.tongyiClicked,this);

                    }

                    cc.log(str);
                }
                else if(obj.state==1)
                {
                    str+="玩家["+user.name+"]同意解散房间\n";
                    isTongyi++;

                    cc.log(str);
                }
                else
                {
                    str+="玩家["+user.name+"]拒绝解散房间\n";
                    isJujue++;

                    cc.log(str);
                }

            }


        }
        str=faqizheStr+str;

        if(isJujue>=1)
        {
            cc.log("有拒绝者");

            t.setString(str);

            s.visible=true;

            jujue.visible=false;
            tongyi.visible=false;
            jujue.setEnabled(false);
            jujue.setTouchEnabled(false);
            tongyi.setEnabled(false);
            tongyi.setTouchEnabled(false);

            s.addTouchEventListener(this.closeClicked,this);
        }
        else if(isTongyi==(len-1))
        {
            // cc.log("全部同意");
            // s.visible=true;
            //
            // s.addTouchEventListener(this.exitClicked,this);
            // str+="\n"+"点击确定退出房间";
            // t.setString(str);

            this.scheduleOnce(this.closeTime, 0.1);
        }
        else{
            this.txt=str;
            this.leftTime=body.leftTime;
            var time=parseInt(this.leftTime/60);
            var time2=parseInt(this.leftTime)%60;
            var infoStr=str+"\n"+"在"+time+"分"+time2+"秒之后将自动同意";
            t.setString(infoStr);
            this.schedule(this.update, 0.5);

            this.lab=t;

            cc.log(infoStr);
        }

//
    },
    closeTime:function (dt) {

        this.removeFromParent(true);
        this.room.jiesanLayer=null;
    },
    update:function (dt) {

        this.leftTime-=dt;
        if(this.leftTime<=0)
        {
            this.removeFromParent(true);
            this.room.jiesanLayer=null;
            return;
        }
        var time=parseInt(this.leftTime/60);
        var time2=parseInt(this.leftTime)%60;
        var infoStr=this.txt+"\n"+"在"+time+"分"+time2+"秒之后将自动同意";
        this.lab.setString(infoStr);
    },
    closeClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                this.removeFromParent(true);
                this.room.jiesanLayer=null;
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
                SceneManager.getInstance().changeScene(SCENE_01,REPLACE_SCENE);
                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },
    tongyiClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                if(this.hasSend==undefined)
                {

                    var req=new DismissSelRequest();
                    req.roomId=this.room.roomInfo.roomId;
                    req.uid=myPlayerInfo.uid;
                    req.state=1;//1:同意,2:拒绝
                    socketMgr.socket2.send(DISMISS_SEL_REQUEST,req);

                    playEffect(TOUCH_SOUND);

                    this.hasSend=true;
                }


            }
                break;


            default:
                break;
        }


    },
    jujueClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                if(this.hasSend==undefined)
                {



                    var req=new DismissSelRequest();
                    req.roomId=this.room.roomInfo.roomId;
                    req.uid=myPlayerInfo.uid;
                    req.state=2;//1:同意,2:拒绝
                    socketMgr.socket2.send(DISMISS_SEL_REQUEST,req);

                    playEffect(TOUCH_SOUND);

                    this.hasSend=true;
                }

            }
                break;


            default:
                break;
        }


    },

});