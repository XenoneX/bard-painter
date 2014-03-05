function sketch(param) {


param.sketch.draw = function() {

    if (param.points.length < 2) return;

    var options = {
        width: 150,
        bgColor: "rgba(0, 0, 0, 0.6)",
        lineWidth: 1,
        padding: 5
    }

    var w0 = param.width;
    var h0 = param.height;
    var buf = param.buffer;

    if (!this.init) {
        this.init = true;
        this.visibility = true;
        this.width = options.width;
        this.height = this.width * h0 / w0;
        this.position = {
            x: param.button.m,
            y: h0 - 2 * param.button.m - param.button.h - this.height
        };

        buf.sketch.canv.width = this.width;
        buf.sketch.canv.height = this.height;
    }

    var w = this.width;
    var h = this.height;
    var p = options.padding;
    var k, tX, tY;
    var ctx = buf.sketch.ctx;

    ctx.fillStyle = options.bgColor;
    ctx.lineWidth = options.lineWidth;

    ctx.clearRect(0, 0, w, h);
    ctx.fillRect(0, 0, w, h);

    w -= 2 * options.padding;
    h -= 2 * options.padding;

    if (param.polygon.maxW / w > param.polygon.maxH / h) {
        k = w / param.polygon.maxW;
        tX = -(param.polygon.coordsCenter.x - param.polygon.maxW / 2) * k + p;
        tY = -(param.polygon.coordsCenter.y - param.polygon.maxH / 2) * k
            + (h - param.polygon.maxH * k) / 2 + p;
    } else if (param.polygon.maxH != 0) {
        k = h / param.polygon.maxH;
        tX = -(param.polygon.coordsCenter.x - param.polygon.maxW / 2) * k
            + (w - param.polygon.maxW * k) / 2 + p;
        tY = -(param.polygon.coordsCenter.y - param.polygon.maxH / 2) * k + p;
    } else {
        k = w / w0;
        tX = -(param.polygon.coordsCenter.x - w0 / 2) * k + p;
        tY = -(param.polygon.coordsCenter.y - h0 / 2) * k
            + (h - h0 * k) / 2 + p;
    }

    ctx.save();
    ctx.translate(tX, tY);

    var coordsStartPoint = {
        x: Math.round(k * param.points[0].coordsReal.x),
        y: Math.round(k * param.points[0].coordsReal.y)
    };

    var coordsNextPoint = {
        x: 0,
        y: 0
    };

    ctx.beginPath();
    ctx.moveTo(coordsStartPoint.x, coordsStartPoint.y);

    for (i = 1; i < param.points.length; i++) {

        coordsNextPoint.x = Math.round(k * param.points[i].coordsReal.x);
        coordsNextPoint.y = Math.round(k * param.points[i].coordsReal.y);

        ctx.strokeStyle = param.linesColor;

        if (param.points[i].crossLines) {
            ctx.strokeStyle = param.linesCrossColor;
        }
        ctx.lineTo(coordsNextPoint.x, coordsNextPoint.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(coordsNextPoint.x, coordsNextPoint.y);
    }

    if (param.closed) {
        ctx.strokeStyle = param.linesColor;
        ctx.lineTo(coordsStartPoint.x, coordsStartPoint.y);

        if (param.points[0].crossLines) {
            ctx.strokeStyle = param.linesCrossColor;
        }
        ctx.stroke();
    }

    ctx.closePath();

    ctx.restore();

    var x = this.position.x;
    var y = this.position.y;

    param.buffer.main.ctx.drawImage(buf.sketch.canv, x - param.translateCanv.x, y - param.translateCanv.y);
}

}
