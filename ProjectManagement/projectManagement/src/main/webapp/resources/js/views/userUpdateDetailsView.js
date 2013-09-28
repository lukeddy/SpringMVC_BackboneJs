define([ 'jquery', 'underscore', 'backbone', 'views/tabsView', 'text!templates/userUpdateDetailsTpl.html','projectManagementCommon' ],
		function($, _, Backbone, TabsView, userUpdateDetailsTemplate,projectManagementCommon) {
			var UserDetailsView = Backbone.View.extend({
				
				/*
				 * define global variables
				 * 
				 * */
				entries : null,
				joinMyLog : null,
				invitation : null,
				comments : null,
				userDTO : {},
				template : _.template(userUpdateDetailsTemplate),
				events : {
					"click .ico_quit": "close",
					"click #done" : "close",
					"click #save" : "save",
					
					//"mouseover .avtar_left" : "showEditImageIcon",
					//"mouseleave .avtar_left" : "hideEditImageIcon",
					"click .edit_img": "showUploadForm",
					/*
					 * Events on Form elements
					 * */	
					
					"keyup input[name=firstName]" 		: "showSave",
					"keyup input[name=lastName]" 		: "showSave",
					"keyup input[name=emailAddress]" 	: "showSave",
					"keyup input[name=city]" 			: "showSave",					
					"keyup input[name=password]" 		: "showSave",
					"keyup input[name=newPassword]" 	: "showSave",
					"keyup input[name=matchNewPassword]": "showSave",
					"keyup textarea[name=loggerBio]" 	: "showSave",
					
					"change select[name=state]" 		: "showSave",
					"change select[name=logProudOf]"	: "showSave",
					
					"change input[name=newEntries]"		: "showSave",
					"change input[name=otherRequest]"	: "showSave",
					"change input[name=otherInvite]"	: "showSave",
					"change input[name=otherComment]"	: "showSave",
					
					"click input[name=newEntries]"		: "getState",
					"click input[name=otherRequest]"	: "getState",
					"click input[name=otherInvite]"		: "getState",
					"click input[name=otherComment]"	: "getState",
					
					"blur input[name=password]" 		: "makeRequire",
					
				},
				
				initialize : function() {
					this.render();	
					
					this.getInfo();
				},
				render : function() {	
//					var entries,joinMyLog,invitation,comments;
					$(this.el).html(this.template({
						userName : localStorage.userName
					}));
					
					this.tabs = new TabsView({
						el : $(this.el).find(".tab_container"),
						config : {
							defaultActiveTab : 0,							
							tabType : "icons",
							tabs : [ {
								icon : "tab_setting",
								target : "user_updateInfo",
								hidden: true
							}]
						}
					});
					
					/*
					 * jQuery Event Binding.
					 * */
					var _this = this;
					$(_this.el).find("textarea[name=loggerBio]").bind("keypress",function(event){
						_this.detectEnter();
					});
				return this;
				},					
				detectEnter : function(event){
					console.log("break point");
					if(event.keyCode == 13){
						$(this.el).find("textarea[name=loggerBio]").val( $(this.el).find("textarea[name=loggerBio]").val() + "\n"  );
						return false;
					}else{
						return true;
					}
				},
				getInfo : function(){
					var _this = this;
					$.ajax({
						type : "GET",
						url	: SERVER_URL + "services/user/getInfo/" + $.cookie("el-user")+ "?ts="+(new Date().getTime()),
						dataType : "json",
						headers : {
							"Accept": "application/json",
							"Content-Type" : "application/json; charset=utf-8",
							"auth-token" : $.cookie("auth-token")
						},
						success: function(result) {
							if(result.success){
//								console.log(result.data);
								_this.setInfo(result.data);
							} else {
//								console.log("some error has occurred");
							}
						},
						error: function(){
							showMessageBox("Failed to connect to server.");
						},
						complete: function(){
//							console.log("complete function is called now");
						}
					});
				},
				setInfo : function(data){
					this.userDTO = data.userInfo;
					// FIX ME
					
					if( data.userInfo.facebookId != null ){
						$(this.el).find(".forElUsers").hide();
					}
					
					this.setProfileImage();
					$(this.el).find("div.name").html(data.userInfo.firstName + " " + data.userInfo.lastName);
					$(this.el).find("#logs").html(data.userInfo.logCount);
					$(this.el).find("#leader").html(data.userInfo.participatedLogCount);
					$(this.el).find("#results").html(data.userInfo.resultCount);
					
					$(this.el).find("input[name=firstName]").val(data.userInfo.firstName);
					$(this.el).find("input[name=lastName]").val(data.userInfo.lastName);
					$(this.el).find("input[name=emailAddress]").val(data.userInfo.userName);
					$(this.el).find("input[name=city]").val(data.userInfo.city);
					
					var options = "",select = "" ;
					
					for (state in data.states){
						if ( data.userInfo.state == data.states[state].state ){
							select = "selected";
						}else{ select = ""; }
						
						options = options + "<option value='"+data.states[state].state+"' "+select+">"+data.states[state].abbreviations+"</option>";
						$(this.el).find("select[name=state]").html(options);
					}
					if(data.userInfo.emailNotification != null){
						if(data.userInfo.emailNotification.entries){
							$(this.el).find("#entries").attr("checked","checked");
						}
						if(data.userInfo.emailNotification.joinMyLog){
							$(this.el).find("#joinMyLog").attr("checked","checked");
						}
						if(data.userInfo.emailNotification.invitation){
							$(this.el).find("#invitation").attr("checked","checked");
						}
						if(data.userInfo.emailNotification.comments){
							$(this.el).find("#comments").attr("checked","checked");
						}
					}
					
					$(this.el).find("textarea[name=loggerBio]").val(data.userInfo.loggersBio);
					
					var logOptions = "", logSelected = "";
					
					logOptions = "<option value='-1' selected>Choose One</option>";
					//$(this.el).find("select[name=logProudOf]").html(defaultLogOption);
					
					for(userLogs in data.userLogs){
						
						if(data.userLogs[userLogs].logId == data.userInfo.logMostProudOf){
							logSelected = "selected";
						}else{ logSelected=""; }
						
						logOptions = logOptions + "<option value='"+ data.userLogs[userLogs].logId +"' "+logSelected+" >"+data.userLogs[userLogs].logName+"</option>";
					}
					$(this.el).find("select[name=logProudOf]").html(logOptions);
				},
				
				setProfileImage : function(){
					if(this.userDTO.profileImageUrl){
						$(this.el).find(".acc_setting_profile_image").attr("src", getProfileImagePath(this.userDTO.profileImageUrl));
					} else {
						$(this.el).find(".acc_setting_profile_image").attr("src", "resources/images/img_" + (this.userDTO.gender == "MALE" ? "male" : "female") + ".png");
					}
				},
				
				validate : function(event){			
					//console.log( $(this.el).find("input[name=firstName]") );
					if( $.trim($(this.el).find("input[name=firstName]").val()).length == 0 ){
						showMessageBox("First Name is required");
						return false;
					}
					if( $.trim($(this.el).find("input[name=firstName]").val()).length < 2  || $.trim($(this.el).find("input[name=firstName]").val()).length > 20){
						showMessageBox("First Name should be 2 to 20 characters long");
						return false;
					}
					
					if( $.trim($(this.el).find("input[name=lastName]").val()).length == 0 ){
						showMessageBox("Last Name is required");
						return false;
					}
					if( $.trim($(this.el).find("input[name=lastName]").val()).length < 2  || $.trim($(this.el).find("input[name=lastName]").val()).length > 20){
						showMessageBox("Last Name should be 2 to 20 characters long");
						return false;
					}
					
					if( !$.trim($(this.el).find("input[name=emailAddress]").val()).length == 0 ){
						if(!isValidEmailAddress($.trim($(this.el).find("input[name=emailAddress]").val()))){
							showMessageBox("Email address is not valid ");						
							return false;
						}
					}else{
						showMessageBox("Email address is required");						
						return false;
					}
					
					var newPasswordLen = $.trim($(this.el).find("input[name=newPassword]").val()).length;
					var matchPassowrdLen = $.trim($(this.el).find("input[name=matchNewPassword]").val()).length;
					if( !newPasswordLen == 0 ){
						
						if(newPasswordLen < 6 || newPasswordLen > 20){
							showMessageBox("New Password should be 6 to 20 characters long");
							return false;
						}
						
						if(matchPassowrdLen < 6 || matchPassowrdLen > 20){
							showMessageBox("Re-Enter should be 6 to 20 characters long");
							return false;
						}
						
						//	TODO :: confirm the password!
						if( $.trim($(this.el).find("input[name=newPassword]").val()) != $.trim($(this.el).find("input[name=matchNewPassword]").val()) ){
							showMessageBox("New Password and Re-Enter New Password does not match");						
							return false;
						}
					}
					return true;
				},
				confirmOldPassword : function(){
					var _this = this;
					$.ajax({
						type : "POST",
						url	: SERVER_URL + "services/user/validatePassword?userId=" + $.cookie("el-user")+"&password="+$.trim($(_this.el).find("input[name=password]").val()),
						dataType : "json",
						headers : {
							"Accept": "application/json",
							"Content-Type" : "application/json; charset=utf-8",
							"auth-token" : $.cookie("auth-token")
						},
						success: function(result) {
							if(result.success){
//								console.log("call save function here");
								_this.makeSaveRequest();
//								showMessageBox("Current password is incorrect.");
							} else {
								showMessageBox("Current password is incorrect.");
								return false;
							}
						},
						error: function(){
							showMessageBox("Failed to connect to server.");
						}	
					});
					
				},
				showSave : function(){
					$(this.el).find("#save").show();
					//$(this.el).find("#save").css({"display":"block"});
					$(this.el).find("#done").hide();
					//$(this.el).find("#done").css({"display":"none"});
				},
				makeRequire : function(){
					if( $.trim($(this.el).find("input[name=password]").val()).length > 0 ){
						$(this.el).find(".makeRequire").show();	
					}else{
						$(this.el).find(".makeRequire").hide();
					}
					
				},
				close : function(){
					this.trigger("close");
				},
				getState : function(){
 					this.entries		=	$(this.el).find("input[name=newEntries]").attr('checked')?true:false;
					this.joinMyLog		=	$(this.el).find("input[name=otherRequest]").attr('checked')?true:false;
					this.invitation		=	$(this.el).find("input[name=otherInvite]").attr('checked')?true:false;
					this.comments		=	$(this.el).find("input[name=otherComment]").attr('checked')?true:false;
				},
				save : function(){

					//	TODO :: call validate function for form validation
					
					if( !this.validate() ){
						return false;
					}
					//	TODO :: call confirmOldPassword 
					if( $.trim($(this.el).find("input[name=password]").val()).length != 0 ){
						this.confirmOldPassword();
					}else{
						this.makeSaveRequest();
					}
				},
				makeSaveRequest : function(){
					var logProudOf = $(this.el).find("select[name=logProudOf] option:selected").val();
					
					var id  			=	$.cookie("el-user");
					var firstName 		=	$.trim($(this.el).find("input[name=firstName]").val());
					var lastName 		=	$.trim($(this.el).find("input[name=lastName]").val());					
					var city			=	$.trim($(this.el).find("input[name=city]").val());
					var state			=	$.trim($(this.el).find("select[name=state] option:selected").val());
					var emailAddress	=	$.trim($(this.el).find("input[name=emailAddress]").val());
					var loggersBio		=	$.trim($(this.el).find("textarea[name=loggerBio]").val());					
					var newPassword		=	$.trim($(this.el).find("input[name=newPassword]").val());
					var logMostProudOf  = 	(logProudOf == -1) ? "" : logProudOf;
					var profileImageUrl	=	"";
					
	 				this.getState();
	 				
					var updateUserInfo = {
							id : id,
							firstName : firstName,
							lastName : lastName,
							profileImageUrl : profileImageUrl,
							city : city,
							state: state,
							emailNotification : {
								entries : this.entries,
								joinMyLog: this.joinMyLog,
								invitation: this.invitation,
								comments: this.comments
							},
							emailAddress : emailAddress,
							loggersBio : loggersBio,
							logMostProudOf : logMostProudOf,
							newPassword : newPassword
						};
					
					var swearWord = swearWords(loggersBio);
					
					if( swearWord != $.trim(loggersBio) ){
						showMessageBox("Ooops! Logger Bio contains bad word <br/>" + swearWord );
						return false;
					}
					
// 					console.log(updateUserInfo);
					var _this = this;
					$.ajax({
						url : SERVER_URL+'services/user/updateInfo',
						type : "PUT",
						data :  JSON.stringify(updateUserInfo),
						contentType : "application/json",
						dataType : "json",
						headers: {
							"Accept": "application/json",
							"Content-Type" : "application/json; charset=utf-8",
							"auth-token" : $.cookie("auth-token")
						},
						success : function(result) {
							if(result.success){
//								hide save button and show done button
								$(_this.el).find("#save").hide();
								$(_this.el).find("#done").show();
//								store name in localstorage
								localStorage.userName= firstName + " " + lastName;
								setLoggedInUserName();
								EL_APP.miniProfile.loadMiniProfile();
//								Make password fields empty onLoad of popup.								
								$(_this.el).find("input[name=password]").val("");
								$(_this.el).find("input[name=newPassword]").val("");
								$(_this.el).find("input[name=matchNewPassword]").val("");
								$(_this.el).find(".makeRequire").hide();
//								to close popup 
								_this.close();
							} else {
								showMessageBox(result.errorString);
							}
							$(".signup_button").removeAttr('disabled');
						},
						error : function() {
							$(".signup_button").removeAttr('disabled');
						}
					});
				},
				
				showUploadForm : function(){
					$("#profile_photo_dialog").dialog("open");
					/* set profile photo upload details */
					EL_APP.uploadPhotoDialog.setUserDTO(this.userDTO);
					
					EL_APP.uploadPhotoDialog.unbind("picUpload");
					
					EL_APP.uploadPhotoDialog.bind("picUpload", function(newImageURL){
						//Update photo in account setting popup
						this.userDTO.profileImageUrl = newImageURL;
						this.setProfileImage();
						
						//Update photo in mini profile -> left panel on main page
						localStorage.userImageUrl = newImageURL;
						EL_APP.miniProfile.loadMiniProfile();
						
						//Remove "picUpload" event, once refresh is done 
						//EL_APP.uploadPhotoDialog.unbind("picUpload");
					},this);
				},
				showEditImageIcon: function(){
					$(this.el).find(".edit_img").show();
				},
				hideEditImageIcon: function(){
					$(this.el).find(".edit_img").hide();
				}
			
			});
			return UserDetailsView;
		});
