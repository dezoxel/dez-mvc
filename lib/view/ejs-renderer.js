// TODO: Avoid jQuery dependency
// TODO: Use separate version of Deferred lib
// TODO: Avoid CanJS dependency
define(['dez-mvc/loader', 'can', 'jquery', 'dez-mvc/events-bus'], function(loader, can, $, events) {
  return {
    _prevLayoutAlias: null,
    _element: document.body,

    renderLayout: function(alias, afterRenderCallback) {
      var d = new $.Deferred();

      if (this.isLayoutChanged(alias)) {

        loader.loadTemplate(alias).done(function(template) {
          this._element.innerHTML = template;

          this._prevLayoutAlias = alias;

          d.resolve();
        }.bind(this));

        loader.loadStylesheet(loader.fetchDetailsFrom(alias).module + '.style');

      } else {
        d.resolve();
      }

      return d.promise();
    },

    isLayoutChanged: function(newLayoutAlias) {
      return this._prevLayoutAlias != newLayoutAlias;
    },

    processComponentsWith: function(params) {
      // just for readability of code
      var viewVars = this;
      var renderer = this;

      var domComponents = document.querySelectorAll('[data-component]');

      // because domComponents is a NodeList that don't have a Array in his prototype
      [].forEach.call(domComponents, function(domComponent) {

        var componentAlias = domComponent.dataset.component;
        var componentDomReady = events.createDeferredWithName(componentAlias + '.domReady');

        var componentDeferred = loader.loadComponent(componentAlias);
        var templateDeferred = loader.loadComponentTemplate(componentAlias);
        var stylesheetDeferred = loader.loadComponentStylesheet(componentAlias);

        $.when(componentDeferred, templateDeferred, stylesheetDeferred).done(function(component, template, stylesheet) {
          component.setEventsBus(events);
          component.setup(domComponent);
          component.respondTo(viewVars);

          var rendererFunction = can.view.ejs(template);
          var fragment = rendererFunction(component);

          renderer._updateDomNodeWith(domComponent, fragment);
          componentDomReady.resolve();
        });

      });

    },

    renderContent: function(alias, viewVars) {
      var contentDomReady = events.createDeferredWithName('content.domReady');

      return loader.loadTemplate(alias).done(function(template) {
        var rendererFunction = can.view.ejs(template);
        var domContent = document.querySelector('[data-content]');
        if (!domContent) {
          throw 'Renderer: "data-content" attribute is not specified in a layout';
        }
        var fragment = rendererFunction(viewVars);

        this._updateDomNodeWith(domContent, fragment);
        contentDomReady.resolve();

      }.bind(this));

    },

    setElementBySelector: function(selector) {
      this._element = document.querySelector(selector);
    },

    getElement: function() {
      return this._element;
    },

    _updateDomNodeWith: function(domNode, fragment) {
      domNode.innerHTML = '';
      domNode.appendChild(fragment);
    }

  };
});

