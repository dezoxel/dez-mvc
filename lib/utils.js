define(['dez-mvc/constructor', 'dez-mvc/polyfills'], function() {
  'use strict';

  var utils = {};

  // https://github.com/jashkenas/underscore
  var breaker = {};

  // https://github.com/jashkenas/underscore
  var
    ArrayProto = Array.prototype,
    ObjProto = Object.prototype;

  var
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString;

  // https://github.com/jashkenas/underscore
  var
    nativeForEach      = ArrayProto.forEach,
    nativeIsArray      = Array.isArray,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeSome         = ArrayProto.some,
    nativeKeys         = Object.keys;

  // https://github.com/jashkenas/underscore
  utils.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // https://github.com/jashkenas/underscore
  utils.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) {
      throw new TypeError('Invalid object');
    }
    var keys = [];
    for (var key in obj) {
      if (utils.has(obj, key)) {
        keys.push(key);
      }
    }
    return keys;
  };

  // https://github.com/jashkenas/underscore
  var each = utils.each = utils.forEach = function(obj, iterator, context) {
    if (obj === null) {
      return;
    }
    var i, len;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (i = 0, len = obj.length; i < len; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) {
          return;
        }
      }
    } else {
      var keys = utils.keys(obj);
      for (i = 0, len = keys.length; i < len; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) {
          return;
        }
      }
    }
  };

  // https://github.com/jashkenas/underscore
  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    utils['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });


  // https://github.com/jashkenas/underscore
  utils.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // https://github.com/jashkenas/underscore
  utils.isEmpty = function(obj) {
    if (obj === null) {
      return true;
    }
    if (utils.isArray(obj) || utils.isString(obj)) {
      return obj.length === 0;
    }
    for (var key in obj) {
      if (utils.has(obj, key)) {
        return false;
      }
    }
    return true;
  };

  // https://github.com/jashkenas/underscore
  utils.size = function(obj) {
    if (obj === null) {
      return 0;
    }
    return (obj.length === +obj.length) ? obj.length : utils.keys(obj).length;
  };

  // https://github.com/jashkenas/underscore
  utils.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (source.hasOwnProperty(prop)) {
            obj[prop] = source[prop];
          }
        }
      }
    });
    return obj;
  };

  // https://github.com/epeli/underscore.string
  utils.underscored = function(str){
    return str.replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
  };

  utils.log = function(data) {
    if (typeof data === 'string') {
      console.log(data);
    } else {
      console.log(JSON.stringify(data, ' ', 4));
    }
  };

  utils.uniqid = function() {
    return Math.floor(Math.random()*1e10);
  };

  utils.encodeUtf8 = function(s) {
    return unescape(encodeURIComponent(s));
  };

  utils.decodeUtf8 = function(s) {
    return decodeURIComponent(escape(s));
  };

  utils.embedBase64ToHtml = function(string, contentType) {
    if (!string) {
      return '';
    }

    contentType = contentType || 'image/png';
    return 'data:'+contentType+';base64, ' + string;
  };

  // https://github.com/jashkenas/underscore
  utils.identity = function(value) {
    return value;
  };

  // https://github.com/jashkenas/underscore
  var any = utils.some = utils.any = function(obj, iterator, context) {
    iterator = iterator || utils.identity;
    var result = false;

    if (obj === null) {
      return result;
    }

    if (nativeSome && obj.some === nativeSome) {
      return obj.some(iterator, context);
    }

    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) {
        return breaker;
      }
    });

    return !!result;
  };

  // https://github.com/jashkenas/underscore
  utils.contains = utils.include = function(obj, target) {
    if (obj === null) {
      return false;
    }

    if (nativeIndexOf && obj.indexOf === nativeIndexOf) {
      return obj.indexOf(target) !== -1;
    }

    return any(obj, function(value) {
      return value === target;
    });
  };

  utils.assertValidKeys = function(data, validKeys) {
    var keys = utils.keys(data);
    for(var i = 0, len = validKeys.length; i < len; i++) {
      var key = validKeys[i];

      if (!utils.contains(keys, key)) {
        return false;
      }
    }

    return true;
  };

  // https://github.com/jashkenas/underscore
  utils.find = utils.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  return utils;
});