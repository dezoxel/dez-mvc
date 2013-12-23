define(['dez-mvc/events/dom-subscriber', 'dez-mvc/utils'], function(DomSubscriber, utils) {
  'use strict';

  function ViewModel() {
    this.domSubscribers = [];
  }

  ViewModel.prototype.unbindAllDomEvents = function() {
    this.domSubscribers.forEach(function(subscriber) {
      subscriber.unbindAll();
    }, this);
  };

  ViewModel.prototype.unbindAllDomEventsAndSave = function() {
    this.domSubscribers.forEach(function(subscriber) {
      subscriber.unbindAllAndSave();
    }, this);
  };

  ViewModel.prototype.rebindAllDomEvents = function() {
    this.domSubscribers.forEach(function(subscriber) {
      subscriber.rebindAll();
    }, this);
  };

  ViewModel.prototype.registerDomEventOn = function(element, parentElement) {
    var subscriber = new DomSubscriber(element);

    var index = this.domSubscribers.push(subscriber);

    return subscriber;
  };

  // TODO: Implement more performance-friendly event handlers
  ViewModel.prototype.bindDomEventsInside = function(parentElement) {
    var clicksDomElements = parentElement.querySelectorAll('[data-click]');

    utils.forEach(clicksDomElements, function(element) {
      var eventHandler = this[element.dataset.click];
      this.registerDomEventOn(element, parentElement).when('click').then(eventHandler);
    }, this);
  };

  ViewModel.prototype.rebindDomEventsInside = function(element) {
    this.unbindAllDomEvents();
    this.domSubscribers = [];
    this.bindDomEventsInside(element);
  };

  return ViewModel;
});