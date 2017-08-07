var SetTouchResponse=function(){
//
	this.state=0;

this.write=function(bodybuff)
{
	bodybuff.putInt(this.state);
};
this.read=function(buffer)
{
	this.state=buffer.readInt();
};
this.clone=function()
{
var cloneObj={};
cloneObj.state=this.state;
cloneObj.read=this.read;
cloneObj.write=this.write;
cloneObj.clone=this.clone;
return cloneObj;
};
};
