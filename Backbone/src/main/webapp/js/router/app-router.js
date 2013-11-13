define(['backbone', 'view/about-view', 'view/samples-view'],
function (Backbone, AboutView, SamplesView) {
    
    var AppRouter = Backbone.Router.extend({

        initialize: function() {
            Backbone.history.start(/*{pushState: true, root: "#"}*/);
        },

        routes:{
            '': 'home',
            'home': 'home',
            'about': 'about'
        },

        home:function () {
            new SamplesView({ root: $('#main_container') });
        },
        about:function () {
            new AboutView({ root: $('#main_container') });
        }
        
    });

    return AppRouter;

});