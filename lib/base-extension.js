define(['dez-mvc/utils', 'dez-mvc/events/subscriber'], function(utils, Subscriber) {
  'use strict';

  return Object.extend({

    init: function(options, name, app) {
      this.name = name;
      this.eventsBus = app.eventsBus;
      this.events = new Subscriber(this.eventsBus);
      this.app = app;
    },

    getConfigFor: function(moduleName) {
      return this.app.getConfigFor(moduleName);
    },

    getCurrentModuleName: function() {
      return this.app.currentModule;
    },

    getAppConfig: function() {
      return this.app.config;
    },

  });
});