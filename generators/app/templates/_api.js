
'use strict';
const Controller = require('egg').Controller;

class <%= controllerName %>Controller extends Controller {
  async <%= functionName %>() {
    const { ctx } = this;
    const params = ctx.query;
    // const result = this.service.xxx
    ctx.body = {
      success: true,
      message: '请求成功',
      data: params,
    };
  }
}

module.exports = <%= controllerName %>Controller;
