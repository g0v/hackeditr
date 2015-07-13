'use strict';

module.exports = function($http, $scope, SweetAlert) {
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
    SweetAlert.swal(
      {
        title: 'Are you sure?',
        text: 'Your will not be able to recover this change!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#AEDEF4',confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        closeOnConfirm: false
      }, function(isConfirm) {
        if (isConfirm) {
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
            .success(function(data, status) {
              SweetAlert.swal('Saved!', 'Your change has been saved.', 'success');
            })
            .error(function(data, status) {
              SweetAlert.swal('Error!', 'Your change has not been saved.', 'error');
            });

        }
    });
  }
};
