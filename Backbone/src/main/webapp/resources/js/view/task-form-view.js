define(['backbone', 'resthub', 'hbs!template/task-form', 'backbone-validation'], function(Backbone, Resthub, taskFormTemplate) {

  var TaskFormView = Resthub.View.extend({
    template: taskFormTemplate,
    tagName: 'form',
    events: {
      submit: 'save',
      'click .cancel': 'cancel',
      'click .delete': '_delete'
    },
    initialize: function() {
      Backbone.Validation.bind(this);
    },
    save: function() {
      /*this.model.save({
        title: this.$('.title-field').val(),
        description: this.$('.desc-field').val(),
      });*/
      
      var jsonStr = JSON.stringify({
    	  userId:1,
    	  projectId:1,
    	  phase:"Dev/Test",
    	  weekEndDate: new Date().getTime()
      });
		$.ajax({
				type: "PUT",
				url : SERVER_URL+"services/task/add",
				data: jsonStr,
				dataType: "json",
				headers: {
						"Accept": "application/json",
						"Content-Type" : "application/json; charset=utf-8"
						/*"auth-token" : $.cookie("auth-token")*/
					},
				success: function(result) {
					if(result.success){
						
					}
					
				}});
      
      return false;
    },
    cancel: function() {
      this.model.trigger('change');
    },
    
    _delete: function() {
      this.model.destroy();
      return false;
    }
 
 });

  return TaskFormView;

});
