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
      this.model.save({
        title: this.$('.title-field').val(),
        description: this.$('.desc-field').val(),
      });
      return false;
    },
    cancel: function() {
      this.model.destroy();
      this.model.trigger('change');
    },
    
    _delete: function() {
      this.model.destroy();
      return false;
    }
 
 });

  return TaskFormView;

});
