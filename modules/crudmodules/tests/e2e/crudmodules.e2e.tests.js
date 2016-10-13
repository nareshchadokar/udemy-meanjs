'use strict';

describe('Crudmodules E2E Tests:', function () {
  describe('Test Crudmodules page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/crudmodules');
      expect(element.all(by.repeater('crudmodule in crudmodules')).count()).toEqual(0);
    });
  });
});
