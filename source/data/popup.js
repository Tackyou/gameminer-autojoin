/* CONFIGURATIONS */

$(function(){
	setOptions();
	//
	$("#gdelay").bind('keyup mouseup', function(){
		chrome.storage.local.set({'gameminerbot_delay': $(this).val()}, function() { 
			feedback();
		});
	});
	//
	$("#gsgold").click(function(){
		chrome.storage.local.set({'gameminerbot_spendgold': $(this).is(':checked')}, function() { 
			feedback();
		});
	});

	$("#genable").click(function(){
		chrome.storage.local.set({'gameminerbot_enabled': $(this).is(':checked')}, function() { 
			feedback();
		});
	});

	$("#gregion").click(function(){
		chrome.storage.local.set({'gameminerbot_regionfreeonly': $(this).is(':checked')}, function() { 
			feedback();
		});
	});

	$("#gafree").click(function(){
		chrome.storage.local.set({'gameminerbot_alwaysjoinfree': $(this).is(':checked')}, function() { 
			feedback();
		});
	});
	//
	$("#gcoalmin").bind('keyup mouseup', function(){
		chrome.storage.local.set({'gameminerbot_coalmin': $(this).val()}, function() { 
			feedback();
		});
	});

	$("#gcoalmax").bind('keyup mouseup', function(){
		chrome.storage.local.set({'gameminerbot_coalmax': $(this).val()}, function() { 
			feedback();
		});
	});

	$("#ggoldmin").bind('keyup mouseup', function(){
		chrome.storage.local.set({'gameminerbot_goldmin': $(this).val()}, function() { 
			feedback();
		});
	});

	$("#ggoldmax").bind('keyup mouseup', function(){
		chrome.storage.local.set({'gameminerbot_goldmax': $(this).val()}, function() { 
			feedback();
		});
	});
	//
	$("#show").click(function(){
		show();
	});
});

var timer;
function feedback() {
	clearTimeout(timer);
	$('#feedback').hide().stop(true, true).fadeIn('fast');
	timer = setTimeout(function() {
		$('#feedback').stop(true, true).fadeOut('fast');
		clearTimeout(timer);
	}, 1500);
}
function show() {
	var message = $('#message');
	if (message.text() == "show") {
		$('#actions').stop().slideUp();
		$('#instructions').stop().animate({height:358});
		message.text('close');
	}
	else {
		$('#actions').stop().slideDown();
		$('#instructions').stop().animate({height:46});
		message.text('show');
	}
}
function setOptions(){
	chrome.storage.local.get('gameminerbot_delay', function (result){
		if(result.gameminerbot_delay != undefined){
			$('#gdelay').val(result.gameminerbot_delay);
		}else{
			$('#gdelay').val(15);
		}
	});
	//
	chrome.storage.local.get('gameminerbot_coalmin', function (result){
		if(result.gameminerbot_coalmin != undefined){
			$('#gcoalmin').val(result.gameminerbot_coalmin);
		}else{
			$('#gcoalmin').val(0);
		}
	});
	chrome.storage.local.get('gameminerbot_coalmax', function (result){
		if(result.gameminerbot_coalmax != undefined){
			$('#gcoalmax').val(result.gameminerbot_coalmax);
		}else{
			$('#gcoalmax').val(100);
		}
	});
	chrome.storage.local.get('gameminerbot_goldmin', function (result){
		if(result.gameminerbot_goldmin != undefined){
			$('#ggoldmin').val(result.gameminerbot_goldmin);
		}else{
			$('#ggoldmin').val(0);
		}
	});
	chrome.storage.local.get('gameminerbot_goldmax', function (result){
		if(result.gameminerbot_goldmax != undefined){
			$('#ggoldmax').val(result.gameminerbot_goldmax);
		}else{
			$('#ggoldmax').val(100);
		}
	});
	//
	chrome.storage.local.get('gameminerbot_spendgold', function (result){
		if(result.gameminerbot_spendgold != undefined){
			$('#gsgold').attr('checked', result.gameminerbot_spendgold);
		}
	});
	chrome.storage.local.get('gameminerbot_enabled', function (result){
		if(result.gameminerbot_enabled != undefined){
			$('#genable').attr('checked', result.gameminerbot_enabled);
		}
	});
	chrome.storage.local.get('gameminerbot_regionfreeonly', function (result){
		if(result.gameminerbot_regionfreeonly != undefined){
			$('#gregion').attr('checked', result.gameminerbot_regionfreeonly);
		}
	});
	chrome.storage.local.get('gameminerbot_alwaysjoinfree', function (result){
		if(result.gameminerbot_alwaysjoinfree != undefined){
			$('#gafree').attr('checked', result.gameminerbot_alwaysjoinfree);
		}
	});
}