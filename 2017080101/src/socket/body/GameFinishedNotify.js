var GameFinishedNotify=function(){
//0:小局结束,1:全局结束
	this.state=0;
//0:,1:天胡,2:地胡,3:自摸胡,4:脱庄,5:闲加分,6:放炮,7:无胡,8:3拢4坎,9:黑摆,10:查叫
	this.type=0;
//
	this.usersInfo=[];
//底牌
	this.cards=[];
//6:朱胡。7:红胡,8:乌胡,9:昆胡,10:爆胡,11:水上漂,12:海底捞,13:杀爆,14:梗,15:红乌,16:一块扁,17:卡胡1翻,18:卡胡100,19:大三胡，20:对子息,,21:大字胡,22:小字胡,24:神腰,25:单漂,26:双漂,27:印,28:花胡子,29:报听,30:红胡十三,31:碰碰胡,1000:归,2000:内元,3000:外元，4000:火火翻,5000:龙加分,6000:醒
	this.type2=[];

this.write=function(bodybuff)
{
	bodybuff.putInt(this.state);
	bodybuff.putInt(this.type);
	var usersInfo_size=this.usersInfo.length;
	bodybuff.putInt(usersInfo_size);
	for(var i=0;i<usersInfo_size;i++)
	{
		var obj=this.usersInfo[i];
		var buf=new ByteBuffer();
		buf.initBlank();
		buf.putByte(1);
		obj.write(buf);
		bodybuff.appendByteBuffer(buf);
		buf=null;
	}
	var cards_size=this.cards.length;
	bodybuff.putInt(cards_size);
	for(var i=0;i<cards_size;i++)
	{
		var obj=this.cards[i];
		var buf=new ByteBuffer();
		buf.initBlank();
		buf.putByte(1);
		obj.write(buf);
		bodybuff.appendByteBuffer(buf);
		buf=null;
	}
	var type2_size=this.type2.length;
	bodybuff.putInt(type2_size);
	for(var i=0;i<type2_size;i++)
	{
		bodybuff.putInt(this.type2[i]);
	}
};
this.read=function(buffer)
{
	this.state=buffer.readInt();
	this.type=buffer.readInt();
	var usersInfo_size=buffer.readInt();
	for(var i=0;i<usersInfo_size;i++)
	{
		buffer.readByte();
		var info=new FinishUserInfo();
		info.read(buffer);
		this.usersInfo.push(info);
	}
	var cards_size=buffer.readInt();
	for(var i=0;i<cards_size;i++)
	{
		buffer.readByte();
		var info=new Card();
		info.read(buffer);
		this.cards.push(info);
	}
	var type2_size=buffer.readInt();
	for(var i=0;i<type2_size;i++)
	{
		var x=buffer.readInt();
		this.type2.push(x);
	}
};
this.clone=function()
{
var cloneObj={};
cloneObj.state=this.state;
cloneObj.type=this.type;
cloneObj.usersInfo=[];
	var usersInfo_size=this.usersInfo.length;
	for(var i=0;i<usersInfo_size;i++)
	{
		var obj=this.usersInfo[i];
cloneObj.usersInfo.push(obj.clone());
	}
cloneObj.cards=[];
	var cards_size=this.cards.length;
	for(var i=0;i<cards_size;i++)
	{
		var obj=this.cards[i];
cloneObj.cards.push(obj.clone());
	}
cloneObj.type2=[];
	var type2_size=this.type2.length;
	for(var i=0;i<type2_size;i++)
	{
cloneObj.type2.push(this.type2[i]);
	}
cloneObj.read=this.read;
cloneObj.write=this.write;
cloneObj.clone=this.clone;
return cloneObj;
};
};
