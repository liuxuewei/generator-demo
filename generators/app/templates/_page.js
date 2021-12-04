

'use strict';

const Controller = require('egg').Controller;

class <%= controllerName %>Controller extends Controller {
  async <%= functionName %>() {
    const { ctx } = this;
    const params = ctx.query;
    // const result = this.service.xxx
    await ctx.render('<%= router %>.html', params);
  }
}

module.exports = <%= controllerName %>Controller;
