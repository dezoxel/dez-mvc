// TODO: Avoid MicroEvent dependency. Use 'events-bus' instead.
// TODO: Avoid self-inialization. 'events-bus' dependency should be removed and setEventsBus() should be called by external object.
define(['microevent', 'underscore', 'dez-mvc/view/ejs-renderer', 'dez-mvc/loader', 'dez-mvc/events-bus'],
  function(MicroEvent, _, renderer, loader, events) {

  var controller = _.extend(MicroEvent.prototype, {
    view: renderer,
    layout: 'layout',

    extend: function(controllerActions) {
      var Constructor = can.Control(_.extend(this, controllerActions));
      return new Constructor();
    },

    initialize: function(options) {
      this.bind('preDispatch', this.preDispatch.bind(this));
      this.bind('postDispatch', this.postDispatch.bind(this));
    },

    respondTo: function(params) {
      // TODO: Find out more elegant solution
      params.controllerObject = this;

      this.setEventsBus(events);
      this.view.renderLayout(this.getLayoutAlias(params.controller)).done(function() {
        this.trigger('preDispatch', params);
        this.dispatch(params);
        this.trigger('postDispatch', params);
      }.bind(this));
    },

    preDispatch: function(params) {},

    postDispatch: function(params) {
      var controller = params.controllerObject;
      controller.view.renderContent(params.controller, this.view).done(function() {
        // TODO: maybe we can process components without waiting for rendering content
        controller.view.processComponentsWith(this.view);
        // TODO: Avoid specifying selector directly
        // setup method defined in can.Control
        controller.setup('[data-content]');
      });
    },

    getLayoutAlias: function(alias) {
      var details = loader.fetchDetailsFrom(alias);
      return details.module + '.' + this.layout;
    },

    setEventsBus: function(events) {
      this.events = events;
    },

    // TODO: Redirect the responsibility of handling route change to a special component
    goToRoute: function(route) {
      window.location.hash = '#' + route;
    },

  });

  controller.initialize();
  return controller;
});

