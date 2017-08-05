var SetTouchRequest=function(){
//
	this.uid="";
//
	this.roomId="";
//
	this.type=0;
//
	this.value=0;

this.write=function(bodybuff)
{
	bodybuff.putUTF(this.uid);
	bodybuff.putUTF(this.roomId);
	bodybuff.putInt(this.type);
	bodybuff.putInt(this.value);
};
this.read=function(buffer)
{
	this.uid=buffer.readUTF();
	this.roomId=buffer.readUTF();
	this.type=buffer.readInt();
	this.value=buffer.readInt();
};
this.clone=function()
{
var cloneObj={};
cloneObj.uid=this.uid;
cloneObj.roomId=this.roomId;
cloneObj.type=this.type;
cloneObj.value=this.value;
cloneObj.read=this.read;
cloneObj.write=this.write;
cloneObj.clone=this.clone;
return cloneObj;
};
};
