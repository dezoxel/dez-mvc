define([], function() {

  function EmptyDeferred() {

  }

  EmptyDeferred.prototype.then = function(callback) {
  };

  return EmptyDeferred;
});