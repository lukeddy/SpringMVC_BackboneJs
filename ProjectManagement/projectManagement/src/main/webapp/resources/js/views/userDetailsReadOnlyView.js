define([ 'jquery', 'underscore', 'backbone',
		'text!templates/userDetailsReadOnlyTpl.html' ], function($, _,
		Backbone, userDetailsReadOnlyTpl) {
	var UserDetailsReadOnlyView = Backbone.View.extend({

		template : _.template(userDetailsReadOnlyTpl),
		events : {
			
		},

		initialize : function() {
//			console.log("view info of ==" + EL_APP.miniProfile.getLoggerID() );
			this.render();
			this.getInfo(EL_APP.miniProfile.getLoggerID());
		},

		render : function() {
			$(this.el).html(this.template({
				userName : localStorage.userName
			}));
			return this;
		},
		getInfo : function(user){
			var _this = this;
			$.ajax({
				type : "GET",
				url	: SERVER_URL + "services/user/getInfo/" + user + "?ts="+(new Date().getTime()),
				dataType : "json",
				headers : {
					"Accept": "application/json",
					"Content-Type" : "application/json; charset=utf-8",
					"auth-token" : $.cookie("auth-token")
				},
				success: function(result) {
					if(result.success){
						//console.log(result.data);
						_this.setInfo(result.data);
					} else {
//						console.log("some error has occurred");
					}
				},
				error: function(){
					showMessageBox("Failed to connect to server.");
				},
				complete: function(){
//					console.log("complete function is called now");
				}
			});
		},
		setInfo : function(data){
			//console.log(data);
			
			this.setProfileImage(data.userInfo);
			$(this.el).find("div.name").html(data.userInfo.firstName + " " + data.userInfo.lastName);
			$(this.el).find("#logs").html(data.userInfo.logCount);
			$(this.el).find("#leader").html(data.userInfo.participatedLogCount);
			$(this.el).find("#results").html(data.userInfo.resultCount);

			city = data.userInfo.city == "" ? data.userInfo.city : data.userInfo.city + ",";
			
			$(this.el).find("#location").html(city + data.userInfo.state);

			
			if(data.userInfo.loggersBio){
				var loggerBio = "<div id='loggerBioScroll' style='overflow: auto;text-align: justify'>"+data.userInfo.loggersBio.replace(/\n/g,"<br>")+"</div>";
				$(this.el).find("#loggerBio").html(loggerBio); 
			}else{
				$(this.el).find("#loggerBio").html(data.userInfo.loggersBio);	
			}
			
			$(this.el).find("#loggerBioScroll").mCustomScrollbar({
				scrollInertia : 0
			});
			
			
			$(this.el).find("#favLogs").html(data.favoriteLogCount);
			$(this.el).find("#favLoggers").html(data.favoriteLoggerCount);
			
			for(Logs in data.userLogs){
				if(data.logMostProudOf == data.userLogs[Logs].logId){
					var logMostProudOf = "<div class='legend_dot' style='background-color: "+ data.userLogs[Logs].logColor +" '></div>"+data.userLogs[Logs].logName;
					$(this.el).find("#logProudOf").html(logMostProudOf);
				}
			}
		},
		
		setProfileImage : function(userJSON){
			if(userJSON.profileImageUrl){
				$(this.el).find(".acc_read_only_profile_image").attr("src", getProfileImagePath(userJSON.profileImageUrl));
			} else {
				$(this.el).find(".acc_read_only_profile_image").attr("src", "resources/images/img_" + (userJSON.gender == "MALE" ? "male" : "female") + ".png");
			}
		},
		updateScrollBar: function(){
			$(this.el).find("#loggerBioScroll").mCustomScrollbar("update");
		}
	});
	return UserDetailsReadOnlyView;
});
