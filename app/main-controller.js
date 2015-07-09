'use strict';

module.exports = function($http, $scope) {
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
        items: []
      };
      if (!current.url || current.url[0] !== ' ' || !firstLv) {
        firstLv = current;
        list.push(current);
      } else {
        current.url = current.url.trim();
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
    (scope.list).forEach(function(node, rowNum) {
      csvData += node.url + ',' + node.title + ',,\n';
      if (node.items.length > 0) {
        node.items.forEach(function(node, rowNum) {
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
    }
    $http(req)
      .success(function(data, status) {
      })
      .error(function(data, status) {
      });
  }
};
