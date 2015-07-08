'use strict';

let angular = require('angular');
require('./app.css');
require('angular-ui-tree/dist/angular-ui-tree');

var app = angular.module('hackeditr', ['ui.tree']);
app.controller('MainController', require('./main-controller.js'));
