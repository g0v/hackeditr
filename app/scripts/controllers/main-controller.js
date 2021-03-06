'use strict';

module.exports = function($scope, $location) {
  $scope.hackfoldrName = '';
  $scope.isCollapsed = true;

  $scope.$on('$locationChangeSuccess', function() {
    $scope.isHomePage = $location.path() === '/';
  });

  $scope.goEdit = function() {
    var name = $scope.hackfoldrName;
    if (name) {
      $location.path('/' + name);
    } else {
      $scope.$broadcast('error', 'Hackfoldr Name is empty!');
    }
  };
};
