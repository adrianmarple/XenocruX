var db = new Dropbox.Client({key: "2ztrynn9ygroq1n"});

db.authenticate(function(error, client) {
	if (error) {
		//notify user that the page will just be a demo
		console.log(error);
		DemoSetup();
		return;
	}
	console.log("Authenticated");
});


function handle_error(error, stat) {
	if (error)
		console.log(error);
}

function getDir(filepath) {
	var dirs = filepath.split("/");
	var ret = ""
	for(var i=0; i < dirs.length-1; i++)
		ret +=  dirs[i] +"/";
	return ret;
}
function getFile(filepath) {
	return filepath.split("/")[-1];
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
function deleteCookie(cname) {
	setCookie(cname, "", -1);
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}

function set_image(path, $elem, sz) {
	if (typeof(sz) === 'undefined')
		sz = 'xl';
	imgUrl = db.thumbnailUrl(path, {'size': sz});
	$elem.css('background-image', 'url('+imgUrl+')');
}

$(document).ready(function() {
	var image_key;
	$('.image-chooser-handle').click(function() {
		console.log('Clicked image-chooser')
		$('#image-chooser').data('key', $(this).attr('key'));
		$('#image-chooser').show();
		//TODO fade in trickery
	});
	$('#image-chooser .refresh').click(function() {
		console.log('Refreshed image-chooser')
		setImageChooser();
		//TODO fade in trickery
	});
	$('#image-chooser .cancel').click(function() {
		console.log('Canceled image-chooser');
		$('#image-chooser').hide();
	});
	$('#image-chooser').on('click', '.image-thumb', function() {
		console.log('Choose image from image chooser');
		set_json($('#image-chooser').data('key'), $(this).data('file'));
		$('#image-chooser').hide();
	});
});

function setImageChooser() {
	$('.image-thumb.active').remove();
	$('#image-chooser a').attr('href', "https://dropbox.com/home" + path + "images/");
	db.readdir(path + 'images/', function(err, files) {
		for(var i=0; i < files.length; i++) {
			var file = String(files[i]);
			$newThumb = $('.image-thumb.template').clone();
			$newThumb.removeClass('template');
			$newThumb.addClass('active');
			$newThumb.attr('id', i);
			$newThumb.data('file', file);
			$newThumb.appendTo('#image-chooser .image-thumb-group');
			set_image(path + 'images/' + file, $newThumb, 'm');
		}
	});
}