/* All Constants, Global variables and functions */

var SERVER_URL = "http://localhost:8080/ProjectManagement-Core/";
//var LIST_LOAD_INTERVAL = 1*24*60*60*1000; //1 day

//Unique flag to load profile images --> to reload image in case of photo upload and get new version instead of cached 
var PHOTO_VERSION_FLAG = new Date().getTime();

var PM_APP = {}; //ProjectManagement Application name space to hold common objects
PM_APP.LogActionGridActiveFor == ""; //Log Id for which action grid is invoked
PM_APP.LogResultActionGridActiveFor == ""; //Log Result Id for which action grid is invoked
PM_APP.firstLogin = false;

function setCookie(c_name, value, exdays) {
	var c_value=escape(value);
	if(exdays > 0){
		var exdate=new Date();
		exdate.setDate(exdate.getDate() + exdays);
		c_value += "; expires="+exdate.toUTCString();
	} 
	document.cookie=c_name + "=" + c_value;
}

function doElLogin(response, keepMeAlive){
	setCookie('auth-token', response.userTokenDTO.authToken, keepMeAlive ? 3000 : 0);
	setCookie('pm-user', response.userTokenDTO.userDTO.id, keepMeAlive ? 3000 : 0);
	localStorage.userId = response.userTokenDTO.userDTO.id;
	localStorage.contextOf = response.userTokenDTO.userDTO.id;
	localStorage.userName = response.userTokenDTO.userDTO.firstName + " " + response.userTokenDTO.userDTO.lastName;
	localStorage.userImageUrl = response.userTokenDTO.userDTO.profileImageUrl;
	localStorage.gender = response.userTokenDTO.userDTO.gender;
	
	if(response.firstLogin){
		document.location.href='index.html#welcome';
	} else {
		document.location.href='login1.html';
	}
	
}

function removeLocalStorageData(){
	localStorage.removeItem("userId");
	localStorage.removeItem("contextOf");
	localStorage.removeItem("userName");
	localStorage.removeItem("userImageUrl");
	localStorage.removeItem("gender");
}

function setLoggedInUserName(){
	// Set currently logged-in username
	document.getElementById("username").innerHTML = localStorage.userName;
}

function clearCachedProfilePhoto(){
	PHOTO_VERSION_FLAG = new Date().getTime();
}
function getProfileImagePath(imageUrl){
	return SERVER_URL+ "services/image/userImage?imageName="+imageUrl + "&ts=" + PHOTO_VERSION_FLAG;
}

function getResultImagePath(imageUrl){
	return SERVER_URL+ "services/image/resultImage?imageName="+imageUrl ;//+ "&ts=" + new Date().getTime();
}

function getTimeString(secs){
	var timeStr = secs+" seconds ago";
	
	var min = 1 * 60;
	var hrs = min * 60;
	var days = hrs * 24;
	
	if(secs > days){
		 timeStr = Math.round(secs / days)+" days ago";
	} else if(secs > hrs){
		 timeStr = Math.round(secs / hrs)+" hours ago";
	} else if(secs > min){
		 timeStr = Math.round(secs / min)+" minutes ago";
	}
	
	return timeStr;
}

function formatMoney(number, places, symbol, thousand, decimal) {
	if(""+number == ""){
		return number;
	}
	
	places = !isNaN(places = Math.abs(places)) ? places : 2;
	symbol = symbol !== undefined ? symbol : "$";
	thousand = thousand || ",";
	decimal = decimal || ".";
//	var number = this, 
    var negative = number < 0 ? "-" : "",
    i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
	return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};

function formatNumber(number, places, thousand) {
	if(number && !isNaN(number)){
		places = !isNaN(places = Math.abs(places)) ? places : 2;
		places = Math.abs(number) == Math.round(number) ? 0 : places; //Round only if a fraction no
		thousand = thousand || ",";
	    var negative = number < 0 ? "-" : "",
			decimal = ".";
		    i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
		    j = (j = i.length) > 3 ? j % 3 : 0;
		return negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
	} else {
		return number;
	}
};

function formatResultValue(resultUnit, value){
	if(resultUnit=="NUMBER"){
		return formatNumber(value, 0);
	} else {
		return value;
	}
}

function getJSON(file){
	var request = new XMLHttpRequest();
	request.open('GET',file,false);
	request.setRequestHeader('X-Requested-with', 'XMLHttpRequest');
	request.send(null);
	try{
		return JSON.parse(request.responseText);
	}catch(e){
		return '';
	}
}

function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
};

function showMessageBox(message,image) {
	$("body").css("overflow","hidden");
	$("#el_msg_modal_div").height($(window).height());
	$("#el_msg_modal_div").width($(window).width());
	$("#error_message").css("top", (($(window).height()-$("#error_message").height())/2));
	$("#error_message").css("left", (($(window).width()-$("#error_message").width())/2));
	
	if(image){
		$( "#error_message" ).find("#image").attr("src","resources/images/ico_done.png");	
	}else{
		$( "#error_message" ).find("#image").attr("src","resources/images/ico_error.png");
	}
	$( "#error_message" ).find("#msg").html(message);
	$("#el_msg_modal_div").show();
	$( "#error_message" ).show();
	return false;
};
function showAgreeBox(onAgreeCallBack){
/* Dialog box for Agree button while registration */
	
	$("#agree").dialog({
		autoOpen: false,
		resizable: false,
		width: 345,
		height: 277,
		modal: true,
		buttons: {
		}
	});
	$("#agree").css({
		'display': 'none',
		'height': '277px',
		'width': '345px',
		'padding': '.2em',
		'background-color': '#F0EEE3'
	});
	$("#agree").dialog("open");
	if(onAgreeCallBack){
		$( "#agree" ).find(".btn_agree").unbind("click");
		$( "#agree" ).find(".btn_agree").bind("click",onAgreeCallBack);
	}else{
		$( "#agree" ).find(".btn_agree").bind("click");
	}
	
	$( "#agree" ).find(".ico_quit, .ok").click(function(){
		$("#agree").dialog("close");
	});
}
function initELMessageBox(){
//	$("#error_message").dialog({
//		autoOpen: false,
//		resizable: false,
//		width: 350,
//		height: 150,
//		modal: true/*,
//		buttons: {
//			Ok: function() {
//				$(this).dialog( "close" );
//			}
//		}*/
//	});
	
	$("#error_message").css({
		'display': 'none',
		'position': 'absolute',
		'z-index': 2200,
		'min-height': '277px',
		'width': '345px',
		'top': '240px',
		'padding': '.2em',
		'left': '500px',
		'border': '1px solid #CCC',
		'background-color': '#F0EEE3'
	});
	
	$("body").append('<div id="el_msg_modal_div" class="ui-widget-overlay" style="width: '+ $(window).width() +'px; height: '+ $(window).height() +'px; z-index: 2199; display:none;"></div>');
	$("#el_msg_modal_div").hide();
	
	$("#error_message").bind("mouseover", function(event){
		//stop mouseover propagation on body, because we are hiding action grid on body mouse over
		event.stopPropagation();
	});
	
	$( "#error_message" ).find(".ico_quit, .ok").click(function(){
		$("#error_message").hide();
		$("#el_msg_modal_div").hide();
		$("body").css("overflow","auto");
	});
}

function initFooterLinkPopups(){
	$("#footer_link_questions_dialog, #footer_link_feedback_dialog, #footer_link_terms_dialog, #footer_link_attribution_dialog").dialog({
		autoOpen: false,
		resizable: false,
		width: 700,
		height: 550,
		open : function() {
			
		},
		close : function() {
			$("body").css("overflow", "auto");
		},
		modal: true
	});
	
	$("#footer_link_questions").click(function(){
		$("body").css("overflow", "hidden");
		$("#footer_link_questions_dialog").dialog( "open" );
		EL_APP.questionsView.updateScrollBar();
	});
	
	$("#footer_link_feedback").click(function(){
		$("body").css("overflow", "hidden");
		$("#footer_link_feedback_dialog").dialog( "open" );
		EL_APP.feedbackView.reset();
	});
	$("#footer_link_attribution").click(function(){
		$("body").css("overflow", "hidden");
		$("#footer_link_attribution_dialog").dialog( "open" );
	});
	$("#footer_link_terms, #terms_link_signup").click(function(){
		$("body").css("overflow", "hidden");
		$("#footer_link_terms_dialog").dialog( "open" );
		EL_APP.termsView.updateScrollBar();
	});
}
