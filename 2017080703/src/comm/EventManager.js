/**
 * Created by yungu on 16/6/23.
 */

var EventManagerClass=cc.Layer.extend({

    register:[],
    ctor:function()
    {
        this._super();

        this.register=[];

    },
    fireEvent:function(eventName,obj) {

        cc.log("fire event:"+eventName);
        var targets = this.register[eventName];
        cc.log("EventManager " + targets);
        if (targets == undefined) {
            return;
        }
        var size = targets.length;
        cc.log("fire event size:"+size);
        for (var i = 0; i < size; i++) {
            var t = targets[i];
            cc.log("fire event i:"+i);
            t.func(obj, t.target);
        }
    },

    regist:function(eventName,target,func)
    {
        var targets=this.register[eventName];

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
         }
        var tt={};
        tt.target=target;
        tt.func=func;
        targets.push(tt);
    }
    else{
        targets=[];
        var tt={};
        tt.target=target;
        tt.func=func;
        targets.push(tt);
        this.register[eventName]=targets;
    }



},
unregist:function(target) {
    for (var key in this.register) {
        var targets = this.register[key];
        if (targets == undefined) {
            return;
        }
        var size = targets.length;
        for (var i = 0; i < size; i++) {

            var t = targets[i];

            if (t.target == target) {
                targets.splice(i, 1);

                break;
            }

        }

    }
},

    unregistAll:function(key) {
        
        delete this.register[key];
    },

});

var EventManager=(function()
{
    var unique;
    function getInstance()
    {
        return unique || ( unique = new EventManagerClass() );

    }
    return {
        getInstance : getInstance

    }
})();
