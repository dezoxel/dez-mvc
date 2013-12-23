/**
 * Syntax:
 * Object.extend(props)
 * Object.extend(props, staticProps)
 * Object.extend([mixins], props)
 * Object.extend([mixins], props, staticProps)
*/
define([], function() {
  'use strict';

  var inherit = Object.create || function(proto) {
    function F() {}
    F.prototype = proto;
    return new F;
  };

  Object.extend = function(props, staticProps) {

    var mixins = [];

    if ({}.toString.apply(arguments[0]) == "[object Array]") {
      mixins = arguments[0];
      props = arguments[1];
      staticProps = arguments[2];
    }

    function Constructor() {
      this.init && this.init.apply(this, arguments);
    }

    Constructor.prototype = Object.create(this.prototype);

    Constructor.prototype.constructor = Constructor;

    Constructor.extend = Object.extend;

    copyWrappedProps(staticProps, Constructor, this);

    for (var i = 0; i < mixins.length; i++) {
      copyWrappedProps(mixins[i], Constructor.prototype, this.prototype);
    }
    copyWrappedProps(props, Constructor.prototype, this.prototype);

    return Constructor;
  };

  var fnTest = /xyz/.test(function() {xyz}) ? /\b_super\b/ : /./;


  function copyWrappedProps(props, targetPropsObj, parentPropsObj) {
    if (!props) return;

    for (var name in props) {
      if (typeof props[name] == "function"
        && typeof parentPropsObj[name] == "function"
        && fnTest.test(props[name])) {
        targetPropsObj[name] = wrap(props[name], parentPropsObj[name]);
      } else {
        targetPropsObj[name] = props[name];
      }
    }
  }

  function wrap(method, parentMethod) {
    return function() {
      var backup = this._super;

      this._super = parentMethod;

      try {
        return method.apply(this, arguments);
      } finally {
        this._super = backup;
      }
    }
  }

});
