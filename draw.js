"use strict";

var WIDTH;
var HEIGHT;
var STROKE_SIZE = 2;

var pageFiles = ["mus1.jpg", "mus2.jpg",
                 "mus3.jpg", "mus4.jpg",
                 "mus5.jpg", "mus6.jpg"];

// layers
var personal;
var perctx;
var group;
var grpctx;
var bg;
var bgctx;

var erase = false;
var paint = false;
var edit = false;

function getContext() {
    return (mode ? perctx : grpctx);
}   

function clear(ctx) {
    ctx.clearRect(0, 0, WIDTH-11, HEIGHT-11);
}

function toggleEditMode() {
    edit = !edit;
    Control.updateControl();
    redrawAll();
    mode = true; 
    erase = false;
}

function drawPoint(e, dragging) {
    var mouseX = e.pageX; 
    var mouseY = e.pageY;

    pages[pg].addClick(mouseX, mouseY, dragging);
}

function redraw() {
    var ctx = getContext();
    clear(ctx);   
 
    var page = pages[pg];

    var X = page.getX();
    var Y = page.getY();
    var Drag = page.getDrag();
    var Erase = page.getErase();

    for (var i = 0; i < X.length; i++) 
    {
        if (Erase[i]) {
            ctx.clearRect(X[i], Y[i], 4*STROKE_SIZE, 4*STROKE_SIZE);
        } else {
            ctx.beginPath();
            if (Drag[i] && i) {
                ctx.moveTo(X[i-1], Y[i-1]);
            } else {
                ctx.moveTo(X[i] - 1, Y[i]);
            }
            ctx.lineTo(X[i], Y[i]);
            ctx.stroke();
            ctx.closePath();
        }
    }
}

function redrawBlack() {
    var page = pages[pg];
    var t = mode;
    for (var m = 0; m < 2; m++) {
        mode = m;
        var ctx = getContext();
        var ss = ctx.strokeStyle;
        ctx.strokeStyle = '#555';
        
        clear(ctx);

        var X = page.getX();
        var Y = page.getY();
        var Drag = page.getDrag();
        var Erase = page.getErase();

        for (var i = 0; i < X.length; i++) {
            if (Erase[i]) {
                ctx.clearRect(X[i], Y[i], 4*STROKE_SIZE, 4*STROKE_SIZE); 
            } else {
                ctx.beginPath();
                if (Drag[i] && i) {
                    ctx.moveTo(X[i-1], Y[i-1]);
                } else {
                    ctx.moveTo(X[i] - 1, Y[i]);
                }
                ctx.lineTo(X[i], Y[i]);
                ctx.stroke();
                ctx.closePath();
            }
        }   
        ctx.strokeStyle = ss;
    }
    mode = t;
}

function redrawAll() {
    if (edit) {
        var t = mode;
        for (var m = 0; m < 2; m++) {
            mode = m;
            redraw();
        }
        mode = t;
    } else {
        redrawBlack();
    }
}

// --- Page Object 
function Page() {
    this.leftImg = new Image();
    this.rightImg = new Image();

    // Personal Annotations
    this.perX = new Array();
    this.perY = new Array();
    this.perDrag = new Array();
    this.perErase = new Array();

    // Group Annotations
    this.grpX = new Array();
    this.grpY = new Array();
    this.grpDrag = new Array();
    this.grpErase = new Array();

    this.getX = function() {
        return (mode ? this.perX : this.grpX);
    };

    this.getY = function() {
        return (mode ? this.perY : this.grpY);
    };

    this.getDrag = function() {
        return (mode ? this.perDrag : this.grpDrag);    
    };

    this.getErase = function() {
        return (mode ? this.perErase : this.grpErase);
    };

    this.drawPage = function () {
        this.drawPageDriver(this.leftImg, this.rightImg);
        redrawAll();
    };

    this.drawPageDriver = function(left, right) {
        var drawLeft = function() {
            bgctx.drawImage(left, 0, 0);
        };

        var drawRight = function() {
            bgctx.drawImage(right, 700, 0);
        }

        if (left.complete) {
            drawLeft();
        } else {
            left.onload = drawLeft; 
        }

        if (right.complete) {
            drawRight();
        } else {
            right.onload = drawRight; 
        }
    };

    this.addClick = function(x, y, drag) {
        this.getX().push(x);
        this.getY().push(y);
        this.getDrag().push(drag);
        this.getErase().push(erase);
        redraw();
    };
}
// ---

var pg = 0; // index
var npg = 3;
var pages = [new Page(), new Page(), new Page()];

function flipForward() {
    if (pg < (npg - 1)) {
        pg++;
        pages[pg].drawPage();
    }
}

function flipBackward() {
    if (pg > 0) {
        pg--;
        pages[pg].drawPage();
    }
}

// ---

(function() {
    var Startup = window.Startup = {
        preload: function() {
            // Set the images for each page
            for (var i = 0; i < pages.length; i++) {
                pages[i].leftImg.src = pageFiles[i*2];
                pages[i].rightImg.src = pageFiles[i*2 + 1]; 
            }
        },

        init: function() {
            var setCanvas = function(can, ctx, style) {
                can.height = HEIGHT - 11;
                can.width = WIDTH - 11;
                
                ctx.strokeStyle = style;
                ctx.lineJoin = 'round';
                ctx.lineWidth = STROKE_SIZE; 

            }
            
            var setBgCanvas = function() {
                bg.height = HEIGHT;
                bg.width = WIDTH;
            }

            WIDTH = document.body.scrollWidth;
            HEIGHT = document.body.scrollHeight;

            personal = $('#personal')[0];
            group = $('#group')[0];
            bg = $('#bg')[0] 
           
            perctx = personal.getContext('2d'); 
            setCanvas(personal, perctx, '#0000ff');
            grpctx = group.getContext('2d');
            setCanvas(group, grpctx, '#ff0000');
            bgctx = bg.getContext('2d');
            setBgCanvas();

            pages[0].drawPage();

            // Position the page flipping buttons
            $('#prevPage').css('left', 0);
            $('#prevPage').css('top', HEIGHT - 11 - 100);
            $('#nextPage').css('left', WIDTH - 11 - 100);
            $('#nextPage').css('top', HEIGHT - 11 - 100);
        
            Startup.initHandlers();
        },

        initHandlers: function() {
            $('#prevPage').click(function() {
                flipBackward(); 
            }); 
            
            $('#nextPage').click(function() {
                flipForward();
            });
           
            // Handlers for the 'personal' layer
            $('#personal').mousedown(function(e) {
                if (edit) { 
                    paint = true;
                    drawPoint(e, false);
                }
            });
            
            $('#personal').mousemove(function(e) {
                if (paint) {
                    drawPoint(e, true);
                }
            });

            $('#personal').mouseup(function(e) {
                paint = false;
            });

            $('#personal').mouseleave(function(e) {
                paint = false;
            });

            // Handlers for the 'group' layer
            $('#group').mousedown(function(e) {
                if (edit) { 
                    paint = true;
                    drawPoint(e, false);
                }
            });

            $('#group').mousemove(function(e) {
                if (paint) {
                    drawPoint(e, true);
                }
            });

            $('#group').mouseup(function(e) {
                dat = { 'pg': pg,
                        'x': pages[pg].grpX,
                        'y': pages[pg].grpY,
                        'drag': pages[pg].grpDrag,
                        'erase': pages[pg].grpErase };
                $.ajax({
                    url: 'cgi-bin/put.py',
                    type: 'POST', 
                    data: { 'dat': $.toJSON(dat) }
                });
                paint = false;
            });

            $('#group').mouseleave(function(e) {
                paint = false;
            }); 
            
            // Ghetto WOZ handlers 
            $(document).keypress(function(e) {
                if (e.keyCode == 13) {
                    toggleEditMode();
                } else if (e.keyCode == 101 || e.which == 101) {
                    erase = !erase;
                }
            });
        }
    };
})();


// Load the images ASAP
Startup.preload();

$(document).ready(function () {
    Startup.init();

    setInterval(function() {
        $.ajax({
            url: 'cgi-bin/take.py',
            type: 'GET',
            data: { 'pg' : pg },
            dataType: 'json',
            success: function(data) {
                pages[pg].grpX = data['x'];
                pages[pg].grpY = data['y'];
                pages[pg].grpDrag = data['drag'];
                pages[pg].grpErase = data['erase'];
                redrawAll();
            }
        });
        return false;
    }, 5000);
});
