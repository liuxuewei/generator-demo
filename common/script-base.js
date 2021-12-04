'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var Generator = module.exports = function Generator() {
  if (typeof this.env.options.appPath === 'undefined') {
    this.env.options.appPath = this.options.appPath;

    this.env.options.appPath = this.env.options.appPath || 'app';
    this.options.appPath = this.env.options.appPath;
  }
};
