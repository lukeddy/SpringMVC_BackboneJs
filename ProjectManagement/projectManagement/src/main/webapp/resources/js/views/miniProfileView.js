define([ 'jquery', 'underscore', 'backbone', 'views/userDetailsView', 'models/miniProfile', 'text!templates/miniProfileTpl.html' ],
	function($, _, Backbone, UserDetailsView, MiniProfileModel, profileTemplate) {
		var MiniProfileView = Backbone.View.extend({
			tagName : 'div',
			template : _.template(profileTemplate),

			events : {
				"click" : "showMiniProfilePopup",
				"click .edit_img" : "uploadProfilePic"
			},

			initialize : function() {
				
				this.loggerId = this.options.loggerId;
				this.showInvitationsPopup = true; //Show invitation popup if any pending invitation on login
				
				_.bindAll(this, 'render', 'showMiniProfilePopup');
				
				this.model = new MiniProfileModel();
				
				if(this.loggerId){ //load loggers details on init
					this.loadMiniProfile();
				}
			},
			
			render : function() {
				$(this.el).html(this.template({
					model : this.model
				}));
				return this;
			},
			
			setLoggerID : function(loggerId){
				if(loggerId){
					this.loggerId = loggerId;
					this.loadMiniProfile();
				}
			},
			
			getLoggerID : function(){
				return this.loggerId;
			},
			
			loadMiniProfile : function(){
				var _this = this;
				$.ajax({
					type : "GET",
					url : SERVER_URL + 'services/user/miniprofile/' + this.loggerId + "?ts="+(new Date().getTime()),
					dataType: "json",
					headers: {
							"Accept": "application/json",
							"Content-Type" : "application/json; charset=utf-8",
							"auth-token" : $.cookie("auth-token")
						},
						success: function(result) {
							if(result.success){
								_this.model.set(result.data);
								_this.render();
								
								var imageURL = localStorage.userImageUrl;
								var gender = localStorage.gender;
								if(localStorage.userId == localStorage.contextOf){
									
									if(!EL_APP.firstLogin){
										_this.getNewInvitations();
									}
									
									imageURL = _this.model.get("profileImageUrl");
									gender = _this.model.get("gender");
								}
								
								//Set user image on right top panel
								if(imageURL && imageURL!="null"){
									imageURL = getProfileImagePath(imageURL);
								} else {
									imageURL = "resources/images/img_" + (gender == "MALE" ? "male" : "female") + ".png";
								}
								$(".user_image_top_panel").find("img").attr("src", imageURL);
									
//									$(".acc_read_only_profile_image").attr("src", imageURL);
								
							} else {
								showMessageBox("Failed to load mini profile.");
							}
						},
						error: function(){
							showMessageBox("Failed to connect to server.");
						}	
				});
			},
			
			showMiniProfilePopup : function(event) {
				
				//alert("TODO : Details for logger ''");
				$( "#user_miniprofile" ).dialog( "open" );
				$(".ui-dialog-titlebar").hide();
				this.userDetailsView = new UserDetailsView({
					el : "#user_miniprofile"
				});
				
				this.userDetailsView.bind("close", function(){
					$("#user_miniprofile").dialog("close");
					this.getNewInvitations();
				}, this);
			},
			
			showNotificationBatch : function(){
				$(this.el).find(".self").show();
			},
			
			hideNotificationBatch : function(){
				$(this.el).find(".self").hide();
			},
			
			getNewInvitations : function(){
				var _this = this;
				$.ajax({
					type: "GET",
					url : SERVER_URL + "services/user/getInvite/" + localStorage.userId+ "?ts="+(new Date().getTime()),
					dataType: "json",
					headers: {
							"Accept": "application/json",
							"Content-Type" : "application/json; charset=utf-8",
							"auth-token" : $.cookie("auth-token")
						},
					success: function(result) {
						if(result.success){
							var invitations = result.data;
							if(invitations.length > 0){
								//Show miniprofile batch count
								_this.showNotificationBatch();
								
								//open profile popup on login
								if(_this.showInvitationsPopup){
									_this.showMiniProfilePopup();
									_this.showInvitationsPopup = false;
								}
							} else {
								_this.hideNotificationBatch();
							}
						}
					},
					error: function(){
					}
				});
			},
			
			uploadProfilePic : function(event){
				event.stopPropagation();

				$("#profile_photo_dialog").dialog("open");
				/* set profile photo upload details */
				EL_APP.uploadPhotoDialog.setUserDTO(this.model.toJSON());
				
				EL_APP.uploadPhotoDialog.unbind("picUpload");
				
				EL_APP.uploadPhotoDialog.bind("picUpload", function(newImageURL){
					$(this.el).find(".edit_img").remove();
					
					var imageFullPath = getProfileImagePath(newImageURL);
					$(this.el).find(".logger_pic img").attr("src", imageFullPath);
					$(".user_image_top_panel").find("img").attr("src", imageFullPath);
				},this);
			}
		});
		return MiniProfileView;
	});
