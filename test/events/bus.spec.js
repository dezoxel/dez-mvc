define(['dez-mvc/events/bus'], function(EventsBus) {
  'use strict';

  describe('EventsBus', function() {
    var eventsBus;

    beforeEach(function() {
      eventsBus = new EventsBus()
    });

    it('registers a callback to some event', function() {
      var isSomeEventTriggered = false;

      eventsBus.when('some.event').then(function() {
        isSomeEventTriggered = true;
      });

      eventsBus.trigger('some.event');

      expect(isSomeEventTriggered).toEqual(true);
    });

  });

});