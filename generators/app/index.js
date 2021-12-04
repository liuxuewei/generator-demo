'use strict';
const Generator = require('yeoman-generator');
var stringUtils = require('../../common/string-util.js');
var fileUtils = require('../../common/file-util.js');
var questions = require('./questions.js');
var worker = require('./worker.js');

module.exports = class extends Generator {
  initializing () {

    this.appname = this.appname || path.basename(process.cwd());
    this.appname = stringUtils.spaceToCamelName(this.appname);
    this.runHost = 'http://127.0.0.1:7001';

    console.log('init', this.appname, this.runHost);

  }

  prompting() {
    // const prompts = [
    //   {
    //     type: 'list',
    //     name: 'addType',
    //     message: '请选择要添加页面 or 接口',
    //     choices: ['page', 'api']
    // }, {
    //     type: 'input',
    //     name: 'router', //eg.  /drawer/applyDetail
    //     message: '请输入添加的路由(eg. test/testPage.html )',
    //     default: 'test/testPage',
    //     when: function (response) {
    //         return response.addType === 'page' || response.addType === 'api';
    //     },
    // }];

    var prompts = questions(this);

    return this.prompt(prompts).then(props => {
      this.props = props;
      var routerFilePath = 'app/router.js'; //router路径
      fileUtils.checkRouterFileFlag(routerFilePath);
    });
  }

  writing() {
    if (this.props && this.props.addType === 'page') {
      worker.pageWorker(this);
    }

    if (this.props && this.props.addType === 'api') {
      worker.apiWorker(this);
    }

  }

  install() {
    this.installDependencies();
  }
};
