define(['dez-mvc/utils', 'dez-mvc/events/subscriber'], function(utils, Subscriber) {
  'use strict';

  function BaseController(alias, eventsBus) {
    this.alias = alias;
    this.eventsBus = eventsBus;
    this.events = new Subscriber(this.eventsBus);

    if (this.init) {
      this.init();
    }
  }

  BaseController.prototype.respondTo = function(params) {
    this.eventsBus.trigger('controller.before.dispatched', params);
    this.eventsBus.trigger('controller.' + this.alias + '.before.dispatched', params);

    this.dispatch(params);

    this.eventsBus.trigger('controller.dispatched', params);
    this.eventsBus.trigger('controller.' + this.alias + '.dispatched', params);
  };

  BaseController.prototype.systemDestroy = function() {
    if (this.destroy) {
      this.destroy();
    }

    this.events.unbindAll();
  };

  BaseController.prototype.systemStop = function() {
    if (this.stop) {
      this.stop();
    }

    this.events.unbindAllAndSave();
  };

  BaseController.prototype.systemResume = function() {
    this.events.rebindAll();

    if (this.resume) {
      this.resume();
    }
  };

  BaseController.extend = function(userController) {
    function Controller() {
      BaseController.apply(this, arguments);
    }
    Controller.prototype = Object.create(BaseController.prototype);
    utils.extend(Controller.prototype, userController);

    return Controller;
  };

  BaseController.prototype.dispatch = function() {};

  return BaseController;
});