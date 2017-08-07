/**
 * Created by yungu on 16/11/4.
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

var ZhanJiLayer=cc.Layer.extend({


    ctor: function (sceneId) {
        this._super();

        var touchLayer=new TouchLayer();
        this.addChild(touchLayer);

        var node = parseUI("res/ui/sub/zhanjiLayer2.json", CENTER);
        touchLayer.addChild(node);


        var close= ccui.helper.seekWidgetByName(node, "close");
        close.addTouchEventListener(this.closeClicked,this);

        var headBg=ccui.helper.seekWidgetByName(node, "Image_5");
        headBg.setLocalZOrder(2);
        var headName=myPlayerInfo.uid+"_head.png";
        var headIconPath=getSkinPath(headName);
        if(checkFileExit(headIconPath))
        {
            var headSprite=new cc.Sprite(headIconPath);
            headSprite.x=headBg.x;
            headSprite.y=headBg.y;
            changeHead(headSprite,2);
            headBg.getParent().addChild(headSprite,1);
        }

        var name=ccui.helper.seekWidgetByName(node, "name");
        name.setString(myPlayerInfo.name);

        var idLab=ccui.helper.seekWidgetByName(node, "id");
        idLab.setString("ID:"+myPlayerInfo.uid);

        this.timeLabel=ccui.helper.seekWidgetByName(node, "t");


        var huifang2=ccui.helper.seekWidgetByName(node, "huifang2");
        huifang2.addTouchEventListener(this.huifang2Clicked,this);




        this.update(0);
        this.schedule(this.update, 60);

        this.scrollView=ccui.helper.seekWidgetByName(node, "ScrollView_1");
        this.scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        this.scrollView.setTouchEnabled(true);
        this.pModel=ccui.helper.seekWidgetByName(this.scrollView, "p1");
        this.pModel.visible=false;

        this.scrollView.setScrollBarEnabled(false);

        Service.getInstance().regist(GET_ZHANJI_RESPONSE,this,this.onReceive);
        Service.getInstance().regist(PLAY_RESPONSE,this,this.onReceive);


        var req=new GetZhanJiRequest();
        req.uid=myPlayerInfo.uid;
        socketMgr.socket.send(GET_ZHANJI_REQUEST,req);

    },

    onReceive:function(msgNumber,body,target)
    {

        switch(msgNumber)
        {

            case GET_ZHANJI_RESPONSE:
            {



                
                target.zhanjis=body.zhanjis;

                target.resetUI();


            }
                break;
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

                        target.addChild(new PlayBackFuCheng(0,code,size,-1,httpurl),10000);
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

        var gap_h=this.pModel.getContentSize().height;
        var len=this.zhanjis.length;
        var ccc=this.scrollView.getInnerContainerSize();
        var ww=ccc.width;
        var hh=gap_h*len;
        var hTmp=hh-ccc.height;
        if(hTmp<0)hTmp=0;

        var sortList=[];
        for(var i=0;i<len;i++) {
            var zhanji = this.zhanjis[i];

            var hasAdd=false;
            var count2=sortList.length;
            for(var j=0;j<count2;j++)
            {
                var z=sortList[j];
                if(zhanji.time>z.time)
                {
                    sortList.splice(j,0,zhanji);
                    hasAdd=true;
                    break;
                }

            }

            if(!hasAdd)
            {
                sortList.push(zhanji);
            }

        }
        this.zhanjis=sortList;

        cc.log("数目:"+len);
        for(var i=0;i<len;i++)
        {
            var zhanji=this.zhanjis[i];
            var panel=this.pModel.clone();


            var time1=ccui.helper.seekWidgetByName(panel, "t1");
            var time2=ccui.helper.seekWidgetByName(panel, "t2");
            //if(t.length>1)
            {

                //var arr1=zhanji.time.split(" ");
               // var arr2=zhanji.time2.split(" ");

                //var str=arr1[1]+"~"+arr2[1];
                time1.setString(zhanji.time);
                time2.setString(zhanji.time2);
            }
            // var time2=ccui.helper.seekWidgetByName(panel, "t2");
            // if(t.length>1)
            // {
            //     time2.setString(t[1]);
            // }

            var jushu=ccui.helper.seekWidgetByName(panel, "jushu");
            // if(zhanji.ju==100)
            // {
            //     jushu.setString("满百胡息结束");
            // }
            // else{
                jushu.setString(zhanji.ju+"");
            //}


            var renshu=ccui.helper.seekWidgetByName(panel, "jushu_0");
            renshu.setString(zhanji.renshu+"");

            var hushu=ccui.helper.seekWidgetByName(panel, "jushu_1");
            hushu.setString(zhanji.score+"");

            if(zhanji.code!="")
            {
                var huifang=ccui.helper.seekWidgetByName(panel, "huifang");
                huifang.code=zhanji.code;


                huifang.addTouchEventListener(this.huifangClicked,this);


                var fenxiang=ccui.helper.seekWidgetByName(panel, "fenxiang");
                fenxiang.addTouchEventListener(this.fenxiangClicked,this);
                fenxiang.code=zhanji.code;

                var bgButton=ccui.helper.seekWidgetByName(panel, "bgButton");
                bgButton.zhanji=zhanji;
                bgButton.addTouchEventListener(this.bgButtonClicked,this);

            }


            this.scrollView.addChild(panel);

            panel.x=this.pModel.x;
            panel.y=this.pModel.y-i*gap_h+hTmp;
            panel.visible=true;

        }



        //cc.log("cc:"+ccc.height+",hh:"+hh+","+gap_h*len);
        this.scrollView.setInnerContainerSize(cc.size(ww, hh));

    },

    update:function (dt) {

        var str=new Date().Format("yyyy/MM/dd");
        this.timeLabel.setString(str);

    },
    bgButtonClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                var zhanji=sender.zhanji;

                var layer=new ZhanJiLayer2(zhanji);
                this.addChild(layer,10);

                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },

    fenxiangClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                var code=sender.code;

                weixinShare("0","您的好友邀请您观看,"+APP_NICK_NAME+"回放,回放码:"+code);

                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },

huifangClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                var code=sender.code;

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

    huifang2Clicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                //"1740000"

                this.addChild(new PlayBackTipLayer(0),100);
    
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
