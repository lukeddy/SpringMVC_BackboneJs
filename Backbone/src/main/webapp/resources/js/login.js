// Set the require.js configuration for your application.
require.config({

    shim: {
        'underscore': {
            exports: '_'
        },
        'underscore-string': {
            deps: [
                'underscore'
            ]
        },
        'handlebars-orig': {
            exports: 'Handlebars'
        },
        'backbone': {
            deps: [
                'underscore',
                'underscore-string',
                'jquery'
            ],
            exports: 'Backbone'
        },
        'backbone-datagrid': {
            deps: [
                'backbone'
            ],
            exports: 'Backbone.Datagrid'
        },
        'backbone-paginator': {
            deps: [
                'backbone'
            ],
            exports: 'Backbone.Paginator'
        },
        'bootstrap': {
            deps: [
                'jquery'
            ]
        },
        'backbone-associations': {
            deps: [
                'backbone'
            ]
        },
        'keymaster': {
            exports: 'key'
        },
        'async': {
            exports: 'async'
        }
    },

    // Libraries
    paths: {
        jquery: 'lib/jquery',
        underscore: 'lib/underscore',
        'underscore-string': 'lib/underscore-string',
        backbone: 'lib/backbone',
        jqueryui : 'lib/jquery-ui-1.8.19.custom.min',
        resthub: 'lib/resthub/resthub',
        order : 'lib/order',
        validator : 'lib/jquery.validate.min',
        text: 'lib/text',
        i18n: 'lib/i18n',
        'bootstrap': 'lib/bootstrap',
        'backbone-validation-orig': 'lib/backbone-validation',
        'backbone-validation': 'lib/resthub/backbone-validation-ext',
        'handlebars-orig': 'lib/handlebars',
        'handlebars': 'lib/resthub/handlebars-helpers',
        'backbone-queryparams': 'lib/backbone-queryparams',
        'backbone-datagrid': 'lib/backbone-datagrid',
        'backbone-paginator': 'lib/backbone-paginator',
        'backbone-associations': 'lib/backbone-associations',
        'backbone-localstorage': 'lib/backbone-localstorage',
        async: 'lib/async',
        keymaster: 'lib/keymaster',
        hbs: 'lib/resthub/require-handlebars',
        moment: 'lib/moment',
        template: '../template',
		json2: 'lib/json2',
        console: 'lib/resthub/console'
        
    }
});

// Load our app module and pass it to our definition function
require(['jquery','order!jqueryui','order!validator', 'underscore','backbone','model/task', 'collection/tasks', 'view/tasks-view','order!validator'],function($,ui,validator,_,Backbone,Task, Tasks, TasksView){
	
	/*Reset form*/
	$("#signupForm").each(function(){this.reset();});
	
	//Sign form validation
	$("#signinForm").validate({
		rules : {
			username : "required",
			password : "required"
		}
	});
	
	
	//SignIn button handler
	$(".signin_button").click(function(){
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
							$(".signin_button").focus();
						}
					},
			"json");
			
			return false;
		}
		

	});
	
	
	function onLoginSuccess(result){
		doPMLogin(result, $("#keepMeAlive").attr("checked"));
	}
	
	
});