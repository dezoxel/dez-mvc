// // Caustion: this spec is not intended only for testing public API, but also for
// // private mechanisms.
// // TODO: Replace existing dependencies with stubs and mocks
// define([
//   'dez-mvc/app',
//   'dez-mvc/utils',
//   'test/mocks/loader',
//   'test/mocks/router',
//   'test/mocks/renderer',
//   'test/mocks/events-bus',
//   'test/mocks/subscriber',
//   'test/mocks/deferred',
//   'test/mocks/empty-deferred',
// ], function(Application, utils, Loader, Router, Renderer, EventsBus, Subscriber, Deferred, EmptyDeferred) {
//   'use strict';

//   describe('Application', function() {

//     var app;

//     beforeEach(function() {
//       spyOn(Application.prototype, '_createLoader').andReturn(new Loader());
//       spyOn(Application.prototype, '_createRouter').andReturn(new Router());
//       spyOn(Application.prototype, '_createRenderer').andReturn(new Renderer());
//       spyOn(Application.prototype, '_createEventsBus').andReturn(new EventsBus());
//       spyOn(Application.prototype, '_createSubscriber').andReturn(new Subscriber());
//       app = new Application('development');
//     });

//     it('creates loader instance', function() {
//       expect(app._createLoader).toHaveBeenCalled();
//       expect(app.loader.loadController).toBeTruthy();
//       expect(app.loader.loadApplicationConfigFor).toBeTruthy();
//     });

//     it('creates router instance', function() {
//       expect(app._createRouter).toHaveBeenCalled();
//       expect(app.router.when).toBeTruthy();
//       expect(app.router.start).toBeTruthy();
//       expect(app.router.reset).toBeTruthy();
//       expect(app.router.defaultRoute).toBeTruthy();
//       expect(app.router.bind).toBeTruthy();
//       expect(app.router.whenNotFound).toBeTruthy();
//     });

//     it('creates renderer instance', function() {
//       expect(app.renderer.reset).toBeTruthy();
//     });

//     it('creates events bus', function() {
//       expect(app.eventsBus.when).toBeTruthy();
//       expect(app.eventsBus.then).toBeTruthy();
//       expect(app.eventsBus.trigger).toBeTruthy();
//     });

//     it('creates subscriber', function() {
//       expect(app.events.when).toBeTruthy();
//       expect(app.events.then).toBeTruthy();
//     });

//     describe('when starts', function() {

//       it('loads application config according to the environment', function() {
//         spyOn(app.loader, 'loadApplicationConfigFor').andReturn(new EmptyDeferred());

//         app.start();
//         expect(app.loader.loadApplicationConfigFor).toHaveBeenCalledWith('development');
//       });

//       it('triggers "app-config.loaded" event when application config was loaded', function() {
//         spyOn(app.eventsBus, 'trigger');

//         app.start();
//         expect(app.eventsBus.trigger).toHaveBeenCalledWith('app-config.loaded', undefined);
//       });

//       it('passes application config object to the event "app-config.loaded"', function() {
//         var appConfig = {hello: 'world'};
//         spyOn(app.loader, 'loadApplicationConfigFor').andReturn({then: function(callback) {
//           callback(appConfig);
//         }})
//         spyOn(app.eventsBus, 'trigger');

//         app.start();
//         expect(app.eventsBus.trigger).toHaveBeenCalledWith('app-config.loaded', appConfig);
//       });

//       it('throws an exception when application config was failed to load', function() {
//         var exceptionMessage = 'no message';
//         spyOn(app.loader, 'loadApplicationConfigFor').andReturn({
//           then: function(success, err) {
//             err();
//           }
//         });

//         try {
//           app.start();
//         } catch(e) {
//           exceptionMessage = e;
//         }

//         expect(exceptionMessage)
//          .toEqual('[Application] I cant load application config. Im using "development" environment');
//       });

//       describe('when application config was loaded', function() {

//         var appConfig;
//         beforeEach(function() {
//           appConfig = {hello: 'world'};

//           spyOn(app, '_initializeApplication');
//           spyOn(app.loader, 'loadApplicationConfigFor').andReturn({then: function(callback) {
//             callback(appConfig);
//           }})
//           spyOn(app.eventsBus, 'trigger').andCallFake(function() {
//             app._initializeApplication(appConfig);
//           });
//         });

//         it('initializes application', function() {
//           app.start();

//           expect(app._initializeApplication).toHaveBeenCalledWith(appConfig);
//         });

//         it('registers route changed handler when route is matched');
//         it('registers route not found handler when route is not matched');
//         it('initializes a module when its config is loaded');
//         it('starts routing when all modules initialized');

//         describe('when initializes application', function() {

//           it('saves config');
//           it('initializes router');
//           it('initializes renderer');
//           it('initializes modules');
//         });

//         describe('when initializes router', function() {

//           it('throws and exception if home controller is not specified in the application config');
//           it('registers default route');
//           it('triggers the event "route.matched" when route is matched');
//           it('triggers the event "route.not-matched" when route is not matched');
//         });

//         describe('when initializes renderer', function() {

//           it('registers template selector');
//         });

//         describe('when initializes modules', function() {

//           it('throws an exception if there are no registered modules');
//           it('loads configs for each module');
//           it('throws an exception if there are no config for any module');
//           it('triggers the event "module-config.loaded" when config is loaded');
//           it('passes module name and module config to the event "module-config.loaded"');
//         });

//         describe('when initializes a module', function() {

//           it('saves module config to application config');
//           it('adds module\'s routes to a router');
//           it('triggers "all-modules.initialized" if all modules are initialized');
//         });

//       });

//       it('checks if all modules initialized');
//       it('adds module\'s routes to a router using module name and routes');
//       it('throws an exception when route is not matched');

//       describe('when route is matched', function() {

//         it('loads controller class if is not loaded');

//         describe('when "high performance & high memory" module strategy', function() {

//           it('stops previous controller instance');
//           it('saves controller instance for future dispatches');
//           it('uses existing controller instance for dispatching');
//           it('initializes controller instance if it was just loaded');
//           it('dispatches controller');
//         });

//         describe('when "low performance & low memory" module strategy', function() {

//           it('destroys previous controller instance');
//           it('initializes controller instance if it was just loaded');
//           it('dispatches controller');
//         });

//       });

//     //   describe('initializes a router', function() {

//     //     // TODO: Figure out how to test it
//     //     it('throws an exception if default route is not specified in the application config');

//     //     it('registers default route', function() {
//     //       expect(app.router.hasAnyRoutes()).toEqual(true);
//     //     });

//     //     // TODO: Write test when error handler component is written
//     //     it('registers error handler when route is not matched');

//     //     // TODO: Write test when route match handler is written
//     //     it('registers route matched handler');
//     //   });

//     //   describe('initializes modules', function() {

//     //     // TODO: Figure out how to test it
//     //     it('throws an exception when there are no registered modules');

//     //     it('loads all of the modules configs', function() {
//     //       ['home', 'test'].forEach(function(moduleName) {
//     //         expect(app.config.module[moduleName]).toBeTruthy();
//     //       })
//     //     });

//     //     // TODO: Figure out way which is not disclosing private structure
//     //     it('registers modules routes', function() {
//     //       expect(utils.size(app.router._routes)).toEqual(3);
//     //       expect(app.router._routes['test/hello/:id']).toBeTruthy();
//     //       expect(app.router._routes['test/:id/world']).toBeTruthy();
//     //     });

//     //     // TODO: Figure out how to test it
//     //     it('starts routing process when all modules loaded');

//     //   });

//     //   it('initializes renderer', function() {
//     //     expect(app.renderer.layoutSelector).toEqual('#app');
//     //   });

//     });

//     // describe('when stops', function() {

//     //   // all work is going asynchronously, after loading app config
//     //   beforeEach(function() {
//     //     runs(function() {
//     //       app.start();
//     //     });

//     //     waits(50);

//     //     runs(function() {
//     //       app.stop();
//     //     });
//     //   })

//     //   it('unbinds all of the registered events', function() {
//     //     utils.forEach(app._events, function(handlers) {
//     //       expect(handlers.length).toEqual(0);
//     //     });
//     //   });

//     //   it('cleans an application config', function() {
//     //     expect(app.config).toEqual({module:{}});
//     //   });

//     //   it('resets a router', function() {
//     //     expect(app.router.hasAnyRoutes()).toEqual(false);
//     //   });

//     //   it('resets a loader', function() {
//     //     expect(app.loader.getApplicationPath()).toEqual('.');
//     //   });

//     // });

//   });

// });
  //   it('loads controller stylesheet after layout was rendered', function() {
  //     var UserController = BaseController.extend({});
  //     var controller = new UserController('home.index', eventsBus, subscriber);

  //     spyOn(controller.view, 'renderLayout').andReturn({
  //       then: function(callback) { return callback(); }
  //     });
  //     spyOn(controller.view, 'renderContent').andReturn({then: function() {}});
  //     spyOn(controller.view.loader, 'loadStylesheet');

  //     controller.respondTo(routeParams);

  //     expect(controller.view.loader.loadStylesheet).toHaveBeenCalledWith('home.style');
  //   });

  //   it('creates dom control for registering dom event handlers', function() {
  //     var isPerformed = false;
  //     runs(function() {
  //       document.body.innerHTML = '<div data-content><div class="hello">Hello</div></div>';
  //       var UserController = BaseController.extend({
  //         domEvents: {
  //           '.hello click': function() {
  //             isPerformed = true;
  //           }
  //         }
  //       });
  //       var controller = new UserController('home.index', eventsBus, subscriber);
  //       spyOn(controller.view, 'renderLayout').andReturn({then: function(cb) {return cb()}});
  //       spyOn(controller.view, 'renderContent').andReturn({then: function(cb) {return cb()}});
  //       controller.respondTo(routeParams);

  //       $('.hello').click();
  //     });

  //     waits(1);

  //     runs(function() {
  //       expect(isPerformed).toEqual(true);
  //     });
  //   });

  // function getLoaderStub() {
  //   return {
  //     loadTemplate: function() {
  //       return getDeferredStub();
  //     },
  //     loadStylesheet: function() {
  //       return getDeferredStub();
  //     },
  //   };
  // }

  // function getDeferredStub() {
  //   return {
  //     resolve: function() {},
  //     then: function() {}
  //   }
  // }

