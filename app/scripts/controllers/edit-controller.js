'use strict';

module.exports = function($http, $scope, $modal, $routeParams, $location, colorService) {
  var hackfoldrName = $routeParams.hackfoldrName;
  var baseUrl = 'https://ethercalc.org/_/' + hackfoldrName;
  var url = baseUrl + '/csv.json';

  $scope.debug = $location.search().debug;

  $scope.hackfoldrName = hackfoldrName;
  $scope.options = {};
  $scope.addBtn = {
    isopen: false
  };

  function initial(data) {
    $scope.data = data;
    let list = [];
    var isTopLink = false;
    var firstLv;

    data.forEach(function(line, rowNum) {
      /* current.type:
       *   1. comment
       *   2. topFolder
       *   3. folder
       *   4. topLink
       *   5. link
       */
      var tag = line[3];
      var tagColor = '';
      if (tag !== '' && tag.split(' ').length > 1) {
        var subTag = tag.split(' ')[0];
        tagColor = colorService.getHexCode(subTag);
        tag = tag.substring(tag.indexOf(' ')+1);
      }
      var current = {
        url: line[0],
        title: line[1],
        property: line[2],
        tag: tag,
        tagColor: tagColor,
        items: [],
        type: ''
      };

      var isEmpty = true;
      line.forEach(function(content) {
        if (content) {
          isEmpty = false;
          return;
        }
      });
      if (isEmpty) {
        current.type = 'comment';
        list.push(current);
        return;
      }

      line.forEach(function(content) {
        if (/^#/g.test(content)) {
          current.type = 'comment';
          return;
        }
      });
      if (current.type === 'comment') {
        list.push(current);
        return;
      }

      if (/^</g.test(current.url)) {
        // link will be top link below this setting
        isTopLink = true;
        current.type = 'comment';
        list.push(current);
        return;
      }

      if (!$scope.title && current.title) {
        $scope.title = current.title;
        current.type = 'topFolder';
        list.push(current);
        return;
      }

      if (!current.url || />/g.test(current.url)) {
        firstLv = current;
        current.type = 'folder';
        list.push(current);
        isTopLink = false;
      } else if (isTopLink || !firstLv) {
        current.type = 'topLink';
        list.push(current);
      } else {
        current.url = current.url.trim();
        current.type = 'link';
        firstLv.items.push(current);
      }
    });
    $scope.list = list;
  }

  $http.get(url).success(initial).error(function(data, status) {
    if (status === 404) {
      data = [];
      data.push(['#url', '#title', '#foldr expand', '#tag']);
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
    var csvData = '';
    var isFolderLastNode = false;
    var tag = '';
    (scope.list).forEach(function(node) {
      if (node.type === 'folder') {
        isFolderLastNode = true;
      }
      if (/^</g.test(node.url)) {
        isFolderLastNode = false;
      }
      if (node.type === 'topLink' && isFolderLastNode) {
        csvData += ['<', '', '', ''].join(',') + '\n';
      }
      tag = (node.tag !== '')
        ? colorService.getColorName(node.tagColor) + ' ' + node.tag
        : '';
      csvData += [node.url, node.title, node.property, tag].join(',') + '\n';
      if (node.items.length > 0) {
        node.items.forEach(function(subNode) {
          tag = (subNode.tag !== '')
            ? colorService.getColorName(subNode.tagColor) + ' ' + subNode.tag
            : '';
          csvData += [subNode.url, subNode.title, subNode.property, tag]
            .join(',') + '\n';
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

  $scope.open = function (pos, type) {
    if (!type) {
      type = (this.$modelValue.type === 'folder') ? 'link' : 'topLink';
    }
    var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'dialogContent.html',
      controller: 'DialogInstanceController',
      resolve: {
        data: function () {
          return {title: '', url: '', tag: '', tagColor: '', type: type};
        }
      }
    });

    modalInstance.result.then(function (data) {
      // pos === -1 mean this folder is first lavel node
      var link = data.url || '';
      var title = data.title || 'New title';
      var tag = data.tag || '';
      var tagColor = data.tagColor || '';
      var current = {
        url: link,
        title: title,
        property: '',
        tag: tag,
        tagColor: tagColor,
        items: [],
        type: type
      };

      if (pos === -1) {
        $scope.list.push(current);
      } else if (type === 'topLink') {
        $scope.list.splice(pos+1, 0, current);
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
          return {
            title: editContent.title,
            url: editContent.url,
            tag: editContent.tag,
            tagColor: editContent.tagColor,
            type: editContent.type
          };
        }
      }
    });

    modalInstance.result.then(function (data) {
      scope.$modelValue.title = data.title || 'New title';
      scope.$modelValue.url = data.url || '';
      scope.$modelValue.tag = data.tag || '';
      scope.$modelValue.tagColor = data.tagColor || '';
    });
  };

  $scope.getLayout = function() {
    let ret = {};
    ret['col-lg-' + ($scope.debug ? '6' : '12')] = true;
    return ret;
  };

  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.addBtn.isopen = !$scope.addBtn.isopen;
  };
};
