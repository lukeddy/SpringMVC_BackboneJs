require.config({
	paths : {
		jquery : 'lib/jquery/jquery-1.8.3.min',
		jquerycookie : 'lib/jquery/jquery-cookie',
		jqueryui : 'lib/jquery-ui/jquery-ui-1.8.19.custom.min',
		jquerydateDropDowns : 'lib/jquery/jquery.dateDropDowns',
		validator : 'lib/jquery/jquery.validate.min',
		order : 'lib/require/order',
		underscore : 'lib/underscore/underscore-min',
		backbone : 'lib/backbone/backbone-optamd3-min',
		text : 'lib/require/text',
		jqueryMouseWheel : 'lib/jquery/jquery.mousewheel.min',
		jqueryCustomScroll : 'lib/jquery/jquery.mCustomScrollbar',
		bannerRotator : 'lib/jquery/slides.min.jquery',
		projectManagementCommon: 'projectManagementCommon'
	}
 });


require(['jquery','order!jqueryui', 'order!jquerycookie', 'order!validator', 'order!jquerydateDropDowns', 
         'order!order!bannerRotator','order!order!jqueryMouseWheel', 'order!order!jqueryCustomScroll', 'projectManagementCommon'],
         
		function($,ui, cookie, validator, jquerydateDropDowns,
				Rotator, jqueryMouseWheel, jqueryCustomScroll, projectManagementCommon) {
		
		// Image Rotator 
		$('#slides').slides({
			preload: true,
			preloadImage: 'img/loading.gif',
			play: 5000,
			pause: 2500,
			hoverPause: true,
			effect: 'fade',
			animationStart: function(current){
				$('.caption').animate({
					/*bottom:-35*/
				},100);
				if (window.console && console.log) {
				};
			},
			animationComplete: function(current){
//				$('.caption').animate({
//					bottom:0
//				},200);
				/*$('.caption').fadeIn('slow');*/
				if (window.console && console.log) {
				};
			},
			slidesLoaded: function() {
				$('.caption').animate({
					bottom:0
				},200);
			}
		});	
	 	
		//Toggle form label text
	 	$(".form_table input[type=text], .form_table input[type=password], .login input[type=text], .login input[type=password]").focus(function(){
			$(this).prev(".show_hide").css("visibility", "hidden");
		});
	
		$(".form_table input[type=text], .form_table input[type=password], .login input[type=text], .login input[type=password]").focusout(function(){
			if($(this).val() == ""){
				$(this).prev(".show_hide").css("visibility", "visible");
			}
		});

		if( $(".login input[name=username]").val() || $(".login input[name=password]").val() ){
			$(".login input[name=username]").prev(".show_hide").css("visibility", "hidden");
			$(".login input[name=password]").prev(".show_hide").css("visibility", "hidden");
	 	}
		
		/*Reset form*/
		$("#signupForm").each(function(){this.reset();});
		
		$(".show_hide").click(function(){
			$(this).next().focus();
		});
		
	
		//Disable copy paste in confirm password field
		function disableControlV(element) {
			$(element).bind("paste", function(e) {
				return false;
			});
		}

		function disableContextMenu(element) {
			$(element).bind("contextmenu", function(e) {
				return false;
			});
		}
		
		disableControlV($("#signupForm").find("input[name=confPassword]"));
		disableContextMenu($("#signupForm").find("input[name=confPassword]"));
			
			
		//Sign form validation
		$("#signinForm").validate({
			rules : {
				username : "required",
				password : "required"
			}
		});
		
		//SignIn button handler
		$("#signin_button").click(function(){
			if($("#signinForm").valid()){
				var username = $("#username").val();
				var password = $("#password").val();
				
				var loginToken = {};
				loginToken.userName = username;
				loginToken.password = password;
				loginToken.flag = 0;
	
				$.post(SERVER_URL+'services/user/login',
						loginToken,
						function(result) {
							if(result.success){
								onLoginSuccess(result.data);
							} else {
								showMessageBox(result.errorString);
								$("#username").val("");
								$("#password").val("");
								$("#username").blur();
								$("#password").blur();
								$("#signin_button").focus();
							}
						},
				"json");
				
				return false;
			}
			

		});
		
		
		/* Log Details popup - [START] */
		$("#log_detail").dialog({
			autoOpen : false,
			resizable : false,
			width : 750,
			height : 600,
			modal:true,
			closeOnEscape: false,
			close : function() {
				//Remove overlay div to enable body
				$("body").css("overflow", "auto");
			}
		});
		/* Log Details popup - [END] */
		
		/*
		 * Forgot password
		 * 
		 * */
		$("#forgot_password").dialog({
			autoOpen: false,
			resizable: false,
			width: 345,
			height: 277,
			modal: true,
			close : function() {
				$("body").css("overflow", "auto");
			}
		});
		$("#forgotPassword").click(function(){
			$("body").css("overflow", "hidden");
			$("#forgot_password").dialog("open");
			$(".ui-dialog-titlebar").hide();
			return false;
		});
		/*var forgotPassword = new ForgotPasswordView({
			el : $("#forgot_password")
		});*/
		/*forgotPassword.bind("close",function(){
			$("#forgot_password").dialog("close");
		});*/
		
		/*
		 *  Date drop-down
		 *  	loop to add days 1-31
		 *  	loop to add year
		 *  	checkLinkedDays :: To check range of days in a month
		 *  */
		for(var i = 1; i <= 31; i++){$("#selectedDay").append("<option value='"+ i +"'>"+ i +"</option>");}
		endYear = new Date().getFullYear();
		var startYear = endYear - 100;
		for(var i = endYear; i >= startYear; i--){$("#selectedYear").append("<option value='"+ i +"'>"+ i +"</option>");}

		function checkLinkedDays() { 
			var month = $('#selectedMonth').val() == "-1" ? 1 : parseInt($('#selectedMonth').val());
			var year = $('#selectedYear').val() == "-1" ? new Date().getFullYear() : parseInt($('#selectedYear').val());
		    var daysInMonth = $.datepick.daysInMonth(year, month);		    
		    
		    $('#selectedDay option:gt(27)').attr('disabled', false);
		    $('#selectedDay option:gt(' + (daysInMonth) +')').attr('disabled', true);
		    if ($('#selectedDay').val() > daysInMonth) { 
		        $('#selectedDay').val(daysInMonth); 
		    } 
		}
		$('#date_dropDown').datepick({
			dateFormat: 'yyyy-mm-dd',
		    onSelect: function updateSelected(dateText) {
		        checkLinkedDays(); // Disable invalid days 
			}
		}); 
		 
		// Update datepicker from three select controls 
		$('#selectedMonth,#selectedDay,#selectedYear').change(function() {			
		    $('#date_dropDown').datepick('setDate', new Date( 
		        $('#selectedYear').val(), $('#selectedMonth').val() -1, 
		        $('#selectedDay').val())); 
		});
		
		
		//toggle between gender
		$("#male_option").click(function(){
			 if($(this).attr("checked")){
				 $("#female_option").removeAttr("checked");
			 } else {
				 $("#female_option").attr("checked", "checked");
			 }
		});

		$("#female_option").click(function(){
			if($(this).attr("checked")){
				 $("#male_option").removeAttr("checked");
			 } else {
				 $("#male_option").attr("checked", "checked");
			 }
		});
		
		function getGenderValue(){
			if($("#female_option").attr("checked")) {
				return $("#female_option").attr("value");
			} else if($("#male_option").attr("checked")) {
				return $("#male_option").attr("value");
			} else {
				return "";
			}
		}
		//SignUp form validation
		$.validator.addMethod("accept", function(value, element, param) {
		    return value.match(new RegExp("^" + param + "$"));
		});
		
		$("#signupForm").validate({
			  rules: {
				   firstName: {
				       required: true,
				       accept: "[a-zA-Z]+",
				       minlength: 2,
				       maxlength: 20
				   },
				   lastName: {
				       required: true,
				       accept: "[a-zA-Z]+",
				       minlength: 2,
				       maxlength: 20
				   },
				   emailAddress: {
				       required: true,
				       email: true,
				       minlength: 5,
				       maxlength: 50
				   },
				   confEmailAddress: {
					   equalTo: "input[name='emailAddress']"
				   },
				   password: {
				       required: true,
				       minlength: 6,
				       maxlength: 20
				   },				   
				   zipCode: {
				       minlength: 5,
				       maxlength: 10,
				       accept: "[0-9]+"
				   }
			   }/*,
			   invalidHandler: function(form, validator) {
				      var errors = validator.numberOfInvalids();
				      if (errors) {
				        var message = (errors == 1)
				          ? 'You missed 1 field. It has been highlighted'
				          : 'You missed ' + errors + ' fields. They have been highlighted';
//				        showMessageBox(message);
				      }
				    }*/
			});
		
		function doSignUp(){
			var signupForm = $("#signupForm");
			if(signupForm.valid()){
				//Submit form
				var firstNameVal = signupForm.find("input[name=firstName]").val();
				var lastNameVal = signupForm.find("input[name=lastName]").val();
				var emailAddressVal = signupForm.find("input[name=emailAddress]").val();
				var passwordVal = signupForm.find("input[name=password]").val();
				var zipCodeVal = signupForm.find("input[name=zipCode]").val();
				var gender = getGenderValue();
				var dateOfBirth = signupForm.find("input[name=birthday]").val();
				
				var newUserJson = {
					firstName : firstNameVal,
					lastName : lastNameVal,
					emailAddress : emailAddressVal,
					password : passwordVal,
					userName : emailAddressVal,
					gender: gender,
					zipCode : zipCodeVal,
					dateOfBirth : dateOfBirth
				};

				$(".signup_button").attr('disabled','disabled');
				$.ajax({
					url : SERVER_URL+'services/user/register',
					type : "PUT",
					data :  JSON.stringify(newUserJson),
					contentType : "application/json",
					dataType : "json",
					success : function(result) {
						if(result.success){
//							showMessageBox("User "+result.data.userName+" created successfully!");	
							
							showMessageBox("Thanks for registering with Everylog! A verification email has been sent to your email address. Please check your spam folder if you don't see it in the next few minutes.<br/> If it's in your spam folder, please add registration@everylog.com to your address book. Prepare to Log!", true);	
							$("#signupForm").each(function(){this.reset();});
							
							//onLoginSuccess(result.data);
						} else {
							showMessageBox(result.errorString);
						}
						$(".signup_button").removeAttr('disabled');
					},
					error : function() {
						$(".signup_button").removeAttr('disabled');
					}
				});
			}
		}
		//SignUp button handler
		$(".signup_button").click(function(){
			var signupForm = $("#signupForm");
			if(!signupForm.valid()){
				showMessageBox("Please fill in all the fields marked in red.");
				return false;
			}
			
			/*if(!$("#tandc").attr("checked")){
				showMessageBox("Please accept Terms & Conditions.");
				return false;
			}*/ // Due to new Signup form
			
			// TEMP : date validations are temp.
			if( $("#selectedMonth option:selected").val() < 0 || $("#selectedDay option:selected").val() < 0 || $("#selectedYear option:selected").val() < 0 ){
				showMessageBox("Birthday is required.");
				return false;
			}

			
			if(getGenderValue().length == 0){
				showMessageBox('Please complete the "Gender" field.');
				$("#female_option").focus();
				return false;
			}
			
			var birthday = new Date(signupForm.find("input[name=birthday]").val().replace(/-/g, "/") + " 01:00:00");
			if( birthday > new Date() ){				
				showMessageBox(" Invalid birthdate. ");
				return false;
			} 
			 
			var tempBirthday = new Date(signupForm.find("input[name=birthday]").val().replace(/-/g, "/") + " 01:00:00");
			if( birthday.setFullYear( birthday.getFullYear() + 14 ) > new Date() )
			{
				showMessageBox(" Sorry! <br/> You must be at least 14 years of age to join Everylog ");
				return false;
			}else if( tempBirthday.setFullYear( tempBirthday.getFullYear() + 18 ) > new Date() ){
				showAgreeBox(doSignUp);
				return false;
			}
			
			doSignUp();
			
		});
		
		function onLoginSuccess(result){
			doElLogin(result, $("#keepMeAlive").attr("checked"));
		}
		
});

