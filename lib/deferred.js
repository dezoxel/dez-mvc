define(['jquery'], function($) {
  'use strict';

  var Deferred = $.Deferred;

  Deferred.when = function() {
    if (arguments[0] instanceof Array) {
      return $.when.apply($, arguments[0]);
    } else {
      return $.when.apply($, arguments);
    }
  };

  return Deferred;
});