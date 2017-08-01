/**
 * Created by yungu on 16/11/7.
 */

var LIGHT_INIT_SCL=1;//1.2;

var CardSprite=cc.Layer.extend({


    ctor: function () {
        this._super();

        this.cardFixType=0;
    },

    createCard:function (card) {
        this.card=card;
        this.card_color=cc.color(255,255,255);

        //if(this.card.type==0)//大写
        //{
        //    this.sp=new cc.Sprite("res/ui/"+cardPath+"/d_"+this.card.value+".png");
        //
        //}
        //else{
        //    this.sp=new cc.Sprite("res/ui/"+cardPath+"/x_"+this.card.value+".png");
        //    this.cardFix="x_";
        //}
        //
        //this.cardFixType=0;

        this.changeToSmall();

       // this.addChild(this.sp);

        this.schedule(this.update, 0.02);

        this.scl=1;

        this.lightSp=null;

    },
    update:function (dt) {

        if(this.lightSp!=undefined&&this.lightSp!=null)
        {
            var sl=this.sp.getScale();
            this.lightSp.setScale(sl*this.lightSp.orgScl);
        }

    },
    setGray:function () {

        if(this.sp!=undefined&&this.sp!=null)
        {
            this.card_color=cc.color(192,191,191);
            this.sp.setColor(cc.color(192,191,191));
        }

    },
    setBlue:function () {

        if(RULE_VALUE==ROOM_TYPE_WAIHUZI)
        {
            return;
        }

        if(this.sp!=undefined&&this.sp!=null)
        {
            this.card_color=cc.color(127,127,127);
            this.sp.setColor(cc.color(127,127,127));
        }

    },
    setRed:function () {

        if(this.sp!=undefined&&this.sp!=null)
        {
            if(RULE_VALUE==ROOM_TYPE_PENGHUZI)
            {

               this.sp.setColor(cc.color(255,255,0));
            }
            else{
                //this.sp.setColor(cc.color(255,0,0));
            }

        }

    },
    setRed2:function () {

        if(this.sp!=undefined&&this.sp!=null)
        {
            this.card_color=cc.color(240,181,181);
            this.sp.setColor(cc.color(240,181,181));
        }

    },
    isRed2:function () {
        if(this.card_color.r==240&&this.card_color.g==181&&this.card_color.b==181)
        {
            return true;
        }

        return false;

    },
    clearColor:function () {

        if(this.sp!=undefined&&this.sp!=null)
        {
            this.card_color=cc.color(255,255,255);
            this.sp.setColor(cc.color(255,255,255));
        }
    },
    setLight:function (isLight) {

        if(isLight)
        {
            if(this.lightSp==undefined||this.lightSp==null)
            {
                this.lightSp=new cc.Sprite("res/ui/"+my_room_name+"/light_room.png");
                this.addChild(this.lightSp,-1);

                 if(CARD_TYPE==0){

                    this.lightSp.setScale(LIGHT_INIT_SCL);
                    this.lightSp.orgScl=LIGHT_INIT_SCL;
                }
                else{
                     this.lightSp.orgScl=1
                 }


            }

        }
        else{
            if(this.lightSp!=undefined&&this.lightSp!=null)
            {
                this.lightSp.removeFromParent(true);
                this.lightSp=null;
            }
        }

    },
    hasContainsPos:function (pos) {

        if(this.sp==null)
        {
            return false;
        }

        var r=this.sp.getTextureRect();
        var w=r.width*this.sp.getScale();
        var h=r.height*this.sp.getScale();

        var p=this.convertToWorldSpace(cc.p(0,0));
       // p.x+=v_x;
       // p.y+=v_y;
        p.x-=w/2;
        p.y-=h/2;
        
       // cc.log("touch pos:"+pos.x+","+pos.y);
       //  cc.log("("+p.x+","+p.y+","+w+","+h+"),this.scl:"+this.scl+","+r.width);
        if(pos.x>=p.x&&pos.x<=(p.x+w)&&pos.y>=p.y&&pos.y<=(p.y+h))
        {
            //cc.log("true!!!!!");
            return true;
        }

        return false;
    },
    getSize:function () {

        if(this.sp==null)
        {
            return cc.size(0,0);
        }

        r=this.sp.getTextureRect();

        return cc.size(r.width,r.height);
    },
    setScl:function (scl) {


        if(this.sp!=null)
        {
            this.scl=scl;
            this.sp.setScale(scl);
        }
    },
    runActionWithSp:function (action) {
        if(this.sp!=null)
        {
            this.sp.runAction(action);
        }
    },
    setRotate:function (ro) {
        this.ro=ro;
        if(this.sp!=null)
        {
            this.sp.setRotation(ro);
        }

    },
    getSpScale:function()
    {

        if(this.sp!=undefined)
        {
            return this.sp.getScale();

        }

        return 1;
    },
    changeToBig:function () {

        if(this.sp!=undefined)
        {
            this.sp.removeFromParent(true);
            this.sp=null;
        }


        if(this.card.type==0)//大写
        {
            this.sp=new cc.Sprite("res/ui/"+cardPath+"/dd_"+this.card.value+".png");

        }
        else{
            this.sp=new cc.Sprite("res/ui/"+cardPath+"/xx_"+this.card.value+".png");

        }

        this.cardFixType=1;

        this.sp.setColor(this.card_color);
        this.addChild(this.sp);

        if(CARD_TYPE==0)
        {

        }
        else if(CARD_TYPE==1)
        {

        }
        else if(CARD_TYPE==2)
        {
            this.sp.setScale(0.6);
        }

        return this.sp;
    },
    
    changeToSmall:function () {

        if(this.sp!=undefined)
        {
            this.sp.removeFromParent(true);
            this.sp=null;
        }

        if(this.card.type==0)//大写
        {
            this.sp=new cc.Sprite("res/ui/"+cardPath+"/d_"+this.card.value+".png");

        }
        else{
            this.sp=new cc.Sprite("res/ui/"+cardPath+"/x_"+this.card.value+".png");

        }
        this.cardFixType=0;

        this.sp.setColor(this.card_color);
        this.addChild(this.sp);

        if(CARD_TYPE==0)
        {

        }
        else if(CARD_TYPE==1)
        {

        }
        else if(CARD_TYPE==2)
        {
            this.sp.setScale(0.6);
        }

    },

    changeToSmall2:function () {

        if(this.sp!=undefined)
        {
            this.sp.removeFromParent(true);
            this.sp=null;
        }

        // if(UI_TYPE==1)
        // {
        //     this.changeToSmall();
        //     this.sp.setScale(0.4);
        //
        // }
        // else{
        //     if(this.card.type==0)//大写
        //     {
        //         this.sp=new cc.Sprite("res/ui/"+my_room_name+"/a_"+this.card.value+".png");
        //     }
        //     else{
        //         this.sp=new cc.Sprite("res/ui/"+my_room_name+"/b_"+this.card.value+".png");
        //     }
        //
        //
        //     this.addChild(this.sp);
        // }

        if(this.card.type==0)//大写
        {
            this.sp=new cc.Sprite("res/ui/"+cardPath+"/a_"+this.card.value+".png");

        }
        else{
            this.sp=new cc.Sprite("res/ui/"+cardPath+"/b_"+this.card.value+".png");

        }

        this.cardFixType=2;


        if(CARD_TYPE==0)
        {
            this.sp.setScale(0.9);
        }
        else if(CARD_TYPE==1)
        {

        }
        else if(CARD_TYPE==2)
        {
            this.sp.setScale(0.7);
        }

        
        this.addChild(this.sp);

        this.sp.setColor(this.card_color);

    },
    changeToBg:function (isBig) {

        if(this.sp!=undefined)
        {
            this.sp.removeFromParent(true);
            this.sp=null;
        }

        if(isBig)//
        {
            this.sp=new cc.Sprite("res/ui/"+cardPath+"/card_bg_2.png");
        }
        else{
            this.sp=new cc.Sprite("res/ui/"+cardPath+"/card_bg_1.png");
        }

        this.cardFixType=3;
        this.isBig=isBig;


        this.sp.setColor(this.card_color);
        this.addChild(this.sp);

        if(CARD_TYPE==0)
        {
            if(isBig)
            {
                this.sp.setScale(0.9);
            }
            else{
                this.sp.setScale(0.4);
            }

        }
        else if(CARD_TYPE==1)
        {

        }
        else if(CARD_TYPE==2)
        {
            this.sp.setScale(0.7);
        }
    },
    resetSp:function()
    {
        if(this.cardFixType==0)
        {
            this.changeToSmall();
        }
        else if(this.cardFixType==1)
        {
            this.changeToBig();
        }
        else if(this.cardFixType==2)
        {
            this.changeToSmall2();
        }
        else if(this.cardFixType==3)
        {
            this.changeToBg(this.isBig);
        }

    }


});