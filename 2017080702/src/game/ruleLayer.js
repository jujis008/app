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

        this.huaihua= ccui.helper.seekWidgetByName(node, "huaihua");
        if (this.huaihua != null) {
            this.huaihua.addTouchEventListener(this.buClicked,this);
        }

        this.bopi= ccui.helper.seekWidgetByName(node, "bopi");
        if (this.bopi != null) {
            this.bopi.addTouchEventListener(this.buClicked,this);
        }

        this.honghu= ccui.helper.seekWidgetByName(node, "honghuzi");
        if (this.honghu != null) {
            this.honghu.addTouchEventListener(this.buClicked,this);
        }

        this.binzhou= ccui.helper.seekWidgetByName(node, "binzhou");
        if (this.binzhou != null) {
            this.binzhou.addTouchEventListener(this.buClicked,this);
        }


        this.gaohuzi= ccui.helper.seekWidgetByName(node, "gaohuzi");
        if (this.gaohuzi != null) {
            this.gaohuzi.addTouchEventListener(this.buClicked,this);
        }


        this.yongxing= ccui.helper.seekWidgetByName(node, "yongxing");
        if (this.yongxing != null) {
            this.yongxing.addTouchEventListener(this.buClicked,this);
        }

        this.loudi= ccui.helper.seekWidgetByName(node, "loudi");
        if (this.loudi != null) {
            this.loudi.addTouchEventListener(this.buClicked,this);
            
        }

        this.waihuzi= ccui.helper.seekWidgetByName(node, "waihuzi");
        if (this.waihuzi != null) {
            this.waihuzi.addTouchEventListener(this.buClicked,this);
        }


        this.shuangfeng= ccui.helper.seekWidgetByName(node, "shuangfeng");
        if (this.shuangfeng != null) {
            this.shuangfeng.addTouchEventListener(this.buClicked,this);
        }

        this.leiyang= ccui.helper.seekWidgetByName(node, "leiyang");
        if (this.leiyang != null) {
            this.leiyang.addTouchEventListener(this.buClicked,this);
        }

        this.hengyang= ccui.helper.seekWidgetByName(node, "hengyang");
        if (this.hengyang != null) {
            this.hengyang.addTouchEventListener(this.buClicked,this);
        }

        this.guilin= ccui.helper.seekWidgetByName(node, "guilin");
        if (this.guilin != null) {
            this.guilin.addTouchEventListener(this.buClicked,this);
        }

        this.hongheihu= ccui.helper.seekWidgetByName(node, "hongheihu");
        if (this.hongheihu != null) {
            this.hongheihu.addTouchEventListener(this.buClicked,this);
        }

        this.penghuzi= ccui.helper.seekWidgetByName(node, "penghuzi");
        if (this.penghuzi != null) {
            this.penghuzi.addTouchEventListener(this.buClicked,this);
        }

        this.dazipai= ccui.helper.seekWidgetByName(node, "dazipai");
        if (this.dazipai != null) {
            this.dazipai.addTouchEventListener(this.buClicked,this);
        }

        if (this.loudi != null) {
            this.buClicked(this.loudi,ccui.Widget.TOUCH_ENDED);
        } else if (this.huaihua != null) {
            this.buClicked(this.huaihua,ccui.Widget.TOUCH_ENDED);
        } else {
            console.log("没有可以初始化的房间!");
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

                if (this.bopi != null) {
                    this.bopi.setEnabled(true);
                    this.bopi.setTouchEnabled(true);
                }

                if (this.honghu != null) {
                    this.honghu.setEnabled(true);
                    this.honghu.setTouchEnabled(true);
                }

                if (this.binzhou != null) {
                    this.binzhou.setEnabled(true);
                    this.binzhou.setTouchEnabled(true);
                }

                if (this.gaohuzi != null) {
                    this.gaohuzi.setEnabled(true);
                    this.gaohuzi.setTouchEnabled(true);
                }

                if (this.yongxing != null) {
                    this.yongxing.setEnabled(true);
                    this.yongxing.setTouchEnabled(true);
                }

                if (this.loudi != null) {
                    this.loudi.setEnabled(true);
                    this.loudi.setTouchEnabled(true);
                }

                if (this.waihuzi != null) {
                    this.waihuzi.setEnabled(true);
                    this.waihuzi.setTouchEnabled(true);
                }

                if (this.shuangfeng != null) {
                    this.shuangfeng.setEnabled(true);
                    this.shuangfeng.setTouchEnabled(true);
                }

                if (this.leiyang != null) {
                    this.leiyang.setEnabled(true);
                    this.leiyang.setTouchEnabled(true);
                }

                if (this.hengyang != null) {
                    this.hengyang.setEnabled(true);
                    this.hengyang.setTouchEnabled(true);
                }

                if (this.guilin != null) {
                    this.guilin.setEnabled(true);
                    this.guilin.setTouchEnabled(true);
                }

                if (this.huaihua != null) {
                    this.huaihua.setEnabled(true);
                    this.huaihua.setTouchEnabled(true);
                }

                if (this.hongheihu != null) {
                    this.hongheihu.setEnabled(true);
                    this.hongheihu.setTouchEnabled(true);
                }

                if (this.penghuzi != null) {
                    this.penghuzi.setEnabled(true);
                    this.penghuzi.setTouchEnabled(true);
                }

                if (this.dazipai != null) {
                    this.dazipai.setEnabled(true);
                    this.dazipai.setTouchEnabled(true);
                }


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