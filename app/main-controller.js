'use strict';

module.exports = function($http, $scope, $modal) {
  var url = 'https://ethercalc.org/_/hackeditr/csv.json';
  $scope.options = {};

  $http.get(url).success(function(data) {
    $scope.data = data;
    let list = [];
    var firstLv;
    var id = 0;
    data.forEach(function(line, rowNum) {
      if (rowNum === 0 || !line[1]) {
        return;
      }
      if (rowNum === 1) {
        $scope.title = line[rowNum];
        return;
      }
      // debugger
      var current = {
        url: line[0],
        title: line[1],
        items: [],
        first: true
      };
      if (!current.url || current.url[0] !== ' ' || !firstLv) {
        firstLv = current;
        list.push(current);
      } else {
        current.url = current.url.trim();
        current.first = false;
        firstLv.items.push(current);
      }
      id++;
    });
    $scope.list = list;
  });

  $scope.removeItem = function(scope) {
    scope.remove();
  };

  $scope.toggle = function(scope) {
    scope.toggle();
  };

  $scope.save = function(scope) {
    // transfer to csv format
    var tagLine = scope.data[0].join(',');
    var titleLine = scope.data[1].join(',');
    var csvData = tagLine + '\n' + titleLine + '\n';
    (scope.list).forEach(function(node) {
      csvData += node.url + ',' + node.title + ',,\n';
      if (node.items.length > 0) {
        node.items.forEach(function(node) {
          csvData += '" ' + node.url + '"' + ',' + node.title + ',,\n';
        });
      }
    });

    var req = {
      method: 'PUT',
      url: 'https://ethercalc.org/_/hackeditr',
      headers: {
        'Content-Type': 'text/csv'
      },
      data: csvData
    };
    $http(req)
      .success(function() {
        $scope.$broadcast('success', 'Success!');
      })
      .error(function() {
        $scope.$broadcast('success', 'Error! Please try again.');
      });
  };

  $scope.open = function (pos) {
    var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'dialogContent.html',
      controller: 'DialogInstanceController',
      resolve: {
        data: function () {
          return {title: '', url: ''};
        }
      }
    });

    modalInstance.result.then(function (data) {
      // pos === -1 mean this folder is first lavel node
      var url = data.url || '';
      var title = data.title || 'New folder';
      var isFirstLevel = (pos === -1) ? true : false;
      var current = {
        url: url,
        title: title,
        items: [],
        first: isFirstLevel
      };

      if (isFirstLevel) {
        $scope.list.push(current);
      } else {
        var nodeData = $scope.list[pos];
        nodeData.items.push(current);
      }
    });
  };

  $scope.edit = function(scope) {
    var editContent = scope.$modelValue;
    var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'dialogContent.html',
      controller: 'DialogInstanceController',
      resolve: {
        data: function () {
          return {title: editContent.title, url: editContent.url};
        }
      }
    });

    modalInstance.result.then(function (data) {
      scope.$modelValue.title = data.title || 'New folder';
      scope.$modelValue.url = data.url || '';
    });
  };
};
