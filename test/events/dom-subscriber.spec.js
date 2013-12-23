define(['dez-mvc/events/dom-subscriber', 'dez-mvc/utils'], function(DomSubscriber, utils) {

  describe('DomSubscriber', function() {

    var element;
    var domSubscriber;
    var countTriggered;
    var event;

    beforeEach(function() {
      countTriggered = 0;
      element = document.createElement('div');
      domSubscriber = new DomSubscriber(element);
      domSubscriber.when('some.event').then(function() { countTriggered++ });
      event = createEvent('some.event');
    });

    it('requires dom element for its working', function() {
      expect(domSubscriber.element.addEventListener).toBeTruthy();
      expect(domSubscriber.element.removeEventListener).toBeTruthy();
    });

    it('registers event handler', function() {
      expect(domSubscriber.handlers['some.event'].length).toEqual(1);
    });

    it('registers event handler in the dom element', function() {
      element.dispatchEvent(event);
      expect(countTriggered).toEqual(1);
    });

    it('unbinds event handlers by event name', function() {
      domSubscriber.unbind('some.event');
      expect(domSubscriber.handlers['some.event'].length).toEqual(0);
    });

    it('unbinds event handlers by event name from events bus', function() {
      domSubscriber.unbind('some.event');
      element.dispatchEvent(event);
      expect(countTriggered).toEqual(0);
    });

    it('unbinds all handlers from all events', function() {
      var anotherTriggered = 0;
      var anotherEvent = createEvent('another.event');

      domSubscriber.when('some.event').then(function() { countTriggered++ });
      domSubscriber.when('another.event').then(function() { anotherTriggered++ });

      expect(utils.size(domSubscriber.handlers['some.event'])).toEqual(2);
      expect(utils.size(domSubscriber.handlers['another.event'])).toEqual(1);

      element.dispatchEvent(event);
      element.dispatchEvent(anotherEvent);

      expect(countTriggered).toEqual(2);
      expect(anotherTriggered).toEqual(1);

      domSubscriber.unbindAll();

      expect(utils.size(domSubscriber.handlers['some.event'])).toEqual(0);
      expect(utils.size(domSubscriber.handlers['another.event'])).toEqual(0);

      element.dispatchEvent(event);
      element.dispatchEvent(anotherEvent);

      expect(countTriggered).toEqual(2);
      expect(anotherTriggered).toEqual(1);
    });

    it('unbinds event handlers for event from dom element and stores it in subscriber for future binds', function() {
      domSubscriber.unbindAndSave('some.event') ;
      expect(domSubscriber.handlers['some.event'].length).toEqual(1);

      element.dispatchEvent(event);

      expect(countTriggered).toEqual(0);
    });

    it('unbinds all event handlers from all events from events bus but stores it in subscriber for future binds', function() {
      var anotherTriggered = 0;
      var anotherEvent = createEvent('another.event');

      domSubscriber.when('some.event').then(function() { countTriggered++ });
      domSubscriber.when('another.event').then(function() { anotherTriggered++ });

      expect(utils.size(domSubscriber.handlers['some.event'])).toEqual(2);
      expect(utils.size(domSubscriber.handlers['another.event'])).toEqual(1);

      element.dispatchEvent(event);
      element.dispatchEvent(anotherEvent);

      expect(countTriggered).toEqual(2);
      expect(anotherTriggered).toEqual(1);

      domSubscriber.unbindAllAndSave();

      expect(utils.size(domSubscriber.handlers['some.event'])).toEqual(2);
      expect(utils.size(domSubscriber.handlers['another.event'])).toEqual(1);

      element.dispatchEvent(event);
      element.dispatchEvent(anotherEvent);

      expect(countTriggered).toEqual(2);
      expect(anotherTriggered).toEqual(1);
    });

    it('rebinds earlier stored event handlers for event', function() {
      domSubscriber.unbindAndSave('some.event');
      domSubscriber.rebind('some.event');

      expect(domSubscriber.handlers['some.event'].length).toEqual(1);

      element.dispatchEvent(event);

      expect(countTriggered).toEqual(1);
    });

    it('rebinds all earlier stored event handlers for all events', function() {
      var anotherTriggered = 0;
      var anotherEvent = createEvent('another.event');

      domSubscriber.when('some.event').then(function() { countTriggered++ });
      domSubscriber.when('another.event').then(function() { anotherTriggered++ });

      domSubscriber.unbindAllAndSave();
      domSubscriber.rebindAll();

      expect(utils.size(domSubscriber.handlers['some.event'])).toEqual(2);
      expect(utils.size(domSubscriber.handlers['another.event'])).toEqual(1);

      element.dispatchEvent(event);
      element.dispatchEvent(anotherEvent);

      expect(countTriggered).toEqual(2);
      expect(anotherTriggered).toEqual(1);
    });

  });

  function createEvent(name) {
    var e = document.createEvent('Event');
    e.initEvent(name);

    return e;
  }

});