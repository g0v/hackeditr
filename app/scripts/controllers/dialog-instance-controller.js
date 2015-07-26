'use strict';

module.exports = function($scope, $modalInstance, data) {
  $scope.title = data.title || '';
  $scope.url = data.url || '';

  $scope.ok = function () {
    $modalInstance.close({title: $scope.title, url: $scope.url});
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};
