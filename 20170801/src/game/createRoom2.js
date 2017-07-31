/**
 * Created by yungu on 16/12/15.
 */

var RENSHU_TYPE=0;
var JUSHU_TYPE=1;
var GUIZE_TYPE=2;
var QITATYPE=3;
var QIHU=4;
var FANGFEI=5;
var JIESUANFANGSHI=6;
var FENGDING=7;
var ZIMOFANBEI=8;//自摸翻倍
var FANGPAOBAOPEI=9;//放炮包赔
var GUI=10;//归
var GONGNENG=11;
var CHOUSHUI=12;
var  JIADI=13;


var CreateRoomLayer2=cc.Layer.extend({


    ctor: function (sceneId) {
        this._super();

        this.gongneng_value=3;//0:gps,1:ip
        this.choushui_value=0;//0,1,2
        this.gunze_value=-1;//0:一胡一息,1:三胡一息,2:五胡一息
        this.ju_value=-1;//8,10,20,100
        this.renshu_value=-1;//0:三人,1:四人
        this.qita_value=-1;//
        this.qihu_value=0;
        this.fengding_value=0;
        this.jiadi_value=0;
        this.gui_value=0;

        this.allPanels=[];








        if(RULE_VALUE==ROOM_TYPE_BOPI)
        {



            this.renshu_value=-2;


            var node = parseUI("res/ui/sub/chuangjian_shaoyangbopi.json", CENTER);
            this.addChild(node);
           

            this.layerNode=node;


            this.scrollView=ccui.helper.seekWidgetByName(node, "scroll");
            this.scrollView.setScrollBarEnabled(false);

            var renshu2= ccui.helper.seekWidgetByName(node, "renshu2");
            renshu2.type=RENSHU_TYPE;
            renshu2.value=3;
            renshu2.group=1;
            this.setSelectedAddTouchListner(renshu2);
            this.allPanels.push(renshu2);
            this.setSelected(renshu2,true);

            var renshu3= ccui.helper.seekWidgetByName(node, "renshu3");
            renshu3.type=RENSHU_TYPE;
            renshu3.value=4;
            renshu3.group=1;
            this.setSelectedAddTouchListner(renshu3);
            this.allPanels.push(renshu3);

            var qihu2= ccui.helper.seekWidgetByName(node, "qihu2");
            qihu2.type=QIHU;
            qihu2.value=10;
            qihu2.group=2;
            this.setSelected(qihu2,true);
            this.setSelectedAddTouchListner(qihu2);
            this.allPanels.push(qihu2);

            var jushu2= ccui.helper.seekWidgetByName(node, "jushu2");
            jushu2.type=JUSHU_TYPE;
            jushu2.value=100;
            jushu2.group=3;
            this.setSelected(jushu2,true);
            this.setSelectedAddTouchListner(jushu2);
            this.allPanels.push(jushu2);


            //其他
            var qita2= ccui.helper.seekWidgetByName(node, "qita2");
            qita2.type=QITATYPE;
            qita2.value=0;
            qita2.group=5;
            this.setSelected(qita2,true);
            this.setSelectedAddTouchListner(qita2);
            this.allPanels.push(qita2);

            var qita3= ccui.helper.seekWidgetByName(node, "qita3");
            qita3.type=QITATYPE;
            qita3.value=1;
            qita3.group=5;
            this.setSelectedAddTouchListner(qita3);
            this.allPanels.push(qita3);

        }
        else if(RULE_VALUE==ROOM_TYPE_HONGHU_147)
        {

            this.gunze_value=-2;
            this.ju_value=-2;
            this.renshu_value=-2;
            this.qita_value=-2;

            var node = parseUI("res/ui/sub/chuangjian_147.json", CENTER);
            this.addChild(node);

            this.layerNode=node;

            this.scrollView=ccui.helper.seekWidgetByName(node, "scroll");
            this.scrollView.setScrollBarEnabled(false);

            
        //人数
            var renshu2= ccui.helper.seekWidgetByName(node, "renshu2");
            renshu2.type=RENSHU_TYPE;
            renshu2.value=3;
            renshu2.group=1;
            this.setSelected(renshu2,true);
            this.setSelectedAddTouchListner(renshu2);
            this.allPanels.push(renshu2);

            //起胡
            var qihu2= ccui.helper.seekWidgetByName(node, "qihu2");
            qihu2.type=QIHU;
            qihu2.value=10;
            qihu2.group=2;
            this.setSelected(qihu2,true);
            this.setSelectedAddTouchListner(qihu2);
            this.allPanels.push(qihu2);

            //局数
            var jushu2= ccui.helper.seekWidgetByName(node, "jushu2");
            jushu2.type=JUSHU_TYPE;
            jushu2.value=4;
            jushu2.group=3;
            this.setSelected(jushu2,true);
            this.setSelectedAddTouchListner(jushu2);
            this.allPanels.push(jushu2);

            var jushu3= ccui.helper.seekWidgetByName(node, "jushu3");
            jushu3.type=JUSHU_TYPE;
            jushu3.value=8;
            jushu3.group=3;
            this.setSelectedAddTouchListner(jushu3);
            this.allPanels.push(jushu3);

            //息囤转换
            var guize2= ccui.helper.seekWidgetByName(node, "guize2");
            guize2.type=GUIZE_TYPE;
            guize2.value=3;
            guize2.group=4;
            this.setSelected(guize2,true);
            this.setSelectedAddTouchListner(guize2);
            this.allPanels.push(guize2);


            var guize3= ccui.helper.seekWidgetByName(node, "guize3");
            guize3.type=GUIZE_TYPE;
            guize3.value=5;
            guize3.group=4;
            this.setSelectedAddTouchListner(guize3);
            this.allPanels.push(guize3);

            //其他
            var qita2= ccui.helper.seekWidgetByName(node, "qita2");
            qita2.type=QITATYPE;
            qita2.value=0;
            qita2.group=5;
            this.setSelected(qita2,true);
            this.setSelectedAddTouchListner(qita2);
            this.allPanels.push(qita2);

            var qita3= ccui.helper.seekWidgetByName(node, "qita3");
            qita3.type=QITATYPE;
            qita3.value=1;
            qita3.group=5;
            this.setSelectedAddTouchListner(qita3);
            this.allPanels.push(qita3);



        }
        else if(RULE_VALUE==ROOM_TYPE_BINZHOU)
        {

            this.gunze_value=-2;
            this.ju_value=-2;
            this.renshu_value=-2;


            var node = parseUI("res/ui/sub/chuangjian_binzhou.json", CENTER);
            this.addChild(node);

            this.layerNode=node;

            this.scrollView=ccui.helper.seekWidgetByName(node, "scroll");
            this.scrollView.setScrollBarEnabled(false);

            //人数
            var renshu2= ccui.helper.seekWidgetByName(node, "renshu2");
            renshu2.type=RENSHU_TYPE;
            renshu2.value=3;
            renshu2.group=1;
            this.setSelected(renshu2,true);
            this.setSelectedAddTouchListner(renshu2);
            this.allPanels.push(renshu2);

            var renshu3= ccui.helper.seekWidgetByName(node, "renshu3");
            renshu3.type=RENSHU_TYPE;
            renshu3.value=4;
            renshu3.group=1;
            this.setSelectedAddTouchListner(renshu3);
            this.allPanels.push(renshu3);

            //起胡
            var qihu2= ccui.helper.seekWidgetByName(node, "qihu2");
            qihu2.type=QIHU;
            qihu2.value=9;
            qihu2.group=2;
            this.setSelected(qihu2,true);
            this.setSelectedAddTouchListner(qihu2);
            this.allPanels.push(qihu2);

            //局数
            var jushu2= ccui.helper.seekWidgetByName(node, "jushu2");
            jushu2.type=JUSHU_TYPE;
            jushu2.value=4;
            jushu2.group=3;

            this.setSelectedAddTouchListner(jushu2);
            this.allPanels.push(jushu2);

            var jushu3= ccui.helper.seekWidgetByName(node, "jushu3");
            jushu3.type=JUSHU_TYPE;
            jushu3.value=8;
            jushu3.group=3;
            this.setSelected(jushu3,true);
            this.setSelectedAddTouchListner(jushu3);
            this.allPanels.push(jushu3);


            var jushu4= ccui.helper.seekWidgetByName(node, "jushu4");
            jushu4.type=JUSHU_TYPE;
            jushu4.value=12;
            jushu4.group=3;
            this.setSelectedAddTouchListner(jushu4);
            this.allPanels.push(jushu4);

            var jushu5= ccui.helper.seekWidgetByName(node, "jushu5");
            jushu5.type=JUSHU_TYPE;
            jushu5.value=20;
            jushu5.group=3;
            this.setSelectedAddTouchListner(jushu5);
            this.allPanels.push(jushu5);


            //息囤转换
            var guize2= ccui.helper.seekWidgetByName(node, "guize2");
            guize2.type=GUIZE_TYPE;
            guize2.value=3;
            guize2.group=4;
            this.setSelected(guize2,true);
            this.setSelectedAddTouchListner(guize2);
            this.allPanels.push(guize2);


            var guize3= ccui.helper.seekWidgetByName(node, "guize3");
            guize3.type=GUIZE_TYPE;
            guize3.value=1;
            guize3.group=4;
            this.setSelectedAddTouchListner(guize3);
            this.allPanels.push(guize3);



        }
        else if(RULE_VALUE==ROOM_TYPE_BINZHOU_YONGXING)
        {

            this.gunze_value=-2;
            this.ju_value=-2;
            this.renshu_value=-2;


            var node = parseUI("res/ui/sub/chuangjian_binzhou_yongxing.json", CENTER);
            this.addChild(node);

            this.layerNode=node;

            this.scrollView=ccui.helper.seekWidgetByName(node, "scroll");
            this.scrollView.setScrollBarEnabled(false);

            //人数
            var renshu2= ccui.helper.seekWidgetByName(node, "renshu2");
            renshu2.type=RENSHU_TYPE;
            renshu2.value=3;
            renshu2.group=1;
            this.setSelected(renshu2,true);
            this.setSelectedAddTouchListner(renshu2);
            this.allPanels.push(renshu2);

            var renshu3= ccui.helper.seekWidgetByName(node, "renshu3");
            renshu3.type=RENSHU_TYPE;
            renshu3.value=4;
            renshu3.group=1;
            this.setSelectedAddTouchListner(renshu3);
            this.allPanels.push(renshu3);

            //起胡
            var qihu2= ccui.helper.seekWidgetByName(node, "qihu2");
            qihu2.type=QIHU;
            qihu2.value=3;
            qihu2.group=2;
            this.setSelected(qihu2,true);
            this.setSelectedAddTouchListner(qihu2);
            this.allPanels.push(qihu2);


            //局数
            var jushu2= ccui.helper.seekWidgetByName(node, "jushu2");
            jushu2.type=JUSHU_TYPE;
            jushu2.value=4;
            jushu2.group=3;

            this.setSelectedAddTouchListner(jushu2);
            this.allPanels.push(jushu2);

            var jushu3= ccui.helper.seekWidgetByName(node, "jushu3");
            jushu3.type=JUSHU_TYPE;
            jushu3.value=8;
            jushu3.group=3;
            this.setSelected(jushu3,true);
            this.setSelectedAddTouchListner(jushu3);
            this.allPanels.push(jushu3);


            var jushu4= ccui.helper.seekWidgetByName(node, "jushu4");
            jushu4.type=JUSHU_TYPE;
            jushu4.value=12;
            jushu4.group=3;
            this.setSelectedAddTouchListner(jushu4);
            this.allPanels.push(jushu4);

            var jushu5= ccui.helper.seekWidgetByName(node, "jushu5");
            jushu5.type=JUSHU_TYPE;
            jushu5.value=20;
            jushu5.group=3;
            this.setSelectedAddTouchListner(jushu5);
            this.allPanels.push(jushu5);


            //息囤转换
            var guize2= ccui.helper.seekWidgetByName(node, "guize2");
            guize2.type=GUIZE_TYPE;
            guize2.value=3;
            guize2.group=4;
            this.setSelected(guize2,true);
            this.setSelectedAddTouchListner(guize2);
            this.allPanels.push(guize2);


            var guize3= ccui.helper.seekWidgetByName(node, "guize3");
            guize3.type=GUIZE_TYPE;
            guize3.value=1;
            guize3.group=4;
            this.setSelectedAddTouchListner(guize3);
            this.allPanels.push(guize3);



            var qita2= ccui.helper.seekWidgetByName(node, "qita2");
            qita2.type=QITATYPE;
            qita2.value=0;
            qita2.group=5;
            this.setSelectedAddTouchListner(qita2);
            this.allPanels.push(qita2);

            var qita3= ccui.helper.seekWidgetByName(node, "qita3");
            qita3.type=QITATYPE;
            qita3.value=1;
            qita3.group=5;
            this.setSelected(qita3,true);
            this.setSelectedAddTouchListner(qita3);
            this.allPanels.push(qita3);


        }
        else if(RULE_VALUE==ROOM_TYPE_GAOHUZI)
        {

            this.renshu_value=-2;


            var node = parseUI("res/ui/sub/chuangjian_gaohuzi.json", CENTER);
            this.addChild(node);


            this.layerNode=node;


            this.scrollView=ccui.helper.seekWidgetByName(node, "scroll");
            this.scrollView.setScrollBarEnabled(false);

            var renshu2= ccui.helper.seekWidgetByName(node, "renshu2");
            renshu2.type=RENSHU_TYPE;
            renshu2.value=3;
            renshu2.group=1;
            this.setSelectedAddTouchListner(renshu2);
            this.allPanels.push(renshu2);
            this.setSelected(renshu2,true);

            var renshu3= ccui.helper.seekWidgetByName(node, "renshu3");
            renshu3.type=RENSHU_TYPE;
            renshu3.value=4;
            renshu3.group=1;
            this.setSelectedAddTouchListner(renshu3);
            this.allPanels.push(renshu3);


            var jushu2= ccui.helper.seekWidgetByName(node, "jushu2");
            jushu2.type=JUSHU_TYPE;
            jushu2.value=50;
            jushu2.group=3;
            this.setSelected(jushu2,true);
            this.setSelectedAddTouchListner(jushu2);
            this.allPanels.push(jushu2);

            var lab= ccui.helper.seekWidgetByName(jushu2, "t");
            lab.setString("系统随机定庄");

            //其他
            var qita2= ccui.helper.seekWidgetByName(node, "qita2");
            qita2.type=QITATYPE;
            qita2.value=0;
            qita2.group=5;

            this.setSelectedAddTouchListner(qita2);
            this.allPanels.push(qita2);

            var qita3= ccui.helper.seekWidgetByName(node, "qita3");
            qita3.type=QITATYPE;
            qita3.value=1;
            qita3.group=5;
            this.setSelected(qita3,true);
            this.setSelectedAddTouchListner(qita3);
            this.allPanels.push(qita3);


            //其他
            var guize2= ccui.helper.seekWidgetByName(node, "guize2");
            guize2.type=GUIZE_TYPE;
            guize2.value=0;
            guize2.group=6;

            this.setSelectedAddTouchListner(guize2);
            this.allPanels.push(guize2);

            var guize3= ccui.helper.seekWidgetByName(node, "guize3");
            guize3.type=GUIZE_TYPE;
            guize3.value=1;
            guize3.group=6;
            this.setSelected(guize3,true);
            this.setSelectedAddTouchListner(guize3);
            this.allPanels.push(guize3);


        }
        else if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
        {
            this.renshu_value=3;
            this.ju_value=10;
            this.fengding_value=200;
            this.gunze_value=0;
            this.qita_value=0;


            var node = parseUI("res/ui/sub/chuangjian_waihuzi.json", CENTER);
            this.addChild(node);

            this.layerNode=node;

            this.scrollView=ccui.helper.seekWidgetByName(node, "scroll");
            this.scrollView.setScrollBarEnabled(false);


            //人数
            var renshu2= ccui.helper.seekWidgetByName(node, "renshu2");
            renshu2.type=RENSHU_TYPE;
            renshu2.value=2;
            renshu2.group=1;
            this.setSelectedAddTouchListner(renshu2);
            this.allPanels.push(renshu2);

            var renshu3= ccui.helper.seekWidgetByName(node, "renshu3");
            renshu3.type=RENSHU_TYPE;
            renshu3.value=3;
            renshu3.group=1;
            this.setSelected(renshu3,true);
            this.setSelectedAddTouchListner(renshu3);
            this.allPanels.push(renshu3);

            //起胡
            var qihu2= ccui.helper.seekWidgetByName(node, "qihu2");
            qihu2.type=QIHU;
            qihu2.value=6;
            qihu2.group=2;
            this.setSelected(qihu2,true);
            this.setSelectedAddTouchListner(qihu2);
            this.allPanels.push(qihu2);

            var qihu3= ccui.helper.seekWidgetByName(node, "qihu3");
            qihu3.type=QIHU;
            qihu3.value=7;
            qihu3.group=2;
            this.setSelectedAddTouchListner(qihu3);
            this.allPanels.push(qihu3);

            //局数
            var jushu2= ccui.helper.seekWidgetByName(node, "jushu2");
            jushu2.type=JUSHU_TYPE;
            jushu2.value=10;
            jushu2.group=3;
            this.setSelected(jushu2,true);
            this.setSelectedAddTouchListner(jushu2);
            this.allPanels.push(jushu2);

            var jushu3= ccui.helper.seekWidgetByName(node, "jushu3");
            jushu3.type=JUSHU_TYPE;
            jushu3.value=20;
            jushu3.group=3;
            this.setSelectedAddTouchListner(jushu3);
            this.allPanels.push(jushu3);

            //封顶
            var fengding2= ccui.helper.seekWidgetByName(node, "fengding2");
            fengding2.type=FENGDING;
            fengding2.value=200;
            fengding2.group=4;
            this.setSelected(fengding2,true);
            this.setSelectedAddTouchListner(fengding2);
            this.allPanels.push(fengding2);

            var fengding3= ccui.helper.seekWidgetByName(node, "fengding3");
            fengding3.type=FENGDING;
            fengding3.value=300;
            fengding3.group=4;
            this.setSelectedAddTouchListner(fengding3);
            this.allPanels.push(fengding3);


            var fengding4= ccui.helper.seekWidgetByName(node, "fengding4");
            fengding4.type=FENGDING;
            fengding4.value=400;
            fengding4.group=4;
            this.setSelectedAddTouchListner(fengding4);
            this.allPanels.push(fengding4);

            var fengding5= ccui.helper.seekWidgetByName(node, "fengding5");
            fengding5.type=FENGDING;
            fengding5.value=500;
            fengding5.group=4;
            this.setSelectedAddTouchListner(fengding5);
            this.allPanels.push(fengding5);


            //规则海底捞2翻
            var guize2= ccui.helper.seekWidgetByName(node, "guize2");
            guize2.type=GUIZE_TYPE;
            guize2.value=0;
            guize2.group=5;
            this.setSelected(guize2,true);
            this.setSelectedAddTouchListner(guize2);
            this.allPanels.push(guize2);

            var guize3= ccui.helper.seekWidgetByName(node, "guize3");
            guize3.type=GUIZE_TYPE;
            guize3.value=1;
            guize3.group=5;
            this.setSelectedAddTouchListner(guize3);
            this.allPanels.push(guize3);

            //牌数
            var paishu2= ccui.helper.seekWidgetByName(node, "paishu2");
            paishu2.type=QITATYPE;
            paishu2.value=0;
            paishu2.group=6;
            this.setSelected(paishu2,true);
            this.setSelectedAddTouchListner(paishu2);
            this.allPanels.push(paishu2);

            var paishu3= ccui.helper.seekWidgetByName(node, "paishu3");
            paishu3.type=QITATYPE;
            paishu3.value=1;
            paishu3.group=6;
            this.setSelectedAddTouchListner(paishu3);
            this.allPanels.push(paishu3);


            //名堂
            var choushui2= ccui.helper.seekWidgetByName(node, "choushui2");
            choushui2.type=CHOUSHUI;
            choushui2.value=1;
            choushui2.group=7;
            this.setSelected(choushui2,true);
            this.setSelectedAddTouchListner(choushui2);
            this.allPanels.push(choushui2);


            var choushui3= ccui.helper.seekWidgetByName(node, "choushui3");
            choushui3.type=CHOUSHUI;
            choushui3.value=2;
            choushui3.group=7;
            this.setSelectedAddTouchListner(choushui3);
            this.allPanels.push(choushui3);



        }
        else if(RULE_VALUE==ROOM_TYPE_LOUDI)
        {



            this.renshu_value=-2;


            var node = parseUI("res/ui/sub/chuangjian_loudi.json", CENTER);
            this.addChild(node);

            this.layerNode=node;


            this.scrollView=ccui.helper.seekWidgetByName(node, "scroll");
            this.scrollView.setScrollBarEnabled(false);

            var renshu2= ccui.helper.seekWidgetByName(node, "renshu2");
            renshu2.type=RENSHU_TYPE;
            renshu2.value=3;
            renshu2.group=1;
            this.setSelectedAddTouchListner(renshu2);
            this.allPanels.push(renshu2);
            this.setSelected(renshu2,true);



            var qihu2= ccui.helper.seekWidgetByName(node, "qihu2");
            qihu2.type=QIHU;
            qihu2.value=15;
            qihu2.group=2;
            this.setSelected(qihu2,true);
            this.setSelectedAddTouchListner(qihu2);
            this.allPanels.push(qihu2);

            var jushu2= ccui.helper.seekWidgetByName(node, "jushu2");
            jushu2.type=JUSHU_TYPE;
            jushu2.value=100;
            jushu2.group=3;
            this.setSelected(jushu2,true);
            this.setSelectedAddTouchListner(jushu2);
            this.allPanels.push(jushu2);


            //其他
            var fengding2= ccui.helper.seekWidgetByName(node, "fengding2");
            fengding2.type=FENGDING;
            fengding2.value=200;
            fengding2.group=5;
            this.setSelected(fengding2,true);
            this.setSelectedAddTouchListner(fengding2);
            this.allPanels.push(fengding2);

            var fengding3= ccui.helper.seekWidgetByName(node, "fengding3");
            fengding3.type=FENGDING;
            fengding3.value=400;
            fengding3.group=5;
            this.setSelectedAddTouchListner(fengding3);
            this.allPanels.push(fengding3);


            var qita2= ccui.helper.seekWidgetByName(node, "qita2");
            qita2.type=QITATYPE;
            qita2.value=0;
            qita2.group=6;
            this.setSelectedAddTouchListner(qita2);
            this.allPanels.push(qita2);

            var qita3= ccui.helper.seekWidgetByName(node, "qita3");
            qita3.type=QITATYPE;
            qita3.value=1;
            qita3.group=6;
            this.setSelected(qita3,true);
            this.setSelectedAddTouchListner(qita3);
            this.allPanels.push(qita3);




        }
        else if(RULE_VALUE==ROOM_TYPE_SHUANGFENG)
        {



            this.renshu_value=-2;


            var node = parseUI("res/ui/sub/chuangjian_shuangfeng.json", CENTER);
            this.addChild(node);

            this.layerNode=node;


            this.scrollView=ccui.helper.seekWidgetByName(node, "scroll");
            this.scrollView.setScrollBarEnabled(false);

            var renshu2= ccui.helper.seekWidgetByName(node, "renshu2");
            renshu2.type=RENSHU_TYPE;
            renshu2.value=3;
            renshu2.group=1;
            this.setSelectedAddTouchListner(renshu2);
            this.allPanels.push(renshu2);
            this.setSelected(renshu2,true);



            var qihu2= ccui.helper.seekWidgetByName(node, "qihu2");
            qihu2.type=QIHU;
            qihu2.value=15;
            qihu2.group=2;
            this.setSelected(qihu2,true);
            this.setSelectedAddTouchListner(qihu2);
            this.allPanels.push(qihu2);

            var jushu2= ccui.helper.seekWidgetByName(node, "jushu2");
            jushu2.type=JUSHU_TYPE;
            jushu2.value=100;
            jushu2.group=3;
            this.setSelected(jushu2,true);
            this.setSelectedAddTouchListner(jushu2);
            this.allPanels.push(jushu2);


            //其他
            var fengding2= ccui.helper.seekWidgetByName(node, "fengding2");
            fengding2.type=FENGDING;
            fengding2.value=110;
            fengding2.group=5;
            this.setSelected(fengding2,true);
            this.setSelectedAddTouchListner(fengding2);
            this.allPanels.push(fengding2);


            var qita2= ccui.helper.seekWidgetByName(node, "qita2");
            qita2.type=QITATYPE;
            qita2.value=0;
            qita2.group=6;
            this.setSelectedAddTouchListner(qita2);
            this.allPanels.push(qita2);

            var qita3= ccui.helper.seekWidgetByName(node, "qita3");
            qita3.type=QITATYPE;
            qita3.value=1;
            qita3.group=6;
            this.setSelected(qita3,true);
            this.setSelectedAddTouchListner(qita3);
            this.allPanels.push(qita3);





        }
        else if(RULE_VALUE==ROOM_TYPE_LEIYANG)
        {

            this.gunze_value=-2;
            this.ju_value=-2;
            this.renshu_value=-2;


            var node = parseUI("res/ui/sub/chuangjian_leiyang.json", CENTER);
            this.addChild(node);

            this.layerNode=node;

            this.scrollView=ccui.helper.seekWidgetByName(node, "scroll");
            this.scrollView.setScrollBarEnabled(false);




            //起胡
            var qihu2= ccui.helper.seekWidgetByName(node, "qihu2");
            qihu2.type=QIHU;
            qihu2.value=10;
            qihu2.group=2;
            this.setSelected(qihu2,true);
            this.setSelectedAddTouchListner(qihu2);
            this.allPanels.push(qihu2);

            var qihu3= ccui.helper.seekWidgetByName(node, "qihu3");
            qihu3.type=QIHU;
            qihu3.value=6;
            qihu3.group=2;
            this.setSelectedAddTouchListner(qihu3);
            this.allPanels.push(qihu3);


            //局数
            var jushu2= ccui.helper.seekWidgetByName(node, "jushu2");
            jushu2.type=JUSHU_TYPE;
            jushu2.value=4;
            jushu2.group=3;

            this.setSelectedAddTouchListner(jushu2);
            this.allPanels.push(jushu2);

            var jushu3= ccui.helper.seekWidgetByName(node, "jushu3");
            jushu3.type=JUSHU_TYPE;
            jushu3.value=8;
            jushu3.group=3;
            this.setSelected(jushu3,true);
            this.setSelectedAddTouchListner(jushu3);
            this.allPanels.push(jushu3);


            var jushu4= ccui.helper.seekWidgetByName(node, "jushu4");
            jushu4.type=JUSHU_TYPE;
            jushu4.value=12;
            jushu4.group=3;
            this.setSelectedAddTouchListner(jushu4);
            this.allPanels.push(jushu4);

            var jushu5= ccui.helper.seekWidgetByName(node, "jushu5");
            jushu5.type=JUSHU_TYPE;
            jushu5.value=20;
            jushu5.group=3;
            this.setSelectedAddTouchListner(jushu5);
            this.allPanels.push(jushu5);


            //天地红黑
            var guize2= ccui.helper.seekWidgetByName(node, "guize2");
            guize2.type=GUIZE_TYPE;
            guize2.value=0;
            guize2.group=4;
            this.setSelected(guize2,true);
            this.setSelectedAddTouchListner(guize2);
            this.allPanels.push(guize2);


            var guize3= ccui.helper.seekWidgetByName(node, "guize3");
            guize3.type=GUIZE_TYPE;
            guize3.value=1;
            guize3.group=4;
            this.setSelectedAddTouchListner(guize3);
            this.allPanels.push(guize3);

            //三龙四坎
            var qita2= ccui.helper.seekWidgetByName(node, "qita2");
            qita2.type=QITATYPE;
            qita2.value=0;
            qita2.group=5;
            this.setSelected(qita2,true);
            this.setSelectedAddTouchListner(qita2);
            this.allPanels.push(qita2);


            var qita3= ccui.helper.seekWidgetByName(node, "qita3");
            qita3.type=QITATYPE;
            qita3.value=1;
            qita3.group=5;
            this.setSelectedAddTouchListner(qita3);
            this.allPanels.push(qita3);

            //无胡
            var gongneng2= ccui.helper.seekWidgetByName(node, "gongneng2");
            gongneng2.type=GONGNENG;
            gongneng2.value=0;
            gongneng2.group=6;
            this.setSelected(gongneng2,true);
            this.setSelectedAddTouchListner(gongneng2);
            this.allPanels.push(gongneng2);


            var gongneng3= ccui.helper.seekWidgetByName(node, "gongneng3");
            gongneng3.type=GONGNENG;
            gongneng3.value=1;
            gongneng3.group=6;
            this.setSelectedAddTouchListner(gongneng3);
            this.allPanels.push(gongneng3);

            //黑胡
            var choushui2= ccui.helper.seekWidgetByName(node, "choushui2");
            choushui2.type=CHOUSHUI;
            choushui2.value=0;
            choushui2.group=7;
            this.setSelected(choushui2,true);
            this.setSelectedAddTouchListner(choushui2);
            this.allPanels.push(choushui2);


            var choushui3= ccui.helper.seekWidgetByName(node, "choushui3");
            choushui3.type=CHOUSHUI;
            choushui3.value=1;
            choushui3.group=7;
            this.setSelectedAddTouchListner(choushui3);
            this.allPanels.push(choushui3);

            //举手作声
            var jiadi2= ccui.helper.seekWidgetByName(node, "jiadi2");
            jiadi2.type=JIADI;
            jiadi2.value=0;
            jiadi2.group=8;
            this.setSelected(jiadi2,true);
            this.setSelectedAddTouchListner(jiadi2);
            this.allPanels.push(jiadi2);


            var jiadi3= ccui.helper.seekWidgetByName(node, "jiadi3");
            jiadi3.type=JIADI;
            jiadi3.value=1;
            jiadi3.group=8;
            this.setSelectedAddTouchListner(jiadi3);
            this.allPanels.push(jiadi3);


            //人数
            var renshu2= ccui.helper.seekWidgetByName(node, "renshu2");
            renshu2.type=RENSHU_TYPE;
            renshu2.value=3;
            renshu2.group=1;
            this.setSelected(renshu2,true);
            this.setSelectedAddTouchListner(renshu2);
            this.allPanels.push(renshu2);

            var renshu3= ccui.helper.seekWidgetByName(node, "renshu3");
            renshu3.type=RENSHU_TYPE;
            renshu3.value=4;
            renshu3.group=1;
            this.setSelectedAddTouchListner(renshu3);
            this.allPanels.push(renshu3);


        }
        else if(RULE_VALUE==ROOM_TYPE_HENGYANG)
        {

            this.gunze_value=-2;
            this.ju_value=-2;
            this.renshu_value=-2;


            var node = parseUI("res/ui/sub/chuangjian_hengyang.json", CENTER);
            this.addChild(node);

            this.layerNode=node;

            this.scrollView=ccui.helper.seekWidgetByName(node, "scroll");
            this.scrollView.setScrollBarEnabled(false);

            //人数
            var renshu2= ccui.helper.seekWidgetByName(node, "renshu2");
            renshu2.type=RENSHU_TYPE;
            renshu2.value=4;
            renshu2.group=1;
            this.setSelected(renshu2,true);
            this.setSelectedAddTouchListner(renshu2);
            this.allPanels.push(renshu2);


            //起胡
            var qihu2= ccui.helper.seekWidgetByName(node, "qihu2");
            qihu2.type=QIHU;
            qihu2.value=3;
            qihu2.group=2;
            this.setSelected(qihu2,true);
            this.setSelectedAddTouchListner(qihu2);
            this.allPanels.push(qihu2);

            var qihu3= ccui.helper.seekWidgetByName(node, "qihu3");
            qihu3.type=QIHU;
            qihu3.value=6;
            qihu3.group=2;
            this.setSelectedAddTouchListner(qihu3);
            this.allPanels.push(qihu3);

            //局数
            var jushu2= ccui.helper.seekWidgetByName(node, "jushu2");
            jushu2.type=JUSHU_TYPE;
            jushu2.value=4;
            jushu2.group=3;

            this.setSelectedAddTouchListner(jushu2);
            this.allPanels.push(jushu2);

            var jushu3= ccui.helper.seekWidgetByName(node, "jushu3");
            jushu3.type=JUSHU_TYPE;
            jushu3.value=8;
            jushu3.group=3;
            this.setSelected(jushu3,true);
            this.setSelectedAddTouchListner(jushu3);
            this.allPanels.push(jushu3);


            var jushu4= ccui.helper.seekWidgetByName(node, "jushu4");
            jushu4.type=JUSHU_TYPE;
            jushu4.value=12;
            jushu4.group=3;
            this.setSelectedAddTouchListner(jushu4);
            this.allPanels.push(jushu4);

            var jushu5= ccui.helper.seekWidgetByName(node, "jushu5");
            jushu5.type=JUSHU_TYPE;
            jushu5.value=20;
            jushu5.group=3;
            this.setSelectedAddTouchListner(jushu5);
            this.allPanels.push(jushu5);


            //息囤转换
            var guize2= ccui.helper.seekWidgetByName(node, "guize2");
            guize2.type=GUIZE_TYPE;
            guize2.value=3;
            guize2.group=4;
            this.setSelected(guize2,true);
            this.setSelectedAddTouchListner(guize2);
            this.allPanels.push(guize2);


            var guize3= ccui.helper.seekWidgetByName(node, "guize3");
            guize3.type=GUIZE_TYPE;
            guize3.value=1;
            guize3.group=4;
            this.setSelectedAddTouchListner(guize3);
            this.allPanels.push(guize3);



        }
        else if(RULE_VALUE==ROOM_TYPE_GUILIN)
        {



            var node = parseUI("res/ui/sub/chuangjian_guilin.json", CENTER);
            this.addChild(node);

            this.layerNode=node;

            this.scrollView=ccui.helper.seekWidgetByName(node, "scroll");
            this.scrollView.setScrollBarEnabled(false);

            //人数
            var renshu2= ccui.helper.seekWidgetByName(node, "renshu2");
            renshu2.type=RENSHU_TYPE;
            renshu2.value=3;
            renshu2.group=1;
            this.setSelected(renshu2,true);
            this.setSelectedAddTouchListner(renshu2);
            this.allPanels.push(renshu2);


            //起胡
            var qihu2= ccui.helper.seekWidgetByName(node, "qihu2");
            qihu2.type=QIHU;
            qihu2.value=10;
            qihu2.group=2;
            this.setSelected(qihu2,true);
            this.setSelectedAddTouchListner(qihu2);
            this.allPanels.push(qihu2);

            var qihu3= ccui.helper.seekWidgetByName(node, "qihu3");
            qihu3.type=QIHU;
            qihu3.value=15;
            qihu3.group=2;
            this.setSelectedAddTouchListner(qihu3);
            this.allPanels.push(qihu3);

            //局数
            var jushu2= ccui.helper.seekWidgetByName(node, "jushu2");
            jushu2.type=JUSHU_TYPE;
            jushu2.value=10;
            jushu2.group=3;
            this.setSelected(jushu2,true);
            this.setSelectedAddTouchListner(jushu2);
            this.allPanels.push(jushu2);

            var jushu3= ccui.helper.seekWidgetByName(node, "jushu3");
            jushu3.type=JUSHU_TYPE;
            jushu3.value=20;
            jushu3.group=3;
            this.setSelectedAddTouchListner(jushu3);
            this.allPanels.push(jushu3);


            //息囤转换
            var guize2= ccui.helper.seekWidgetByName(node, "guize2");
            guize2.type=GUIZE_TYPE;
            guize2.value=3;
            guize2.group=4;
            this.setSelected(guize2,true);
            this.setSelectedAddTouchListner(guize2);
            this.allPanels.push(guize2);


            var guize3= ccui.helper.seekWidgetByName(node, "guize3");
            guize3.type=GUIZE_TYPE;
            guize3.value=5;
            guize3.group=4;
            this.setSelectedAddTouchListner(guize3);
            this.allPanels.push(guize3);


            //醒
            var qita2= ccui.helper.seekWidgetByName(node, "qita2");
            qita2.type=QITATYPE;
            qita2.value=0;
            qita2.group=5;
            qita2.isFuXuan=true;
            this.setSelectedAddTouchListner(qita2);
            this.allPanels.push(qita2);

            var qita2_b= ccui.helper.seekWidgetByName(qita2, "r1");
            this.selectedClicked(qita2_b,ccui.Widget.TOUCH_ENDED);


            var fengding2= ccui.helper.seekWidgetByName(node, "fengding2");
            fengding2.type=FENGDING;
            fengding2.value=0;
            fengding2.group=7;
            fengding2.isFuXuan=true;
            this.setSelectedAddTouchListner(fengding2);
            this.allPanels.push(fengding2);


            var gui2= ccui.helper.seekWidgetByName(node, "gui2");
            gui2.type=GUI;
            gui2.value=0;
            gui2.group=8;
            gui2.isFuXuan=true;
            this.setSelectedAddTouchListner(gui2);
            this.allPanels.push(gui2);


            //var qita5= ccui.helper.seekWidgetByName(node, "qita5");
            //qita5.type=QITATYPE;
            //qita5.value=3;
            //qita5.group=5;
            //this.setSelectedAddTouchListner(qita5);
            //this.allPanels.push(qita5);



            var jiadi2= ccui.helper.seekWidgetByName(node, "jiadi2");
            jiadi2.type=JIADI;
            jiadi2.value=1;
            jiadi2.group=6;
            this.setSelectedAddTouchListner(jiadi2);
            this.allPanels.push(jiadi2);


            var jiadi3= ccui.helper.seekWidgetByName(node, "jiadi3");
            jiadi3.type=JIADI;
            jiadi3.value=0;
            jiadi3.group=6;
            this.setSelected(jiadi3,true);
            this.setSelectedAddTouchListner(jiadi3);
            this.allPanels.push(jiadi3);


        }
        else if(RULE_VALUE==ROOM_TYPE_HUAIHUA)
        {

            this.gunze_value=-2;
            this.ju_value=-2;
            this.renshu_value=-2;


            var node = parseUI("res/ui/sub/chuangjian_huaihua.json", CENTER);
            this.addChild(node);

            this.layerNode=node;

            this.scrollView=ccui.helper.seekWidgetByName(node, "scroll");
            this.scrollView.setScrollBarEnabled(false);

            //人数
            var renshu2= ccui.helper.seekWidgetByName(node, "renshu2");
            renshu2.type=RENSHU_TYPE;
            renshu2.value=3;
            renshu2.group=1;
            this.setSelected(renshu2,true);
            this.setSelectedAddTouchListner(renshu2);
            this.allPanels.push(renshu2);


            //起胡
            var qihu2= ccui.helper.seekWidgetByName(node, "qihu2");
            qihu2.type=QIHU;
            qihu2.value=9;
            qihu2.group=2;
            this.setSelected(qihu2,true);
            this.setSelectedAddTouchListner(qihu2);
            this.allPanels.push(qihu2);

            //局数
            var jushu2= ccui.helper.seekWidgetByName(node, "jushu2");
            jushu2.type=JUSHU_TYPE;
            jushu2.value=4;
            jushu2.group=3;

            this.setSelectedAddTouchListner(jushu2);
            this.allPanels.push(jushu2);

            var jushu3= ccui.helper.seekWidgetByName(node, "jushu3");
            jushu3.type=JUSHU_TYPE;
            jushu3.value=8;
            jushu3.group=3;
            this.setSelected(jushu3,true);
            this.setSelectedAddTouchListner(jushu3);
            this.allPanels.push(jushu3);


            var jushu4= ccui.helper.seekWidgetByName(node, "jushu4");
            jushu4.type=JUSHU_TYPE;
            jushu4.value=12;
            jushu4.group=3;
            this.setSelectedAddTouchListner(jushu4);
            this.allPanels.push(jushu4);

            var jushu5= ccui.helper.seekWidgetByName(node, "jushu5");
            jushu5.type=JUSHU_TYPE;
            jushu5.value=20;
            jushu5.group=3;
            this.setSelectedAddTouchListner(jushu5);
            this.allPanels.push(jushu5);


            //息囤转换
            var guize2= ccui.helper.seekWidgetByName(node, "guize2");
            guize2.type=GUIZE_TYPE;
            guize2.value=0;
            guize2.group=4;
            this.setSelected(guize2,true);
            this.setSelectedAddTouchListner(guize2);
            this.allPanels.push(guize2);


            var guize3= ccui.helper.seekWidgetByName(node, "guize3");
            guize3.type=GUIZE_TYPE;
            guize3.value=1;
            guize3.group=4;
            this.setSelectedAddTouchListner(guize3);
            this.allPanels.push(guize3);



        }
        else if(RULE_VALUE==ROOM_TYPE_HONGHEIHU)
        {




            var node = parseUI("res/ui/sub/chuangjian_hongheihu.json", CENTER);
            this.addChild(node);

            this.layerNode=node;

            this.scrollView=ccui.helper.seekWidgetByName(node, "scroll");
            this.scrollView.setScrollBarEnabled(false);

            //人数
            var renshu2= ccui.helper.seekWidgetByName(node, "renshu2");
            renshu2.type=RENSHU_TYPE;
            renshu2.value=3;
            renshu2.group=1;
            this.setSelected(renshu2,true);
            this.setSelectedAddTouchListner(renshu2);
            this.allPanels.push(renshu2);


            //起胡
            var qihu2= ccui.helper.seekWidgetByName(node, "qihu2");
            qihu2.type=QIHU;
            qihu2.value=10;
            qihu2.group=2;
            this.setSelected(qihu2,true);
            this.setSelectedAddTouchListner(qihu2);
            this.allPanels.push(qihu2);

            //局数
            var jushu2= ccui.helper.seekWidgetByName(node, "jushu2");
            jushu2.type=JUSHU_TYPE;
            jushu2.value=10;
            jushu2.group=3;
            this.setSelected(jushu2,true);
            this.setSelectedAddTouchListner(jushu2);
            this.allPanels.push(jushu2);

            var jushu3= ccui.helper.seekWidgetByName(node, "jushu3");
            jushu3.type=JUSHU_TYPE;
            jushu3.value=20;
            jushu3.group=3;
            this.setSelectedAddTouchListner(jushu3);
            this.allPanels.push(jushu3);



            //翻码
            var qita2= ccui.helper.seekWidgetByName(node, "qita2");
            qita2.type=QITATYPE;
            qita2.value=1;
            qita2.group=4;
            this.setSelected(qita2,true);
            this.setSelectedAddTouchListner(qita2);
            this.allPanels.push(qita2);


            var qita3= ccui.helper.seekWidgetByName(node, "qita3");
            qita3.type=QITATYPE;
            qita3.value=2;
            qita3.group=4;
            this.setSelectedAddTouchListner(qita3);
            this.allPanels.push(qita3);




            //倍数
            var guize2= ccui.helper.seekWidgetByName(node, "guize2");
            guize2.type=GUIZE_TYPE;
            guize2.value=1;
            guize2.group=5;
            this.setSelected(guize2,true);
            this.setSelectedAddTouchListner(guize2);
            this.allPanels.push(guize2);

            var guize3= ccui.helper.seekWidgetByName(node, "guize3");
            guize3.type=GUIZE_TYPE;
            guize3.value=2;
            guize3.group=5;
            this.setSelectedAddTouchListner(guize3);
            this.allPanels.push(guize3);


            var guize4= ccui.helper.seekWidgetByName(node, "guize4");
            guize4.type=GUIZE_TYPE;
            guize4.value=3;
            guize4.group=5;
            this.setSelectedAddTouchListner(guize4);
            this.allPanels.push(guize4);


            var fengding2= ccui.helper.seekWidgetByName(node, "fengding2");
            fengding2.type=FENGDING;
            fengding2.value=1;
            fengding2.group=6;
            this.setSelected(fengding2,true);
            this.setSelectedAddTouchListner(fengding2);
            this.allPanels.push(fengding2);


            var fengding3= ccui.helper.seekWidgetByName(node, "fengding3");
            fengding3.type=FENGDING;
            fengding3.value=2;
            fengding3.group=6;
            this.setSelectedAddTouchListner(fengding3);
            this.allPanels.push(fengding3);


        }
        else if(RULE_VALUE==ROOM_TYPE_DAZIPAI)
        {



            var node = parseUI("res/ui/sub/chuangjian_dazipai.json", CENTER);
            this.addChild(node);

            this.layerNode=node;

            this.scrollView=ccui.helper.seekWidgetByName(node, "scroll");
            this.scrollView.setScrollBarEnabled(false);

            //人数
            var renshu2= ccui.helper.seekWidgetByName(node, "renshu2");
            renshu2.type=RENSHU_TYPE;
            renshu2.value=3;
            renshu2.group=1;
            this.setSelected(renshu2,true);
            this.setSelectedAddTouchListner(renshu2);
            this.allPanels.push(renshu2);


            //起胡
            var qihu2= ccui.helper.seekWidgetByName(node, "qihu2");
            qihu2.type=QIHU;
            qihu2.value=10;
            qihu2.group=2;
            this.setSelected(qihu2,true);
            this.setSelectedAddTouchListner(qihu2);
            this.allPanels.push(qihu2);

            var qihu3= ccui.helper.seekWidgetByName(node, "qihu3");
            qihu3.type=QIHU;
            qihu3.value=15;
            qihu3.group=2;
            this.setSelectedAddTouchListner(qihu3);
            this.allPanels.push(qihu3);

            //局数
            var jushu2= ccui.helper.seekWidgetByName(node, "jushu2");
            jushu2.type=JUSHU_TYPE;
            jushu2.value=10;
            jushu2.group=3;
            this.setSelected(jushu2,true);
            this.setSelectedAddTouchListner(jushu2);
            this.allPanels.push(jushu2);

            var jushu3= ccui.helper.seekWidgetByName(node, "jushu3");
            jushu3.type=JUSHU_TYPE;
            jushu3.value=20;
            jushu3.group=3;
            this.setSelectedAddTouchListner(jushu3);
            this.allPanels.push(jushu3);


            //息囤转换
            var guize2= ccui.helper.seekWidgetByName(node, "guize2");
            guize2.type=GUIZE_TYPE;
            guize2.value=3;
            guize2.group=4;
            this.setSelected(guize2,true);
            this.setSelectedAddTouchListner(guize2);
            this.allPanels.push(guize2);


            var guize3= ccui.helper.seekWidgetByName(node, "guize3");
            guize3.type=GUIZE_TYPE;
            guize3.value=5;
            guize3.group=4;
            this.setSelectedAddTouchListner(guize3);
            this.allPanels.push(guize3);


            //醒
            var qita2= ccui.helper.seekWidgetByName(node, "qita2");
            qita2.type=QITATYPE;
            qita2.value=0;
            qita2.group=5;
            qita2.isFuXuan=true;
            this.setSelectedAddTouchListner(qita2);
            this.allPanels.push(qita2);

            var qita2_b= ccui.helper.seekWidgetByName(qita2, "r1");
            this.selectedClicked(qita2_b,ccui.Widget.TOUCH_ENDED);


            var fengding2= ccui.helper.seekWidgetByName(node, "fengding2");
            fengding2.type=FENGDING;
            fengding2.value=0;
            fengding2.group=7;
            fengding2.isFuXuan=true;
            this.setSelectedAddTouchListner(fengding2);
            this.allPanels.push(fengding2);


            var gui2= ccui.helper.seekWidgetByName(node, "gui2");
            gui2.type=GUI;
            gui2.value=0;
            gui2.group=8;
            gui2.isFuXuan=true;
            this.setSelectedAddTouchListner(gui2);
            this.allPanels.push(gui2);


            //var qita5= ccui.helper.seekWidgetByName(node, "qita5");
            //qita5.type=QITATYPE;
            //qita5.value=3;
            //qita5.group=5;
            //this.setSelectedAddTouchListner(qita5);
            //this.allPanels.push(qita5);



            var jiadi2= ccui.helper.seekWidgetByName(node, "jiadi2");
            jiadi2.type=JIADI;
            jiadi2.value=1;
            jiadi2.group=6;
            this.setSelectedAddTouchListner(jiadi2);
            this.allPanels.push(jiadi2);


            var jiadi3= ccui.helper.seekWidgetByName(node, "jiadi3");
            jiadi3.type=JIADI;
            jiadi3.value=0;
            jiadi3.group=6;
            this.setSelected(jiadi3,true);
            this.setSelectedAddTouchListner(jiadi3);
            this.allPanels.push(jiadi3);


        }
        else if(RULE_VALUE==ROOM_TYPE_PENGHUZI)
        {

            var node = parseUI("res/ui/sub/chuangjian_penghuzi.json", CENTER);
            this.addChild(node);

            this.layerNode=node;

            this.scrollView=ccui.helper.seekWidgetByName(node, "scroll");
            this.scrollView.setScrollBarEnabled(false);

            //人数
            var renshu2= ccui.helper.seekWidgetByName(node, "renshu2");
            renshu2.type=RENSHU_TYPE;
            renshu2.value=3;
            renshu2.group=1;
            this.setSelected(renshu2,true);
            this.setSelectedAddTouchListner(renshu2);
            this.allPanels.push(renshu2);

            var renshu3= ccui.helper.seekWidgetByName(node, "renshu3");
            renshu3.type=RENSHU_TYPE;
            renshu3.value=4;
            renshu3.group=1;
            this.setSelectedAddTouchListner(renshu3);
            this.allPanels.push(renshu3);

            //起胡
            var qihu2= ccui.helper.seekWidgetByName(node, "qihu2");
            qihu2.type=QIHU;
            qihu2.value=0;
            qihu2.group=2;
            this.setSelected(qihu2,true);
            this.setSelectedAddTouchListner(qihu2);
            this.allPanels.push(qihu2);

            //局数
            var jushu2= ccui.helper.seekWidgetByName(node, "jushu2");
            jushu2.type=JUSHU_TYPE;
            jushu2.value=8;
            jushu2.group=3;

            this.setSelectedAddTouchListner(jushu2);
            this.allPanels.push(jushu2);

            var jushu3= ccui.helper.seekWidgetByName(node, "jushu3");
            jushu3.type=JUSHU_TYPE;
            jushu3.value=16;
            jushu3.group=3;
            this.setSelected(jushu3,true);
            this.setSelectedAddTouchListner(jushu3);
            this.allPanels.push(jushu3);


            //中庄机制
            var guize2= ccui.helper.seekWidgetByName(node, "guize2");
            guize2.type=GUIZE_TYPE;
            guize2.value=1;
            guize2.group=4;
            this.setSelected(guize2,true);
            this.setSelectedAddTouchListner(guize2);
            this.allPanels.push(guize2);


            var guize3= ccui.helper.seekWidgetByName(node, "guize3");
            guize3.type=GUIZE_TYPE;
            guize3.value=2;
            guize3.group=4;
            this.setSelectedAddTouchListner(guize3);
            this.allPanels.push(guize3);



        }
        else{


            var dialog=new DialogLayer();
            dialog.show("正在努力开发中...");
            this.addChild(dialog,100);


            return;
        }

        // var scrollH=0;
        //
        // var obj=null;
        // var len=rule_info.length;
        // for(var i=0;i<len;i++)
        // {
        //     var o=rule_info[i];
        //     if(o.Id==RULE_VALUE)
        //     {
        //         obj=o;
        //         break;
        //     }
        //
        // }
        //
        // // //标题
        // var jianjie1= ccui.helper.seekWidgetByName(node, "title");
        // jianjie1.setString(obj.title);
        // //
        // // var jianjie2= ccui.helper.seekWidgetByName(node, "jianjie2");
        // // jianjie2.setString(obj.des);
        //
        //
        // var renshu1= ccui.helper.seekWidgetByName(node, "renshu1");
        // var renshu2= ccui.helper.seekWidgetByName(node, "renshu2");
        // renshu1.visible=false;
        // renshu2.visible=false;
        // var tmpPanel=renshu2;
        //
        // var gap_w=300;
        //
        // if(obj.renshu!=undefined)
        // {
        //
        //     this.renshu_value=-2;
        //
        //     renshu1.visible=true;
        //     var list=obj.renshu.list;
        //     var index=obj.renshu.defaultIndex;
        //     var count=list.length;
        //     for(var j=0;j<count;j++)
        //     {
        //         var a=list[j];
        //         var pClone=tmpPanel.clone();
        //         pClone.visible=true;
        //
        //         pClone.x+=(j*gap_w);
        //
        //         pClone.group=1;
        //
        //         this.setTxt(pClone,a+"人");
        //         tmpPanel.getParent().addChild(pClone);
        //
        //         this.setSelectedAddTouchListner(pClone);
        //
        //         pClone.type=RENSHU_TYPE;
        //         pClone.value=a;
        //
        //         this.allPanels.push(pClone);
        //
        //         if(j==index)
        //         {
        //             this.setSelected(pClone,true);
        //         }
        //     }
        //
        // }
        //
        //
        //
        // var jushu1= ccui.helper.seekWidgetByName(node, "jushu1");
        // var jushu2= ccui.helper.seekWidgetByName(node, "jushu2");
        // jushu1.visible=false;
        // jushu2.visible=false;
        // tmpPanel=jushu2;
        //
        // if(obj.jushu!=undefined)
        // {
        //
        //     this.ju_value=-2;
        //
        //     jushu1.visible=true;
        //     var list=obj.jushu.list;
        //     var index=obj.jushu.defaultIndex;
        //     var count=list.length;
        //     for(var j=0;j<count;j++)
        //     {
        //         var a=list[j];
        //         var pClone=tmpPanel.clone();
        //         pClone.visible=true;
        //
        //         pClone.x+=(j*gap_w);
        //         pClone.group=2;
        //
        //         if(a==100)
        //         {
        //             this.setTxt(pClone,"满百胡结束");
        //         }
        //         else{
        //
        //             if(RULE_VALUE==ROOM_TYPE_BINZHOU)
        //             {
        //                 if(a==8)
        //                 {
        //                     this.setTxt(pClone,a+"局(2张房卡)");
        //                 }
        //                 else if(a==12)
        //                 {
        //                     this.setTxt(pClone,a+"局(3张房卡)");
        //                 }
        //                 else{
        //                     this.setTxt(pClone,a+"局(4张房卡)");
        //
        //
        //                 }
        //
        //             }
        //             else{
        //                 this.setTxt(pClone,a+"局");
        //             }
        //
        //         }
        //
        //         tmpPanel.getParent().addChild(pClone);
        //         this.setSelectedAddTouchListner(pClone);
        //
        //         pClone.type=JUSHU_TYPE;
        //         pClone.value=a;
        //         this.allPanels.push(pClone);
        //
        //         if(j==index)
        //         {
        //             this.setSelected(pClone,true);
        //         }
        //     }
        //
        // }
        //
        // var guize1= ccui.helper.seekWidgetByName(node, "guize1");
        // var guize2= ccui.helper.seekWidgetByName(node, "guize2");
        // guize1.visible=false;
        // guize2.visible=false;
        // tmpPanel=guize2;
        //
        // if(RULE_VALUE==ROOM_TYPE_BINZHOU)
        // {
        //     guize1.setString("息囤转换:");
        // }
        // else if(RULE_VALUE==ROOM_TYPE_HONGHU_147)
        // {
        //     guize1.setString("息墩转换:");
        // }
        //
        // if(obj.guize!=undefined)
        // {
        //     this.gunze_value=-2;
        //
        //     guize1.visible=true;
        //     var list=obj.guize.list;
        //     var index=obj.guize.defaultIndex;
        //     var count=list.length;
        //     for(var j=0;j<count;j++)
        //     {
        //         var a=list[j];
        //         var pClone=tmpPanel.clone();
        //         pClone.visible=true;
        //
        //         pClone.x+=(j*gap_w);
        //
        //         pClone.group=3;
        //
        //
        //         this.setTxt(pClone,a+"/1");
        //
        //         tmpPanel.getParent().addChild(pClone);
        //         this.setSelectedAddTouchListner(pClone);
        //
        //         pClone.type=GUIZE_TYPE;
        //         pClone.value=a;
        //         this.allPanels.push(pClone);
        //         if(j==index)
        //         {
        //             this.setSelected(pClone,true);
        //         }
        //     }
        //
        // }
        //
        // var qita1= ccui.helper.seekWidgetByName(node, "qita1");
        // var qita2= ccui.helper.seekWidgetByName(node, "qita2");
        // qita1.visible=false;
        // qita2.visible=false;
        // tmpPanel=qita2;
        // if(RULE_VALUE==ROOM_TYPE_HONGHU_147)
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
        //             this.setTxt(pClone,"天地红黑乌加一墩");
        //         }
        //         else{
        //             this.setTxt(pClone,"天地红黑乌不加墩");
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

        this.wanfa = ccui.helper.seekWidgetByName(node, "wanfa");
        if(DAIKAIFANG==1)
        {
            this.wanfa.setTitleText("房间列表");
        }

        this.wanfa.addTouchEventListener(this.wanfaClicked,this);




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

                    socketMgr.close2();

                    if(DAIKAIFANG==1)
                    {

                        if(target.loadLayer!=null&&target.loadLayer!=undefined)
                        {
                            target.loadLayer.removeFromParent(true);
                            target.loadLayer=null;
                        }

                        var roomList=new RoomListLayer(target);
                        target.addChild(roomList,100);
                    }
                    else{
                        SceneManager.getInstance().changeScene(ROOM_SCENE,REPLACE_SCENE);
                    }


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
                else if(body.state==-3)
                {

                    if(target.loadLayer!=null)
                    {
                        target.loadLayer.removeFromParent(true);
                        target.loadLayer=null;
                    }

                    var dialog=new DialogLayer();
                    dialog.show(body.txt);
                    target.addChild(dialog);

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



        if(isSelected||(panel.isFuXuan!=undefined&&panel.isFuXuan))
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


                if(RULE_VALUE==ROOM_TYPE_BINZHOU){
                    //起胡
                    var qihu2= ccui.helper.seekWidgetByName(this.layerNode, "qihu2");
                    var lab= ccui.helper.seekWidgetByName(qihu2, "t");

                    if(this.renshu_value==3)
                    {
                        lab.setString("9胡");
                        qihu2.value=9;

                    }
                    else if(this.renshu_value==4)
                    {
                        lab.setString("3胡");
                        qihu2.value=3;

                    }

                }
                else if(RULE_VALUE==ROOM_TYPE_BINZHOU_YONGXING){
                    //起胡
                    var qihu2= ccui.helper.seekWidgetByName(this.layerNode, "qihu2");
                    var lab= ccui.helper.seekWidgetByName(qihu2, "t");

                    if(this.renshu_value==3)
                    {
                        lab.setString("3胡");
                        qihu2.value=3;

                    }
                    else if(this.renshu_value==4)
                    {
                        lab.setString("3胡");
                        qihu2.value=3;

                    }

                }
                else if(RULE_VALUE==ROOM_TYPE_LEIYANG){//耒阳
                    //起胡
                    var qihu2= ccui.helper.seekWidgetByName(this.layerNode, "qihu2");
                    var lab2= ccui.helper.seekWidgetByName(qihu2, "t");

                    var qihu3= ccui.helper.seekWidgetByName(this.layerNode, "qihu3");
                    var lab3= ccui.helper.seekWidgetByName(qihu3, "t");


                    var choushui2= ccui.helper.seekWidgetByName(this.layerNode, "choushui2");
                    var choushui2Lab= ccui.helper.seekWidgetByName(choushui2, "t");

                    var choushui3= ccui.helper.seekWidgetByName(this.layerNode, "choushui3");
                    var choushui3Lab= ccui.helper.seekWidgetByName(choushui3, "t");


                    var qita1= ccui.helper.seekWidgetByName(this.layerNode, "qita1");


                    var qita2= ccui.helper.seekWidgetByName(this.layerNode, "qita2");
                    var qita2Lab= ccui.helper.seekWidgetByName(qita2, "t");

                    var qita3= ccui.helper.seekWidgetByName(this.layerNode, "qita3");
                    var qita3Lab= ccui.helper.seekWidgetByName(qita3, "t");




                    if(this.renshu_value==3)
                    {
                        lab2.setString("10胡");
                        qihu2.value=10;

                        var r2= ccui.helper.seekWidgetByName(qihu2, "r1");
                        this.selectedClicked(r2,ccui.Widget.TOUCH_ENDED);


                        qihu3.visible=false;


                        //黑胡 x2
                        var r1= ccui.helper.seekWidgetByName(choushui2, "r1");
                        this.selectedClicked(r1,ccui.Widget.TOUCH_ENDED);
                        choushui3.visible=false;

                        qita2.visible=true;
                        qita3.visible=true;
                        qita1.visible=true;


                    }
                    else if(this.renshu_value==4)
                    {
                        lab2.setString("3胡");
                        qihu2.value=3;

                        qihu3.visible=true;
                        lab3.setString("6胡");
                        qihu3.value=6;

                        var rr1= ccui.helper.seekWidgetByName(qihu2, "r1");
                        this.selectedClicked(rr1,ccui.Widget.TOUCH_ENDED);

                        //黑胡 x2

                        choushui3.visible=true;

                        qita2.visible=false;
                        qita3.visible=false;
                        qita1.visible=false;

                        var r1= ccui.helper.seekWidgetByName(qita3, "r1");
                        this.selectedClicked(r1,ccui.Widget.TOUCH_ENDED);


                    }

                }




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

                if(RULE_VALUE==ROOM_TYPE_WAIHUZI){

                    if(panel.value==1)
                    {
                        //50牌 海底捞4翻
                        var guize3= ccui.helper.seekWidgetByName(this.layerNode, "guize3");
                        var r1= ccui.helper.seekWidgetByName(guize3, "r1");
                        this.selectedClicked(r1,ccui.Widget.TOUCH_ENDED);

                        this.qita_value=panel.value;

                    }
                    else{
                        this.qita_value=panel.value;
                    }



                }
                else{

                    this.qita_value=panel.value;


                }

            }
            else if(type==QIHU)
            {
                 this.qihu_value=panel.value;
            }
            else if(type==FENGDING)
            {
                this.fengding_value=panel.value;

            }
            else if(type==CHOUSHUI)
            {
                this.choushui_value=panel.value;
            }
            else if(type==GONGNENG)
            {
                this.gongneng_value=panel.value;
            }
            else if(type==JIADI)
            {
                this.jiadi_value=panel.value;
            }
            else if(type==GUI)
            {
                this.gui_value=panel.value;
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


    wanfaClicked:function(sender, type)
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

                if(DAIKAIFANG==1)
                {
                    var roomList=new RoomListLayer(this);
                    this.addChild(roomList,100);
                }
                else{
                    var layer=new JieShaoLayer(this.sceneId);
                    this.addChild(layer,100);
                }


                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


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
              

                // if(RULE_VALUE==ROOM_TYPE_BINZHOU)
                // {
                //     var dialog=new DialogLayer();
                //     dialog.show("[玩法正在开发中,敬请期待!]");
                //     this.addChild(dialog);
                //     return;
                // }

                var that=this;

                var getLayer=new GetServerLayer(0,"",function(state)
                {

                    if(state==0)
                    {

                        if(that.loadLayer!=null)
                        {
                            that.loadLayer.removeFromParent(true);
                            that.loadLayer=null;
                        }
                        that.loadLayer=new LoadLayer();
                        that.addChild(that.loadLayer);

                        var req=new CreateRoomRequest();
                        req.uid=myPlayerInfo.uid;
                        req.renshu=that.renshu_value;
                        req.gongneng=that.gongneng_value;
                        req.choushui=that.choushui_value;
                        req.gunze=that.gunze_value;
                        req.ju=that.ju_value;
                        req.qita=that.qita_value;
                        req.roomType=RULE_VALUE;
                        req.fangfei=that.fangfei_value;
                        req.jiadi=that.jiadi_value;
                        req.qihu=that.qihu_value;
                        req.fengding=that.fengding_value;
                        req.zimofanbeo=that.zimofanbei_value;
                        req.fangpaobaopei=that.fangpaobaopei_value;
                        req.gui=that.gui_value;

                        socketMgr.socket2.send(CREATE_ROOM_REQUEST,req);


                    }
                });
                this.addChild(getLayer,100);


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

                if(panel.isFuXuan!=undefined&&panel.isFuXuan)
                {
                    if(panel.value==0)
                    {
                        panel.value=1;
                        this.setSelected(panel,true);
                    }
                    else{

                        panel.value=0;
                        this.setSelected(panel,false);
                    }

                }
                else{

                    if(this.isSelected(panel))
                    {
                        this.setSelected(panel,false);

                    }
                    else{
                        this.setSelected(panel,true);

                    }
                }


                playEffect(TOUCH_SOUND);
            }
                break;


            default:
                break;
        }


    },


});
