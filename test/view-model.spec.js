define(['dez-mvc/view-model', 'dez-mvc/events/dom-subscriber'], function(ViewModel, DomSubscriber) {
  'use strict';

  describe('ViewModel', function() {

    var viewModel;
    var element;

    beforeEach(function() {
      viewModel = new ViewModel();
      element = createElement();

      viewModel.registerDomEventOn(element).when('click').then(viewModel[element.dataset.click]);
    });

    it('stores array of DomSubscribers for each dom element', function() {
      expect(viewModel.domSubscribers instanceof Array).toBe(true);
    });

    describe('when register dom event on element', function() {

      it('creates new DomSubscriber object', function() {
        expect(viewModel.domSubscribers[0] instanceof DomSubscriber).toBe(true);
      });

      it('registers new event handler in subscriber', function() {
        expect(viewModel.domSubscribers[0].handlers.click.length).toEqual(1);
      });
    });

    it('unbinds all event handles for each element', function() {
      spyOn(viewModel.domSubscribers[0], 'unbindAllAndSave');

      viewModel.unbindAllDomEventsAndSave();

      expect(viewModel.domSubscribers[0].unbindAllAndSave).toHaveBeenCalled();
    });

    it('rebinds all event handles for each element', function() {
      spyOn(viewModel.domSubscribers[0], 'rebindAll');

      viewModel.unbindAllDomEventsAndSave();
      viewModel.rebindAllDomEvents();

      expect(viewModel.domSubscribers[0].rebindAll).toHaveBeenCalled();
    });

  });

  function createElement() {
    return document.createElement('div');
  }

});