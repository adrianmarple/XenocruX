
function set_slide(id) {
	console.log('Setting slide to ' + id);
	$cur_slide = $('.slide:visible');
	$('#'+id).css('opacity', .001);
	$('#'+id).show();
	if ($cur_slide.length > 0)
		$cur_slide.fadeOut(1000, function() {
			window.scrollTo(0,0);
			setTimeout(function() {
				$('#'+id).animate({opacity: 1},1000);
			}, 500);
		});
	else {
		window.scrollTo(0,0);
		setTimeout(function() {
			$('#'+id).animate({opacity: 1},1000);
		}, 2000);
	}
}