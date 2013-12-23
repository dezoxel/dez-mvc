define(['dez-mvc/deferred'], function(Deferred) {
  'use strict';

  function Loader() {
    this.appPath = '.';
    this.libPath = this.appPath + '/lib';
    this.modulePath = this.appPath + '/module';
    this.configPath = this.appPath + '/config';
    this.moduleAssetsPath = '/assets';
    this.templatesPath = this.libPath + '/template';
    this.componentsPath = this.libPath + '/component';
  }

  // TODO: Avoid specifying config extension
  Loader.prototype.loadApplicationConfig = function() {
    var d = new Deferred();

    var appConfigPath = this.configPath + '/config.json';

    require(['text!' + appConfigPath], function(config) {
      d.resolve(JSON.parse(config));
    });

    return d.promise();
  };

  // TODO: Avoid specifying config extension
  Loader.prototype.loadConfigFor = function(moduleName) {
    var d = new Deferred();

    var moduleConfigPath = this.modulePath + '/' + moduleName + '/config/config.json';

    require(['text!' + moduleConfigPath], function(rawConfig) {
      // TODO: Is it good solution? I guess no. We have to see "text!" plugin exception, but actually we are not
      try {
        var config = JSON.parse(rawConfig);
      } catch(e) {
        console.error('Loader: Parsing config error for "' + moduleName + '"');
        d.reject();
      }
      d.resolve(config);
    });

    return d.promise();
  };

  Loader.prototype.loadController = function(alias) {
    var d = new Deferred();

    var details = this.fetchDetailsFrom(alias);
    var controllerPath =  this.modulePath + '/' + details.module + '/controller/' + details.entity;

    require([controllerPath], function(Controller) {
      d.resolve(Controller);
    });

    return d.promise();
  };

  // TODO: Avoid specifying template extension
  Loader.prototype.loadTemplate = function(alias) {
    var d = new Deferred();

    var details = this.fetchDetailsFrom(alias);
    var module = details.module;
    var entity = details.entity;

    var templatePath;
    if (module === 'lib') {
      templatePath =  this.templatesPath + '/' + entity + '/template.ejs';
    } else {
      templatePath = this.modulePath + '/' + module + '/template/' + entity + '/template.ejs';
    }

    require(['text!' + templatePath], function(template) {
      d.resolve(template);
    });

    return d.promise();
  };

  // TODO: Avoid specifying stylesheet extension
  Loader.prototype.loadStylesheet = function(alias) {
    var d = new Deferred();

    var details = this.fetchDetailsFrom(alias);
    var module = details.module;
    var entity = details.entity;

    var stylesheetPath;
    if (module === 'lib') {
      stylesheetPath = this.templatesPath + '/' + entity + '/template.css';
    } else {
      stylesheetPath = this.modulePath + '/' + module + this.moduleAssetsPath + '/stylesheets/' + entity + '.css';
    }

    require(['css!' + stylesheetPath], function(stylesheet) {
      d.resolve(stylesheet);
    });

    return d.promise();
  };

  Loader.prototype.loadComponentController = function(alias) {
    var d = new Deferred();

    var details = this.fetchDetailsFrom(alias);
    var module = details.module;
    var entity = details.entity;
    var controllerPath;
    if (module === 'lib') {
      controllerPath =  'platform/component/' + entity + '/component';
    } else {
      controllerPath =  this.modulePath + '/' + module + '/component/' + entity + '/component';
    }

    require([controllerPath], function(Controller) {
      d.resolve(Controller);
    });

    return d.promise();
  };

  // TODO: Avoid specifying template extension
  Loader.prototype.loadComponentTemplate = function(alias) {
    var d = new Deferred();

    var details = this.fetchDetailsFrom(alias);
    var module = details.module;
    var entity = details.entity;
    var templatePath;
    if (module === 'lib') {
      templatePath = this.componentsPath + '/' + entity + '/component.ejs';
    } else {
      templatePath = this.modulePath + '/' + module + '/component/' + entity + '/component.ejs';
    }

    require(['text!' + templatePath], function(template) {
      d.resolve(template);
    });

    return d.promise();
  };

  // TODO: Avoid specifying stylesheet extension
  Loader.prototype.loadComponentStylesheet = function(alias) {
    var d = new Deferred();

    var details = this.fetchDetailsFrom(alias);
    var module = details.module;
    var entity = details.entity;
    var stylesheetPath;
    if (module === 'lib') {
      stylesheetPath = this.componentsPath + '/' + entity + '/component.css';
    } else {
      stylesheetPath = this.modulePath + '/' + module + '/component/' + entity + '/component.css';
    }

    require(['css!' + stylesheetPath], function(stylesheet) {
      d.resolve(stylesheet);
    });

    return d.promise();
  };

  Loader.prototype.loadFixturesFor = function(moduleName) {
    var d = new Deferred();

    var moduleFixturePath = this.modulePath + '/' + moduleName + '/fixtures';

    require([moduleFixturePath], function(fixtures) {
      d.resolve(fixtures);
    });

    return d.promise();
  };

  Loader.prototype.loadExtension = function(extName) {
    var d = new Deferred();

    var path = 'dez-extensions/' + extName + '/extension';

    require([path], function(Extension) {
      d.resolve(Extension);
    });

    return d.promise();
  };

  Loader.prototype.loadModuleBootstrap = function(moduleName) {
    var d = new Deferred();

    var path = this.modulePath + '/' + moduleName + '/bootstrap';

    require([path], function(Bootstrap) {
      d.resolve(Bootstrap);
    });

    return d.promise();
  };

  Loader.prototype.loadModule = function(moduleName) {
    var d = new Deferred();

    var path = this.modulePath + '/' + moduleName + '/module';

    require([path], function() {
      d.resolve();
    });

    return d.promise();
  };

  Loader.prototype.fetchDetailsFrom = function(alias) {
    var details = alias.split('.');
    return {module: details[0], entity: details[1]};
  };

  Loader.prototype.setLibPath = function(path) {
    this.libPath = path;
  };

  Loader.prototype.getLibPath = function() {
    return this.libPath;
  };

  Loader.prototype.setModulePath = function(path) {
    this.modulePath = path;
  };

  Loader.prototype.getModulePath = function() {
    return this.modulePath;
  };

  Loader.prototype.setAppPath = function(path) {
    this.appPath = path;
  };

  Loader.prototype.getAppPath = function() {
    return this.appPath;
  };

  Loader.prototype.setConfigPath = function(path) {
    this.configPath = path;
  };

  Loader.prototype.getConfigPath = function() {
    return this.configPath;
  };

  Loader.prototype.setModuleAssetsPath = function(name) {
    this.moduleAssetsPath = name;
  };

  Loader.prototype.getModuleAssetsPath = function() {
    return this.moduleAssetsPath;
  };

  Loader.prototype.setTemplatesPath = function(path) {
    this.templatesPath = path;
  };

  Loader.prototype.getTemplatesPath = function() {
    return this.templatesPath;
  };

  Loader.prototype.setComponentsPath = function(path) {
    this.componentsPath = path;
  };

  Loader.prototype.getComponentsPath = function() {
    return this.componentsPath;
  };

  return Loader;
});