/**
 * Draw a hex plot.
 * 
 * @author  Ikaros Kappler
 * @date    2018-03-131
 * @version 1.0.0
 **/


var RAD2DEG = 180/Math.PI;
var DEG2RAD = Math.PI/180;


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

    
    // +-------------------------------------------------------------------------
    // | Set the into text.
    // +-----------------------------------------------------
    function setInfo(info) {
	document.getElementById('info').innerHTML = info;
    }

    function atanYX( x, y ) {
        // Swapping (x,y) to (-y,x) rotates the point by 90° :)
        return Math.atan2(-y,x);
    }

    function wrapTo2Pi( a ) {
        return (a > 0 ? (Math.PI*2 - a) : -a);
    }


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
	var atan = atanYX(relX,relY);
	var angle = atan; 
	var angleDeg = wrapTo2Pi(angle) / Math.PI * 180;

	var length = Math.sqrt( Math.pow(mouseX - center.x,2), Math.pow(center.y - mouseY,2) );

	drawHexPlot( center, length/5, angle, 6 );
	
	setInfo('mouse at ('+relX+','+relY+'), angle=' + angleDeg.toFixed(2) + '°, atan2=' + (Math.atan2(relX,relY)*RAD2DEG).toFixed(2) + '°, atanYX=' + (atan*RAD2DEG).toFixed(2) );
    }

    function drawHexPlot( start, length, direction, depth ) {

	if( depth < 0 )
	    return;

	for( var i = 0; i < 3; i++ ) {
	    var rand  = Math.round( Math.random()*180 );  
	    var angle = rand/3;
	    var mod   = angle % 60;
	    if( mod < 30 )
		angle = angle-mod;
	    else
		angle = angle + 60 - mod;

	    angle *= RAD2DEG;

	    var x = length * Math.cos(direction+angle);
	    var y = length * Math.sin(direction+angle);
	    drawLine( start.x, start.y, start.x+x, start.y+y, 'orange' );
	    
	    drawHexPlot( { x : start.x+x, y : start.y+y }, length, direction+angle, depth-1 );
	}
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
    

    function handleMouseMove(e) {
	mouseX = e.pageX - this.offsetLeft; 
	mouseY = e.pageY - this.offsetTop;

	compute();
	//console.log('mouse at '+mouseX+','+mouseY );
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

	canvas.addEventListener('mousemove', handleMouseMove);

	mouseX = 200;
	mouseY = 200;
	compute();

	// Tell the garbage collector we're done with initialization.
	delete init;
    }

    window.addEventListener('load',init);    

})();
