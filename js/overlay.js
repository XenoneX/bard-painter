function overlay(param) {


param.overlay.rmode = false;
param.overlay.customAngle = false;
param.overlay.points = {};
param.overlay.angle = 0;
param.overlay.options = {
    width: 250,
    widthRect: 140
};
param.overlay.draw = function() {

    var FONT_HEAD = 'normal 18pt sans-serif';
    var FONT_INFOBLOCK = 'normal 12pt sans-serif';
    var FONT_BUTTON = 'normal 10pt sans-serif';
    var COLOR = '#fff';

    var BG_BTN = '#eee';
    var BG_BTN_OVER = '#ddd';
    var BG_BTN_DISABLED = '#555';
    var BG_BTN_DISABLED_OVER = BG_BTN_DISABLED;
    var BG_BTN_PRIMARY = '#1e63a3';
    var BG_BTN_PRIMARY_OVER = '#0e6393';
    var BG_BTN_SUCCESS = '#359735';
    var BG_BTN_SUCCESS_OVER = '#259725';
    var BG_BTN_DANGER = '#b84a53';
    var BG_BTN_DANGER_OVER = '#a84a43';
    var COLOR_BTN = '#000';
    var COLOR_BTN_DISABLED = '#888';
    var COLOR_BTN_PRIMARY = COLOR;
    var COLOR_BTN_SUCCESS = COLOR;
    var COLOR_BTN_DANGER = COLOR;

    var TEXT_HEAD = 'Результат: ';
    var TEXT_SQUARE = 'Площадь: ';
    var TEXT_SQUARE_UNIT = ' кв.м.';
    var TEXT_PERIMETER = 'Периметр: ';
    var TEXT_PERIMETER_UNIT = ' м.';
    var TEXT_CORNER = 'Углов: ';

    //var TEXT_BTN_ = ''; //template
    var TEXT_BTN_ANGLE = 'Задать угол';
    var TEXT_BTN_CONFIRM = 'Подтвердить';
    var TEXT_BTN_EDIT = 'Изменить';
    var TEXT_BTN_CLEAR = 'Очистить';

    var WIDTH = param.overlay.options.width;

    ////////////\\\\\\\\\\\\
    // Interface elements \\
    function Button(opt) {
        // options = {
        //   active: активность кнопки (Boolean),
        //   hidden: сокрытие кнопки (Boolean),
        //   over: указатель над кнопкой (Boolean),
        //   text: [текст на кнопке (Array)],
        //   style: {стиль кнопки (Object)},
        //   pos: {
        //     x: x координата (Number),
        //     y: y координата (Number)
        //   },
        //   size: {
        //     w: ширина кнопки (Number),
        //     h: высота кнопки (Number)
        //   },
        //   r: радиус скругления углов (Number),
        //   mouse: {
        //     x: x координата мыши (Number),
        //     y: y координата мыши (Number)
        //   },
        //   ctx: контекст холста
        // }

        this.active = true;
        this.hidden = true;
        this.over = false;

        this.mouse = {
            x: null,
            y: null
        };

        this.ctx = opt.ctx || param.ctx;

        this.text = opt.text || ['Button'];

        if (opt.style) {
            this.style = {};
            for (var i in opt.style) {
                this.style[i] = opt.style[i];
            }

            if (!this.style.bg) { //temporary solution
                this.style.bg = param.button.style.main.bg;
            }
            if (!this.style.txt) { //temporary solution
                this.style.txt = param.button.style.main.txt;
            }
        } else {
            this.style = param.button.style.main;
        }
        this.style.font = this.style.font || param.fontStyle;

        this.r = opt.r || param.borderBoxRadius || 2;

        var m = param.button.m || 0;
        this.m = m;

        this.l = 0; //задаёт цепочку кнопок

        var x = 0;
        var y = 0;
        if (opt.pos) {
            x = (opt.pos.x || x) + m;
            y = (opt.pos.y || y) + m;
        }

        this.ctx.save();
        this.ctx.font = this.style.font;
            var w = this.ctx.measureText(this.text[0]).width + 10;
        this.ctx.restore();

        var h = param.button.h || 14;
        if (opt.size) {
            w = opt.size.w || w;
            h = opt.size.h || h;
        }

        var align = this.style.align || 'left';
        if (align == 'right') {
            x -= w + 2 * m;
        } else if (align == 'center') {
            x -= w / 2 + m;
        }

        var valign = this.style.valign || 'top';
        if (valign == 'bottom') {
            y -= h + 2 * m;
        } else if (valign == 'middle') {
            y -= h / 2 + m;
        }

        this.pos = {
            x: x,
            y: y
        };
        this.size = {
            w: w,
            h: h
        };
    }

    Button.prototype.hide = function() {
        if (!this.hidden) {
            this.hidden = true;
        }
        return this;
    };

    Button.prototype.show = function() {
        if (this.hidden) {
            this.hidden = false;
        }
        return this;
    };

    Button.prototype.draw = function(coords, dX) {

        if (this.hidden) {
            this.over = false;
            return this;
        }

        dX = dX || 0;
        coords = coords || this.mouse;

        this.active = param.window.focus;

        var x = this.pos.x + dX;
        var y = this.pos.y;

        var w = this.size.w;
        var h = this.size.h;
        var r = this.r;

        var ctx = this.ctx;

        ctx.save();
        this.ctx.font = this.style.font;
        ctx.fillStyle = this.style.bg.off;
        ctx.roundedRect(x, y, w, h, r);

        if (this.active) {
            this.over = ctx.isPointInPath(coords.x, coords.y);

            if (this.over && !param.dragEvent) {
                ctx.fillStyle = this.style.bg.on;
            }
            ctx.fill();
            ctx.fillStyle = this.style.txt.on;
        } else {
            ctx.fill();
            ctx.fillStyle = this.style.txt.off;
        }
        ctx.textAlign = 'center';
        ctx.fillText(this.text[0], x + w/2, y + h/2 + 4);

        ctx.restore();

        this.l = x + w;

        ////////////
        param.button.over = this.over || param.button.over;

        return this;
    };

    /////////////////////
    var w0 = param.width;
    var h0 = param.height;
    var buf = param.buffer;
    if (h0 < 100) param.overlay.rmode = true;
    if (!this.init) {
        this.init = true;
        this.visibility = false;
        this.button = {};
        this.width = WIDTH;
        this.height = h0;
        this.position = {
            x: 0,
            y: 0
        };

        buf.overlay.canv.width = this.width;
        buf.overlay.canv.height = this.height;

        this.canv = document.getElementById(param.overlayId);
        this.ctx = this.canv.getContext('2d');
    }

    var w = this.width;
    var h = this.height;

    if (w0 >= 800 && h0 >= 100) {
        this.canv.width = w;
    } else {
        this.canv.width = w0;
    }
    this.canv.height = h0;
    this.canv.style.top    = '-' + (this.height+5) + 'px';
    this.canv.style.marginBottom    = '-' + (this.height) + 'px';

    var ctx = buf.overlay.ctx;

    ctx.clearRect(0, 0, w, h);

    completePlan();

    this.ctx.clearRect(0, 0, w, h);
    this.ctx.drawImage(buf.overlay.canv, 0, 0);

    function completePlan() {

        var coords = {
            x: param.lastMouseCoords.x - param.width + param.overlay.options.width,
            y: param.lastMouseCoords.y
        };

        var contentHeight = 300;//temporary

        var mTop = (param.height - contentHeight) / 2;
        var m = 20;
        var leftPos = w / 2;

        drawInfoBlock();

        var btn = {
            confirm: new Button({
                text: [TEXT_BTN_CONFIRM],
                pos: {
                    x: leftPos,
                    y: mTop + 10

                },
                style: {
                    font: FONT_BUTTON,
                    bg: {
                        on: BG_BTN_PRIMARY_OVER,
                        off: BG_BTN_PRIMARY
                    },
                    txt: {
                        on: COLOR_BTN_PRIMARY,
                        off: COLOR_BTN_PRIMARY
                    },
                    align: 'center'
                },
                ctx: ctx
            }),
            edit: new Button({
                text: [TEXT_BTN_EDIT],
                pos: {
                    x: leftPos,
                    y: mTop + 50
                },
                style: {
                    font: FONT_BUTTON,
                    bg: {
                        on: BG_BTN_SUCCESS_OVER,
                        off: BG_BTN_SUCCESS
                    },
                    txt: {
                        on: COLOR_BTN_SUCCESS,
                        off: COLOR_BTN_SUCCESS
                    },
                    align: 'center'
                },
                ctx: ctx
            }),
            clear: new Button({
                text: [TEXT_BTN_CLEAR],
                pos: {
                    x: leftPos,
                    y: mTop + 90
                },
                style: {
                    font: FONT_BUTTON,
                    bg: {
                        on: BG_BTN_DANGER_OVER,
                        off: BG_BTN_DANGER
                    },
                    txt: {
                        on: COLOR_BTN_DANGER,
                        off: COLOR_BTN_DANGER
                    },
                    //valign: 'bottom',
                    align: 'center'
                },
                ctx: ctx
            })
        };

        param.overlay.button = btn;
        param.overlay.button.over = false;

        ctx.save();
        ctx.strokeStyle = COLOR;
        ctx.font = param.fontStyle;

        for (var i in btn) {
            if (i == 'over') continue;
            btn[i].show().draw(coords);
            param.overlay.button.over = btn[i].over || param.overlay.button.over;
        }

        ctx.restore();

        function drawInfoBlock() {
            var pts = param.points;
            var l = [];
            var unit = param.input.unit;

            for (var i = 1; i < pts.length; i++) {
                l.push("Сторона " + i + ": " + pts[i].distance + unit);
            }
            l.push("Сторона " + pts.length + ": " + pts[0].distance + unit);

            var square = param.getSquare() / 1E4;
            var perimeter = param.getPerimeter() / 100;

            ctx.save();

            ctx.fillStyle = COLOR;
            ctx.textAlign = 'center';

            if(param.overlay.rmode) {
                mTop = 40;
                leftPos = 100;
            }
            ctx.font = FONT_HEAD;
            ctx.fillText(TEXT_HEAD, leftPos, mTop);

            ctx.font = FONT_INFOBLOCK;

            mTop += 1.5 * m;
            ctx.fillText(TEXT_SQUARE + square + TEXT_SQUARE_UNIT, leftPos, mTop);

            mTop += 1.5 * m;
            ctx.fillText(TEXT_PERIMETER + perimeter + TEXT_PERIMETER_UNIT, leftPos, mTop);

            mTop += 0.5 * m;
            for (var i = 0; i < l.length; i++) {
                mTop += m;
                ctx.fillText(l[i], leftPos, mTop);
            }

            mTop += 1.5 * m;
            ctx.fillText(TEXT_CORNER + param.getNumberAngles(), leftPos, mTop);

            ctx.restore();
        }
    }
}

param.overlay.mouseUpHandler = function(e) {

    var elemId;

    var btn = param.overlay.button;

    for (var i in btn) {
        if (i == 'over') continue;
        if (btn[i].over) {
            elemId = i;
            break;
        }
    }

    switch (elemId) {
        case 'confirm':
            if (typeof param.confirm == 'function') {
                param.confirm();
            }
            break;

        case 'edit':
            param.complete = false;
            param.overlay.customAngle = false;

            this.hide();
            break;

        case 'clear':
            param.overlay.customAngle = false;

            param.clearPlan();

            this.hide();
            break;

        default:
            this.hide();
            break;
    }

};

param.overlay.show = function() {
    this.visibility = true;
    this.canv.style.display = 'block';
    if (1 == 1) {
        setTimeout(function(){
            var pos = param.overlay.canv.width - param.width;
            param.overlay.canv.style.right = pos + 'px';
        }, 0);
    } else {
        this.canv.style.right = '0';
        this.canv.style.background = 'rgba(0, 0, 0, 0.8)';
    }
};

param.overlay.hide = function() {
    this.visibility = false;
    param.complete = false;
    if (1 == 1) {
        var pos = -100;
        this.canv.style.right = pos + '%';
        setTimeout(function() {
            param.overlay.canv.style.display = 'none';
        }, 600);
    } else {
        this.canv.style.display = 'none';
        this.canv.style.left = '';
        this.canv.style.background = '';
    }
};

}
