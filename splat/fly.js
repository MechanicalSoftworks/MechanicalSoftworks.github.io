// RANDOM FLYING
function move_fly(options) {
	
	var defaults = {
		craziness: 10,
		distance: 1000,
		duration: 400,
		rotate: true,
		rotateduration: 500,
		width: $('.fly').width(),
		height: $('.fly').height(),
	};
	var fly = $.extend( {}, defaults, options );
	
	// Determine window boundaries
	var winx = $(window).width();
	var winy = $(window).height();
	$(window).resize(function() {
		var winx = $(window).width();
		var winy = $(window).height();
	});
	
	// Determine initial position
	var x = parseInt($('.fly').css('left'),10);
	var y = parseInt($('.fly').css('top'),10);
	
	// work out the new x position of the fly
	xn = x + Math.floor((Math.random() * fly.distance) - (fly.distance / 2));
	
	// check x for boundaries
	if (xn > winx - fly.width) { xn = winx - fly.width - 65; };
	if (xn < 0) { xn = 0; };
		
	// work out the new y position of the fly
	yn = y + Math.floor((Math.random() * fly.distance) - (fly.distance / 2));
	
	// check y for boundaries
	if (yn > winy - fly.height) { yn = winy - fly.height - 80; };
	if (yn < 0) { yn = 0; };

	// Rotate if specified;
	if (fly.rotate) {
	
		// work out rotation angle	
		offsetx = xn - x;
		offsety = yn - y;
	
		//	angle = Math.atan(offsetx / offsety) * (180 / Math.PI);
		if (offsetx > 0 && offsety > 0) { angle = 180 - (Math.atan(offsetx / offsety) * (180 / Math.PI)); };
		if (offsetx > 0 && offsety < 0) { angle = 0 - (Math.atan(offsetx / offsety) * (180 / Math.PI)); };
		if (offsetx < 0 && offsety > 0) { angle = 180 - (Math.atan(offsetx / offsety) * (180 / Math.PI)); };
		if (offsetx < 0 && offsety < 0) { angle = 360 - (Math.atan(offsetx / offsety) * (180 / Math.PI)); };
		if (offsetx == 0 && offsety > 0) { angle = 180; };
		if (offsetx == 0 && offsety < 0) { angle = 0; };
		if (offsetx > 0 && offsety == 0) { angle = 90; };
		if (offsetx < 0 && offsety == 0) { angle = 270; };
		
		// rotate angle of the fly using jqueryrotate script
		$(".fly").rotate({
			duration: fly.rotateduration,
			animateTo: angle
		});
	};
	
	// animate the position of the fly
	$(".fly").animate({
		'left': xn, 
		'top': yn
	},fly.duration);

	// Kill on click
	$('.fly').bind(start,function(){
		death();
		return false;
	});
	
	// set delay - craziness if still alive
	flyanimate = setTimeout(function(){move_fly(options)}, fly.craziness);

} //END function move_fly

function death() {
	// kill Timeout
	if ( flyanimate != null ) { clearTimeout(flyanimate); };
	flyanimate = null;
	$('.fly').stop();
	
	// Do dead stuff
	currentTime = new Date();
	$('.fly').css({ 'background':"url(splat/assets/img/dead-white.png)" }).delay(5000).fadeOut(25000);
	deathtime = currentTime.getTime();
	timetoDeath = Math.round(((deathtime - beginning)/1000)*100)/100;
	dead = true;
	
	$('.replaylayer').fadeIn(500).closest('.layer').addClass('top');
	$('.follower').css({ 'background-position':'50% 100%' });
	if ((clicks+1) == 1) { var grammar = ''; } else { var grammar = 's'; };
	$('h2').html('Splat! It took you '+timetoDeath+' seconds and '+(clicks+1)+' click'+grammar).css({ 'font-size':'3em' });
	if (mobile) {
		$('.follower').css({ 'display':'none' });
	};

	return false;
} //END function death


function makeStain(clickX,clickY) {
	$('<div class="stain" style="left:'+(clickX-30)+'px;top:'+(clickY-30)+'px;"></div>').appendTo('.stains').fadeOut(10000, function(){ $(this).remove() });
}

// Touch = Mouse
mobile   = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent); 
start = mobile ? "touchstart" : "mousedown";
end = mobile ? "touchend" : "mouseup";


$(document).ready(function(){
	
	// Start time
	startTime = new Date();
	beginning = startTime.getTime();
	
	/*if (mobile) {
		$('.follower').css({ 'display':'none' });
	};*/
	
	$('.replaylayer').hide();
	
	// Click Counter & Events
	clicks = 0;
	dead = false;
	$('body').bind(start,function(e){
		clicks = clicks + 1;
		if (dead) {
			$('.follower').css({ 'background-position':'50% 100%' });
			if (mobile) {
				var clickX = e.originalEvent.touches[0].pageX;
				var clickY = e.originalEvent.touches[0].pageY;
				$('.follower').css('left', clickX - ($('.follower').width()/2));
				$('.follower').css('top', clickY - ($('.follower').height()/2)+30);
			} else {
				var clickX = e.pageX;
				var clickY = e.pageY;
			};
			makeStain(clickX,clickY);
		} else {
			if (mobile) {
				var clickX = e.originalEvent.touches[0].pageX;
				var clickY = e.originalEvent.touches[0].pageY;
				$('.follower').css('left', clickX - ($('.follower').width()/2));
				$('.follower').css('top', clickY - ($('.follower').height()/2)+30);
			};
			$('.follower').css({ 'background-position':'50% 0' });
		};
	});
	
	$('body').bind(end,function(){
		if (dead) {
			$('.follower').css({ 'background-position':'50% -220px' });
		} else {
			$('.follower').css({ 'background-position':'50% -110px' });
		};
	});

	//Inital random position
	winx = $(window).width();
	winy = $(window).height();
	
	x_i = Math.floor((Math.random() * winx) + 1); 
	y_i = Math.floor((Math.random() * winy) + 1); 
	
	$(".fly").css({
			'left': x_i, 
			'top': y_i
	});

	// Options
	var fly = {
		craziness: 200,
		distance: 1000,
		duration: 200,
		rotate: true,
		rotateduration: 40
	};
	
	// Run function
	move_fly(fly);
 
});// document.ready

// Mouse follower
$(document).mousemove( function(e) {
	mouseX = e.pageX;
	mouseY = e.pageY; 
	relMouseX = mouseX - ($('.follower').width()/2);
	relMouseY = mouseY - ($('.follower').height()/2)+30;
});
  			
frameRate =  240;
timeInterval = Math.round( 1000 / frameRate );
atimer = setInterval( "animateFollower()", timeInterval );
		
function animateFollower() {
	$('.follower').css('left', relMouseX);
	$('.follower').css('top', relMouseY);
}