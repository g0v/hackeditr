'use strict';

module.exports = function($http, $scope, $modal, $routeParams, $location) {
  var hackfoldrName = $routeParams.hackfoldrName;
  var baseUrl = 'https://ethercalc.org/_/' + hackfoldrName;
  var url = baseUrl + '/csv.json';
  $scope.debug = $location.search().debug;

  $scope.hackfoldrName = hackfoldrName;
  $scope.options = {};

  function initial(data) {
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
  }

  $http.get(url).success(initial).error(function(data, status) {
    if (status === 404) {
      data = [];
      data.push(['#網址', '#title', '#foldr expand', '#tag']);
      data.push(['', 'Unnamed', '', '']);
      initial(data);
    }
  });

  $scope.removeItem = function(scope) {
    scope.remove();
  };

  $scope.toggle = function(scope) {
    scope.toggle();
  };

  $scope.save = function(scope) {
    // transfer to csv format
    scope.data[1][1] = scope.title;
    var tagLine = scope.data[0].join(',');
    var titleLine = scope.data[1].join(',');
    var csvData = tagLine + '\n' + titleLine + '\n';
    (scope.list).forEach(function(node) {
      csvData += node.url + ',' + node.title + ',,\n';
      if (node.items.length > 0) {
        node.items.forEach(function(subNode) {
          csvData += '" ' + subNode.url + '"' + ',' + subNode.title + ',,\n';
        });
      }
    });

    var req = {
      method: 'PUT',
      url: baseUrl,
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
        $scope.$broadcast('error', 'Error! Please try again.');
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
      var link = data.url || '';
      var title = data.title || 'New folder';
      var isFirstLevel = (pos === -1) ? true : false;
      var current = {
        url: link,
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

  $scope.getLayout = function() {
    let ret = {};
    ret['col-lg-' + ($scope.debug ? '6' : '12')] = true;
    return ret;
  };

};
