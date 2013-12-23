define(['test/mocks/deferred'], function(Deferred) {

  function Loader() {
  }

  Loader.prototype.loadController = function() {
    return new Deferred();
  };

  Loader.prototype.loadApplicationConfigFor = function() {
    return new Deferred();
  };

  return Loader;
});