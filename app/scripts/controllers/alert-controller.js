'use strict';

module.exports = function($scope) {
  $scope.alerts = [];

  $scope.$on('success', function(e, message) {
      $scope.successAlert(message);
  });

  $scope.$on('error', function(e, message) {
      $scope.errorAlert(message);
  });

  $scope.successAlert = function(msg) {
    msg = msg ? msg : 'Success!';
    $scope.alerts.push({type: 'success', msg: msg});
  };
  $scope.errorAlert = function(msg) {
    msg = msg ? msg : 'Error!';
    $scope.alerts.push({type: 'danger', msg: msg});
  };
  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
};
