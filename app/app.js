'use strict';

let angular = require('angular');
require('./app.css');
require('angular-ui-tree/dist/angular-ui-tree');
require('angular-bootstrap/dist/ui-bootstrap-tpls.min');

var app = angular.module('hackeditr', ['ui.tree', 'ui.bootstrap']);
app.controller('MainController', require('./main-controller.js'));
app.controller('AlertMsgController', require('./alert-controller.js'));
app.controller('DialogInstanceController', require('./dialog-instance-controller.js'));
