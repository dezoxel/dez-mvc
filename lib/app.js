define([
  'dez-mvc/loader',
  'dez-mvc/utils',
  'dez-router',
  'dez-mvc/events/bus',
  'dez-mvc/events/subscriber',
  'dez-mvc/template',
  'dez-mvc/deferred',
], function(Loader, utils, router, EventsBus, Subscriber, Template, Deferred) {
  'use strict';
  var logPrefix = '[DEZ MVC][APPLICATION]';

  function Application() {
    console.log('***************************************************************************************************');
    this.loader = this._createLoader();
    this.router = this._createRouter();
    this.eventsBus = this._createEventsBus();
    this.events = this._createSubscriber();
    this.config = {module: {}};

    this.currentController = null;
    this.currentTemplate = null;
    this.currentModule = null;

    this.controllers = {};
    this.templates = {};
    this.extensions = {};
    this.bootstraps = {};
  }

  Application.prototype.start = function() {
    this.loader.loadApplicationConfig()

      .done(this._initializeApplication.bind(this))

      .fail(function() {
        throw logPrefix + '[ERROR] I cant load application config.';
      });
  };

  Application.prototype._initializeApplication = function(config) {
    this._setConfig(config);

    if (config.modulePath) {
      this.loader.setModulePath(config.modulePath);
    }

    if (config.templatesPath) {
      this.loader.setTemplatesPath(config.templatesPath);
    }

    if (config.componentsPath) {
      this.loader.setComponentsPath(config.componentsPath);
    }

    this._initializeExtensions();
    this._initializeRouter();
    this._initializeModules();
  };

  Application.prototype._initializeRouter = function() {
    if (!this.config.homeRoute) {
      throw logPrefix + '[ERROR] "homeRoute" option is not specified in the application config.';
    }

    this.router.defaultRoute(this.config.homeRoute);

    this.router.bind('routeMatched', this._routeMatched.bind(this));

    this.router.whenNotFound(this._routeNotMatched.bind(this));
  };

  Application.prototype._initializeModules = function() {
    if (!this.config.registeredModules || utils.isEmpty(this.config.registeredModules)) {
      throw logPrefix + '[ERROR] "registeredModules" option is not specified in the application config.';
    }

    var moduleNames = this.config.registeredModules;

    moduleNames.forEach(function(moduleName) {
      this.loader.loadConfigFor(moduleName).then(function(config) {
        this._initializeModule(moduleName, config);
      }.bind(this));

    }, this);
  };

  Application.prototype._initializeModule = function(moduleName, config) {
    this.config.module[moduleName] = config;
    this._addRoutesFor(moduleName, config.routes || {});

    if (this.config.fixturesEnabled) {
      this.loader.loadFixturesFor(moduleName);
    }

    if (this.isAllModulesInitialized()) {
      this._startRoute();
    }
  };

  Application.prototype._initializeExtensions = function() {
    if (!this.isExtensionsSpecified()) {
      return;
    }

    var extensions = this.config.extensions.list;
    var path = this.config.extensions.path;

    utils.forEach(extensions, function(options, extensionName) {
      if (options.enabled === false) {
        return;
      }

      this.loader.loadExtension(extensionName)
        .done(function(Extension) {

          this.registerExtension(new Extension(options, extensionName, this));

        }.bind(this));
    }, this);
  };

  Application.prototype.registerExtension = function(instance) {
    this.extensions[instance.name] = instance;
  };

  Application.prototype.registerModule = function(moduleName) {
    var d = new Deferred();

    if (this.isModuleRegistered(moduleName)) {
      d.resolve();
      return d.promise();
    }

    this.loader.loadConfigFor(moduleName).then(function(config) {
      this._initializeModule(moduleName, config);
      d.resolve();
    }.bind(this));

    return d.promise();
  };

  Application.prototype.isModuleRegistered = function(moduleName) {
    return this.config.module[moduleName];
  };

  Application.prototype.isAllModulesInitialized = function() {
    return utils.size(this.config.registeredModules) === utils.size(this.config.module);
  };

  Application.prototype._addRoutesFor = function(module, routes) {
    utils.forEach(routes, function(routeDefinition, routePattern) {
      this.router.when(routePattern, routes[routePattern]);
    }, this);
  };

  Application.prototype._routeMatched = function(params) {
    console.log('---------------------------------------------------------------------------------------------------');
    console.log(logPrefix + '[ROUTE MATCHED] Go to "'+params.controller+'" controller.');
    this.eventsBus.trigger('loading.started');

    this.switchTemplateAccordingTo(params);
  };

  Application.prototype.switchTemplateAccordingTo = function(params) {
    this.setCurrentModuleAccordingTo(params);

    if (this.currentTemplate) {
      this.templates[this.currentTemplate].systemStop();
    }

    var templateName = params.template || params.controller;

    var template = this.templates[templateName];

    if (!template) {
      template = new Template(templateName, this.eventsBus, this.loader);
      template.type = Template.CONTROLLER;

      this.loader.loadStylesheet(templateName);

      template.renderInside(this.config.appSelector).done(function() {
        this.dispatchController(params);
      }.bind(this));

      template.show();
    } else {
      template.systemResume();
      this.dispatchController(params);
    }

    this.loadModuleStyles(params);

    this.currentTemplate = templateName;
    this.templates[templateName] = template;
  };

  Application.prototype.createBootstrapFor = function(moduleName, BootstrapClass) {
    var bootstrap = new BootstrapClass(this.eventsBus, this.config.bootstrapTimeout);

    this.bootstraps[moduleName] = bootstrap;

    return bootstrap;
  };

  Application.prototype.getBootstrapFor = function(moduleName) {
    return this.bootstraps[moduleName];
  };

  Application.prototype.dispatchController = function(params) {
    var moduleName = this.loader.fetchDetailsFrom(params.controller).module;

    this.loader.loadModule(moduleName).done(function() {
      this.loader.loadModuleBootstrap(moduleName).done(function(Bootstrap) {
        this.loader.loadController(params.controller).done(function(Controller) {

          var bootstrap = this.getBootstrapFor(moduleName);

          if (!bootstrap) {
            bootstrap = this.createBootstrapFor(moduleName, Bootstrap);
          }

          bootstrap.givePromise()

            .done(function() {

              if (this.currentController) {
                this.controllers[this.currentController].systemStop();
              }

              var controllerName = params.controller;
              var controller = this.controllers[controllerName];
              var template = this.templates[this.currentTemplate];

              if(!controller) {
                controller = new Controller(params.controller, this.eventsBus);
              } else {
                controller.systemResume();
              }

              this.eventsBus.trigger('loading.finished');
              controller.respondTo(params);

              this.currentController = controllerName;
              this.controllers[controllerName] = controller;

            }.bind(this))

            .fail(function() {
              this.events.trigger('bootstrap.timeout');
            }.bind(this));

        }.bind(this));
      }.bind(this));
    }.bind(this));
  };

  Application.prototype.loadModuleStyles = function(params) {
    var moduleName = this.loader.fetchDetailsFrom(params.controller).module;
    this.loader.loadStylesheet(moduleName + '.style');
  };

  Application.prototype.getConfigFor = function(moduleName) {
    return this.config.module[moduleName];
  };

  Application.prototype.isExtensionsSpecified = function() {
    return this.config.extensions && this.config.extensions.list;
  };

  Application.prototype.setCurrentModuleAccordingTo = function(params) {
    this.currentModule = this.loader.fetchDetailsFrom(params.controller).module;
  };

  Application.prototype._routeNotMatched = function() {
    console.log('Sorry, page not found');
    window.location.hash = '#';
  };

  Application.prototype._createLoader = function() {
    return new Loader();
  };

  Application.prototype._createRouter = function() {
    return router;
  };

  Application.prototype._createEventsBus = function() {
    return new EventsBus();
  };

  Application.prototype._createSubscriber = function() {
    return new Subscriber(this.eventsBus);
  };

  Application.prototype._resetConfig = function() {
    this.config = {module: {}};
  };

  Application.prototype._setConfig = function(config) {
    this.config = config;
    this.config.module = {};
  };

  Application.prototype._startRoute = function() {
    this.router.start();
  };

  return Application;
});