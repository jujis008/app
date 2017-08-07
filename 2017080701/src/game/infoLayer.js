/**
 * Created by yungu on 16/11/28.
 */

var EARTH_RADIUS = 6378137.0;    //单位M
var PI = Math.PI;

function getRad(d){
    return d*PI/180.0;
}

function getFlatternDistance(lat1,lng1,lat2,lng2){
    var f = getRad((lat1 + lat2)/2);
    var g = getRad((lat1 - lat2)/2);
    var l = getRad((lng1 - lng2)/2);

    var sg = Math.sin(g);
    var sl = Math.sin(l);
    var sf = Math.sin(f);

    var s,c,w,r,d,h1,h2;
    var a = EARTH_RADIUS;
    var fl = 1/298.257;

    sg = sg*sg;
    sl = sl*sl;
    sf = sf*sf;

    s = sg*(1-sl) + (1-sf)*sl;
    c = (1-sg)*(1-sl) + sf*sl;

    w = Math.atan(Math.sqrt(s/c));
    r = Math.sqrt(s*c)/w;
    d = 2*w*a;
    h1 = (3*r -1)/2/c;
    h2 = (3*r +1)/2/s;

    return d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg));
}

var InfoLayer=cc.Layer.extend({


    ctor: function (room,roomUser) {
        this._super();

        this.room=room;
        this.roomUser=roomUser;

        var touchLayer=new TouchLayer();
        this.addChild(touchLayer);

        var node = parseUI("res/ui/info/infoLayer.json", CENTER);
        touchLayer.addChild(node);

        var b= ccui.helper.seekWidgetByName(node, "close");
        b.addTouchEventListener(this.closeClicked,this);


        var a1= ccui.helper.seekWidgetByName(node, "a1");
        a1.addTouchEventListener(this.aClicked,this);
        a1.value=1;

        var a2= ccui.helper.seekWidgetByName(node, "a2");
        a2.addTouchEventListener(this.aClicked,this);
        a2.value=2;

        var a3= ccui.helper.seekWidgetByName(node, "a3");
        a3.addTouchEventListener(this.aClicked,this);
        a3.value=3;

        var a4= ccui.helper.seekWidgetByName(node, "a4");
        a4.addTouchEventListener(this.aClicked,this);
        a4.value=4;


        var head= ccui.helper.seekWidgetByName(node, "head");
        head.setLocalZOrder(2);
        var uid=roomUser.user.uid;
        var headName=uid+"_head.png";
        var headIconPath=getSkinPath(headName);
        if(checkFileExit(headIconPath))
        {
            var headSprite=new cc.Sprite(headIconPath);
            headSprite.x=head.x;
            headSprite.y=head.y;
            changeHead(headSprite,2);
            head.getParent().addChild(headSprite,1);
        }

        var nv= ccui.helper.seekWidgetByName(node, "nv");
        nv.visible=false;

        var nan= ccui.helper.seekWidgetByName(node, "nan");
        nan.visible=false;

        if(roomUser.user.sex==1)
        {
            nv.visible=true;
        }
        else{
            nan.visible=true;
        }
        var name= ccui.helper.seekWidgetByName(node, "name");
        name.setString(roomUser.user.name);

        var id= ccui.helper.seekWidgetByName(node, "id");
        id.setString("ID:"+roomUser.user.uid);


        var yuanbao= ccui.helper.seekWidgetByName(node, "jifen");
        if(roomUser.score1==undefined)
        {
            yuanbao.setString("积分:0");
        }
        else{
            yuanbao.setString("积分:"+roomUser.score1);
        }


        var ip= ccui.helper.seekWidgetByName(node, "ip");



        var myGps=roomUser.user.gps;
        var lat1=-1;
        var lng1=-1;
        if(myGps!=undefined&&myGps!="")
        {
            var ar=myGps.split("myKey");
            if(ar.length>=6)
            {
                lat1=parseFloat(ar[4]);
                lng1=parseFloat(ar[5]);
            }
            var str=ar[0]+"-"+ar[1]+"-"+ar[2];//+"-"+ar[3];
            ip.setString("来自:"+str);
        }
        else{
            if(roomUser.user.ip!=undefined&&roomUser.user.ip!="")
            {
                ip.setString("来自:"+roomUser.user.ip);
            }
            else{
                ip.setString("来自:获取位置失败");
            }


        }



       //
       // if(this.room.roomInfo.gongneng==2||this.room.roomInfo.gongneng==3)
        {

            var myGps=roomUser.user.gps;
            var lat1=-1;
            var lng1=-1;
            if(myGps!=undefined&&myGps!="")
            {
                var ar=myGps.split("myKey");
                if(ar.length>=6)
                {
                    lat1=parseFloat(ar[4]);
                    lng1=parseFloat(ar[5]);
                }
                var str=ar[0]+"-"+ar[1]+"-"+ar[2];//+"-"+ar[3];
              //  tt.setString("位置:"+str);
            }
            else{
               // tt.setString("位置:获取位置失败");
            }
            //tt.visible=true;

            var t1= ccui.helper.seekWidgetByName(node, "t1");
            var t2= ccui.helper.seekWidgetByName(node, "t2");
            var t3= ccui.helper.seekWidgetByName(node, "t3");
            t1.visible=false;
            t2.visible=false;
            t3.visible=false;

            var roomUsers=this.room.roomInfo.roomUsers;
            var len=roomUsers.length;
            var count=0;


            for(var i=0;i<len;i++)
            {
                var roomUser2=roomUsers[i];
                if(roomUser==roomUser2)
                {
                    continue;
                }
                count++;

                var key="t"+count;
                var t= ccui.helper.seekWidgetByName(node, key);
                if(t!=undefined)
                {
                    var gps=roomUser2.user.gps;
                    var lat2=-1;
                    var lng2=-1;
                    if(gps!=undefined&&gps!="")
                    {
                        var arr=gps.split("myKey");
                        if(arr.length>=6)
                        {
                            lat2=parseFloat(arr[4]);
                            lng2=parseFloat(arr[5]);
                        }
                    }
                    var str="距离玩家["+roomUser2.user.name+"]:";
                    //console.log("lat1:"+lat1+",lng1:"+lng1+",lat2:"+lat2+",lng2:"+lng2);
                   if(lat2!=-1&&lng2!=-1&&lat1!=-1&&lng1!=-1)
                   {
                       var dis=getFlatternDistance(lat1,lng1,lat2,lng2);
                       dis=dis;
                       dis=parseFloat(dis).toFixed(3);
                       str+=(""+dis+"米");
                       console.log("dis:"+dis);

                   }
                    else{
                       str+="获取位置失败";
                   }
                    t.setString(str);
                    t.visible=true;

                }


            }

        }





    },
    aClicked:function(sender, type)
    {

        if(this.roomUser.user.uid==myPlayerInfo.uid)
        {
            cc.log("不能给自己发特效");
            return;
        }
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

                if(this.waitCloseFlg==undefined)
                {

                    this.waitCloseFlg=true;
                    this.schedule(this.waitClose, 0.2);
                }


                var req=new PlayEffectRequest();
                req.fromUid=myPlayerInfo.uid;
                req.toUid=this.roomUser.user.uid;
                req.roomId=this.room.roomInfo.roomId;
                req.type=sender.value;
                socketMgr.socket2.send(PLAY_EFFECT_REQUEST,req);
                

            }
                break;


            default:
                break;
        }


    },
    waitClose:function (dt) {

        this.removeFromParent(true);
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