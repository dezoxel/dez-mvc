define(['dez-mvc/utils', 'microevent'], function(utils, Microevent) {
  'use strict';

  function EventsBus() {
    this.tempEventNameForBinding = null;
  }

  utils.extend(EventsBus.prototype, Microevent.prototype);

  EventsBus.prototype.when = function(eventName) {
    this.tempEventNameForBinding = eventName;

    return this;
  };

  EventsBus.prototype.then = function(callback) {
    this.bind(this.tempEventNameForBinding, callback);
    this.tempEventNameForBinding = null;
  };

  return EventsBus;
});