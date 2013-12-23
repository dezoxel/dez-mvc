// define([
//   'dez-mvc/base-component',
//   'dez-mvc/events/bus',
//   'dez-mvc/events/subscriber',
// ], function(BaseComponent, EventsBus, Subscriber) {
//   'use strict';

//   describe('BaseComponent', function() {

//     var alias, element, eventsBus, subscriber, loader;
//     beforeEach(function() {
//       loader = getLoaderStub();

//       alias = 'lib.header';
//       element = document.createElement('div');
//       eventsBus = new EventsBus();
//       subscriber = new Subscriber(eventsBus);
//     });

//     it('requires setting up alias', function() {
//       var UserComponent = BaseComponent.extend({});

//       var component = new UserComponent(alias, element, eventsBus, subscriber);
//       expect(component.alias).toEqual('lib.header');
//     });

//     it('implements inheritance for user components', function() {
//       var UserComponent = BaseComponent.extend({
//         hello: function() {
//           return 'world';
//         }
//       });

//       var component = new UserComponent(alias, element, eventsBus, subscriber);
//       expect(component.hello()).toEqual('world');
//     });

//     it('supports events bus for communication with other components', function() {
//       var UserComponent = BaseComponent.extend({});

//       var component = new UserComponent(alias, element, eventsBus, subscriber);

//       expect(component.eventsBus.when).toBeTruthy();
//       expect(component.eventsBus.then).toBeTruthy();
//     });

//     it('supports user initialization for components', function() {
//       var UserComponent = BaseComponent.extend({
//         init: function() {
//           this.hello = 'world';
//         }
//       });

//       var component = new UserComponent(alias, element, eventsBus, subscriber);
//       expect(component.hello).toEqual('world');
//     });

//     it('supports user destroying for components', function() {
//       var someExternal = 0;
//       var UserComponent = BaseComponent.extend({
//         destroy: function() {
//           someExternal = 5;
//         }
//       });

//       var component = new UserComponent(alias, element, eventsBus, subscriber);
//       expect(someExternal).toEqual(0);

//       component.destructor();
//       expect(someExternal).toEqual(5);
//     });

//     it('supports a subscriber for tracking registered events in the events bus', function() {
//       var someExternal = 0;
//       var UserComponent = BaseComponent.extend({
//         init: function() {
//           this.events.when('some.event').then(function() {
//             someExternal = 5;
//           });
//         }
//       });
//       expect(someExternal).toEqual(0);

//       var component = new UserComponent(alias, element, eventsBus, subscriber);

//       eventsBus.trigger('some.event');
//       expect(someExternal).toEqual(5);
//     });

//     it('unbinds all events registered in the events bus when component is destroyed', function() {
//       var UserComponent = BaseComponent.extend({});

//       var component = new UserComponent(alias, element, eventsBus, subscriber);

//       spyOn(component.events, 'unbindAll');

//       component.destructor();
//       expect(component.events.unbindAll).toHaveBeenCalled();
//     });

//     it('defines main component action', function() {
//       var UserComponent = BaseComponent.extend({
//         dispatch: function(params) {
//           this.hello = params.hello;
//         },
//       });

//       var component = new UserComponent(alias, element, eventsBus, subscriber);

//       spyOn(component.renderer, 'renderComponent').andReturn({then: function() {}})

//       component.respondTo({hello: 'world'});
//       expect(component.hello).toEqual('world');
//     });

//     it('allows perform actions before component will be dispatched', function() {
//       var isPerformed = false;
//       var UserComponent = BaseComponent.extend({
//         init: function() {
//           this.events.when('lib.header.before.dispatched').then(function() {
//             isPerformed = true;
//           }.bind(this));
//         },
//       });

//       var component = new UserComponent(alias, element, eventsBus, subscriber);

//       spyOn(component.renderer, 'renderComponent').andReturn({then: function() {}})

//       component.respondTo({});
//       expect(isPerformed).toEqual(true);
//     });

//     it('allows perform actions after component will be dispatched', function() {
//       var isPerformed = false;
//       var UserComponent = BaseComponent.extend({
//         init: function() {
//           this.events.when('lib.header.dispatched').then(function() {
//             isPerformed = true;
//           }.bind(this));
//         },
//       });

//       var component = new UserComponent(alias, element, eventsBus, subscriber);

//       spyOn(component.renderer, 'renderComponent').andReturn({then: function() {}})

//       component.respondTo({});
//       expect(isPerformed).toEqual(true);
//     });

//     it('requires view renderer', function() {
//       var UserComponent = BaseComponent.extend({});

//       var component = new UserComponent(alias, element, eventsBus, subscriber);

//       expect(component.renderer.renderComponent).toBeTruthy();
//     });

//     it('renders component template after component dispatched', function() {
//       var UserComponent = BaseComponent.extend({});
//       var component = new UserComponent(alias, element, eventsBus, subscriber);

//       spyOn(component.renderer, 'renderComponent').andReturn({then: function() {}})
//       spyOn(component.renderer, 'isAllComponentsDispatched').andReturn(true);

//       component.respondTo({});

//       expect(component.renderer.renderComponent).toHaveBeenCalled();
//     });

//     it('allows perform actions before component template will be rendered', function() {
//       var isPerformed = false;
//       var UserComponent = BaseComponent.extend({
//         init: function() {
//           this.events.when('lib.header.template.before.rendered').then(function() {
//             isPerformed = true;
//           }.bind(this));
//         },
//       });

//       var component = new UserComponent(alias, element, eventsBus, subscriber);
//       spyOn(component.renderer, 'renderComponent').andReturn({then: function(cb) {cb()}})
//       spyOn(component.renderer, 'isAllComponentsDispatched').andReturn(true);
//       component.respondTo({});

//       expect(isPerformed).toEqual(true);
//     });

//     it('allows perform actions after component template will be rendered', function() {
//       var isPerformed = false;
//       var UserComponent = BaseComponent.extend({
//         init: function() {
//           this.events.when('lib.header.template.rendered').then(function() {
//             isPerformed = true;
//           }.bind(this));
//         },
//       });

//       var component = new UserComponent(alias, element, eventsBus, subscriber);
//       spyOn(component.renderer, 'renderComponent').andReturn({then: function(cb) {cb()}})
//       spyOn(component.renderer, 'isAllComponentsDispatched').andReturn(true);
//       component.respondTo({});
//       expect(isPerformed).toEqual(true);
//     });

//     it('processes components inside rendered components', function() {
//       var UserComponent = BaseComponent.extend({});

//       var component = new UserComponent(alias, element, eventsBus, subscriber);
//       spyOn(component.renderer, 'renderComponent').andReturn({then: function(cb) {cb()}})
//       spyOn(component.renderer, 'findComponentsInside');
//       spyOn(component.renderer, 'processComponents');
//       spyOn(component.renderer, 'isAllComponentsDispatched').andReturn(true);

//       component.respondTo({});

//       expect(component.renderer.findComponentsInside).toHaveBeenCalledWith(element);
//       expect(component.renderer.processComponents).toHaveBeenCalled();
//     });

//     it('loads component stylesheet after template was rendered', function() {
//       var UserComponent = BaseComponent.extend({});
//       var component = new UserComponent(alias, element, eventsBus, subscriber);

//       spyOn(component.renderer, 'renderComponent').andReturn({then: function(cb) {return cb();}});
//       spyOn(component.renderer.loader, 'loadComponentStylesheet');
//       spyOn(component.renderer, 'isAllComponentsDispatched').andReturn(true);

//       component.respondTo({});

//       expect(component.renderer.loader.loadComponentStylesheet).toHaveBeenCalledWith('lib.header');
//     });

//     it('creates dom control for registering dom event handlers', function() {
//       var isPerformed = false;
//       runs(function() {
//         document.body.innerHTML = '<div data-component="lib.header"><div class="hello">Hello</div></div>';
//         var element = document.querySelector('[data-component]');
//         var UserComponent = BaseComponent.extend({
//           domEvents: {
//             '.hello click': function() {
//               isPerformed = true;
//             }
//           }
//         });
//         var component = new UserComponent(alias, element, eventsBus, subscriber);
//         spyOn(component.renderer, 'renderComponent').andReturn({then: function(cb) {return cb()}});
//         spyOn(component.renderer, 'isAllComponentsDispatched').andReturn(true);
//         component.respondTo({});

//         $('.hello').click();
//       });

//       waits(1);

//       runs(function() {
//         expect(isPerformed).toEqual(true);
//       });
//     });

//     it('each component event handler gets component instance', function() {
//       var UserComponent = BaseComponent.extend({
//         init: function() {
//           this.events.when('lib.header.before.dispatched').then(function(component) {
//             component.view.hello = 'world';
//           }.bind(this));
//         },
//       });

//       var component = new UserComponent(alias, element, eventsBus, subscriber);
//       spyOn(component.renderer, 'renderComponent').andReturn({then: function(cb) {cb()}})
//       component.respondTo({});
//       expect(component.view.hello).toEqual('world');
//     });

//     // TODO: Implement
//     it('checks if all components were dispatched');

//   });

//   function getLoaderStub() {
//     return {
//       loadTemplate: function() {},
//       loadComponentStylesheet: function() {},
//     };
//   }
// });