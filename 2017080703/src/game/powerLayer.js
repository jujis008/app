/**
 * Created by yungu on 16/12/7.
 */
var PowerLayer=cc.Layer.extend({


    ctor: function (txt) {
        this._super();

        this.iconScale=1;

        this.node = parseUI("res/ui/"+my_room_name+"/power.json", CENTER_TOP);
        this.addChild(this.node);

        if(UI_TYPE==0)
        {
    
        }
        else if(UI_TYPE==1)
        {

            this.iconScale=0.5;
        }


        this.bar= ccui.helper.seekWidgetByName(this.node, "bar");
        this.bar.setPercent(0);

        this.wifi= ccui.helper.seekWidgetByName(this.node, "wifi");
        this.wifi.visible=false;

        this.schedule(this.update, 5.0);

        this.lab = new cc.LabelTTF("", FONT_NAME_APP, 48);
        this.lab.setColor(cc.color(0,0,0));
        this.lab.x=this.wifi.x;
        this.lab.y=this.wifi.y;
        this.node.addChild(this.lab);

        this.wifiSp=null;

        this.update(0);

    },

    update:function (dt) {

        getPower();
        getWifiSignal();

      //  if(wifi_type=="wifi")
        {
           // cc.log("wifi strong value:"+wifi_strong);
            if(this.wifiSp!=null)
            {
                this.wifiSp.removeFromParent(true);
                this.wifiSp=null;
            }

            if(wifi_strong<=1)
            {
                this.wifiSp=new cc.Sprite("res/ui/"+my_room_name+"/wifi_1.png");

            }
            else if(wifi_strong<=2)
            {
                this.wifiSp=new cc.Sprite("res/ui/"+my_room_name+"/wifi_2.png");

            }
            else if(wifi_strong<=3)
            {
                this.wifiSp=new cc.Sprite("res/ui/"+my_room_name+"/wifi_3.png");

            }
            else{
                this.wifiSp=new cc.Sprite("res/ui/"+my_room_name+"/wifi_4.png");

            }
            this.wifiSp.x=this.wifi.x;
            this.wifiSp.y=this.wifi.y;
            this.wifiSp.setScale(this.iconScale);
            this.node.addChild(this.wifiSp);


        }


        //cc.log("powd:"+power);
        this.bar.setPercent(power*100);


    },


});