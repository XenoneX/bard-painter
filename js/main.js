//ver. 2.1.67
var d = document;

Number.prototype.degree = function() {
    return this * Math.PI / 180;
};

CanvasRenderingContext2D.prototype.dottedLineTo = dottedLineTo;
CanvasRenderingContext2D.prototype.roundedRect = roundedRect;

function dottedLineTo(x0, y0, x1, y1, l1, l2){
/* x0, y0: Координаты точки начала рисования линии
 * x1, y1: Координаты точки окончания рисования линии
 * l1: Длина пунктира
 * l2: Длина промежутка между пунктирами
 * */
    l2 = l2 || l1;

    var dx = x1 - x0;
    var dy = y1 - y0;

    var L = Math.sqrt(dx * dx + dy * dy);//length of line
    var l = l1 + l2;
    var n = L / l ^ 0;//number of slices
    var dL = L - l * n;//residue

    var k = dL / L;

    var x2 = x0;
    var y2 = y0;

    var dX = k * dx;
    var dY = k * dy;

    var dXi = (dx - dX) / n;
    var dYi = (dy - dY) / n;

    var dX1 = dXi * l1 / l;
    var dY1 = dYi * l1 / l;

    var dX2 = dXi * l2 / l;
    var dY2 = dYi * l2 / l;

    var k1 = 1;

//    if (l1 >= l2) {
//        var dl = dL - l1;
//        if (dl > 0) {
//            k1 = (l1 - (l2 - dl)) / (2 * l1);
//        } else {
//            k1 = (l1 + dl / 2) / l1;
//        }
//    }

    x2 += k1 * dX1;
    y2 += k1 * dY1;

    this.moveTo(x0, y0);
    this.lineTo(x2, y2);

    var line = !1;
    var parity = Math.abs(dX) > Math.abs(x2 - x0);

    for (var i = 0; i < 2 * n; i++) {
        if (!parity && i == 2 * n - 1) {
            if (L - currentLength(dX1, dY1) <= 0) {
                break;
            }
        }
        if (line) {
            x2 += dX1;
            y2 += dY1;
            this.lineTo(x2, y2);
        } else {
            x2 += dX2;
            y2 += dY2;
            this.moveTo(x2, y2);
        }
        line = !line;
    }

    if (!line) {
        x2 += dX2;
        y2 += dY2;
        this.moveTo(x2, y2);
    }

    if (L - currentLength() >= 0) {
        this.lineTo(x1, y1);
    }

    this.moveTo(x1, y1);

    function currentLength(dx, dy) {
          dx = dx || 0;
          dy = dy || 0;
          return Math.sqrt(Math.pow(x2 + dx - x0, 2) + Math.pow(y2 + dy - y0, 2));
    }
}
function roundedRect(x, y, w, h, r){
/* x: Координата верхнего левого угла по горизонтали
 * y: Координата верхнего левого угла по вертикали
 * w: Ширина прямоугольника
 * h: Высота прямоугольника
 * r: Радиус закруглений
 * */
    this.beginPath();
    this.moveTo(x+r, y);
    this.lineTo(x+w-r, y);
    this.quadraticCurveTo(x+w, y, x+w, y+r);
    this.lineTo(x+w, y+h-r);
    this.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    this.lineTo(x+r, y+h);
    this.quadraticCurveTo(x, y+h, x, y+h-r);
    this.lineTo(x, y+r);
    this.quadraticCurveTo(x, y, x+r, y);
    this.closePath();
}

var param = {
    //callbacks
    done: null,
    confirm: null,
    destroy: null,

    // scale settings
    listScale: [ 5, 10, 20, 40, 80 ],
    scale: 100, // pixels per unit
    startScale: 40,
    rateOverscale: 2, // step of zoom for large plans

    // coordinates of background images depending on the scale
    bgCoords: {
        x: [0, 0, 200, 200, 200],
        y: [0, 0, 0, 0, 100],
        l: [200, 100, 100, 50, 100]
    },

    path: {
        home: '',
        img: 'img/',
        js: 'js/'
    },

    // overlay settings
    parentId: 'paint_bard',
    canvasId: 'plan2d',
    overlayId: 'overlay',
    infoblockId: 'infoblock',

    // colors
    backgroundBoxColor: '#fff',
    backgroundColor: "#0b5090",
    backgroundMainPointsColor: "#1e66a1", // points of coords background
    backgroundSecondaryPointsColor: "#155b98", // points of coords background
    borderBoxColor: "#000",
    linesColor: "#fff",
    linesCrossColor: "rgba(255, 50, 10, 1)",
    linesNewPointColor: "rgba(255, 255, 255, 0.7)",
    linesNewPointCrossColor: "rgba(255, 50, 10, 0.7)",
    orthoLinesColor: "rgba(255, 255, 255, 0.5)",
    orthoPointColor: "rgba(255, 255, 255, 0.3)",
    pointsBorderColor: "#fff",
    pointsFillColor: "#fff",
    pointsFirstFillColor: "#999",
    shadowColor: "rgba(0, 0, 0, 0.6)",

    // font
    fontStyle: "bold 12px monospace",
    textColor: "#000000",

    // element sizes, px
    borderBoxRadius: 3,
    lineLengthBoxHeight: 14,
    linesWidth: 2,
    orthoLinesGap: 50,
    orthoLinesLedge: 20,
    orthoLinesWidth: 1,
    orthoStickRadius: 10,
    pointsBorderWidth: 1,
    r1: 4, // default point radius
    r2: 6, // hover point radius

    // interface settings
    // colors, sizes
    button: {
        lineScale: {},
        style: {
            main: {
                bg: {
                    on: "#2abc2a",
                    off: "#ffffff"
                },
                txt: {
                    on: "#000000",
                    off: "#666666"
                }
            },
            clear: {
                bg: {
                    on: "#b84a53",
                    off: "#ffffff"
                }
            }
        },
        h: 24, // default height
        w: 24, // default width
        m: 10, // margin
        over: false
    },

    // services
    buffer: {
        bg: {},
        interface: {},
        main: {}
    },
    closed: false, //shape is closed
    complete: false, //drawing is completed
    crossNewLine: false,
    crossLines: false,
    cursor: {
        defaults: false,
        pencil: true,
        pointer: false,
        canvMove: false,
        move: false
    },
    dragEvent: false,
    history: {},
    offset: {x : 0, y : 0}, //canvas offset

    lastMouseCoords: { x: 0, y: 0 },
    lastBgStartCoords: { x: 0, y: 0 },
    mouseDownFlag: false,
    mouseEnterFlag: false,
    mouseOverPointFlag: false,
    orthoLines: [],
    orthoPoints: [],

    plugin: {
        infoblock: true,
        overlay: true,
        sketch: true
    },

    point: {
        moving: false,
        over: false,
        selected: null
    },
    points: [],
    polygon: {
        maxW: 0, // максимальные размеры плана
        maxH: 0,
        center: {x: 0, y: 0},
        coordsCenter: {x: 0, y: 0}
    },
    translateCanv: {x: 0, y: 0},
    window: {
        focus: true
    },

    // movement of canvas when the pointer approaching to the edge of the window
    sideMove: {
        id: null,
        flag: false,
        l: 10,
        dx: 0,
        dy: 0
    },

    // page parameters
    bgDist: null, //the distance between splines of background
    canv: null,
    ctx: null,
    currScale: null,
    currScaleIdx: null,
    elem: {
        overlay: null,
        infoblock: null
    },
    height: null,
    input: {
        active: false,
        width: 0,
        value: '',
        unit: ' см',
        caret: 0
    },
    loadImg: false, //flag of finish loading all images
    realScale: [],
    width: null,
    infoHeight: null,

    //accessory functions
    getPoints: null,
    getNumberAngles: null,
    getPerimeter: null,
    getSquare: null
};

function paintInit(options) {
    //initialisation of required parameters
    if(!options) return;

    extend(options);
    beginDraw();
}

function extend(options) {
    //extend object
    for(var a in options) {
        param[a] = options[a];
    }
}

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

function beginDraw() {

    if (!prepareLayer()) {
        //log('Application is broken');
        return;
    }

    startApp();

    function startApp() {

        initPlugins();

        if(!param.infoblock.loaded) {
            loadModule(param.infoblock);
        }

        for (var key in param.buffer) {
            createCanvas(param.buffer[key]);
        }

        param.buffer.point = {
            active: {},
            noactive: {}
        };

        for (var i in param.buffer.point) {
            param.buffer.point[i] = {
                main: {},
                second: {}
            };

            for (var j in param.buffer.point[i]) {
                createCanvas(param.buffer.point[i][j]);
            }
        }

        param.buffer.image = {
            bg: new Image(),
            scale: new Image()
        };
        param.buffer.image.bg.src = param.path.home + param.path.img + 'grid.png';
        param.buffer.image.scale.src = param.path.home + param.path.img + 'linescale.png';

        for ( var i = 0; i < param.listScale.length; i++ ) {
            if ( param.startScale == param.listScale[i] ) {
                param.currScaleIdx = i;
            }
            param.realScale.push( param.scale / param.listScale[i] );
        }
        param.currScale = param.realScale[ param.currScaleIdx ];
        param.bgDist = param.bgCoords.l[ param.currScaleIdx ];

        drawMousePoints();
        param.lastBgStartCoords.x = param.lastBgStartCoords.y = 0;
        // offset of the begining of coordinates to the center of canvas
        param.translateCanv.x = Math.floor(param.width / 2);
        param.translateCanv.y = Math.floor(param.height / 2);

        resizeCanvas();

        setHandlers();
    }

    function initPlugins() {

        var layer;
        for (var i in param.plugin) {
            param.buffer[i] = {};

            param[i] = {
                loaded: false
            };

            switch (i) {

                case 'infoblock':
                    layer = param.infoblock;
                    layer.id = 'loadInfoBlock';
                    layer.src = param.path.home + param.path.js + 'infoblock-js.js';
                    layer.run = function() {
                        try {
                            param.infoblock.start();
                            param.infoblock.scroll();
                            //param.infoblock.hide('start');
                        } catch(e) {
                            //log('Infoblock draw error:', e);
                        }
                    };
                    break;

                case 'overlay':
                    layer = param.overlay;
                    layer.id = 'loadOverlay';
                    layer.src = param.path.home + param.path.js + 'overlay.js';
                    layer.run = function() {
                        try {
                            param.overlay.draw();
                        } catch (e) {
                            //log('Overlay draw error:', e);
                        }
                        try {
                            param.overlay.show();
                        } catch (e) {
                            //log('Overlay show error:', e);
                        }
                    };
                    break;

                case 'sketch':
                    layer = param.sketch;
                    layer.id = 'loadDrawSketch';
                    layer.src = param.path.home + param.path.js + 'drawsketch.js';
                    layer.run = function() {
                        try {
                            param.sketch.draw();
                        } catch (e) {
                            //log('Sketch error:', e);
                        }
                    };
                    break;
            }
        }
    }

    function setHandlers() {
        var parent = d.getElementById(param.parentId);
        //window.addEventListener( 'resize', resizeCanvas, false );
        window.addEventListener( 'focus', winFocus, false );
        window.addEventListener( 'blur', winBlur, false );
        d.addEventListener( 'keydown', keyDownEventHandler, false );
        d.addEventListener( 'keypress', handlerNum, false );
        parent.addEventListener( 'mouseover', mouseOverCanvHandler, false );
        parent.addEventListener( 'mouseout', mouseOutCanvHandler, false );
        parent.addEventListener( 'mousedown', mouseDownHandler, false );
        parent.addEventListener( 'mouseup', mouseUpHandler, false );
        parent.addEventListener( 'mousemove', mouseMoveHandler, false );
        parent.addEventListener( 'dblclick', mouseDblClickHandler, false );
        parent.addEventListener( 'mousewheel', mouseWheelHandler, false );
        parent.addEventListener( 'wheel', mouseWheelHandler, false );

    }

    function winFocus() {
        param.window.focus = true;
        drawPlan();
    }

    function winBlur() {
        param.window.focus = false;
        drawPlan();
    }

    function resizeCanvas() {
        setParams();

        var loadingBuffer = function() {
            param.loadImg = param.buffer.image.bg.complete &&
                    param.buffer.image.scale.complete;
            if (param.loadImg) {
                drawBackground(0, 0);
                drawPlan();
            } else {
                showLoader();
                setTimeout(loadingBuffer, 60);
            }
        };

        loadingBuffer();

        function showLoader() {

            var ctx = param.ctx;
            var p = param.buffer.point;
            var w = param.width;
            var h = param.height;

            ctx.save();

            ctx.translate(w / 2, h / 2);
            ctx.fillStyle = param.backgroundColor;
            ctx.fillRect(-w / 2, -h / 2, w, h);

            ctx.drawImage(p.active.main.canv, -10, -10);
            ctx.drawImage(p.noactive.second.canv, 2, -8);
            ctx.drawImage(p.noactive.main.canv, -8, 2);
            ctx.drawImage(p.active.second.canv, 0, 0);

            ctx.restore();
        }
    }

    ///////////////////////////////
    // Handlers of mouse buttons //
    function keyDownEventHandler(e) {
        var key = {
            Backspace: 8,
            Del: 46,
            Esc: 27,
            Enter: 13,
            Tab: 9,
            L: 76,
            S: 83,
            Y: 89,
            Z: 90,
            Left: 37,
            Right: 39
        };

        switch (e.keyCode) {

            case key.Backspace:
                if (param.input.active) {
                    e.preventDefault();
                    handlerBackspace();
                }
                break;

            case key.Del:
                if (param.input.active) {
                    e.preventDefault();
                    handlerDelete();
                }
                break;

            case key.Esc:
                handlerEsc();
                break;

            case key.Enter:
                if (e.ctrlKey) {
                    handlerCtrlEnter(e);
                } else {
                    handlerEnter();
                }
                break;

            case key.Left:
                if (param.input.active) {
                    e.preventDefault();
                    caretMoveLeft();
                }
                break;

            case key.Right:
                if (param.input.active) {
                    e.preventDefault();
                    caretMoveRight();
                }
                break;

            case key.S:
                if (e.ctrlKey && e.shiftKey) {
                    savePicture();
                }
                break;

            case key.Tab:
                if (param.input.active) {
                    e.preventDefault();
                    handlerEnter();
                }
                break;

            case key.Z:
                if (e.ctrlKey) {
                    undo();
                }
                break;

            case key.Y:
                if (e.ctrlKey) {
                    redo();
                }
                break;
        }
    }

    function mouseOverCanvHandler(e) {
        param.mouseEnterFlag = true;
        drawPlan();
    }

    function mouseOutCanvHandler(e) {
        param.mouseEnterFlag = false;
        param.mouseDownFlag = false;
        param.point.moving = false;
        param.dragEvent = false;
        if (param.sideMove.flag) {
            param.sideMove.flag = false;
            clearTimeout(param.sideMove.id);
        }
        drawPlan();
    }

    function mouseDownHandler(e) {

        var id = e.target.id;
        if (id == param.canvasId) {
            param.mouseDownFlag = true;
            clearTimeout(param.sideMove.id);
        }
    }

    function mouseUpHandler(e) {
        var id = e.target.id;

        if (id == param.overlayId) {
            param.overlay.mouseUpHandler(e);
        }
        // event handlers on canvas
        if (id == param.canvasId) {

            if (!param.mouseDownFlag) return;

            param.mouseDownFlag = false;

            if (param.input.active) {
                inputDisabled();
            }

            var coords;

            if (param.point.moving) {

                coords = orthoPushPoint(param.points[param.point.selected].coordsReal);

                var noOverlapPoints = true;
                var numPoints = param.points.length;
                var lastIdx = numPoints - 1;
                var movingPoint = param.point.selected;

                coords.x = Math.round(coords.x);
                coords.y = Math.round(coords.y);

                if (lastIdx != 0) {
                    if (movingPoint == lastIdx && checkDoublePoint(coords, 0)) {
                        noOverlapPoints = false;
                        removePoint(lastIdx);
                        param.point.selected = 0;
                        if (numPoints - 1 > 2) {
                            completeDraw();
                        }
                    } else {
                        for (var i = 0; i < numPoints; i++) {
                            if (i == movingPoint) continue;
                            if (checkDoublePoint(coords, i)) {
                                noOverlapPoints = false;
                                removePoint(movingPoint);
                                if (i < movingPoint) {
                                    param.point.selected = i;
                                } else if (param.point.selected == 0) {
                                    if (i == lastIdx && numPoints - 1 > 2) {
                                        completeDraw();
                                    }
                                    param.point.selected = i - 1;
                                }
                                break;
                            }
                        }
                    }
                }

                if (noOverlapPoints) {
                    param.points[param.point.selected].coordsReal.x = coords.x;
                    param.points[param.point.selected].coordsReal.y = coords.y;
                }

                param.point.moving = false;
                setDistance();
                getCrossLines();

            } else if (param.dragEvent) {
                param.dragEvent = false;
            } else {
                coords = getMouseCoords(e);
                switch (true) {
                    case param.button.drawing.over:
                        param.button.drawing.over = false;
                        //param.complete = !param.complete;
                        if (!param.complete) {
                            completeDraw();
                        }
                        break;

                    case param.button.del.over:
                        param.button.del.over = false;
                        if (param.closed) {
                            param.closed = false;
                        } else {
                            removePoint( param.points.length - 1 );
                            // update data of points
                            if ( param.points.length > 0 ) {
                                setDistance();
                                getCrossLines();
                            }
                        }
                        break;

                    case param.button.complete.over:
                        param.button.complete.over = false;
                        completeDraw();
                        break;

                    case param.button.clear.over:
                        param.button.clear.over = false;
                        clearPlan();
                        param.complete = false;
                        break;

                    case param.button.lineScale.fullPlan.over:
                        autoZoom();
                        autoCenter();
                        break;

                    case param.button.lineScale.zoomOut.over:
                        changeZoom(0);
                        break;

                    case param.button.lineScale.zoomIn.over:
                        changeZoom(1);
                        break;

                    default:
                        if (!param.complete && !param.closed) {
                            pushPoints(coords);
                            if (!param.point.over && autoZoom()) autoCenter();
                        }
                }
            }

            drawPlan();
            if (param.point.over) {
                drawNewPoint(coords);
            }
        }
    }

    function mouseMoveHandler(e) {
        var id = e.target.id;

        var coords = getMouseCoords(e);
        var cursor = {
            coordsCanv: coords,
            coordsReal: getRealCoords(coords)
        };

        if (id == param.canvasId) {
            clearTimeout(param.sideMove.id);

            param.point.over = checkMouseIsOverPoint(cursor);

            if (param.mouseDownFlag) {
                if (param.point.over && !param.complete) {
                    param.point.moving = true;
                    changePoint(coords.dx, coords.dy);
                    drawPlan();
                    drawNewPoint(cursor);
                } else {
                    param.dragEvent = true;

                    if (param.input.active) {
                        inputDisabled();
                    }

                    param.translateCanv.x += coords.dx;
                    param.translateCanv.y += coords.dy;

                    drawBackground(coords.dx, coords.dy);
                    drawPlan();
                }
            } else {
                mouseOverSideMove(e);
                if (param.sideMove.flag && param.input.active) {
                    inputDisabled();
                }
                if (param.sideMove.flag) {
                    sideMove(coords); // canvas move
                } else {
                    // if not move then draw
                    drawPlan();
                    drawNewPoint(cursor);
                }
            }
        } else {
            if (param.dragEvent) {
                param.dragEvent = false;
            }
        }

        if (id == param.overlayId) {
            if (param.complete && param.overlay.loaded) {
                param.overlay.draw();
            }
        }

        setCursor();
    }

    function mouseDblClickHandler(e) {
        if (param.complete) return;

        var id = e.target.id;

        if (id == param.canvasId) {
            if (param.point.over) {
                removePoint(param.point.selected);
                param.point.over = false;
                setDistance();
                getCrossLines();
                drawPlan();
            }
        }
    }

    function mouseWheelHandler(e) {
        var id = e.target.id;
        if (id == param.canvasId) {
            clearTimeout(param.sideMove.id);

            var delta = -e.deltaY || e.wheelDelta || e.detail;
            var coords = getMouseCoords(e);
            var k = 0;

            e.preventDefault();

            if (delta > 0 && param.currScaleIdx > 0) {
                param.currScale = param.realScale[param.currScaleIdx - 1];
                k = 1 - param.currScale / param.realScale[param.currScaleIdx];
                param.currScaleIdx--;
            } else if (delta < 0 && param.currScaleIdx < param.realScale.length - 1) {
                param.currScale = param.realScale[ param.currScaleIdx + 1 ];
                k = 1 - param.currScale / param.realScale[param.currScaleIdx];
                param.currScaleIdx++;
            } else {
                return;
            }

            var dx = Math.round(k * coords.x);
            var dy = Math.round(k * coords.y);

            param.bgDist = param.bgCoords.l[param.currScaleIdx];

            drawBackground(dx, dy);
            param.translateCanv.x += dx;
            param.translateCanv.y += dy;

            coords.x -= dx;
            coords.y -= dy;
            var cursor = {
                coordsCanv: {
                    x: coords.x,
                    y: coords.y
                },
                coordsReal: getRealCoords(coords)
            };

            drawPlan();

            drawNewPoint(cursor);
        }
    }

    //////////////////////////////////
    // Handlers of keyboard buttons //
    function handlerEsc() {
        if (param.input.active) {
            inputDisabled();
            drawPlanWithCursor();
        } else {
            // completion of drawing
            if (param.crossLines || param.points.length < 3 || param.complete) {
                return;
            } else {
                clearTimeout(param.sideMove.id);
                completeDraw();
                drawPlan();
            }
        }
    }

    function handlerCtrlEnter(e) {
        //log(param);
    }

    function handlerEnter() {
        if (param.input.active) {

            var l = param.input.value; // length of new segment
            inputDisabled();

            if (l != '') {
            // обрабатываем введённое значение
                var coords1 = {
                    x: param.points[ param.points.length - 1 ].coordsReal.x,
                    y: param.points[ param.points.length - 1 ].coordsReal.y
                }
                var coords2 = {
                    x: param.lastMouseCoords.x - param.translateCanv.x,
                    y: param.lastMouseCoords.y - param.translateCanv.y
                };
                coords2 = getRealCoords( coords2 );
                // привязанность к орто-линиям
                if ( param.orthoLines.length > 0 ) {
                    coords2 = orthoPushPoint( coords2 );
                }
                var dx = coords2.x - coords1.x;
                var dy = coords2.y - coords1.y;

                var x, y;
                if ( dx == 0 ) {
                    y = l;
                    x = 0;
                } else if ( dy == 0 ) {
                    x = l;
                    y = 0;
                } else {
                    var k = dx / dy;
                    y = Math.sqrt( l * l / ( k * k + 1 ) );
                    x = k * y;
                }
                if ( dy < 0 ) {
                    y *= -1;
                    x *= -1;
                } else if ( dy == 0 && dx < 0 ) {
                    x *= -1;
                }

                var coords = {
                    x: Math.round( x ) + coords1.x,
                    y: Math.round( y ) + coords1.y
                };
                if (checkDoublePoint(coords, 0)) {
                    if (param.points.length > 2) {
                        completeDraw();
                    }
                } else {
                    param.points.push({
                        coordsReal: {
                            x: coords.x,
                            y: coords.y
                        },
                        selected: false
                    });
                }
                setDistance();
                getCrossLines();

                if ( outsideSize() ) {
                    moveCenterToNewPoint();
                }

                if ( autoZoom() || pointOutsideViewport() ) autoCenter();

                drawPlan();
            } else {
                drawPlanWithCursor();
            }

        } else if (!param.complete && param.points.length > 0) {
            inputLength();
        }
    }

    function handlerBackspace() {
        var val = param.input.value;
        var pos = param.input.caret;

        param.input.value = val.slice(0, pos - 1) + val.slice(pos);
        caretMoveLeft();
        inputLength();
    }

    function handlerDelete() {
        var val = param.input.value;
        var pos = param.input.caret;

        param.input.value = val.slice(0, pos) + val.slice(pos + 1);
        inputLength();
    }

    function handlerNum(e) {
        if (param.points.length == 0) return;

        var keycode = e.which;

        if (keycode === null) {
            keycode = e.keyCode;
        }

        if (keycode < 32) return;

        var ch = String.fromCharCode(keycode)

        if (ch >= '0' && ch <= '9') {
            e.preventDefault();
            var val = param.input.value;
            var pos = param.input.caret;
            param.input.value = val.slice(0, pos) + ch + val.slice(pos);
            caretMoveRight();
            inputLength();

        } else {
            var minus = 45;
            var plus = 43;

            switch (keycode) {
                case minus:
                    changeZoom(0);
                    drawPlanWithCursor();
                    break;

                case plus:
                    changeZoom(1);
                    drawPlanWithCursor();
                    break;
            }
        }
    }

    /////////////////////////
    // Accessory functions //

    function rotate(a, b, c) {
        return (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
    }

    function getMouseCoords(e) {
        var offsetParent = d.getElementById(param.parentId).getBoundingClientRect();
        param.offset.x = offsetParent.left;
        param.offset.y = offsetParent.top;
        var cm = {
            x: e.clientX - param.offset.x,
            y: e.clientY - param.offset.y
        };
        // displacement of the mouse pointer on the abscissa
        var dx = cm.x - param.lastMouseCoords.x;
        // displacement of the mouse pointer on the ordinate
        var dy = cm.y - param.lastMouseCoords.y;
        param.lastMouseCoords.x = cm.x;
        param.lastMouseCoords.y = cm.y;
        return {
            x: Math.round(cm.x - param.translateCanv.x),
            y: Math.round(cm.y - param.translateCanv.y),
            dx: dx,
            dy: dy
        }
    }

    function getCanvCoords(coords) {
        return {
            x: Math.round( coords.x * param.currScale ),
            y: Math.round( coords.y * param.currScale )
        }
    }

    function getRealCoords(coords) {
        return {
            x: Math.round( coords.x / param.currScale ),
            y: Math.round( coords.y / param.currScale )
        }
    }

    function prepareLayer() {
        if(param.parentId == null || d.getElementById(param.parentId) == null) {
            //log('Parent element not declared');
            return false;
        }

        var placeholder = document.querySelector('#' + param.parentId + ' img');
        if (placeholder) {
            placeholder.style.display = 'none';
        }

        var parent  = d.getElementById(param.parentId);
            parent.style.overflow = 'hidden';

        var main = createCanvas({});
            main.canv.id = param.canvasId;
            main.canv.className = 'cursor';

        var overlay = createCanvas({});
            overlay.canv.id = param.overlayId;
            overlay.canv.className = 'hidden';

        parent.appendChild(main.canv);
        parent.appendChild(overlay.canv);

        param.canv = main.canv;
        param.ctx = main.ctx;

        return true;
    }

    function setParams() {
    // changing the initial settings
    /*
        param.width = window.innerWidth;
        param.height = window.innerHeight-60;
    */
        var parent  = d.getElementById(param.parentId);
        var offsetParent = parent.getBoundingClientRect();
        param.infoHeight = Math.round(parent.offsetHeight*0.05);
        if(param.infoHeight < 35) param.infoHeight = 35;
        param.width = parent.offsetWidth;
        param.height = parent.offsetHeight-param.infoHeight;
        if(param.height < 80) param.height = 80;
        param.offset.x = offsetParent.left;
        param.offset.y = offsetParent.top;
        var w = param.width;
        var h = param.height;

        param.canv.width = w;
        param.canv.height = h;

        var list = 'bg main interface'.split(' ');

        for (var i = 0; i < list.length; i++) {
            param.buffer[list[i]].canv.width = w;
            param.buffer[list[i]].canv.height = h;
        }

        setPluginsParams();
    }

    function setPluginsParams() {
        var w = param.width;
        var h = param.height;
        var buf = param.buffer;

        for (var k in param.plugin) {
            if (param.plugin[k] && param[k].loaded) {
                switch (k) {

                    case 'overlay':
                        if (w >= 800 && h >= 600) {
                            buf[k].canv.width = param[k].width;
                        } else {
                            buf[k].canv.width = w;
                        }
                        buf[k].canv.height = h;
                        break;

                    case 'sketch':
                        param[k].height = param[k].width * h / w;
                        param[k].position.x = param.button.m;
                        param[k].position.y = h - 2 * param.button.m - param.button.h - param[k].height;

                        buf[k].canv.width = param[k].width;
                        buf[k].canv.height = param[k].height;
                        break;

                     case 'infoblock':
                        if (w >= 800 && h >= 600) {
                            buf[k].canv.width = param[k].width;
                        } else {
                            buf[k].canv.width = w;
                        }
                        buf[k].canv.height = h;
                        break;

                    default:
                        buf[k].canv.width = w;
                        buf[k].canv.height = h;
                        break;
                }
            }
        }
    }

    function pushPoints(coords) {
        if( param.points.length <= 0) {
            //param.infoblock.hide('first_point');
        }

        // adding of points to an array
        var coordsReal = getRealCoords(coords);
        var dblPoint = false;
        if (param.point.over && param.point.selected == 0 && param.points.length > 2) {
            completeDraw();
        } else {
            // привязанность к орто-линиям
            if ( param.points.length > 0 && param.orthoLines.length > 0 ) {
                    coordsReal = orthoPushPoint( coordsReal );
            }
            if ( param.points.length > 2 && checkDoublePoint( coordsReal, 0 ) ) {
                dblPoint = true;
                completeDraw();
            }
            var i = param.points.length - 1;
            while ( !dblPoint && i >= 0 ) {
                dblPoint = checkDoublePoint( coordsReal, i );
                i--;
            }
            if ( param.points.length == 0 || !dblPoint ) {
                param.points.push({
                    coordsReal: {
                        x: Math.round( coordsReal.x ),
                        y: Math.round( coordsReal.y )
                    },
                    selected: false
                });
                setDistance();
                getCrossLines();
            }
        }
        if(param.points.length > 2 && param.points[param.points.length-1].crossLines == true) {
            //param.infoblock.hide('crossing');
        }
    }

    function orthoPushPoint(coords) {
            var coords1, coords2, dx, dy;

            for ( var i = 0; i < param.orthoLines.length; i++ ) {
                dx = param.orthoLines[i].dx;
                dy = param.orthoLines[i].dy;
                if ( Math.abs(dx) < param.orthoStickRadius && Math.abs(dy) < param.orthoStickRadius ) {
                    return {
                        x: param.orthoLines[i].coords.x,
                        y: param.orthoLines[i].coords.y
                    };
                } else if ( !coords1 && Math.abs(dx) < param.orthoStickRadius ) {
                    coords1 = {
                        x: param.orthoLines[i].coords.x,
                        y: param.orthoLines[i].coords.y + param.orthoLines[i].dy / param.currScale
                    };
                } else if ( !coords2 && Math.abs(dy) < param.orthoStickRadius ) {
                    coords2 = {
                        x: param.orthoLines[i].coords.x + param.orthoLines[i].dx / param.currScale,
                        y: param.orthoLines[i].coords.y
                    };
                }
            }
            if ( coords1 && coords2 ) return { x: coords1.x, y: coords2.y };
            else if ( coords1 && !coords2 ) return coords1;
            else if ( !coords1 && coords2 ) return coords2;
            return coords;
    }

    function setDistance() {
        var lastIdx = param.points.length - 1;
        var l = 0;
        var dx = 0;
        var dy = 0;
        var coords1, coords2;

        if (lastIdx > 0) {
            for (var i = 1; i <= lastIdx; i++) {
                dx = param.points[i - 1].coordsReal.x - param.points[i].coordsReal.x;
                dy = param.points[i - 1].coordsReal.y - param.points[i].coordsReal.y;
                l = Math.sqrt(dx*dx + dy*dy);
                param.points[i].distance = Math.round(l);

                coords1 = param.points[i].coordsReal;
                coords2 = param.points[i - 1].coordsReal;
                param.points[i].lineCenter = {
                    x: (coords2.x + coords1.x) / 2,
                    y: (coords2.y + coords1.y) / 2
                };
            }
            dx = param.points[lastIdx].coordsReal.x - param.points[0].coordsReal.x;
            dy = param.points[lastIdx].coordsReal.y - param.points[0].coordsReal.y;
            l = Math.sqrt(dx*dx + dy*dy);
            param.points[0].distance = Math.round(l);

            coords1 = param.points[0].coordsReal;
            coords2 = param.points[lastIdx].coordsReal;
            param.points[0].lineCenter = {
                x: (coords2.x + coords1.x) / 2,
                y: (coords2.y + coords1.y) / 2
            };
        }

        // calculation of the maximum width and height of the shape
        var minX = param.points[0].coordsReal.x;
        var minY = param.points[0].coordsReal.y;
        var maxX = minX;
        var maxY = minY;
        for (var i = 0; i < param.points.length; i++) {
            if (param.points[i].coordsReal.x > maxX) {
                maxX = param.points[i].coordsReal.x;
            }
            if (param.points[i].coordsReal.x < minX) {
                minX = param.points[i].coordsReal.x;
            }

            if (param.points[i].coordsReal.y > maxY) {
                maxY = param.points[i].coordsReal.y;
            }
            if (param.points[i].coordsReal.y < minY) {
                minY = param.points[i].coordsReal.y;
            }
        }

        param.polygon.maxW = maxX - minX;
        param.polygon.maxH = maxY - minY;

        param.polygon.coordsCenter.x = (maxX + minX) / 2;
        param.polygon.coordsCenter.y = (maxY + minY) / 2;
    }

    function getCrossLines(cursorCoords) {
        var lastIdx = param.points.length - 1,
        cross = [], a, b, c, d;
        if ( lastIdx < 2 ) return null;
        if ( cursorCoords ) {
            for ( var j = 0; j < lastIdx; j++ ) {
                a = cursorCoords.coordsReal;
                b = param.points[ lastIdx ].coordsReal;
                c = param.points[j].coordsReal;
                d = param.points[j + 1].coordsReal;
                param.crossNewLine = rotate(a, b, c) * rotate(a, b, d) < 0
                    && rotate(c, d, a) * rotate(c, d, b) < 0;
                param.crossNewLine = param.crossNewLine || pointOnTheLine(a, c, d);
                if ( param.crossNewLine ) break;
            }
        } else {
            if ( lastIdx < 2 ) return null;
            for ( var i = 0; i < lastIdx; i++ ) {
                for ( var j = 0; j < lastIdx; j++ ) {
                    if ( j == i - 1 || j == i || j == i + 1 ) continue;
                    a = param.points[i].coordsReal;
                    b = param.points[i + 1].coordsReal;
                    c = param.points[j].coordsReal;
                    d = param.points[j + 1].coordsReal;
                    cross.push( rotate(a, b, c) * rotate(a, b, d) < 0
                        && rotate(c, d, a) * rotate(c, d, b) < 0 );
                }
                if ( ~cross.indexOf(true) ) param.points[i + 1].crossLines = true;
                else param.points[i + 1].crossLines = false;
                cross.length = 0;
            }
            if ( param.closed ) {
                for ( var j = 1; j < lastIdx - 1; j++ ) {
                    a = param.points[ lastIdx ].coordsReal;
                    b = param.points[0].coordsReal;
                    c = param.points[j].coordsReal;
                    d = param.points[j + 1].coordsReal;
                    cross.push( rotate(a, b, c) * rotate(a, b, d) < 0
                        && rotate(c, d, a) * rotate(c, d, b) < 0 );
                }
                if ( ~cross.indexOf(true) ) param.points[0].crossLines = true;
                else param.points[0].crossLines = false;
                for ( var k = 0, n = false; k < cross.length; k++ ) {
                    if ( cross[k] == true ) param.points[k + 2].crossLines = true;
                }
            } else {
                param.points[0].crossLines = false;
            }
            // definition of the point belonging to one of the segments
            for ( var i = 0; i < lastIdx; i++ ) {
                cross.length = 0;
                for ( var j = 0; j < lastIdx; j++ ) {
                    if ( j == i - 1 || j == i || j == i + 1 ) continue;
                    a = param.points[i].coordsReal;
                    b = param.points[j].coordsReal;
                    c = param.points[j + 1].coordsReal;
                    cross.push( pointOnTheLine( a, b, c ) );
                    if ( cross[ cross.length - 1 ] ) {
                        param.points[j + 1].crossLines = true;
                    }
                }
                if ( ~cross.indexOf(true) ) {
                    param.points[i].crossLines = true;
                    param.points[i + 1].crossLines = true;
                }
            }
            if( param.crossLines == true ) {
                //param.infoblock.hide('crossing');
            }
        }
    }

    function pointOnTheLine(a, b, c) {
        var x1 = a.x - b.x;
        var y1 = a.y - b.y;
        var x2 = c.x - b.x;
        var y2 = c.y - b.y;
        var x3 = b.x - a.x;
        var y3 = b.y - a.y;
        var x4 = c.x - a.x;
        var y4 = c.y - a.y;

        var check = (x1 * y2 - y1 * x2) == 0 && (x3 * x4 + y3 * y4) <= 0;

        return check;
    }

    function changePoint(dx, dy) {
        param.points[param.point.selected].coordsReal.x += dx / param.currScale;
        param.points[param.point.selected].coordsReal.y += dy / param.currScale;

        setDistance();
        getCrossLines();
    }

    function checkMouseIsOverPoint(cursorCoords) {

        if (param.dragEvent) {
            // если двигаем холст, то указатель не может
            // оказаться над узлом, возвращаем false
            return false;
        }

        if (param.point.over && param.mouseDownFlag) {
            // это условие говорит о том, что узел перемещается
            // поэтому возвращаем текущее значение true
            return true;
        }

        // check where the pointer
        for (var i = 0; i < param.points.length; i++) {
            var coordsCanv = getCanvCoords(param.points[i].coordsReal);
            var mRadius = Math.sqrt(
                Math.pow(cursorCoords.coordsCanv.x - coordsCanv.x, 2)
                + Math.pow(cursorCoords.coordsCanv.y - coordsCanv.y, 2)
            );
            if (mRadius <= param.r2) {
                param.points[i].selected = true;
                param.point.selected = i;
                return true;
            } else {
                param.points[i].selected = false;
                param.point.selected = null;
            }
        }
        return false;
    }

    function mouseOverSideMove(e) {
        if (param.button.over
                || param.closed
                || param.complete
                || !param.window.focus
                || param.points.length == 0) {
            return param.sideMove.flag = false;
        }

        var x = e.clientX-param.offset.x;
        var y = e.clientY-param.offset.y;
        var w = param.width - 30;
        var h = param.height - 30;
        var l = param.sideMove.l;
        param.sideMove.dx = 0;
        param.sideMove.dy = 0;
        if ( x < 30 ) {
            param.sideMove.dx = l; // direction 4;
            if ( y < 30 ) {
                param.sideMove.dy = l; // direction 41;
            } else if ( y > h ) {
                param.sideMove.dy = -l; // direction 43;
            }
        } else if ( x > w ) {
            param.sideMove.dx = -l; // direction 2;
            if ( y < 30 ) {
                param.sideMove.dy = l; // direction 21;
            } else if ( y > h ) {
                param.sideMove.dy = -l; // direction 23;
            }
        } else if ( y < 30 ) {
            param.sideMove.dy = l; // direction 1;
        } else if ( y > param.height - 30 ) {
            param.sideMove.dy = -l; // direction 3;
        } else {
            return param.sideMove.flag = false;
        }
        return param.sideMove.flag = true;
    }

    function removePoint(i) {
        param.points.splice(i, 1);
        return param.points.length;
    }

    function checkDoublePoint(coordsReal, i) {
        return coordsReal.x == param.points[i].coordsReal.x
             && coordsReal.y == param.points[i].coordsReal.y;
    }

    function changeZoom(direction) {
        var ret = true;
        switch (direction) {
            case 0:
                if (param.currScaleIdx < param.realScale.length - 1) {
                    ret = false;
                }
                break;
            case 1:
                if (param.currScaleIdx > 0) {
                    ret = false;
                }
                break;
        }

        if (ret) return;

        autoCenter();

        // change of scale
        var k = 0;
        switch (direction) {
            case 0:
                if (param.currScaleIdx < param.realScale.length - 1) {
                    param.currScale = param.realScale[param.currScaleIdx + 1];
                    k = 1 - param.currScale / param.realScale[param.currScaleIdx];
                    param.currScaleIdx++;
                }
                break;
            case 1:
                if (param.currScaleIdx > 0) {
                    param.currScale = param.realScale[param.currScaleIdx - 1];
                    k = 1 - param.currScale / param.realScale[param.currScaleIdx];
                    param.currScaleIdx--;
                }
                break;
        }

        var dx = Math.round(k * (param.width/2 - param.translateCanv.x));
        var dy = Math.round(k * (param.height/2 - param.translateCanv.y));

        param.bgDist = param.bgCoords.l[param.currScaleIdx];

        drawBackground(dx, dy);
        param.translateCanv.x += dx;
        param.translateCanv.y += dy;
    }

    function autoZoom() {
        // zooming to enclose the image to the window
        var check = false;
        if (param.points.length > 1) {
            var ds = 0; // change of scale
            var maxCanvH = param.polygon.maxH * param.currScale;
            var maxCanvW = param.polygon.maxW * param.currScale;
            while (maxCanvW > param.width || maxCanvH > param.height) {
                check = true;
                if (param.currScaleIdx + ds >= param.realScale.length - 1) {
                    for (var i = 0; i < param.realScale.length; i++) {
                        param.realScale[i] /= param.rateOverscale;
                    }
                } else {
                    ds++;
                }
                maxCanvH = param.polygon.maxH * param.realScale[param.currScaleIdx + ds];
                maxCanvW = param.polygon.maxW * param.realScale[param.currScaleIdx + ds];
            }
            if (check) {
                param.currScaleIdx += ds;
                param.currScale = param.realScale[param.currScaleIdx];
                param.bgDist = param.bgCoords.l[param.currScaleIdx];
            }
        }
        return check;
    }

    function completeDraw() {
        if (!param.closed) {
            param.closed = true;
            setDistance();
            getCrossLines();
        }
        if (!param.crossLines && !param.complete && param.points.length > 2) {
            param.complete = true;

            if (typeof param.done == 'function') {
                param.done();
            }

            if (param.overlay.loaded) {
                param.overlay.show();
            } else {
                loadModule(param.overlay);
            }
        } else if (param.crossLines) {
            //param.infoblock.hide('crossing');
        }
    }

    function drawPlanWithCursor() {
        // update canvas
        var cursorCoords = {
            coordsCanv: {
                x: param.lastMouseCoords.x - param.translateCanv.x,
                y: param.lastMouseCoords.y - param.translateCanv.y
            }
        };
        cursorCoords.coordsReal = getRealCoords( cursorCoords.coordsCanv );

        drawPlan();

        drawNewPoint( cursorCoords );
    }

    function inputLength() {
        // keyboard input
        var coords = {
            x: param.lastMouseCoords.x,
            y: param.lastMouseCoords.y
        };

        if (!param.input.active) {
            param.input.active = true;
        }

        drawPlanWithCursor();
        drawBox(param.ctx, coords, param.input.value, false);
    }

    function inputDisabled() {
        // cancel input of segment length from the keyboard
        param.input.value = "";
        param.input.caret = 0;
        param.input.active = false;
    }

    function caretMoveLeft() {
        if (param.input.caret > 0) {
            param.input.caret--;
            inputLength();
        }
    }

    function caretMoveRight() {
        if (param.input.caret < param.input.value.length) {
            param.input.caret++;
            inputLength();
        }
    }

    param.checkClosing = function() {
        if (!param.complete) {
            //log('Drawing is not completed');
            return false;
        }
        return true;
    };

    param.getPoints = function() {
        if (!param.checkClosing) return;

        var pts = [];

        for (var i = 0; i < param.points.length; i++) {
            pts[i] = param.points[i].coordsReal;
        }

        return pts;
    };
    param.getNumberAngles = function() {
        if (!param.checkClosing) return;

        return param.points.length;
    }
    param.getPerimeter = function() {
        if (!param.checkClosing) return;

        var pts = param.points;
        var c = pts.length;
        var p = 0;

        for (var i = 1; i < c; i++) {
            p += pts[i].distance;
        }

        p += pts[0].distance;//last side

        return p;//in centimeters
    };
    param.getSquare = function() {
        if (!param.checkClosing) return;

        var x0 = param.points[0].coordsReal.x;
        var y0 = param.points[0].coordsReal.y;
        var x1, y1, x2, y2;
        for ( var i = 1, s = 0; i < param.points.length - 1; i++ ) {
            x1 = param.points[i].coordsReal.x;
            y1 = param.points[i].coordsReal.y;
            x2 = param.points[i+1].coordsReal.x;
            y2 = param.points[i+1].coordsReal.y;
            s += ((x1-x0)*(y2-y0)-(y1-y0)*(x2-x0)) / 2;
        }

        return Math.abs(s);//in cubic centimeters
    };

    ///////////////////////
    // Drawing functions //
    function drawPlan() {

        var buf = param.buffer;
        var ctx = buf.main.ctx;

        var tr = param.translateCanv;
        var w = param.width;
        var h = param.height;

        ctx.save();

        ctx.translate(tr.x, tr.y);

        ctx.drawImage(buf.bg.canv, -tr.x, -tr.y);

        drawFigure();

        drawInterface();

        ctx.drawImage(buf.interface.canv, -tr.x, -tr.y);

        if (param.plugin.sketch) {
            param.sketch.visibility = outsideSketch();

            if (param.sketch.visibility) {
                if (param.sketch.loaded) {
                    param.sketch.draw();
                } else {
                    loadModule(param.sketch);
                }
            }
        }

        ctx.restore();

        param.ctx.drawImage(buf.main.canv, 0, 0);

        if (param.complete && param.overlay.loaded) {
            param.overlay.draw();
        }

        clearBuffer();
    }

    function clearBuffer() {

        var buf = param.buffer;
        var w = param.width;
        var h = param.height;

        buf.interface.ctx.clearRect(0, 0, w, h);

    }

    function drawBackground(dx, dy) {
        // dx, dy - offset of background image
        var buf = param.buffer;
        var ctx = buf.bg.ctx;

        var i = param.currScaleIdx;
        var x0 = param.bgCoords.x[i];
        var y0 = param.bgCoords.y[i];
        var l = param.bgCoords.l[i];
        var d = param.bgDist;

        param.lastBgStartCoords.x = ( param.lastBgStartCoords.x + dx ) % d;
        param.lastBgStartCoords.y = ( param.lastBgStartCoords.y + dy ) % d;

        for ( var y = -d + param.lastBgStartCoords.y; y < param.height + d; y += d ) {
            for ( var x = -d + param.lastBgStartCoords.x; x < param.width + d; x += d ) {
                // -1 for displacement of the drawing to the central point
                ctx.drawImage(buf.image.bg, x0, y0, l, l, x - 1, y - 1, l, l);
            }
        }
    }

    function drawMousePoints() {
        for (var key1 in param.buffer.point) {
            if (key1 == 'active') {
                var r = param.r2;
            } else {
                var r = param.r1;
            }

            for (var key2 in param.buffer.point[key1]) {
                param.buffer.point[key1][key2].canv.width = 2 * r;
                param.buffer.point[key1][key2].canv.height = 2 * r;
                param.buffer.point[key1][key2].ctx.strokeStyle = param.pointsBorderColor;
                param.buffer.point[key1][key2].ctx.lineWidth = param.pointsBorderWidth;

                if (key2 == 'main') {
                    param.buffer.point[key1][key2].ctx.fillStyle = param.pointsFirstFillColor;
                } else {
                    param.buffer.point[key1][key2].ctx.fillStyle = param.pointsFillColor;
                }

                param.buffer.point[key1][key2].ctx.arc(r, r, r - 1, 0, 2 * Math.PI, true);
                param.buffer.point[key1][key2].ctx.fill();
                param.buffer.point[key1][key2].ctx.stroke();
            }
        }
    }

    function drawPoints() {
        if ( param.points.length > 0 ) {
            var buf = param.buffer;
            var ctx = buf.main.ctx;

            var coordsCanv = getCanvCoords(param.points[0].coordsReal);

            // first point to another color
            //ctx.fillText('canv: ' + coordsCanv.x+':'+coordsCanv.y, coordsCanv.x, coordsCanv.y - 10);
            //ctx.fillText('real: ' + param.points[0].coordsReal.x+':'+param.points[0].coordsReal.y, coordsCanv.x, coordsCanv.y - 20);
            ctx.drawImage(buf.point.noactive.main.canv, coordsCanv.x - param.r1, coordsCanv.y - param.r1);

            // other points
            for ( var i = 1; i < param.points.length; i++ ) {

                coordsCanv = getCanvCoords(param.points[i].coordsReal);
                //ctx.fillText('canv:' + coordsCanv.x+':'+coordsCanv.y, coordsCanv.x, coordsCanv.y - 10);
                //ctx.fillText('real:' + param.points[i].coordsReal.x+':'+param.points[i].coordsReal.y, coordsCanv.x, coordsCanv.y - 20);
                ctx.drawImage(buf.point.noactive.second.canv, coordsCanv.x - param.r1, coordsCanv.y - param.r1);

            }
        }
    }

    function drawOrthoPoint(coords) {
        var ctx = param.ctx;

        for (var i = 0; i < param.orthoPoints.length; i++) {
            for (var j = 1; j < param.orthoPoints.length; j++) {
                if ( j == i ) continue;
                if ( param.orthoPoints[i].x == param.orthoPoints[j].x
                    && param.orthoPoints[i].y == param.orthoPoints[j].y ) {
                    //delete duplicate ortholines?
                    //удаление повторяющихся ортолиний?
                }
            }
        }

        for (var i = 0; i < param.orthoPoints.length; i++) {
            ctx.beginPath();
            ctx.arc(param.orthoPoints[i].x, param.orthoPoints[i].y, param.r1 - 1, 0, Math.PI * 2, true);
        }

        ctx.fill();
        ctx.stroke();

        param.orthoPoints.length = 0;
    }

    function drawOrthoLines(cursor) {

        var ctx = param.ctx;
        var k = 0.5;

        param.orthoLines.length = 0; // clearing

        for (var i = 0, deltaX, deltaY; i < param.points.length; i++) {

            if (i == param.point.selected) continue;

            deltaX = (cursor.coordsReal.x - param.points[i].coordsReal.x) * param.currScale;
            deltaY = (cursor.coordsReal.y - param.points[i].coordsReal.y) * param.currScale;

            if (Math.abs(deltaX) < param.orthoLinesGap || Math.abs(deltaY) < param.orthoLinesGap) {

                param.orthoLines.push({
                    coords: param.points[i].coordsReal,
                    dx: deltaX,
                    dy: deltaY
                });
            }
        }

        if (param.orthoLines.length == 0) return;

        var ledge = param.orthoLinesLedge;
        var gap = param.orthoLinesGap;
        var coords, dx, dy, ledgeX, ledgeY;

        ctx.save();

        ctx.fillStyle = param.orthoPointColor;
        ctx.strokeStyle = param.orthoLinesColor;
        ctx.lineWidth = param.orthoLinesWidth;

        for (var i = 0; i < param.orthoLines.length; i++) {

            coords = getCanvCoords(param.orthoLines[i].coords);
            dx = param.orthoLines[i].dx;
            dy = param.orthoLines[i].dy;
            ledgeX = dx > 0 ? ledge : -ledge;
            ledgeY = dy > 0 ? ledge : -ledge;

            if (Math.abs(dx) < gap) {

                ctx.beginPath();
                ctx.dottedLineTo(coords.x + k, coords.y, coords.x + k, coords.y + dy + ledgeY, 20, 10);
                ctx.stroke();
                ctx.closePath();

                param.orthoPoints.push({
                    x: coords.x,
                    y: coords.y + dy
                });
            }

            if (Math.abs(dy) < gap) {

                ctx.beginPath();
                ctx.dottedLineTo(coords.x, coords.y + k, coords.x + dx + ledgeX, coords.y + k, 20, 10);
                ctx.stroke();
                ctx.closePath();

                param.orthoPoints.push({
                    x: coords.x + dx,
                    y: coords.y
                });
            }

            drawOrthoPoint();
        }

        ctx.restore();
    }

    function drawLineLength(ctx, i) {
        drawBox(ctx, getCanvCoords(param.points[i].lineCenter), param.points[i].distance, true, 'center')
    }

    function drawNewLineLength(coords1, coords2) {
        var dx = coords1.x - coords2.x;
        var dy = coords1.y - coords2.y;
        var dist = Math.round(Math.sqrt(dx * dx + dy * dy) / param.currScale);

        if (param.input.active) {
            dist = param.input.value;
        }

        drawBox(param.ctx, coords2, dist, true);
    }

    function drawBox(ctx, coords, text, shadow, pos) {
        var input = param.input.active;
        var coordsIn = {
            x: Math.round(coords.x) + 0.5,
            y: Math.round(coords.y) + 0.5
        };
        text += param.input.unit;

        ctx.save();
            ctx.font = param.fontStyle;
            var textW = ctx.measureText(text).width;
        ctx.restore();

        var r = param.borderBoxRadius;

        var w = textW + 10;
        var h = param.lineLengthBoxHeight + 2 * r;

        var dx = -(w + 10);
        var dy = -(h + 5);
        if (pos && pos == 'center') {
            input = false;
            dx = -Math.round(w / 2);
            dy = -Math.round(h / 2);
        }

        var x = coordsIn.x + dx;
        var y = coordsIn.y + dy;

        if (!pos || pos != 'center') {
            if (x < 5 - param.translateCanv.x) x = 5 - param.translateCanv.x;
            if (y < 5 - param.translateCanv.y) y = 5 - param.translateCanv.y;
        }

        ctx.save();

        ctx.lineWidth = 1;
        ctx.strokeStyle = param.borderBoxColor;
        ctx.fillStyle = param.backgroundBoxColor;

        ctx.roundedRect(x, y, w, h, r);

        ctx.save();

        if (shadow) {
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.shadowBlur = 2;
            ctx.shadowColor = param.shadowColor;
        }

        ctx.fill();

        ctx.restore();

        ctx.stroke();

        ctx.restore();

        drawTextInBox();

        if (input) {
            drawUnderLine();
        }

        function drawTextInBox() {
            var fontH = 12; //font size
            var x1 = x + w / 2;
            var y1 = y + (fontH + 2);
            ctx.save();
            ctx.font = param.fontStyle;
            ctx.fillStyle = param.textColor;
            ctx.textAlign = 'center';
            ctx.fillText(text, x1, y1);
            ctx.restore();
        }

        function drawUnderLine() {
            var pos = param.input.caret;
            var fontH = 12; //font size
            var m = 5; //margin
            var lw = textW / text.toString().length; //letter width
            var x1 = x + m + pos * lw;
            var y1 = y + 1.5 * fontH + 1;
            ctx.save();
            ctx.font = param.fontStyle;
            ctx.fillStyle = param.textColor;
            ctx.fillText('-', x1, y1);
            ctx.restore();
        }
    }

    function drawNewPoint(cursor) {
        if (param.button.over || param.complete) {
            return false;
        }

        var buf = param.buffer;
        var ctx = param.ctx;

        ctx.save();

        ctx.translate(param.translateCanv.x, param.translateCanv.y);

        if (param.point.over) {

            var coordsCanv = getCanvCoords(param.points[param.point.selected].coordsReal);

            if (param.point.selected == 0) {

                ctx.drawImage(buf.point.active.main.canv, coordsCanv.x - param.r2, coordsCanv.y - param.r2);

            } else {

                ctx.drawImage(buf.point.active.second.canv, coordsCanv.x - param.r2, coordsCanv.y - param.r2);

            }
            if (param.point.moving) {

                drawOrthoLines(param.points[param.point.selected]);

            }

        } else {

            if (param.points.length > 0) {

                if (!param.closed) {
                    drawLineToNewPoint(cursor);
                }

                var coordsCanv = getCanvCoords(param.points[param.points.length - 1].coordsReal);
                var p = param.points.length == 1 ? 'main' : 'second';

                ctx.drawImage(buf.point.noactive[p].canv, coordsCanv.x - param.r1, coordsCanv.y - param.r1);

            }

            var x = cursor.coordsCanv.x - param.r1;
            var y = cursor.coordsCanv.y - param.r1;
            ctx.drawImage(buf.point.noactive.second.canv, x, y);

        }

        ctx.restore();
    }

    function drawLineToNewPoint(cursor) {

        var ctx = param.ctx;
        var startPoint = getCanvCoords(param.points[0].coordsReal);
        var coordsCanv1 = getCanvCoords(param.points[param.points.length - 1].coordsReal);
        var coordsCanv2 = cursor.coordsCanv;

        ctx.save();
        ctx.strokeStyle = param.linesNewPointColor;

        getCrossLines(cursor);

        if (param.crossNewLine) {

            ctx.strokeStyle = param.linesNewPointCrossColor;

        }

        ctx.lineJoin = 'round';
        ctx.lineWidth = param.linesWidth;

        ctx.beginPath();

        ctx.moveTo(coordsCanv1.x, coordsCanv1.y);
        ctx.lineTo(coordsCanv2.x, coordsCanv2.y);

        ctx.closePath();

        ctx.stroke();

        ctx.restore();

        // замыкание с первой точкой
        // closing with the first point
        // ...

        param.crossNewLine = false; // clearing

        drawNewLineLength(coordsCanv1, coordsCanv2);

        drawOrthoLines(cursor);
    }

    function drawFigure() {

        var ctx = param.buffer.main.ctx;
        var coordsStartPoint = {}, coordsNextPoint = {};

        // before checking believe that there are no intersections
        param.crossLines = false;

        if (param.points.length > 0) {

            coordsStartPoint = getCanvCoords(param.points[0].coordsReal);

            ctx.beginPath();

            ctx.moveTo(coordsStartPoint.x, coordsStartPoint.y);

            for (i = 1; i < param.points.length; i++) {

                coordsNextPoint = getCanvCoords(param.points[i].coordsReal);

                ctx.strokeStyle = param.linesColor;
                ctx.lineWidth = param.linesWidth;

                // check intersections
                if (param.points[i].crossLines) {
                    // color of crossing lines
                    ctx.strokeStyle = param.linesCrossColor;
                    param.crossLines = true;
                }

                ctx.lineTo(coordsNextPoint.x, coordsNextPoint.y);
                ctx.stroke(); // stroke each segment

                // caption of length of segment
                drawLineLength(ctx, i);

                ctx.beginPath();

                ctx.moveTo(coordsNextPoint.x, coordsNextPoint.y);
            }

            // closing of shape
            if (param.closed) {

                ctx.strokeStyle = param.linesColor;
                ctx.lineWidth = param.linesWidth;
                ctx.lineTo(coordsStartPoint.x, coordsStartPoint.y);

                // color of crossing lines
                if (param.points[0].crossLines) {
                    ctx.strokeStyle = param.linesCrossColor;
                }

                ctx.stroke();

                // caption of length of last segment
                if ( param.points.length > 2 ) {
                    drawLineLength(ctx, 0);
                }
            }

            ctx.closePath();
        }

        drawPoints();
    }

    ///////////////
    // Interface //
    function drawInterface() {

        param.button.over = false;

        var ctx = param.buffer.interface.ctx;
        var btn = param.button;

        var coords = {
            x: param.lastMouseCoords.x,
            y: param.lastMouseCoords.y
        };

        var btnList = 'drawing complete del clear'.split(' ');

        for (var i = 0; i < btnList.length; i++) {
            if (!btn[btnList[i]]) {
                switch (btnList[i]) {
                    case 'drawing':
                        btn[btnList[i]] = new Button({
                            text: [
                                'Завершить рисование',
                                'Продолжить рисование'
                            ],
                            pos: {
                                y: param.height
                            },
                            style :{
                                valign: 'bottom'
                            },
                            ctx: ctx
                        });
                        break;

                    case 'complete':
                        btn[btnList[i]] = new Button({
                            text: ['Замкнуть контур'],
                            pos: {
                                y: param.height
                            },
                            style :{
                                valign: 'bottom'
                            },
                            ctx: ctx
                        });
                        break;

                    case 'del':
                        btn[btnList[i]] = new Button({
                            text: ['Удалить'],
                            pos: {
                                y: param.height
                            },
                            style: {
                                valign: 'bottom'
                            },
                            ctx: ctx
                        });
                        break;

                    case 'clear':
                        btn[btnList[i]] = new Button({
                            text: ['Очистить'],
                            pos: {
                                x: param.width,
                                y: param.height
                            },
                            style: {
                                bg: btn.style.clear.bg,
                                valign: 'bottom',
                                align: 'right'
                            },
                            ctx: ctx
                        });
                        break;
                }
            } else {
                for (var i = 0; i < btnList.length; i++) {
                    btn[btnList[i]].over = false;
                }
            }
        }

        ctx.save();

        ctx.font = param.fontStyle;

        if (param.dragEvent) {
            ctx.globalAlpha = 0.5;
        }

        drawLineScale();

        if (!param.complete) {
            if (param.points.length > 0) {
                btn.del.show().draw(coords);

                if (param.points.length > 2) {
                    if (param.closed) {
                        btn.drawing.show().draw(coords, btn.del.l);
                    } else {
                        btn.complete.show().draw(coords, btn.del.l);
                    }
                }

                btn.clear.show().draw(coords);
            } else {
                for (var i = 0; i < btnList.length; i++) {
//                    btn[btnList[i]].hide();
                    btn[btnList[i]].hidden = true;
                }
            }
        }

        ctx.restore();

        function drawLineScale() {
            // Линейка масштабирования

            var m = btn.m;
            var r = param.borderBoxRadius;
            var h = btn.h;
            var w = btn.w;

            var text;

            var list = 'zoomIn zoomOut fullPlan'.split(' ');

            for (var i = 0; i < list.length; i++) {
                if (!btn.lineScale[list[i]]) {
                    btn.lineScale[list[i]] = {
                        over: false
                    };
                } else {
                    btn.lineScale[list[i]].over = false;
                }
            }

            ctx.save();

            ctx.fillStyle = btn.style.main.bg.off;

            var x = m;
            var y = m;

            drawBtnZoom('zoomOut', x, y, 20);

            x += w + 14;
            if (param.points.length > 0) {
                drawBtnZoom('fullPlan', x, y, 40);
            }

            x += w + 14;
            drawBtnZoom('zoomIn', x, y, 0);

            drawScaleStep();

            ctx.restore();

            function drawBtnZoom(btnType, x, y, marginX) {

                ctx.roundedRect(x, y, w, h, r);

                var over = ctx.isPointInPath(coords.x, coords.y);

                ctx.save();

                if (over && !param.dragEvent) {
                    ctx.fillStyle = param.button.style.main.bg.on;
                }

                ctx.fill();

                var l = 20;//img size
                var p = (param.button.h - l) / 2;//padding

                ctx.drawImage(param.buffer.image.scale, marginX, 0, l, l, x + p, y + p, l, l);

                ctx.restore();

                btn.lineScale[btnType].over = over;

                ////////////
                param.button.over = over || param.button.over;
            }

            function drawScaleStep() {
                // линейка

                for (var i = 0, j, ws = 16, hs = 10, dws = 5; i < param.realScale.length; i++) {
                    j = param.realScale.length - i - 1;
                    if (param.realScale[j] <= param.currScale) {
                        ctx.fillStyle = param.button.style.main.bg.on;
                    } else {
                        ctx.fillStyle = param.button.style.main.bg.off;
                    }
                    ctx.roundedRect(m + i * ws + i * dws, m + h + 4, ws, hs, r);
                    ctx.fill();
                }

                ctx.strokeStyle = param.button.style.main.bg.off;
                ctx.fillStyle = param.button.style.main.bg.off;

                ctx.beginPath();
                ctx.moveTo(m + 0.5, (m + h + 4) + (hs + 4) + 8 + 0.5);
                ctx.lineTo(m + 0.5, (m + h + 4) + (hs + 4) + 18 + 0.5);
                ctx.lineTo(m + 99 + 0.5, (m + h + 4) + (hs + 4) + 18 + 0.5);
                ctx.lineTo(m + 99 + 0.5, (m + h + 4) + (hs + 4) + 8 + 0.5);

                ctx.stroke();

                ctx.fontStyle = "normal 12px monospace";
                ctx.textAlign = "center";

                text = (100/param.currScale) + param.input.unit;

                ctx.fillText(text, m + 100 / 2, (m + h + 4) + (hs + 4) + 12);

            }
        }
    }

    ///////////////////////////////////
    // Animation functions           //
    // Move along the side of canvas //
    function sideMove(coords) {
        var t = 20; // interval of movement canvas
        var cursorCoords = {
            coordsCanv: {
                x: coords.x,
                y: coords.y
            },
            coordsReal: getRealCoords(coords)
        };
        var move = function() {
            drawBackground(param.sideMove.dx, param.sideMove.dy);
            param.translateCanv.x += param.sideMove.dx;
            param.translateCanv.y += param.sideMove.dy;

            cursorCoords.coordsCanv.x -= param.sideMove.dx;
            cursorCoords.coordsCanv.y -= param.sideMove.dy;
            cursorCoords.coordsReal = getRealCoords(cursorCoords.coordsCanv);
            drawPlan();

            drawNewPoint(cursorCoords);
            if (param.sideMove.flag && param.mouseEnterFlag) {
                param.sideMove.id = setTimeout(move, t);
            }
        };
        if (!param.sideMove.flag && param.sideMove.id != null) {
            clearTimeout(param.sideMove.id);
            param.sideMove.id = null;
        }
        clearTimeout(param.sideMove.id);
        move();
    }

    function outsideSize() {
        var minScale = param.realScale[param.realScale.length - 1];
        var maxCanvH = param.polygon.maxH * minScale;
        var maxCanvW = param.polygon.maxW * minScale;

        return maxCanvW > param.width || maxCanvH > param.height;
    }

    function outsideSketch() {
        var scale = param.realScale[param.currScaleIdx];
        var maxCanvH = param.polygon.maxH * scale;
        var maxCanvW = param.polygon.maxW * scale;

        return maxCanvW > param.width || maxCanvH > param.height;
    }

    function pointOutsideViewport() {
        var check = false;
        var last = param.points.length - 1;
        var ptCoord = getCanvCoords(param.points[last].coordsReal);
        var tr = param.translateCanv;

        if (ptCoord.x < -tr.x || ptCoord.x > param.width - tr.x ||
            ptCoord.y < -tr.y || ptCoord.y > param.height - tr.y) {
            check = true;
        }

        return check;
    }

    function autoCenter() {
        // displacement to the center of the picture
        var dx, dy;

        if (outsideSize()) {
            if (param.closed) {
                dx = Math.round( param.points[0].coordsReal.x * param.currScale );
                dy = Math.round( param.points[0].coordsReal.y * param.currScale );
            } else {
                dx = Math.round( param.points[param.points.length - 1].coordsReal.x * param.currScale );
                dy = Math.round( param.points[param.points.length - 1].coordsReal.y * param.currScale );
            }
        } else {
            // coordinates of displacement center of the canvas
            // to the center of shape's coordinate
            dx = Math.round( param.polygon.coordsCenter.x * param.currScale );
            dy = Math.round( param.polygon.coordsCenter.y * param.currScale );
        }

        moveCenter(dx, dy);
    }

    function moveCenter(dx, dy) {
        dx += param.translateCanv.x - param.width/2;
        dy += param.translateCanv.y - param.height/2;

        dx = Math.round(dx);
        dy = Math.round(dy);

        drawBackground(dx, dy);

        param.translateCanv.x -= dx;
        param.translateCanv.y -= dy;
    }

    function moveCenterToNewPoint() {
        var dx, dy;

        if (param.closed) {
            dx = Math.round( param.points[0].coordsReal.x * param.currScale );
            dy = Math.round( param.points[0].coordsReal.y * param.currScale );
        } else {
            dx = Math.round( param.points[param.points.length - 1].coordsReal.x * param.currScale );
            dy = Math.round( param.points[param.points.length - 1].coordsReal.y * param.currScale );
        }

        moveCenter(dx, dy);
    }

    function undo() {

        if (param.complete) {
            return;
        }

        //log('UNDO');

        if (param.closed) {
            param.closed = false;
        } else {
            removePoint(param.points.length - 1);
            // update data of points
            if (param.points.length > 0) {
                setDistance();
                getCrossLines();
            }
        }

        param.history.id--;

        if (param.history.id < 0) {
            param.history.id = 0;
            return;
        }
    }

    function redo() {
        //log('REDO');
    }

}

function clearPlan() {
    param.points.length = 0;
    param.complete = false;
    param.closed = false;
}

function setCursor() {
    if (!param.mouseEnterFlag) {
        cursorNone();
    } else if (param.button.over || param.complete) {
        if (param.dragEvent) {
            cursorCanvMove();
        } else {
            if (param.overlay
                && param.overlay.button
                && param.overlay.button.over) {
                    cursorPointer();
            } else {
                cursorDefaults();
            }
        }
    } else {
        if (param.mouseDownFlag) {
            if (param.point.over) {
                cursorMove();
            } else {
                cursorCanvMove();
            }
        } else {
            if (param.point.over) {
                cursorPointer();
            } else {
                cursorPencil();
            }
        }
    }

    function cursorPointer() {
        if (!param.cursor.pointer) {
            for (var i in param.cursor) {
                param.cursor[i] = false;
            }
            param.cursor.pointer = true;
            d.body.style.cursor = 'url(' + param.path.home + param.path.img +
                    'pointer.png) 5 0, pointer';
        }
    }
    function cursorMove() {
        if (!param.cursor.move) {
            for (var i in param.cursor) {
                param.cursor[i] = false;
            }
            param.cursor.move = true;
            d.body.style.cursor = 'url(' + param.path.home + param.path.img +
                    'move.png), crosshair';
        }
    }
    function cursorNone() {
        for (var i in param.cursor) {
            if (param.cursor[i]) {
                param.cursor[i] = false;
                d.body.style.cursor = 'auto';
            }
        }
    }
    function cursorDefaults() {
        if (!param.cursor.defaults) {
            for (var i in param.cursor) {
                param.cursor[i] = false;
            }
            param.cursor.defaults = true;
            d.body.style.cursor = 'default';
        }
    }
    function cursorPencil() {
        if (!param.cursor.pencil) {
            for (var i in param.cursor) {
                param.cursor[i] = false;
            }
            param.cursor.pencil = true;
            d.body.style.cursor = 'url(' + param.path.home + param.path.img +
                    'pencil.png) 0 21, default';
        }
    }
    function cursorCanvMove() {
        if (!param.cursor.canvMove) {
            for (var i in param.cursor) {
                param.cursor[i] = false;
            }
            param.cursor.canvMove = true;
            d.body.style.cursor = 'move';
        }
    }

}

function createCanvas(a, w, h) {
    if (a.canv === undefined) {
        a.canv = document.createElement('canvas');
        a.ctx = a.canv.getContext('2d');
    }
    if (w !== undefined) {
        a.canv.width = w;
    }
    if (h !== undefined) {
        a.canv.height = h;
    }
    return a;
}

function loadModule(module) {
    var script = d.getElementById(module.id);

    script = d.createElement('script');
    script.id = module.id;

    script.onload = function() {
        module.loaded = true;
        module.run();
    };

    var timestamp = (new Date()).getTime().toString();
    script.src = module.src + '?' + timestamp;

    d.head.appendChild(script);
}

function reloadModule(module) {
    //log('Reload module ' + module.id);

    var script = d.getElementById(module.id);

    if (script !== null) {
        d.head.removeChild(script);
        loadModule(module);
    } else {
        loadModule(module);
    }
}

function savePicture() {
    var imageWin = window.open(canv.toDataURL(), 'Save picture');
}

function paintDestroy() {
    //window.removeEventListener('resize', resizeCanvas, false);
    window.removeEventListener('focus', winFocus, false);
    window.removeEventListener('blur', winBlur, false);
    d.removeEventListener('keydown', keyDownEventHandler, false);
    d.removeEventListener('keypress', handlerNum, false);

    if (typeof param.destroy == 'function') {
        param.destroy();
    }
}
