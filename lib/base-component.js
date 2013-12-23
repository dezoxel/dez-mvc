// TODO: Think about how to make Controller and Component as the same things, so we will use only Controller, or
// Component
// TODO: Think about this.element. I guess we can avoid thid dependency
define(['dez-mvc/utils', 'dez-mvc/events/subscriber'], function(utils, Subscriber) {
  'use strict';

  function BaseComponent(alias, eventsBus, element, viewModel) {
    this.alias = alias;
    this.eventsBus = eventsBus;
    this.events = new Subscriber(this.eventsBus);
    this.element = element;
    this.viewModel = viewModel;

    if (this.init) {
      this.init();
    }

    this.defineViewModel();
    this.defineComponents();
  }

  BaseComponent.prototype.systemDispatch = function(params) {
    this.eventsBus.trigger(this.alias + '.before.dispatched', this.viewModel, params);

    this.dispatch(params);

    this.eventsBus.trigger(this.alias + '.dispatched', this.viewModel, params);
  };

  BaseComponent.prototype.systemStop = function() {
    this.events.unbindAll();
  };

  BaseComponent.prototype.systemResume = function() {
    if (this.resume) {
      this.resume();
    }
  };

  BaseComponent.prototype.systemDestroy = function() {
    this.eventsBus.trigger(this.alias + '.before.destroyed');

    if (this.destroy) {
      this.destroy();
    }

    // console.log('Component: ' + this.alias + ' unbinds all events');
    this.events.unbindAll();
    this.viewModel.domEvents.unbindAll();
    this.viewModel.element.parentNode.removeChild(this.viewModel.element);
    this.viewModel.reset();
    this.events = {};

    this.eventsBus.trigger(this.alias + '.destroyed');
  };

  BaseComponent.extend = function(userComponent) {
    function Component() {
      BaseComponent.apply(this, arguments);
    }
    Component.prototype = Object.create(BaseComponent.prototype);
    utils.extend(Component.prototype, userComponent);

    return Component;
  };

  BaseComponent.prototype.dispatch = function() {};
  BaseComponent.prototype.defineViewModel = function() {};
  BaseComponent.prototype.defineComponents = function() {};

  return BaseComponent;
});