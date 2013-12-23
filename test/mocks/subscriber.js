define(['test/mocks/deferred'], function(Deferred) {

  function Subscriber() {
  }

  Subscriber.prototype.when = function() {
    return this;
  };

  Subscriber.prototype.then = function() {
  };

  return Subscriber;
});