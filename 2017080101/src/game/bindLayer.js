/**
 * Created by yungu on 17/1/17.
 */
var BindLayer=cc.Layer.extend({


    ctor: function (sceneId) {
        this._super();

        var touchLayer=new TouchLayer();
        this.addChild(touchLayer);

        var node = parseUI("res/ui/bind/bindLayer.json", CENTER);
        touchLayer.addChild(node);


        this.b1= ccui.helper.seekWidgetByName(node, "b1");
        this.b2= ccui.helper.seekWidgetByName(node, "b2");

        this.b1.addTouchEventListener(this.bClicked,this);
        this.b2.addTouchEventListener(this.bClicked,this);

        this.t= ccui.helper.seekWidgetByName(node, "t");
        this.cardCount=0;

        this.p1= ccui.helper.seekWidgetByName(node, "p1");
        this.p2= ccui.helper.seekWidgetByName(node, "p2");

        var pp1= ccui.helper.seekWidgetByName(this.p1, "pp1");
        var pp2= ccui.helper.seekWidgetByName(this.p1, "pp2");
        pp1.visible=false;
        pp2.visible=false;

        this.textField= ccui.helper.seekWidgetByName(pp1, "input");
        this.textField.addEventListener(this.textFieldEvent, this);

        var bindButton= ccui.helper.seekWidgetByName(pp1, "bind");
        bindButton.addTouchEventListener(this.bindClicked,this);


        var pp1_2= ccui.helper.seekWidgetByName(this.p2, "pp1");
        var pp2_2= ccui.helper.seekWidgetByName(this.p2, "pp2");
        pp1_2.visible=false;
        pp1_2.visible=false;


        this.haoyou= ccui.helper.seekWidgetByName(this.p2, "haoyou");
        this.quan= ccui.helper.seekWidgetByName(this.p2, "quan");
        this.haoyou.addTouchEventListener(this.shareClicked,this);
        this.quan.addTouchEventListener(this.shareClicked,this);


        var close= ccui.helper.seekWidgetByName(node, "close");
        close.addTouchEventListener(this.closeClicked,this);

        Service.getInstance().regist(BIND_USER_RESPONSE,this,this.onReceive);
        Service.getInstance().regist(BIND_MY_RESPONSE,this,this.onReceive);

        EventManager.getInstance().regist("DOWN_LOAD_FINISHED_EVENT",this,this.downLoadFinished);


        var req=new BindUserRequest();
        req.uid=myPlayerInfo.uid;
        req.bindUid="";
        socketMgr.socket.send(BIND_USER_REQUEST,req);

        var req=new BindMyRequest();
        req.uid=myPlayerInfo.uid;
        socketMgr.socket.send(BIND_MY_REQUEST,req);


        this.heads1={};
        this.heads2={};

        this.changeTab(1);

    },
    updateCardCount:function () {

        this.t.setString("累计获赠钻石:"+this.cardCount);

    },
    textFieldEvent: function (textField, type) {
        switch (type) {
            case ccui.TextField.EVENT_ATTACH_WITH_IME:
               // var winSize=cc.director.getWinSize();
                this.runAction(cc.moveTo(0.225,cc.p(0,  200)));

                break;
            case ccui.TextField.EVENT_DETACH_WITH_IME:
                //var winSize=cc.director.getWinSize();
                this.runAction(cc.moveTo(0.175, cc.p(0, 0)));

                break;
            case ccui.TextField.EVENT_INSERT_TEXT:

                break;
            case ccui.TextField.EVENT_DELETE_BACKWARD:

                break;
            default:
                break;
        }
    },
    changeTab:function (index) {

        if(index==1)
        {
            this.b1.setEnabled(false);
            this.b1.setTouchEnabled(false);

            this.b2.setEnabled(true);
            this.b2.setTouchEnabled(true);

            this.p1.visible=true;
            this.p2.visible=false;


            this.haoyou.setEnabled(false);
            this.haoyou.setTouchEnabled(false);

            this.quan.setEnabled(false);
            this.quan.setTouchEnabled(false);
        }
        else if(index==2){

            this.b1.setEnabled(true);
            this.b1.setTouchEnabled(true);

            this.b2.setEnabled(false);
            this.b2.setTouchEnabled(false);

            this.p1.visible=false;
            this.p2.visible=true;



            this.haoyou.setEnabled(true);
            this.haoyou.setTouchEnabled(true);

            this.quan.setEnabled(true);
            this.quan.setTouchEnabled(true);

        }

    },
    updateP1:function (bindObj) {

        var pp1= ccui.helper.seekWidgetByName(this.p1, "pp1");
        var pp2= ccui.helper.seekWidgetByName(this.p1, "pp2");

        if(bindObj==null)
        {

            pp1.visible=true;
            pp2.visible=false;

        }
        else{
            pp1.visible=false;
            pp2.visible=true;

            var head=ccui.helper.seekWidgetByName(pp2, "head");
            head.setLocalZOrder(2);

            var uid=bindObj.bindUid;
            var headName=uid+"_head.png";
            var headIconPath=getSkinPath(headName);
            if(checkFileExit(headIconPath))
            {
                var headSprite=new cc.Sprite(headIconPath);
                headSprite.x=head.x;
                headSprite.y=head.y;
                changeHead(headSprite,3);
                head.getParent().addChild(headSprite,1);
            }
            else{
                pushDownLoadQueue(headName,2,bindObj.bindHeadUrl);
                this.heads1[uid]=head;
            }


            var name=ccui.helper.seekWidgetByName(pp2, "name");
            name.setString(bindObj.bindName);

            var id=ccui.helper.seekWidgetByName(pp2, "id");
            id.setString("ID:"+bindObj.bindUid);

//            this.cardCount+=share_card_num;
            this.updateCardCount();
        }

    },
    updateP2:function (users) {

        var pp1= ccui.helper.seekWidgetByName(this.p2, "pp1");
        var pp2= ccui.helper.seekWidgetByName(this.p2, "pp2");


        if(users.length<=0)
        {

            pp1.visible=false;
            pp2.visible=true;
        }
        else{

            pp1.visible=true;
            pp2.visible=false;

            this.scrollView=ccui.helper.seekWidgetByName(pp1, "scorll");
            this.scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
            this.scrollView.setTouchEnabled(true);
            this.pModel=ccui.helper.seekWidgetByName(this.scrollView, "p3");
            this.pModel.visible=false;
            this.scrollView.setScrollBarEnabled(false);

            var allCount=users.length;


            this.cardCount+=allCount*share_card_num;
            this.updateCardCount();
            
            var lineCount=parseInt(allCount/4);
            if(parseInt(allCount)%4!=0)
            {
                lineCount+=1;
            }


            var gap_h=this.pModel.getContentSize().height;
            var len=lineCount
            var ccc=this.scrollView.getInnerContainerSize();
            var ww=ccc.width;
            var hh=gap_h*len;
            var hTmp=hh-ccc.height;
            if(hTmp<0)hTmp=0;

            userCount=0;
            //cc.log("数目:"+len);
            for(var i=0;i<len;i++)
            {

                var panel=this.pModel.clone();

                var a1=ccui.helper.seekWidgetByName(panel, "a1");
                var a2=ccui.helper.seekWidgetByName(panel, "a2");
                var a3=ccui.helper.seekWidgetByName(panel, "a3");
                var a4=ccui.helper.seekWidgetByName(panel, "a4");

                a1.visible=false;
                a2.visible=false;
                a3.visible=false;
                a4.visible=false;

                for(var j=0;j<4&&userCount<allCount;j++,userCount++)
                {

                    var user=users[userCount];
                    var a=null;
                    if(j==0)
                    {
                        a=a1;
                    }
                    else if(j==1)
                    {
                        a=a2;
                    }
                    else if(j==2)
                    {
                        a=a3;
                    }
                    else if(j==3)
                    {
                        a=a4;
                    }

                    a.visible=true;

                    var head=ccui.helper.seekWidgetByName(a, "head");
                    head.setLocalZOrder(2);

                    var uid=user.uid;
                    var headName=uid+"_head.png";
                    var headIconPath=getSkinPath(headName);
                    if(checkFileExit(headIconPath))
                    {
                        var headSprite=new cc.Sprite(headIconPath);
                        headSprite.x=head.x;
                        headSprite.y=head.y;
                        changeHead(headSprite,3);
                        head.getParent().addChild(headSprite,1);
                    }
                    else{
                        pushDownLoadQueue(headName,2,user.headUrl);
                        this.heads2[user.uid]=head;
                    }


                    var name=ccui.helper.seekWidgetByName(a, "name");
                    name.setString(user.name);


                    var id=ccui.helper.seekWidgetByName(a,"id");
                    id.setString(""+user.uid);

                    //cc.log("user.uid:::"+user.uid+",id:"+id);

                }



                this.scrollView.addChild(panel);

                panel.x=this.pModel.x;
                panel.y=this.pModel.y-i*gap_h+hTmp;
                panel.visible=true;

            }


            //cc.log("cc:"+ccc.height+",hh:"+hh+","+gap_h*len);
            this.scrollView.setInnerContainerSize(cc.size(ww, hh));


        }



    },
    onReceive:function(msgNumber,body,target)
    {

        switch(msgNumber)
        {

            case BIND_USER_RESPONSE:
            {
                cc.log("绑定应答:"+body.state);
                //0:未绑定,1:已经绑定用户,-1：失败
                if(body.state==0)
                {
                    target.updateP1(null);
                }
                else if(body.state==1)
                {
                    target.updateP1(body.user);
                }
                else{
                    var obj={};
                    obj.txt=body.txt;
                    EventManager.getInstance().fireEvent("TIP_INFO_EVENT",obj);
                }

                if(target.loadLayer!=null)
                {
                    target.loadLayer.removeFromParent(true);
                    target.loadLayer=null;
                }


            }
                break;
            case BIND_MY_RESPONSE:
            {
                cc.log("查询绑定");
                var users=body.users;
                target.updateP2(users);

            }
                break;


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
                sender.setScale(1.0);
            }
                break;
            case ccui.Widget.TOUCH_ENDED:
            {
                sender.setScale(1.0);

                this.removeFromParent(true);

                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },
    bindClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
            {
                sender.setScale(1.05);
            }
                break;
            case ccui.Widget.TOUCH_CANCELED:
            {
                sender.setScale(1.0);
            }
                break;
            case ccui.Widget.TOUCH_ENDED:
            {
                sender.setScale(1.0);


                var bindId=this.textField.getString();
                if(bindId=="")
                {
                    return;
                }

                this.loadLayer=new LoadLayer();
                this.addChild(this.loadLayer);

                var req=new BindUserRequest();
                req.uid=myPlayerInfo.uid;
                req.bindUid=bindId;
                socketMgr.socket.send(BIND_USER_REQUEST,req);

                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },

    bClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
            {
                sender.setScale(1.05);
            }
                break;
            case ccui.Widget.TOUCH_CANCELED:
            {
                sender.setScale(1.0);
            }
                break;
            case ccui.Widget.TOUCH_ENDED:
            {
                sender.setScale(1.0);

                if(this.b1==sender)
                {
                    this.changeTab(1);
                }
                else if(this.b2==sender)
                {
                    this.changeTab(2);
                }
                playEffect(TOUCH_SOUND);
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
                sender.setScale(0.95);
            }
                break;
            case ccui.Widget.TOUCH_CANCELED:
            {
                sender.setScale(0.9);
            }
                break;
            case ccui.Widget.TOUCH_ENDED:
            {
                sender.setScale(0.9);

                if(this.haoyou==sender)
                {
                    weixinShareWithTitle("0","玩自建桌本地跑胡子游戏,报ID("+myPlayerInfo.uid+")就领取"+share_card_num+"颗钻石","体验游戏送钻石啦");////0 = 好友列表 1 = 朋友圈 2 = 收藏
                }
                else if(this.quan==sender)
                {
                    weixinShareWithTitle("1","玩自建桌本地跑胡子游戏,报ID("+myPlayerInfo.uid+")就领取"+share_card_num+"颗钻石","体验游戏送钻石啦");

                }
                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },
    downLoadFinished:function (obj,target) {
        var path=obj.path;
        var filePath=path.split("/");
        var fileName="";
        if(filePath.length>0) {
            fileName = filePath[filePath.length - 1];

        }
        var fix=getFix(fileName);
        //cc.log("#########downfinished:"+fix+" "+fileName);
        if(fix==".spx")
        {

        }
        else {

            var headIconPath=obj.savePath;
            cc.log("######下载完成:" + headIconPath);
            if(checkFileExit(headIconPath))
            {

                var p_s=headIconPath.split("/");
                var str="";
                if(p_s.length>0) {
                    str = p_s[p_s.length - 1];
                }
                var str_s=str.split("_");
                var uid=str_s[0];
                var tmpObj=target.heads1[uid];

                if(tmpObj!=undefined)
                {
                    var head=tmpObj;
                    var headSprite=new cc.Sprite(headIconPath);
                    headSprite.x=head.x;
                    headSprite.y=head.y;
                    changeHead(headSprite,3);
                    head.getParent().addChild(headSprite,1);


                }

                var tmpObj2=target.heads2[uid];
                if(tmpObj2!=undefined)
                {
                    var head=tmpObj2;
                    var headSprite=new cc.Sprite(headIconPath);
                    headSprite.x=head.x;
                    headSprite.y=head.y;
                    changeHead(headSprite,3);
                    head.getParent().addChild(headSprite,1);

                }


            }


        }

    },
    onExit:function () {
        this._super();
        EventManager.getInstance().unregist(this);
        Service.getInstance().unregist(this);

    },

});