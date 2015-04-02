//Admin View.
define([
  'jquery',
  'underscore',
  'backbone',
  'editable',
  'js/views/equations.js',
  'js/views/pagination.js',
  'js/views/feedback.js',
  'js/views/users.js',
  'js/views/html5_uploads.js',
  'js/collections/admin_equations.js',
  'js/collections/admin_feedback.js',
  'js/collections/admin_users.js',
  'js/collections/admin_html5s.js',
  'text!/templates/admin.html'
], function($, _, Backbone, editable, EquationsView, PaginationView, FeedbackView, UsersView, UploadsView, EquationsCollection, FeedbackCollection, UsersCollection, Html5sCollection, adminTemplate) {
  var AdminView = Backbone.View.extend({

    events: {
      "click .tab": "setFocusOnH2"
    },

    render: function() {
      var compiledTemplate = _.template(adminTemplate)({dashboard: this.model});;
      this.$el.html(compiledTemplate);
      var adminView = this;
      //Add the tab content.
      adminView.addEquations();
      adminView.addFeedback();
      adminView.addUsers();
      adminView.addUploads();
      return this;
    },

    setFocusOnH2: function() {
      setTimeout(function() {
        $("h2:visible:first").attr('tabindex', '-1').focus();
      }, 500);
    },

    addEquations: function() {
      var adminView = this;
      adminView.equations = new EquationsCollection();
      adminView.equations.fetch({
        success: function(collection, response, options) {
          adminView.renderEquations();
          adminView.addPagination(adminView.equations, adminView.$('#equations .pagination'));
          adminView.listenTo(adminView.equations, 'reset', adminView.renderEquations);  
        }
      });
    },

    renderEquations: function() {
      if (this.equationsView) {
        this.equationsView.remove();
      }
      //Add equations.
      this.equationsView = new EquationsView({collection: this.equations});
      this.$("#equations .results").html(this.equationsView.render().el);
      this.equationsView.delegateEvents();
    },

    addFeedback: function() {
      var adminView = this;
      adminView.feedback = new FeedbackCollection();
      adminView.feedback.fetch({
        success: function(collection, response, options) {
          adminView.renderFeedback();
          adminView.addPagination(adminView.feedback, adminView.$('#feedback .pagination'));
          adminView.listenTo(adminView.feedback, 'reset', adminView.renderFeedback);  
        }
      });
    },

    renderFeedback: function() {
      if (this.feedbackView) {
        this.feedbackView.remove();
      }
      this.feedbackView = new FeedbackView({collection: this.feedback});
      this.$("#feedback .results").html(this.feedbackView.render().el);
      this.feedbackView.delegateEvents();
    },

    addUsers: function() {
      var adminView = this;
      adminView.users = new UsersCollection();
      adminView.users.fetch({
        success: function(collection, response, options) {
          adminView.renderUsers();
          adminView.addPagination(adminView.users, adminView.$('#users .pagination'));
          adminView.listenTo(adminView.users, 'reset', adminView.renderUsers);  
        }
      });
    },

    renderUsers: function() {
      var adminView = this;
      if (adminView.usersView) {
        adminView.usersView.remove();
      }
      //Add users
      adminView.usersView = new UsersView({collection: adminView.users});
      adminView.$("#users .results").html(adminView.usersView.render().el);
      adminView.usersView.delegateEvents();
      //Add editables.
      $('.username').editable({
        type: 'text',
        name: 'username',
        label: 'Enter Username',
        success: function(response, newValue) {
          adminView.usersView.collection.get($(this).data("pk")).save({access_token: App.user.get("access_token"), username: newValue});
        }
      });
      $('.firstName').editable({
        type: 'text',
        name: 'firstName',
        label: 'Enter First Name',
        success: function(response, newValue) {
          adminView.usersView.collection.get($(this).data("pk")).save({access_token: App.user.get("access_token"), firstName: newValue});
        }
      });
      $('.lastName').editable({
        type: 'text',
        name: 'lastName',
        label: 'Enter Last Name',
        success: function(response, newValue) {
          adminView.usersView.collection.get($(this).data("pk")).save({access_token: App.user.get("access_token"), lastName: newValue});
        }
      });
      $('.role').editable({
        label: 'Enter Role',
        source: [
          {value: "user", text: 'user'},
          {value: "admin", text: 'admin'}
        ],
        success: function(response, newValue) {
          adminView.usersView.collection.get($(this).data("pk")).save({access_token: App.user.get("access_token"), role: newValue});
        } 
      }); 
      $('.organization').editable({
        type: 'text',
        name: 'username',
        label: 'Enter Organization',
        success: function(response, newValue) {
          adminView.usersView.collection.get($(this).data("pk")).save({access_token: App.user.get("access_token"), organization: newValue});
        } 
      }); 
      $('.organization-roles').editable({
        label: 'Enter Organization Affiliation',
        limit: 3,
        source: [
          {value: "K-12 Education", text: "K-12 Education"},
          {value: "Post-Secondary Education", text: "Learning Management System"},
          {value: "Academic Administration", text: "Academic Administration"},
          {value: "Original Content Author", text: "Original Content Author"},
          {value: "Publisher / Product Owner", text: "Publisher / Product Owner"},
          {value: "Service Provider", text: "Service Provider"},
          {value: "Classroom Instructor", text: "Classroom Instructor"},
          {value: "Other", text: "Other"}
        ],
        success: function(response, newValue) {
          adminView.usersView.collection.get($(this).data("pk")).save({access_token: App.user.get("access_token"), organizationTypes: newValue});
        } 
      }); 
    },

    addUploads: function() {
      var adminView = this;
      adminView.uploads = new Html5sCollection();
      adminView.uploads.fetch({
        success: function(collection, response, options) {
          adminView.renderUploads();
          adminView.addPagination(adminView.uploads, adminView.$('#html5 .pagination'));
          adminView.listenTo(adminView.uploads, 'reset', adminView.renderUploads);  
        }
      });
    },

    renderUploads: function() {
      if (this.uploadsView) {
        this.uploadsView.remove();
      }
      //Add uploads
      this.uploadsView = new UploadsView({collection: this.uploads});
      this.$("#html5 .results").html(this.uploadsView.render().el);
      this.uploadsView.delegateEvents();
    },

    addPagination: function(collection, pagination) {
      var paginationView = new PaginationView({collection: collection, el: pagination});
      paginationView.render();
      paginationView.delegateEvents();  
    }
  });
  return AdminView;
});
