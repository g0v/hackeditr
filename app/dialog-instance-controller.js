'use strict';

module.exports = function($scope, $modalInstance) {
  $scope.title = '';
  $scope.url = '';

  $scope.ok = function () {
    $modalInstance.close({title: $scope.title, url: $scope.url});
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};
