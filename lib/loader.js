// TODO: Reduce amount of similar methods
define(['jquery'], function($) {
  'use strict';

  return {
    loadModule: function(moduleName) {
      var modulePath = this._resolveModulePath(moduleName);

      require([modulePath], function() {
        this.loadedModules[moduleName] = true;
      }.bind(this));
    },

    loadController: function(alias, params) {
      var controllerPath = this._resolveControllerPath(alias);

      require([controllerPath], function(controller) {
        controller.respondTo(params);
      });
    },

    loadComponent: function(alias) {
      var componentPath = this._resolveComponentPath(alias);
      var d = new $.Deferred();

      require([componentPath], function(component) {
        d.resolve(component);
      });

      return d.promise();
    },

    loadTemplate: function(alias) {
      var templatePath = this._resolveTemplatePath(alias);
      var d = new $.Deferred();

      require(['text!' + templatePath], function(template) {
        d.resolve(template);
      });

      return d.promise();
    },

    loadStylesheet: function(alias) {
      var stylesheetPath = this._resolveStylesheetPath(alias);
      var d = new $.Deferred();

      require(['css!' + stylesheetPath], function(stylesheet) {
        d.resolve(stylesheet);
      });

      return d.promise();
    },

    loadComponentTemplate: function(alias) {
      var templatePath = this._resolveComponentTemplatePath(alias);
      var d = new $.Deferred();

      require(['text!' + templatePath], function(template) {
        d.resolve(template);
      });

      return d.promise();
    },

    loadComponentStylesheet: function(alias) {
      var stylePath = this._resolveComponentStylesheetPath(alias);
      var d = new $.Deferred();

      require(['css!' + stylePath], function(stylesheet) {
        d.resolve(stylesheet);
      });

      return d.promise();
    },

    loadConfigFor: function(moduleName, env) {

      var d = new $.Deferred();
      require(['text!module/' + moduleName + '/config/' + env + '.json'], function(config) {
        d.resolve(JSON.parse(config));
      });

      return d.promise();
    },

    loadApplicationConfigFor: function(env) {
      var d = new $.Deferred();

      // TODO: Avoid specifying extension
      require(['text!config/' + env + '.json'], function(config) {
        d.resolve(JSON.parse(config));
      });

      return d.promise();
    },

    fetchDetailsFrom: function(alias) {
      var details = alias.split('.');
      return {module: details[0], entity: details[1]};
    },

    isModuleLoaded: function(moduleName) {
      return this.loadedModules[moduleName];
    },

    _resolveControllerPath: function(alias) {
      var details = this.fetchDetailsFrom(alias);
      return 'module/' + details.module + '/controller/' + details.entity;
    },

    _resolveComponentPath: function(alias) {
      var details = this.fetchDetailsFrom(alias);
      if (details.module === 'lib') {
        return 'lib/components/' + details.entity + '/component';
      } else {
        return 'module/' + details.module + '/component/' + details.entity;
      }
    },

    // TODO: Avoid specifying template extension
    _resolveTemplatePath: function(alias) {
      var details = this.fetchDetailsFrom(alias);
      return 'module/' + details.module + '/view/' + details.entity + '.ejs';
    },

    // TODO: Avoid specifying stylesheet extension
    _resolveStylesheetPath: function(alias) {
      var details = this.fetchDetailsFrom(alias);
      return 'module/' + details.module + '/view/' + details.entity + '.css';
    },

    // TODO: Avoid specifying template extension
    _resolveComponentTemplatePath: function(alias) {
      var details = this.fetchDetailsFrom(alias);

      if (details.module === 'lib') {
        return 'lib/components/' + details.entity + '/component' + '.ejs';
      } else {
        return 'module/' + details.module + '/components' + details.entity + '/component' + '.ejs';
      }
    },

    // TODO: Avoid specifying stylesheet extension
    _resolveComponentStylesheetPath: function(alias) {
      var details = this.fetchDetailsFrom(alias);

      if (details.module === 'lib') {
        return 'lib/components/' + details.entity + '/component' + '.css';
      } else {
        return 'module/' + details.module + '/component/' + details.entity + '/component' + '.css';
      }
    },

    _resolveModulePath: function(moduleName) {
      return 'module/' + moduleName + '/module.js';
    },

    loadedModules: {}
  };
});