var dir = './lib/';
if (process.env.JSON_STATUS_COVERAGE){
  dir = './lib-cov/';
}
exports.JsonResponder = require(dir + 'JsonResponder');
