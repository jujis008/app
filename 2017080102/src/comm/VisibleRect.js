/**
 * Created by yungu on 16/6/13.
 */

var VisibleRect=function(){

    this.init=function() {

       // var gl=cc.director.getOpenGLView();
       // this.r=gl.getVisibleRect();
        this.r={};
        this.r.width=cc.view.getVisibleSize().width;//cc.director.getVisibleSize().width;
        this.r.height=cc.view.getVisibleSize().height;
        this.r.x=cc.view.getVisibleOrigin().x;
        this.r.y=cc.view.getVisibleOrigin().y;

       // cc.log("^^^^^^^^^^^^^^^^^:"+this.r.x+"  "+this.r.y+"  "+this.r.width+"   "+this.r.height);
        this.w=1136;
        this.h=640;

    },
        this.getVisibleRect=function () {
        return this.r;
    }
    this.size=function () {
        var s={};
        s.width=r.width;
        s.height=r.height;
         return   s;
    },
        this.left=function () {
            this.init();
        return cc.p(this.r.x,this.r.y+this.r.height/2);
    },
        this.right=function () {
            this.init();
        return cc.p(this.r.x+this.r.width,this.r.y+this.r.height/2);
    },
        this.top=function () {
            this.init();
        return cc.p(this.r.x + this.r.width / 2, this.r.y + this.r.height);
    },
        this.bottom=function () {
            this.init();
        return cc.p(this.r.x+this.r.width/2,this.r.y);
    },
        this.center=function () {
            this.init();
        return cc.p(this.r.x+this.r.width/2,this.r.y+this.r.height/2);
    },
        this.leftTop=function () {
            this.init();
        return cc.p(this.r.x,this.r.y+this.r.height);
    },
        this.rightTop=function () {
            this.init();
        return cc.p(this.r.x+this.r.width,this.r.y+this.r.height);
    },
        this.leftBottom=function () {
            this.init();
        return cc.p(this.r.x,this.r.y);
    },
    this.rightBottom=function () {
        this.init();
        return cc.p(this.r.x+this.r.width,this.r.y);
    },
        this.oldLeft=function () {
            this.init();
        return cc.p(0,this.h/2);
    },
    this.oldRight=function () {
        this.init();
        return cc.p(this.w,this.h/2);
    },
    this.oldTop=function () {
        this.init();
        return cc.p(this.w/2, this.h);
    },
    this.oldBottom=function () {
        this.init();
        return cc.p(this.w/2,0);
    },
    this.oldCenter=function () {
        this.init();
        return cc.p(this.w/2,this.h/2);
    },
    this.oldLeftTop=function () {
        this.init();
        return cc.p(0,this.h);
    },
    this.oldRightTop=function () {
        this.init();
        return cc.p(this.w,this.h);
    },
        this.oldLeftBottom=function () {
            this.init();
        return cc.p(0,0);
    },
        this.oldRightBottom=function () {
            this.init();
        return cc.p(this.w,0);
    },
        
        
        
        this.leftPos=function () {
        return cc.pSub(this.left(),this.oldLeft());
    }, 

     this.rightPos=function () {
    
         var r=this.right();
         var r2=this.oldRight();

         cc.log("x:"+r.x+",y:"+r.y+",x2:"+r2.x+",y2:"+r2.y);

         return cc.pSub(this.right(),this.oldRight());
    },
        this.topPos=function () {
        return cc.pSub(this.top(),this.oldTop());
    },
        this.bottomPos=function () {
        return cc.pSub(this.bottom(),this.oldBottom());
    },
        this.centerPos=function () {
        return cc.pSub(this.center(),this.oldCenter());
    },
    this.leftTopPos=function () {
        return cc.pSub(this.leftTop(),this.oldLeftTop());
    },
    this.rightTopPos=function () {
        return cc.pSub(this.rightTop(),this.oldRightTop());
    },
    this.leftBottomPos=function () {
        return cc.pSub(this.leftBottom(),this.oldLeftBottom());
    },
    this.rightBottomPos=function () {
        return cc.pSub(this.rightBottom(),this.oldRightBottom());
    }



};

