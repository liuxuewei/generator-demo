'use strict';

var PageWorker = require('./workers/pageWorker.js');
var ApiWorker = require('./workers/apiWorker.js');

module.exports = {
  pageWorker: function (ctx) {
    PageWorker.pageWorker(ctx);
  },

  apiWorker: function (ctx) {

    ApiWorker.apiWorker(ctx);

  },
}
