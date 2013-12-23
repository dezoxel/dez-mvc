define(['dez-mvc/utils'], function(utils) {

  function SocketSubscriber(socket) {
    this.socket = socket;
    this.tempEventName = null;
    this.handlers = {};
  }

  SocketSubscriber.prototype.when = function(eventName, handler) {
    this.tempEventName = eventName;

    return this;
  };

  SocketSubscriber.prototype.then = function(handler) {
    this.socket.on(this.tempEventName, handler);

    if (!this.handlers[this.tempEventName]) {
      this.handlers[this.tempEventName] = [];
    }
    this.handlers[this.tempEventName].push(handler);
  };

  SocketSubscriber.prototype.unbind = function(eventName) {
    if (!this.handlers[eventName]) {
      return false;
    }

    this.handlers[eventName].forEach(function(handler) {
      this.socket.removeListener(eventName, handler);
    }.bind(this));

    this.handlers[eventName] = [];
  };

  SocketSubscriber.prototype.unbindAndSave = function(eventName) {
    if (!this.handlers[eventName]) {
      return false;
    }

    this.handlers[eventName].forEach(function(handler) {
      this.socket.removeListener(eventName, handler);
    }.bind(this));
  };

  SocketSubscriber.prototype.rebind = function(eventName) {
    if (!this.handlers[eventName]) {
      return false;
    }

    this.handlers[eventName].forEach(function(handler) {
      this.socket.on(eventName, handler);
    }.bind(this));
  };

  SocketSubscriber.prototype.unbindAll = function() {
    utils.forEach(this.handlers, function(handlers, eventName) {
      this.unbind(eventName);
    }, this);
  };

  SocketSubscriber.prototype.unbindAllAndSave = function() {
    utils.forEach(this.handlers, function(handlers, eventName) {
      this.unbindAndSave(eventName);
    }, this);
  };

  SocketSubscriber.prototype.rebindAll = function() {
    utils.forEach(this.handlers, function(handlers, eventName) {
      this.rebind(eventName);
    }, this);
  };

  return SocketSubscriber;
})