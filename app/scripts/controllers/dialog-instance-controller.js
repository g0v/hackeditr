'use strict';

module.exports = function($scope, $modalInstance, data, colorService) {
  $scope.title = data.title || '';
  $scope.url = data.url || '';
  $scope.tag = data.tag || '';
  $scope.tagColor = data.tagColor || '';
  $scope.type = data.type || 'folder';
  $scope.colors = colorService.getAllColorHex();

  $scope.pickColor = function (colorHexCode) {
    $scope.tagColor = colorHexCode;
  };

  $scope.ok = function () {
    if ($scope.tag !== '' && $scope.tagColor === '') {
      $scope.tagColor = colorService.getDefaultHexCode();
    }
    $modalInstance.close({
      title: $scope.title,
      url: $scope.url,
      tag: $scope.tag,
      tagColor: $scope.tagColor
    });
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};
