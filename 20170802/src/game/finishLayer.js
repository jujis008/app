/**
 * Created by yungu on 16/11/21.
 */

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

var FinishLayer=cc.Layer.extend({



    ctor: function (obj,room) {
        this._super();

        this.room=room;
        this.gameFinishedNotify=obj;

        // this.gameFinishedNotify.type=3;
        // this.gameFinishedNotify.type2.push(6);
        //this.gameFinishedNotify.state=1;
        
        var winSize=cc.winSize;
        var bgColor=cc.LayerColor.create(cc.color(0, 0, 0, 200));
        this.addChild(bgColor);
        bgColor.ignoreAnchor = false;
        bgColor.anchorX = 0;
        bgColor.anchorY = 0;
        bgColor.setContentSize(winSize.width, winSize.height);

        var touchLayer=new TouchLayer();
        this.addChild(touchLayer);

        var node = parseUI("res/ui/finish2/finish2Layer.json", CENTER);
        touchLayer.addChild(node);


        var dipai= ccui.helper.seekWidgetByName(node, "dipai");
        var cards=this.gameFinishedNotify.cards;
        var len=cards.length;
        var w_gap=40;
        for(var i=0;i<len;i++)
        {
            var card=cards[i];
            var sp=new CardSprite();
            sp.createCard(card);
            sp.changeToSmall2();
            //sp.setScl(0.3);
            sp.x=dipai.x+60+(i*w_gap);
            sp.y=dipai.y;
            sp.setTag(CARD_SPRITE_TAG);
            node.addChild(sp);
        }

        var tianhu= ccui.helper.seekWidgetByName(node, "tianhu");
        var dihu= ccui.helper.seekWidgetByName(node, "dihu");
        var zimo= ccui.helper.seekWidgetByName(node, "zimo");
        tianhu.visible=false;
        dihu.visible=false;
        zimo.visible=false;

        if(this.gameFinishedNotify.type==1)
        {
            tianhu.visible=true;
        }
        else if(this.gameFinishedNotify.type==2)
        {
            dihu.visible=true;
        }
        else if(this.gameFinishedNotify.type==3)
        {
            zimo.visible=true;
        }
        cc.log("this.gameFinishedNotify.type:"+this.gameFinishedNotify.type+",this.gameFinishedNotify.type2:"+this.gameFinishedNotify.type2.length);
        if(this.gameFinishedNotify.type2.length>0)
        {
            if(RULE_VALUE==ROOM_TYPE_HONGHU_147)
            {
                var type2=this.gameFinishedNotify.type2[0]
                var sp=null;
                if(type2==6)//6:朱胡。7:红胡,8:乌胡
                {
                    sp=new cc.Sprite("res/ui/finish2/zhuhu_finish.png");
                }
                else if(type2==7)
                {
                    sp=new cc.Sprite("res/ui/finish2/honghu_finish.png");
                }
                else if(type2==8)
                {
                    sp=new cc.Sprite("res/ui/finish2/wuhu_finish.png");
                }
                sp.setScale(0.5);
                sp.x=zimo.x-46;
                sp.y=zimo.y;
                zimo.getParent().addChild(sp,1);

            }
        }
        var userInfos=this.gameFinishedNotify.usersInfo
        var count=userInfos.length;
        var showUserInfo=null;
        var hasHuPai=false;
        for(var i=0;i<count;i++)
        {
            var userInfo=userInfos[i];
            if(userInfo.isHuPai==1)//胡牌者
            {
                showUserInfo=userInfo;
                hasHuPai=true;
            }
            else if(userInfo.roleType==1)//庄家
            {
                if(showUserInfo==null)
                {
                    showUserInfo=userInfo;
                }

            }


            var playerObj = {};
            playerObj.uid = userInfo.uid;
            room.showClock(playerObj, ROOM_WAIT_READY_STATE);
        }


        var huangzhuang= ccui.helper.seekWidgetByName(node, "huangzhuang");
        huangzhuang.visible=false;
        if(!hasHuPai)
        {
            huangzhuang.visible=true;

            var myRoomUser=room.getRoomUserByUID(myPlayerInfo.uid);
            if(myRoomUser.user.sex==1)
            {
                playEffect("msg/"+effectSound.moHu.v);
            }
            else{
                playEffect("msg/"+effectSound.moHu.n);
            }
        }
        else{
            var myRoomUser=room.getRoomUserByUID(myPlayerInfo.uid);

            if(myPlayerInfo.uid==showUserInfo.uid)
            {
                if(myRoomUser.user.sex==1)
                {
                    playEffect("msg/"+effectSound.moHu_1.v);
                }
                else{
                    playEffect("msg/"+effectSound.moHu_1.n);
                }
            }
            else{
                if(myRoomUser.user.sex==1)
                {
                    playEffect("msg/"+effectSound.moHu.v);
                }
                else{
                    playEffect("msg/"+effectSound.moHu.n);
                }
            }

        }



        var p1= ccui.helper.seekWidgetByName(node, "p1");
        p1.visible=false;

        var groupCards=[];

        if(showUserInfo!=null)
        {

            var group=showUserInfo.cards2;
            var gCount=group.length;
            for(var k=0;k<gCount;k++)
            {
                var g=group[k];
                groupCards.push(g.cards);
            }



            var gCount=groupCards.length;
            //cc.log("count::::::::"+gCount);
            for(var k=0;k<gCount;k++)
            {
                var arr=groupCards[k];
                if(arr.length<=0)
                {
                    continue;
                }
                var panel=p1.clone();
                panel.x=p1.x+k*50;
                panel.y=p1.y;
                panel.visible=true;
                p1.getParent().addChild(panel);

                cc.log("arr::::::len::"+arr.length);


                var a1= ccui.helper.seekWidgetByName(panel, "a1");
                a1.visible=false;
                var a6= ccui.helper.seekWidgetByName(panel, "a6");




                var a=this.isTiOrPao(arr);
                var type=arr[0].type;

                var worldPng=null;
                var score=0;

                if(a==1)//提
                {
                    worldPng="res/ui/finish2/ti_finish.png";
                    if(type==0)
                    {
                        score=12;
                    }
                    else{
                        score=9;
                    }

                }
                else if(a==2)
                {
                    //跑
                    worldPng="res/ui/finish2/pao_finish.png";
                    if(type==0)
                    {
                        score=9;
                    }
                    else{
                        score=6;
                    }

                }
                else
                {
                    a=this.isPengOrWeiorKan(arr);
                    if(a==1)
                    {
                        //偎
                        worldPng="res/ui/finish2/wei_finish.png";
                        if(type==0)
                        {
                            score=6;
                        }
                        else{
                            score=3;
                        }
                    }
                    else if(a==2)
                    {
                        //坎
                        worldPng="res/ui/finish2/kan_finish.png";
                        if(type==0)
                        {
                            score=6;
                        }
                        else{
                            score=3;
                        }
                    }
                    else if(a==3)
                    {
                        //碰
                        worldPng="res/ui/finish2/peng_finish.png";
                        if(type==0)
                        {
                            score=3;
                        }
                        else{
                            score=1;
                        }
                    }
                    else{

                        a=this.isOneTwoThreeOrTwoSevenTen(arr);
                        if(a==1||a==2)
                        {
                            //1/2/3
                            if(type==0)
                            {
                                score=6;
                            }
                            else{
                                score=3;
                            }

                        }

                        if(a==1)
                        {
                            //123
                            worldPng="res/ui/finish2/shun_finish.png";
                        }
                        else if(a==2)
                        {
                            //2/7/10
                            worldPng="res/ui/finish2/bian_finish.png";
                        }
                        else{
                            var b=this.checkIsShunOrBian(arr);
                            if(b==1)
                            {
                                worldPng="res/ui/finish2/shun_finish.png";
                            }
                            else if(b==2)
                            {
                                worldPng="res/ui/finish2/bian_finish.png";
                            }
                        }




                    }

                }

                if(worldPng!=null)
                {
                    var sp=new cc.Sprite(worldPng);
                    sp.x=a1.x;
                    sp.y=a1.y;
                    panel.addChild(sp);
                }
                a6.setString(""+score);
                var init_x=a6.x;
                var init_y=a6.y+40;
                var gap_h=37;
                var aCount=arr.length;
                for(var kk=0;kk<aCount;kk++)
                {
                    var card=arr[kk];
                    var cardSprite=new CardSprite();
                    cardSprite.createCard(card);
                    cardSprite.changeToSmall2();
                    cardSprite.x=init_x;
                    cardSprite.y=init_y+gap_h*kk;
                    //cardSprite.setScl(0.3);

                    panel.addChild(cardSprite)

                    cc.log("card.flg2:::"+card.flg2);
                    if(card.flg2==1)
                    {
                        //胡的那张牌
                        // var sp=new cc.Sprite("res/ui/finish2/hupaikuang_room.png");
                        // sp.x=cardSprite.x;
                        // sp.y=cardSprite.y;
                        // sp.setScale(0.3);

                        cardSprite.setBlue();

                        //panel.addChild(sp)



                    }
                }


            }

            var roomUser=room.getRoomUserByUID(showUserInfo.uid);

            var head= ccui.helper.seekWidgetByName(node, "head1");
            var uid=roomUser.user.uid;
            var headName=uid+"_head.png";
            var headIconPath=getSkinPath(headName);
            if(checkFileExit(headIconPath))
            {
                var headSprite=new cc.Sprite(headIconPath);
                headSprite.x=head.x;
                headSprite.y=head.y;
                headSprite.setScale(1.3);
                head.getParent().addChild(headSprite,1);
            }

            var name= ccui.helper.seekWidgetByName(node, "name1");
            name.setString(roomUser.user.name);

            var id= ccui.helper.seekWidgetByName(node, "id1");
            id.setString("ID:"+showUserInfo.uid);


            var zonghuxi= ccui.helper.seekWidgetByName(node, "zonghuxi1");
            if(RULE_VALUE==ROOM_TYPE_HONGHU_147)
            {
                zonghuxi.setString("总墩数:"+showUserInfo.zonghuxi);
            }
            else{
                zonghuxi.setString("总胡息:"+showUserInfo.zonghuxi);
            }




            var huxi1=showUserInfo.huxi;
            var huxi2="";

            var mingtangValue=0;
            var dunshuCount=showUserInfo.dunshu;

            if(RULE_VALUE==ROOM_TYPE_HONGHU_147)
            {
                if(showUserInfo.isHuPai==1)
                {
                    if(this.gameFinishedNotify.type==1)
                    {
                      //  huxi2="+1";
                        //dunshuCount-=1;
                        mingtangValue+=1;
                    }
                    else if(this.gameFinishedNotify.type==2)
                    {
                        // huxi2="+1";
                        // dunshuCount-=1;
                        mingtangValue+=1;
                    }
                    else if(this.gameFinishedNotify.type==3)
                    {
                        // huxi2="+1";
                        // dunshuCount-=1;

                        mingtangValue+=1;
                    }

                    if(this.gameFinishedNotify.type2.length>0)
                    {
                        // huxi2+="+1";
                        // dunshuCount-=1;
                        mingtangValue+=1;

                    }
                }


                var huxi= ccui.helper.seekWidgetByName(node, "huxi1");
                huxi.setString("胡息:"+huxi1);
            }
            else{
                if(showUserInfo.isHuPai==1)
                {
                    if(this.gameFinishedNotify.type==1)
                    {
                        huxi2="+10";
                        huxi1-=10;
                    }
                    else if(this.gameFinishedNotify.type==2)
                    {
                        huxi2="+10";
                        huxi1-=10;
                    }
                    else if(this.gameFinishedNotify.type==3)
                    {
                        huxi2="+10";
                        huxi1-=10;
                    }
                }


                var huxi= ccui.helper.seekWidgetByName(node, "huxi1");
                huxi.setString("胡息:"+huxi1+huxi2);
            }




            var dunshu= ccui.helper.seekWidgetByName(node, "dunshu");
            dunshu.visible=false;

            if(RULE_VALUE==ROOM_TYPE_HONGHU_147)
            {
                var a=dunshuCount/2;
                var str="("+(a-mingtangValue)+"+"+mingtangValue+")x2="+dunshuCount;
                dunshu.setString("墩数:"+str);
                dunshu.visible=true;
            }



            // var score= ccui.helper.seekWidgetByName(node, "score1");
            // score.setString("得分:"+showUserInfo.score);

            var yuanbao= ccui.helper.seekWidgetByName(node, "yuanbao1");
            yuanbao.setString("元宝:"+showUserInfo.yuanbao);

            var zhuang1= ccui.helper.seekWidgetByName(node, "zhuang1");
            if(showUserInfo.roleType==1)//庄家
            {
                zhuang1.visible=true;
            }
            else{
                zhuang1.visible=false;
            }
            var yingjia= ccui.helper.seekWidgetByName(node, "yingjia");
            yingjia.visible=false;
            if(showUserInfo.isHuPai==1)
            {
                yingjia.visible=true;
            }

            var fangzhu1= ccui.helper.seekWidgetByName(node, "fangzhu1");
            fangzhu1.visible=false;

            if(showUserInfo.uid==room.roomInfo.uid)
            {
                fangzhu1.visible=true;
            }

        }

        var roomId= ccui.helper.seekWidgetByName(node, "roomId");
        roomId.setString(room.roomInfo.roomId);

        var guize= ccui.helper.seekWidgetByName(node, "guize");
        if(room.roomInfo.renshu==3)
        {
            guize.setString("3人");
        }
        else if(room.roomInfo.renshu==4)
        {
            guize.setString("4人");
        }

        // var choushui= ccui.helper.seekWidgetByName(node, "choushui");
        // choushui.setString(""+room.roomInfo.choushui);

        var date= ccui.helper.seekWidgetByName(node, "date");
        var str=new Date().Format("yyyy/MM/dd hh:mm");
        date.setString(str);



        // this.time= ccui.helper.seekWidgetByName(node, "time");
        // this.time.visible=false;


        // var Image_72= ccui.helper.seekWidgetByName(node, "Image_72");
        // Image_72.visible=false;

         var finishedNext= ccui.helper.seekWidgetByName(node, "start");
        finishedNext.visible=false;

        var returnB= ccui.helper.seekWidgetByName(node, "jiesuan_fen");
        returnB.visible=false;
        // var share= ccui.helper.seekWidgetByName(node, "share");
        // share.visible=false;

        var xiaojie= ccui.helper.seekWidgetByName(node, "xiaojie");
        xiaojie.visible=false;

        var zongjie= ccui.helper.seekWidgetByName(node, "zongjie");
        zongjie.visible=false;

        if(this.gameFinishedNotify.state==0)
        {
           // this.time.visible=true;
            finishedNext.visible=true;
          //  Image_72.visible=true;
            finishedNext.addTouchEventListener(this.nextClicked,this);

            xiaojie.visible=true;
        }
        else{
           // share.visible=true;
            returnB.visible=true;

            returnB.addTouchEventListener(this.returnBClicked,this);
          //  share.addTouchEventListener(this.shareClicked,this);

            zongjie.visible=true;
        }

        var p2= ccui.helper.seekWidgetByName(node, "p2");
        p2.visible=false;

        var count=userInfos.length;
        var index=0;
        for(var i=0;i<count;i++)
        {
            var userInfo=userInfos[i];
            if(userInfo==showUserInfo)
            {
                continue;
            }

            var panel=p2.clone();
            panel.visible=true;
            panel.x=p2.x+index*210;
            panel.y=p2.y;
            p2.getParent().addChild(panel);
            index++;


            var roomUser=room.getRoomUserByUID(userInfo.uid);
            var head= ccui.helper.seekWidgetByName(panel, "head");
            var uid=roomUser.user.uid;
            var headName=uid+"_head.png";
            var headIconPath=getSkinPath(headName);
            if(checkFileExit(headIconPath))
            {
                var headSprite=new cc.Sprite(headIconPath);
                headSprite.x=head.x;
                headSprite.y=head.y;
                headSprite.setScale(1.3);
                head.getParent().addChild(headSprite,1);
            }
            var name= ccui.helper.seekWidgetByName(panel, "name");
            name.setString(roomUser.user.name);

            var id= ccui.helper.seekWidgetByName(panel, "Text_18");
            id.setString("ID:"+roomUser.user.uid);

            if(RULE_VALUE==ROOM_TYPE_HONGHU_147)
            {
                var zonghuxi= ccui.helper.seekWidgetByName(panel, "zonghuxi");
                zonghuxi.setString("总墩数:"+userInfo.zonghuxi);

                var huxi= ccui.helper.seekWidgetByName(panel, "huxi");
                huxi.setString("墩数:"+userInfo.dunshu);
            }
            else{
                var zonghuxi= ccui.helper.seekWidgetByName(panel, "zonghuxi");
                zonghuxi.setString("总胡息:"+userInfo.zonghuxi);

                var huxi= ccui.helper.seekWidgetByName(panel, "huxi");
                huxi.setString("胡息:"+userInfo.huxi);
            }



             var yuanbao= ccui.helper.seekWidgetByName(panel, "yuanbao");
            yuanbao.setString("元宝:"+userInfo.yuanbao);

            var xian= ccui.helper.seekWidgetByName(panel, "xian");
            var zhuang= ccui.helper.seekWidgetByName(panel, "zhuang");
            zhuang.visible=false;
            xian.visible=false;

            if(userInfo.roleType==1)//庄家
            {
                zhuang.visible=true;

            }
            else if(userInfo.roleType==2)
            {
                xian.visible=true;
            }

            var fangzhu1= ccui.helper.seekWidgetByName(panel, "fangzhu");
            fangzhu1.visible=false;

            if(userInfo.uid==room.roomInfo.uid)
            {
                fangzhu1.visible=true;
            }

        }

        //this.schedule(this.finishedLayerTime, 20);

    },
    setLeftTime:function (t) {

        this.time.setString(""+t);
    },
    finishedLayerTime:function (dt) {

        this.removeFromParent(true);
    },
    shareClicked:function (sender, type) {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {


            }
                break;


            default:
                break;
        }

    },
    returnBClicked:function (sender, type) {

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

                this.room.hideFinishedLayer();
                this.room.showFinishedScoreLayer();


            }
                break;


            default:
                break;
        }

    },
    nextClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                this.room.hideFinishedLayer();
                this.room.hideSlectedButton(myPlayerInfo.uid);

                var req=new ReadyRequest();
                req.uid=myPlayerInfo.uid;
                req.roomId=this.room.roomInfo.roomId;
                socketMgr.socket.send(READY_REQUEST,req);

            }
                break;


            default:
                break;
        }


    },
    isTiOrPao:function (arr) {

        if(arr.length!=4)
        {
            return 0;
        }
        var flg=true;
        var card=null;
        var len=arr.length;
        var isBack=false;
        for(var i=0;i<len;i++)
        {
            var c=arr[i];
            if(card==null)
            {
                card=c;
            }
            else{
                if(card.type!=c.type||card.value!=c.value)
                {
                    flg=false;
                    break;
                }

            }

            if(c.isBack==1)
            {
                isBack=true;
            }


        }
        if(!flg)
        {
            return 0;
        }

        if(isBack)
        {
            return 1;//提
        }
        else{
            return 2;//跑
        }


    },

    isPengOrWeiorKan:function (arr) {

        if(arr.length!=3)
        {
            return 0;
        }
        var flg=true;
        var card=null;
        var len=arr.length;
        var isBack=false;
        var isKan=true;
        for(var i=0;i<len;i++)
        {
            var c=arr[i];
            if(card==null)
            {
                card=c;
            }
            else{
                if(card.type!=c.type||card.value!=c.value)
                {
                    flg=false;
                    break;
                }



            }
            if(c.flg!=1)
            {
                isKan=false;
            }

            if(c.isBack==1)
            {
                isBack=true;
            }


        }
        if(!flg)
        {
            return 0;
        }
        if(isBack)
        {
            return 1;//偎
        }
        else if(isKan){

            return 2;//碰
        }
        else{
            return 3;//碰
        }


    },
    checkIsShunOrBian:function (arr) {


        if(arr.length!=3)
        {
            return 0;
        }

        
        //顺子


        var c1=arr[0];
        var c2=arr[1];
        var c3=arr[2];

        var minC=c1;
        if(minC.value>c2.value)
        {
            minC=c2;
        }
        if(minC.value>c3.value)
        {
            minC=c3;
        }
        for(var k=0;k<3;k++) {
            var cc = arr[k];
            if(cc==minC)
            {
                continue;
            }
            if(cc.value==(minC.value+1)&&(cc.type==minC.type))
            {

                for(var k2=0;k2<3;k2++) {
                    var cc2 = arr[k2];
                    if (cc2 == minC) {
                        continue;
                    }
                    if(cc2.value==(minC.value+2)&&(cc2.type==minC.type))
                    {
                        return 1;//顺子
                    }

                }

            }

        }


        //编子
        if(c1.value==c2.value&&c1.value==c3.value)
        {
            var typeCount=0;
            var typeFlg=c1.type;
            for(var k=0;k<3;k++) {
                var cc = arr[k];
                if(cc.type==typeFlg)
                {
                    typeCount++;
                }

            }

            if(typeCount==1||typeCount==2)
            {
                return 2;//编子
            }


        }

        return 0;

    },
    isOneTwoThreeOrTwoSevenTen:function (arr) {

        if(arr.length!=3)
        {
            return 0;
        }

        var c1=arr[0];
        var c2=arr[1];
        var c3=arr[2];

        if(c1.value==1||c2.value==1||c3.value==1)
        {


            for(var k=0;k<3;k++)
            {
                var cc=arr[k];
                if(cc.value==1)
                {
                    for(var k2=0;k2<3;k2++) {
                        var cc2 = arr[k2];
                        if(cc2.value==2)
                        {
                            for(var k3=0;k3<3;k3++) {
                                var cc3 = arr[k3];
                                if(cc3.value==3)
                                {

                                    return 1;//1/2/3


                                }

                            }

                        }

                    }

                }

            }

        }
        else if(c1.value==7||c2.value==7||c3.value==7)
        {


            for(var k=0;k<3;k++)
            {
                var cc=arr[k];
                if(cc.value==2)
                {
                    for(var k2=0;k2<3;k2++) {
                        var cc2 = arr[k2];
                        if(cc2.value==7)
                        {
                            for(var k3=0;k3<3;k3++) {
                                var cc3 = arr[k3];
                                if(cc3.value==10)
                                {
                                    return 2;//2/7/10


                                }

                            }

                        }

                    }

                }

            }

        }

        return 0;

    }

});
