/**
 * Created by yungu on 16/6/8.
 */
var RUN_SCENE=1;
var REPLACE_SCENE=2;
var PUSH_SCENE=3;
var POP_SCENE=4;

var SCENE_LOGIN=1;
var SCENE_01=2;
var ROOM_SCENE=3;
var PLAY_BACK_SCENE=4;



var SceneManagerClass=cc.Layer.extend({

    currentScene:null,
    sceneStack:[],
    sceneResource:{},
    currentSceneId:0,
    idFlg:0,
    isChangSceneing:false,
    ctor:function()
    {
        this._super();



    },

    resetPreLoadSource:function (sceneId) {


        delete this.sceneResource[sceneId+""];

        cc.LoaderScene.isBar=true;

        switch(sceneId)
        {
            case SCENE_LOGIN:
            {

                if(loginSelectedFlg==1)
                {
                    this.preloadByScene(sceneId,"res/ui/login/checkBox1_login.png");
                    this.preloadByScene(sceneId,"res/ui/login/checkBox2_login.png");
                    this.preloadByScene(sceneId,"res/ui/login/dt_bg_login.png");
                    this.preloadByScene(sceneId,"res/ui/login/login_wx1_login.png");
                    this.preloadByScene(sceneId,"res/ui/login/loginUI.json");
                    this.preloadByScene(sceneId,"res/ui/login/titile_login.png");
                    this.preloadByScene(sceneId,"res/ui/login/tongyiyonghuxieyi.png");


                }
                else{

                    this.preloadByScene(sceneId,"res/ui/login/checkBox1_login.png");
                    this.preloadByScene(sceneId,"res/ui/login/checkBox2_login.png");
                    this.preloadByScene(sceneId,"res/ui/login/dt_bg_login.png");
                    this.preloadByScene(sceneId,"res/ui/login/login_wx1_login.png");
                    this.preloadByScene(sceneId,"res/ui/login/loginUI.json");
                    this.preloadByScene(sceneId,"res/ui/login/titile_login.png");


                    this.preloadByScene(sceneId,"res/ui/comm/icon_start2.png");
                }



            }
                break;

            case SCENE_01:
            {
                this.preloadByScene(sceneId,"res/ui/main/center.json");
                this.preloadByScene(sceneId,"res/ui/main/centerBottom.json");
                this.preloadByScene(sceneId,"res/ui/main/centerTop.json");
                this.preloadByScene(sceneId,"res/ui/main/icon12_main.png");
                this.preloadByScene(sceneId,"res/ui/main/icon15_main.png");
                this.preloadByScene(sceneId,"res/ui/main/icon16_main.png");
                this.preloadByScene(sceneId,"res/ui/main/icon17_main.png");
                this.preloadByScene(sceneId,"res/ui/main/icon18_main.png");
                this.preloadByScene(sceneId,"res/ui/main/icon19_main.png");
                this.preloadByScene(sceneId,"res/ui/main/icon1_main.png");
                this.preloadByScene(sceneId,"res/ui/main/icon20_main.png");
                this.preloadByScene(sceneId,"res/ui/main/icon21_main.png");
                this.preloadByScene(sceneId,"res/ui/main/icon22_main.png");
                this.preloadByScene(sceneId,"res/ui/main/icon23_main.png");
                this.preloadByScene(sceneId,"res/ui/main/icon25_main.png");
                this.preloadByScene(sceneId,"res/ui/main/icon26_main.png");
                this.preloadByScene(sceneId,"res/ui/main/icon2_main.png");
                this.preloadByScene(sceneId,"res/ui/main/icon3_main.png");
                this.preloadByScene(sceneId,"res/ui/main/icon4_main.png");
                this.preloadByScene(sceneId,"res/ui/main/icon5_main.png");
                this.preloadByScene(sceneId,"res/ui/main/icon6_main.png");
                this.preloadByScene(sceneId,"res/ui/main/icon7_main.png");
                this.preloadByScene(sceneId,"res/ui/main/icon8_main.png");
                this.preloadByScene(sceneId,"res/ui/main/rightTop.json");
                this.preloadByScene(sceneId,"res/ui/main/leftTop.json");
                this.preloadByScene(sceneId,"res/ui/main/rightBottom.json");



                this.preloadByScene(sceneId,"res/ui/sub/b_true_sub.png");
                this.preloadByScene(sceneId,"res/ui/sub/beij_bisaibang_sub.png");
                this.preloadByScene(sceneId,"res/ui/sub/btn_sub.png");
                this.preloadByScene(sceneId,"res/ui/sub/checkBox1_sub.png");
                this.preloadByScene(sceneId,"res/ui/sub/checkBox2_sub.png");
                this.preloadByScene(sceneId,"res/ui/sub/chuangjian.json");
                this.preloadByScene(sceneId,"res/ui/sub/close_Sub.png");
                this.preloadByScene(sceneId,"res/ui/sub/commit_greenbtn_sub.png");
                this.preloadByScene(sceneId,"res/ui/sub/day_bg_1_sub.png");
                this.preloadByScene(sceneId,"res/ui/sub/day_bg_sub.png");
                this.preloadByScene(sceneId,"res/ui/sub/diamond_sub.png");
                this.preloadByScene(sceneId,"res/ui/sub/dj_info_bg_sub.png");
                this.preloadByScene(sceneId,"res/ui/sub/dttouxiangbg_sub.png");
                this.preloadByScene(sceneId,"res/ui/sub/faststart_sub.png");
                this.preloadByScene(sceneId,"res/ui/sub/huodezuanshi_guangquan_sub.png");
                this.preloadByScene(sceneId,"res/ui/sub/icon21_sub.png");
                this.preloadByScene(sceneId,"res/ui/sub/quxiao_sub.png");
                this.preloadByScene(sceneId,"res/ui/sub/tip_bg (2).png");
                this.preloadByScene(sceneId,"res/ui/sub/zp_dun.png");


                this.preloadByScene(sceneId,"res/ui/join/join_0.png");
                this.preloadByScene(sceneId,"res/ui/join/join_1.png");
                this.preloadByScene(sceneId,"res/ui/join/join_2.png");
                this.preloadByScene(sceneId,"res/ui/join/join_3.png");
                this.preloadByScene(sceneId,"res/ui/join/join_4.png");
                this.preloadByScene(sceneId,"res/ui/join/join_5.png");
                this.preloadByScene(sceneId,"res/ui/join/join_6.png");
                this.preloadByScene(sceneId,"res/ui/join/join_7.png");
                this.preloadByScene(sceneId,"res/ui/join/join_8.png");
                this.preloadByScene(sceneId,"res/ui/join/join_9.png");
                this.preloadByScene(sceneId,"res/ui/join/join_ar.png");
                this.preloadByScene(sceneId,"res/ui/join/join_bg.png");
                this.preloadByScene(sceneId,"res/ui/join/join_del.png");
                this.preloadByScene(sceneId,"res/ui/join/join_ihujh.png");
                this.preloadByScene(sceneId,"res/ui/join/join_queren.png");
                this.preloadByScene(sceneId,"res/ui/join/join_reset.png");
                this.preloadByScene(sceneId,"res/ui/join/joinLayer.json");
                this.preloadByScene(sceneId,"res/ui/join/wrt.png");


                this.preloadByScene(sceneId,"res/ui/tip/b_true_tip.png");
                this.preloadByScene(sceneId,"res/ui/tip/tipInfo.json");
                this.preloadByScene(sceneId,"res/ui/tip/dj_info_bg_tip.png");





            }
                break;
            case ROOM_SCENE:
            case PLAY_BACK_SCENE:
            {


                this.preloadByScene(sceneId,"res/ui/finish2/a10_finish.png");
                this.preloadByScene(sceneId,"res/ui/finish2/a11_finish.png");
                this.preloadByScene(sceneId,"res/ui/finish2/a12_finish.png");
                this.preloadByScene(sceneId,"res/ui/finish2/a13_finish.png");
                this.preloadByScene(sceneId,"res/ui/finish2/a14_finish.png");
                this.preloadByScene(sceneId,"res/ui/finish2/a15_finish.png");
                this.preloadByScene(sceneId,"res/ui/finish2/a16_finish.png");
                this.preloadByScene(sceneId,"res/ui/finish2/a1_finish.png");
                this.preloadByScene(sceneId,"res/ui/finish2/a2_finish.png");
                this.preloadByScene(sceneId,"res/ui/finish2/a3_finish.png");
                this.preloadByScene(sceneId,"res/ui/finish2/a4_finish.png");
                this.preloadByScene(sceneId,"res/ui/finish2/a5_finish.png");
                this.preloadByScene(sceneId,"res/ui/finish2/a6_finish.png");
                this.preloadByScene(sceneId,"res/ui/finish2/a7_finish.png");
                this.preloadByScene(sceneId,"res/ui/finish2/a8_finish.png");
                this.preloadByScene(sceneId,"res/ui/finish2/a9_finish.png");
                this.preloadByScene(sceneId,"res/ui/finish2/d_1_finish.png");
                this.preloadByScene(sceneId,"res/ui/finish2/dipai_finish.png");
                this.preloadByScene(sceneId,"res/ui/finish2/finish2Layer.json");
                this.preloadByScene(sceneId,"res/ui/finish2/kan_finish.png");
                this.preloadByScene(sceneId,"res/ui/finish2/pao_finish.png");
                this.preloadByScene(sceneId,"res/ui/finish2/peng_finish.png");
                this.preloadByScene(sceneId,"res/ui/finish2/wei_finish.png");
                //

                this.preloadByScene(sceneId,"res/ui/liaotian/ad_liaotian.png");
                this.preloadByScene(sceneId,"res/ui/liaotian/ade_liaotian.png");
                this.preloadByScene(sceneId,"res/ui/liaotian/angry.png");
                this.preloadByScene(sceneId,"res/ui/liaotian/emoji.plist");
                this.preloadByScene(sceneId,"res/ui/liaotian/emoji.png");
                this.preloadByScene(sceneId,"res/ui/liaotian/fennu.png");
                this.preloadByScene(sceneId,"res/ui/liaotian/gfs_liaotian.png");
                this.preloadByScene(sceneId,"res/ui/liaotian/han.png");
                this.preloadByScene(sceneId,"res/ui/liaotian/happy.png");
                this.preloadByScene(sceneId,"res/ui/liaotian/huaixiao.png");
                this.preloadByScene(sceneId,"res/ui/liaotian/jiong.png");
                this.preloadByScene(sceneId,"res/ui/liaotian/liaotianLayer.json");
                this.preloadByScene(sceneId,"res/ui/liaotian/liaotianTip.json");
                this.preloadByScene(sceneId,"res/ui/liaotian/liaotianTip2.json");
                this.preloadByScene(sceneId,"res/ui/liaotian/liaotianTip3.json");
                this.preloadByScene(sceneId,"res/ui/liaotian/lihai.png");
                this.preloadByScene(sceneId,"res/ui/liaotian/qwe_liaotian.png");
                this.preloadByScene(sceneId,"res/ui/liaotian/qwex_liaotian.png");
                this.preloadByScene(sceneId,"res/ui/liaotian/se.png");
                this.preloadByScene(sceneId,"res/ui/liaotian/sfd_liaotian.png");
                this.preloadByScene(sceneId,"res/ui/liaotian/shaoxiang.png");
                this.preloadByScene(sceneId,"res/ui/liaotian/shihua.png");
                this.preloadByScene(sceneId,"res/ui/liaotian/sleep.png");
                this.preloadByScene(sceneId,"res/ui/liaotian/smaile.png");
                this.preloadByScene(sceneId,"res/ui/liaotian/tip_liaotian.png");
                this.preloadByScene(sceneId,"res/ui/liaotian/touxiang.png");
                this.preloadByScene(sceneId,"res/ui/liaotian/yun.png");
                this.preloadByScene(sceneId,"res/ui/liaotian/zhiya.png");



                this.preloadByScene(sceneId,"res/ui/effect/effect1.plist");
                this.preloadByScene(sceneId,"res/ui/effect/effect1.png");


            }
                break;


        }
    },

    changeSceneNextFrame:function (sceneId,actionType) {

        this.nextSceneId=sceneId;
        this.nextActionType=actionType;
        this.scheduleOnce(this.nextScene, 0.1);
    },
    nextScene:function (dt) {

        this.changeScene(this.nextSceneId,this.nextActionType);

    },
    createLayer:function (sceneId) {

        var layer=null;
        switch(sceneId)
        {
            case SCENE_LOGIN:
            {
                 layer= new Login(sceneId);

            }
                break;
            case SCENE_01:
            {

                layer= new Scene01(sceneId);
            }
                break;
            case ROOM_SCENE:
            {
                if(UI_TYPE==0)
                {
                    layer= new RoomScene(sceneId);
                }
                else if(UI_TYPE==1)
                {
                    layer= new RoomSceneFuCheng(sceneId);
                }

            }
                break;
        
            case PLAY_BACK_SCENE:
            {
                layer= new PlayBackScene(sceneId);
            }
                break;

        }

        return layer;
    },
    changeScene:function (sceneId,actionType) {


        // if(this.currentSceneId===sceneId)
        // {
        //
        //     return;
        // }

        if(this.currentScene!=undefined&&this.currentScene!=null)
        {
            //cc.director.pause();
            // cc.Scheduler.unscheduleAll();
            this.currentScene.removeFromParent(true);
            this.currentScene=null;
        }

        this.isChangSceneing=true;

       // if(loginSelectedFlg==0||(loginSelectedFlg==1&&sceneId==SCENE_LOGIN))
       // {



            this.clearSceneResource(this.currentSceneId);
           

            this.resetPreLoadSource(sceneId);
            var arrayObj=this.sceneResource[sceneId+""];
            if(arrayObj!=undefined)
            {

                var count=arrayObj.length;
                var preLoadSource=[];
                for(var i=0;i<count;i++)
                {
                    var obj=arrayObj[i];
                    var value=obj.name;
                    preLoadSource.push(value);
                }

            }



            if(loginSelectedFlg==1)
            {

                var that=this;

                cc.LoaderScene.preload(preLoadSource, function () {

                    cc.log("###################preload");
                    for(var i=0;i<count;i++)
                    {
                        var obj=arrayObj[i];
                        var value=obj.name;
                        if(obj.type=="plist")
                        {
                            cc.spriteFrameCache.addSpriteFrames(value);
                        }
                    }


                    Service.getInstance().clear();


                    // var scene=cc.Scene.create();
                    // var layer = new AppLayer();
                    // scene.addChild(layer);
                    // cc.director.runScene(scene);
                    //this.app=layer;

                    that.currentScene=that.createLayer(sceneId);
                    that.currentScene.app=that.app;
                    that.app.addChild( that.currentScene);



                    that.currentSceneId=sceneId;
                    that.isChangSceneing=false;

                }.bind(this));

            }
            else{

                Service.getInstance().clear();


                this.currentScene=this.createLayer(sceneId);
                this.currentScene.app=this.app;
                this.app.addChild( this.currentScene);


                this.currentSceneId=sceneId;
                this.isChangSceneing=false;
            }


       //  }
       // else{
       //
       //
       //      this.currentScene=this.createLayer(sceneId);
       //      this.app.addChild( this.currentScene);
       //
       //      this.currentSceneId=sceneId;
       //      this.isChangSceneing=false;
       //  }



    },
    

    preloadByScene:function (sceneId,source) {

        var list=source.split(".");
        var fix=list[list.length-1];


        var arrayObj=this.sceneResource[sceneId+""];
        if(arrayObj==undefined)
        {
            arrayObj=[];
            this.sceneResource[sceneId+""]=arrayObj;
        }
        var len=arrayObj.length;
        for(var i=0;i<len;i++)
        {
            var rObj=arrayObj[i];
            if(rObj.type==fix&&rObj.name==source)
            {
                return;
            }

        }
        var rObj={};
        rObj.type=fix;
        rObj.name=source;
        arrayObj.push(rObj);

        if(loginSelectedFlg==0)
        {
            cc.log("加载:"+source);
            if(fix=="plist")
            {
                cc.spriteFrameCache.addSpriteFrames(source);
            }
            else if(fix=="png"||fix=="jpg")
            {
                cc.textureCache.addImage(source);
            }
        }

    },

    clearSceneResource:function(sceneId)
    {
        //myLogPrint();

        var arrayObj=this.sceneResource[sceneId+""];
        if(arrayObj==undefined)
        {
            return;
        }
        var len=arrayObj.length;
      //  myLog("sceneId======:"+sceneId+" "+len);
        for(var i=0;i<len;i++)
        {
            var rObj=arrayObj[i];
            if(rObj.type=="png"||rObj.type=="jpg")
            {
                if(codeFlg==2)
                {
                    cc.textureCache.removeTextureForKey2(rObj.name);
                }
                else{
                    cc.textureCache.removeTextureForKey(rObj.name);
                }


                //myLog("delete======:"+rObj.name);
            }
            else if(rObj.type=="plist")
            {
                cc.spriteFrameCache.removeSpriteFramesFromFile(rObj.name);
                var pngName=rObj.name.replace(".plist",".png");
                if(codeFlg==2)
                {
                    cc.textureCache.removeTextureForKey2(pngName);
                }
                else{
                    cc.textureCache.removeTextureForKey(pngName);
                }

              //  myLog("移除:"+rObj.name+"  "+pngName);
            }

        }
        delete this.sceneResource[sceneId+""];



       // myLogPrint();

    },
    setAppScene:function (app) {

        this.app=app;
    },

});


var SceneManager=(function()
{
    var unique;
    function getInstance()
    {
        return unique || ( unique = new SceneManagerClass() );

    }
    return {
        getInstance : getInstance

    }
})();