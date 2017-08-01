var GetRoomsResponse=function(){
//
	this.rooms=[];

this.write=function(bodybuff)
{
	var rooms_size=this.rooms.length;
	bodybuff.putInt(rooms_size);
	for(var i=0;i<rooms_size;i++)
	{
		var obj=this.rooms[i];
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
	var rooms_size=buffer.readInt();
	for(var i=0;i<rooms_size;i++)
	{
		buffer.readByte();
		var info=new RoomObj();
		info.read(buffer);
		this.rooms.push(info);
	}
};
this.clone=function()
{
var cloneObj={};
cloneObj.rooms=[];
	var rooms_size=this.rooms.length;
	for(var i=0;i<rooms_size;i++)
	{
		var obj=this.rooms[i];
cloneObj.rooms.push(obj.clone());
	}
cloneObj.read=this.read;
cloneObj.write=this.write;
cloneObj.clone=this.clone;
return cloneObj;
};
};
