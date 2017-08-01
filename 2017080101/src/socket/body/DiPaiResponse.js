var DiPaiResponse=function(){
//
	this.cards=[];

this.write=function(bodybuff)
{
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
};
this.read=function(buffer)
{
	var cards_size=buffer.readInt();
	for(var i=0;i<cards_size;i++)
	{
		buffer.readByte();
		var info=new Card();
		info.read(buffer);
		this.cards.push(info);
	}
};
this.clone=function()
{
var cloneObj={};
cloneObj.cards=[];
	var cards_size=this.cards.length;
	for(var i=0;i<cards_size;i++)
	{
		var obj=this.cards[i];
cloneObj.cards.push(obj.clone());
	}
cloneObj.read=this.read;
cloneObj.write=this.write;
cloneObj.clone=this.clone;
return cloneObj;
};
};
