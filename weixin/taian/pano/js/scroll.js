﻿
var dy,pageType=false;
var typeObj=navigator.userAgent.indexOf('Android') > -1;
function preventDefaultStart(e){
	dy = e.pageY;
	if(typeObj){
		dy = e.changedTouches[0].pageY;
	}
}

function preventDefaultMove(e){
	if((parseInt($(".notetabs").width()) < parseInt($(".notetabs div").width())) && (e.target.parentNode.className=="notetabs" || e.target.parentNode.parentNode.className=="notetabs" || e.target.className=="notetabs")){

	}else{
		var move_dy = e.pageY - dy;
		if(typeObj){
			move_dy = e.changedTouches[0].pageY - dy;
		}
		var paddingVal = 0;
		var this_scroll_tab = 0;
		var max_scroll_tab = 0;
		if(pageType){
			this_scroll_tab = $(".note:visible .cc").scrollTop();
			max_scroll_tab = parseInt($(".note:visible .cc .ccCont").height()) - parseInt($(".note:visible .cc").height());
			paddingVal = 0;
		}
		if($("#orderCont").is(":visible")){
			paddingVal = 30;
		}
		var max_scroll =(parseInt($(".pluginBox").height()) + paddingVal) - parseInt($("#pluginBox").height());
		var this_scroll = $("#pluginBox").scrollTop();

		if($("#navNewsCont").is(":visible")){
			var max_scroll =(parseInt($(".navNewsCont").height()) + paddingVal) - parseInt($("#navNewsCont").height());
			var this_scroll = $("#navNewsCont").scrollTop();
		}

		if($("#infoWarp").is(":visible")){
			var max_scroll =(parseInt($(".infoCon").height()) + paddingVal) - parseInt($("#infoWarp").height());
			var this_scroll = $("#infoWarp").scrollTop();
		}
		
		if(move_dy > 0 && this_scroll == 0 && this_scroll_tab == 0){
			e.preventDefault(); 
		};
		if(max_scroll > 0){
			if(move_dy < 0 && this_scroll >= max_scroll){
				e.preventDefault();
			};
		}else{
			if(pageType){
				if(move_dy < 0 && max_scroll_tab < this_scroll_tab){
					e.preventDefault();
				};
			}else{
				if(move_dy < 0){
					e.preventDefault();
				};
			}
		}//
	}
}
window.onload=function(){
	pageType=$("body").hasClass("nospacing");
	if(window.addEventListener){ 
		document.addEventListener("touchstart", preventDefaultStart, false);  
		document.addEventListener("touchmove", preventDefaultMove, false);  
	}
}

function isMobile() {
    var userAgentInfo = navigator.userAgent;
    var mobileAgents = [ "Android", "iPhone", "SymbianOS", "Windows Phone", "iPad","iPod"];
    var mobile_flag = false;
    //根据userAgent判断是否是手机
    for (var v = 0; v < mobileAgents.length; v++) {
        if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
            mobile_flag = true;
            break;
        }
    }
     var screen_width = window.screen.width;
     var screen_height = window.screen.height;    
     //根据屏幕分辨率判断是否是手机
     if(screen_width < 500 && screen_height < 800){
         mobile_flag = true;
     }
     return mobile_flag;
}
