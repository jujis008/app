/**
 * Created by yungu on 16/12/22.
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

var FinishFuChengLayer=cc.Layer.extend({



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

        var node = parseUI("res/ui/finish_fucheng/finish_fucheng.json", CENTER);
        touchLayer.addChild(node);


        EventManager.getInstance().regist("CAPATURE_FINISHED_EVENT",this,this.capatureFinished);



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

        var mingtang1= ccui.helper.seekWidgetByName(node, "mingtang1");
        mingtang1.visible=false;

        var mingtang2= ccui.helper.seekWidgetByName(node, "mingtang2");
        mingtang2.visible=false;

        var mingtangArr=[];

        var mingcheng1Name="";

        if(RULE_VALUE!=ROOM_TYPE_WAIHUZI&&RULE_VALUE!=ROOM_TYPE_PENGHUZI)
        {

            if(this.gameFinishedNotify.type==1)
            {
                mingcheng1Name="res/ui/finish_fucheng/0.png";
            }
            else if(this.gameFinishedNotify.type==2)
            {
                mingcheng1Name="res/ui/finish_fucheng/1.png";
            }
            else if(this.gameFinishedNotify.type==3)
            {
                mingcheng1Name="res/ui/finish_fucheng/11.png";
            }
            else if(this.gameFinishedNotify.type==6)//放炮
            {
                mingcheng1Name="res/ui/finish_fucheng/12.png";
            }

            mingtangArr.push(mingcheng1Name);

        }




       // cc.log("this.gameFinishedNotify.type:"+this.gameFinishedNotify.type+",this.gameFinishedNotify.type2:"+this.gameFinishedNotify.type2.length);

        var mingcheng2Name="";

        if(this.gameFinishedNotify.type2.length>0)
        {
            if(RULE_VALUE==ROOM_TYPE_HONGHU_147)
            {
                var type2=this.gameFinishedNotify.type2[0]
                var sp=null;
                if(type2==6)//6:朱胡。7:红胡,8:乌胡
                {
                    mingcheng2Name="res/ui/finish_fucheng/9.png";;
                }
                else if(type2==7)
                {
                    mingcheng2Name="res/ui/finish_fucheng/4.png";;
                }
                else if(type2==8)
                {
                    mingcheng2Name="res/ui/finish_fucheng/5.png";;
                }
                // sp=new cc.Sprite(mingcheng2Name);
                // sp.x=mingtang2.x;
                // sp.y=mingtang2.y;
                // node.addChild(sp);

                mingtangArr.push(mingcheng2Name);

            }
            else if(RULE_VALUE==ROOM_TYPE_BINZHOU||RULE_VALUE==ROOM_TYPE_BINZHOU_YONGXING||RULE_VALUE==ROOM_TYPE_HENGYANG)
            {
                var type2=this.gameFinishedNotify.type2[0]
                var sp=null;

                if(type2==7)//6:朱胡。7:红胡,8:乌胡
                {
                    mingcheng2Name="res/ui/finish_fucheng/4.png";;
                }
                else if(type2==8)
                {
                    mingcheng2Name="res/ui/finish_fucheng/5.png";;
                }
                // sp=new cc.Sprite(mingcheng2Name);
                // sp.x=mingtang2.x;
                // sp.y=mingtang2.y;
                // node.addChild(sp);

                mingtangArr.push(mingcheng2Name);

            }
            else if(RULE_VALUE==ROOM_TYPE_BOPI||RULE_VALUE==ROOM_TYPE_GAOHUZI)
            {
                var type2=this.gameFinishedNotify.type2[0]
                var sp=null;
                if(type2==7.1)//7.1,7.2,7.3,8
                {
                    mingcheng2Name="res/ui/finish_fucheng/6.png";;
                }
                else if(type2==7.2)
                {
                    mingcheng2Name="res/ui/finish_fucheng/7.png";;
                }
                else if(type2==7.3)
                {
                    mingcheng2Name="res/ui/finish_fucheng/9.png";;
                }
                else if(type2==8)
                {
                    mingcheng2Name="res/ui/finish_fucheng/5.png";;
                }
                // sp=new cc.Sprite(mingcheng2Name);
                // sp.x=mingtang2.x;
                // sp.y=mingtang2.y;
                // node.addChild(sp);

                mingtangArr.push(mingcheng2Name);
            }
            else if(RULE_VALUE==ROOM_TYPE_LOUDI)
            {

                var mingTangCount=this.gameFinishedNotify.type2.length;
                for(var k=0;k<mingTangCount;k++)
                {
                    var m=this.gameFinishedNotify.type2[k];
                    var mName="";
                    if(m==17)//卡胡x2
                    {
                        mName="res/ui/finish_fucheng/8.png";;
                    }
                    else if(m==18)//卡胡+100
                    {
                        mName="res/ui/finish_fucheng/8.png";;

                    }
                    else if(m==15)//红乌
                    {

                        mName="res/ui/finish_fucheng/20.png";
                    }
                    else if(m==7)//红胡
                    {

                        mName="res/ui/finish_fucheng/4.png";
                    }
                    else if(m==6)//一点胡
                    {

                        mName="res/ui/finish_fucheng/9.png";
                    }
                    else if(m==8)//乌胡
                    {
                        mName="res/ui/finish_fucheng/5.png";

                    }
                    else if(m==12)//海底捞
                    {
                        mName="res/ui/finish_fucheng/2.png";

                    }
                    else if(m==16)//一块扁
                    {
                        mName="res/ui/finish_fucheng/10.png";

                    }
                    if(mName!="")
                    {
                        mingtangArr.push(mName);
                    }

                }

            }
            else if(RULE_VALUE==ROOM_TYPE_SHUANGFENG)
            {

                var mingTangCount=this.gameFinishedNotify.type2.length;
                for(var k=0;k<mingTangCount;k++)
                {
                    var m=this.gameFinishedNotify.type2[k];
                    var mName="";
                    if(m==17)//卡胡x2
                    {
                        mName="res/ui/finish_fucheng/8.png";;
                    }
                    else if(m==18)//卡胡+100
                    {
                        mName="res/ui/finish_fucheng/8.png";;

                    }
                    else if(m==15)//红乌
                    {

                        mName="res/ui/finish_fucheng/20.png";
                    }
                    else if(m==7||m==30)//红胡
                    {

                        mName="res/ui/finish_fucheng/4.png";
                    }
                    else if(m==6)//一点胡
                    {

                        mName="res/ui/finish_fucheng/9.png";
                    }
                    else if(m==8)//乌胡
                    {
                        mName="res/ui/finish_fucheng/5.png";

                    }
                    else if(m==12)//海底捞
                    {
                        mName="res/ui/finish_fucheng/2.png";

                    }
                    else if(m==16)//一块扁
                    {
                        mName="res/ui/finish_fucheng/10.png";

                    }
                    else if(m==19||m==20)//大三胡
                    {
                        mName="res/ui/finish_fucheng/26.png";

                    }
                    if(mName!="")
                    {
                        mingtangArr.push(mName);
                    }

                }

            }
        }

        if(mingtangArr.length>0)
        {

            var mCount=mingtangArr.length;
            for(var k=0;k<mCount;k++)
            {
                var imgName=mingtangArr[k];

                var sp=new cc.Sprite(imgName);
                sp.x=(mingtang2.x-mingtang1.x)*k+30;
                sp.y=mingtang1.y;
                node.addChild(sp);

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



        if(!hasHuPai)
        {

            var myRoomUser=room.getRoomUserByUID(myPlayerInfo.uid);
            if(myRoomUser.user.sex==1)
            {
                //playEffect("msg/"+effectSound.moHu.v);
            }
            else{
                //playEffect("msg/"+effectSound.moHu.n);
            }
        }
        else{
            var myRoomUser=room.getRoomUserByUID(myPlayerInfo.uid);

            if(myPlayerInfo.uid==showUserInfo.uid)
            {
                if(myRoomUser.user.sex==1)
                {
                    // playEffect("msg/"+effectSound.moHu_1.v);
                }
                else{
                    // playEffect("msg/"+effectSound.moHu_1.n);
                }
            }
            else{
                if(myRoomUser.user.sex==1)
                {
                    //playEffect("msg/"+effectSound.moHu.v);
                }
                else{
                    //playEffect("msg/"+effectSound.moHu.n);
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

            var gap_w=50;
            var init_gap_x=-gCount/2*gap_w;
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
                panel.x=p1.x+k*gap_w+init_gap_x;
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

                    if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                    {
                        worldPng="res/ui/finish_fucheng/qing_finish.png";
                        score=4;
                    }
                    else{
                        worldPng="res/ui/finish_fucheng/ti_finish.png";
                        if(type==0)
                        {
                            score=12;
                        }
                        else{
                            score=9;
                        }

                    }


                }
                else if(a==2)
                {
                    //跑

                    if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                    {
                        worldPng="res/ui/finish_fucheng/piao_finish.png";
                        score=1;
                    }
                    else{
                        worldPng="res/ui/finish_fucheng/pao_finish.png";

                        if(type==0)
                        {
                            score=9;
                        }
                        else{
                            score=6;
                        }
                    }


                }
                else
                {
                    a=this.isPengOrWeiorKan(arr);
                    if(a==1)
                    {
                        //偎

                        if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                        {


                            if(this.isHuArr(arr))
                            {
                                worldPng="res/ui/finish_fucheng/waihu_finish.png";
                            }
                            else{
                                worldPng="res/ui/finish_fucheng/wai_finish.png";
                            }


                            score=4;
                        }
                        else{

                            worldPng="res/ui/finish_fucheng/wei_finish.png";

                            if(type==0)
                            {
                                score=6;
                            }
                            else{
                                score=3;
                            }
                        }

                    }
                    else if(a==2)
                    {
                        //坎
                        worldPng="res/ui/finish_fucheng/kan_finish.png";
                        if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                        {
                            score=3;
                        }
                        else{
                            if(type==0)
                            {
                                score=6;
                            }
                            else{
                                score=3;
                            }

                        }

                    }
                    else if(a==3)
                    {
                        //碰
                        worldPng="res/ui/finish_fucheng/peng_finish.png";
                        if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                        {
                            if(this.isHuArr(arr))
                            {
                                worldPng="res/ui/finish_fucheng/penghu_finish.png";
                            }
                            score=1;
                        }
                        else{
                            if(type==0)
                            {
                                score=3;
                            }
                            else{
                                score=1;
                            }
                        }

                    }
                    else{

                        a=this.isOneTwoThreeOrTwoSevenTen(arr);
                        if(a==1||a==2)
                        {
                            if(a==2)
                            {
                                if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                                {
                                    score=1;
                                }
                                else{
                                    //2//7
                                    if(type==0)
                                    {
                                        score=6;
                                    }
                                    else{
                                        score=3;
                                    }
                                }
                            }
                            else{
                                if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                                {
                                    score=0;
                                }
                                else{
                                    //1/2/3
                                    if(type==0)
                                    {
                                        score=6;
                                    }
                                    else{
                                        score=3;
                                    }
                                }

                            }



                        }


                        if(a==1)
                        {
                            //123
                            worldPng="res/ui/finish_fucheng/shun_finish.png";

                            if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                            {
                                if(this.isHuArr(arr))
                                {
                                    worldPng="res/ui/finish_fucheng/chihu_finish.png";
                                }
                            }
                        }
                        else if(a==2)
                        {
                            //2/7/10
                            worldPng="res/ui/finish_fucheng/bian_finish.png";

                            if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                            {
                                if(this.isHuArr(arr))
                                {
                                    worldPng="res/ui/finish_fucheng/chihu_finish.png";
                                }
                            }
                        }
                        else{
                            var b=this.checkIsShunOrBian(arr);
                            if(b==1)
                            {
                                worldPng="res/ui/finish_fucheng/shun_finish.png";

                                if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                                {
                                    if(this.isHuArr(arr))
                                    {
                                        worldPng="res/ui/finish_fucheng/chihu_finish.png";
                                    }
                                }
                            }
                            else if(b==2)
                            {
                                worldPng="res/ui/finish_fucheng/bian_finish.png";

                                if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                                {
                                    if(this.isHuArr(arr))
                                    {
                                        worldPng="res/ui/finish_fucheng/chihu_finish.png";
                                    }
                                }
                            }
                            else{

                                if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                                {
                                    if(arr.length==2&&showUserInfo.isHuPai==1)
                                    {
                                        var aa1=arr[0];
                                        var aa2=arr[1];
                                        if(aa1.type==aa2.type&&aa1.value==aa2.value)
                                        {
                                            if(hasHuPai)
                                            {
                                                var hucard=null;
                                                if(aa1.flg2==1)
                                                {
                                                    hucard=aa1;
                                                }
                                                else if(aa2.flg2==1)
                                                {
                                                    hucard=aa2;
                                                }

                                                if(hucard!=null&&hucard.flg3==1&&hucard.uid==showUserInfo.uid)
                                                {
                                                    worldPng="res/ui/finish_fucheng/danwai_finish.png";
                                                    score=4;
                                                }
                                                else if(hucard!=null&&hucard.flg3==1&&hucard.uid!=showUserInfo.uid)
                                                {
                                                    worldPng="res/ui/finish_fucheng/danpeng_finish.png";
                                                    score=1;
                                                }
                                                else{
                                                    score=1;
                                                    worldPng="res/ui/finish_fucheng/dui.png";
                                                }


                                            }

                                        }
                                        else if(aa1.type==aa2.type&&(aa1.value==2||aa1.value==7||aa1.value==10))
                                        {
                                            if((aa2.value==2||aa2.value==7||aa2.value==10))
                                            {
                                                score=1;
                                            }


                                        }



                                    }

                                }




                            }
                        }




                    }

                }

                if(worldPng!=null)
                {
                    cc.log("worldPng:"+worldPng);
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
                   // cardSprite.setScl(0.3);
                    cardSprite.setLocalZOrder(aCount-kk+1);
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




            var mingtangValue=0;
            var dunshuCount=showUserInfo.dunshu2;


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
                       //  dunshuCount-=1;
                        mingtangValue+=1;
                    }

                    if(this.gameFinishedNotify.type2.length>0)
                    {
                        // huxi2+="+1";
                        // dunshuCount-=1;
                        mingtangValue+=1;

                    }
                }


                var huxi= ccui.helper.seekWidgetByName(node, "huxi2");
                huxi.setString(""+showUserInfo.huxi);

                var tunshu1= ccui.helper.seekWidgetByName(node, "tunshu1");
                var tunshu2= ccui.helper.seekWidgetByName(node, "tunshu2");
                tunshu1.setString("墩数:");
                tunshu2.setString(""+dunshuCount);

                var zong1= ccui.helper.seekWidgetByName(node, "zong1");
                var zong2= ccui.helper.seekWidgetByName(node, "zong2");
                zong1.setString("总墩数:");
                zong2.setString(""+showUserInfo.dunshu);

                var m1= ccui.helper.seekWidgetByName(node, "m1");
                m1.visible=false;
                var m2= ccui.helper.seekWidgetByName(node, "m2");
                m2.visible=false;
                var m3= ccui.helper.seekWidgetByName(node, "m3");
                m3.visible=false;
                var m4= ccui.helper.seekWidgetByName(node, "m4");
                m4.visible=false;

                if(this.gameFinishedNotify.type==1)//1:天胡,2:地胡,3:自摸
                {
                    m1.visible=true;
                    m1.setString("天胡:");

                    m2.visible=true;
                    m2.setString("+1墩");
                }
                else if(this.gameFinishedNotify.type==2)
                {
                    m1.visible=true;
                    m1.setString("地胡:");

                    m2.visible=true;
                    m2.setString("+1墩");
                }
                else if(this.gameFinishedNotify.type==3)
                {
                    m1.visible=true;
                    m1.setString("自摸:");

                    m2.visible=true;
                    m2.setString("+1墩");
                }

                if(this.gameFinishedNotify.type2.length>0) {
                    var type2 = this.gameFinishedNotify.type2[0];//6:朱胡。7:红胡,8:乌胡
                    if(type2==6)
                    {
                        m3.visible=true;
                        m3.setString("朱胡:");

                        m4.visible=true;
                        m4.setString("+1墩");
                    }
                    else if(type2==7)
                    {
                        m3.visible=true;
                        m3.setString("红胡:");

                        m4.visible=true;
                        m4.setString("+1墩");
                    }
                    else if(type2==8)
                    {
                        m3.visible=true;
                        m3.setString("乌胡:");

                        m4.visible=true;
                        m4.setString("+1墩");

                    }

                }


            }
            else if(RULE_VALUE==ROOM_TYPE_BINZHOU||RULE_VALUE==ROOM_TYPE_BINZHOU_YONGXING||RULE_VALUE==ROOM_TYPE_HENGYANG)
            {
                if(showUserInfo.isHuPai==1)
                {
                    if(this.gameFinishedNotify.type==1)//1:天胡,2:地胡,3:自摸
                    {

                        //dunshuCount/=2;


                    }
                    else if(this.gameFinishedNotify.type==2)
                    {
                       // dunshuCount/=2;
                    }
                    else if(this.gameFinishedNotify.type==3)
                    {
                        //dunshuCount/=2;
                    }
                    else if(this.gameFinishedNotify.type==6)
                    {
                       // dunshuCount/=4;
                    }

                    if(this.gameFinishedNotify.type2.length>0)
                    {
                        var type2 = this.gameFinishedNotify.type2[0];//6:朱胡。7:红胡,8:乌胡
                        if(type2==7)
                        {
                            //dunshuCount/=2;
                        }
                        else if(type2==8)
                        {
                            //dunshuCount/=2;

                        }

                    }
                }


                var huxi= ccui.helper.seekWidgetByName(node, "huxi2");
                huxi.setString(""+showUserInfo.huxi);

                var tunshu1= ccui.helper.seekWidgetByName(node, "tunshu1");
                var tunshu2= ccui.helper.seekWidgetByName(node, "tunshu2");
                tunshu1.setString("囤数:");
                tunshu2.setString(""+dunshuCount);

                var zong1= ccui.helper.seekWidgetByName(node, "zong1");
                var zong2= ccui.helper.seekWidgetByName(node, "zong2");
                zong1.setString("总囤数:");
                zong2.setString(""+showUserInfo.dunshu);

                var m1= ccui.helper.seekWidgetByName(node, "m1");
                m1.visible=false;
                var m2= ccui.helper.seekWidgetByName(node, "m2");
                m2.visible=false;
                var m3= ccui.helper.seekWidgetByName(node, "m3");
                m3.visible=false;
                var m4= ccui.helper.seekWidgetByName(node, "m4");
                m4.visible=false;

                if(this.gameFinishedNotify.type==1)//1:天胡,2:地胡,3:自摸
                {
                    m1.visible=true;
                    m1.setString("天胡:");

                    m2.visible=true;
                    m2.setString("x2");
                }
                else if(this.gameFinishedNotify.type==2)
                {
                    m1.visible=true;
                    m1.setString("地胡:");

                    m2.visible=true;
                    m2.setString("x2");
                }
                else if(this.gameFinishedNotify.type==3)
                {
                    m1.visible=true;
                    m1.setString("自摸:");

                    m2.visible=true;
                    m2.setString("x2");
                }
                else if(this.gameFinishedNotify.type==6)//放炮
                {
                    m1.visible=true;
                    m1.setString("放炮:");

                    m2.visible=true;
                    m2.setString("x"+this.room.roomInfo.renshu);
                }
                if(this.gameFinishedNotify.type2.length>0) {
                    var type2 = this.gameFinishedNotify.type2[0];//6:朱胡。7:红胡,8:乌胡
                    if(type2==7)
                    {
                        m3.visible=true;
                        m3.setString("红胡:");

                        m4.visible=true;
                        m4.setString("x2");
                    }
                    else if(type2==8)
                    {
                        m3.visible=true;
                        m3.setString("乌胡:");

                        m4.visible=true;
                        m4.setString("x2");

                    }

                }


            }
            else if(RULE_VALUE==ROOM_TYPE_BOPI||RULE_VALUE==ROOM_TYPE_GAOHUZI){

                var huxi1=showUserInfo.huxi;
                var huxi2="";

                if(showUserInfo.isHuPai==1)
                {
                    if(this.gameFinishedNotify.type==1)//1:天胡,2:地胡,3:自摸
                    {



                    }
                    else if(this.gameFinishedNotify.type==2)
                    {
                        dunshuCount/=2;
                    }
                    else if(this.gameFinishedNotify.type==3)
                    {
                        dunshuCount/=2;
                    }

                    if(this.gameFinishedNotify.type2.length>0)
                    {
                        var type2 = this.gameFinishedNotify.type2[0];//6:朱胡。7:红胡,8:乌胡
                        if(type2==7)
                        {
                            dunshuCount/=2;
                        }
                        else if(type2==8)
                        {
                            dunshuCount/=2;

                        }

                    }
                }


                var huxi= ccui.helper.seekWidgetByName(node, "huxi2");
                huxi.visible=false;

                var huxi1= ccui.helper.seekWidgetByName(node, "huxi1");
                huxi1.visible=false;


                var Image_6= ccui.helper.seekWidgetByName(node, "Image_6");
                Image_6.visible=false;


                var tunshu1= ccui.helper.seekWidgetByName(node, "tunshu1");
                var tunshu2= ccui.helper.seekWidgetByName(node, "tunshu2");
                tunshu1.visible=false;
                tunshu2.visible=false;


                var zong1= ccui.helper.seekWidgetByName(node, "zong1");
                var zong2= ccui.helper.seekWidgetByName(node, "zong2");
                zong1.setString("胡息:");
                zong2.setString(""+showUserInfo.huxi);



                var m1= ccui.helper.seekWidgetByName(node, "m1");
                m1.visible=false;
                var m2= ccui.helper.seekWidgetByName(node, "m2");
                m2.visible=false;
                var m3= ccui.helper.seekWidgetByName(node, "m3");
                m3.visible=false;
                var m4= ccui.helper.seekWidgetByName(node, "m4");
                m4.visible=false;

                if(RULE_VALUE!=ROOM_TYPE_GAOHUZI)
                {
                    if(this.gameFinishedNotify.type==1)//1:天胡,2:地胡,3:自摸
                    {
                        m1.visible=true;
                        m1.setString("天胡:");

                        m2.visible=true;
                        m2.setString("+10");
                    }
                    else if(this.gameFinishedNotify.type==2)
                    {
                        m1.visible=true;
                        m1.setString("地胡:");

                        m2.visible=true;
                        m2.setString("+10");
                    }
                    else if(this.gameFinishedNotify.type==3)
                    {
                        m1.visible=true;
                        m1.setString("自摸:");

                        m2.visible=true;
                        m2.setString("+10");
                    }

                }


                cc.log("#this.gameFinishedNotify.type2.length:"+this.gameFinishedNotify.type2.length);
                if(this.gameFinishedNotify.type2.length>0) {
                    var type2 = this.gameFinishedNotify.type2[0];//6:朱胡。7:红胡,8:乌胡

                    cc.log("type2:"+type2);
                    if(RULE_VALUE==ROOM_TYPE_GAOHUZI)
                    {

                        if(type2==30)//3盘正好50
                        {

                            m1.visible=true;
                            m1.setString("3盘正好50");

                            m2.visible=true;
                            m2.setString("");
                        }
                        else if(type2==31)
                        {
                            m1.visible=true;
                            m1.setString("2盘出告");

                            m2.visible=true;
                            m2.setString("");
                        }

                    }
                    else{

                        if(type2==8)
                        {
                            m3.visible=true;
                            m3.setString("乌胡");

                            m4.visible=true;
                            m4.setString("");
                        }
                        else
                        {
                            m3.visible=true;
                            m3.setString("红胡");

                            m4.visible=true;
                            m4.setString("");
                        }
                    }



                }




            }
            else if(RULE_VALUE==ROOM_TYPE_LOUDI){

                var huxi1=showUserInfo.huxi;
                var huxi2="";


                var huxi= ccui.helper.seekWidgetByName(node, "huxi2");
                huxi.visible=false;

                var huxi1= ccui.helper.seekWidgetByName(node, "huxi1");
                huxi1.visible=false;


                var Image_6= ccui.helper.seekWidgetByName(node, "Image_6");
                Image_6.visible=false;


                var tunshu1= ccui.helper.seekWidgetByName(node, "tunshu1");
                var tunshu2= ccui.helper.seekWidgetByName(node, "tunshu2");
                tunshu1.visible=false;
                tunshu2.visible=false;


                var zong1= ccui.helper.seekWidgetByName(node, "zong1");
                var zong2= ccui.helper.seekWidgetByName(node, "zong2");
                zong1.setString("胡息:");
                zong2.setString(""+showUserInfo.dunshu2);



                var m1= ccui.helper.seekWidgetByName(node, "m1");
                m1.visible=false;
                var m2= ccui.helper.seekWidgetByName(node, "m2");
                m2.visible=false;
                var m3= ccui.helper.seekWidgetByName(node, "m3");
                m3.visible=false;
                var m4= ccui.helper.seekWidgetByName(node, "m4");
                m4.visible=false;

                var hh=m3.y-m1.y;
                var mTangCount=0;
                if(this.gameFinishedNotify.type==1)//1:天胡,2:地胡,3:自摸
                {
                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;

                    mm1.setString("天胡:");
                    mm2.setString("+100");

                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);

                }
                else if(this.gameFinishedNotify.type==2)
                {
                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;

                    mm1.setString("地胡:");
                    mm2.setString("+100");

                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);
                }
                else if(this.gameFinishedNotify.type==3)
                {
                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;

                    mm1.setString("自摸:");
                    mm2.setString("x2");

                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);
                }
                else if(this.gameFinishedNotify.type==6)
                {
                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;

                    mm1.setString("放炮");
                    mm2.setString("");

                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);
                }


                var mingTangCount=this.gameFinishedNotify.type2.length;
                for(var k=0;k<mingTangCount;k++)
                {
                    var m=this.gameFinishedNotify.type2[k];
                    var mName="";

                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;



                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);

                    if(m==17)//卡胡x2
                    {
                        mm1.setString("卡胡:");
                        mm2.setString("x2");
                    }
                    else if(m==18)//卡胡+100
                    {
                        mm1.setString("卡胡:");
                        mm2.setString("+100");

                    }
                    else if(m==15)//红乌
                    {

                        mm1.setString("红乌:");
                        mm2.setString("+100");
                    }
                    else if(m==7)//红胡
                    {
                        mm1.setString("红胡:");
                        mm2.setString("x2");

                    }
                    else if(m==6)//一点胡
                    {
                        mm1.setString("一点胡:");
                        mm2.setString("x2");

                    }
                    else if(m==8)//乌胡
                    {

                        mm1.setString("乌胡:");
                        mm2.setString("+100");
                    }
                    else if(m==12)//海底捞
                    {
                        mm1.setString("海底捞:");
                        mm2.setString("x2");

                    }
                    else if(m==16)//一块扁
                    {

                        mm1.setString("一块扁:");
                        mm2.setString("x2");
                    }


                }


                var mm1=m1.clone();
                var mm2=m2.clone();

                mm1.visible=true;
                mm2.visible=true;



                mm1.y+=hh*mTangCount;
                mm2.y+=hh*mTangCount++;

                m1.getParent().addChild(mm1);
                m1.getParent().addChild(mm2);

                mm1.setString("总胡息:");
                mm2.setString(""+showUserInfo.huxi);


            }
            else if(RULE_VALUE==ROOM_TYPE_SHUANGFENG){

                var huxi1=showUserInfo.huxi;
                var huxi2="";


                var huxi= ccui.helper.seekWidgetByName(node, "huxi2");
                huxi.visible=false;

                var huxi1= ccui.helper.seekWidgetByName(node, "huxi1");
                huxi1.visible=false;


                var Image_6= ccui.helper.seekWidgetByName(node, "Image_6");
                Image_6.visible=false;


                var tunshu1= ccui.helper.seekWidgetByName(node, "tunshu1");
                var tunshu2= ccui.helper.seekWidgetByName(node, "tunshu2");
                tunshu1.visible=false;
                tunshu2.visible=false;


                var zong1= ccui.helper.seekWidgetByName(node, "zong1");
                var zong2= ccui.helper.seekWidgetByName(node, "zong2");
                zong1.setString("胡息:");
                zong2.setString(""+showUserInfo.dunshu2);



                var m1= ccui.helper.seekWidgetByName(node, "m1");
                m1.visible=false;
                var m2= ccui.helper.seekWidgetByName(node, "m2");
                m2.visible=false;
                var m3= ccui.helper.seekWidgetByName(node, "m3");
                m3.visible=false;
                var m4= ccui.helper.seekWidgetByName(node, "m4");
                m4.visible=false;

                var hh=m3.y-m1.y;
                var mTangCount=0;
                if(this.gameFinishedNotify.type==1)//1:天胡,2:地胡,3:自摸
                {
                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;

                    mm1.setString("天胡:");
                    mm2.setString("+100");

                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);

                }
                else if(this.gameFinishedNotify.type==2)
                {
                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;

                    mm1.setString("地胡:");
                    mm2.setString("+100");

                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);
                }
                else if(this.gameFinishedNotify.type==3)
                {
                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;

                    mm1.setString("自摸:");
                    mm2.setString("+10");

                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);
                }
                else if(this.gameFinishedNotify.type==6)
                {
                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;

                    mm1.setString("放炮:");
                    mm2.setString("+10");

                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);
                }


                var mingTangCount=this.gameFinishedNotify.type2.length;
                for(var k=0;k<mingTangCount;k++)
                {
                    var m=this.gameFinishedNotify.type2[k];
                    var mName="";

                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;



                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);

                    if(m==7)//红胡
                    {
                        mm1.setString("红胡:");
                        mm2.setString("x2");

                    }
                    else if(m==8)//乌胡
                    {

                        mm1.setString("乌胡:");
                        mm2.setString("+100");
                    }
                    else if(m==19)//
                    {
                        mm1.setString("大三胡:");
                        mm2.setString("x2");

                    }
                    else if(m==20)//
                    {
                        mm1.setString("大三胡:");
                        mm2.setString("+100");

                    }
                    else if(m==30)//
                    {
                        mm1.setString("红胡:");
                        mm2.setString("+100");

                    }

                }


                var mm1=m1.clone();
                var mm2=m2.clone();

                mm1.visible=true;
                mm2.visible=true;



                mm1.y+=hh*mTangCount;
                mm2.y+=hh*mTangCount++;

                m1.getParent().addChild(mm1);
                m1.getParent().addChild(mm2);

                mm1.setString("总胡息:");
                mm2.setString(""+showUserInfo.huxi);

            }
            else if(RULE_VALUE==ROOM_TYPE_WAIHUZI){


                var moveH=60;

                var huxi1=showUserInfo.huxi;
                var huxi2="";


                var huxi= ccui.helper.seekWidgetByName(node, "huxi2");
                huxi.visible=false;

                var huxi1= ccui.helper.seekWidgetByName(node, "huxi1");
                huxi1.visible=false;


                var Image_6= ccui.helper.seekWidgetByName(node, "Image_6");
                Image_6.visible=false;


                var tunshu1= ccui.helper.seekWidgetByName(node, "tunshu1");
                var tunshu2= ccui.helper.seekWidgetByName(node, "tunshu2");
                tunshu1.visible=false;
                tunshu2.visible=false;


                var zong1= ccui.helper.seekWidgetByName(node, "zong1");
                var zong2= ccui.helper.seekWidgetByName(node, "zong2");


                zong1.y+=moveH;
                zong2.y+=moveH;

                var hasMeiZi=false;
                var hasShowMeizi=false;

                if(this.room.roomInfo.qita==0)
                {
                    zong1.setString("胡息:");
                    zong2.setString(""+showUserInfo.dunshu2);
                }
                else{

                    if(this.gameFinishedNotify.type==1||this.gameFinishedNotify.type==2)
                    {
                        hasMeiZi=true;
                    }


                    var mingTangCount=this.gameFinishedNotify.type2.length;
                    for(var k=0;k<mingTangCount;k++) {
                        var m = this.gameFinishedNotify.type2[k];
                        if(m==20||m==21||m==22||m==8)
                        {
                            hasMeiZi=true;
                            break;
                        }
                        else if(m==29||m==9||m==12||m==6)
                        {
                            hasMeiZi=true;
                            break;
                        }

                    }

                    if(hasMeiZi)
                    {
                        zong1.setString("按50牌算:");
                        zong2.setString("");
                    }
                    else{
                        zong1.setString("胡息:");
                        zong2.setString(""+showUserInfo.dunshu2);
                    }

                }




                var m1= ccui.helper.seekWidgetByName(node, "m1");
                m1.visible=false;
                var m2= ccui.helper.seekWidgetByName(node, "m2");
                m2.visible=false;
                var m3= ccui.helper.seekWidgetByName(node, "m3");
                m3.visible=false;
                var m4= ccui.helper.seekWidgetByName(node, "m4");
                m4.visible=false;

                m1.y+=moveH;
                m2.y+=moveH;
                m3.y+=moveH;
                m4.y+=moveH;


                var hh=m3.y-m1.y;
                var mTangCount=0;
                if(this.gameFinishedNotify.type==1)//1:天胡,2:地胡,3:自摸
                {
                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;

                    if(hasMeiZi&&(!hasShowMeizi))
                    {
                        mm1.setString("天胡:");
                        mm2.setString("100");
                        hasShowMeizi=true;
                    }
                    else{
                        mm1.setString("天胡:");
                        mm2.setString("x8");
                    }


                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);

                }
                else if(this.gameFinishedNotify.type==2)
                {
                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;

                    if(hasMeiZi&&(!hasShowMeizi))
                    {
                        mm1.setString("地胡:");
                        mm2.setString("100");
                        hasShowMeizi=true;
                    }
                    else{
                        mm1.setString("地胡:");
                        mm2.setString("x8");
                    }


                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);
                }


                var mingTangCount=this.gameFinishedNotify.type2.length;
                for(var k=0;k<mingTangCount;k++)
                {
                    var m=this.gameFinishedNotify.type2[k];
                    var mName="";

                    var mm1=m1.clone();
                    var mm2=m2.clone();



                    var hasM=true;

                    if(m>4000)//
                    {
                        mm1.setString("火火翻:");
                        mm2.setString("x"+Math.pow(2,(m-4000))+"("+(m-4000+9)+"张)");
                    }
                    else if(m>3000)//外元
                    {
                        mm1.setString("外元:");
                        mm2.setString("x"+Math.pow(2,(m-3000)));
                    }
                    else if(m>2000&&m<=3000)//内元
                    {
                        mm1.setString("内元:");
                        mm2.setString("x"+Math.pow(4,(m-2000)));
                    }
                    else if(m==20)//对子息
                    {

                        if(hasMeiZi&&(!hasShowMeizi))
                        {
                            mm1.setString("对子息:");
                            mm2.setString("100");
                            hasShowMeizi=true;
                        }
                        else{
                            mm1.setString("对子息:");
                            mm2.setString("x8");
                        }


                    }
                    else if(m==21)//
                    {
                        if(hasMeiZi&&(!hasShowMeizi))
                        {
                            mm1.setString("大字胡:");
                            mm2.setString("100");
                            hasShowMeizi=true;
                        }
                        else{
                            mm1.setString("大字胡:");
                            mm2.setString("x8");
                        }


                    }
                    else if(m==22)//
                    {
                        if(hasMeiZi&&(!hasShowMeizi))
                        {
                            mm1.setString("小字胡:");
                            mm2.setString("100");
                            hasShowMeizi=true;
                        }
                        else{
                            mm1.setString("小字胡:");
                            mm2.setString("x8");
                        }


                    }
                    else if(m==8)//
                    {
                        if(hasMeiZi&&(!hasShowMeizi))
                        {
                            mm1.setString("黑胡子:");
                            mm2.setString("100");
                            hasShowMeizi=true;
                        }
                        else{
                            mm1.setString("黑胡子:");
                            mm2.setString("x8");
                        }


                    }
                    else if(m==9)//行 行息
                    {
                        if(hasMeiZi&&(!hasShowMeizi))
                        {
                            mm1.setString("行行息:");
                            mm2.setString("50");
                            hasShowMeizi=true;
                        }
                        else{
                            mm1.setString("行行息:");
                            mm2.setString("x4");
                        }


                    }
                    else if(m==24)//神腰
                    {
                        mm1.setString("神腰:");
                        mm2.setString("x2");

                    }
                    else if(m==12)//海底捞
                    {
                        if(this.room.roomInfo.gunze==1)
                        {

                            if(hasMeiZi&&(!hasShowMeizi))
                            {
                                mm1.setString("海底捞:");
                                mm2.setString("50");
                                hasShowMeizi=true;
                            }
                            else{
                                mm1.setString("海底捞:");
                                mm2.setString("x4");
                            }

                        }
                        else{
                            if(hasMeiZi&&(!hasShowMeizi))
                            {
                                mm1.setString("海底捞:");
                                mm2.setString("50");
                                hasShowMeizi=true;
                            }
                            else{
                                mm1.setString("海底捞:");
                                mm2.setString("x2");
                            }

                        }


                    }
                    else if(m==6)//一点红
                    {

                        if(hasMeiZi&&(!hasShowMeizi))
                        {
                            mm1.setString("一点红:");
                            mm2.setString("50");
                            hasShowMeizi=true;
                        }
                        else{
                            mm1.setString("一点红:");
                            mm2.setString("x4");
                        }


                    }
                    else if(m==27)//
                    {
                        mm1.setString("印:");
                        mm2.setString("x2");

                    }
                    else if(m==25)//
                    {
                        mm1.setString("单漂:");
                        mm2.setString("x2");

                    }
                    else if(m==26)//
                    {
                        mm1.setString("双漂:");
                        mm2.setString("x2");

                    }
                    else if(m==28)//
                    {
                        mm1.setString("花胡子:");
                        mm2.setString("x64");

                    }
                    else if(m==29)//
                    {

                        if(hasMeiZi&&(!hasShowMeizi))
                        {
                            mm1.setString("报听:");
                            mm2.setString("50");
                            hasShowMeizi=true;
                        }
                        else{
                            mm1.setString("报听:");
                            mm2.setString("x4");
                        }


                    }
                    else{
                        hasM=false;
                    }


                    if(hasM)
                    {
                        mm1.y+=hh*mTangCount;
                        mm2.y+=hh*mTangCount++;


                        mm1.visible=true;
                        mm2.visible=true;
                        m1.getParent().addChild(mm1);
                        m1.getParent().addChild(mm2);

                    }



                }

                var mm1=m1.clone();
                var mm2=m2.clone();

                mm1.visible=true;
                mm2.visible=true;



                mm1.y+=hh*mTangCount;
                mm2.y+=hh*mTangCount++;

                m1.getParent().addChild(mm1);
                m1.getParent().addChild(mm2);

                mm1.setString("总胡息:");
                mm2.setString(""+showUserInfo.huxi);




            }
            else if(RULE_VALUE==ROOM_TYPE_LEIYANG){

                var huxi1=showUserInfo.huxi;
                var huxi2="";


                var huxi= ccui.helper.seekWidgetByName(node, "huxi2");
                huxi.visible=false;

                var huxi1= ccui.helper.seekWidgetByName(node, "huxi1");
                huxi1.visible=false;


                var Image_6= ccui.helper.seekWidgetByName(node, "Image_6");
                Image_6.visible=false;


                var tunshu1= ccui.helper.seekWidgetByName(node, "tunshu1");
                var tunshu2= ccui.helper.seekWidgetByName(node, "tunshu2");
                tunshu1.visible=false;
                tunshu2.visible=false;


                var zong1= ccui.helper.seekWidgetByName(node, "zong1");
                var zong2= ccui.helper.seekWidgetByName(node, "zong2");
                zong1.setString("胡息:");
                zong2.setString(""+showUserInfo.huxi);



                var m1= ccui.helper.seekWidgetByName(node, "m1");
                m1.visible=false;
                var m2= ccui.helper.seekWidgetByName(node, "m2");
                m2.visible=false;
                var m3= ccui.helper.seekWidgetByName(node, "m3");
                m3.visible=false;
                var m4= ccui.helper.seekWidgetByName(node, "m4");
                m4.visible=false;



                var hh=m3.y-m1.y;
                var mTangCount=0;


                {
                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;

                    mm1.setString("分数:");
                    mm2.setString(""+showUserInfo.dunshu);

                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);
                }



                if(this.gameFinishedNotify.type==1)//1:天胡,2:地胡,3:自摸
                {
                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;

                    if(this.room.roomInfo.gunze==0)
                    {
                        mm1.setString("天胡:");
                        mm2.setString("x2");
                    }
                    else{
                        mm1.setString("天胡:");
                        mm2.setString("不翻倍");
                    }


                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);

                }
                else if(this.gameFinishedNotify.type==2)
                {
                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;

                    if(this.room.roomInfo.gunze==0)
                    {
                        mm1.setString("地胡:");
                        mm2.setString("x2");
                    }
                    else{
                        mm1.setString("地胡:");
                        mm2.setString("不翻倍");
                    }


                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);
                }
                else if(this.gameFinishedNotify.type==8)
                {
                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;

                    mm1.setString("三拢四坎:");
                    mm2.setString("x2");

                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);
                }
                else if(this.gameFinishedNotify.type==3)
                {
                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;

                    mm1.setString("自摸:");
                    mm2.setString("x2");

                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);
                }
                else if(this.gameFinishedNotify.type==7)
                {
                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;

                    mm1.setString("无胡");
                    mm2.setString("");

                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);
                }
                else if(this.gameFinishedNotify.type==6)
                {
                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;

                    mm1.setString("放炮");
                    mm2.setString("");

                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);
                }

                var mingTangCount=this.gameFinishedNotify.type2.length;
                for(var k=0;k<mingTangCount;k++)
                {
                    var m=this.gameFinishedNotify.type2[k];
                    var mName="";

                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;



                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);

                    if(m==6)//一点红
                    {
                        if(this.room.roomInfo.gunze==0)
                        {
                            mm1.setString("一点红:");
                            mm2.setString("x2");
                        }
                        else{
                            mm1.setString("一点红:");
                            mm2.setString("不翻倍");
                        }


                    }
                    else if(m==7)//
                    {
                        if(this.room.roomInfo.gunze==0)
                        {
                            mm1.setString("红胡:");
                            mm2.setString("x2");
                        }
                        else{
                            mm1.setString("红胡:");
                            mm2.setString("不翻倍");
                        }


                    }
                    else if(m==8)//
                    {

                        if(this.room.roomInfo.gunze==0)
                        {
                            if(this.room.roomInfo.renshu==4)
                            {

                                if(this.room.roomInfo.choushui==0)
                                {
                                    mm1.setString("黑胡:");
                                    mm2.setString("x2");
                                }
                                else if(this.room.roomInfo.choushui==1)
                                {
                                    mm1.setString("黑胡:");
                                    mm2.setString("x5");

                                }
                            }
                            else{
                                mm1.setString("黑胡:");
                                mm2.setString("x2");
                            }
                        }
                        else{

                            mm1.setString("黑胡:");
                            mm2.setString("不翻倍");
                        }




                    }
                    else if(m==12)//
                    {
                        mm1.setString("海底捞:");
                        mm2.setString("x2");

                    }
                    else if(m>5000)//
                    {
                        mm1.setString("龙:");
                        mm2.setString("+"+(m-5000));

                    }



                }





            }
            else if(RULE_VALUE==ROOM_TYPE_GUILIN||RULE_VALUE==ROOM_TYPE_DAZIPAI)
            {


                var huxi= ccui.helper.seekWidgetByName(node, "huxi2");
                huxi.setString(""+showUserInfo.huxi);

                var tunshu1= ccui.helper.seekWidgetByName(node, "tunshu1");
                var tunshu2= ccui.helper.seekWidgetByName(node, "tunshu2");
                tunshu1.setString("囤数:");
                tunshu2.setString(""+dunshuCount);

                var zong1= ccui.helper.seekWidgetByName(node, "zong1");
                var zong2= ccui.helper.seekWidgetByName(node, "zong2");
                zong1.setString("总囤数:");
                zong2.setString(""+showUserInfo.dunshu);

                var m1= ccui.helper.seekWidgetByName(node, "m1");
                m1.visible=false;
                var m2= ccui.helper.seekWidgetByName(node, "m2");
                m2.visible=false;
                var m3= ccui.helper.seekWidgetByName(node, "m3");
                m3.visible=false;
                var m4= ccui.helper.seekWidgetByName(node, "m4");
                m4.visible=false;


                var hh=m3.y-m1.y;
                var mTangCount=0;
                if(this.gameFinishedNotify.type==1)//1:天胡,2:地胡,3:自摸
                {
                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;

                    mm1.setString("天胡:");
                    mm2.setString("x2");

                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);

                }
                else if(this.gameFinishedNotify.type==2)
                {
                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;

                    mm1.setString("地胡:");
                    mm2.setString("x2");

                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);
                }
                else if(this.gameFinishedNotify.type==3)
                {
                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;

                    mm1.setString("自摸:");
                    mm2.setString("x2");

                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);
                }
                else if(this.gameFinishedNotify.type==6)
                {
                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;

                    mm1.setString("放炮");
                    mm2.setString("");

                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);
                }
                else if(this.gameFinishedNotify.type==8)
                {
                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;

                    mm1.setString("三龙五坎");
                    mm2.setString("x2");

                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);
                }

                var mingTangCount=this.gameFinishedNotify.type2.length;
                for(var k=0;k<mingTangCount;k++)
                {
                    var m=this.gameFinishedNotify.type2[k];
                    var mName="";

                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;


                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);

                    if(m==12)//海底捞
                    {
                        mm1.setString("海底捞:");
                        mm2.setString("x2");


                    }
                    else if(m>6000)
                    {
                        if(m>=6100&&m<6200)
                        {

                            mm1.setString("上醒:");
                            mm2.setString("+"+(m-6100));
                        }
                        else if(m>=6200&&m<6300)
                        {

                            mm1.setString("本醒:");
                            mm2.setString("+"+(m-6200));
                        }
                        else if(m>=6300)
                        {

                            mm1.setString("下醒:");
                            mm2.setString("+"+(m-6300));
                        }


                    }



                }



                if(this.room.fanxing_card!=null)
                {

                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=false;


                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);

                    mm1.setString("翻醒:");

                    var xingSize=this.room.fanxing_card.length;
                    cc.log("xingSize:"+xingSize);
                    for(var xIndex=0;xIndex<xingSize;xIndex++)
                    {
                        var xCard=this.room.fanxing_card[xIndex];

                        var cardSprite=new CardSprite();
                        cardSprite.createCard(xCard);
                        cardSprite.changeToSmall2();
                        cardSprite.x=mm2.x+xIndex*w_gap;
                        cardSprite.y=mm2.y;
                        m1.getParent().addChild(cardSprite)



                    }






                }


            }
            else if(RULE_VALUE==ROOM_TYPE_HUAIHUA)
            {


                var huxi= ccui.helper.seekWidgetByName(node, "huxi2");
                huxi.setString(""+showUserInfo.huxi);

                var tunshu1= ccui.helper.seekWidgetByName(node, "tunshu1");
                var tunshu2= ccui.helper.seekWidgetByName(node, "tunshu2");
                tunshu1.setString("囤数:");
                if(this.gameFinishedNotify.type==3)
                {
                    tunshu2.setString(""+dunshuCount+"(自摸+1)");
                }
                else{
                    tunshu2.setString(""+dunshuCount);
                }

                var zong1= ccui.helper.seekWidgetByName(node, "zong1");
                var zong2= ccui.helper.seekWidgetByName(node, "zong2");
                zong1.setString("总囤数:");

                if(this.gameFinishedNotify.type==3)
                {
                    zong2.setString(""+(dunshuCount+1));
                }
                else{
                    zong2.setString(""+dunshuCount);
                }



                var m1= ccui.helper.seekWidgetByName(node, "m1");
                m1.visible=false;
                var m2= ccui.helper.seekWidgetByName(node, "m2");
                m2.visible=false;
                var m3= ccui.helper.seekWidgetByName(node, "m3");
                m3.visible=false;
                var m4= ccui.helper.seekWidgetByName(node, "m4");
                m4.visible=false;


                var hh=m3.y-m1.y;
                var mTangCount=0;
                if(this.gameFinishedNotify.type==1)//1:天胡,2:地胡,3:自摸
                {
                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;

                    mm1.setString("天胡:");
                    if(this.room.roomInfo.gunze==1)
                    {
                        mm2.setString("x4");
                    }
                    else{
                        mm2.setString("x8");
                    }


                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);

                }
                else if(this.gameFinishedNotify.type==2)
                {
                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;

                    mm1.setString("地胡:");
                    if(this.room.roomInfo.gunze==1)
                    {
                        mm2.setString("x3");
                    }
                    else{
                        mm2.setString("x6");
                    }

                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);
                }
                else if(this.gameFinishedNotify.type==3)
                {
                    //var mm1=m1.clone();
                    //var mm2=m2.clone();
                    //
                    //mm1.visible=true;
                    //mm2.visible=true;
                    //
                    //mm1.setString("自摸:");
                    //mm2.setString("+1");
                    //
                    //mm1.y+=hh*mTangCount;
                    //mm2.y+=hh*mTangCount++;
                    //
                    //m1.getParent().addChild(mm1);
                    //m1.getParent().addChild(mm2);
                }

                var mingTangCount=this.gameFinishedNotify.type2.length;
                for(var k=0;k<mingTangCount;k++)
                {
                    var m=this.gameFinishedNotify.type2[k];
                    var mName="";

                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;


                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);

                    if(m==6)
                    {
                     //一点红
                        mm1.setString("一点红:");
                        if(this.room.roomInfo.gunze==1)
                        {
                            mm2.setString("x3");
                        }
                        else{
                            mm2.setString("x6");
                        }
                    }
                    else if(m>=4000&&m<5000)//红胡
                    {
                        mm1.setString("红胡:");
                        mm2.setString("x"+(m-4000));

                    }
                    else if(m==8)//
                    {
                        mm1.setString("乌胡:");
                        if(this.room.roomInfo.gunze==1)
                        {
                            mm2.setString("x5");
                        }
                        else{
                            mm2.setString("x8");
                        }


                    }
                    else if(m==31)//
                    {
                        mm1.setString("碰碰胡:");
                        if(this.room.roomInfo.gunze==1)
                        {
                            mm2.setString("x4");
                        }
                        else{
                            mm2.setString("x8");
                        }


                    }
                    else if(m>=5000&&m<6000)//
                    {
                        mm1.setString("十八大:");
                        mm2.setString("x"+(m-5000));

                    }
                    else if(m>=6000&&m<7000)//
                    {
                        mm1.setString("十六小:");
                        mm2.setString("x"+(m-6000));

                    }
                    else if(m==12)//海底捞
                    {
                        mm1.setString("海底捞:");
                        if(this.room.roomInfo.gunze==1)
                        {
                            mm2.setString("x3");
                        }
                        else{
                            mm2.setString("x6");
                        }


                    }




                }

                var mm1=m1.clone();
                var mm2=m2.clone();

                mm1.visible=true;
                mm2.visible=true;

                mm1.setString("总计分:");
                mm2.setString(""+showUserInfo.dunshu);

                mm1.y+=hh*mTangCount;
                mm2.y+=hh*mTangCount++;

                m1.getParent().addChild(mm1);
                m1.getParent().addChild(mm2);





            }
            else if(RULE_VALUE==ROOM_TYPE_HONGHEIHU)
            {


                var fanmaCount=0;
                var mingTangCount=this.gameFinishedNotify.type2.length;
                for(var k=0;k<mingTangCount;k++) {
                    var m = this.gameFinishedNotify.type2[k];
                    if(m>=6100&&m<6200)
                    {
                        fanmaCount=(m-6100)
                        break;
                    }

                }
                var huxi= ccui.helper.seekWidgetByName(node, "huxi2");
                huxi.setString(""+showUserInfo.huxi);

                var tunshu1= ccui.helper.seekWidgetByName(node, "tunshu1");
                var tunshu2= ccui.helper.seekWidgetByName(node, "tunshu2");
                tunshu1.setString("分数:");
                if(fanmaCount>0)
                {
                    tunshu2.setString(""+dunshuCount+"(翻码+"+fanmaCount+")");
                }
                else{
                    tunshu2.setString(""+dunshuCount+"(翻码+0)");
                }
                var zong1= ccui.helper.seekWidgetByName(node, "zong1");
                var zong2= ccui.helper.seekWidgetByName(node, "zong2");
                zong1.setString("总分数:");
                zong2.setString(""+showUserInfo.dunshu);

                var m1= ccui.helper.seekWidgetByName(node, "m1");
                m1.visible=false;
                var m2= ccui.helper.seekWidgetByName(node, "m2");
                m2.visible=false;
                var m3= ccui.helper.seekWidgetByName(node, "m3");
                m3.visible=false;
                var m4= ccui.helper.seekWidgetByName(node, "m4");
                m4.visible=false;


                var hh=m3.y-m1.y;
                var mTangCount=0;

                if(this.gameFinishedNotify.type==3)
                {
                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;

                    mm1.setString("自摸:");
                    mm2.setString("x2");

                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);
                }
                else if(this.gameFinishedNotify.type==6)
                {
                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=true;

                    mm1.setString("放炮");
                    mm2.setString("");

                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);
                }


                mingTangCount=this.gameFinishedNotify.type2.length;
                for(var k=0;k<mingTangCount;k++)
                {
                    var m=this.gameFinishedNotify.type2[k];
                    var mName="";


                    var mm1=m1.clone();
                    var mm2=m2.clone();


                    if(m==7)//
                    {
                        mm1.setString("红胡:");
                        mm2.setString("x3");
                    }
                    else if(m==30)//
                    {
                        mm1.setString("红胡:");
                        mm2.setString("x5");
                    }
                    else if(m==6)//
                    {
                        mm1.setString("一点红:");
                        mm2.setString("x3");
                    }
                    else if(m==8)//
                    {
                        mm1.setString("黑胡:");
                        mm2.setString("x5");
                    }
                    else{

                        continue;

                    }

                    mm1.visible=true;
                    mm2.visible=true;


                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);

                }



                if(this.room.fanxing_card!=null&&this.room.fanxing_card.length>0)
                {

                    var mm1=m1.clone();
                    var mm2=m2.clone();

                    mm1.visible=true;
                    mm2.visible=false;


                    mm1.y+=hh*mTangCount;
                    mm2.y+=hh*mTangCount++;

                    m1.getParent().addChild(mm1);
                    m1.getParent().addChild(mm2);

                    mm1.setString("翻码:");

                    var xingSize=this.room.fanxing_card.length;
                    for(var xIndex=0;xIndex<xingSize;xIndex++)
                    {
                        var xCard=this.room.fanxing_card[xIndex];

                        var cardSprite=new CardSprite();
                        cardSprite.createCard(xCard);
                        cardSprite.changeToSmall2();
                        cardSprite.x=mm2.x+xIndex*w_gap;
                        cardSprite.y=mm2.y;
                        m1.getParent().addChild(cardSprite)

                    }






                }


            }
            else if(RULE_VALUE==ROOM_TYPE_PENGHUZI)
            {

                var huxi1= ccui.helper.seekWidgetByName(node, "huxi1");
                huxi1.visible=false;

                var huxi= ccui.helper.seekWidgetByName(node, "huxi2");
                huxi.visible=false;

                var tunshu1= ccui.helper.seekWidgetByName(node, "tunshu1");
                var tunshu2= ccui.helper.seekWidgetByName(node, "tunshu2");
                tunshu1.visible=false;
                tunshu2.visible=false;


                var zong1= ccui.helper.seekWidgetByName(node, "zong1");
                var zong2= ccui.helper.seekWidgetByName(node, "zong2");
                zong1.visible=false;
                zong2.visible=false;

                var m1= ccui.helper.seekWidgetByName(node, "m1");
                m1.visible=false;
                var m2= ccui.helper.seekWidgetByName(node, "m2");
                m2.visible=false;
                var m3= ccui.helper.seekWidgetByName(node, "m3");
                m3.visible=false;
                var m4= ccui.helper.seekWidgetByName(node, "m4");
                m4.visible=false;


            }

        }



        var date= ccui.helper.seekWidgetByName(node, "time");
        var str=this.room.getServerTime();
        date.setString(str);



        var share= ccui.helper.seekWidgetByName(node, "share");
        share.addTouchEventListener(this.shareClicked,this);

        var jixu= ccui.helper.seekWidgetByName(node, "jixu");
        var jiesuan= ccui.helper.seekWidgetByName(node, "jiesuan");

        jixu.visible=false;
        jiesuan.visible=false;
        share.visible=false;




        if(this.gameFinishedNotify.state==0)
        {
            share.visible=true;
            jixu.visible=true;
            jixu.addTouchEventListener(this.jixuClicked,this);

        }
        else if(this.gameFinishedNotify.state==3){

            share.visible=true;
            jixu.visible=true;
            jixu.addTouchEventListener(this.jixuClicked,this);

        }
        else{
            if(WAIHUZI_KEHU_UI_FLG==1)
            {
                jiesuan.visible=true;
                jiesuan.addTouchEventListener(this.returnBClicked,this);

            }
            else{
                share.visible=true;
                jiesuan.visible=true;
                jiesuan.addTouchEventListener(this.returnBClicked,this);
            }

        }


        var shibai= ccui.helper.seekWidgetByName(node, "shibai");
        var shengli= ccui.helper.seekWidgetByName(node, "shengli");
        var pingju= ccui.helper.seekWidgetByName(node, "pingju");

        //我的得分
        var Image_47= ccui.helper.seekWidgetByName(node, "Image_47");
        var score= ccui.helper.seekWidgetByName(node, "score");

        shibai.visible=false;
        shengli.visible=false;
        pingju.visible=false;



        if(RULE_VALUE==ROOM_TYPE_BOPI||RULE_VALUE==ROOM_TYPE_GAOHUZI||RULE_VALUE==ROOM_TYPE_LOUDI||RULE_VALUE==ROOM_TYPE_SHUANGFENG||RULE_VALUE==ROOM_TYPE_WAIHUZI)
        {
            Image_47.visible=false;
            score.visible=false;
        }
        else{
            if(!hasHuPai)
            {
                //黄庄
                pingju.visible=true;
                score.setString("+0");
            }
            else{
                if(myPlayerInfo.uid==showUserInfo.uid)
                {

                    shengli.visible=true;
                    score.setString("+"+showUserInfo.dunshu);
                }
                else{
                    shibai.visible=true;

                    var count=userInfos.length;
                    for(var i=0;i<count;i++) {
                        var userInfo = userInfos[i];
                        if(userInfo.uid==myPlayerInfo.uid)
                        {
                            score.setString(""+userInfo.dunshu);
                            break;
                        }


                    }

                }


            }
        }





        var p2= ccui.helper.seekWidgetByName(node, "info");
        p2.visible=false;
        var infoW=p2.getContentSize().width;
        var count=userInfos.length;
        var index=0;
        for(var i=0;i<count;i++)
        {
            var userInfo=userInfos[i];


            var panel=p2.clone();
            panel.visible=true;
            panel.x=p2.x+index*infoW;
            panel.y=p2.y;
            p2.getParent().addChild(panel);
            index++;


            var roomUser=room.getRoomUserByUID(userInfo.uid);
            var head= ccui.helper.seekWidgetByName(panel, "headBg");
            var uid=roomUser.user.uid;
            var headName=uid+"_head.png";
            var headIconPath=getSkinPath(headName);
            head.setLocalZOrder(2);
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

            var hulab= ccui.helper.seekWidgetByName(panel, "hulab");
            if(RULE_VALUE==ROOM_TYPE_LOUDI||RULE_VALUE==ROOM_TYPE_SHUANGFENG||RULE_VALUE==ROOM_TYPE_BOPI||RULE_VALUE==ROOM_TYPE_GAOHUZI)
            {

                if(userInfo.isHuPai==1)
                {
                    hulab.visible=true;
                }
                else{
                    hulab.visible=false;
                }


            }
            else{
                hulab.visible=false;
            }


            // var id= ccui.helper.seekWidgetByName(panel, "Text_18");
            // id.setString("ID:"+roomUser.user.uid);

            if(RULE_VALUE==ROOM_TYPE_HONGHU_147)
            {
                var zonghuxi= ccui.helper.seekWidgetByName(panel, "jifen");
                zonghuxi.setString("积分:"+userInfo.zonghuxi);

                // var huxi= ccui.helper.seekWidgetByName(panel, "huxi");
                // huxi.setString("墩数:"+userInfo.dunshu);
            }
            else if(RULE_VALUE==ROOM_TYPE_BINZHOU||RULE_VALUE==ROOM_TYPE_BINZHOU_YONGXING||RULE_VALUE==ROOM_TYPE_LEIYANG||RULE_VALUE==ROOM_TYPE_HENGYANG
            ||RULE_VALUE==ROOM_TYPE_GUILIN||RULE_VALUE==ROOM_TYPE_HONGHEIHU||RULE_VALUE==ROOM_TYPE_DAZIPAI
            ||RULE_VALUE==ROOM_TYPE_PENGHUZI
            )
            {
                var zonghuxi= ccui.helper.seekWidgetByName(panel, "jifen");
                zonghuxi.setString("积分:"+userInfo.zonghuxi);
            }
            else if(RULE_VALUE==ROOM_TYPE_WAIHUZI){

                var zonghuxi= ccui.helper.seekWidgetByName(panel, "jifen");
                zonghuxi.setString("总积分:"+userInfo.zonghuxi);

                // var huxi= ccui.helper.seekWidgetByName(panel, "huxi");
                // huxi.setString("胡息:"+userInfo.huxi);
            }
            else if(RULE_VALUE==ROOM_TYPE_BOPI||RULE_VALUE==ROOM_TYPE_GAOHUZI||RULE_VALUE==ROOM_TYPE_LOUDI||RULE_VALUE==ROOM_TYPE_SHUANGFENG){

                var zonghuxi= ccui.helper.seekWidgetByName(panel, "jifen");
                zonghuxi.setString("总胡息:"+userInfo.zonghuxi);

                // var huxi= ccui.helper.seekWidgetByName(panel, "huxi");
                // huxi.setString("胡息:"+userInfo.huxi);
            }


            var shu_icon= ccui.helper.seekWidgetByName(panel, "shu_icon");
            var ying_icon= ccui.helper.seekWidgetByName(panel, "ying_icon");
            var fen= ccui.helper.seekWidgetByName(panel, "fen");
            shu_icon.visible=false;
            ying_icon.visible=false;
            fen.visible=false;

            if(RULE_VALUE==ROOM_TYPE_LOUDI||RULE_VALUE==ROOM_TYPE_SHUANGFENG||RULE_VALUE==ROOM_TYPE_BOPI)
            {
                fen.visible=true;

                if(userInfo.huxi>=0)
                {
                    if(userInfo.isHuPai==1)
                    {

                    }
                    else{
                        ying_icon.visible=true;
                    }

                    fen.setString("+"+userInfo.huxi);
                }
                else{
                    shu_icon.visible=true;
                    fen.setString(""+userInfo.huxi);
                }
            }
            else if(RULE_VALUE==ROOM_TYPE_GAOHUZI)
            {

                var jifen= ccui.helper.seekWidgetByName(panel, "jifen");
                var a=jifen.clone();
                if(showUserInfo.dunshu2>1&&showUserInfo==userInfo)
                {
                    a.setString("积分:"+3*userInfo.dunshu2);
                }
                else{

                    a.setString("积分:"+userInfo.dunshu*showUserInfo.dunshu2);
                }

                a.y=shu_icon.y;
                jifen.getParent().addChild(a);
            }
            else if(RULE_VALUE==ROOM_TYPE_PENGHUZI)
            {
                fen.visible=true;

                if(userInfo.huxi>=0)
                {
                    ying_icon.visible=true;
                    fen.setString("+"+userInfo.huxi);
                }
                else{
                    shu_icon.visible=true;
                    fen.setString(""+userInfo.huxi);
                }
            }
            else if(RULE_VALUE!=ROOM_TYPE_BOPI&&RULE_VALUE!=ROOM_TYPE_GAOHUZI&&RULE_VALUE!=ROOM_TYPE_LOUDI&&RULE_VALUE!=ROOM_TYPE_SHUANGFENG)
            {
                fen.visible=true;

                if(userInfo.dunshu>=0)
                {
                    ying_icon.visible=true;
                    fen.setString("+"+userInfo.dunshu);
                }
                else{
                    shu_icon.visible=true;
                    fen.setString(""+userInfo.dunshu);
                }



            }


            var xian= ccui.helper.seekWidgetByName(panel, "xian");
            var zhuang= ccui.helper.seekWidgetByName(panel, "zhuang");
            zhuang.visible=false;
            xian.visible=false;

            if(userInfo.roleType==1)//庄家
            {
                zhuang.visible=true;
                zhuang.setLocalZOrder(2);
            }
            else if(userInfo.roleType==2)
            {
                xian.visible=true;
                xian.setLocalZOrder(2);
            }


            var fangzhu1= ccui.helper.seekWidgetByName(panel, "fangzhu");
            fangzhu1.visible=false;

            if(userInfo.uid==room.roomInfo.uid)
            {
                fangzhu1.visible=true;
                fangzhu1.setLocalZOrder(2);
            }

            var dianpao= ccui.helper.seekWidgetByName(panel, "dianpao");
            dianpao.visible=false;

            if(userInfo.isFangPao==1)
            {
                dianpao.visible=true;
                dianpao.setLocalZOrder(2);
            }



            var chakan= ccui.helper.seekWidgetByName(panel, "chakan");
            chakan.visible=false;

            if(showUserInfo!=userInfo)
            {
                userInfo.zongFen=userInfo.zonghuxi;

                if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                {
                    userInfo.benci=userInfo.dunshu;
                }
                else if(RULE_VALUE==ROOM_TYPE_PENGHUZI)
                {
                    userInfo.benci=userInfo.huxi;
                }
                else if(RULE_VALUE!=ROOM_TYPE_BOPI&&RULE_VALUE!=ROOM_TYPE_GAOHUZI&&RULE_VALUE!=ROOM_TYPE_LOUDI&&RULE_VALUE!=ROOM_TYPE_SHUANGFENG)
                {
                    userInfo.benci=userInfo.dunshu;
                }
                else{
                    userInfo.benci=0;
                }

                chakan.visible=true;
                chakan.userInfo=userInfo;
                chakan.roomUser=roomUser;
                chakan.addTouchEventListener(this.chakanClicked,this);

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

                if(WAIHUZI_KEHU_UI_FLG==1)
                {
                    this.room.hideFinishedLayer();
                    this.room.hideSlectedButton(myPlayerInfo.uid);
                    this.room.clearAllCard();

                    this.room.zhunbeiClicked(null,ccui.Widget.TOUCH_ENDED);
                }
                else{
                    captureScreen();
                }

            }
                break;



            default:
                break;
        }

    },
    chakanClicked:function (sender, type) {

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

                var layer=new ChaKanLayer(sender.userInfo,sender.roomUser,this);
                this.addChild(layer,10);

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
    jixuClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {

                if(WAIHUZI_KEHU_UI_FLG==1)
                {
                    this.room.hideFinishedLayer();
                    this.room.hideSlectedButton(myPlayerInfo.uid);

                }
                else{
                    this.room.hideFinishedLayer();
                    this.room.hideSlectedButton(myPlayerInfo.uid);
                }

                //
                
                // var req=new ReadyRequest();
                // req.uid=myPlayerInfo.uid;
                // req.roomId=this.room.roomInfo.roomId;
                // socketMgr.socket.send(READY_REQUEST,req);

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
    capatureFinished:function (obj,target) {


        target.shareTip=new TouchLayer();
        target.addChild(target.shareTip,1000);

        var node = parseUI("res/ui/sub/ShareTipLayer.json", CENTER);
        target.shareTip.addChild(node);

        var b1= ccui.helper.seekWidgetByName(node, "quan");
        b1.addTouchEventListener(target.shareClicked2,target);
        b1.type=1;
        b1.path=obj.path;

        var b2= ccui.helper.seekWidgetByName(node, "you");
        b2.addTouchEventListener(target.shareClicked2,target);
        b2.type=2;
        b2.path=obj.path;

        var close= ccui.helper.seekWidgetByName(node, "close");
        close.addTouchEventListener(target.shareClicked2,target);
        close.type=3;
        close.path=obj.path;
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

    },
    isHuArr:function(arr)
    {
        var len=arr.length;
        for(var i=0;i<len;i++)
        {
            var c=arr[i];
            if(c.flg2==1)
            {
                return true;

            }


        }
        return false;


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