/**
 * Draw a hex plot.
 * 
 * @author  Ikaros Kappler
 * @date    2018-03-131
 * @version 1.0.0
 **/


//var RAD2DEG = 180/Math.PI;
//var DEG2RAD = Math.PI/180;


(function() {
    
    // +-------------------------------------------------------------------------
    // | First of all declare some globals.
    // +-----------------------------------------------------
    var canvasSize = { width : 600, height : 600 };
    var center = { x : canvasSize.width/2.0, y : canvasSize.height/2.0 };

    // Will be initialized on the 'load' event.
    var canvas = null;
    var ctx = null;

    var mouseX = null;
    var mouseY = null;

    var startColor = new Color(255,128,0); // orange
    var endColor   = new Color(0,128,255); // blue
    
    // +-------------------------------------------------------------------------
    // | Set the into text.
    // +-----------------------------------------------------
    function setInfo(info) {
	document.getElementById('info').innerHTML = info;
    }

    /*
    function atanYX( x, y ) {
        // Swapping (x,y) to (-y,x) rotates the point by 90° :)
        return Math.atan2(-y,x);
    }

    function wrapTo2Pi( a ) {
        return (a > 0 ? (Math.PI*2 - a) : -a);
    }
    */


    // +-------------------------------------------------------------------------
    // | Just start the computation. The function is triggered each time the
    // | mose moves on the canvas.
    // +-----------------------------------------------------
    function compute() {
	clearCanvas();

	var relX = mouseX-center.x;
	var relY = center.y-mouseY;

	// Draw the x and y axis
	drawLine( 0, center.y, canvasSize.width, center.y, 'grey' );
	drawLine( center.x, 0, center.x, canvasSize.height, 'grey' );

	// Draw the line to the current mouse position.
	drawLine( center.x, center.y, mouseX, mouseY, 'black' );

	// Do some basic computation.
	var atan     = M.atanYX(relX,relY);
	var angle    = atan; 
	var angleDeg = M.wrapTo2Pi(angle) * M.RAD2DEG; // / Math.PI * 180;
	var length   = Math.sqrt( Math.pow(mouseX - center.x,2), Math.pow(center.y - mouseY,2) );

	var diagonal = M.hypo( canvasSize.width/2, canvasSize.height/2 );
	drawHexPlot( center, length/10 + (100/(120+length)), angle, angle, 10, 10 );
	
	setInfo('mouse at ('+relX+','+relY+'), angle=' + angleDeg.toFixed(2) + '°, atan2=' + (Math.atan2(relX,relY)*M.RAD2DEG).toFixed(2) + '°, atanYX=' + (atan*M.RAD2DEG).toFixed(2) );
    }

    function drawHexPlot( start, length, curDirection, globalDirection, curIteration, depth ) {

	if( curIteration < 0 )
	    return;

	/*
	if( curDirection < globalDirection-2*Math.PI/3 )
	    return;
	if( curDirection > globalDirection+2*Math.PI/3 )
	    return;
	*/
	
	var x = length * Math.cos(curDirection);
	var y = length * Math.sin(curDirection);
	var color = startColor.interpolate(endColor,curIteration/depth);
	drawLine( start.x, start.y, start.x+x, start.y+y, color );

	var angle = curDirection - Math.PI/3;   
	drawHexPlot( { x : start.x+x, y : start.y+y }, length, angle, globalDirection, curIteration-1, depth );
	
	var angle = curDirection + Math.PI/3;
	drawHexPlot( { x : start.x+x, y : start.y+y }, length, angle, globalDirection, curIteration-1, depth );
	
    }

    // +-------------------------------------------------------------------------
    // | Draw a line from (x0,y0) to (x1,y1) with the given color.
    // +-----------------------------------------------------
    function drawLine( x0, y0, x1, y1, color ) {
	ctx.beginPath();
	ctx.moveTo( x0, y0 );
	ctx.lineTo( x1, y1 );
	ctx.closePath();
	ctx.strokeStyle = color;
	ctx.stroke();
    }


    // +-------------------------------------------------------------------------
    // | This function clears the canvas.
    // +-----------------------------------------------------
    function clearCanvas() {
	// Clear canvas
	ctx.fillStyle = '#f0f8ff';
	ctx.fillRect(0,0,canvasSize.width,canvasSize.height);
    }
    

    // +-------------------------------------------------------------------------
    // | Initlalize the whole scene.
    // | Get the input elements from the DOM.
    // | Install event listeners.
    // +-----------------------------------------------------
    function init() {	
	// Tidy up the listener queue.
	window.removeEventListener('load',init,false);

	canvas = document.getElementById('canvas');
	ctx    = canvas.getContext('2d');

	// canvas.addEventListener('mousemove', handleMouseMove);
	new MouseHandler(canvas).move( function(e) {
	    mouseX = e.params.pos.x;
	    mouseY = e.params.pos.y;
	    compute();
	} );

	mouseX = 200;
	mouseY = 200;
	compute();

	// Tell the garbage collector we're done with initialization.
	delete init;
    }

    window.addEventListener('load',init);    

})();
