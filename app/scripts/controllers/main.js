'use strict';

angular.module('betterworksTestApp')
  .controller('MainCtrl', function($scope) {
    $scope.model = {
      expected: Math.round(Math.random() * 100) / 100,
      actual: Math.round(Math.random() * 100) / 100
    };
  });
