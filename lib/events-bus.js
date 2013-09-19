define(['underscore', 'jquery'], function(_, $) {
  'use strict';

  return _.extend({
    deferreds: {},

    when: function(events) {
      var deferreds = [];
      if (events instanceof Array) {
        events.forEach(function(eventName) {
          deferreds.push(this.getDeferredBy(eventName));
        }.bind(this));
      } else {
        var eventName = events;
        deferreds.push(this.getDeferredBy(eventName));
      }

      return $.when.apply($, deferreds);
    },

    getDeferredBy: function(eventName) {
      return this.deferreds[eventName];
    },

    createDeferredWithName: function(name) {
      this.deferreds[name] = new $.Deferred();

      return this.deferreds[name];
    }

  });
});