"use strict";

$(document).ready(function () {
    var STROKE_SIZE = 2;
    var WIDTH = document.body.scrollWidth;
    var HEIGHT = document.body.scrollHeight;
    
    var bg = document.getElementById('bg');
    bg.width = WIDTH; 
    bg.height = HEIGHT; 

    function initCanvas(canvasID, strokeStyle) {
        result = document.getElementById(canvasID);
        result.width = WIDTH - 11; 
        result.height = HEIGHT - 11; 
        var ctx = result.getContext('2d');
        ctx.strokeStyle = strokeStyle;
        ctx.lineJoin = 'round';
        ctx.lineWidth = STROKE_SIZE;
        return result;
    }

    var personal = initCanvas('personal', '#0000ff');
    var group = initCanvas('group', '#ff0000');
    var prevPageBtn = initCanvas('prevPage', '#ff0000');
    var nextPageBtn = initCanvas('nextPage', '#ff0000');

    function loadPage(fileName) {
        result = new Image();
        result.src = fileName;
        return result;
    }

    function loadPages(fileNames) {
        return fileNames.map(loadPage);
    }

    function flipPages(pagesFlipped) {
        // The page index is the index of the LEFT page, so we can't actually flip to the
        // LAST page, only the second-last.
        pageIndex = Math.max(0, Math.min(pages.length - 2, pageIndex + pagesFlipped));
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

    function drawPage(pageImage, xCoordinate) {
        var drawFunc = function () {
            getBGctx().drawImage(pageImage, xCoordinate, 0);
        }

        if (pageImage.complete) {
            drawFunc();
        } else {
            pageImage.onload = drawFunc;
        }
    }

    function refreshPageDisplay() {
        drawPage(getLeftPage(), 0);
        drawPage(getRightPage(), 700);
    }

    // for now, pages should have an even number of elements, since there is no support for drawing a "blank" when there is no right page.
    var pageIndex = 0;
    var pages = loadPages(["mus1.jpg", "mus2.jpg", "mus3.jpg", "mus4.jpg", "mus5.jpg", "mus6.jpg"]);
    refreshPageDisplay();

    var prevPage = document.getElementById('prevPage');
    prevPage.onclick = function () { flipPages(-2); };
    $('#prevPage').css('left', 0);
    $('#prevPage').css('top', (HEIGHT - 11) - 100);

    var nextPage = document.getElementById('nextPage');
    nextPage.onclick = function () { flipPages(2); };
    $('#nextPage').css('left', (WIDTH - 11) - 100);
    $('#nextPage').css('top', (HEIGHT - 11) - 100);

    var perX = new Array();
    var perY = new Array();
    var perDrag = new Array();
    var perErase = new Array();

    var grpX = new Array();
    var grpY = new Array();
    var grpDrag = new Array();
    var grpErase = new Array();

    var paint = false;
    var erase = false;
    
    var pctx = personal.getContext('2d');
    var gctx = group.getContext('2d');

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
    
    function getErase() {
        return (mode ? perErase: grpErase);
    }

    function addClick(x, y, dragging) {
        var X = getX();
        var Y = getY();
        var Drag = getDrag();
        var Erase = getErase();
        X.push(x);
        Y.push(y);
        Drag.push(dragging);
        Erase.push(erase);
    }

    function redraw() {
        var ctx = getContext();
        ctx.width = ctx.width;
    
        var X = getX();
        var Y = getY();
        var Drag = getDrag();
        var Erase = getErase();

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
        erase = false;
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
        alert("!");
        if (e.keyCode == 13) {
            toggleEditMode();
        } else if (e.keyCode == 69) {
            erase = !erase;
            alert(erase);
        }
    });
});
