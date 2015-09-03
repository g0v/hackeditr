'use strict';

module.exports = function($scope, $modalInstance, data) {
  $scope.title = data.title || '';
  $scope.url = data.url || '';
  $scope.tag = data.tag || '';
  $scope.type = data.type || 'folder';

  $scope.ok = function () {
    $modalInstance.close({title: $scope.title, url: $scope.url, tag: $scope.tag});
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};
