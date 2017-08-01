var RoomInfo=function(){
//
	this.roomId="";
//剩余局数
	this.leftCount=0;
//创建人uid
	this.uid="";
//人数
	this.renshu=0;
//0:gps,1:ip
	this.gongneng=0;
//0,1,2
	this.choushui=0;
//0:一胡一息,1:三胡一息,2:五胡一息
	this.gunze=0;
//
	this.roomUsers=[];
//
	this.time="";
//
	this.roomType=0;
//
	this.qita=0;
//房间状态
	this.state=0;
//局数
	this.maxCount=0;
//起胡
	this.qihu=0;
//封顶
	this.fengding=0;
//0:房费均摊,1:标准房费,2:代开房费
	this.fangfei=0;
//0:不加底,1:加底
	this.jiadi=0;
//
	this.fengding=0;
//0:无,1:自摸翻倍
	this.zimofanbeo=0;
//0:无,1:放炮包赔
	this.fangpaobaopei=0;
//0:无,1:归
	this.gui=0;

this.write=function(bodybuff)
{
	bodybuff.putUTF(this.roomId);
	bodybuff.putInt(this.leftCount);
	bodybuff.putUTF(this.uid);
	bodybuff.putInt(this.renshu);
	bodybuff.putInt(this.gongneng);
	bodybuff.putInt(this.choushui);
	bodybuff.putInt(this.gunze);
	var roomUsers_size=this.roomUsers.length;
	bodybuff.putInt(roomUsers_size);
	for(var i=0;i<roomUsers_size;i++)
	{
		var obj=this.roomUsers[i];
		var buf=new ByteBuffer();
		buf.initBlank();
		buf.putByte(1);
		obj.write(buf);
		bodybuff.appendByteBuffer(buf);
		buf=null;
	}
	bodybuff.putUTF(this.time);
	bodybuff.putInt(this.roomType);
	bodybuff.putInt(this.qita);
	bodybuff.putInt(this.state);
	bodybuff.putInt(this.maxCount);
	bodybuff.putInt(this.qihu);
	bodybuff.putInt(this.fengding);
	bodybuff.putInt(this.fangfei);
	bodybuff.putInt(this.jiadi);
	bodybuff.putInt(this.fengding);
	bodybuff.putInt(this.zimofanbeo);
	bodybuff.putInt(this.fangpaobaopei);
	bodybuff.putInt(this.gui);
};
this.read=function(buffer)
{
	this.roomId=buffer.readUTF();
	this.leftCount=buffer.readInt();
	this.uid=buffer.readUTF();
	this.renshu=buffer.readInt();
	this.gongneng=buffer.readInt();
	this.choushui=buffer.readInt();
	this.gunze=buffer.readInt();
	var roomUsers_size=buffer.readInt();
	for(var i=0;i<roomUsers_size;i++)
	{
		buffer.readByte();
		var info=new RoomUserInfo();
		info.read(buffer);
		this.roomUsers.push(info);
	}
	this.time=buffer.readUTF();
	this.roomType=buffer.readInt();
	this.qita=buffer.readInt();
	this.state=buffer.readInt();
	this.maxCount=buffer.readInt();
	this.qihu=buffer.readInt();
	this.fengding=buffer.readInt();
	this.fangfei=buffer.readInt();
	this.jiadi=buffer.readInt();
	this.fengding=buffer.readInt();
	this.zimofanbeo=buffer.readInt();
	this.fangpaobaopei=buffer.readInt();
	this.gui=buffer.readInt();
};
this.clone=function()
{
var cloneObj={};
cloneObj.roomId=this.roomId;
cloneObj.leftCount=this.leftCount;
cloneObj.uid=this.uid;
cloneObj.renshu=this.renshu;
cloneObj.gongneng=this.gongneng;
cloneObj.choushui=this.choushui;
cloneObj.gunze=this.gunze;
cloneObj.roomUsers=[];
	var roomUsers_size=this.roomUsers.length;
	for(var i=0;i<roomUsers_size;i++)
	{
		var obj=this.roomUsers[i];
cloneObj.roomUsers.push(obj.clone());
	}
cloneObj.time=this.time;
cloneObj.roomType=this.roomType;
cloneObj.qita=this.qita;
cloneObj.state=this.state;
cloneObj.maxCount=this.maxCount;
cloneObj.qihu=this.qihu;
cloneObj.fengding=this.fengding;
cloneObj.fangfei=this.fangfei;
cloneObj.jiadi=this.jiadi;
cloneObj.fengding=this.fengding;
cloneObj.zimofanbeo=this.zimofanbeo;
cloneObj.fangpaobaopei=this.fangpaobaopei;
cloneObj.gui=this.gui;
cloneObj.read=this.read;
cloneObj.write=this.write;
cloneObj.clone=this.clone;
return cloneObj;
};
};
