/**
 * A simple RGBa color class.
 *
 *
 * Class originally derives from
 *   https://github.com/IkarosKappler/triangle-loader-fast/blob/master/main.js
 *
 *
 * @author   Ikaros Kappler
 * @date     2016-03-12
 * @modified 2017-06-15 (converted into a proper class).
 * @modified 2017-06-16 Ikaros Kappler (added the alpha component).
 * @version  1.0.1
 **/

/**
 * The constructor with RGBa values 0 to 255 (and 0.0 to 1.0 for the alpha channel).
 **/
var Color = function(r,g,b,a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a==null||(typeof a == 'undefined') ? 1.0 : a;
};


/**
 * Convert this color into a string.
 * The returned string is 'rgb(<r>,<g>,<b>)' where <r>, <g> and <b> are integers from 0 to 255.
 **/
Color.prototype.toString = function() { return this.toRGBAString() };

/**
 * Convert this color into greyscale.
 **/
Color.prototype.toGreyscale = function() {
    var m = (this.r + this.g + this.b)/3.0;
    return new Color(m,m,m,this.a);
};


/**
 * Convert this color into a CSS color string.
 * The returned format is '#rrggbb' where rr, gg and bb are the hexadecimal color components (each two digits).
 **/
Color.prototype.toHexString = function() {
    var d2h = function(d) {
	var h = parseInt(d).toString(16);
	return h.length == 1 ? '0'+h : h;
    };
    return '#' + d2h(this.r) + d2h(this.g) + d2h(this.b) + (this.a!=1.0?d2h(Math.round(this.a*255)):'');
};

/**
 * Convert this color into an RGB string.
 * The returned string is 'rgb(<r>,<g>,<b>)' where <r>, <g> and <b> are integers from 0 to 255.
 **/
Color.prototype.toRGBString = function() { return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')'; };


/**
 * Convert this color into an RGBA string.
 * The returned string is 'rgb(<r>,<g>,<b>,<a>)' where <r>, <g> and <b> are integers from 0 to 255 and <a> in 0.0 and 1.0.
 **/
Color.prototype.toRGBAString = function() { return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')'; };



/**
 * Lighten up the color.
 *
 * l=0.0 -> current color.
 * l=1.0 -> full white.
 **/
Color.prototype.lighten = function( l ) {
    return this.interpolate(Color.WHITE,l);
}



/**
 * Get linear interpolated color.
 *
 * t=0.0 -> current color.
 * t=1.0 -> target color.
 *
 * @param color Target color.
 * @param t     Fraction (from 0.0 to 1.0).
 **/
Color.prototype.interpolate  = function(color,t) {
    return new Color( Math.floor(this.r + (color.r-this.r)*t),
		      Math.floor(this.g + (color.g-this.g)*t),
		      Math.floor(this.b + (color.b-this.b)*t),
		      Math.max(0.0,Math.min(1.0,this.a+(color.a-this.a)*t))
		    );
};


/**
 * Create a new random RGB color.
 **/
Color.random = function() {
    return new Color( Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255), 1.0 );
};


    
/**
 * Parse a color string.
 *
 * This function currently only recognizes '#rrggbb' hex and 'rgb(r,g,b,)' colors.
 **/
Color.parse = function(str) {
    if( !str || str.length == 0 )
	return new Color();
    if( str.startsWith("#") ) {
	var num = parseInt( str.substring(1).trim(), 16 );
	return new Color( (num>>16)&0xFF, (num>>8)&0xFF, num&0xFF );
    } else if( str.startsWith("rgb(") && str.endsWith(")") && str.length > 5 ) {
	var list = JSON.parse( "[" + str.substring(4,str.length-1) + "]" );
	//console.debug( "str=" + str + ", list=" + JSON.stringify(list) );
	// RGB or RGBA?
	return new Color( list[0]*1, list[1]*1, list[2]*1, (list.length>=4?list[3]*1:null) );
    } else		
	throw "Unrecognized color format: " + str + ".";
};

// White
Color.WHITE = new Color(255,255,255);
Color.BLACK = new Color(0,0,0);




// Self test
if( false ) {
    console.log( 'Create color AliceBlue' );
    var aliceBlue = Color.parse('#f0f8ff');
    console.log( 'rgb=' + aliceBlue.toRGBString() );
    console.log( 'rgba=' + aliceBlue.toRGBAString() );
    console.log( 'hex=' + aliceBlue.toHexString() );

    console.log( 'lighten 50% up' );
    var brighter = aliceBlue.lighten(0.5);
    
    console.log( 'rgb=' + brighter.toRGBString() );
    console.log( 'rgba=' + brighter.toRGBAString() );
    console.log( 'hex=' + brighter.toHexString() );

    console.log( 'Parse from string ...' );
    var parsed = Color.parse( 'rgb(247,251,255,0.5)' );
    console.log( 'rgb=' + parsed.toRGBString() );
    console.log( 'rgba=' + parsed.toRGBAString() );
    console.log( 'hex=' + parsed.toHexString() );
}
