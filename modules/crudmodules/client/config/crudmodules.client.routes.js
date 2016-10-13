(function () {
  'use strict';

  angular
    .module('crudmodules')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('crudmodules', {
        abstract: true,
        url: '/crudmodules',
        template: '<ui-view/>'
      })
      .state('crudmodules.list', {
        url: '',
        templateUrl: 'modules/crudmodules/client/views/list-crudmodules.client.view.html',
        controller: 'CrudmodulesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Crudmodules List'
        }
      })
      .state('crudmodules.create', {
        url: '/create',
        templateUrl: 'modules/crudmodules/client/views/form-crudmodule.client.view.html',
        controller: 'CrudmodulesController',
        controllerAs: 'vm',
        resolve: {
          crudmoduleResolve: newCrudmodule
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Crudmodules Create'
        }
      })
      .state('crudmodules.edit', {
        url: '/:crudmoduleId/edit',
        templateUrl: 'modules/crudmodules/client/views/form-crudmodule.client.view.html',
        controller: 'CrudmodulesController',
        controllerAs: 'vm',
        resolve: {
          crudmoduleResolve: getCrudmodule
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Crudmodule {{ crudmoduleResolve.name }}'
        }
      })
      .state('crudmodules.view', {
        url: '/:crudmoduleId',
        templateUrl: 'modules/crudmodules/client/views/view-crudmodule.client.view.html',
        controller: 'CrudmodulesController',
        controllerAs: 'vm',
        resolve: {
          crudmoduleResolve: getCrudmodule
        },
        data: {
          pageTitle: 'Crudmodule {{ crudmoduleResolve.name }}'
        }
      });
  }

  getCrudmodule.$inject = ['$stateParams', 'CrudmodulesService'];

  function getCrudmodule($stateParams, CrudmodulesService) {
    return CrudmodulesService.get({
      crudmoduleId: $stateParams.crudmoduleId
    }).$promise;
  }

  newCrudmodule.$inject = ['CrudmodulesService'];

  function newCrudmodule(CrudmodulesService) {
    return new CrudmodulesService();
  }
}());
