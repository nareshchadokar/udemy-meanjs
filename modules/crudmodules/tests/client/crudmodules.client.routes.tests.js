(function () {
  'use strict';

  describe('Crudmodules Route Tests', function () {
    // Initialize global variables
    var $scope,
      CrudmodulesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CrudmodulesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CrudmodulesService = _CrudmodulesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('crudmodules');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/crudmodules');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          CrudmodulesController,
          mockCrudmodule;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('crudmodules.view');
          $templateCache.put('modules/crudmodules/client/views/view-crudmodule.client.view.html', '');

          // create mock Crudmodule
          mockCrudmodule = new CrudmodulesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Crudmodule Name'
          });

          // Initialize Controller
          CrudmodulesController = $controller('CrudmodulesController as vm', {
            $scope: $scope,
            crudmoduleResolve: mockCrudmodule
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:crudmoduleId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.crudmoduleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            crudmoduleId: 1
          })).toEqual('/crudmodules/1');
        }));

        it('should attach an Crudmodule to the controller scope', function () {
          expect($scope.vm.crudmodule._id).toBe(mockCrudmodule._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/crudmodules/client/views/view-crudmodule.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CrudmodulesController,
          mockCrudmodule;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('crudmodules.create');
          $templateCache.put('modules/crudmodules/client/views/form-crudmodule.client.view.html', '');

          // create mock Crudmodule
          mockCrudmodule = new CrudmodulesService();

          // Initialize Controller
          CrudmodulesController = $controller('CrudmodulesController as vm', {
            $scope: $scope,
            crudmoduleResolve: mockCrudmodule
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.crudmoduleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/crudmodules/create');
        }));

        it('should attach an Crudmodule to the controller scope', function () {
          expect($scope.vm.crudmodule._id).toBe(mockCrudmodule._id);
          expect($scope.vm.crudmodule._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/crudmodules/client/views/form-crudmodule.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CrudmodulesController,
          mockCrudmodule;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('crudmodules.edit');
          $templateCache.put('modules/crudmodules/client/views/form-crudmodule.client.view.html', '');

          // create mock Crudmodule
          mockCrudmodule = new CrudmodulesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Crudmodule Name'
          });

          // Initialize Controller
          CrudmodulesController = $controller('CrudmodulesController as vm', {
            $scope: $scope,
            crudmoduleResolve: mockCrudmodule
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:crudmoduleId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.crudmoduleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            crudmoduleId: 1
          })).toEqual('/crudmodules/1/edit');
        }));

        it('should attach an Crudmodule to the controller scope', function () {
          expect($scope.vm.crudmodule._id).toBe(mockCrudmodule._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/crudmodules/client/views/form-crudmodule.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
