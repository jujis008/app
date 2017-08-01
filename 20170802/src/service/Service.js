
var ServiceClass=function(){
    
    this.register=[];
    this.httpRegister=[];

    this.logN=function () {

        cc.log("#logNlogN:"+Object.keys(this.register).length);
    },
    this.excute=function(msgNumber,body)
    {
        var hasExcute=false;
        var key=msgNumber+"";
        var targets=this.register[key];
        if(targets==undefined)
        {
            cc.log("#未注册:"+msgNumber+"  "+Object.keys(this.register).length);
            return false;
        }
        var size=targets.length;
        if(size==0)
        {
            cc.log("未注册:"+msgNumber);
        }
       // cc.log("excute----"+size);
        for(var i=size-1;i>=0;i--)
        {
            var t=targets[i];
            t.func(msgNumber,body,t.target);
            hasExcute=true;
            if(t.swallow!=undefined&&t.swallow)
            {
                break;
            }
           // cc.log("msgNumber:"+msgNumber);
        }
        
       
        //body=null;

        return hasExcute;
    }

    this.registWithSwallow=function(msgNumber,target,func,swallow)
    {
        //cc.log("----*222**1---"+msgNumber);
        var key=msgNumber+"";
        var targets=this.register[key];

        if(targets!=undefined)
        {
            var size=targets.length;
            for(var i=0;i<size;i++)
            {
                var t=targets[i];
                if(t.func==func&&t.target==target)
                {

                    return;
                }
                // cc.log("----size---"+size);
            }
            // cc.log("----***1---"+msgNumber);
            var tt={};
            tt.target=target;
            tt.func=func;
            tt.swallow=swallow;
            targets.push(tt);
        }
        else{
            //cc.log("----2---"+msgNumber);
            targets=[];
            var tt={};
            tt.target=target;
            tt.func=func;
            tt.swallow=swallow;
            targets.push(tt);
            this.register[key]=targets;
        }



    }
    this.regist=function(msgNumber,target,func)
    {

        this.registWithSwallow(msgNumber,target,func,false);


        
        
        
    }
    this.unregist=function(target)
    {
        for(var key in this.register)
        {
            var targets=this.register[key];
            if(targets==undefined)
            {
                return;
            }
            var size=targets.length;
            for(var i=0;i<size;i++)
            {
               
                var t=targets[i];
                
                if(t.target==target)
                {
                    targets.splice(i, 1);
                    cc.log("unregist "+key);
                    break;
                }
               
            }
            
        }

        
       // cc.log("======len==="+this.register.length);
        
    }


    this.clear=function () {
        this.httpRegister={};
        this.register={};
    }



    this.sendHttpRequest=function(msgNumber,req,callback)
    {

        var str = JSON.stringify(req);
        var data="msgNumber="+msgNumber+"&json="+str;


        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("POST",urlHttpServerPath);


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


    }



    this.sendHttpRequest2=function(msgNumber,req,callback,target)
    {

        var str = JSON.stringify(req);
        var data="msgNumber="+msgNumber+"&json="+str;


        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("POST",urlHttpServerPath);


        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function () {

            if(xhr.readyState == 4 && xhr.status == 200){

                var response = xhr.responseText;

                if(callback)
                {
                    cc.log("http response:"+response);
                    var obj=JSON.parse(response);
                    obj.target=target;
                    callback(obj);
                }

            }else if(xhr.readyState == 4 && xhr.status != 200){


                cc.log("http 应答错误:"+xhr.status);
                if(callback)
                {
                    callback(null);
                }
            }

        };

        xhr.send(data);


    }


    this.sendHttpRequest3=function(msgNumber,req,callback,target)
    {

        var str = JSON.stringify(req);
        var data="cmdNumber="+msgNumber+"&json="+str;


        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("POST","http://"+HTTP_IP+":7101/cmd");


        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function () {

            if(xhr.readyState == 4 && xhr.status == 200){

                var response = xhr.responseText;

                if(callback)
                {
                    cc.log("http response:"+response);
                    var obj=JSON.parse(response);
                    obj.target=target;
                    callback(obj);
                }

            }else if(xhr.readyState == 4 && xhr.status != 200){


                cc.log("http 应答错误:"+xhr.status);
                if(callback)
                {
                    callback(null);
                }
            }

        };

        xhr.send(data);


    }



    this.checkIpRequest=function(uid,ip,callback)
    {



        var xhr = cc.loader.getXMLHttpRequest();


        xhr.open("GET","http://ip.taobao.com/service/getIpInfo.php?ip="+ip, true);

        //  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function () {

            if(xhr.readyState == 4 && xhr.status == 200){

                var response = xhr.responseText;

                try
                {
                    if(callback)
                    {
                        cc.log("http response:"+response);
                        var obj=JSON.parse(response);
                        callback(uid,obj);
                    }
                }
                catch (e)
                {
                    cc.log(e.message);
                }


            }
            else{
                callback(uid,null);
            }

        };

        xhr.send();


    }

}








    var Service=(function()
     {
                 
      
                 var unique;
                 
                 
                 function getInstance(){
                 
                 return unique || ( unique = new ServiceClass() );
                 
                 
                 
                 }
                 
                 
                 return {
                 
                 getInstance : getInstance
                 
                 }
    
                 
                 
                 
                                            
            })();
    
    
    
    
    
    
