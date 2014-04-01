'use strict';

describe('Controller: MainCtrl', function() {

  // load the controller's module
  beforeEach(module('betterworksTestApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach the model to the scope', function() {
    expect(scope.model).toBeDefined();
  });

  it('model should contain expected and actual', function() {
    expect(scope.model.expected).toBeDefined();
    expect(scope.model.actual).toBeDefined();
  });

  it('expected and actual should be within range [0, 1]', function() {
    expect(scope.model.actual).toBeGreaterThan(0);
    expect(scope.model.expected).toBeGreaterThan(0);

    expect(scope.model.actual).toBeLessThan(1);
    expect(scope.model.expected).toBeLessThan(1);
  });

  it('should have 2 paths drawn', function() {
    var paths = d3.selectAll('path');
    console.log(paths.length);
  });
});
