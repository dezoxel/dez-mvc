define(['dez-mvc/events/subscriber', 'dez-mvc/deferred'], function(Subscriber, Deferred) {

  return Object.extend({

    init: function(eventsBus, timeout) {
      this.eventsBus = eventsBus;
      this.events = new Subscriber(this.eventsBus);
      this.deferred = new Deferred();

      this.registerBootstrapTimeout(timeout);
    },

    registerBootstrapTimeout: function(timeout) {
      var seconds = 1000;
      this.timeout = timeout ? timeout * seconds : 60 * seconds;

      setTimeout(function() {
        this.deferred.reject();
      }.bind(this), this.timeout);
    },

    givePromise: function() {
      return this.deferred.promise();
    },
  });
});