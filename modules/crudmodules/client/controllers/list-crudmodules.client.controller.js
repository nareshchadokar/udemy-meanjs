(function () {
  'use strict';

  angular
    .module('crudmodules')
    .controller('CrudmodulesListController', CrudmodulesListController);

  CrudmodulesListController.$inject = ['CrudmodulesService'];

  function CrudmodulesListController(CrudmodulesService) {
    var vm = this;

    vm.crudmodules = CrudmodulesService.query();
  }
}());
