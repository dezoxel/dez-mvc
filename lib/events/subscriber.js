define(['dez-mvc/utils'], function(utils) {

  function Subscriber(eventsBus) {
    this.eventsBus = eventsBus;
    this.tempEventNameForBinding = null;
    this.handlers = {};
  }

  Subscriber.prototype.when = function(eventName, callback) {
    this.tempEventNameForBinding = eventName;

    return this;
  };

  Subscriber.prototype.then = function(callback) {
    this.eventsBus.when(this.tempEventNameForBinding).then(callback);

    if (!this.handlers[this.tempEventNameForBinding]) {
      this.handlers[this.tempEventNameForBinding] = [];
    }
    this.handlers[this.tempEventNameForBinding].push(callback);
  };

  Subscriber.prototype.trigger = function() {
    this.eventsBus.trigger.apply(this.eventsBus, arguments);
  };

  Subscriber.prototype.unbind = function(eventName) {
    if (!this.handlers[eventName]) {
      return false;
    }

    this.handlers[eventName].forEach(function(handler) {
      this.eventsBus.unbind(eventName, handler);
    }.bind(this));

    this.handlers[eventName] = [];
  };

  Subscriber.prototype.unbindAndSave = function(eventName) {
    if (!this.handlers[eventName]) {
      return false;
    }

    this.handlers[eventName].forEach(function(handler) {
      this.eventsBus.unbind(eventName, handler);
    }.bind(this));
  };

  Subscriber.prototype.rebind = function(eventName) {
    if (!this.handlers[eventName]) {
      return false;
    }

    this.handlers[eventName].forEach(function(handler) {
      this.eventsBus.when(eventName).then(handler);
    }.bind(this));
  };

  Subscriber.prototype.unbindAll = function() {
    utils.forEach(this.handlers, function(handlers, eventName) {
      this.unbind(eventName);
    }, this);
  };

  Subscriber.prototype.unbindAllAndSave = function() {
    utils.forEach(this.handlers, function(handlers, eventName) {
      this.unbindAndSave(eventName);
    }, this);
  };

  Subscriber.prototype.rebindAll = function() {
    utils.forEach(this.handlers, function(handlers, eventName) {
      this.rebind(eventName);
    }, this);
  };

  return Subscriber;
})