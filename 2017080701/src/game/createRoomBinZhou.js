/**
 * Created by yungu on 16/12/20.
 */

var RENSHU_TYPE=0;
var JUSHU_TYPE=1;
var GUIZE_TYPE=2;
var QITATYPE=3;

var CreateRoomBinZhouLayer=cc.Layer.extend({


    ctor: function (sceneId) {
        this._super();

        this.gongneng_value=3;//0:gps,1:ip
        this.choushui_value=0;//0,1,2
        this.gunze_value=-1;//0:一胡一息,1:三胡一息,2:五胡一息
        this.ju_value=-1;//8,10,20,100
        this.renshu_value=-1;//0:三人,1:四人
        this.qita_value=-1;//

        this.allPanels=[];



        var node = parseUI("res/ui/sub/chuangjian3.json", CENTER);
        this.addChild(node);


        this.scrollView=ccui.helper.seekWidgetByName(node, "scroll");
        this.scrollView.setScrollBarEnabled(false);

        var obj=null;
        var len=rule_info.length;
        for(var i=0;i<len;i++)
        {
            var o=rule_info[i];
            if(o.Id==RULE_VALUE)
            {
                obj=o;
                break;
            }

        }

        // //标题
        var jianjie1= ccui.helper.seekWidgetByName(node, "title");
        jianjie1.setString(obj.title);
        //
        // var jianjie2= ccui.helper.seekWidgetByName(node, "jianjie2");
        // jianjie2.setString(obj.des);


        var renshu1= ccui.helper.seekWidgetByName(node, "renshu1");
        var renshu2= ccui.helper.seekWidgetByName(node, "renshu2");
        renshu1.visible=false;
        renshu2.visible=false;
        var tmpPanel=renshu2;

        var gap_w=200;

        if(obj.renshu!=undefined)
        {

            this.renshu_value=-2;

            renshu1.visible=true;
            var list=obj.renshu.list;
            var index=obj.renshu.defaultIndex;
            var count=list.length;
            for(var j=0;j<count;j++)
            {
                var a=list[j];
                var pClone=tmpPanel.clone();
                pClone.visible=true;

                pClone.x+=(j*gap_w);



                this.setTxt(pClone,a+"人");
                tmpPanel.getParent().addChild(pClone);

                this.setSelectedAddTouchListner(pClone);

                pClone.type=RENSHU_TYPE;
                pClone.value=a;
                pClone.group=1;
                
                this.allPanels.push(pClone);

                if(j==index)
                {
                    this.setSelected(pClone,true);
                }
            }

        }



        var jushu1= ccui.helper.seekWidgetByName(node, "jushu1");
        var jushu2= ccui.helper.seekWidgetByName(node, "jushu2");
        jushu1.visible=false;
        jushu2.visible=false;
        tmpPanel=jushu2;

        if(obj.jushu!=undefined)
        {

            this.ju_value=-2;

            jushu1.visible=true;
            var list=obj.jushu.list;
            var index=obj.jushu.defaultIndex;
            var count=list.length;
            for(var j=0;j<count;j++)
            {
                var a=list[j];
                var pClone=tmpPanel.clone();
                pClone.visible=true;

                pClone.x+=(j*gap_w);
                pClone.group=2;

                if(a==100)
                {
                    this.setTxt(pClone,"满百胡结束");
                }
                else{

                    if(RULE_VALUE==ROOM_TYPE_BINZHOU)
                    {
                        if(a==8)
                        {
                            this.setTxt(pClone,a+"局(2颗钻石)");
                        }
                        else if(a==12)
                        {
                            this.setTxt(pClone,a+"局(3颗钻石)");
                        }
                        else{
                            this.setTxt(pClone,a+"局(4颗钻石)");
                        }

                    }
                    else{
                        this.setTxt(pClone,a+"局");
                    }

                }

                tmpPanel.getParent().addChild(pClone);
                this.setSelectedAddTouchListner(pClone);

                pClone.type=JUSHU_TYPE;
                pClone.value=a;
                this.allPanels.push(pClone);

                if(j==index)
                {
                    this.setSelected(pClone,true);
                }
            }

        }

        var guize1= ccui.helper.seekWidgetByName(node, "guize1");
        var guize2= ccui.helper.seekWidgetByName(node, "guize2");
        guize1.visible=false;
        guize2.visible=false;
        tmpPanel=guize2;

        if(RULE_VALUE==ROOM_TYPE_BINZHOU)
        {
            guize1.setString("息囤转换:");
        }
        else if(RULE_VALUE==ROOM_TYPE_HONGHU_147)
        {
            guize1.setString("息墩转换:");
        }

        if(obj.guize!=undefined)
        {
            this.gunze_value=-2;

            guize1.visible=true;
            var list=obj.guize.list;
            var index=obj.guize.defaultIndex;
            var count=list.length;
            for(var j=0;j<count;j++)
            {
                var a=list[j];
                var pClone=tmpPanel.clone();
                pClone.visible=true;

                pClone.x+=(j*gap_w);

                pClone.group=3;


                this.setTxt(pClone,a+"/1");

                tmpPanel.getParent().addChild(pClone);
                this.setSelectedAddTouchListner(pClone);

                pClone.type=GUIZE_TYPE;
                pClone.value=a;
                this.allPanels.push(pClone);
                if(j==index)
                {
                    this.setSelected(pClone,true);
                }
            }

        }

        var qita1= ccui.helper.seekWidgetByName(node, "qita1");
        var qita2= ccui.helper.seekWidgetByName(node, "qita2");
        qita1.visible=false;
        qita2.visible=false;
        tmpPanel=qita2;
        if(RULE_VALUE==ROOM_TYPE_HONGHU_147)
        {
            this.qita_value=-2;

            qita1.visible=true;
            for(var j=0;j<2;j++)
            {

                var pClone=tmpPanel.clone();
                pClone.visible=true;

                pClone.x+=(j*gap_w);

                pClone.group=4;

                if(j==0)
                {
                    this.setTxt(pClone,"天地红黑乌加一墩");
                }
                else{
                    this.setTxt(pClone,"天地红黑乌不加墩");
                }

                tmpPanel.getParent().addChild(pClone);
                this.setSelectedAddTouchListner(pClone);

                pClone.type=QITATYPE;
                pClone.value=j;
                this.allPanels.push(pClone);
                if(j==0)
                {
                    this.setSelected(pClone,true);
                }
            }
        }
        // if(RULE_VALUE==ROOM_TYPE_BOPI)
        // {
        //     this.qita_value=-2;
        //
        //     qita1.visible=true;
        //     for(var j=0;j<2;j++)
        //     {
        //
        //         var pClone=tmpPanel.clone();
        //         pClone.visible=true;
        //
        //         pClone.x+=(j*gap_w);
        //
        //         pClone.group=4;
        //
        //         if(j==0)
        //         {
        //             this.setTxt(pClone,"无红乌胡");
        //         }
        //         else{
        //             this.setTxt(pClone,"有红乌胡");
        //         }
        //
        //         tmpPanel.getParent().addChild(pClone);
        //         this.setSelectedAddTouchListner(pClone);
        //
        //         pClone.type=QITATYPE;
        //         pClone.value=j;
        //         this.allPanels.push(pClone);
        //         if(j==0)
        //         {
        //             this.setSelected(pClone,true);
        //         }
        //     }
        // }



        // //关闭
        // this.close = ccui.helper.seekWidgetByName(node, "close");
        // this.close.addTouchEventListener(this.closeClicked,this);

        //创建
        this.create = ccui.helper.seekWidgetByName(node, "chuangjian");
        this.create.addTouchEventListener(this.createClicked,this);


        Service.getInstance().regist(CREATE_ROOM_RESPONSE,this,this.onReceive);



    },
    onReceive:function(msgNumber,body,target)
    {

        switch(msgNumber)
        {

            case CREATE_ROOM_RESPONSE:
            {
                cc.log("[创建房间应答:"+body.state+"]");

                if(body.state==0)
                {
                    SceneManager.getInstance().changeScene(ROOM_SCENE,REPLACE_SCENE);

                }
                else if(body.state==-2)
                {

                    if(target.loadLayer!=null&&target.loadLayer!=undefined)
                    {
                        target.loadLayer.removeFromParent(true);
                        target.loadLayer=null;
                    }

                    target.roomTip=new TouchLayer();
                    target.addChild(target.roomTip,100);

                    var node = parseUI("res/ui/roomTip/roomTip.json", CENTER);
                    target.roomTip.addChild(node);

                    var b1= ccui.helper.seekWidgetByName(node, "b1");
                    b1.addTouchEventListener(target.roomTipB1Clicked,target);


                    var b2= ccui.helper.seekWidgetByName(node, "b2");
                    b2.addTouchEventListener(target.roomTipB2Clicked,target);

                    var t= ccui.helper.seekWidgetByName(node, "t");
                    t.setString(body.txt);

                }
                else
                {

                    if(target.loadLayer!=null)
                    {
                        target.loadLayer.removeFromParent(true);
                        target.loadLayer=null;
                    }

                    var dialog=new DialogLayer();
                    dialog.show("[创建房间失败!]");
                    target.addChild(dialog);
                    return;

                }




            }
                break;


        }


    },
    roomTipB1Clicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                this.removeFromParent(true);

                var obj={};
                EventManager.getInstance().fireEvent("SHOP_EVENT",obj);


                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },
    roomTipB2Clicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {
                if(this.roomTip!=undefined&&this.roomTip!=null)
                {
                    this.roomTip.removeFromParent(true);
                    this.roomTip=null;
                }

                playEffect(TOUCH_SOUND);
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
    setSelectedAddTouchListner:function(panel)
    {
        var r1= ccui.helper.seekWidgetByName(panel, "r1");
        var r2= ccui.helper.seekWidgetByName(panel, "r2");
        r1.addTouchEventListener(this.selectedClicked,this);
        r2.addTouchEventListener(this.selectedClicked,this);

        r1.panel=panel;
        r2.panel=panel;
    },
    isPanel:function (panel,sender) {
        var r1= ccui.helper.seekWidgetByName(panel, "r1");
        var r2= ccui.helper.seekWidgetByName(panel, "r2");
        if(r1==sender||r2==sender)
        {
            return true;
        }

        return false;
    },
    setTxt:function (panel,txt) {
        var t= ccui.helper.seekWidgetByName(panel, "t");
        t.setString(txt);
    },
    getPanelByGroup:function (groupValue) {

        var list=[];
        var count=this.allPanels.length;
        for(var i=0;i<count;i++)
        {
            var p=this.allPanels[i];
            if(p.group==groupValue)
            {
                list.push(p);
            }

        }

        return list;
    },
    setSelected:function (panel,isSelected) {



        var r1= ccui.helper.seekWidgetByName(panel, "r1");
        var r2= ccui.helper.seekWidgetByName(panel, "r2");

        if(isSelected)
        {
            r1.visible=false;
            r1.setTouchEnabled(false);
            r1.setEnabled(false);

            r2.visible=true;
            r2.setTouchEnabled(true);
            r2.setEnabled(true);
        }
        else{
            r1.visible=true;
            r1.setTouchEnabled(true);
            r1.setEnabled(true);

            r2.visible=false;
            r2.setTouchEnabled(false);
            r2.setEnabled(false);
        }


        if(isSelected)
        {
            /*
             this.gongneng_value=3;//0:gps,1:ip
             this.choushui_value=0;//0,1,2
             this.gunze_value=-1;//1:一胡一息,3:三胡一息,5:五胡一息
             this.ju_value=-1;//8,10,20,100
             this.renshu_value=-1;//0:三人,1:四人
             this.qita_value=-1;//
             */

            var type=panel.type;
            if(type==RENSHU_TYPE)
            {
                this.renshu_value=panel.value;
            }
            else if(type==JUSHU_TYPE)
            {
                this.ju_value=panel.value;
            }
            else if(type==GUIZE_TYPE)
            {
                this.gunze_value=panel.value;
            }
            else if(type==QITATYPE)
            {
                this.qita_value=panel.value;
            }

        }

    },
    isSelected:function (panel) {

        var r1= ccui.helper.seekWidgetByName(panel, "r1");
        var r2= ccui.helper.seekWidgetByName(panel, "r2");

        if(r1.visible)
        {
            return false;
        }

        return true;
    },



    createClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {

                if(this.renshu_value==-2)
                {
                    var dialog=new DialogLayer();
                    dialog.show("[人数未选择!]");
                    this.addChild(dialog);
                    return;
                }

                if(this.gunze_value==-2)
                {
                    var dialog=new DialogLayer();
                    dialog.show("[规则未选择!]");
                    this.addChild(dialog);
                    return;
                }
                if(this.ju_value==-2)
                {
                    var dialog=new DialogLayer();
                    dialog.show("[局数未选择!]");
                    this.addChild(dialog);
                    return;
                }
                if(this.qita_value==-2)
                {
                    var dialog=new DialogLayer();
                    dialog.show("[其他未选择!]");
                    this.addChild(dialog);
                    return;
                }

                if(RULE_VALUE==ROOM_TYPE_BINZHOU)
                {
                    var dialog=new DialogLayer();
                    dialog.show("[玩法正在开发中,敬请期待!]");
                    this.addChild(dialog);
                    return;
                }
                if(this.loadLayer!=null)
                {
                    this.loadLayer.removeFromParent(true);
                    this.loadLayer=null;
                }
                this.loadLayer=new LoadLayer();
                this.addChild(this.loadLayer);

                var req=new CreateRoomRequest();
                req.uid=myPlayerInfo.uid;
                req.renshu=this.renshu_value;
                req.gongneng=this.gongneng_value;
                req.choushui=this.choushui_value;
                req.gunze=this.gunze_value;
                req.ju=this.ju_value;
                req.qita=this.qita_value;
                req.roomType=RULE_VALUE;
                socketMgr.socket.send(CREATE_ROOM_REQUEST,req);

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
    selectedClicked:function(sender, type)
    {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
            {

                var panel=sender.panel;

                var list=this.getPanelByGroup(panel.group);
                var count=list.length;
                for(var i=0;i<count;i++)
                {
                    var p=list[i];
                    this.setSelected(p,false);
                }

                if(this.isSelected(panel))
                {
                    this.setSelected(panel,false);

                }
                else{
                    this.setSelected(panel,true);

                }

                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },


});