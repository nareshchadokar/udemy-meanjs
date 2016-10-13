(function () {
  'use strict';

  angular
    .module('crudmodules')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Crudmodules',
      state: 'crudmodules',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'crudmodules', {
      title: 'List Crudmodules',
      state: 'crudmodules.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'crudmodules', {
      title: 'Create Crudmodule',
      state: 'crudmodules.create',
      roles: ['user']
    });
  }
}());
