// Set the require.js configuration for your application.
require.config({
	
	// Libraries
    paths: {
        jquery: 'lib/jquery',
        underscore: 'lib/underscore',
        'underscore-string': 'lib/underscore-string',
        backbone: 'lib/backbone',
        resthub: 'lib/resthub/resthub',
        text: 'lib/text',
        i18n: 'lib/i18n',
        'jquery.bootstrap': 'lib/bootstrap',
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
    },

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
        },
        "jquery.bootstrap": {
            deps: ["jquery"]
        }
    }

    
});

// Load our app module and pass it to our definition function
require(['jquery', 'underscore','backbone','model/task', 'collection/tasks', 'view/tasks-view','jquery.bootstrap'],function($,_,Backbone,Task, Tasks, TasksView){
	
	window.Task = Task;
  	window.tasks = new Tasks();

  	
  	/* Routers and History */
	var routeOnPageLoad = false;
	var AppRouter = Backbone.Router.extend({
		routes : {
			"home" : "home", // #home
	}});
	
	// Instantiate the router
    var app_router = new AppRouter;
    
    app_router.on('route:home', function (id) {
        // Note the variable in the route definition being passed in here

      	var tasksView = new TasksView({collection: tasks});
      	tasks.fetch();
      	
        console.log( "This is router ");   
    });
    app_router.on('route:defaultRoute', function (actions) {
        alert( actions ); 
    });
    
    
    
    // Start Backbone history a neccesary step for bookmarkable URL's
    Backbone.history.start();
    
    //load home view if there is no route present in landing URL
    if(!routeOnPageLoad) {
    	document.location.href='#home';
    }
	
	
	
	
});
