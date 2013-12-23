define(['dez-mvc/loader'], function(Loader) {
  'use strict';

  describe('Loader', function() {

    var loader;

    beforeEach(function() {
      loader = new Loader();
      loader.setModulePath('.');
    });

    it('loads application config file and parses JSON', function() {
      spyOn(window, 'require');

      loader.loadApplicationConfig();

      expect(require).toHaveBeenCalledWith(['text!./config/config.json'], jasmine.any(Function));
    });

    it('parses JSON for application config file', function() {
      spyOn(window, 'require').andCallFake(function(deps, cb) {
        cb('{"hello":"world"}');
      });

      loader.loadApplicationConfig().then(function(config) {
        expect(config.hello).toEqual('world');
      });
    });

    it('loads module config file', function() {
      spyOn(window, 'require');

      loader.loadConfigFor('home');

      expect(require).toHaveBeenCalledWith(['text!./home/config/config.json'], jasmine.any(Function));
    });

    it('parses JSON for module config file', function() {
      spyOn(window, 'require').andCallFake(function(deps, cb) {
        cb('{"hello":"world"}');
      });

      loader.loadConfigFor('home').then(function(config) {
        expect(config.hello).toEqual('world');
      });
    });

    it('loads controller file', function() {
      spyOn(window, 'require');

      loader.loadController('home.index');

      expect(require).toHaveBeenCalledWith(['./home/controller/index'], jasmine.any(Function));
    });

    it('loads template file', function() {
      spyOn(window, 'require');

      loader.loadTemplate('home.index');

      expect(require).toHaveBeenCalledWith(['text!./home/template/index/template.ejs'], jasmine.any(Function));
    });

    it('loads template file from library', function() {
      spyOn(window, 'require');

      loader.loadTemplate('lib.list');

      expect(require).toHaveBeenCalledWith(['text!./lib/template/list/template.ejs'], jasmine.any(Function));
    });

    it('loads stylesheet file', function() {
      spyOn(window, 'require');

      loader.loadStylesheet('home.index');

      expect(require).toHaveBeenCalledWith(['css!./home/assets/stylesheets/index.css'], jasmine.any(Function));
    });

    it('loads stylesheet file from library', function() {
      spyOn(window, 'require');

      loader.loadStylesheet('lib.list');

      expect(require).toHaveBeenCalledWith(['css!./lib/template/list/template.css'], jasmine.any(Function));
    });

    it('fetches information about module and entity name from "entity alias"', function() {
      expect(loader.fetchDetailsFrom('home.index')).toEqual({module: 'home', entity: 'index'});
    });

    it('loads component controller file from module', function() {
      spyOn(window, 'require');

      loader.loadComponentController('home.header');

      expect(require).toHaveBeenCalledWith(['./home/component/header/component'], jasmine.any(Function));
    });

    it('loads component controller file from library', function() {
      spyOn(window, 'require');

      loader.loadComponentController('lib.header');

      expect(require).toHaveBeenCalledWith(['./lib/component/header/component'], jasmine.any(Function));
    });

    it('loads component template file from module', function() {
      spyOn(window, 'require');

      loader.loadComponentTemplate('home.header');

      expect(require).toHaveBeenCalledWith(['text!./home/component/header/component.ejs'], jasmine.any(Function));
    });

    it('loads component template file from library', function() {
      spyOn(window, 'require');

      loader.loadComponentTemplate('lib.header');

      expect(require).toHaveBeenCalledWith(['text!./lib/component/header/component.ejs'], jasmine.any(Function));
    });

    it('loads component stylesheet file from module', function() {
      spyOn(window, 'require');

      loader.loadComponentStylesheet('home.header');

      expect(require).toHaveBeenCalledWith(['css!./home/component/header/component.css'], jasmine.any(Function));
    });

    it('loads component stylesheet file from library', function() {
      spyOn(window, 'require');

      loader.loadComponentStylesheet('lib.header');

      expect(require).toHaveBeenCalledWith(['css!./lib/component/header/component.css'], jasmine.any(Function));
    });

    it('loads fixtures for module', function() {
      spyOn(window, 'require');

      loader.loadFixturesFor('home');

      expect(require).toHaveBeenCalledWith(['./home/fixtures'], jasmine.any(Function));
    });

  });

});