define([], function() {

  function Deferred() {

  }

  Deferred.prototype.then = function(callback) {
    callback();
  };

  return Deferred;
});