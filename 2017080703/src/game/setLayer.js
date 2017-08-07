/**
 * Created by yungu on 16/11/29.
 */


var SetLayer=cc.Layer.extend({


    ctor: function (obj,type) {
        this._super();

        var touchLayer=new TouchLayer();
        this.addChild(touchLayer);

        var node = parseUI("res/ui/set/setLayer.json", CENTER);
        touchLayer.addChild(node);

        this.layerNode=node;

        var b= ccui.helper.seekWidgetByName(node, "close");
        b.addTouchEventListener(this.closeClicked,this);


        this.slider1 = ccui.helper.seekWidgetByName(node, "slider1");
        this.slider1.addCCSEventListener(this.sliderStateChange);
        this.slider1.that=this;

        this.slider2 = ccui.helper.seekWidgetByName(node, "slider2");
        this.slider2.addCCSEventListener(this.sliderStateChange2);
        this.slider2.that=this;

         this.slider1.setPercent(musicVolume*100);
         this.slider2.setPercent(effectVolume*100);


        
        this.j1 = ccui.helper.seekWidgetByName(node, "j1");
        this.j1.addTouchEventListener(this.jClicked,this);
        this.j1.value=1;

        this.j2 = ccui.helper.seekWidgetByName(node, "j2");
        this.j2.addTouchEventListener(this.jClicked,this);
        this.j2.value=2;

        this.j3 = ccui.helper.seekWidgetByName(node, "j3");
        this.j3.addTouchEventListener(this.jClicked,this);
        this.j3.value=3;

        this.j4 = ccui.helper.seekWidgetByName(node, "j4");
        this.j4.addTouchEventListener(this.jClicked,this);
        this.j4.value=4;

        this.j1.visible=false;
        this.j1.setEnabled(false);
        this.j1.setTouchEnabled(false);

        this.j2.visible=false;
        this.j2.setEnabled(false);
        this.j2.setTouchEnabled(false);

        this.j3.visible=false;
        this.j3.setEnabled(false);
        this.j3.setTouchEnabled(false);

        this.j4.visible=false;
        this.j4.setEnabled(false);
        this.j4.setTouchEnabled(false);


        if(musicVolume<=0)
        {
            this.setMusicEnabled(false);
        }
        else{
            this.setMusicEnabled(true);
        }

        if(effectVolume<=0)
        {
            this.setEffectEnabled(false);
        }
        else{
            this.setEffectEnabled(true);
        }
        
        // this.b1 = ccui.helper.seekWidgetByName(node, "b1");
        // this.b1.addTouchEventListener(this.musicSoundStateChange,this);
        //
        // this.b2 = ccui.helper.seekWidgetByName(node, "b2");
        // this.b2.addTouchEventListener(this.musicSoundStateChange,this);
        //
        // this.b3 = ccui.helper.seekWidgetByName(node, "b3");
        // this.b3.addTouchEventListener(this.effectSoundStateChange,this);
        //
        // this.b4 = ccui.helper.seekWidgetByName(node, "b4");
        // this.b4.addTouchEventListener(this.effectSoundStateChange,this);


        var exit= ccui.helper.seekWidgetByName(node, "exit");
        exit.visible=false;

        var effectSound=cc.sys.localStorage.getItem("effectSound");
        var musicSound=cc.sys.localStorage.getItem("musicSound");

        // if(effectSound=="0")
        // {
        //     this.b3.visible=false;
        //     this.b3.setEnabled(false);
        //     this.b3.setTouchEnabled(false);
        //
        //     effectVolume=0;
        //     cc.audioEngine.setEffectsVolume(effectVolume);
        //
        //     this.isEffectSound=false;
        // }
        // else{
        //     this.isEffectSound=true;
        //
        //     this.b4.visible=false;
        //     this.b4.setEnabled(false);
        //     this.b4.setTouchEnabled(false);
        // }
        //
        // if(musicSound=="0")
        // {
        //     this.b1.visible=false;
        //     this.b1.setEnabled(false);
        //     this.b1.setTouchEnabled(false);
        //
        //     musicVolume=0;
        //     cc.audioEngine.setMusicVolume(musicVolume);
        //
        //     this.isMusicSound=false;
        // }
        // else{
        //     this.isMusicSound=true;
        //
        //     this.b2.visible=false;
        //     this.b2.setEnabled(false);
        //     this.b2.setTouchEnabled(false);
        // }

        if(type==1)
        {
            exit.visible=true;
            exit.addTouchEventListener(this.exitClicked,this);

            var p= ccui.helper.seekWidgetByName(node, "p");
            p.visible=false;

            var m1= ccui.helper.seekWidgetByName(node, "m1");
            m1.x=50;
            m1.y=50;


            var m2= ccui.helper.seekWidgetByName(node, "m2");
            m2.x=50;
            m2.y=30;

        }
        else{

        }

        var room_bg=cc.sys.localStorage.getItem("room_bg");
        var bgIndex=-1;
        if(room_bg!=undefined&&room_bg!="")
        {
                bgIndex=parseInt(room_bg);
        }
        else{
            bgIndex=1;
        }
        for(var i=1;i<=3;i++)
        {
            var key1="a"+i;
            var key2="c"+i;

            var k1=ccui.helper.seekWidgetByName(node, key1);
            var k2=ccui.helper.seekWidgetByName(node, key2);
            k1.value=i;
            k2.visible=false;

            k1.addTouchEventListener(this.selectedChange,this);

            if(bgIndex==i)
            {
                k2.visible=true;
                k1.visible=false;

            }
        }



    },



    setSelected:function (index) {


        for(var i=1;i<=3;i++)
        {
            var key1="a"+i;
            var key2="c"+i;

            var k1=ccui.helper.seekWidgetByName(this.layerNode, key1);
            var k2=ccui.helper.seekWidgetByName(this.layerNode, key2);
            k1.value=i;
            k2.visible=false;

            if(i==index)
            {
                k2.visible=true;
                k1.visible=false;

            }
            else{
                k1.visible=true;
            }

        }

        var obj={};
        obj.index=index;
        EventManager.getInstance().fireEvent("ROOM_BG_CHANGE_EVENT",obj);

        cc.sys.localStorage.setItem("room_bg",""+index);
    },
    selectedChange:function(sender,type){


        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
            {
                sender.setScale(1.05);
            }
                break;
            case ccui.Widget.TOUCH_CANCELED:
            {
                sender.setScale(1);
            }
                break;
            case ccui.Widget.TOUCH_ENDED:
            {
                sender.setScale(1);

                var value=sender.value;
                this.setSelected(value);

            }
                break;


            default:
                break;
        }
    },

    effectSoundStateChange:function(sender,type){


        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
            {
                sender.setScale(1.05);
            }
                break;
            case ccui.Widget.TOUCH_CANCELED:
            {
                sender.setScale(1);
            }
                break;
            case ccui.Widget.TOUCH_ENDED:
            {

                if(this.isEffectSound)
                {
                    effectVolume=0;

                    this.isEffectSound=false;
                    cc.audioEngine.setEffectsVolume(effectVolume);
                    cc.sys.localStorage.setItem("effectSound","0");

                    this.b3.visible=false;
                    this.b3.setEnabled(false);
                    this.b3.setTouchEnabled(false);


                    this.b4.visible=true;
                    this.b4.setEnabled(true);
                    this.b4.setTouchEnabled(true)

                }
                else{
                    effectVolume=1;

                    this.isEffectSound=true;
                    cc.audioEngine.setEffectsVolume(effectVolume);

                    cc.sys.localStorage.setItem("effectSound","1");


                    this.b3.visible=true;
                    this.b3.setEnabled(true);
                    this.b3.setTouchEnabled(true);


                    this.b4.visible=false;
                    this.b4.setEnabled(false);
                    this.b4.setTouchEnabled(false)
                }


            }
                break;


            default:
                break;
        }
    },

    musicSoundStateChange:function(sender,type){

        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
            {
                sender.setScale(1.05);
            }
                break;
            case ccui.Widget.TOUCH_CANCELED:
            {
                sender.setScale(1);
            }
                break;
            case ccui.Widget.TOUCH_ENDED:
            {

                if(this.isMusicSound)
                {

                    musicVolume=0;

                    this.isMusicSound=false;
                    cc.audioEngine.setMusicVolume(musicVolume);
                    cc.sys.localStorage.setItem("musicSound","0");

                    this.b1.visible=false;
                    this.b1.setEnabled(false);
                    this.b1.setTouchEnabled(false);


                    this.b2.visible=true;
                    this.b2.setEnabled(true);
                    this.b2.setTouchEnabled(true);



                }
                else{
                    musicVolume=1;

                    this.isMusicSound=true;
                    cc.audioEngine.setMusicVolume(musicVolume);

                    this.b1.visible=true;
                    this.b1.setEnabled(true);
                    this.b1.setTouchEnabled(true);

                    this.b2.visible=false;
                    this.b2.setEnabled(false);
                    this.b2.setTouchEnabled(false);

                    cc.sys.localStorage.setItem("musicSound","1");
                }



            }
                break;


            default:
                break;
        }
    },

    sliderStateChange:function(sender,type){
        switch(type){
            case ccui.Slider.EVENT_PERCENT_CHANGED:
                var p=sender.getPercent();
                //音乐
                musicVolume=p/100;

                cc.audioEngine.setMusicVolume(musicVolume);

                cc.sys.localStorage.setItem("musicSound",""+musicVolume);

                var that=sender.that;
                if(musicVolume<=0)
                {
                    that.setMusicEnabled(false);
                }
                else{
                    that.setMusicEnabled(true);
                }

                break;
            default:
                break;
        }
    },
    sliderStateChange2:function(sender,type){
        switch(type){
            case ccui.Slider.EVENT_PERCENT_CHANGED:
                var p=sender.getPercent();
                effectVolume=p/100;

                cc.audioEngine.setEffectsVolume(effectVolume);

                cc.sys.localStorage.setItem("effectSound",""+effectVolume);

                var that=sender.that;
                if(effectVolume<=0)
                {
                    that.setEffectEnabled(false);
                }
                else{
                    that.setEffectEnabled(true);
                }

                break;
            default:
                break;
        }
    },
    setMusicEnabled:function(isEnable)
    {
        if(isEnable)
        {
            this.j1.visible=true;
            this.j1.setEnabled(true);
            this.j1.setTouchEnabled(true);

            this.j2.visible=false;
            this.j2.setEnabled(false);
            this.j2.setTouchEnabled(false);
        }
        else{
            this.j1.visible=false;
            this.j1.setEnabled(false);
            this.j1.setTouchEnabled(false);

            this.j2.visible=true;
            this.j2.setEnabled(true);
            this.j2.setTouchEnabled(true);
        }

    },
    setEffectEnabled:function(isEnable)
    {
        if(isEnable)
        {
            this.j3.visible=true;
            this.j3.setEnabled(true);
            this.j3.setTouchEnabled(true);

            this.j4.visible=false;
            this.j4.setEnabled(false);
            this.j4.setTouchEnabled(false);
        }
        else{
            this.j3.visible=false;
            this.j3.setEnabled(false);
            this.j3.setTouchEnabled(false);

            this.j4.visible=true;
            this.j4.setEnabled(true);
            this.j4.setTouchEnabled(true);
        }

    },

    jClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
            {
                sender.setScale(1.05);
            }
                break;
            case ccui.Widget.TOUCH_CANCELED:
            {
                sender.setScale(1);
            }
                break;
            case ccui.Widget.TOUCH_ENDED:
            {
                sender.setScale(1);

                var value=sender.value;
                if(value==1)
                {
                    this.setMusicEnabled(false);

                    musicVolume=0;
                    cc.audioEngine.setMusicVolume(musicVolume);
                    this.slider1.setPercent(musicVolume*100);
                    cc.sys.localStorage.setItem("musicSound",""+musicVolume);
                }
                else if(value==2)
                {
                    this.setMusicEnabled(true);

                    musicVolume=1;
                    cc.audioEngine.setMusicVolume(musicVolume);
                    this.slider1.setPercent(musicVolume*100);
                    cc.sys.localStorage.setItem("musicSound",""+musicVolume);
                }
                else if(value==3)
                {
                    this.setEffectEnabled(false);

                    effectVolume=0;
                    cc.audioEngine.setEffectsVolume(effectVolume);
                    this.slider2.setPercent(effectVolume*100);
                    cc.sys.localStorage.setItem("effectSound",""+effectVolume);
                }
                else if(value==4)
                {
                    this.setEffectEnabled(true);

                    effectVolume=1;
                    cc.audioEngine.setEffectsVolume(effectVolume);
                    this.slider2.setPercent(effectVolume*100);
                    cc.sys.localStorage.setItem("effectSound",""+effectVolume);
                }

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
    exitClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {

                cc.sys.localStorage.removeItem("wx_account");
                cc.sys.localStorage.removeItem("wx_pwd");
                cc.sys.localStorage.removeItem("headimgurl");
                cc.sys.localStorage.removeItem("name");

                SceneManager.getInstance().changeScene(SCENE_LOGIN,REPLACE_SCENE);

                if(socketMgr.close!=undefined)
                {
                    socketMgr.close();
                }
                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },
    jiesanClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {

                var req=new DismissRequest();
                req.roomId=this.room.roomInfo.roomId;
                req.uid=myPlayerInfo.uid;
                socketMgr.socket.send(DISMISS_REQUEST,req);

                this.removeFromParent(true);
                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },


});
