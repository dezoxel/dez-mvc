define(['dez-mvc/utils', 'can', 'dez-mvc/view-model', 'dez-mvc/deferred'], function(utils, can, ViewModel, Deferred) {
  'use strict';

  function Template(alias, eventsBus, loader, element) {
    this.alias = alias;
    this.eventsBus = eventsBus;
    this.loader = loader;
    this.element = element || this.createDomElementFor(alias);
    this.componentSelector = '[data-component]';
    this.components = {};
    this.templates = {};
    this.viewModel = new ViewModel();
    this.countComponents = 0;
  }

  Template.CONTROLLER = 1;
  Template.COMPONENT = 2;

  Template.prototype.createDomElementFor = function(alias) {
    var div = document.createElement('div');
    div.id = alias;
    div.style.display = 'none';
    return div;
  };

  Template.prototype.systemResume = function() {
    this.show();

    this.viewModel.rebindAllDomEvents();

    this.resumeComponents();
  };

  Template.prototype.systemStop = function() {
    this.hide();

    this.viewModel.unbindAllDomEventsAndSave();

    this.stopComponents();
  };

  Template.prototype.resumeComponents = function() {
    utils.forEach(this.components, function(component) {
      component.events.rebindAll();
    });

    utils.forEach(this.templates, function(template) {
      template.systemResume();
    });

  };

  Template.prototype.stopComponents = function() {
    utils.forEach(this.components, function(component) {
      component.events.unbindAllAndSave();
    });

    utils.forEach(this.templates, function(template) {
      template.systemStop();
    });
  };

  Template.prototype.show = function() {
    this.element.style.display = 'block';
    if (this.type === Template.CONTROLLER) {
      this.element.classList.add('current-template');
    }
  };

  Template.prototype.hide = function() {
    this.element.style.display = 'none';
    if (this.type === Template.CONTROLLER) {
      this.element.classList.remove('current-template');
    }
  };

  Template.prototype.renderInside = function(parent) {
    var d = new Deferred();
    var parentElement = (typeof parent === 'string') ? document.querySelector(parent) : parent;

    this.loader.loadTemplate(this.alias).then(function(templateSource) {

      var rendererFunction = can.view.ejs(templateSource);
      var compiledTemplate = rendererFunction(this.viewModel);
      this.element.appendChild(compiledTemplate);
      parentElement.appendChild(this.element);

      this.processComponents().done(function() {
        d.resolve();
      });

    }.bind(this));

    return d.promise();
  };

  Template.prototype.render = function() {
    this.loader.loadComponentTemplate(this.alias).then(function(templateSource) {

      var rendererFunction = can.view.ejs(templateSource);
      var compiledTemplate = rendererFunction(this.viewModel);
      this.element.appendChild(compiledTemplate);

      this.viewModel.bindDomEventsInside(this.element);

      this.eventsBus.trigger(this.alias + '.template.rendered');

      this.processComponents();
    }.bind(this));
  };

  Template.prototype.processComponents = function() {
    var d = new Deferred();

    var domComponents = this.findComponentsInside(this.element);

    this.loadComponents(domComponents).done(function() {

      utils.forEach(arguments, function(Component, i) {
        var domComponent = domComponents[i];
        var componentAlias = domComponent.dataset.component;

        this.dispatchComponent(componentAlias, Component, domComponent);
      }, this);

      d.resolve();
    }.bind(this));

    return d.promise();
  };

  Template.prototype.loadComponents = function(domComponents) {
    var allLoaded = [];

    utils.forEach(domComponents, function(domComponent) {
      var componentAlias = domComponent.dataset.component;

      allLoaded.push(this.loader.loadComponentController(componentAlias));
    }, this);

    return Deferred.when(allLoaded);
  };

  Template.prototype.findComponentsInside = function(parentElement) {
    var parentNode = parentElement;

    if (typeof parentElement === 'string') {
      parentNode = document.querySelector(parentElement);
    }

    return parentNode.querySelectorAll(this.componentSelector);
  };

  Template.prototype.dispatchComponent = function(alias, Component, domComponent) {
    var template = new Template(alias, this.eventsBus, this.loader, domComponent);
    var component = new Component(alias, this.eventsBus, domComponent, template.viewModel);

    this.components[alias] = component;
    this.templates[alias] = template;

    this.loader.loadComponentStylesheet(alias);

    template.render();
    template.show();

    component.systemDispatch();
  };

  Template.prototype.isAllComponentsInitialized = function() {
    return utils.size(this.components) === this.countComponents;
  };

  return Template;
});