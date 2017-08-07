/**
 * Created by yungu on 16/11/4.
 */

var ShopLayer=cc.Layer.extend({


    ctor: function (sceneId) {
        this._super();

        var touchLayer=new TouchLayer();
        this.addChild(touchLayer);

        var node = parseUI("res/ui/sub/shop.json", CENTER);
        touchLayer.addChild(node);
        
        for(var i=1;i<=6;i++)
        {

            var nodeName="p"+i;
            var p= ccui.helper.seekWidgetByName(node, nodeName);
            var b=ccui.helper.seekWidgetByName(p, "b");
            
            if(i<=goodsArr.length)
            {
                var g=goodsArr[i-1];
                b.goodId=g.id;
                console.log("good ID: " + g.id);
                var lab=ccui.helper.seekWidgetByName(p, "a2");
                var str=g.price+"元";
                console.log("good名字：" + str);
                lab.setString(str);


            }
            b.addTouchEventListener(this.buyClicked,this);
        }

        var close= ccui.helper.seekWidgetByName(node, "close");
        close.addTouchEventListener(this.closeClicked,this);

        cc.log("注册PAY_BACK_EVENT");
        EventManager.getInstance().regist("PAY_BACK_EVENT",this,this.onPayBackEvent);


    },
    onPayBackEvent:function (obj,target) {


        cc.log("on pay back!");
                              
        if(target.loadLayer!=null&&target.loadLayer!=undefined)
        {
            target.loadLayer.removeFromParent(true);
            target.loadLayer=null;
        }

        if(obj.state==0)
        {
            cc.log("buy good finished!");
                              
            var req={};
            req.token=obj.value;
            req.uid=myPlayerInfo.uid;
            req.name=myPlayerInfo.name;
            req.ip=myPlayerInfo.ip;
            req.goodId=target.goodId;
            Service.getInstance().sendHttpRequest(PAY_REQUEST,req,target.payCheckCallBack.bind(target));
        }
        else{
                              
            var dialog=new DialogLayer();
            dialog.show("[支付失败!]");
            target.addChild(dialog,200);
        }


    },
    payCheckCallBack:function (obj) {

        if(obj.state!=0)
        {
            var dialog=new DialogLayer();
            dialog.show(obj.txt);
            this.addChild(dialog,100);
        }

    },
    buyClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {

                if(cc.sys.os == cc.sys.OS_ANDROID){
                    
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
                } else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){

                    if(this.touchLayer2==undefined||this.touchLayer2===null)
                    {
                
                       if(this.loadLayer!=null&&this.loadLayer!=undefined)
                       {
                           this.loadLayer.removeFromParent(true);
                           this.loadLayer=null;
                        }


                        var gId=sender.goodId;
                        buyGood(gId);
                
                        this.goodId=gId;

    //                  this.loadLayer=new LoadLayer();
    //                  this.addChild(this.loadLayer);
                
                       playEffect(TOUCH_SOUND);
                    }
                } else {
                    console.log("不支持的平台.");
                }
                

            }
                break;


            default:
                break;
        }


    },
    closeClicked2:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                if(this.touchLayer2!=undefined&&this.touchLayer2!=null)
                {
                    this.touchLayer2.removeFromParent(true);
                    this.touchLayer2=null;

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
    onExit:function () {
        this._super();
        cc.log("注销shop.js");
        EventManager.getInstance().unregist(this);

    },

});
