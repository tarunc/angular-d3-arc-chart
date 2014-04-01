'use strict';

describe('Directive: D3ArcProgressChart', function() {

  // load the directive's module
  beforeEach(module('betterworksTestApp'));

  var element,
    scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function($compile) {
    element = angular.element('<-d3-arc-progress-chart></-d3-arc-progress-chart>');
    element = $compile(element)(scope);
  }));
});
