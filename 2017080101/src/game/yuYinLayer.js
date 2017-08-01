/**
 * Created by yungu on 16/11/27.
 */
var YuYinLayer=cc.Layer.extend({


    ctor: function (type) {
        this._super();

        this.type=type;

        if(type==1)
        {
            this.node = parseUI("res/ui/yuyin/yuyinLayer.json", CENTER);
            this.addChild(this.node);
        }
        else if(type==2){
            this.node= parseUI("res/ui/yuyin/msgTip.json", LEFT_BOTTOM);
            this.addChild(this.node);
        }
        else if(type==3){
            this.node= parseUI("res/ui/yuyin/msgTip2.json", LEFT_BOTTOM);
            this.addChild(this.node);
        }

        this.s1=ccui.helper.seekWidgetByName(this.node,"s1");
        this.s2=ccui.helper.seekWidgetByName(this.node,"s2");
        this.s3=ccui.helper.seekWidgetByName(this.node,"s3");

        this.s1.visible=false;
        this.s2.visible=false;
        this.s3.visible=false;


        this.index=1;
        this.schedule(this.dongHua, 0.5);

    },
    setSclX:function (scl) {

        this.node.setScaleX(scl);
    },
    dongHua:function (dt) {


        if(this.index==1)
        {
            this.s1.visible=true;
            this.s2.visible=false;
            this.s3.visible=false;
        }
        else if(this.index==2)
        {
            this.s1.visible=true;
            this.s2.visible=true;
            this.s3.visible=false;
        }
        else{
            this.s1.visible=true;
            this.s2.visible=true;
            this.s3.visible=true;
        }
        this.index++;
        if(this.index>3)
        {
            this.index=1;
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


});