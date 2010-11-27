$(document).ready(function () {
    "use strict";
    var STROKE_SIZE = 2;

    var bg = document.getElementById('bg');
    bg.width = document.width;
    bg.height = document.height;
    var bgctx = bg.getContext('2d');
    var mus = new Image();
    mus.src = "http://mathisregazziblogs.com/wp-content/uploads/2010/09/sheet_music.jpg";
    mus.onload = function () {
        bgctx.drawImage(mus, 0, 0);
    }; 

    var personal = document.getElementById('personal');
    personal.width = document.width - 11;
    personal.height = document.height - 11;
    var pctx = personal.getContext('2d');
    pctx.strokeStyle = '#0000ff';
    pctx.lineJoin = 'round';
    pctx.lineWidth = STROKE_SIZE;

    var group = document.getElementById('group');
    group.width = document.width - 11;
    group.height = document.height - 11;
    var gctx = group.getContext('2d');
    gctx.strokeStyle = '#ff0000';
    gctx.lineJoin = 'round';
    gctx.lineWidth = STROKE_SIZE;

    var perX = new Array();
    var perY = new Array();
    var perDrag = new Array();

    var grpX = new Array();
    var grpY = new Array();
    var grpDrag = new Array();

    var paint = false;
    
    function getContext() {
        return (mode ? pctx : gctx);
    }

    function getX() {
        return (mode ? perX : grpX);
    }

    function getY() {
        return (mode ? perY : grpY);
    }

    function getDrag() {
        return (mode ? perDrag : grpDrag);
    }   

    function addClick(x, y, dragging) {
        X = getX();
        Y = getY();
        Drag = getDrag();
        X.push(x);
        Y.push(y);
        Drag.push(dragging);
    }

    function redraw() {
        ctx = getContext();
        ctx.width = ctx.width;
    
        X = getX();
        Y = getY();
        Drag = getDrag();

        for (var i = 0; i < X.length; i++) 
        {
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

    function redrawBlack() {
        for (var m = 0; m < 2; m++) {
            mode = m;
            ctx = getContext();
            ss = ctx.strokeStyle;
            ctx.strokeStyle = '#888';
            
            ctx.width = ctx.width;
    
            X = getX();
            Y = getY();
            Drag = getDrag();

            for (var i = 0; i < X.length; i++) {
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
            ctx.strokeStyle = ss;
        }
        mode = true;
    }

    function drawPoint(e, dragging) {
        var mouseX = e.pageX; 
        var mouseY = e.pageY;

        addClick(mouseX, mouseY, dragging);
        redraw();
    }

    function toggleEditMode() {
        $('#control').toggleClass('hidden');

        if ($('#control').hasClass('hidden')) {
            redrawBlack(); 
        } else {
            mode = true;
            redraw();
            mode = false;
            redraw();
        }
        mode = true; 
        Control.updateControl();
    }

    // Handlers for the 'personal' layer
    $('#personal').mousedown(function(e) {
        paint = true;
        drawPoint(e);
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
        paint = true;
        drawPoint(e);
    });

    $('#group').mousemove(function(e) {
        if (paint) {
            drawPoint(e, true);
        }
    });

    $('#group').mouseup(function(e) {
        paint = false;
    });

    $('#group').mouseleave(function(e) {
        paint = false;
    }); 

    // Ghetto WOZ handlers
    $(document).keypress(function(e) {
        if (e.keyCode == 13) {
            toggleEditMode();
        }
    });
});
