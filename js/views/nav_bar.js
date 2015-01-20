//Nav bar.
define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'js/views/sign_up.js',
  'text!/templates/user_nav.html',
  'text!/templates/public_nav.html',
  'js/models/user.js',
  'js/views/form.js'
], function($, _, Backbone, bootstrap, SignUpView, userNavTemplate, publicNavTemplate, User, FormView) {
  var NavBarView = Backbone.View.extend({

    events: {
      "submit .login": "logInUser",
      "click #registerLink": "showRegisterModal",
      "click #logout": "logOutUser",
      "click .pageLink": "setFocusOnH1"
    },
    
    //div.
    el:  $("#optionalNav"),

    setFocusOnH1: function() {

      setTimeout(function() {
        $("h1:first").attr('tabindex', '-1').focus();
      }, 1500);
    },

    render: function() {
      var navBar = this;
      if (typeof(App.user) != "undefined") {
        navBar.model = new User(App.user);
        var compiledTemplate = _.template(userNavTemplate)({user: App.user});
      } else {
        var compiledTemplate = _.template(publicNavTemplate);
      }
      navBar.$el.html(compiledTemplate);
      return navBar;
    },
    
    logInUser: function(e) {
      var navbar = this;
      e.preventDefault();
      var submitForm = $(e.currentTarget);
      $.post($(submitForm).attr("action"), {username: $("#username").val(), password: $("#password").val()}, function(data) {
        if (data) {
          if (typeof(data.message) != "undefined") {
            alert(data.message);
          } else {
            App.user = new User(data);
            navbar.render();
            $("#homePageWelcome").hide();
          }
        }
      });
    },

    logOutUser: function(e) {
      var navbar = this;
      e.preventDefault();
      $.get("/logout", function(data) {
        if(data == "logout successful") {
          delete App.user;
          navbar.render();
          var formView = new FormView();
          formView.render();
        }
      });
    },

    showRegisterModal: function(e) {
      e.preventDefault();
      var navBar = this;
      var signUpView = new SignUpView();
      signUpView.render();
      $("#mmlcModal").modal('show');
      $("#mmlcModal").on('hidden.bs.modal', function (e) {
        navBar.render();
      });
    }
    
  });
  return NavBarView;
});
