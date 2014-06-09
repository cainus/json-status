var util = require('util');

var JsonResponder = function(req, res, cb){
  if (this instanceof JsonResponder) {
    this.req = req;
    this.res = res;
    this.quiet500 = false;
    if (cb){
      this.onError = cb;
    }
    return;
  }
  return new JsonResponder(req, res, cb);
};

JsonResponder.connectMiddleware = function(options){
  options = options || {};
  var namespace = options.namespace || 'status';
  var quiet500 = options.quiet500 || false;
  var onError = options.onError || function(){};
  return function(req, res, next){
    var responder = JsonResponder(req, res, onError);
    if (quiet500){
      responder.quiet500 = true;
    }
    res[namespace] = responder;
    next();
  };
};

var errors = {
  'badRequest' :            {type : 400, message : 'Bad Request'},
  'unauthenticated' :       {type : 401, message : 'Unauthenticated'},
  'forbidden' :             {type : 403, message : 'Forbidden'},
  'notFound' :              {type : 404, message : 'Not Found'},
  'methodNotAllowed' :      {type : 405, message : 'Method Not Allowed'},
  'notAcceptable' :         {type : 406, message : 'Not Acceptable'},
  'conflict' :              {type : 409, message : 'Conflict'},
  'gone' :                  {type : 410, message : 'Gone'},
  'lengthRequired' :        {type : 411, message : 'Length Required'},
  'preconditionFailed' :    {type : 412, message : 'Precondition Failed'},
  'requestEntityTooLarge' : {type : 413, message : 'Request Entity Too Large'},
  'requestUriTooLong' :     {type : 414, message : 'Request URI Too Long'},
  'unsupportedMediaType' :  {type : 415, message : 'Unsupported Media Type'},
  'unprocessableEntity' :   {type : 422, message : 'Unprocessable Entity'},
  'tooManyRequests' :       {type : 429, message : 'Too Many Requests'},
  'internalServerError' :   {type : 500, message : 'Internal Server Error'},
  'notImplemented' :        {type : 501, message : 'Not Implemented'},
  'badGateway' :            {type : 502, message : 'Bad Gateway'},
  'serviceUnavailable' :    {type : 503, message : 'Service Unavailable'},
  'gatewayTimeout' :        {type : 504, message : 'Gateway Timeout'}
};

var makeErrorHandler = function(name, payload){
  JsonResponder.prototype[name] = function(detail){
    var obj = {"error" : payload};

    detail = detail || {};
    if (this.quiet500  && (parseInt(payload.type, 10) >= 500)){
      // suppress the details
      delete payload.detail;
    } else {
      // if detail is circular, just flatten it to a string.
      try {
        JSON.stringify(detail);  // will throw if circular
      } catch(ex) {
        detail = util.inspect(detail);  // stringifies.  only goes one level deep.
      }
      obj.error.detail = detail;
    }

    this.res.setHeader('Content-Type', 'application/json');
    var out = JSON.stringify(obj);
    var length = Buffer.byteLength(out, 'utf8');
    this.res.setHeader('Content-Length', length);
    this.res.writeHead(payload.type);
    this.res.write(out);
    this.res.end();
    this.onError({ req : this.req, res : this.res, type : payload.type, message : payload.message, detail : detail } );
  };
};

/* set methods on the JsonResponder for every kind of error that could occur.  */
for(var errorName in errors){
  makeErrorHandler(errorName, errors[errorName]);
}

JsonResponder.prototype.created = function(url, data){
  url = url || '';
  this.res.setHeader('Location', url);
  var out = '';
  if (data){
    this.res.setHeader('content-type', 'application/json');
    out = JSON.stringify(data);
    this.res.setHeader('content-length', '' + Buffer.byteLength(out, 'utf8'));
  }
  this.res.writeHead(201);
  this.res.end(out);
};

JsonResponder.prototype.accepted = function(){
  this.res.writeHead(202);
  this.res.end();
};

JsonResponder.prototype.noContent = function(){
  this.res.writeHead(204);
  this.res.end();
};

JsonResponder.prototype.resetContent = function(){
  this.res.writeHead(205);
  this.res.end();
};

JsonResponder.prototype.movedPermanently = function(url){
  url = url || '';
  this.res.setHeader('Location', url);
  this.res.writeHead(301);
  this.res.end();
};

JsonResponder.prototype.found = function(url){
  url = url || '';
  this.res.setHeader('Location', url);
  this.res.writeHead(302);
  this.res.end();
};

JsonResponder.prototype.redirect = function(url){
  this.found(url);
};

JsonResponder.prototype.OPTIONS = function(methods){
    this.res.setHeader('Allow', methods.join(","));
    this.res.writeHead(200);
    return this.res.end(JSON.stringify({"allowed methods" : methods}));
};


module.exports = JsonResponder;
