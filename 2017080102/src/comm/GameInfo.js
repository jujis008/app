
var RUN_PLATFORM=1;//1:android ios,2:pc web,3:微信web
var LEFT_BOTTOM=0;
var CENTER_BOTTOM=1;
var RIGHT_BOTTOM=2;
var RIGHT_CENTER=3;
var RIGHT_TOP=4;
var CENTER_TOP=5;
var LEFT_TOP=6;
var LEFT_CENTER=7;
var CENTER=8;

var versionOnMobile=1.0;
var loginSelectedFlg=0;//0:代表android ios安装包,1:浏览器
var codeFlg=1;//1:native,2:webview
var isWeiXin=1;//微信登录


var UI_TYPE=1;//0:皮皮风格,1:福成棋牌

var CARD_TYPE=1;//0:旧，1：皮皮,2:扑克


var my_room_name="room_fucheng";
var cardPath="room_fucheng";

if(CARD_TYPE==0)
{
    cardPath="room_fucheng/card2";
}
else if(CARD_TYPE==2)
{
    cardPath="room_fucheng/puke";
}



var BUILD_TIME="V1.0";//V1.0 Build41

var lastGameDt=0;

var share_card_num=10;





//var HTTP_IP="119.23.68.107";
var HTTP_IP="remote.hulihuyu.com";



var urlHttpServerPath="http://"+HTTP_IP+":8011";



var downLoadSpxUrl="";
var downLoadPlayUrl="";
var uploadUrl="";

var APP_NICK_NAME="小小跑胡子";

var head_scale=0.52;
var head_scale2=0.69;
var head_org_w=132;

var serviceInstance=null;
var register={};


var changeHead=function (headSp,type) {

    var r=headSp.getTextureRect();

    if(type==1)
    {
        var a=68.64/r.width;
        headSp.setScale(a);

    }
    else if(type==2)
    {
        var a=91.08/r.width;
        headSp.setScale(a);
    }
    else if(type==3)
    {
        var a=58/r.width;
        headSp.setScale(a);
    }


}
// var loginSelectedFlg=1;//0:代表android ios安装包,1:浏览器
var socketMgr={};
socketMgr.socket=null;

var pointDistance=function (pos1,pos2) {

    var x=pos1.x-pos2.x;
    var y=pos1.y-pos2.y;

    return Math.sqrt(x*x+y*y);
}
var myPlayerInfo={};

var FONT_NAME_APP="Arial";

var SHELL_SUB_MONEY=10;

var DELETE_OBJ_BY_KEYS=function (array,keys) {

    for(var i=0;i<keys.length;i++)
    {
        delete array[keys[i]];
    }


};

var vb=new VisibleRect();
vb.init();
var visibleRect=vb.getVisibleRect();
var v_x=visibleRect.x;
var v_y=visibleRect.y;
var v_w=visibleRect.width;
var v_h=visibleRect.height;


var parseUI=function (path,typePos) {

    cc.log("pareseUI:"+path);
    var leftBottom = ccs.load(path);
    var node=leftBottom.node;
    var p={};
    switch(typePos)
    {
        case LEFT_BOTTOM:
        {
            p=vb.leftBottomPos();

        }
            break;
        case CENTER_BOTTOM:
        {
            p=vb.bottomPos();
        }
            break;
        case RIGHT_BOTTOM:
        {
            p=vb.rightBottomPos();
        }
            break;
        case RIGHT_CENTER:
        {
            p=vb.rightPos();

        }
            break;
        case RIGHT_TOP:
        {
            p=vb.rightTopPos();
        }
            break;
        case CENTER_TOP:
        {
            p=vb.topPos();
        }
            break;
        case LEFT_TOP:
        {
            p=vb.leftTopPos();
        }
            break;
        case LEFT_CENTER:
        {
            p=vb.leftPos();
        }
            break;
        case CENTER:
        {
            p=vb.centerPos();
        }
            break;

    }

    node.x=p.x;
    node.y=p.y;
    return node;

}


var GAME_NONE=0;
var GAME_PLAYING_IN_ROOM=10;
var gameState=GAME_NONE;//



var PointToSegDist=function( x,  y,  x1,  y1,  x2,  y2)
{
    var cross = (x2 - x1) * (x - x1) + (y2 - y1) * (y - y1);

    if (cross <= 0) return Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1));


    return 999999;

};


var finishState=0;
var debugTime=null;

var resetDebugTime=function()
{
    var myData = new Date();
    debugTime = myData;

};
var logDebugTime=function (tag) {

    var myData = new Date();
    cc.log("[("+tag+")+代码块执行时间:"+(myData.getTime()-debugTime.getTime())+"]");
    debugTime=myData;
};

function cpp_callback(a, b) {
    cc.log("cpp return two integer: " + a + " " + b);
}

var appLayer=null;



var weixinLogin=function () {
    if(loginSelectedFlg==0)
    {
        if(cc.sys.os == cc.sys.OS_ANDROID){
            myPlayerInfo.wxstate=1;
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "login", "(Ljava/lang/String;Ljava/lang/String;)V", "", "");

        }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){
            myPlayerInfo.wxstate=2;
            jsb.reflection.callStaticMethod("AppController","login:b:","1","0");
        }

    }

}

var wxCallBack=function (wxKey,wxState,wxValue) {

    cc.log("微信返回,wxKey:"+wxKey+",wxState:"+wxState+",value:"+wxValue);
    if(wxState=="0")
    {
        if(wxKey=="login")
        {
            var obj={};
            obj.code=wxValue;
            EventManager.getInstance().fireEvent("wx_get_code_event",obj);
        }
        else{
            var obj={};
            EventManager.getInstance().fireEvent("share_callback_event",obj);
        }
    }
    else{
        if(wxKey=="login")
        {
            // var obj={};
            // obj.txt="微信登录错误,state:"+wxState;
            // EventManager.getInstance().fireEvent("TIP_INFO_EVENT",obj);


            var obj2={};
            obj2.code="";
            EventManager.getInstance().fireEvent("wx_get_code_event",obj2);


            // var obj={};
            // obj.txt="微信登录失败!";
            // EventManager.getInstance().fireEvent("TIP_INFO_EVENT",obj);
        }
        else{
            // var obj={};
            // obj.txt="分享失败!";
            // EventManager.getInstance().fireEvent("TIP_INFO_EVENT",obj);

            var obj={};
            EventManager.getInstance().fireEvent("share_callback_event",obj);

        }

    }



}

var shareUrl="http://www.hulihuyu.com";


var weixinShareWithTitle=function (shareType,txt,title)
{

    if(loginSelectedFlg==0)
    {

        if(isWeiXin==0)
        {

            var obj={};
            obj.txt="暂未开放";
            EventManager.getInstance().fireEvent("TIP_INFO_EVENT",obj);


            return;
        }
        if(cc.sys.os == cc.sys.OS_ANDROID){


            var title=title;//encodeURI();
            var txt=txt;//encodeURI();
            var url=shareUrl;
            var shareType=shareType;
            var imgPath="";
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "share", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", url,title,txt,shareType,imgPath);

        }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){

            var title=title;//encodeURI();
            var txt=txt;
            var url=shareUrl;
            var shareType=shareType;
            var imgPath="";

            jsb.reflection.callStaticMethod("AppController","share:txt:url:shareType:imgPath:",title,txt,url,shareType,imgPath);

        }

    }
}
var weixinShare=function (shareType,txt) {//0 = 好友列表 1 = 朋友圈 2 = 收藏

    weixinShareWithTitle(shareType,txt,APP_NICK_NAME);
}


var weixinShare2=function (shareType,imgPath) {//0 = 好友列表 1 = 朋友圈 2 = 收藏

   // cc.log("微信share2");
    if(loginSelectedFlg==0)
    {
        if(isWeiXin==0)
        {

            var obj={};
            obj.txt="暂未开放";
            EventManager.getInstance().fireEvent("TIP_INFO_EVENT",obj);

            return;
        }

        if(cc.sys.os == cc.sys.OS_ANDROID){


            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "share2", "(Ljava/lang/String;Ljava/lang/String;)V",shareType,imgPath);

        }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){


            jsb.reflection.callStaticMethod("AppController","share2:imgPath:",shareType,imgPath);

        }

    }

}

var pay=function (token) {

    if(cc.sys.os == cc.sys.OS_ANDROID){

        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "pay", "(Ljava/lang/String;)V", token);

    }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){

        // jsb.reflection.callStaticMethod("AppController","login:b:","1","0");
    }

}


var APP_ID="wxe495b8b369ea1e4c";
var APP_SECRET="a3f7fcef60a40770f7bcbe116ed235be";



var logCache="";

String.prototype.startWith=function(str){
    if(str==null||str==""||this.length==0||str.length>this.length)
        return false;
    if(this.substr(0,str.length)==str)
        return true;
    else
        return false;
    return true;
}

var musicVolume=1;
var effectVolume=1;

function playBgMusic(type)
{

    //if(myPlayerInfo.playSound==1)
    {
        if(type==1)
        {
            cc.audioEngine.playMusic("res/sound/bgmusic.mp3",true)
            cc.audioEngine.setMusicVolume(musicVolume);
        }
        else{
            if(gameState!=GAME_PLAYING_IN_ROOM)
            {
                cc.audioEngine.playMusic("res/sound/roommusic.mp3",true)
                cc.audioEngine.setMusicVolume(musicVolume);
            }

        }
    }


}


var TOUCH_SOUND="touch.mp3";
var TIME_SOUND="timeup_alarm.mp3";

function playEffect(path) {

    cc.log("播放音效:"+path);
    cc.audioEngine.playEffect("res/sound/"+path,false)
    cc.audioEngine.setEffectsVolume(effectVolume);
}
var effectId=null;

function playEffect2(path) {

    if(effectId!=0)
    {
        return;
    }
    effectId=cc.audioEngine.playEffect("res/sound/"+path,true)
    cc.audioEngine.setEffectsVolume(effectVolume);
}

function stopBgMusic()
{
    cc.audioEngine.stopMusic(false);
}
function stopEffect()
{
    cc.audioEngine.stopEffect(effectId);
    effectId=0;
}


var loginState=0;



function loginFailCallBack() {



}


function  shareFailCallBack() {


}

function payCallBackMethod(state) {

    cc.log("==========######");

    var obj={};
    obj.state=state;
    EventManager.getInstance().fireEvent("pay_back_event",obj);

}
var isRecodError=0;

function  startRecord() {

    if(loginSelectedFlg==0)
    {
        isRecodError=0;

        var path=jsb.fileUtils.getWritablePath()+"abc.spx";
        cc.log("dt:::path:::::%%%%%%%%%%%%%"+path);
        if(cc.sys.os == cc.sys.OS_ANDROID){

            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "startRecord", "(Ljava/lang/String;)V",path);

        }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){

            jsb.reflection.callStaticMethod("AppController","startRecord:",path);
        }
    }

}


function  stopRecord() {

    if(loginSelectedFlg==0)
    {
        cc.log("dt:::path:::::%%%%%%%%%%%%%stop");
        if(cc.sys.os == cc.sys.OS_ANDROID){

            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "stopRecord", "()V");

        }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){

            jsb.reflection.callStaticMethod("AppController","stopRecord");
        }
    }

}

function uploadSpx(name,uid) {

    if(loginSelectedFlg==0)
    {
        var path=jsb.fileUtils.getWritablePath()+"abc.spx";
        //sb.Upload.shareInstance().UpLoadOggFile(path,uploadUrl,name,uid);
        uploadFile(path,name,uid,"upload","abc.spx","0");
    }
}

function uploadFile(path,name,uid,filedName,fileName,type) {

    if(loginSelectedFlg==0)
    {
        sb.Upload.shareInstance().UpLoadFileToServer(path,uploadUrl,name,uid,filedName,fileName,type);
    }
}
var isPlayStoped=0;
function  playRecord() {

    if(loginSelectedFlg==0)
    {
        isPlayStoped=0;
       
        var path=jsb.fileUtils.getWritablePath()+"downLoad.spx";

        if(cc.sys.os == cc.sys.OS_ANDROID){

            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "playRecord", "(Ljava/lang/String;)V",path);

        }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){

            jsb.reflection.callStaticMethod("AppController","playRecord:",path);
        }
    }

}

function  stopPlay() {

    if(loginSelectedFlg==0)
    {

        if(cc.sys.os == cc.sys.OS_ANDROID){

           // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "playRecord", "(Ljava/lang/String;)V",path);

        }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){

            jsb.reflection.callStaticMethod("AppController","stopPlay");
        }
    }

}

function notifyMessage(msg) {

    cc.log("============notify message:"+msg);
    var list=msg.split("@");
    var type=list[0];

    if(type==1)
    {
        playStoped();
    }
    else if(type==2)
    {
        recordError();
    }

}

function playStoped() {

    cc.log("play_stoped_eventplay_stoped_event");
  //  var obj={};
  //  EventManager.getInstance().fireEvent("play_stoped_event",obj);
    isPlayStoped=1;
}

function recordError() {
    cc.log("录制语音失败");
    isRecodError=-1;
   // var obj={};
    //EventManager.getInstance().fireEvent("record_error_event",obj);
}
function downLoadSpx(fileName) {

    if(loginSelectedFlg==0)
    {
        pushDownLoadQueue("downLoad.spx",1,downLoadSpxUrl+"/"+fileName);
    }
}

function checkDownLoadState() {

    if(loginSelectedFlg==0)
    {
        return sb.Upload.shareInstance().getDownLoadState();
    }
}
function resetDownLoadState() {

    if(loginSelectedFlg==0)
    {
       sb.Upload.shareInstance().resetDownLoadState();
    }
}
function getFix(file_name){
    //var result =/\.[^\.]+/.exec(file_name);

    var index=file_name.lastIndexOf(".");
    var result=file_name.substring(index,file_name.length);

    return result;
}

function checkFileExit(path) {
    if(loginSelectedFlg==0)
    {
        return jsb.fileUtils.isFileExist(path);
    }
    else{
        return false;
    }

}
function photoCallBack(path) {

   // cc.log("#####photoCallBack:"+path);
    if(jsb.fileUtils.isFileExist(path))
    {
        var filePath=[];
        if(cc.sys.os == cc.sys.OS_ANDROID){

            filePath=path.split("/");
        }
        else{
            filePath=path.split("\\");
        }
        cc.log("######filePath:"+filePath.length);
        if(filePath.length>0)
        {
            var fileName=filePath[filePath.length-1];
            var fix=getFix(fileName);
            cc.log("##########:"+fileName+"  "+fix);
            if(cc.sys.os == cc.sys.OS_ANDROID){

                if(fix==".png")
                {
                    var newPath=jsb.fileUtils.getWritablePath()+"abc.png";
                    //裁剪成圆形上传
                    cutPhoto(path,"150",newPath);
                    uploadFile(newPath,myPlayerInfo.name,myPlayerInfo.uid,"upload",fileName,"1");
                }
                else{
                    var obj={};
                    obj.txt=error_7;
                    EventManager.getInstance().fireEvent("TIP_INFO_EVENT",obj);
                }
            }
            else{
                if(fix==".png")
                {
                    var newPath=jsb.fileUtils.getWritablePath()+"abc.png";
                    //裁剪成圆形上传
                    cutPhoto(path,"150",newPath);
                    uploadFile(newPath,myPlayerInfo.name,myPlayerInfo.uid,"upload",fileName,"1");
                }
                else{
                    var obj={};
                    obj.txt=error_7;
                    EventManager.getInstance().fireEvent("TIP_INFO_EVENT",obj);
                }
            }


        }

    }
    else{
        cc.log("文件不存在:"+path);
    }

}
function showPhoto() {
    if(cc.sys.os == cc.sys.OS_ANDROID){

         jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showPhoto","()V");

    }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){

        jsb.reflection.callStaticMethod("AppController","showPhoto");
    }

}
function cutPhoto(filePath,r,newPath) {

    if(cc.sys.os == cc.sys.OS_ANDROID){

         jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "cutPhoto", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",filePath,r,newPath);

    }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){

        jsb.reflection.callStaticMethod("AppController","cutPhoto:r:savePath:",filePath,r,newPath);
    }
}
function savePhotoSuccess() {

   // cc.log("##############"+filePath);
}
var nextDown=true;

function downLoadFinished(path) {

    cc.log("downLoadFinished  path:"+path);
    // for(var key in hasDownLoadingQueue)
    // {
    //     var downObj=hasDownLoadingQueue[key];
    //     if(downObj.path==path)
    //     {
    //         //cc.log("downLoadFinished2  path:"+path);
    //         delete hasDownLoadingQueue[key];
    //         break;
    //     }
    // }

    var p=path.split("@#");
    var obj={};
    obj.path=p[0];
    obj.savePath=p[1];
    EventManager.getInstance().fireEvent("DOWN_LOAD_FINISHED_EVENT",obj);
    nextDown=true;

}
// function  checkSkinPngExit(skin) {
//     if(hasDownLaod(skin))
//     {
//         return;
//     }
//     var filePath=getSkinPath(skin);
//     if(!jsb.fileUtils.isFileExist(filePath))
//     {
//         pushDownLoadQueue(skin,2);
//         return false;
//     }
//
//     return true;
// }
function deleteAndCreatePngDirectory() {

    if(loginSelectedFlg==0)
    {
        var path=jsb.fileUtils.getWritablePath()+"png/";
        if(jsb.fileUtils.isDirectoryExist(path))
        {
            jsb.fileUtils.removeDirectory(path);
            jsb.fileUtils.createDirectory(path);

        }
        else{
            jsb.fileUtils.createDirectory(path);
        }
    }


}
function getSkinPath(skin) {

    if(loginSelectedFlg==0)
    {
        return jsb.fileUtils.getWritablePath()+"png/"+skin;
    }
    else{
        return skin;
    }
}
function downLoad(urlPath,savePath) {

    if(loginSelectedFlg==0)
    {
        cc.log("downLoad  urlPath:"+urlPath);
        if(cc.sys.os == cc.sys.OS_ANDROID){

            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "downLoadFile", "(Ljava/lang/String;Ljava/lang/String;)V",urlPath,savePath);

        }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){

            jsb.reflection.callStaticMethod("AppController","downLoad:savePath:",urlPath,savePath);
        }
    }
    else{

    }

}
function downLoadSize(size) {

    var arr=size.split("@");
    var count=parseInt(arr[0]);
    var maxCount=parseInt(arr[1]);
    var obj={};
    obj.count=count;
    obj.maxCount=maxCount;

    EventManager.getInstance().fireEvent("DOWN_LOAD_SIZE_EVENT",obj);
}
function copyString(str) {

    if(cc.sys.os == cc.sys.OS_ANDROID){

        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "copyString", "(Ljava/lang/String;)V",str);

    }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){

        jsb.reflection.callStaticMethod("AppController","copyString:",str);
    }
}

var deviceId="";
function  setDeviceId(devId) {
    deviceId=devId;
}
var localIp="";
function setIp(ip) {
    localIp=ip;
    cc.log("[用户Ip:"+ip+"]");
}
 var locationStr="";
function setLocation(str) {


    locationStr=decodeURI(str);

    cc.log("[地理坐标:"+locationStr+"]");

}
function getLocation() {

    if(loginSelectedFlg==0)
    {

        if(cc.sys.os == cc.sys.OS_ANDROID){

            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getLocation","()V");

        }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){

            jsb.reflection.callStaticMethod("AppController","getLocation");
        }
    }
}
function  getDeviceId() {

    if(loginSelectedFlg==0)
    {

        if(cc.sys.os == cc.sys.OS_ANDROID){

            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getDeviceId","()V");

        }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){

            jsb.reflection.callStaticMethod("AppController","getDeviceId");
        }
    }
    else{

        return Math.random()*10000000;
    }

}
function  getLocalIp() {

    if(loginSelectedFlg==0)
    {

        if(cc.sys.os == cc.sys.OS_ANDROID){

            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getIp","()V");

        }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){

            jsb.reflection.callStaticMethod("AppController","getIp");
        }
    }


}
var downLoadQueue=[];
var hasDownLoadingQueue={};
function pushDownLoadQueue(saveName,type,urlPath) {
    var obj={};
    if(type==1)//语音
    {
        obj.path=urlPath;
        obj.savePath=jsb.fileUtils.getWritablePath()+saveName;

    }
    else if(type==2)//图片
    {
        obj.path=urlPath;
        obj.savePath=getSkinPath(saveName);
    }
    else if(type==3){
        obj.path=urlPath;
        obj.savePath=getSkinPath(saveName);
    }
    //hasDownLoadingQueue[saveName]=obj;

    downLoadQueue.push(obj);
}

// function hasDownLaod(fileName) {
//
//     if(hasDownLoadingQueue[fileName]!=undefined)
//     {
//         return true;
//     }
//     return false;
//
// }

function captureScreen() {

    var r=new Date().getTime();
    var savePath=jsb.fileUtils.getWritablePath()+"screen_"+r+".png";
   //jsb.fileUtils.removeFile(savePath);

    if(cc.sys.os == cc.sys.OS_ANDROID){

        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "captureImage","(Ljava/lang/String;)V",savePath);

    }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){

        jsb.reflection.callStaticMethod("AppController","captureImage:",savePath);

    }
    return savePath;
}
function captureFinished(path) {

    cc.log("captureFinished#########:"+path);

    var obj={};
    obj.path=path;
    EventManager.getInstance().fireEvent("CAPATURE_FINISHED_EVENT",obj);



    // if(cc.sys.os == cc.sys.OS_ANDROID){
    //
    //     jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "savePngToPhoto","(Ljava/lang/String;Ljava/lang/String;)V",path,"刷脸大作战");
    //
    // }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){
    //
    //     jsb.reflection.callStaticMethod("AppController","savePngToPhoto:",path);

   //}

}
function savePhotoSuccess() {



    // if(cc.sys.os == cc.sys.OS_ANDROID){
    //
    //
    // }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){
    //
    //     // var obj={};
    //     // obj.txt="截屏成功保存到相册";
    //     // EventManager.getInstance().fireEvent("TIP_INFO_EVENT",obj);
    //
    //     var obj={};
    //     EventManager.getInstance().fireEvent("CAPATURE_FINISHED_EVENT",obj);
    //
    // }

}
function savePhotoFail() {
    var obj={};
    obj.txt="截屏保存相册失败";
    EventManager.getInstance().fireEvent("TIP_INFO_EVENT",obj);
}

var msgDefault=[
    {"txt":"快点 快点，么打酱油撒!","n":"cs_sound_bq_n_kun1.mp3","v":"cs_sound_bq_v_kun1.mp3"},
    {"txt":"想啥了出牌了!","n":"cs_sound_bq_n_ku2.mp3","v":"cs_sound_bq_v_ku2.mp3"},
    {"txt":"咋比乌龟还慢了!","n":"cs_sound_bq_n_kun3.mp3","v":"cs_sound_bq_v_kun3.mp3"},
    {"txt":"哈哈手气真好!","n":"cs_sound_bq_n_mi0.mp3","v":"cs_sound_bq_v_mi0.mp3"},
    {"txt":"今天真高兴!","n":"cs_sound_bq_n_mi1.mp3","v":"cs_sound_bq_v_mi1.mp3"},
    {"txt":"今天真的背!","n":"cs_sound_bq_n_ku0.mp3","v":"cs_sound_bq_v_ku0.mp3"},
    {"txt":"我的个娘!","n":"cs_sound_bq_n_ku1.mp3","v":"cs_sound_bq_v_ku1.mp3"},
    {"txt":"这个牌打的好!","n":"cs_sound_bq_n_zan3.mp3","v":"cs_sound_bq_v_zan3.mp3"},
    {"txt":"我可以不笑嘛,哈哈!","n":"cs_sound_bq_n_mi3.mp3","v":"cs_sound_bq_v_mi3.mp3"},
    {"txt":"你不懂我的心!","n":"cs_sound_bq_n_xia2.mp3","v":"cs_sound_bq_v_xia2.mp3"},
    {"txt":"你太牛了!","n":"cs_sound_bq_n_zan1.mp3","v":"cs_sound_bq_v_zan1.mp3"},
    {"txt":"气死我了!","n":"cs_sound_bq_n_shengqi1.mp3","v":"cs_sound_bq_v_shengqi1.mp3"},
    {"txt":"无语!","n":"cs_sound_bq_n_xia3.mp3","v":"cs_sound_bq_v_xia3.mp3"},
    {"txt":"给你点个赞!","n":"cs_sound_bq_n_zan0.mp3","v":"cs_sound_bq_v_zan0.mp3"},
    {"txt":"又断线了网络这么差!","n":"fix_msg_2.mp3","v":"fix_msg_2.mp3"}

];

var effectSound={
    "xianhua4":{"n":"gx_n_xianhua4.mp3","v":"gx_v_xianhua4.mp3"},
    "xianhua2":{"n":"gx_n_xianhua2.mp3","v":"gx_v_xianhua2.mp3"},
    "moHu":{"n":"gx_n_moHu.mp3","v":"gx_v_moHu.mp3"},
    "moHu_1":{"n":"gx_n_moHu_1.mp3","v":"gx_n_moHu_1.mp3"},
}

var operSound={
    "chi":{"n":"opr/n_chi.mp3","v":"opr/v_chi.mp3"},
    "hu":{"n":"opr/n_hu.mp3","v":"opr/v_hu.mp3"},
    "peng":{"n":"opr/n_peng.mp3","v":"opr/v_peng.mp3"},
    "ti":{"n":"opr/n_ti.mp3","v":"opr/v_ti.mp3"},
    "wei":{"n":"opr/n_wei.mp3","v":"opr/v_wei.mp3"},
    "pao":{"n":"opr/n_pao.mp3","v":"opr/v_pao.mp3"},
    "bi":{"n":"opr/n_bi.mp3","v":"opr/v_bi.mp3"},
    "qing":{"n":"opr/n_qing.mp3","v":"opr/v_qing.mp3"},
    "xiahu":{"n":"opr/n_xiahuo.mp3","v":"opr/v_xiahuo.mp3"},
    "zimo":{"n":"opr/n_mohu.mp3","v":"opr/v_mohu.mp3"},
    "danshen":{"n":"opr/A_DANSHEN.mp3","v":"opr/A_DANSHEN.mp3"},
    "shuangshen":{"n":"opr/A_SHUANGSHEN.mp3","v":"opr/A_SHUANGSHEN.mp3"},
    "meishen":{"n":"opr/A_MEISHEN.mp3","v":"opr/A_MEISHEN.mp3"},
    "youshen":{"n":"opr/A_YOUSHEN.mp3","v":"opr/A_YOUSHEN.mp3"},
    "sishou":{"n":"opr/A_SISHOU.mp3","v":"opr/A_SISHOU.mp3"},
}
function exitApp() {

    if(socketMgr.close!=undefined)
    {
        socketMgr.close();
    }

    if(cc.sys.os == cc.sys.OS_ANDROID){

        cc.director.end();

    }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){


        jsb.reflection.callStaticMethod("AppController","exitApp");
    }




}
var power=100;

function  getPower() {

    if(cc.sys.os == cc.sys.OS_ANDROID){

        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getLeftPower","()V");

    }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){

        jsb.reflection.callStaticMethod("AppController","getLeftPower");

    }

}
function powerCallBack(val) {

   // cc.log("电量剩余:"+val);
    power=parseFloat(val);

}

var wifi_type="";
var wifi_strong=0;


function  getNetWorkType() {

    if(cc.sys.os == cc.sys.OS_ANDROID){

        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getNetworkType","()V");

    }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){

        jsb.reflection.callStaticMethod("AppController","getNetworkType");

    }

}

function  getWifiSignal() {

    if(cc.sys.os == cc.sys.OS_ANDROID){

        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getSignalStrength","()V");

    }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){

        jsb.reflection.callStaticMethod("AppController","getSignalStrength");

    }

}

var lastWifi_type="";

function wifiTypeCallBack(val) {

    //cc.log("wifiTypeCallBack:"+val);
    wifi_type=val;

}
function signalCallBack(val) {

    cc.log("signalCallBack:"+val);
    wifi_strong=parseInt(val);
}
var NO_WAIT_TIME_OUT=1;


function  checkRecAvailable() {

    if(cc.sys.os == cc.sys.OS_ANDROID){

        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "checkRecAvailable","()V");

    }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){

        jsb.reflection.callStaticMethod("AppController","checkRecAvailable");

    }

}

function setGoodsId(goodsId) {

    if(cc.sys.os == cc.sys.OS_ANDROID){

        //jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "checkRecAvailable","()V");

    }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){

        jsb.reflection.callStaticMethod("AppController","setGoodsId:",goodsId);

    }

}
function buyGood(goodId) {

    if(cc.sys.os == cc.sys.OS_ANDROID){

        //jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "checkRecAvailable","()V");

    }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){

        jsb.reflection.callStaticMethod("AppController","buyGood:",goodId);

    }

}


function onPayError(proIdentifier) {

    console.log("GameInfo: onPayError " + proIdentifier);
    var obj={};
    obj.state=-1;
    obj.value=proIdentifier;
    EventManager.getInstance().fireEvent("PAY_BACK_EVENT",obj);

}

function onPayFinished(receipt) {
    var obj={};
    obj.state=0;
    obj.value=receipt;
    EventManager.getInstance().fireEvent("PAY_BACK_EVENT",obj);

}

var goodsArr=[];

function isRecAvailable(isCanRec)
{
    if(isCanRec=="1")
    {

    }
    else{

    }

}

var rule_info=[

];

// var obj1={"title":"邵阳剥皮","des":"10胡起胡,胡牌必须胡墩上示众后的牌，不能胡任何人提或偎的牌，满百结束，有天胡、地胡、自摸三种名堂。",
//     "renshu":{"list":[3,4],"defaultIndex":0},"jushu":{"list":[4,8,10,20,100],"defaultIndex":0},
//     "guize":{"list":[1,3,5],"defaultIndex":0}
// }

var SHOW_RULE_LAYER=1;
var RULE_VALUE=0;

//1:剥皮,2:红胡147,3:郴州字牌
var ROOM_TYPE_BOPI=1;
var ROOM_TYPE_HONGHU_147=2;
var ROOM_TYPE_BINZHOU=3;
var ROOM_TYPE_WAIHUZI=4;
//var ROOM_TYPE_PENGHUZI=5;
var ROOM_TYPE_PAODEKUAI=6;
var ROOM_TYPE_LUZHOU_DAER=7;
var ROOM_TYPE_GAOHUZI=8;
var ROOM_TYPE_BINZHOU_YONGXING=9;
var ROOM_TYPE_LOUDI=10;
var ROOM_TYPE_SHUANGFENG=11;
var ROOM_TYPE_LEIYANG=12;
var ROOM_TYPE_HENGYANG=13;
var ROOM_TYPE_GUILIN=14;
var ROOM_TYPE_HUAIHUA=15;
var ROOM_TYPE_HONGHEIHU=16;
var ROOM_TYPE_PENGHUZI=17;
var ROOM_TYPE_DAZIPAI=18;

var obj1={"Id":ROOM_TYPE_BOPI,"title":"邵阳剥皮","des":"10胡起胡,胡牌必须胡墩上示众后的牌，不能胡任何人提或偎的牌，满百结束，有天胡、地胡、自摸三种名堂。",
    "renshu":{"list":[3,4],"defaultIndex":0},"jushu":{"list":[100],"defaultIndex":0}
}
var obj2={"Id":ROOM_TYPE_HONGHU_147,"title":"红胡子","des":"10胡起胡,胡牌必须胡墩上示众后的牌，可以胡过张,不能胡任何人提或偎的牌，有天胡、地胡、一点朱胡,红胡、乌胡、自摸六种名堂。",
    "renshu":{"list":[3],"defaultIndex":0},"jushu":{"list":[4,8],"defaultIndex":0},
    "guize":{"list":[3,5],"defaultIndex":1}
}
var obj3={"Id":ROOM_TYPE_BINZHOU,"title":"郴州字牌","des":"9胡起胡,胡牌必须胡墩上示众后的牌，可以胡过张,不能胡任何人提或偎的牌，有天胡、地胡、一点朱胡,红胡、乌胡、自摸六种名堂。",
    "renshu":{"list":[3,4],"defaultIndex":0},"jushu":{"list":[8,12,20],"defaultIndex":0},
    "guize":{"list":[3,1],"defaultIndex":1}
}
rule_info.push(obj1);
rule_info.push(obj2);
rule_info.push(obj3);


var JOIN_ROOM_TYPE=0;//0:正常进入,1:掉线进入

var Z_ROOM=0;
var Z_ROOM2=0;

function keyBack() {

    var obj={};
    EventManager.getInstance().fireEvent("key_back_event",obj);

}

function checkInstallWeiXin() {

    if(isWeiXin==0)
    {
        return;
    }
    if(cc.sys.os == cc.sys.OS_ANDROID){

        //jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "checkRecAvailable","()V");

    }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){

        jsb.reflection.callStaticMethod("AppController","checkInstallWeiXin");

    }

}
function checkInstallWeiXinCallBack(state) {

    cc.log("check wx:"+state);

    if(state=="1")
    {

    }
    else{
        isWeiXin="0";
    }

}


var WAIHUZI_KEHU_UI_FLG=1;//歪胡子客户特殊要求
var WAIHUZI_QISHOU_QING_SHOW=0;//起手清是否可以被别人看到,0:不可以，1：可以
var KEHU2_AUTO_REQ=0;
var SHOW_READY_LAYER=0;
var DAIKAIFANG=1;


function getGameTitle(type)
{

    var str="";
    if(type==ROOM_TYPE_HONGHU_147)
    {
        str="147红胡子";
    }
    else if(type==ROOM_TYPE_BINZHOU){

        str="郴州字牌";

    }
    else if(type==ROOM_TYPE_LEIYANG){

        str="耒阳字牌";

    }
    else if(type==ROOM_TYPE_HENGYANG){

        str="衡阳六胡抢";

    }
    else if(type==ROOM_TYPE_BINZHOU_YONGXING){

        str="郴州字牌";

    }
    else if(type==ROOM_TYPE_BOPI)
    {

       str="邵阳剥皮";
    }
    else if(type==ROOM_TYPE_WAIHUZI) {

        str="歪胡子";

    }
    else if(type==ROOM_TYPE_LUZHOU_DAER){

        str="泸州大贰";

    }
    else if(type==ROOM_TYPE_GAOHUZI){

        str="邵阳告胡子";

    }
    else if(type==ROOM_TYPE_LOUDI)
    {

       str="娄底放炮罚";

    }
    else if(type==ROOM_TYPE_SHUANGFENG)
    {
        str="双峰煨胡子";

    }
    else if(type==ROOM_TYPE_GUILIN)
    {
        str="桂林字牌";

    }
    else if(type==ROOM_TYPE_HUAIHUA){

        str="怀化红拐弯";

    }
    else if(type==ROOM_TYPE_HONGHEIHU){

        str="衡阳红黑胡";

    }
    else if(type==ROOM_TYPE_PENGHUZI){

        str="攸县碰胡子";

    }
    else if(type==ROOM_TYPE_DAZIPAI)
    {
        str="大字牌";

    }
    else{
        str="未知";
    }
    return str;

}


