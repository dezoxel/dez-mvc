define(['dez-mvc/utils'], function(utils) {
  'use strict';

  describe('utils', function() {

    describe('when embed base64 to html', function() {

      it('creates base64 string ready for using in html', function() {
        expect(utils.embedBase64ToHtml('ivh465h')).toEqual('data:image/png;base64, ivh465h');
      });

      it('returns an empty string if base64 string is empty', function() {
        expect(utils.embedBase64ToHtml('')).toEqual('');
      });

      it('uses image/png Content-Type by default', function() {
        expect(utils.embedBase64ToHtml('ivh465h')).toEqual('data:image/png;base64, ivh465h');
      });

      it('has support of specifying content type', function() {
        expect(utils.embedBase64ToHtml('ivh465h', 'image/jpeg')).toEqual('data:image/jpeg;base64, ivh465h');
      });
    });

  });

});