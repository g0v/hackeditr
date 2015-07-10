'use strict';

let angular = require('angular');
require('./app.css');
require('angular-ui-tree/dist/angular-ui-tree');
require('sweetalert');
require('angular-sweetalert/SweetAlert.min');

var app = angular.module('hackeditr', ['ui.tree', 'oitozero.ngSweetAlert']);
app.controller('MainController', require('./main-controller.js'));
