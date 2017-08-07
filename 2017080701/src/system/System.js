/**
 * Created by yungu on 16/7/29.
 */
var System=function () {

    this.init=function () {

        var frameSize = cc.director.getOpenGLView().getFrameSize();
        // 设置 LsSize 固定值
        var  lsSize = {};
        lsSize.width=960;
        lsSize.height=640;

        var scaleX =  frameSize.width / lsSize.width;
        var scaleY =  frameSize.height / lsSize.height;
        // 定义 scale 变量
        var scale = 0.0; // MAX(scaleX, scaleY);
        if (scaleX>scaleY) {
            // 如果是 X 方向偏大，那么 scaleX 需要除以一个放大系数，放大系数可以由枞方向获取，
            // 因为此时 FrameSize 和 LsSize 的上下边是重叠的
            scale = scaleX / (frameSize.height /  lsSize.height);
        } else {
            scale = scaleY / (frameSize.width / lsSize.width);
        }

        cc.director.getOpenGLView().setDesignResolutionSize(960*scale,
            640*scale, cc.ResolutionPolicy.NO_BORDER);

    }

}