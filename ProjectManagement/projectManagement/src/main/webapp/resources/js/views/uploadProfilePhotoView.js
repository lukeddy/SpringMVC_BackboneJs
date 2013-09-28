define([ 'jquery','order!jqueryui', 'underscore', 'backbone','text!templates/uploadProfilePhotoTpl.html','spin'],
		function($,ui, _, Backbone, UploadPhotoTpl,Spinner) {
	var UploadPhotoView = Backbone.View.extend({

		template : _.template(UploadPhotoTpl),
		events : {
			"click .ico_quit": "close",
			"click .photo_upload_btn": "upload",
			"click .cancel_button": "cancel",
			"click .done_button": "assignImageToUser"
		},

		initialize : function() {
			this.userId = "";
			this.imageURL = "";
			this.imgRepositionTop = 0;
			
			_.extend(this, Backbone.Events);
			this.render();
		},

		render : function() {
			$(this.el).html(this.template());
			
			var _this = this;
			//_this.showSpinner();
			$(this.el).find(".img_preview").draggable({
				axis: "y",
				//cursor: "move",
				start : function(event, ui){
					var imgH = $(this).height();
					var parentH = $(this).parent("div.user_image_preview").height();
					
					if(imgH <= parentH){
						return false;
					}
				},
				stop : function(event, ui){
					var imgTop = ui.position.top;
					_this.imgRepositionTop = -1 * imgTop;
					
					if(imgTop > 0){
						$(this).css({top:0, left:0}); //Set to top
						_this.imgRepositionTop = 0;
					}
					
					var imgH = $(this).height();
					var parentH = $(this).parent("div.user_image_preview").height();
					
					if(-1 * imgTop > (imgH - parentH)){
						$(this).css({top: -1 * (imgH - parentH), left:0}); //Set to bottom
						_this.imgRepositionTop = imgH - parentH;
					}
				}
			});
			$(this.el).find( ".img_preview" ).css({top:0, left:0});
			
			
			$('#photoimg').bind('change', function(){
				$(_this.el).find( ".img_preview" ).css({top:0, left:0});
				_this.uploadImg();
				/*$("#profilePhotoUploadForm").ajaxForm(function(response) {
					var resJSON = eval("(" + response + ")");
					if(resJSON.success){
						alert("upload event success");
						$(_this.el).find("img.img_preview").attr("title", "Click and drag to center your photo");
						$(_this.el).find("img.img_preview").css({"cursor": "pointer"});
						
						_this.imageURL = resJSON.data;
						_this.setImageURL(getProfileImagePath(_this.imageURL) + "&nts=" + new Date().getTime());
						$(_this.el).find(".action_button_holder").show();
						$(_this.el).find(".choose_button_holder").hide();
					} else {
						showMessageBox(resJSON.errorString);
						$(_this.el).find(".action_button_holder").hide();
						$(_this.el).find(".choose_button_holder").show();
					}
	            }).submit();*/
			});
									
			return this;
		},
		
		uploadImg: function(){
			var _this = this;
			_this.showSpinner();
			$("#profilePhotoUploadForm").ajaxForm(function(response) {
				var resJSON = eval("(" + response + ")");
				if(resJSON.success){
					$(_this.el).find( "#spinnerText" ).css({"display":"none"});
					$(_this.el).find( "#spinner" ).css({"display":"none"});
					$(_this.el).find("img.img_preview").css({"opacity": "1"});
					
					$(_this.el).find("img.img_preview").attr("title", "Click and drag to center your photo");
					$(_this.el).find("img.img_preview").css({"cursor": "pointer"});
					
					_this.imageURL = resJSON.data;
					_this.setImageURL(getProfileImagePath(_this.imageURL) + "&nts=" + new Date().getTime());
					$(_this.el).find(".action_button_holder").show();
					$(_this.el).find(".choose_button_holder").hide();
				} else {
					showMessageBox(resJSON.errorString);
					$(_this.el).find( "#spinnerText" ).css({"display":"none"});
					$(_this.el).find( "#spinner" ).css({"display":"none"});
					$(_this.el).find("img.img_preview").css({"opacity": "1"});
					
					$(_this.el).find(".action_button_holder").hide();
					$(_this.el).find(".choose_button_holder").show();
				}
            }).submit();	
		},
		
		showSpinner: function(){ 
			var _this = this;
			$(_this.el).find("img.img_preview").css({"opacity": "0.4"});
			$(_this.el).find( "#spinnerText" ).css({"position":"relative","left":"157px","top":"-70px","display":"block","width":"70px","color":"black"});
			$(_this.el).find( "#spinner" ).css({"position":"relative","left":"185px","top":"-94px","display":"block","width":"79px"});
			/*$(_this.el).find( "#spinner" ).krutilka({
				size: 32, 
				petals: 15,
				petalWidth: 2, 
				petalLength: 8,
				petalOffset: 1, 
				time: 1000, 
				color: '#801180', 
				background: 'none' 
			});*/
			
			var opts = {
					  lines: 13, // The number of lines to draw
					  length: 7, // The length of each line
					  width: 4, // The line thickness
					  radius: 10, // The radius of the inner circle
					  rotate: 0, // The rotation offset
					  color: '#000', // #rgb or #rrggbb
					  speed: 1, // Rounds per second
					  trail: 60, // Afterglow percentage
					  shadow: false, // Whether to render a shadow
					  hwaccel: false, // Whether to use hardware acceleration
					  className: 'spinner', // The CSS class to assign to the spinner
					  zIndex: 2e9, // The z-index (defaults to 2000000000)
					  top: 'auto', // Top position relative to parent in px
					  left: 'auto' // Left position relative to parent in px
					};
					var spinner = new Spinner(opts).spin();
					$(_this.el).find( "#spinner" ).append(spinner.el);
		},
		
		assignImageToUser: function(){
			var img = $(this.el).find("img.img_preview");
			var imgParent = $(this.el).find("div.user_image_preview");
			var imgX = 0;
			var imgY = this.imgRepositionTop;
			var imgH = img.height() < imgParent.height() ? img.height() : imgParent.height();
			var imgW = img.width() < imgParent.width() ? img.width() : imgParent.width();
			
			var _this = this;
			$.ajax({
				url : SERVER_URL+'services/user/setUserImage?userId='+this.userId+'&imageURL='+this.imageURL+"&x=" + imgX + "&y=" + imgY+ "&height=" + imgH+ "&width=" + imgW,
				type : "PUT",
				contentType : "application/json",
				dataType : "json",
				success : function(result) {
					if(result.success){
						clearCachedProfilePhoto();
						_this.trigger("picUpload", _this.userId+".jpg");	
						_this.close();
					} else {
						showMessageBox(result.errorString);
					}
				},
				error : function() {
					showMessageBox("Failed to assign image to user.");
				}
			});
		},
		
		setURL: function(userId){
			this.userId = userId;
//			$("#profilePhotoUploadForm").attr("action", "resources/profilePhotoUpload.jsp?userId="+ this.userId);
			$("#profilePhotoUploadForm").attr("action", SERVER_URL+"services/image/uploadIMG?userId="+ this.userId + "&mode=1");
		},
		
		setImageURL: function(imageUrl){
			$(this.el).find(".user_image_preview img").attr("src", imageUrl);
		},
		
		setUserDTO: function(userJSON){
			this.setURL(userJSON.id);
			
			if(userJSON.profileImageUrl){
				this.imageURL = userJSON.profileImageUrl;
				this.setImageURL(getProfileImagePath(this.imageURL));
			} else {
				this.setImageURL("resources/images/legend_dot_white.png");//"resources/images/img_" + (userJSON.gender == "MALE" ? "male" : "female") + ".png");
			}
			
			$(this.el).find(".action_button_holder").hide();
			$(this.el).find(".choose_button_holder").show();
			
			this.imgRepositionTop = 0;
			$(this.el).find( ".img_preview" ).css({top:0, left:0});
			$(this.el).find("img.img_preview").attr("title", "");
			$(this.el).find("img.img_preview").css({"cursor": "default"});
			$("#elImageUploadForm").get(0).reset();
		},
		
		setUserDetails: function(userId, imageUrl){
			if(userId){
				this.setURL(userId);
			}
			
			if(imageUrl){
				this.setImageURL(imageUrl);
			}
		},
		
		upload: function(event){
			$('#photoimg').click();
		},
		
		cancel: function(){
			this.resetFileField();
			this.close();
		},
		
		resetFileField: function(){ 
			$("#profilePhotoUploadForm").get(0).reset();
//		    var oldInput = document.getElementById("photoimg"); 
//		     
//		    var newInput = document.createElement("input"); 
//		     
//		    newInput.type = "file"; 
//		    newInput.id = oldInput.id; 
//		    newInput.name = oldInput.name; 
//		    newInput.className = oldInput.className; 
//		    newInput.style.cssText = oldInput.style.cssText; 
//		    // copy any other relevant attributes 
//		     
//		    oldInput.parentNode.replaceChild(newInput, oldInput); 
		},
		
		
		close: function(){
			this.trigger("close");					
		}
	});
	return UploadPhotoView;
});
