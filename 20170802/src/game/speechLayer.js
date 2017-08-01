/**
 * Created by yungu on 16/11/21.
 */
var SpeechLayer=cc.Layer.extend({


    ctor: function (room) {
        this._super();
        this.room=room;
        this.recordState=0;


        this.container=new cc.Layer();
        this.addChild(this.container);

        var rightBottom=null;

        if(UI_TYPE==0)
        {
            rightBottom = parseUI("res/ui/room_pipi/rightBottom.json", RIGHT_BOTTOM);
        }
        else if(UI_TYPE==1){
            rightBottom = parseUI("res/ui/room_fucheng/rightBottom.json", RIGHT_BOTTOM);
        }

        this.addChild(rightBottom);

        var wxButton = ccui.helper.seekWidgetByName(rightBottom, "speech");
        wxButton.addTouchEventListener(this.speechButton,this);


        var chat = ccui.helper.seekWidgetByName(rightBottom, "chat");
        chat.addTouchEventListener(this.msgClicked,this);

        this.playRecordQueue=[];

        this.schedule(this.yuYinCheck,0.1);

       // EventManager.getInstance().regist("play_stoped_event",this,this.playFinished);
        EventManager.getInstance().regist("DOWN_LOAD_FINISHED_EVENT",this,this.downLoadFinished);
        EventManager.getInstance().regist("record_error_event",this,this.recordError);

        this.isRecoding=false;

        this.yuYinLayer=new YuYinLayer(1);
        this.yuYinLayer.visible=false;
        this.container.addChild(this.yuYinLayer,1);

        this.msgLayer=new YuYinLayer(2);
        this.msgLayer.visible=false;
        this.container.addChild(this.msgLayer,1);


        this.msgLayer2=new YuYinLayer(3);
        this.msgLayer2.visible=false;
        this.container.addChild(this.msgLayer2,1);

    },
    setPos:function (x,y) {

        this.x=x;
        this.y=y;

        this.container.x=-this.x;
        this.container.y=-this.y;
        
    },
    msgClicked:function(sender, type)
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

                var layer=new LiaoTianLayer(this.room);
                this.container.addChild(layer,TABLE_DESKER_ZOEDER+100);
                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },
    speechButton:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
            {

                // if(this.room.roomObj.roomState!=ROOM_NO_STATE&&this.room.roomObj.roomState!=ROOM_WAIT_READY_STATE)
                // {
                //     var dialog=new DialogLayer();
                //     dialog.show("游戏中不可语音!");
                //     this.addChild(dialog);
                //
                //     return;
                // }
                if(!this.isRecoding)
                {
                    this.record();
                    this.isRecoding=true;

                }

            }
                break;
            case ccui.Widget.TOUCH_CANCELED:
            {
                if(this.isRecoding)
                {
                    this.stopRecordFun(false);
                }

            }
                break;
            case ccui.Widget.TOUCH_ENDED:
            {
                if(this.isRecoding){
                    this.stopRecordFun(true);
                }

            }
                break;


            default:
                break;
        }


    },
    stopRecordFun:function (isSend) {

        if(isRecodError!=0)
        {
            return;
        }
        this.yuYinLayer.visible=false;

        this.isRecoding=false;

        playBgMusic(2);

        cc.log("录制语音结束!!!!");
        this.unschedule(this.recordFinished);
        //停止播放动画
        stopRecord();

        if(isSend)
        {
            if(this.recordTime<1)
            {
                var dialog=new DialogLayer();
                dialog.show("语音时间太短!");
                this.container.addChild(dialog);
            }
            else{
                this.scheduleOnce(this.uploadSpeech,0.5);
            }
        }



    },
    record:function () {

        cc.log("录制语音开始!!!!");
        stopBgMusic();
       // stopPlay();
        startRecord();
        isRecodError=0;
        this.waitSpeechTime=60;
        this.recordTime=0;
        this.schedule(this.recordFinished,0.1);
    },
    recordFinished:function (dt) {

        if(isRecodError!=0)
        {
            this.isRecoding=false;
            this.unschedule(this.recordFinished);


            var tip=new TipInfoLayer("录制语音失败,请检查录制权限是否被禁用!");
            this.container.addChild(tip,100);

            return;
        }

        this.yuYinLayer.visible=true;

        this.waitSpeechTime-=dt;
        this.recordTime+=dt;
        cc.log("录制语音:"+this.waitSpeechTime);
        if(this.waitSpeechTime<=0)
        {
             this.stopRecordFun(true);
        }


    },
    uploadSpeech:function (dt) {

        cc.log("上传语音!!!!");
        var t=this.recordTime.toFixed(2);
        var str=myPlayerInfo.uid+"_"+t;
        uploadSpx(this.room.roomInfo.roomId,str);
    },
    playRecord:function (uid,fileName) {

        var obj={};
        obj.uid=uid;
        obj.fileName=fileName;
        var strs=fileName.split("_");
        var time=parseFloat(strs[1]);
        obj.time=time;
        console.log("####播放时间:"+time);
        this.playRecordQueue.push(obj);
    },
    yuYinCheck:function (dt) {

        var len=this.playRecordQueue.length;
        if(len<=0)
        {
            this.recordState=0;
            return;
        }
        var obj=this.playRecordQueue[0];
        if(this.recordState==0)//没有在之行的语音
        {
            cc.log("下载语音!");
            downLoadSpx(obj.fileName);
            this.recordState=1;
        }
        else if(this.recordState==1)
        {


        }
        else if(this.recordState==2)
        {
            cc.log("播放语音");
            stopBgMusic();

            var uid=obj.uid;
            var roomUser=this.room.getRoomUserByUID(uid);
            if(roomUser!=undefined&&roomUser!=null)
            {
                var pos=this.room.getHeadPos(roomUser,0,0);
                var uiPos=this.room.getRoomUserUIPos(roomUser);

              //  var Panel_1 = ccui.helper.seekWidgetByName(this.msgLayer, "Panel_1");
                /*
                 var BOTTOM_UI=0;
                 var RIGHT_UI=1;
                 var TOP_UI=3;
                 var LEFT_UI=4;
                 */
                if(uiPos==1)
                {

                    this.msgLayer.visible=true;
                    this.msgLayer.x=pos.x;
                    this.msgLayer.y=pos.y;

                    //RIGHT_UI
                    this.msgLayer.setSclX(-1);
                }
                else if(uiPos==3){

                    this.msgLayer2.visible=true;
                    this.msgLayer2.x=pos.x;
                    this.msgLayer2.y=pos.y;

                    this.msgLayer2.setSclX(-1);
                }
                else if(uiPos==4){

                    this.msgLayer2.visible=true;
                    this.msgLayer2.x=pos.x;
                    this.msgLayer2.y=pos.y;

                    this.msgLayer2.setSclX(1);

                }
                else{
                    this.msgLayer.visible=true;
                    this.msgLayer.x=pos.x;
                    this.msgLayer.y=pos.y;

                    this.msgLayer.setSclX(1);
                }
            }

            //this.timeStamp=new Date().getTime();
            playRecord();
            this.recordState=3;

            this.playTime=obj.time;
            this.schedule(this.playFinishedT,1);
        }

    },

    playFinished:function (obj,target) {
        cc.log("播放完毕!");

        if(target.recordState!=0)
        {


            target.recordState=0;

            target.playRecordQueue.splice(0,1);

            target.msgLayer.visible=false;
            target.msgLayer2.visible=false;

            stopPlay();

            cc.log("target.playRecordQueue:"+target.playRecordQueue.length);
        }


        playBgMusic(2);
    },
    playFinishedT:function (dt) {

      // if(isPlayStoped==1)

        this.playTime-=dt;
        if(this.playTime<=0)
       {
           isPlayStoped=0;
           var target=this;
           this.unschedule(this.playFinishedT);

           if(target.recordState!=0)
           {


               target.recordState=0;

               target.playRecordQueue.splice(0,1);

               target.msgLayer.visible=false;
               target.msgLayer2.visible=false;

               stopPlay();

               cc.log("target.playRecordQueue:"+target.playRecordQueue.length);

               playBgMusic(2);
           }

       }

    },
    downLoadFinished:function (obj,target) {
        var path=obj.path;
        var filePath=path.split("/");
        var fileName="";
        if(filePath.length>0) {
            fileName = filePath[filePath.length - 1];

        }
        var fix=getFix(fileName);
        cc.log("#########downfinished:"+fix+" "+fileName);
        if(fix==".spx")
        {
            target.recordState=2;

        }
        else {




        }

    },
    recordError:function (obj,target) {
       // cc.log("录音!");
        //target.unschedule(target.recordFinished);
        //stopRecord();
        //target.recordErrorCode=-1;


    },

    onExit:function () {
        this._super();
        EventManager.getInstance().unregist(this);

    },
});