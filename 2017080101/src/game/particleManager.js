/**
 * Created by yungu on 16/12/3.
 */
var ParticleManagerClass=function(){

    this.particles={};

    this.buildParticlePool=function (path,count) {

        var hasArr=this.particles[path];
        if(hasArr!=undefined)
        {
            var len=hasArr.length;
            if(len>=count)
            {
                cc.log("[粒子不许要再创建]");
                return;
            }
        }
        var arr=[];
        for(var i=0;i<count;i++)
        {
            var sp = new cc.ParticleSystem.create(path);
            arr.push(sp);
            sp.x=0;
            sp.y=0;
            sp.path=path;
            sp.retain();
        }

        this.particles[path]=arr;

        cc.log("[创建粒子,path:"+path+",count:"+count+"]");
    }
     
    this.useParticle=function (path) {

        var arr=this.particles[path];
        if(arr.length==0)
        {
            this.buildParticlePool(path,10);
        }

        var p=arr[0];
        arr.splice(0,1);
        return p;

    }

    this.unUseParticle=function (particle) {

        cc.log("[粒子回收]");
        var arr=this.particles[particle.path];
        arr.push(particle);

    }


    
    
}








var ParticleManager=(function()
{


    var unique;


    function getInstance(){

        return unique || ( unique = new ParticleManagerClass() );



    }


    return {

        getInstance : getInstance

    }





})();
