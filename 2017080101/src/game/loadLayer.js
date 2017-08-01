


var LoadLayer = cc.Layer.extend({



        ctor:function()
        {
            this._super();


            var winSize=cc.director.getWinSize();

            var sp=new cc.Sprite("res/ui/comm/icon_start2.png");
            this.addChild(sp);
            sp.x=winSize.width/2;
            sp.y=winSize.height/2;

            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: this.onTouchBegan,
                onTouchMoved: this.onTouchMoved,
                onTouchEnded: this.onTouchEnded
            }, this);

         },

    onTouchBegan:function (touch, event) {

       

        return true;
    },
    onTouchMoved:function (touch, event) {


    },
    onTouchEnded:function (touch, event) {


    }


});



