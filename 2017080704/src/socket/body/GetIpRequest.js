var GetIpRequest=function(){
//
	this.uid="";
//
	this.roomId="";
//0:创建房间,1:加入房间,2:检测未完成房间
	this.type=0;

this.write=function(bodybuff)
{
	bodybuff.putUTF(this.uid);
	bodybuff.putUTF(this.roomId);
	bodybuff.putInt(this.type);
};
this.read=function(buffer)
{
	this.uid=buffer.readUTF();
	this.roomId=buffer.readUTF();
	this.type=buffer.readInt();
};
this.clone=function()
{
var cloneObj={};
cloneObj.uid=this.uid;
cloneObj.roomId=this.roomId;
cloneObj.type=this.type;
cloneObj.read=this.read;
cloneObj.write=this.write;
cloneObj.clone=this.clone;
return cloneObj;
};
};
