"use strict";

$(document).ready(function () {
    var STROKE_SIZE = 2;
    var WIDTH = document.body.scrollWidth;
    var HEIGHT = document.body.scrollHeight;

    var bg = document.getElementById('bg');
    bg.width = WIDTH; 
    bg.height = HEIGHT; 

    var personal = document.getElementById('personal');
    personal.width = WIDTH - 11; 
    personal.height = HEIGHT - 11; 
    var pctx = personal.getContext('2d');
    pctx.strokeStyle = '#0000ff';
    pctx.lineJoin = 'round';
    pctx.lineWidth = STROKE_SIZE;

    var group = document.getElementById('group');
    group.width = WIDTH - 11;
    group.height = HEIGHT - 11;
    var gctx = group.getContext('2d');
    gctx.strokeStyle = '#ff0000';
    gctx.lineJoin = 'round';
    gctx.lineWidth = STROKE_SIZE;

    function loadPage(fileName) {
	result = new Image();
	result.src = fileName;
	return result;
    }

    function loadPages(fileNames) {
	return fileNames.map(loadPage);
    }

    function flipPages(pagesFlipped) {
	pageIndex = Math.max(0, Math.min(pages.length - 1, pageIndex + pagesFlipped));
	refreshPageDisplay();
    }

    // Returns the current left page.
    function getLeftPage() {
	return pages[pageIndex];
    }

    // Returns the current right page.
    function getRightPage() {
	return pages[pageIndex+1];
    }

    function getBGctx() {
	var bg = document.getElementById('bg');
	var bgctx = bg.getContext('2d');

	return bgctx;
    }

    function refreshPageDisplay() {
	var bgctx = getBGctx();

	bgctx.drawImage(getLeftPage(), 0, 0);
	bgctx.drawImage(getRightPage(), 700, 0);
    }

    // for now, pages should have an even number of elements, since there is no support for drawing a "blank" when there is no right page.
    var pageIndex = 0;
    var pages = loadPages(["mus1.jpg", "mus2.jpg", "mus3.jpg", "mus4.jpg", "mus5.jpg", "mus6.jpg"]);
    refreshPageDisplay();
    //    flipPages(1);

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
        var X = getX();
        var Y = getY();
        var Drag = getDrag();
        X.push(x);
        Y.push(y);
        Drag.push(dragging);
    }

    function redraw() {
        var ctx = getContext();
        ctx.width = ctx.width;
    
        var X = getX();
        var Y = getY();
        var Drag = getDrag();

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
            var ctx = getContext();
            var ss = ctx.strokeStyle;
            ctx.strokeStyle = '#666';
            
            ctx.width = ctx.width;
    
            var X = getX();
            var Y = getY();
            var Drag = getDrag();

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
