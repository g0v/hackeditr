'use strict';

let angular = require('angular');
require('angular-route');
require('./app.css');
require('angular-ui-tree/dist/angular-ui-tree');
require('angular-bootstrap/dist/ui-bootstrap-tpls.min');

var app = angular.module('hackeditr', ['ngRoute', 'ui.tree', 'ui.bootstrap']);
app.controller('MainController', require('./main-controller.js'));
app.controller('EditController', require('./edit-controller.js'));
app.controller('AlertMsgController', require('./alert-controller.js'));
app.controller('DialogInstanceController', require('./dialog-instance-controller.js'));

app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'home.html',
      controller: 'MainController'
    })
    .when('/:hackfoldrName', {
      templateUrl: 'edit.html',
      controller: 'EditController'
    })
    .otherwise({
      redirectTo: '/'
    });
});
