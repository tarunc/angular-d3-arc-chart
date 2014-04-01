'use strict';

describe('Directive: ArcProgressChart', function() {

  // load the directive's module
  beforeEach(module('betterworksTestApp'));

  var element,
    scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make element visible', inject(function($compile) {
    element = angular.element('<arc-progress-chart actual="0.3" expected="0.5"></arc-progress-chart>');
    element = $compile(element)(scope);

    var paths = d3.selectAll('path');
    console.log(paths.length);
  }));
});
