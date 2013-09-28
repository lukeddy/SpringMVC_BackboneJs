define([ 'jquery', 'underscore', 'backbone', 'views/tabsView', 'views/userDetailsReadOnlyView', 
         'views/lazyListView', 'views/userInvitationView', 'text!templates/userDetailsTpl.html' ],
		function($, _, Backbone, TabsView, userDetailsReadOnlyView, 
				LazyListView, UserInvitationView, userDetailsTemplate) {
			var UserDetailsView = Backbone.View.extend({
				
				template : _.template(userDetailsTemplate),
				events : {
					"click .ico_quit" : "close",
					"click .join_all" : "joinAllLog",
					"click .ignore_all" : "ignoreAllInvitation"
				},

				initialize : function() {
					this.userId = localStorage.userId;
					this.render();
				},
				
				render : function() {
					$(this.el).html(this.template());

					if(this.userId == localStorage.contextOf){
						this.hiddenTab = false;
					}else{
						this.defaultActiveTab = 1;
						this.hidden = true;
						this.userId = localStorage.contextOf;
						this.hiddenTab = true;
					}
					
					this.tabs = new TabsView({
						el : $(this.el).find(".tab_container"),
						config : {
							tabType : "icons",
							defaultActiveTab : this.defaultActiveTab,
							tabs : [ {
								icon : "tab_question",
								target : "questions_container",
								title : "Invites",
								hidden : this.hiddenTab 
							}, {
								icon : "tab_profile",
								target : "miniprofile_container",
								title : "Profile",
								hidden : this.hiddenTab
							}]
						}
					});
					this.tabs.bind("tabSelected",function(tabId){
						var _this = this;
						if(tabId == "miniprofile_container"){
							this.userDetailsReadOnly.getInfo(_this.userId);
							this.userDetailsReadOnly.updateScrollBar();
						}
					},this);
					
					this.userDetailsReadOnly = new userDetailsReadOnlyView({
						el : $(this.el).find("#miniprofile_container"),
						user : this.userId
					});
					
					this.invitationList = new LazyListView({
						el: $(this.el).find("#invitation_list_wrapper"),
						url: SERVER_URL + "services/user/getInvite/" + this.userId,
						itemView: UserInvitationView,
						listenAndInvokeItemEvents : "requestResponseResult"
					});
					this.invitationList.loadData(true);
					this.noInivitationMessage();
					var _this = this;
					this.invitationList.bind("requestResponseResult", function(){
						_this.invitationList.loadData(true);
						_this.noInivitationMessage();
					});
					return this;
				},
				
				joinAllLog : function(){
					this.respondInvitation("join");
				},
				
				ignoreAllInvitation : function(){
					this.respondInvitation("ignore");
				},
				
				respondInvitation : function(type){
					var joinFlag = false;
					if(type=="join"){
						joinFlag = true;
					}

					var _this = this;
					$.ajax({
						type : "POST",
						url : SERVER_URL + "services/log/inivitation/respond?userId=" +  this.userId 
								+ "&logId=" + ""
								+ "&response=" + joinFlag,
						dataType: "json",
						headers: {
								"Accept": "application/json",
								"Content-Type" : "application/json; charset=utf-8",
								"auth-token" : $.cookie("auth-token")
							},
							success: function(result) {
								if(result.success){
									_this.invitationList.loadData(true);
									_this.noInivitationMessage();
									EL_APP.miniProfile.loadMiniProfile();
								} else {
									console.log("some error has occurred");
								}
							},
							error: function(){
								showMessageBox("Failed to connect to server.");
							}	
					});
				},
				
				close : function(){
					this.trigger("close");
				},
				
				getContextOf : function(){
					return this.options.contextOf;
				},
				
				noInivitationMessage : function(){
					this.invitationList.bind("onLoad", function(){
						if(this.invitationList.getCollection().length == 0){
							$(this.el).find("#invitation_list_wrapper").html("<div class='no_invites'>You currently have no invites to join other Logs</div>");
						}
					},this);
				}
			});
			return UserDetailsView;
		});
