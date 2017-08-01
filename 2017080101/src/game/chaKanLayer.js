/**
 * Created by yungu on 17/1/21.
 */

var ChaKanLayer=cc.Layer.extend({


    ctor: function (userInfo,roomUser,finishParentLayer) {
        this._super();


        var winSize=cc.winSize;
        var bgColor=cc.LayerColor.create(cc.color(0, 0, 0, 200));
        this.addChild(bgColor);
        bgColor.ignoreAnchor = false;
        bgColor.anchorX = 0;
        bgColor.anchorY = 0;
        bgColor.setContentSize(winSize.width, winSize.height);


        var touchLayer=new TouchLayer();
        this.addChild(touchLayer);

        var node = parseUI("res/ui/finish_fucheng/chakanLayer.json", CENTER);
        touchLayer.addChild(node);

        var head= ccui.helper.seekWidgetByName(node, "head");
        var headName=roomUser.user.uid+"_head.png";
        var headIconPath=getSkinPath(headName);
        head.setLocalZOrder(2);
        if(checkFileExit(headIconPath))
        {
            var headSprite=new cc.Sprite(headIconPath);
            headSprite.x=head.x;
            headSprite.y=head.y;
            changeHead(headSprite,2);
            head.getParent().addChild(headSprite,1);
        }

        var name= ccui.helper.seekWidgetByName(node, "name");
        name.setString(roomUser.user.name);

        var id= ccui.helper.seekWidgetByName(node, "id");
        id.setString("ID:"+roomUser.user.uid);

        var score1= ccui.helper.seekWidgetByName(node, "score1");


        var score2= ccui.helper.seekWidgetByName(node, "score2");
        score2.setString("");

        if(RULE_VALUE!=ROOM_TYPE_BOPI&&RULE_VALUE!=ROOM_TYPE_GAOHUZI)
        {
            score1.setString("本局分数:"+userInfo.benci);
            score2.setString("累计分数:"+userInfo.zongFen);
        }
        else{
            score1.setString("本局胡息:"+userInfo.benci);
            score2.setString("累计胡息:"+userInfo.zongFen);
        }

        var close= ccui.helper.seekWidgetByName(node, "close");
        close.addTouchEventListener(this.closeClicked,this);

        var p1= ccui.helper.seekWidgetByName(node, "p1");
        p1.visible=false;

        var groupCards=[];
        var group=userInfo.cards2;
        var gCount=group.length;
        for(var k=0;k<gCount;k++)
        {
            var g=group[k];
            groupCards.push(g.cards);
        }

        var gap_w=40;
        var init_gap_x=0;
        var gCount=groupCards.length;

        for(var k=0;k<gCount;k++)
        {
            var arr=groupCards[k];
            if(arr.length<=0)
            {
                continue;
            }

            cc.log("count#::::::::"+k);

            var panel=p1.clone();
            panel.x=p1.x+k*gap_w+init_gap_x;
            panel.y=p1.y;
            panel.visible=true;
            p1.getParent().addChild(panel);


            var a1= ccui.helper.seekWidgetByName(panel, "a1");
            a1.visible=false;
            var a6= ccui.helper.seekWidgetByName(panel, "a6");


            var a=finishParentLayer.isTiOrPao(arr);
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
                a=finishParentLayer.isPengOrWeiorKan(arr);
                if(a==1)
                {
                    //偎

                    if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                    {
                        worldPng="res/ui/finish_fucheng/wai_finish.png";
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

                    a=finishParentLayer.isOneTwoThreeOrTwoSevenTen(arr);
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
                    }
                    else if(a==2)
                    {
                        //2/7/10
                        worldPng="res/ui/finish_fucheng/bian_finish.png";
                    }
                    else{
                        var b=finishParentLayer.checkIsShunOrBian(arr);
                        if(b==1)
                        {
                            worldPng="res/ui/finish_fucheng/shun_finish.png";
                        }
                        else if(b==2)
                        {
                            worldPng="res/ui/finish_fucheng/bian_finish.png";
                        }
                        else{

                            if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
                            {
                                if(arr.length==2)
                                {
                                    var aa1=arr[0];
                                    var aa2=arr[1];
                                    if(aa1.type==aa2.type&&aa1.value==aa2.value)
                                    {
                                        //if(hasHuPai)
                                        //{
                                        //    var hucard=null;
                                        //    if(aa1.flg2==1)
                                        //    {
                                        //        hucard=aa1;
                                        //    }
                                        //    else if(aa2.flg2==1)
                                        //    {
                                        //        hucard=aa2;
                                        //    }
                                        //
                                        //    if(hucard!=null&&hucard.flg3==1&&hucard.uid==showUserInfo.uid)
                                        //    {
                                        //        worldPng="res/ui/finish_fucheng/danwai_finish.png";
                                        //        score=4;
                                        //    }
                                        //    else if(hucard!=null&&hucard.flg3==1&&hucard.uid!=showUserInfo.uid)
                                        //    {
                                        //        worldPng="res/ui/finish_fucheng/danpeng_finish.png";
                                        //        score=1;
                                        //    }
                                        //    else{
                                        //        score=1;
                                        //    }
                                        //
                                        //
                                        //}

                                    }



                                }

                            }




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
                cardSprite.setScl(0.7);
                cardSprite.setLocalZOrder(aCount-kk+1);
                panel.addChild(cardSprite)

                //cc.log("card.flg2:::"+card.flg2);
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



    },
    buyClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {

                if(this.touchLayer2==undefined||this.touchLayer2===null)
                {
                    this.touchLayer2=new TouchLayer();
                    this.addChild(this.touchLayer2,1);

                    var node = parseUI("res/ui/sub/tishi.json", CENTER);
                    this.touchLayer2.addChild(node);

                    var b1= ccui.helper.seekWidgetByName(node, "b1");
                    b1.addTouchEventListener(this.closeClicked2,this);

                    var b2= ccui.helper.seekWidgetByName(node, "b2");
                    b2.addTouchEventListener(this.closeClicked2,this);

                    var t= ccui.helper.seekWidgetByName(node, "t");
                    t.setString("在线充值功能暂未开放,充值请联系客服微信:xxqp2017");

                    playEffect(TOUCH_SOUND);
                }




            }
                break;


            default:
                break;
        }


    },

    closeClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                this.removeFromParent(true);
            }
                break;


            default:
                break;
        }


    },

});
