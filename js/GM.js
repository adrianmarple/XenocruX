
var path = '/';
var json;

$(window).load(function() {
	setTimeout(function() {
		load_campaign_infos();
	}, 500);
});
$(document).ready(function() {

	$('.new-campaign').click(function() {
		set_slide("newCampSlide");
	});
	$('.main-container').on('click', '.old-campaign', function() {
		console.log("Loading campaign: " + $(this).text());
		load_campaign($(this).data('path'));
	});

	$('#camp-name').keypress(function(e) {
		if(e.which == '13') {
			e.preventDefault();
			create_GM_folder($(this).val());
			setImageChooser();
			set_slide("campaignSlide");
		}
	})

	$('.logout').click(function(e) {
		deleteCookie('campaign-path');
		deleteCookie('player-path');
		load_campaign_infos();
		$('#image-chooser').fadeOut(1000);
	});
});

function set_json(key, value) {
	json[key] = value;
	if(key == 'image') {
		set_image(path+'images/'+json['image'], $('#campaignSlide'));
	}
	db.writeFile(path+".GM.json", JSON.stringify(json, null, 2), handle_error);
}


function create_GM_folder(campaign) {
	path = '/'+campaign+'/';
	db.mkdir(path);
	db.mkdir(path + 'images/');
	json = {
		'note': "Edit this file at your own peril.  " +
				"Changes will likely cause this campaign to become inaccessable.",
		'campaign': campaign
	}
	db.writeFile(path+".GM.json", JSON.stringify(json, null, 2), handle_error);
	setCookie("campaign-path", path, 14);
}

function load_campaign_infos() {
	var p = getCookie("campaign-path");
	if (p) {
		console.log("Restoring campaign from: "+p);
		load_campaign(p);
	}
	else
		set_slide('selectSlide');

	$('.old-campaign').remove();
	db.findByName('/', '.GM.json', function(err, files) {
		for(var i=0; i<files.length; i++) {
			$newSelect = $('.select.template').clone();
			$newSelect.removeClass('template');
			$newSelect.addClass('old-campaign');
			$newSelect.attr('id', i);
			$newSelect.appendTo('#selectSlide .main-container');
			set_selector(files[i].path, $newSelect);
		}
	});
}

function load_campaign(p) {
	path = p;
	db.readFile(path + '.GM.json', function(err, data) {
		json = JSON.parse(data);
		set_image(path + 'images/' + json['image'], $('#campaignSlide'));
		setCookie("campaign-path", path, 14);
	});
	set_slide('campaignSlide');
	setImageChooser();
}

function set_selector(json_path, $elem) {
	var p = getDir(json_path);
	db.readFile(json_path, function(err, data) {
		json = JSON.parse(data);
		$elem.data('path', p);
		set_image(p + 'images/' + json['image'], $elem, 'l');
		$elem.text(json['campaign']);
	});
}