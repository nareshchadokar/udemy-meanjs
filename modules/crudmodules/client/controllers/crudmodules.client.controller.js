(function () {
  'use strict';

  // Crudmodules controller
  angular
    .module('crudmodules')
    .controller('CrudmodulesController', CrudmodulesController);

  CrudmodulesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'crudmoduleResolve'];

  function CrudmodulesController ($scope, $state, $window, Authentication, crudmodule) {
    var vm = this;

    vm.authentication = Authentication;
    vm.crudmodule = crudmodule;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Crudmodule
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.crudmodule.$remove($state.go('crudmodules.list'));
      }
    }

    // Save Crudmodule
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.crudmoduleForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.crudmodule._id) {
        vm.crudmodule.$update(successCallback, errorCallback);
      } else {
        vm.crudmodule.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('crudmodules.view', {
          crudmoduleId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
