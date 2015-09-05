'use strict';

let angular = require('angular');

require('../styles/app.css');
require('angular-route');
require('angular-ui-tree/dist/angular-ui-tree');
require('angular-bootstrap/ui-bootstrap-tpls.min');

var app = angular.module('hackeditr', ['ngRoute', 'ui.tree', 'ui.bootstrap']);
app.controller('MainController', require('./controllers/main-controller.js'));
app.controller('EditController', require('./controllers/edit-controller.js'));
app.controller('AlertMsgController',
  require('./controllers/alert-controller.js'));
app.controller('DialogInstanceController',
  require('./controllers/dialog-instance-controller.js'));
app.factory('colorService', require('./services/color-service.js'));

app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'MainController'
    })
    .when('/:hackfoldrName', {
      templateUrl: 'views/edit.html',
      controller: 'EditController'
    })
    .otherwise({
      redirectTo: '/'
    });
});
