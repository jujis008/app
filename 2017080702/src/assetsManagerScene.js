

var failCount = 0;

var maxFailCount = 2;   //最大错误重试次数

var checkPath="http://121.43.171.195:8011";
/**

 * 自动更新js和资源

 */

var AssetsManagerLoaderScene = cc.Layer.extend({


    _am:null,

    _percent:0,

    ctor:function(sceneId)
    {
        this._super();

        this.sceneId=sceneId;


        console.log("@@^^^^");

                                               
        if (!cc.sys.isNative) {

            this.loadGame();

            return;

        }

        var size=cc.director.getWinSize();
        var w=cc.view.getVisibleSize().width;
        var h=cc.view.getVisibleSize().height;

        var bgSp=new cc.Sprite("res/ui/login/dt_bg_login.png");
        var bgSize=bgSp.getTextureRect();
        var scl1=w/bgSize.width;
        var scl2=h/bgSize.height;
        var scl=scl1;
        if(scl<scl2)
        {
            scl=scl2;
        }
        bgSp.x=size.width/2;
        bgSp.y=size.height/2;
        bgSp.setScale(scl);
        this.addChild(bgSp);


        var frameSize = cc.view.getFrameSize();
        // cc.view.setFrameSize(frameSize.width,frameSize.height);
        cc.log("####:"+frameSize.width+"  "+frameSize.height);
        // 设置 LsSize 固定值
        var  lsSize = {};
        lsSize.width=1136;
        lsSize.height=640;

        var scaleX =  frameSize.width / lsSize.width;
        var scaleY =  frameSize.height / lsSize.height;
        // 定义 scale 变量
        var scale = 0.0; // MAX(scaleX, scaleY);
        if (scaleX>scaleY) {
            // 如果是 X 方向偏大，那么 scaleX 需要除以一个放大系数，放大系数可以由枞方向获取，
            // 因为此时 FrameSize 和 LsSize 的上下边是重叠的
            scale = scaleX / (frameSize.height /  lsSize.height);
        } else {
            scale = scaleY / (frameSize.width / lsSize.width);
        }

        cc.view.setDesignResolutionSize(1136*scale,
            640*scale, cc.ResolutionPolicy.NO_BORDER);


        this.updateFlg=1;
        var that=this;

        this.downLoadVersion();


    },

    loadGame:function(){

//jsList是jsList.js的变量，记录全部js。


        this.schedule(this.change, 0.1);



    },
    change:function (dt) {

        this.unschedule(this.change);

        var localManifest=null;

        if(this.updateFlg==1)
        {
            localManifest=this._am.getLocalManifest();
            //this.pLabel.setString("下载更新:100%");
        }



        cc.loader.loadJs(["src/jsList.js"], function(){



            cc.loader.loadJs(jsList, function(){

                deleteAndCreatePngDirectory();

                var currentScene=cc.Scene.create();
                var layer = new AppLayer();
                currentScene.addChild(layer);
                cc.director.runScene(currentScene);

                if(this.updateFlg==1)
                {
                    myPlayerInfo.version=localManifest.getVersion();
                }


                SceneManager.getInstance().changeScene(SCENE_LOGIN,RUN_SCENE);



            });





        });

    },
    downLoadVersion:function () {

        var size=cc.director.getWinSize();
        var w=cc.view.getVisibleSize().width;
        var h=cc.view.getVisibleSize().height;

        this.pLabel = new cc.LabelTTF("", "Arial", 30);
        this.pLabel.setColor(cc.color(255,255,255));
        this.pLabel.x=w/2;
        this.pLabel.y=100;
        this.addChild(this.pLabel);

        var storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "./");

        cc.log("storagePath is " + storagePath);

        this._am = new jsb.AssetsManager("res/project.manifest", storagePath);

        this._am.retain();


        this.checkCount=0;

       //if(true)
        if(!this._am.getLocalManifest().isLoaded())//
        {

            cc.log("Fail to update assets, step skipped.");

            this.loadGame();

        }
        else
        {


            var that = this;



            var listener = new jsb.EventListenerAssetsManager(this._am, function(event) {

                switch (event.getEventCode()){

                    case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:

                        cc.log("No local manifest file found, skip assets update.");

                        that.loadGame();

                        break;

                    case jsb.EventAssetsManager.UPDATE_PROGRESSION:

                        that._percent = event.getPercent();
                        var filePercent = event.getPercentByFile();
                        var msg=event.getMessage();

                        //  var localManifest=that._am.getRemoteManifest();
                        // var v=localManifest.getVersion();
                                                              
                        var assetId=event.getAssetId();

                        cc.log(that._percent + "%   filePercent:"+filePercent+"%"+" msg:"+msg+"  assetId:"+assetId);

                        that.pLabel.setString("更新进度:"+parseInt(filePercent)+"%");

                        that.checkCount=0;

                        break;

                    case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:

                    case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:

                        cc.log("Fail to download manifest file, update skipped.");

                        that.loadGame();

                        break;

                    case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:

                        cc.log("ALREADY_UP_TO_DATE.");

                        that.loadGame();

                        break;

                    case jsb.EventAssetsManager.UPDATE_FINISHED:

                        cc.log("Update finished.");

                        that.loadGame();

                        break;

                    case jsb.EventAssetsManager.UPDATE_FAILED:

                        cc.log("Update failed. " + event.getMessage()+" AssetId"+event.getAssetId());

                        failCount++;

                        if (failCount < maxFailCount)

                        {

                            that._am.downloadFailedAssets();

                        }

                        else

                        {

                            cc.log("Reach maximum fail count, exit update process");

                            failCount = 0;

                            that.loadGame();

                        }

                        break;

                    case jsb.EventAssetsManager.ERROR_UPDATING:

                        cc.log("Asset update error: " + event.getAssetId() + ", " + event.getMessage());

                        that.loadGame();

                        break;

                    case jsb.EventAssetsManager.ERROR_DECOMPRESS:

                        cc.log(event.getMessage());

                        that.loadGame();

                        break;

                    default:

                        break;

                }

            });

            cc.eventManager.addListener(listener, 1);

            this._am.update();

           // cc.director.runScene(this);

        }

        this.schedule(this.updateProgress, 0.5);


    },
    sendHttpRequest:function(msgNumber,req,callback)
    {

        var str = JSON.stringify(req);
        var data="msgNumber="+msgNumber+"&json="+str;


        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("POST",checkPath);


        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function () {

            if(xhr.readyState == 4 && xhr.status == 200){

                var response = xhr.responseText;

                try
                {
                    if(callback)
                    {
                        cc.log("http response:"+response);
                        var obj=JSON.parse(response);
                        callback(obj);
                    }
                }
                catch (e)
                {
                    cc.log(e.message);
                }


            }else if(xhr.readyState == 4 && xhr.status != 200){


                try
                {
                    cc.log("http 应答错误:"+xhr.status);
                    if(callback)
                    {
                        callback(null);
                    }
                }
                catch (e)
                {
                    cc.log(e.message);
                }


            }

        };

        xhr.send(data);


    },
    updateProgress:function(dt){

//        this._progress.string = "update" + this._percent + "%";
//
//        if(this.checkCount!=-1&&parseInt(this._percent)<=0)
//        {
//            this.checkCount++;
//            if(this.checkCount>10)
//            {
//                this.checkCount=-1;
//                this.loadGame();
//        
//            }
//        }


    },

    onExit:function(){

        cc.log("AssetsManager::onExit");

        this._am.release();

        this._super();

    }

});
