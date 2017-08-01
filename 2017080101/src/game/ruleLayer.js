/**
 * Created by yungu on 16/12/15.
 */
var UI_ZODER=10;

var RuleLayer=cc.Layer.extend({


    ctor: function () {
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

        var node = parseUI("res/ui/sub/chuangjian4.json", CENTER);
        touchLayer.addChild(node);


        this.scrollView=ccui.helper.seekWidgetByName(node, "ScrollView_1");
       // this.scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        this.scrollView.setTouchEnabled(true);
        this.scrollView.setScrollBarEnabled(false);


        this.layerNode=node;

        var b= ccui.helper.seekWidgetByName(node, "close");
        b.removeFromParent(true);
        this.addChild(b)
        b.x+=node.x;
        b.y+=node.y;
        b.addTouchEventListener(this.closeClicked,this);
        b.setLocalZOrder(UI_ZODER+10);

        this.bopi= ccui.helper.seekWidgetByName(node, "bopi");
        this.bopi.addTouchEventListener(this.buClicked,this);

        this.honghu= ccui.helper.seekWidgetByName(node, "honghuzi");
        this.honghu.addTouchEventListener(this.buClicked,this);

        this.binzhou= ccui.helper.seekWidgetByName(node, "binzhou");
        this.binzhou.addTouchEventListener(this.buClicked,this);


        this.gaohuzi= ccui.helper.seekWidgetByName(node, "gaohuzi");
        this.gaohuzi.addTouchEventListener(this.buClicked,this);


        this.yongxing= ccui.helper.seekWidgetByName(node, "yongxing");
        this.yongxing.addTouchEventListener(this.buClicked,this);

        this.loudi= ccui.helper.seekWidgetByName(node, "loudi");
        this.loudi.addTouchEventListener(this.buClicked,this);

        this.waihuzi= ccui.helper.seekWidgetByName(node, "waihuzi");
        this.waihuzi.addTouchEventListener(this.buClicked,this);


        this.shuangfeng= ccui.helper.seekWidgetByName(node, "shuangfeng");
        this.shuangfeng.addTouchEventListener(this.buClicked,this);

        this.leiyang= ccui.helper.seekWidgetByName(node, "leiyang");
        this.leiyang.addTouchEventListener(this.buClicked,this);

        this.hengyang= ccui.helper.seekWidgetByName(node, "hengyang");
        this.hengyang.addTouchEventListener(this.buClicked,this);

        this.guilin= ccui.helper.seekWidgetByName(node, "guilin");
        this.guilin.addTouchEventListener(this.buClicked,this);

        this.huaihua= ccui.helper.seekWidgetByName(node, "huaihua");
        this.huaihua.addTouchEventListener(this.buClicked,this);


        this.hongheihu= ccui.helper.seekWidgetByName(node, "hongheihu");
        this.hongheihu.addTouchEventListener(this.buClicked,this);

        this.penghuzi= ccui.helper.seekWidgetByName(node, "penghuzi");
        this.penghuzi.addTouchEventListener(this.buClicked,this);

        this.dazipai= ccui.helper.seekWidgetByName(node, "dazipai");
        this.dazipai.addTouchEventListener(this.buClicked,this);


        this.buClicked(this.loudi,ccui.Widget.TOUCH_ENDED);

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
            }
                break;


            default:
                break;
        }


    },
    buClicked:function(sender, type)
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

                this.bopi.setEnabled(true);
                this.bopi.setTouchEnabled(true);

                this.honghu.setEnabled(true);
                this.honghu.setTouchEnabled(true);

                this.binzhou.setEnabled(true);
                this.binzhou.setTouchEnabled(true);

                this.gaohuzi.setEnabled(true);
                this.gaohuzi.setTouchEnabled(true);

                this.yongxing.setEnabled(true);
                this.yongxing.setTouchEnabled(true);

                this.loudi.setEnabled(true);
                this.loudi.setTouchEnabled(true);

                this.waihuzi.setEnabled(true);
                this.waihuzi.setTouchEnabled(true);

                this.shuangfeng.setEnabled(true);
                this.shuangfeng.setTouchEnabled(true);


                this.leiyang.setEnabled(true);
                this.leiyang.setTouchEnabled(true);

                this.hengyang.setEnabled(true);
                this.hengyang.setTouchEnabled(true);

                this.guilin.setEnabled(true);
                this.guilin.setTouchEnabled(true);

                this.huaihua.setEnabled(true);
                this.huaihua.setTouchEnabled(true);

                this.hongheihu.setEnabled(true);
                this.hongheihu.setTouchEnabled(true);


                this.penghuzi.setEnabled(true);
                this.penghuzi.setTouchEnabled(true);

                this.dazipai.setEnabled(true);
                this.dazipai.setTouchEnabled(true);



                if (this.bopi == sender) {
                    RULE_VALUE = ROOM_TYPE_BOPI;

                    this.bopi.setEnabled(false);
                    this.bopi.setTouchEnabled(false);
                }
                else if (this.honghu == sender) {
                    RULE_VALUE = ROOM_TYPE_HONGHU_147;

                    this.honghu.setEnabled(false);
                    this.honghu.setTouchEnabled(false);
                }
                else if (this.binzhou == sender) {
                    RULE_VALUE = ROOM_TYPE_BINZHOU;

                    this.binzhou.setEnabled(false);
                    this.binzhou.setTouchEnabled(false);
                }
                else if (this.gaohuzi == sender) {
                    RULE_VALUE = ROOM_TYPE_GAOHUZI;

                    this.gaohuzi.setEnabled(false);
                    this.gaohuzi.setTouchEnabled(false);
                }
                else if (this.yongxing == sender) {
                    RULE_VALUE = ROOM_TYPE_BINZHOU_YONGXING;

                    this.yongxing.setEnabled(false);
                    this.yongxing.setTouchEnabled(false);
                }
                else if (this.loudi == sender) {
                    RULE_VALUE = ROOM_TYPE_LOUDI;

                    this.loudi.setEnabled(false);
                    this.loudi.setTouchEnabled(false);
                }
                else if (this.waihuzi == sender) {
                    RULE_VALUE = ROOM_TYPE_WAIHUZI;

                    this.waihuzi.setEnabled(false);
                    this.waihuzi.setTouchEnabled(false);
                }
                else if(this.shuangfeng == sender)
                {
                    RULE_VALUE = ROOM_TYPE_SHUANGFENG;

                    this.shuangfeng.setEnabled(false);
                    this.shuangfeng.setTouchEnabled(false);

                }
                else if(this.leiyang == sender)
                {
                    RULE_VALUE = ROOM_TYPE_LEIYANG;

                    this.leiyang.setEnabled(false);
                    this.leiyang.setTouchEnabled(false);

                }
                else if(this.hengyang == sender)
                {
                    RULE_VALUE = ROOM_TYPE_HENGYANG;

                    this.hengyang.setEnabled(false);
                    this.hengyang.setTouchEnabled(false);

                }
                else if(this.guilin == sender)
                {
                    RULE_VALUE = ROOM_TYPE_GUILIN;

                    this.guilin.setEnabled(false);
                    this.guilin.setTouchEnabled(false);

                }
                else if(this.huaihua == sender)
                {
                    RULE_VALUE = ROOM_TYPE_HUAIHUA;

                    this.huaihua.setEnabled(false);
                    this.huaihua.setTouchEnabled(false);

                }
                else if(this.hongheihu == sender)
                {
                    RULE_VALUE = ROOM_TYPE_HONGHEIHU;

                    this.hongheihu.setEnabled(false);
                    this.hongheihu.setTouchEnabled(false);

                }
                else if(this.penghuzi == sender)
                {
                    RULE_VALUE = ROOM_TYPE_PENGHUZI;

                    this.penghuzi.setEnabled(false);
                    this.penghuzi.setTouchEnabled(false);

                }
                else if(this.dazipai == sender)
                {
                    RULE_VALUE = ROOM_TYPE_DAZIPAI;

                    this.dazipai.setEnabled(false);
                    this.dazipai.setTouchEnabled(false);

                }



                if(this.showLayer!=undefined&&this.showLayer!=null)
                {
                    this.showLayer.removeFromParent(true);
                    this.showLayer=null;
                }
                this.showLayer=new CreateRoomLayer2(this.sceneId);
                this.addChild(this.showLayer,UI_ZODER);

                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },
 



});