//Nav bar.
define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'js/views/sign_up.js',
  'js/models/equation.js',
  'js/models/html5.js',
  'text!/templates/user_nav.html',
  'text!/templates/public_nav.html',
  'js/models/user.js',
  'js/views/form.js',
  'js/views/confirm_add_to_account.js'
], function($, _, Backbone, bootstrap, SignUpView, Equation, Html5, userNavTemplate, publicNavTemplate, User, FormView, ConfirmAddToAccountView) {
  var NavBarView = Backbone.View.extend({

    events: {
      "submit .login": "logInUser",
      "click #registerLink": "showRegisterModal",
      "click #logout": "logOutUser",
      "click .pageLink": "setFocusOnH1"
    },
    
    //div.
    el:  $("#navbar"),

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
        App.user = new User(data);
        $("#access_token").val(App.user.get("access_token"));
        navbar.render();
        navbar.checkForDanglingConversions();
        $("#homePageWelcome").hide();
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        var errResponse = $.parseJSON(jqXHR.responseText);
        var errMsg = errResponse.message ? errResponse.message : jqXHR.responseText;
        alert(errMsg);
      });
    },

    logOutUser: function(e) {
      var navbar = this;
      e.preventDefault();
      $.get("/logout?access_token=" + App.user.get("access_token"), function(data) {
        if(data.message == "logout successful") {
          delete App.user;
          $("#access_token").val("");
          navbar.render();
          App.router.navigate('#/', {trigger: true});
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
        alert("YUP");
        navBar.render();
      });
    },

    checkForDanglingConversions: function() {
      if (App.router.mainContentView.currentView.model instanceof Equation || App.router.mainContentView.currentView.model instanceof Html5) {
        var confirmAddToAccountView = new ConfirmAddToAccountView();
        confirmAddToAccountView.render();
        $("#mmlcModal").modal('show');
      }
    }
    
  });
  return NavBarView;
});
