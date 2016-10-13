// Crudmodules service used to communicate Crudmodules REST endpoints
(function () {
  'use strict';

  angular
    .module('crudmodules')
    .factory('CrudmodulesService', CrudmodulesService);

  CrudmodulesService.$inject = ['$resource'];

  function CrudmodulesService($resource) {
    return $resource('api/crudmodules/:crudmoduleId', {
      crudmoduleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
