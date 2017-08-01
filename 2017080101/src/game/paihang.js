/**
 * Created by yungu on 16/11/4.
 */

var PaiHangLayer=cc.Layer.extend({


    ctor: function (sceneId) {
        this._super();

        var touchLayer=new TouchLayer();
        this.addChild(touchLayer);

        var node = parseUI("res/ui/sub/paihangLayer.json", CENTER);
        touchLayer.addChild(node);

        this.scrollView=ccui.helper.seekWidgetByName(node, "scroll");
        this.scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        this.scrollView.setTouchEnabled(true);
        this.pModel=ccui.helper.seekWidgetByName(this.scrollView, "p1");
        this.pModel.visible=false;
        this.scrollView.setScrollBarEnabled(false);

        var close= ccui.helper.seekWidgetByName(node, "close");
        close.addTouchEventListener(this.closeClicked,this);


        Service.getInstance().regist(GET_RANK_RESPONSE,this,this.onReceive);
        EventManager.getInstance().regist("DOWN_LOAD_FINISHED_EVENT",this,this.downLoadFinished);

        var req=new GetRankRequest();
        req.uid=myPlayerInfo.uid;
        socketMgr.socket.send(GET_RANK_REQUEST,req);

        this.heads={};

    },
    onReceive:function(msgNumber,body,target)
    {

        switch(msgNumber)
        {

            case GET_RANK_RESPONSE:
            {

                target.ranks=body.ranks;

                cc.log("排行数目:"+target.ranks.length);
                target.resetUI();

            }
                break;


        }


    },
    resetUI:function () {

        var gap_h=this.pModel.getContentSize().height;
        var len=this.ranks.length;
        var ccc=this.scrollView.getInnerContainerSize();
        var ww=ccc.width;
        var hh=gap_h*len;
        var hTmp=hh-ccc.height;
        if(hTmp<0)hTmp=0;

        //cc.log("数目:"+len);
        for(var i=0;i<len;i++)
        {
            var rank=this.ranks[i];
            var panel=this.pModel.clone();

            
            var r=ccui.helper.seekWidgetByName(panel, "r");
            r.setString(""+(i+1));
            var icon=null;
            if(i==0)
            {
                icon="res/ui/sub/biaopai2_sub.png";
            }
            else if(i==1)
            {
                icon="res/ui/sub/biaopai3_sub.png";
            }
            else if(i==2)
            {
                icon="res/ui/sub/biaopai1_sub.png";
            }

            if(icon!=null)
            {
                r.visible=false;
                var sp=new cc.Sprite(icon);
                sp.x=r.x;
                sp.y=r.y;
                r.getParent().addChild(sp);
                sp.setScale(0.5);
            }
            var head=ccui.helper.seekWidgetByName(panel, "head");
            head.setLocalZOrder(2);

            // var online=ccui.helper.seekWidgetByName(panel, "online");
            // online.setLocalZOrder(2);
            // online.visible=false;
           // online.setString("在线");


            var uid=rank.uid;
            var headName=uid+"_head.png";
            var headIconPath=getSkinPath(headName);
            if(checkFileExit(headIconPath))
            {
                var headSprite=new cc.Sprite(headIconPath);
                headSprite.x=head.x;
                headSprite.y=head.y;
                headSprite.setScale(0.5);
                head.getParent().addChild(headSprite,1);

                if(rank.isOnline==1)
                {
                    Filter.grayScale(headSprite);
                }

            }
            else{
                cc.log("需要下载:"+headName+","+rank.head);
                pushDownLoadQueue(headName,2,rank.head);
            }
            var tmpObj={};
            tmpObj.isOnline=rank.isOnline;
            tmpObj.head=head;
            this.heads[uid]=tmpObj;

            var name=ccui.helper.seekWidgetByName(panel, "name");
            name.setString(rank.name);

            var id=ccui.helper.seekWidgetByName(panel, "id");
            id.setString(rank.uid);

            var val=ccui.helper.seekWidgetByName(panel, "val");
            val.setString(rank.value+"");

            this.scrollView.addChild(panel);

            panel.x=this.pModel.x;
            panel.y=this.pModel.y-i*gap_h+hTmp;
            panel.visible=true;

        }

        
        //cc.log("cc:"+ccc.height+",hh:"+hh+","+gap_h*len);
        this.scrollView.setInnerContainerSize(cc.size(ww, hh));

    },
    downLoadFinished:function (obj,target) {
        var path=obj.path;
        var filePath=path.split("/");
        var fileName="";
        if(filePath.length>0) {
            fileName = filePath[filePath.length - 1];

        }
        var fix=getFix(fileName);
        //cc.log("#########downfinished:"+fix+" "+fileName);
        if(fix==".spx")
        {

        }
        else {

            var headIconPath=obj.savePath;
            cc.log("######下载完成:" + headIconPath);
            if(checkFileExit(headIconPath))
            {

                var p_s=headIconPath.split("/");
                var str="";
                if(p_s.length>0) {
                    str = p_s[p_s.length - 1];
                }
                var str_s=str.split("_");
                var uid=str_s[0];
                var tmpObj=target.heads[uid];
                if(tmpObj==undefined)
                {
                    return;
                }
                var head=tmpObj.head;
                var headSprite=new cc.Sprite(headIconPath);
                headSprite.x=head.x;
                headSprite.y=head.y;
                headSprite.setScale(0.5);
                head.getParent().addChild(headSprite,1);
                if(tmpObj.isOnline==1)
                {
                    Filter.grayScale(headSprite);
                }
               
            }


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
    onExit:function () {
        this._super();
        EventManager.getInstance().unregist(this);
        Service.getInstance().unregist(this);

    },
});