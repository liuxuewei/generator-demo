'use strict';
var fs = require('fs');
var _ = require('lodash')
var chalk = require('chalk');
var async = require('async');
var path = require('path');

var fileUtils = require('../../../common/file-util.js');
var arrayUtils = require('../../../common/array-util.js');
var stringUtils = require('../../../common/string-util.js');
var startBrowser = require('../../../common/startBrowser.js');

module.exports = {
  pageWorker: function (ctx) {
    const routerFilePath = 'router.js'; //router路径
    const functionName = ctx.props.functionName;
    const controllerFilePath = 'app/controller/'; //controller路径
    const viewFilePath = `app/view/`; //controller路径

    let controllerFileName = ctx.props.router.replace(/\//g, '.');
    controllerFileName = stringUtils.lineThroughToCamelName(controllerFileName);


    ctx.log(chalk.green('正在修改router.js...'));
    const content = `router.get('/${ctx.props.router}.html', controller.${controllerFileName}.${functionName});`
    fileUtils.injectIntoFileFlag({
      appPath: 'app',
      filePath: routerFilePath,
      injectContent: '\n\t' + content + '\n'
    });

    ctx.log(chalk.green('正在生成controller文件：' + controllerFilePath + ctx.props.router + '.js'));
    ctx.fs.copyTpl(
      ctx.templatePath('_page.js'),
      ctx.destinationPath(controllerFilePath + ctx.props.router + '.js'), {
      controllerName: ctx.props.controllerName,
      functionName: ctx.props.functionName,
      router: ctx.props.router
    }
    );

    const staticFileName = stringUtils.camelToLineThroughName(ctx.props.router);
    ctx.log(chalk.green('正在生成view文件：' + viewFilePath + ctx.props.router + '.html'));
    ctx.fs.copyTpl(
      ctx.templatePath('_view.html'),
      ctx.destinationPath(viewFilePath + ctx.props.router + '.html'), {
      router: (ctx.props.router),
      staticFileName,
      staticProject: ctx.props.staticProject
    }
    );

    //打开浏览器
    const exampleUrl = `${ctx.runHost}/${ctx.props.router}.html`;

    setTimeout(function () {
      startBrowser(exampleUrl);
    }, 2000);

    ctx.log(chalk.green('正在请求打开浏览器...'));
  },

}
