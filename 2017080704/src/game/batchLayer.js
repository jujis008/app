/**
 * Created by yungu on 16/6/11.
 */

var BatchLayer = cc.Layer.extend({

    sprites:[],
    ctor: function () {
        this._super();



    },
    loadPlist:function (png) {
        
        this.spriteBatch = new cc.SpriteBatchNode(png);
        this.addChild(this.spriteBatch);
    },
    addSprite:function (sprite) {
        this.spriteBatch.addChild(sprite);
        //this.addChild(sprite);
        //this.sprites.push(sprite);

    },
    removeAllChilds:function () {
       // this.spriteBatch.removeAllChildren(true);
        //this.removeAllChildren(true);
        var len= this.sprites.length;
        for(var i=0;i<len;i++)
        {
            cc.pool.putInPool(this.sprites[i]);
        }

    },

    

});