// gameminer bot by tackyou
//
// settings
var gactive = false, gdelay = 15, gcoalmin = 0, gcoalmax = 100, ggoldmin = 0, ggoldmax = 100, gsgold = false, gregion = false, gafree = false, didwait = false;

function refreshSettings(){
	chrome.storage.local.get('gameminerbot_delay', function (result){
		if(result.gameminerbot_delay != undefined){
			gdelay = result.gameminerbot_delay;
		}
	});
	//
	chrome.storage.local.get('gameminerbot_coalmin', function (result){
		if(result.gameminerbot_coalmin != undefined){
			gcoalmin = result.gameminerbot_coalmin;
		}
	});
	chrome.storage.local.get('gameminerbot_coalmax', function (result){
		if(result.gameminerbot_coalmax != undefined){
			gcoalmax = result.gameminerbot_coalmax;
		}
	});
	chrome.storage.local.get('gameminerbot_goldmin', function (result){
		if(result.gameminerbot_goldmin != undefined){
			ggoldmin = result.gameminerbot_goldmin;
		}
	});
	chrome.storage.local.get('gameminerbot_goldmax', function (result){
		if(result.gameminerbot_goldmax != undefined){
			ggoldmax = result.gameminerbot_goldmax;
		}
	});
	//
	chrome.storage.local.get('gameminerbot_enabled', function (result){
		if(result.gameminerbot_enabled != undefined){
			gactive = result.gameminerbot_enabled;
		}else{
			chrome.storage.local.set({'gameminerbot_enabled': true}, function() { 
				gactive = true;
			});
		}
	});
	chrome.storage.local.get('gameminerbot_spendgold', function (result){
		if(result.gameminerbot_spendgold != undefined){
			gsgold = result.gameminerbot_spendgold;
		}
	});
	chrome.storage.local.get('gameminerbot_regionfreeonly', function (result){
		if(result.gameminerbot_regionfreeonly != undefined){
			gregion = result.gameminerbot_regionfreeonly;
		}
	});
	chrome.storage.local.get('gameminerbot_alwaysjoinfree', function (result){
		if(result.gameminerbot_alwaysjoinfree != undefined){
			gafree = result.gameminerbot_alwaysjoinfree;
		}
	});
}
// working values
var giveawaysjoined = 0, i = 0, x = 1, category = "coal", categories = ["golden", "coal", "sandbox"], coal = $('span.g-coal-big-icon span.user__coal'), gold = $('span.g-gold-big-icon span.user__gold'), yourcoal = +(coal.text()), yourgold = +(gold.text());
$(function(){
	$('<div id="gmlog" style="position:fixed;top:5px;left:5px;height:250px;width:165px;overflow-y:scroll;z-index:99999999;cursor:move" class="giveaway-search clearfix"><div style="position:absolute;top:0;left:0;cursor:pointer;background:#999;color:#fff;font-size:12px;text-align:center;width:15px;height:15px;" onclick="$(this).parent().hide();">X</div><div style="position:absolute;top:0;right:0;background:#999;color:#fff;font-size:9px;text-align:center;padding:0 5px;height:10px;border-bottom-left-radius:5px;line-height:10px" id="gmstat">bot</div><br></div>').prependTo('body');
	var $target = null;
	$('body').on("mousedown", "#gmlog", function(e) {
		$target = $('#gmlog');
		x = e.pageX-$target.offset().left;
		y = e.pageY-$target.offset().top;
	}).on("mouseup", function(e){
		$target = null;
	}).on("mousemove", function(e){
		if ($target){
			$target.offset({
				top: e.pageY  - y,
				left: e.pageX - x
			});
		}
	});
	var gobot = setInterval(function(){
		refreshSettings();
		if(!gactive){
			if(!didwait) { writeLog('Gameminer Bot is disabled, please activate in settings'); }
			didwait = true;
		}else{
			clearInterval(gobot);
			if(didwait) { $('#gmlog div.logentry').remove(); }
			if(!isLoggedIn()){
				writeLog('Please login with your Steam account to Gameminer first!');
			}else{
				writeLog('Gameminer Bot is running');
				//writeLog('Coal: '+yourcoal+', Gold: '+yourgold);
				cycle(); // lets go
				var refilltime = 3600000;
				try{
					refilltime = +($('.g-coal-big-icon').text().split(' in ')[1].split(' minutes')[0]);
					refilltime *= 60000;
				}catch(e){ }
				setTimeout(pointrefill, refilltime);
			}
		}
	}, 100);
});
//
function isLoggedIn(){
	var e = $('.account__menu li a');
	if(e.length>0 && e.attr('href').indexOf('logout')>-1){
		return true;
	}
	return false;
}
function writeLog(msg){
	if($('#gmlog > div.logentry').length>29){
		$('#gmlog div.logentry').last().remove();
	}
	$('<div class="logentry" style="margin:5px 0"><span style="color:#999;font-size:10px">' + new Date().toString().slice(4,24) +'</span><br>'+msg+'</div>').hide().prependTo('#gmlog').slideDown();
}

function cycle() {
	try{
		x = 1;
		refreshSettings();
		category = categories[i];
		if((category == 'golden' && gsgold) || category != 'golden'){
			$.get('http://gameminer.net/giveaway/' + category + '?type=any&q=&sortby=finish&order=asc&filter_entered=on', function(content){
				//writeLog('Browsing category ' + category);
				var parsedcontent = $(content);
				$('.giveaway__container', parsedcontent).each(function(index){
					JoinIfNotDLC(this, category);
				});
				i++;
				if(i > 2){
					i=0;
					setTimeout(cycle, gdelay * 60000);
					//writeLog('Giveaways joined: ' + giveawaysjoined + ', pausing for '+gdelay+' minutes ...');
				}else{
					setTimeout(cycle, 2500);
				}
			}).fail(function() {
				setTimeout(cycle, 5000);
			});
		}else{
			i++;
			cycle();
		}
	}catch(e){
		setTimeout(cycle, 5000);
	}
}

function pointrefill(){
	yourcoal += 1;
	coal.text(yourcoal);
	setTimeout(pointrefill, 3600000);
}

function JoinIfNotDLC(content, category){
	var name = $('a.giveaway__name', content).text();
	var points = +($('.giveaway__main-info', content).next().find('p:nth-child(3) span').text().split(' ')[0]);
	var form = $('.giveaway__action form', content);
	var canjoin = form.hasClass('giveaway-join');
	var steamurl = $('.giveaway__topc a', content).attr('href'), steamappid = 0;
	var regionlock = $("span[class*='regionlock']", content);
	var regionlocked = regionlock != undefined && regionlock.length>0;
	if((gregion && regionlocked) || (category == 'golden' && (points > ggoldmax || points < ggoldmin) && !gafree) || (category != 'golden' && (points > gcoalmax || points < gcoalmin) && !gafree)){
		canjoin = false;
	}else{
		if(steamurl != undefined){
			try{
				steamappid = steamurl.split('/app/')[1].split('/')[0];
			}catch(e){
				// it's a bundle /sub/
				canjoin = false; // can't check them, can't join them.
				// you could make it check all games in the bundle some day .... maybe a bit overload tho
			}
		}
	}
	if(((category == 'golden' && points <= yourgold) || (category != 'golden' && points <= yourcoal)) && canjoin){
		setTimeout(function(){
			var site = 'http://store.steampowered.com/api/appdetails/?appids='+steamappid;
			var yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from json where url="' + site + '"') + '&format=json';
			$.getJSON(yql, function(data) {
				var game;
				var json = data.query.results;
				for (var property in json) {
					if (json.hasOwnProperty(property)) {
						game = json[property];
						break;
					}
				}
				if(game == undefined || game.data == undefined || (game != undefined && game.data != undefined && game.data.type != 'dlc')){
					$.post(form.attr('action'), form.serialize() + "&json=true", function(resp) {
						coal.text(resp.coal);
						gold.text(resp.gold);
						yourcoal = resp.coal;
						yourgold = resp.gold;
						writeLog('('+points+'p) '+name);
						giveawaysjoined++;
						$('#gmstat').text('Giveaways joined: '+giveawaysjoined);
					});
				}
			});
		}, 1000*x);
		x++;
	}
}