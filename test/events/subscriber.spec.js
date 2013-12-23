// TODO: Write specs for "trigger()"
define(['dez-mvc/events/subscriber', 'dez-mvc/events/bus', 'dez-mvc/utils'], function(Subscriber, EventsBus, utils) {

  describe('Subscriber', function() {

    var eventsBus;
    var subscriber;

    beforeEach(function() {
      eventsBus = new EventsBus();
      subscriber = new Subscriber(eventsBus);
      subscriber.when('some.event').then(function() {});
    });

    it('requires EventsBus for its working', function() {
      expect(subscriber.eventsBus.when).toBeTruthy();
      expect(subscriber.eventsBus.then).toBeTruthy();
    });

    it('registers event handler', function() {
      expect(subscriber.handlers['some.event'].length).toEqual(1);
    });

    it('registers event handler in the events bus', function() {
      expect(utils.size(subscriber.eventsBus._events['some.event'])).toEqual(1);
    });

    it('unbinds event handlers by event name', function() {
      subscriber.unbind('some.event');
      expect(subscriber.handlers['some.event'].length).toEqual(0);
    });

    it('unbinds event handlers by event name from events bus', function() {
      subscriber.unbind('some.event');
      expect(utils.size(subscriber.eventsBus._events['some.event'])).toEqual(0);
    });

    it('unbinds all handlers from all events', function() {
      subscriber.when('some.event').then(function() {});
      subscriber.when('another.event').then(function() {});

      expect(utils.size(subscriber.handlers['some.event'])).toEqual(2);
      expect(utils.size(subscriber.handlers['another.event'])).toEqual(1);
      expect(utils.size(subscriber.eventsBus._events['some.event'])).toEqual(2);
      expect(utils.size(subscriber.eventsBus._events['another.event'])).toEqual(1);

      subscriber.unbindAll();

      expect(utils.size(subscriber.handlers['some.event'])).toEqual(0);
      expect(utils.size(subscriber.handlers['another.event'])).toEqual(0);
      expect(utils.size(subscriber.eventsBus._events['some.event'])).toEqual(0);
      expect(utils.size(subscriber.eventsBus._events['another.event'])).toEqual(0);
    });

    it('unbinds event handlers for event from events bus and stores it in subscriber for future binds', function() {
      subscriber.unbindAndSave('some.event') ;
      expect(subscriber.handlers['some.event'].length).toEqual(1);
      expect(utils.size(subscriber.eventsBus._events['some.event'])).toEqual(0);
    });

    it('unbinds all event handlers from all events from events bus but stores it in subscriber for future binds', function() {
      subscriber.when('some.event').then(function() {});
      subscriber.when('another.event').then(function() {});

      expect(utils.size(subscriber.handlers['some.event'])).toEqual(2);
      expect(utils.size(subscriber.handlers['another.event'])).toEqual(1);
      expect(utils.size(subscriber.eventsBus._events['some.event'])).toEqual(2);
      expect(utils.size(subscriber.eventsBus._events['another.event'])).toEqual(1);

      subscriber.unbindAllAndSave() ;

      expect(utils.size(subscriber.handlers['some.event'])).toEqual(2);
      expect(utils.size(subscriber.handlers['another.event'])).toEqual(1);
      expect(utils.size(subscriber.eventsBus._events['some.event'])).toEqual(0);
      expect(utils.size(subscriber.eventsBus._events['another.event'])).toEqual(0);

    });

    it('rebinds earlier stored event handlers for event', function() {
      subscriber.unbindAndSave('some.event');
      subscriber.rebind('some.event');

      expect(subscriber.handlers['some.event'].length).toEqual(1);
      expect(utils.size(subscriber.eventsBus._events['some.event'])).toEqual(1);
    });

    it('rebinds all earlier stored event handlers for all events', function() {
      subscriber.when('some.event').then(function() {});
      subscriber.when('another.event').then(function() {});

      subscriber.unbindAllAndSave();

      subscriber.rebindAll() ;

      expect(utils.size(subscriber.handlers['some.event'])).toEqual(2);
      expect(utils.size(subscriber.handlers['another.event'])).toEqual(1);
      expect(utils.size(subscriber.eventsBus._events['some.event'])).toEqual(2);
      expect(utils.size(subscriber.eventsBus._events['another.event'])).toEqual(1);
    });

  });
});