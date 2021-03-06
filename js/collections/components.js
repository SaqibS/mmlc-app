// Component Collection
// ---------------
define([
  'underscore',
  'backbone',
  'js/models/component.js'
], function(_, Backbone, Component){
  var ComponentCollection = Backbone.Collection.extend({
    // Reference to this collection's model.
    model: Component
  });
  return ComponentCollection;
});
