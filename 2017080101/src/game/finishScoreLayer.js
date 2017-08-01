/**
 * Created by yungu on 16/12/5.
 */

var FinishScoreLayer=cc.Layer.extend({


    ctor: function (obj,room) {
        this._super();

        this.room=room;
        this.gameFinishedNotify=obj;

        var winSize=cc.winSize;
        var bgColor=cc.LayerColor.create(cc.color(0, 0, 0, 200));
        this.addChild(bgColor);
        bgColor.ignoreAnchor = false;
        bgColor.anchorX = 0;
        bgColor.anchorY = 0;
        bgColor.setContentSize(winSize.width, winSize.height);

        var touchLayer=new TouchLayer();
        this.addChild(touchLayer);

        var node = parseUI("res/ui/finish3/jiesuanScore.json", CENTER);
        touchLayer.addChild(node);

        var b= ccui.helper.seekWidgetByName(node, "Button_3");
        b.addTouchEventListener(this.closeClicked,this);


        var share= ccui.helper.seekWidgetByName(node, "Button_1");
        share.addTouchEventListener(this.shareClicked,this);

        var title= ccui.helper.seekWidgetByName(node, "title");
        title.setString(createRoomObj.title);

        var roomId= ccui.helper.seekWidgetByName(node, "roomId");
        roomId.setString(this.room.roomInfo.roomId);

        var jushu= ccui.helper.seekWidgetByName(node, "jushu");
        if(RULE_VALUE==ROOM_TYPE_HONGHU_147||RULE_VALUE==ROOM_TYPE_BINZHOU||RULE_VALUE==ROOM_TYPE_BINZHOU_YONGXING||RULE_VALUE==ROOM_TYPE_LEIYANG||RULE_VALUE==ROOM_TYPE_HENGYANG
            ||RULE_VALUE==ROOM_TYPE_GUILIN||RULE_VALUE==ROOM_TYPE_HUAIHUA||RULE_VALUE==ROOM_TYPE_HONGHEIHU||RULE_VALUE==ROOM_TYPE_WAIHUZI
            ||RULE_VALUE==ROOM_TYPE_DAZIPAI||RULE_VALUE==ROOM_TYPE_PENGHUZI

        )
        {
            jushu.setString((this.room.roomInfo.maxCount-this.room.roomInfo.leftCount+1)+"/"+this.room.roomInfo.maxCount);
        }
        else if(RULE_VALUE==ROOM_TYPE_GAOHUZI)
        {
            jushu.setString((50-this.room.roomInfo.leftCount+1)+"");
        }
        else{
            jushu.setString((100-this.room.roomInfo.leftCount+1)+"");

        }

        var des= ccui.helper.seekWidgetByName(node, "des");
        des.setString(createRoomObj.des);



        var str=this.room.getServerTime();
        var time= ccui.helper.seekWidgetByName(node, "time");
        time.setString(str);


        var p1= ccui.helper.seekWidgetByName(node, "p1");
        p1.visible=false;

        var arr=[];
        var userInfos=this.gameFinishedNotify.usersInfo
        var count=userInfos.length;
        for(var i=0;i<count;i++)
        {
            var userInfo=userInfos[i];
            var val=0;
            if(RULE_VALUE==ROOM_TYPE_HONGHU_147||RULE_VALUE==ROOM_TYPE_BINZHOU||RULE_VALUE==ROOM_TYPE_BINZHOU_YONGXING||RULE_VALUE==ROOM_TYPE_LEIYANG||RULE_VALUE==ROOM_TYPE_HENGYANG
            ||RULE_VALUE==ROOM_TYPE_GUILIN||RULE_VALUE==ROOM_TYPE_HUAIHUA||RULE_VALUE==ROOM_TYPE_HONGHEIHU
                ||RULE_VALUE==ROOM_TYPE_DAZIPAI||RULE_VALUE==ROOM_TYPE_PENGHUZI
            )
            {
                 val=userInfo.zonghuxi;
            }
            else if(RULE_VALUE==ROOM_TYPE_GAOHUZI)
            {
                val=userInfo.zonghuxi;
            }
            else if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
            {
                val=userInfo.zonghuxi;
            }
            else{
                var str=userInfo.zonghuxi+"";
                var len=str.length;
                val=0;
                if(len>=1)
                {
                    var a=str[len-1];
                    var int_a=parseInt(a);
                    if(int_a<5)
                    {
                        int_a=0;
                    }
                    else{
                        int_a=10;
                    }
                    var newStr="";
                    for(var k=0;k<(len-1);k++)
                    {
                        newStr+=str[k];

                    }
                    if(newStr=="")newStr="0";

                    if(newStr=="-")
                    {
                        if(int_a==0)
                        {
                            val=0;
                        }
                        else{
                            val-=int_a;
                        }

                    }
                    else{
                        val=parseInt(newStr);

                        val*=10;
                        if(val<0)
                        {
                            val-=int_a;
                        }
                        else{
                            val+=int_a;
                        }

                    }






                }
            }

            userInfo.score=val;
            if(arr.length<=0)
            {
                arr.push(userInfo);
            }
            else{

                var lCount=arr.length;
                var flg=true;
                for(var j=0;j<lCount;j++)
                {
                    var uInfo=arr[j];
                    if(uInfo.score<userInfo.score)
                    {
                        arr.splice(j,0,userInfo);
                        flg=false;
                        break;
                    }

                }
                if(flg)
                {
                    arr.push(userInfo);
                }

            }


        }



        var cSize=arr.length;


        var maxUserInfo=null;
        if(RULE_VALUE==ROOM_TYPE_GAOHUZI)
        {
            for(var j=0;j<cSize;j++) {

                var userInfo = arr[j];

                if(maxUserInfo==null)
                {
                    maxUserInfo=userInfo;
                }
                else if(maxUserInfo.score<userInfo.score)
                {
                    maxUserInfo=userInfo;

                }


            }
        }


        for(var i=0;i<cSize;i++)
        {
            var userInfo=arr[i];
            var panel=p1.clone();
            panel.visible=true;
            panel.x=p1.x+i*p1.getContentSize().width;
            panel.y=p1.y;
            node.addChild(panel);

            var head= ccui.helper.seekWidgetByName(panel, "head");
            head.setLocalZOrder(2);

            var uid=userInfo.uid;
            var roomUser=this.room.getRoomUserByUID(uid);

            var headName=uid+"_head.png";
            var headIconPath=getSkinPath(headName);
            if(checkFileExit(headIconPath))
            {
                var headSprite=new cc.Sprite(headIconPath);
                headSprite.x=head.x;
                headSprite.y=head.y;
                changeHead(headSprite,1);
                head.getParent().addChild(headSprite,1);
            }

            var name= ccui.helper.seekWidgetByName(panel, "name");
            name.setString(roomUser.user.name);

            var idLab= ccui.helper.seekWidgetByName(panel, "id1");

            var id= ccui.helper.seekWidgetByName(panel, "id");
            id.setString(uid);

            var fangzhu= ccui.helper.seekWidgetByName(panel, "fangzhu");
            fangzhu.visible=false;


            var idd= ccui.helper.seekWidgetByName(panel, "idd");
            idd.visible=false;

            var idd1= ccui.helper.seekWidgetByName(panel, "idd1");
            idd1.visible=false;


            var fanbei= ccui.helper.seekWidgetByName(panel, "fanbei");
            fanbei.visible=false;

            if(userInfo.uid==this.room.roomInfo.uid)
            {
                fangzhu.visible=true;
                fangzhu.setLocalZOrder(3);
            }
            var huLab= ccui.helper.seekWidgetByName(panel, "hu");

            var hu= ccui.helper.seekWidgetByName(panel, "hu2");
            hu.setString(userInfo.score);

            if(RULE_VALUE!=ROOM_TYPE_BOPI&&RULE_VALUE!=ROOM_TYPE_GAOHUZI&&RULE_VALUE!=ROOM_TYPE_LOUDI&&RULE_VALUE!=ROOM_TYPE_SHUANGFENG)
            {
                huLab.visible=false;
                hu.visible=false;
            }

            if(RULE_VALUE==ROOM_TYPE_GAOHUZI)
            {


                hu.setString(userInfo.zonghuxi);

                idd.visible=true;
                idd1.visible=true;

                idLab.y+=43;
                id.y+=43;


                idd.y-=43;
                idd1.y-=43;


                if(userInfo.dunshu2>1)
                {
                    idd1.setString(""+userInfo.dunshu);

                    fanbei.visible=true;
                }
                else{
                    idd1.setString(""+userInfo.dunshu);
                }



            }

            var scoreName= ccui.helper.seekWidgetByName(panel, "score");

            var score= ccui.helper.seekWidgetByName(panel, "score2");
            var scoreVal=0;

            if(RULE_VALUE==ROOM_TYPE_HONGHU_147||RULE_VALUE==ROOM_TYPE_BINZHOU||RULE_VALUE==ROOM_TYPE_BINZHOU_YONGXING||RULE_VALUE==ROOM_TYPE_LEIYANG||RULE_VALUE==ROOM_TYPE_HENGYANG
                ||RULE_VALUE==ROOM_TYPE_GUILIN||RULE_VALUE==ROOM_TYPE_HUAIHUA||RULE_VALUE==ROOM_TYPE_HONGHEIHU||RULE_VALUE==ROOM_TYPE_WAIHUZI
                ||RULE_VALUE==ROOM_TYPE_DAZIPAI||RULE_VALUE==ROOM_TYPE_PENGHUZI
            )
            {

                scoreVal=userInfo.zonghuxi;

                idLab.y=huLab.y+30;
                id.y=hu.y+30;

                scoreName.y+=20;
                score.y+=20;

            }
            else if(RULE_VALUE==ROOM_TYPE_GAOHUZI)
            {

                if(maxUserInfo.dunshu2>1)
                {

                    if(maxUserInfo==userInfo)
                    {
                        for(var j=0;j<cSize;j++) {
                            var userInfo2 = arr[j];
                            if(userInfo2==userInfo)
                            {
                                continue;
                            }
                            scoreVal+=(3-userInfo2.dunshu)*maxUserInfo.dunshu2;

                        }

                    }
                    else{

                        scoreVal+=(userInfo.dunshu-3)*maxUserInfo.dunshu2;

                    }
                }
                else{

                    if(maxUserInfo==userInfo)
                    {
                        for(var j=0;j<cSize;j++) {
                            var userInfo2 = arr[j];
                            if(userInfo2==userInfo)
                            {
                                continue;
                            }
                            scoreVal+=(maxUserInfo.dunshu-userInfo2.dunshu);

                        }

                    }
                    else{

                        scoreVal+=(userInfo.dunshu-maxUserInfo.dunshu);

                    }
                }




            }
            else{
                for(var j=0;j<cSize;j++) {
                    var userInfo2 = arr[j];
                    if(userInfo2==userInfo)
                    {
                        continue;
                    }
                    scoreVal+=(userInfo.score-userInfo2.score);

                }
            }


            

            score.setString(""+scoreVal);


            var dayingjia= ccui.helper.seekWidgetByName(panel, "dayingjia");
            dayingjia.visible=false;

            if(scoreVal>0&&i==0)
            {
                dayingjia.visible=true;
                dayingjia.setLocalZOrder(3);
            }
            else{

            }

        }


        var sp = new cc.ParticleSystem.create("res/particle/bigwin_blowout_2.plist");
        sp.setAutoRemoveOnFinish(true);
        sp.x=v_x+v_w/2;
        sp.y=v_y+v_h/2;
        this.addChild(sp,1);

        // this.effectCount=0;
        // this.schedule(this.effectTime, 0.1);


        EventManager.getInstance().regist("CAPATURE_FINISHED_EVENT",this,this.capatureFinished);


    },
    effectTime:function (dt) {

        this.effectCount++;
        if(this.effectCount>=2)
        {
            this.unschedule(this.effectTime);
        }

    },
    closeClicked:function(sender, type)
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

                SceneManager.getInstance().changeScene(SCENE_01,REPLACE_SCENE);
            }
                break;


            default:
                break;
        }


    },

    shareClicked:function(sender, type)
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

                captureScreen();
                
                playEffect(TOUCH_SOUND);

            }
                break;


            default:
                break;
        }


    },
    capatureFinished:function (obj,target) {



        weixinShare2("0",obj.path);

        // target.shareTip=new TouchLayer();
        // target.addChild(target.shareTip,1000);
        //
        // var node = parseUI("res/ui/sub/ShareTipLayer.json", CENTER);
        // target.shareTip.addChild(node);
        //
        // var b1= ccui.helper.seekWidgetByName(node, "quan");
        // b1.addTouchEventListener(target.shareClicked2,target);
        // b1.type=1;
        // b1.path=obj.path;
        //
        // var b2= ccui.helper.seekWidgetByName(node, "you");
        // b2.addTouchEventListener(target.shareClicked2,target);
        // b2.type=2;
        // b2.path=obj.path;
        //
        // var close= ccui.helper.seekWidgetByName(node, "close");
        // close.addTouchEventListener(target.shareClicked2,target);
        // close.type=3;
        // close.path=obj.path;

    },
    shareClicked2:function(sender, type)
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

                var type=sender.type;
                var path=sender.path;

                if(type==1)
                {
                    weixinShare2("1",path);
                }
                else if(type==2)
                {
                    weixinShare2("0",path);
                }
                else
                {
                    this.shareTip.removeFromParent(true);
                    this.shareTip=null;
                }
                playEffect(TOUCH_SOUND);

            }
                break;


            default:
                break;
        }

    },
    onExit:function () {
        this._super();
        EventManager.getInstance().unregist(this);
        Service.getInstance().unregist(this);
    },

});