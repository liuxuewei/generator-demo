var chalk = require('chalk');
module.exports = function (ctx) {
  return [{
    type: 'list',
    name: 'addType',
    message: '请选择创建类型',
    choices: ['page', 'api']
  }, {
    type: 'list',
    name: 'apiType',
    message: '请选择添加API类型',
    choices: ['get', 'post'],
    when: function (response) {
      return response.addType === 'api';
    },
  }, {
    type: 'input',
    name: 'router', //eg.  /drawer/applyDetail
    message: '请输入添加的路由(eg. test/testPage )',
    default: 'test/testPage'
  }, {
    type: 'input',
    name: 'controllerName',
    default: 'Home',
    message: '请输入controller类名(eg. Home)',
    validate: function (name) {
      return !!name;
    }
  }, {
    type: 'input',
    name: 'functionName',
    default: 'home',
    message: '请输入函数名(eg. home)',
    validate: function (name) {
      return !!name;
    }
  }, {
    type: 'input',
    name: 'staticProject',
    message: '请输入对应的前端应用(eg. demo-web)',
    default: 'demo-web',
    when: function (response) {
      return response.addType === 'page';
    },
  }];
};
