/**
 * Created by yungu on 16/8/5.
 */
var ByteBufferManager=(function()
{
    var unique;
    function getInstance(){
        return unique || ( unique = new ByteBufferManagerClass() );
    }
    return {
        getInstance : getInstance
    }
})();
var ByteBufferManagerClass= function() {

    this.bufferQueue=[];

    this.getFromPool=function () {

        var count=this.bufferQueue.length;
       // cc.log("ByteBufferManagerClass:::count:"+count);
        if(count>0)
        {
            var buf=this.bufferQueue[0];
            buf.reuse();
            this.bufferQueue.splice(0,1);
            return buf;
        }
        else{
            var buf=new ByteBuffer();
            buf.initBlank();
            return buf;
        }

    };
    this.appendToPool=function (buf) {
        buf.unuse();
        this.bufferQueue.push(buf);
    }


}