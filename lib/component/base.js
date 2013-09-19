define(['underscore', 'can'], function(_, can) {
  return {
    extend: function(component) {
      var Constructor = can.Control(_.extend(this, component));
      return new Constructor();
    },

    getElement: function() {
      return this.element.get(0);
    },

    setEventsBus: function(events) {
      this.events = events;
    },

    // TODO: It should be util function. Move this function to utils when will be other one case to use it
    assertRequiredKeys: function(hash, requiredKeys, errorPrefix) {
      errorPrefix = errorPrefix || '';

      if (!hash) {
        throw errorPrefix + 'ArgumentError: Hash is undefined';
      }

      var missingKeys = requiredKeys.filter(function(key) {
        var keys = Object.keys(hash);
        return !_.contains(keys, key);
      });

      if (missingKeys.length > 0) {
        throw errorPrefix + 'ArgumentError: Missing required option(s): ' + missingKeys.join(', ');
      }
    },

    // TODO: Make more correct solution for validation
    _abortIfNotValid: function(inputParam, requiredKeys, errorPrefix) {
      var paramForChecking;

      if (inputParam instanceof Array) {

        if (inputParam.length > 0) {
          inputParam.forEach(function(item) {
            this.assertRequiredKeys(item, requiredKeys, errorPrefix);
          }.bind(this));
        }
        // yes, we do really don't need to check required keys if input param is an array and empty

      } else {
        this.assertRequiredKeys(inputParam, requiredKeys, errorPrefix);
      }

    }
  };
});