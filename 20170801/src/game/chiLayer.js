/**
 * Created by yungu on 16/11/10.
 */

var ChiLayer=cc.Layer.extend({


    ctor: function (sceneId,roomInfo,roomUser,action,cd,room) {
        this._super();


        this.roomInfo=roomInfo;
        this.roomUser=roomUser;
       // this.cd=cd.card;
        this.room=room;

        if(action.type==ACTION_KE_TI||action.type==ACTION_KE_TI2)
        {
            this.sendReqType=4;
        }
        else if(action.type==ACTION_KE_PAO||action.type==ACTION_KE_PAO2)
        {
            this.sendReqType=5;
        }
        else{
            this.sendReqType=1;//0:碰,1:吃,2:胡,3:爆牌 4:提,5:跑
        }
        var chiNode = parseUI("res/ui/"+my_room_name+"/chiLayer.json", LEFT_BOTTOM);
        chiNode.x=0;
        chiNode.y=0;
        this.addChild(chiNode);
        

        var bg = ccui.helper.seekWidgetByName(chiNode, "bg");
        var bi = ccui.helper.seekWidgetByName(chiNode, "bi");
        var chi = ccui.helper.seekWidgetByName(chiNode, "chi");
        bi.visible=false;

        var groupCards=action.groupCards;

        this.a="a_";
        this.b="b_";

        // var a=groupCards[0];
        // groupCards=[];
        //  groupCards.push(a);
        // // groupCards.push(groupCards[1]);
        // // groupCards.push(groupCards[2]);
        // // groupCards.push(groupCards[3]);

        var len=groupCards.length;

        this.ww=110;
        this.hh=30;

        var gap_w=this.ww;
        var gap_h=this.hh;
        var init_x=10-(len-1)/2*gap_w;
        var bx=init_x;

        var maxW=gap_w*len+10;
        if(maxW<100)maxW=100;

        bg.setContentSize(cc.size(maxW,150));

        this.chiW=maxW;

        this.button2Array=[];
        this.button3Array=[];

       // cc.log("groupCount:"+len);
        for(var i=0;i<len;i++) {
            var groudCard = groupCards[i];
            var cards = groudCard.cards;
            var count = cards.length;
            var zOrder = count;
            var init_y=-10;

            if(count==4)
            {
                init_y=-25;
            }

           // cc.log("count:"+count);
            for (var j = 0; j < count; j++) {
                var card = cards[j];
                var pngName="";
                if(card.type==0)//大写
                {
                    pngName="res/ui/"+cardPath+"/"+this.a+card.value+".png";
                }
                else{
                    pngName="res/ui/"+cardPath+"/"+this.b+card.value+".png";

                }

                var button = new ccui.Button();
                button.setTouchEnabled(true);
                button.setPressedActionEnabled(true);
                button.loadTextures(pngName,pngName,pngName);
                button.x = bx;
                button.y = init_y+j*gap_h;
                //button.setScale(0.4);
                button.addTouchEventListener(this.buttonClicked,this);
                this.addChild(button,zOrder-j);

                button.childs=groudCard.childCards;
                button.cards=cards;

                if(groudCard.sendReqType!=undefined)
                {
                    button.sendReqType=groudCard.sendReqType;
                }

                // if(this.cd!=null&&this.cd.type==card.type&&this.cd.value==card.value)
                // {
                //     button.setColor(cc.color(144,238,144));
                //     cc.log("################22");
                // }
                // else{
                //     cc.log("################");
                // }

                cc.log("j:"+j+",x:"+init_x);
            }
            bx=init_x+(i+1)*gap_w;

        }


    },
    buttonClicked:function (sender, type) {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {

                cc.log("[clicked]");


                var childs=sender.childs;

                this.cards1=sender.cards;

                var len=childs.length;
                if(len<=0)
                {


                    var req=new OperateCardRequest();
                    req.uid=myPlayerInfo.uid;
                    req.roomId=this.roomInfo.roomId;
                    if(sender.sendReqType!=undefined)
                    {
                        req.type=sender.sendReqType;//0:碰,1:吃,2:胡
                    }
                    else{
                        req.type=this.sendReqType;//0:碰,1:吃,2:胡
                    }

                    var count = this.cards1.length;
                    for (var j = 0; j < count; j++) {
                        var card = this.cards1[j];
                        req.cardIds.push(card.c_id);
                    }
                    req.flowsId=this.room.currentFlowsId;
                    socketMgr.socket2.send(OPERATE_CARD_REQUEST,req);
                    var obj={};
                    EventManager.getInstance().fireEvent("CHI_FINISHED_EVENT",obj);
                   // cc.log("选择结束");
                    return;
                }


                var button2Len=this.button2Array.length;
                for(var k=0;k<button2Len;k++)
                {
                    var bp=this.button2Array[k];
                    bp.removeFromParent(true);

                }
                this.button2Array=[];

                if(this.chiNode2!=undefined&&this.chiNode2!=null)
                {
                    this.chiNode2.removeFromParent(true);
                    this.chiNode2=null;
                }


                var button3Len=this.button3Array.length;
                for(var k=0;k<button3Len;k++)
                {
                    var bp=this.button3Array[k];
                    bp.removeFromParent(true);

                }
                this.button3Array=[];

                if(this.chiNode3!=undefined&&this.chiNode3!=null)
                {
                    this.chiNode3.removeFromParent(true);
                    this.chiNode3=null;
                }



                this.chiNode2 = parseUI("res/ui/"+my_room_name+"/chiLayer.json", LEFT_BOTTOM);
                this.addChild(this.chiNode2);
                var bg = ccui.helper.seekWidgetByName(this.chiNode2, "bg");
                var bi = ccui.helper.seekWidgetByName(this.chiNode2, "bi");
                var chi = ccui.helper.seekWidgetByName(this.chiNode2, "chi");
                chi.visible=false;






                var gap_w=this.ww;
                var gap_h=this.hh;


                var maxW=gap_w*len+10;
                if(maxW<100)maxW=100;

                this.chiNode2.x=-this.chiW/2-maxW/2-5;
                var init_x=10-(len-1)/2*gap_w+this.chiNode2.x;
                var bx=init_x;

                bg.setContentSize(cc.size(maxW,150));

                this.biW1=init_x;

                 cc.log("childs1:"+len);
                for(var i=0;i<len;i++) {
                    var groudCard = childs[i];
                    var cards = groudCard.cards;
                    var count = cards.length;
                    var zOrder = count;
                    var init_y=-10;

                    for (var j = 0; j < count; j++) {
                        var card = cards[j];
                        var pngName="";
                        if(card.type==0)//大写
                        {
                            pngName="res/ui/"+cardPath+"/"+this.a+card.value+".png";
                        }
                        else{
                            pngName="res/ui/"+cardPath+"/"+this.b+card.value+".png";

                        }

                        var button = new ccui.Button();
                        button.setTouchEnabled(true);
                        button.setPressedActionEnabled(true);
                        button.loadTextures(pngName,pngName,pngName);
                        button.x = bx;
                        button.y = init_y+j*gap_h;
                        //button.setScale(0.4);
                        button.addTouchEventListener(this.childs1Clicked,this);
                        this.addChild(button,zOrder-j);

                        button.childs=groudCard.childCards;
                        button.cards=cards;

                        this.button2Array.push(button);

                        // if(this.cd!=null&&this.cd.type==card.type&&this.cd.value==card.value)
                        // {
                        //     button.setColor(cc.color(144,238,144));
                        // }


                        cc.log("j:"+j+",x:"+init_x);
                    }
                    bx=init_x+(i+1)*gap_w;

                }
            }
                break;


            default:
                break;
        }

    },

    childs1Clicked:function (sender, type) {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {

                cc.log("[clicked]");

                var childs=sender.childs;

                this.cards2=sender.cards;

                var len=childs.length;
                if(len<=0)
                {


                    var req=new OperateCardRequest();
                    req.uid=myPlayerInfo.uid;
                    req.roomId=this.roomInfo.roomId;
                    req.type=this.sendReqType;//0:碰,1:吃,2:胡
                    var count = this.cards1.length;
                    for (var j = 0; j < count; j++) {
                        var card = this.cards1[j];
                        req.cardIds.push(card.c_id);
                    }
                    count = this.cards2.length;
                    for (var j = 0; j < count; j++) {
                        var card = this.cards2[j];
                        req.cardIds.push(card.c_id);
                    }
                    req.flowsId=this.room.currentFlowsId;
                    socketMgr.socket2.send(OPERATE_CARD_REQUEST,req);
                    var obj={};
                    EventManager.getInstance().fireEvent("CHI_FINISHED_EVENT",obj);
                    // cc.log("选择结束");
                    return;
                }

                var button3Len=this.button3Array.length;
                for(var k=0;k<button3Len;k++)
                {
                    var bp=this.button3Array[k];
                    bp.removeFromParent(true);

                }
                this.button3Array=[];

                if(this.chiNode3!=undefined&&this.chiNode3!=null)
                {
                    this.chiNode3.removeFromParent(true);
                    this.chiNode3=null;
                }
                this.chiNode3 = parseUI("res/ui/"+my_room_name+"/chiLayer.json", LEFT_BOTTOM);
                this.addChild(this.chiNode3);
                var bg = ccui.helper.seekWidgetByName(this.chiNode3, "bg");
                var bi = ccui.helper.seekWidgetByName(this.chiNode3, "bi");
                var chi = ccui.helper.seekWidgetByName(this.chiNode3, "chi");
                chi.visible=false;



                var gap_w=this.ww;
                var gap_h=this.hh;

                var maxW=gap_w*len+10;
                if(maxW<100)maxW=100;

                var subH=200;

                this.chiNode3.x=this.chiNode2.x;//this.biW1-maxW/2-45;
                this.chiNode3.y-=subH;
                var init_x=10-(len-1)/2*gap_w+this.chiNode3.x;
                var bx=init_x;


                bg.setContentSize(cc.size(maxW,150));
                cc.log("childs2:"+len);
                for(var i=0;i<len;i++) {
                    var groudCard = childs[i];
                    var cards = groudCard.cards;
                    var count = cards.length;
                    var zOrder = count;
                    var init_y=-10-subH;

                    for (var j = 0; j < count; j++) {
                        var card = cards[j];
                        var pngName="";
                        if(card.type==0)//大写
                        {
                            pngName="res/ui/"+cardPath+"/"+this.a+card.value+".png";
                        }
                        else{
                            pngName="res/ui/"+cardPath+"/"+this.b+card.value+".png";

                        }

                        var button = new ccui.Button();
                        button.setTouchEnabled(true);
                        button.setPressedActionEnabled(true);
                        button.loadTextures(pngName,pngName,pngName);
                        button.x = bx;
                        button.y = init_y+j*gap_h;
                       // button.setScale(0.4);
                        button.addTouchEventListener(this.childs2Clicked,this);
                        this.addChild(button,zOrder-j);

                        button.childs=groudCard.childCards;
                        button.cards=cards;

                        this.button3Array.push(button);

                        // if(this.cd!=null&&this.cd.type==card.type&&this.cd.value==card.value)
                        // {
                        //     button.setColor(cc.color(144,238,144));
                        // }

                        
                        cc.log("j:"+j+",x:"+init_x);
                    }
                    bx=init_x+(i+1)*gap_w;

                }
            }
                break;


            default:
                break;
        }

    },


    childs2Clicked:function (sender, type) {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {



                var childs=sender.childs;


                this.cards3=sender.cards;

                var len=childs.length;
                if(len<=0)
                {


                    var req=new OperateCardRequest();
                    req.uid=myPlayerInfo.uid;
                    req.roomId=this.roomInfo.roomId;
                    req.type=this.sendReqType;//0:碰,1:吃,2:胡
                    var count = this.cards1.length;
                    for (var j = 0; j < count; j++) {
                        var card = this.cards1[j];
                        req.cardIds.push(card.c_id);
                    }
                    count = this.cards2.length;
                    for (var j = 0; j < count; j++) {
                        var card = this.cards2[j];
                        req.cardIds.push(card.c_id);
                    }
                    count = this.cards3.length;
                    for (var j = 0; j < count; j++) {
                        var card = this.cards3[j];
                        req.cardIds.push(card.c_id);
                    }
                    req.flowsId=this.room.currentFlowsId;
                    socketMgr.socket2.send(OPERATE_CARD_REQUEST,req);
                    var obj={};
                    EventManager.getInstance().fireEvent("CHI_FINISHED_EVENT",obj);
                    // cc.log("选择结束");
                    return;
                }


                cc.log("childs2Clicked:"+childs.length);

            }
                break;


            default:
                break;
        }

    },

});
