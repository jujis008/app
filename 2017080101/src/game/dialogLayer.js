
var DialogLayer = cc.Layer.extend({



    ctor:function()
    {
        this._super();

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);

    },
    show:function (txt) {



        var node = parseUI("res/ui/comm/tipTipLayer.json", CENTER);
        this.addChild(node);
        var a=ccui.helper.seekWidgetByName(node, "a");

        var start = new cc.LabelTTF(txt, FONT_NAME_APP, 30);
        start.setColor(cc.color(255,255,255));

        var winSize=cc.director.getWinSize();
        start.x=a.x;
        start.y=a.y;
        node.addChild(start);

       // var actionTo = cc.moveTo(2.0, cc.p(winSize.width/2, winSize.height-100));
       // var seq=cc.sequence(actionTo, cc.callFunc(this.onCallback1, this))
        //start.runAction(seq);

        var size=start.getContentSize();
        a.setContentSize(size.width+20,50);

        this.schedule(this.waitTime, 3.0);

        return start;
    },
    waitTime:function (dt) {

        this.removeFromParent(true);
        
    },
    onCallback1:function () {
        this.removeFromParent(true);

    },
    onTouchBegan:function (touch, event) {



        return true;
    },
    onTouchMoved:function (touch, event) {


    },
    onTouchEnded:function (touch, event) {


    }


});