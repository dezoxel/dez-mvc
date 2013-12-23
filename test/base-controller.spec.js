define([
  'dez-mvc/base-controller',
  'dez-mvc/events/bus',
  'dez-mvc/view-model',
], function(BaseController, EventsBus, ViewModel) {
  'use strict';

  describe('BaseController', function() {

    var eventsBus;
    var viewModel;
    var routeParams;

    beforeEach(function() {
      // loader = getLoaderStub();
      eventsBus = new EventsBus();
      viewModel = new ViewModel();
      routeParams = {hello: 'world', controller: 'home.index'};

      // spyOn(renderer.loader, 'loadTemplate').andCallFake(function() {
      //   return {
      //     then: function(callback) {
      //       callback('Hello, <%= name %>');
      //     }
      //   }
      // });
    });

    it('implements inheritance for user controllers', function() {
      var UserController = BaseController.extend({
        hello: function() {
          return 'world';
        }
      });

      var controller = new UserController('home.index', eventsBus, viewModel);
      expect(controller.hello()).toEqual('world');
    });

    it('supports events bus for communication with other components', function() {
      var UserController = BaseController.extend({});

      var controller = new UserController('home.index', eventsBus, viewModel);

      expect(controller.eventsBus.when).toBeTruthy();
      expect(controller.eventsBus.then).toBeTruthy();
    });

    it('requires view model', function() {
      var UserController = BaseController.extend({});

      var controller = new UserController('home.index', eventsBus, viewModel);

      expect(controller.viewModel.unbindAllDomEvents).toBeTruthy();
      expect(controller.viewModel.registerDomEventOn).toBeTruthy();
    });

    it('supports user initialization for controllers', function() {
      var UserController = BaseController.extend({
        init: function() {
          this.hello = 'world';
        }
      });

      var controller = new UserController('home.index', eventsBus, viewModel);
      expect(controller.hello).toEqual('world');
    });

    it('supports user destroying for controllers', function() {
      var someExternal = 0;
      var UserController = BaseController.extend({
        init: function() {
          someExternal = 5;
        },
        destroy: function() {
          someExternal = 0;
        }
      });

      expect(someExternal).toEqual(0);

      var controller = new UserController('home.index', eventsBus, viewModel);
      expect(someExternal).toEqual(5);

      controller.systemDestroy();
      expect(someExternal).toEqual(0);
    });

    it('unbinds all events registered in the events bus when controller is destroyed', function() {
      var UserController = BaseController.extend({});

      var controller = new UserController('home.index', eventsBus, viewModel);

      spyOn(controller.events, 'unbindAll');

      controller.systemDestroy();
      expect(controller.events.unbindAll).toHaveBeenCalled();
    });

    it('unbinds all dom events when controller is destroyed', function() {
      var UserController = BaseController.extend({});

      var controller = new UserController('home.index', eventsBus, viewModel);

      spyOn(controller.viewModel, 'unbindAllDomEvents');

      controller.systemDestroy();
      expect(controller.viewModel.unbindAllDomEvents).toHaveBeenCalled();
    });

    it('defines main controller action', function() {
      var UserController = BaseController.extend({
        dispatch: function(params) {
          this.hello = params.hello;
        },
      });

      var controller = new UserController('home.index', eventsBus, viewModel);
      controller.respondTo(routeParams);
      expect(controller.hello).toEqual('world');
    });

    it('allows perform actions before controller will be dispatched', function() {
      var isPerformed = false;
      var UserController = BaseController.extend({
        init: function() {
          this.events.when('controller.before.dispatched').then(function() {
            isPerformed = true;
          }.bind(this));
        },
      });

      var controller = new UserController('home.index', eventsBus, viewModel);
      controller.respondTo(routeParams);

      expect(isPerformed).toEqual(true);
    });

    it('allows perform actions after controller will be dispatched', function() {
      var isPerformed = false;
      var UserController = BaseController.extend({
        init: function() {
          this.events.when('controller.dispatched').then(function() {
            isPerformed = true;
          }.bind(this));
        },
      });

      var controller = new UserController('home.index', eventsBus, viewModel);
      controller.respondTo(routeParams);

      expect(isPerformed).toEqual(true);
    });

    it('stops controller and unbinds all events from events bus', function() {
      var UserController = BaseController.extend({});
      var controller = new UserController('home.index', eventsBus, viewModel);

      spyOn(controller.events, 'unbindAllAndSave');

      controller.respondTo(routeParams);
      controller.systemStop();

      expect(controller.events.unbindAllAndSave).toHaveBeenCalled();
    });

    it('supports user stopping of controllers', function() {
      var isStopped = false;
      var UserController = BaseController.extend({
        stop: function() {
          isStopped = true;
        }
      });
      var controller = new UserController('home.index', eventsBus, viewModel);

      controller.respondTo(routeParams);
      controller.systemStop();

      expect(isStopped).toBe(true);
    });

    it('resumes controller and rebinds all events', function() {
      var UserController = BaseController.extend({});
      var controller = new UserController('home.index', eventsBus, viewModel);

      spyOn(controller.events, 'rebindAll');

      controller.respondTo(routeParams);
      controller.systemStop();
      controller.systemResume();

      expect(controller.events.rebindAll).toHaveBeenCalled();
    });

    it('supports user resuming', function() {
      var isResumed = false;
      var UserController = BaseController.extend({
        resume: function() {
          isResumed = true;
        }
      });
      var controller = new UserController('home.index', eventsBus, viewModel);

      controller.respondTo(routeParams);
      controller.systemStop();
      controller.systemResume();

      expect(isResumed).toBe(true);
    });

  });

});