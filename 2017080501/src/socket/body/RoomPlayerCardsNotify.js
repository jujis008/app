var RoomPlayerCardsNotify=function(){
//
	this.playerCards=[];
//
	this.tableCard={};
//
	this.tableCardUid="";
//
	this.leftCardCount=0;
//
	this.flow={};
//
	this.cardFlg=0;
//
	this.actionUid="";

this.write=function(bodybuff)
{
	var playerCards_size=this.playerCards.length;
	bodybuff.putInt(playerCards_size);
	for(var i=0;i<playerCards_size;i++)
	{
		var obj=this.playerCards[i];
		var buf=new ByteBuffer();
		buf.initBlank();
		buf.putByte(1);
		obj.write(buf);
		bodybuff.appendByteBuffer(buf);
		buf=null;
	}
	var tableCard_buf=new ByteBuffer();
	tableCard_buf.initBlank();
	tableCard_buf.putByte(1);
	this.tableCard.write(tableCard_buf);
	bodybuff.appendByteBuffer(tableCard_buf);
	tableCard_buf=null;
	bodybuff.putUTF(this.tableCardUid);
	bodybuff.putInt(this.leftCardCount);
	var flow_buf=new ByteBuffer();
	flow_buf.initBlank();
	flow_buf.putByte(1);
	this.flow.write(flow_buf);
	bodybuff.appendByteBuffer(flow_buf);
	flow_buf=null;
	bodybuff.putInt(this.cardFlg);
	bodybuff.putUTF(this.actionUid);
};
this.read=function(buffer)
{
	var playerCards_size=buffer.readInt();
	for(var i=0;i<playerCards_size;i++)
	{
		buffer.readByte();
		var info=new PlayerCards();
		info.read(buffer);
		this.playerCards.push(info);
	}
	var tableCard_b=buffer.readByte();
	if(tableCard_b){
		var tableCard_info=new Card();
		tableCard_info.read(buffer);
		this.tableCard=tableCard_info;
	}
	this.tableCardUid=buffer.readUTF();
	this.leftCardCount=buffer.readInt();
	var flow_b=buffer.readByte();
	if(flow_b){
		var flow_info=new Flow();
		flow_info.read(buffer);
		this.flow=flow_info;
	}
	this.cardFlg=buffer.readInt();
	this.actionUid=buffer.readUTF();
};
this.clone=function()
{
var cloneObj={};
cloneObj.playerCards=[];
	var playerCards_size=this.playerCards.length;
	for(var i=0;i<playerCards_size;i++)
	{
		var obj=this.playerCards[i];
cloneObj.playerCards.push(obj.clone());
	}
cloneObj.tableCard=this.tableCard.clone();
cloneObj.tableCardUid=this.tableCardUid;
cloneObj.leftCardCount=this.leftCardCount;
cloneObj.flow=this.flow.clone();
cloneObj.cardFlg=this.cardFlg;
cloneObj.actionUid=this.actionUid;
cloneObj.read=this.read;
cloneObj.write=this.write;
cloneObj.clone=this.clone;
return cloneObj;
};
};
