/**
 * canvas绘图
 */

 let CanvasDraw = function () {

    /**
     * 画文本和气泡
     */
    this.drawText = function (THREE, renderer, text, width) {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext('2d');

        canvas.width = width * 2;
        canvas.height = width * 2;

        this.drawBubble(ctx, width - 10, width - 65, width, 45, 6, "#00c864");

        //设置文字
        ctx.fillStyle = "#ffffff";
        ctx.font = '32px 宋体';
        ctx.fillText(text, width - 10 + 12, width - 65 + 34);

        let canvasTexture = new THREE.CanvasTexture(canvas);
        canvasTexture.magFilter = THREE.NearestFilter;
        canvasTexture.minFilter = THREE.NearestFilter;

        let maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
        canvasTexture.anisotropy = maxAnisotropy;

        return canvasTexture;
    }

    /**
     * 画箭头
     */
    this.drawArrow = function (THREE, renderer, width, height) {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = height;

        ctx.save();

        ctx.translate(0, 0);

        //this.drawRoundRectPath(ctx, width, height, 0);

        //ctx.fillStyle = "#ffff00";
        //ctx.fill();

        this.drawArrowBorder(ctx, 2, 0, 0, 4, 100, 50, 0, 96, 2, 100, 300, 50);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        ctx.restore();

        let canvasTexture = new THREE.CanvasTexture(canvas);
        canvasTexture.magFilter = THREE.NearestFilter;
        canvasTexture.minFilter = THREE.NearestFilter;

        let maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
        canvasTexture.anisotropy = maxAnisotropy;

        return canvasTexture;
    }

    /**
     * 画线内箭头
     */
    this.drawArrow3 = function (THREE, renderer, width, height, color) {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = height;

        ctx.save();

        ctx.translate(0, 0);

        this.drawRoundRectPath(ctx, width, height, 0);

        ctx.fillStyle = color;
        ctx.fill();

        this.drawArrowBorder(ctx, 0, 350, 0, 400, 50, 450, 100, 400, 100, 350, 50, 400);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        ctx.restore();

        let canvasTexture = new THREE.CanvasTexture(canvas);
        canvasTexture.magFilter = THREE.NearestFilter;
        canvasTexture.minFilter = THREE.NearestFilter;
        canvasTexture.wrapS = THREE.RepeatWrapping;
        canvasTexture.wrapT = THREE.RepeatWrapping;

        let maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
        canvasTexture.anisotropy = maxAnisotropy;

        return canvasTexture;
    }

    /**
     * 画气泡
     */
    this.drawBubble = function (ctx, x, y, width, height, radius, fillColor) {
        ctx.save();

        ctx.translate(x, y);

        this.drawRoundRectPath(ctx, width, height, radius);

        ctx.fillStyle = fillColor || "#000";
        ctx.fill();

        this.drawTriangle(ctx, 20, height, 40, height, 10, 65);
        ctx.fillStyle = fillColor || "#000";
        ctx.fill();

        ctx.restore();
    }

    /**
     * 画三角形
     */
    this.drawTriangle = function (ctx, x1, y1, x2, y2, x3, y3) {
        ctx.beginPath();

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);

        ctx.closePath();
    }

    /**
     * 画箭头边框
     */
    this.drawArrowBorder = function (ctx, x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6) {
        ctx.beginPath();

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.lineTo(x4, y4);
        ctx.lineTo(x5, y5);
        ctx.lineTo(x6, y6);

        ctx.closePath();
    }

    /**
     * 画圆角矩形
     */
    this.drawRoundRectPath = function (ctx, width, height, radius) {
        ctx.beginPath(0);

        //从右下角顺时针绘制，弧度从0到1/2PI  
        ctx.arc(width - radius, height - radius, radius, 0, Math.PI / 2);

        //矩形下边线  
        ctx.lineTo(radius, height);

        //左下角圆弧，弧度从1/2PI到PI  
        ctx.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);

        //矩形左边线  
        ctx.lineTo(0, radius);

        //左上角圆弧，弧度从PI到3/2PI  
        ctx.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);

        //上边线  
        ctx.lineTo(width - radius, 0);

        //右上角圆弧  
        ctx.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);

        //右边线  
        ctx.lineTo(width, height - radius);

        ctx.closePath();
    }

    /**
     * 画圆
     */
    this.drawCircle = function (THREE, renderer, width, height, radius, fillColor) {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = height;

        ctx.save();

        ctx.beginPath(0);

        ctx.arc(width / 2, height / 2, radius, 0, 2 * Math.PI);

        ctx.closePath();

        ctx.fillStyle = fillColor || "#000";
        ctx.fill();

        ctx.restore();

        let texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;

        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;

        let maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.anisotropy = maxAnisotropy;

        return texture;
    }

}

CanvasDraw.prototype.constructor = CanvasDraw;

export { CanvasDraw }
