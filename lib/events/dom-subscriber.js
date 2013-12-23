define(['dez-mvc/utils'], function(utils) {

  function DomSubscriber(element) {
    this.handlers = {};
    this.element = element;
  }

  DomSubscriber.prototype.when = function(eventName) {
    this.tmpEvent = eventName;

    return this;
  };

  DomSubscriber.prototype.then = function(handler) {
    this.register(this.tmpEvent, handler);

    return this;
  };

  DomSubscriber.prototype.register = function(eventName, handler) {
    this.element.addEventListener(eventName, handler);

    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }

    this.handlers[eventName].push(handler);
  };

  DomSubscriber.prototype.unbind = function(eventName) {
    if (!this.handlers[eventName]) {
      return false;
    }

    this.handlers[eventName].forEach(function(handler) {
      this.element.removeEventListener(eventName, handler);
    }, this);

    this.handlers[eventName] = [];
  };

  DomSubscriber.prototype.unbindAll = function() {
    utils.forEach(this.handlers, function(handlers, eventName) {
      this.unbind(eventName);
    }, this);
  };

  DomSubscriber.prototype.reset = function() {
    this.handlers = {};
    this.domElements = [];
  };

  DomSubscriber.prototype.unbindAndSave = function(eventName) {
    if (!this.handlers[eventName]) {
      return false;
    }

    this.handlers[eventName].forEach(function(handler) {
      this.element.removeEventListener(eventName, handler);
    }, this);
  };

  DomSubscriber.prototype.rebind = function(eventName) {
    if (!this.handlers[eventName]) {
      return false;
    }

    this.handlers[eventName].forEach(function(handler) {
      this.element.addEventListener(eventName, handler);
    }, this);
  };

  DomSubscriber.prototype.unbindAllAndSave = function() {
    utils.forEach(this.handlers, function(handlers, eventName) {
      this.unbindAndSave(eventName);
    }, this);
  };

  DomSubscriber.prototype.rebindAll = function() {
    utils.forEach(this.handlers, function(handlers, eventName) {
      this.rebind(eventName);
    }, this);
  };

  return DomSubscriber;
})