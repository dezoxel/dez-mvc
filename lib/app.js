define(['dez-mvc/loader', 'dez-router', 'microevent', 'underscore', 'jquery', 'dez-mvc/view/ejs-renderer'],
  function(loader, router, MicroEvent, _, $, renderer) {
  'use strict';

  return _.extend(MicroEvent.prototype, {
    start: function(env) {
      console.log('start');
      this.env = env;
      this.loader = loader;

      this.bind('core.appConfigLoaded', this._initializeApplication.bind(this));
      this.bind('core.moduleConfigLoaded', this._initializeModule.bind(this));
      this.bind('core.allModulesLoaded', this._startRoute.bind(this));

      this.loader.loadApplicationConfigFor(env).done(function(appConfig) {
        this.trigger('core.appConfigLoaded', appConfig);
      }.bind(this));
    },

    stop: function() {
      console.log('stop');
      this.env = null;

      router.reset();
      this._resetConig();
    },

    _initializeApplication: function(appConfig) {
      console.log('_initializeApplication');
      this._setConfig(appConfig);
      this._initializeRouter(router);
      this._initializeRenderer(renderer);

      this._initializeModules(appConfig.registeredModules);
    },

    _initializeRouter: function(router) {
      console.log('_initializeRouter');
      this.router = router;

      this.router.defaultRoute({controller: this.config.homeController });

      router.bind('routeMatched', function(params) {
        console.log('routeMatched');
        var moduleName = this.loader.fetchDetailsFrom(params.controller).module;
        if (!this.loader.isModuleLoaded(moduleName)) {
          this.loader.loadModule(moduleName);
        }

        this.loader.loadController(params.controller, params);
      }.bind(this));

      this.router.whenNotFound(function() {
        console.log('Sorry, page not found');
      });
    },

    _initializeModules: function(moduleNames) {
      console.log('_initializeModules');
      var deferreds = [];
      moduleNames.forEach(function(moduleName) {
        var moduleConfigDeferred = this.loader.loadConfigFor(moduleName, this.env);

        moduleConfigDeferred.done(function(config) {
          this.trigger('core.moduleConfigLoaded', moduleName, config);
        }.bind(this));

        deferreds.push(moduleConfigDeferred.promise());
      }.bind(this));

      $.when.apply($, deferreds).done(function() {
        this.trigger('core.allModulesLoaded');
      }.bind(this));

      return this;
    },

    _initializeModule: function(moduleName, config) {
      console.log('_initializeModule');
      this.config.module[moduleName] = config;
      this._addRoutesFor(moduleName, config.routes);
    },

    _addRoutesFor: function(moduleName, routes) {
      console.log('_addRoutesFor');
      for(var routePattern in routes) {
        if (routes.hasOwnProperty(routePattern)) {
          this.router.when(routePattern, routes[routePattern]);
        }
      }
    },

    _initializeRenderer: function(renderer) {
      console.log('_initializeRenderer');
      this.renderer = renderer;
      renderer.setElementBySelector(this.config.appSelector || 'body');
    },

    isProduction: function() {
      return this.env === 'production' || this.env === 'prod';
    },

    _startRoute: function() {
      console.log('_startRoute');
      this.router.start();
    },

    _setConfig: function(config) {
      console.log('_setConfig');
      this.config = config;
      this.config.module = {};
    },

    _resetConfig: function() {
      console.log('_resetConfig');
      this.config = {
        'module': {}
      };
    },

  });
});
