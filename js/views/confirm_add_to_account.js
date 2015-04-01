//Sign Up View.
define([
  'jquery',
  'underscore',
  'backbone',
  'text!/templates/add_to_account.html'
], function($, _, Backbone, addToAccountTemplate) {
  var ConfirmAddToAccountView = Backbone.View.extend({

    events: {
      "click .yes": "addToAccount"
    },

    //div.
    el:  $("#mmlcModal"),
    
    render: function() {
      var compiledTemplate = _.template(addToAccountTemplate);
      this.$("#mmlcModalBody").html(compiledTemplate);
      this.$("#mmlcModalLabel").html("Save Conversion?");
      return this;
    },

    addToAccount: function(e) {
      e.preventDefault();
      App.router.mainContentView.currentView.model.save({"access_token": App.user.get("access_token")}, {
        success: function(model, response, options) {
          App.router.mainContentView.currentView.$(".alert").html("This conversion has been saved to your account.");
          App.router.mainContentView.currentView.$(".alert").show();
          App.router.mainContentView.currentView.$(".alert").attr('tabindex', '-1').focus();
        }
      });  
      $("#mmlcModal").modal('hide');
    }
    
  });
  return ConfirmAddToAccountView;
});
