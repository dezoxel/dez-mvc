define(['dez-mvc/events/socket-subscriber', 'socket', 'dez-mvc/utils'], function(SocketSubscriber, io, utils) {

  describe('Subscriber', function() {

    var socket;
    var subscriber;
    var handler;

    beforeEach(function() {
      socket = io.connect();
      subscriber = new SocketSubscriber(socket);
      handler = function() {};

      spyOn(socket, 'on');
      spyOn(socket, 'removeListener');
      subscriber.when('some.event').then(handler);
    });

    it('requires socket for its working', function() {
      expect(subscriber.socket.on).toBeTruthy();
      expect(subscriber.socket.emit).toBeTruthy();
      expect(subscriber.socket.removeListener).toBeTruthy();
    });

    it('registers event handler', function() {
      expect(subscriber.handlers['some.event'].length).toEqual(1);
    });

    it('registers event handler in the socket', function() {
      expect(socket.on).toHaveBeenCalledWith('some.event', handler);
    });

    it('unbinds event handlers by event name', function() {
      subscriber.unbind('some.event');
      expect(subscriber.handlers['some.event'].length).toEqual(0);
    });

    it('unbinds event handlers by event name from events bus', function() {
      subscriber.unbind('some.event');
      expect(socket.removeListener).toHaveBeenCalledWith('some.event', handler);
    });

    it('unbinds all handlers from all events', function() {
      var anotherHandler = function() {};
      subscriber.when('some.event').then(anotherHandler);
      subscriber.when('another.event').then(anotherHandler);

      expect(utils.size(subscriber.handlers['some.event'])).toEqual(2);
      expect(utils.size(subscriber.handlers['another.event'])).toEqual(1);
      expect(socket.on).toHaveBeenCalledWith('some.event', handler);
      expect(socket.on).toHaveBeenCalledWith('some.event', anotherHandler);
      expect(socket.on).toHaveBeenCalledWith('another.event', anotherHandler);

      subscriber.unbindAll();

      expect(utils.size(subscriber.handlers['some.event'])).toEqual(0);
      expect(utils.size(subscriber.handlers['another.event'])).toEqual(0);
      expect(socket.removeListener).toHaveBeenCalledWith('some.event', handler);
      expect(socket.removeListener).toHaveBeenCalledWith('some.event', anotherHandler);
      expect(socket.removeListener).toHaveBeenCalledWith('another.event', anotherHandler);
    });

    it('unbinds event handlers for event from socket and stores it in subscriber for future binds', function() {
      subscriber.unbindAndSave('some.event') ;

      expect(subscriber.handlers['some.event'].length).toEqual(1);
      expect(socket.removeListener).toHaveBeenCalledWith('some.event', handler);
    });

    it('unbinds all event handlers from all events from socket but stores it in subscriber for future binds', function() {
      var anotherHandler = function() {};
      subscriber.when('some.event').then(anotherHandler);
      subscriber.when('another.event').then(anotherHandler);

      expect(utils.size(subscriber.handlers['some.event'])).toEqual(2);
      expect(utils.size(subscriber.handlers['another.event'])).toEqual(1);
      expect(socket.on).toHaveBeenCalledWith('some.event', handler);
      expect(socket.on).toHaveBeenCalledWith('some.event', anotherHandler);
      expect(socket.on).toHaveBeenCalledWith('another.event', anotherHandler);

      subscriber.unbindAllAndSave();

      expect(utils.size(subscriber.handlers['some.event'])).toEqual(2);
      expect(utils.size(subscriber.handlers['another.event'])).toEqual(1);
      expect(socket.removeListener).toHaveBeenCalledWith('some.event', handler);
      expect(socket.removeListener).toHaveBeenCalledWith('some.event', anotherHandler);
      expect(socket.removeListener).toHaveBeenCalledWith('another.event', anotherHandler);
    });

    it('rebinds earlier stored event handlers for event', function() {
      subscriber.unbindAndSave('some.event');
      subscriber.rebind('some.event');

      expect(subscriber.handlers['some.event'].length).toEqual(1);
      expect(socket.on).toHaveBeenCalledWith('some.event', handler);
      expect(socket.removeListener).toHaveBeenCalledWith('some.event', handler);
      expect(socket.on).toHaveBeenCalledWith('some.event', handler);
    });

    it('rebinds all earlier stored event handlers for all events', function() {
      var anotherHandler = function() {};
      subscriber.when('some.event').then(anotherHandler);
      subscriber.when('another.event').then(anotherHandler);

      expect(socket.on).toHaveBeenCalledWith('some.event', handler);
      expect(socket.on).toHaveBeenCalledWith('some.event', anotherHandler);
      expect(socket.on).toHaveBeenCalledWith('another.event', anotherHandler);

      subscriber.unbindAllAndSave();

      expect(socket.removeListener).toHaveBeenCalledWith('some.event', handler);
      expect(socket.removeListener).toHaveBeenCalledWith('some.event', anotherHandler);
      expect(socket.removeListener).toHaveBeenCalledWith('another.event', anotherHandler);

      subscriber.rebindAll();

      expect(utils.size(subscriber.handlers['some.event'])).toEqual(2);
      expect(utils.size(subscriber.handlers['another.event'])).toEqual(1);
      expect(socket.on).toHaveBeenCalledWith('some.event', handler);
      expect(socket.on).toHaveBeenCalledWith('some.event', anotherHandler);
      expect(socket.on).toHaveBeenCalledWith('another.event', anotherHandler);
    });

  });
});