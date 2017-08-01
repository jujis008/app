


var TouchLayer = cc.Layer.extend({

        registerRelease:[],
        swallow:false,
        ctor:function()
        {
            this._super();
            this.registerRelease=[];

            this.listener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: this.onTouchBegan,
                onTouchMoved: this.onTouchMoved,
                onTouchEnded: this.onTouchEnded
            });
            cc.eventManager.addListener(this.listener,this);

            // cc.eventManager.addListener({
            //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
            //     swallowTouches: true,
            //     onTouchBegan: this.onTouchBegan,
            //     onTouchMoved: this.onTouchMoved,
            //     onTouchEnded: this.onTouchEnded
            // }, this);

         },

    onTouchBegan:function (touch, event) {
       
        var target = event.getCurrentTarget();

        var pos=touch.getLocation();



        for(var key in target.registerRelease)
        {
            var node=target.getChildByName(key);
            cc.log("touch key:::::::"+key);
           //  if(node==null)
           //  {
           //      //cc.log(target.testName+" Error----getChildByName "+key+" is null!");
           //      continue;
           //  }
            var nsp=node.convertToNodeSpace(pos);
            var bb=node.getBoundingBox();

            //  cc.log(key+"..."+nsp.x+":"+nsp.y+":"+bb.width+":"+bb.height);

            if (nsp.x >= 0 && nsp.x <= bb.width && nsp.y > 0 && nsp.y <= bb.height) {

                return true;

            }
        }


        return true;
    },
    onTouchMoved:function (touch, event) {

        var target = event.getCurrentTarget();

        var pos = touch.getLocation();


    },
    onTouchEnded:function (touch, event) {
        var target = event.getCurrentTarget();
        var pos = touch.getLocation();

        for(var key in target.registerRelease)
        {
            var node=target.getChildByName(key);
            var nsp=node.convertToNodeSpace(pos);
            var bb=node.getBoundingBox();

          //  cc.log(key+"..."+nsp.x+":"+nsp.y+":"+bb.width+":"+bb.height);

            if (nsp.x >= 0 && nsp.x <= bb.width && nsp.y > 0 && nsp.y <= bb.height) {
               // cc.log("touch call back.....");
                var t=target.registerRelease[key];
                t.func(node,t.target);

                break;
            }
        }

    },
    registRelease:function (name,target,func)
    {
        for(var key in this.registerRelease)
        {
            if(name==key)
            {
                return;
            }


        }
        var t={};
        t.target=target;
        t.func=func;
        this.registerRelease[name]=t;

    },
    onExit:function () {
        cc.log("========%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
        this._super();
        cc.eventManager.removeListener(this.listener);
        registerRelease=null;
    }


});



