/**
 * Created by yungu on 17/1/21.
 */

var ZhanJiLayer2=cc.Layer.extend({


    ctor: function (zhanji) {
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

        var node = parseUI("res/ui/sub/zhanjiLayer3.json", CENTER);
        touchLayer.addChild(node);


        var close= ccui.helper.seekWidgetByName(node, "close");
        close.addTouchEventListener(this.closeClicked,this);


        this.scrollView=ccui.helper.seekWidgetByName(node, "ScrollView_1");
        this.scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        this.scrollView.setTouchEnabled(true);
        this.pModel=ccui.helper.seekWidgetByName(this.scrollView, "p1");
        this.pModel.visible=false;

        this.scrollView.setScrollBarEnabled(false);

        Service.getInstance().registWithSwallow(PLAY_RESPONSE,this,this.onReceive,true);

        this.zhanji=zhanji;

        this.resetUI();
    },

    onReceive:function(msgNumber,body,target)
    {

        switch(msgNumber)
        {


            case PLAY_RESPONSE:
            {
                cc.log("回放 state:"+body.state);

                if(target.loadLayer!=null&&target.loadLayer!=undefined)
                {
                    target.loadLayer.removeFromParent(true);
                    target.loadLayer=null;
                }

                if(body.state==0)
                {
                    //   SceneManager.getInstance().changeScene(PLAY_BACK_SCENE,REPLACE_SCENE);


                    var code=body.code;
                    var size=body.size;
                    var httpurl=body.url;
                    if(UI_TYPE==1)
                    {

                        target.addChild(new PlayBackFuCheng(0,code,size,target.playIndex,httpurl),10000);
                    }
                    else{
                        target.addChild(new PlayBackScene(0,code,size,httpurl),10000);
                    }

                }
                else{
                    var dialog=new DialogLayer();
                    dialog.show("[回放码错误!]");
                    target.addChild(dialog,100);




                }

            }


        }


    },

    resetUI:function () {

        var juList=this.zhanji.juList;

        var gap_h=this.pModel.getContentSize().height;
        var len=juList.length;
        var ccc=this.scrollView.getInnerContainerSize();
        var ww=ccc.width;
        var hh=gap_h*len;
        var hTmp=hh-ccc.height;
        if(hTmp<0)hTmp=0;



        cc.log("数目:"+len);
        for(var i=0;i<len;i++)
        {
            var meiJuObj=juList[i];
            var panel=this.pModel.clone();


            var a1=ccui.helper.seekWidgetByName(panel, "a1");
            a1.setString("第"+(i+1)+"局");

            var m1=ccui.helper.seekWidgetByName(panel, "m1");
            var m2=ccui.helper.seekWidgetByName(panel, "m2");
            var m3=ccui.helper.seekWidgetByName(panel, "m3");
            var m4=ccui.helper.seekWidgetByName(panel, "m4");

            m1.visible=false;
            m2.visible=false;
            m3.visible=false;
            m4.visible=false;


            var playerCount=meiJuObj.players.length;
            for(var j=0;j<playerCount;j++)
            {
                var zhanJiObj=meiJuObj.players[j];

                var m=null;
                if(j==0)
                {
                   m=m1;
                }
                else if(j==1)
                {
                    m=m2;
                }
                else if(j==2)
                {
                    m=m3;
                }
                else if(j==3)
                {
                    m=m4;
                }
                m.visible=true;


                console.log("======"+zhanJiObj.huxi+",,,"+this.zhanji.roomType);

                if(this.zhanji.roomType==ROOM_TYPE_BOPI)
                {
                    m.setString(zhanJiObj.name+":"+zhanJiObj.huxi);


                }
                else if(this.zhanji.roomType==ROOM_TYPE_WAIHUZI||this.zhanji.roomType==ROOM_TYPE_WAIHUZI||this.zhanji.roomType==ROOM_TYPE_GAOHUZI
                    ||this.zhanji.roomType==ROOM_TYPE_LOUDI||this.zhanji.roomType==ROOM_TYPE_SHUANGFENG
                )
                {
                    m.setString(zhanJiObj.name+":"+zhanJiObj.huxi);
                    console.log("***********"+zhanJiObj.huxi);
                }
                else{
                    m.setString(zhanJiObj.name+":"+zhanJiObj.dunshu);
                }

            }

            if(this.zhanji.code!="")
            {
                var huifang=ccui.helper.seekWidgetByName(panel, "huifang");
                huifang.code=this.zhanji.code;
                huifang.addTouchEventListener(this.huifangClicked,this);
                huifang.index=i+1;


            }


            this.scrollView.addChild(panel);

            panel.x=this.pModel.x;
            panel.y=this.pModel.y-i*gap_h+hTmp;
            panel.visible=true;

        }



        //cc.log("cc:"+ccc.height+",hh:"+hh+","+gap_h*len);
        this.scrollView.setInnerContainerSize(cc.size(ww, hh));

    },



   

    huifangClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                var code=sender.code;

                this.playIndex=sender.index;

                var req=new PlayRequest();
                req.uid=myPlayerInfo.uid;
                req.code=code;
                socketMgr.socket.send(PLAY_REQUEST,req);

                this.loadLayer=new LoadLayer();
                this.addChild(this.loadLayer,1);

                playEffect(TOUCH_SOUND);
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