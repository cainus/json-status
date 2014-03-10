var should = require('should');
var connect = require('connect');
var request = require('request');
var JsonStatus = require('../index');

var FakeResponse = function(){
  this.status = null;
  this.ended = false;
  this.headers = {};
  this.body = '';
  this.writeHead = function(status){
    this.status = status;
  };
  this.setHeader = function(name, value){
    this.headers[name] = value;
  };
  this.write = function(out){
    this.body += out;
  };
  this.end = function(out){
    this.ended = true;
    this.body += out;
  };
};

describe("JsonStatus", function(){

  describe("#internalServerError", function(){
    it ("sets the status to 500 when the detail is a simple object", function(done){
      var fakeRes = new FakeResponse();
      var responder = new JsonStatus({}, fakeRes);
      var expected = {type : 500,
                      message : 'Internal Server Error',
                      detail : {}};
      responder.on('error', function(data){
        data.type.should.equal(expected.type);
        data.message.should.equal(expected.message);
        data.detail.should.equal(expected.detail);
        done();
      });
      responder.internalServerError(expected.detail);
      fakeRes.status.should.equal(expected.type);
      fakeRes.ended.should.equal(true);
      fakeRes.headers['Content-Type'].should.equal("application/json; charset=utf-8");
      var response = JSON.parse(fakeRes.body);
      response.error.should.eql(expected);
    });
    it ("sets the status to 500 when the detail is a 'circular' object", function(done){
      var fakeRes = new FakeResponse();
      var responder = new JsonStatus({}, fakeRes);
      var circular = {};
      circular.circular = circular;  // this is circular, in case that's not obvious
      var expected = {type : 500,
                      message : 'Internal Server Error',
                      detail : '{ circular: [Circular] }'};
      responder.on('error', function(data){
        data.type.should.equal(expected.type);
        data.message.should.equal(expected.message);
        data.detail.should.equal(expected.detail);
        done();
      });
      responder.internalServerError(circular);
      fakeRes.status.should.equal(expected.type);
      fakeRes.ended.should.equal(true);
      fakeRes.headers['Content-Type'].should.equal("application/json; charset=utf-8");
      var response = JSON.parse(fakeRes.body);
      response.error.should.eql(expected);
    });
  });
    it ("emits error events in the case of errors", function(done){
      var server = connect.createServer();
      var responseSent = false;
      var errorEventSent = false;
      var middleware = JsonStatus.connectMiddleware('status', function(data){
        should.exist(data.req);
        should.exist(data.res);
        data.type.should.equal(500);
        data.message.should.equal('Internal Server Error');
        data.detail.should.equal('some error!');
        if (responseSent){
          return done();
        }
        errorEventSent = true;
      });
      server.use(middleware);
      server.use(function(req, res){
        res.status.internalServerError("some error!");
      });
      server.listen(8082, function(){
        request('http://localhost:8082/', function(err, res, body){
          res.statusCode.should.equal(500);
          JSON.parse(body).should.eql(
            {"error":{"type":500,
                      "message":"Internal Server Error",
                      "detail":"some error!"}});
          if (errorEventSent){
            return done();
          }
          responseSent = true;
        });
      });
    });
  describe("#badRequest", function(){
    it ("sets the status to 400", function(done){
      var fakeRes = new FakeResponse();
      var responder = new JsonStatus({}, fakeRes);
      var expected = {type : 400,
                      message : 'Bad Request',
                      detail : 'bad request'};
      responder.on('error', function(data){
        data.type.should.equal(expected.type);
        data.message.should.equal(expected.message);
        data.detail.should.equal(expected.detail);
        done();
      });
      responder.badRequest(expected.detail);
      fakeRes.status.should.equal(expected.type);
      fakeRes.ended.should.equal(true);
      fakeRes.headers['Content-Type'].should.equal("application/json; charset=utf-8");
      var response = JSON.parse(fakeRes.body);
      response.error.should.eql(expected);
    });
  });
  describe("#accepted", function(){
    it ("sets the status to 202", function(){
      var fakeRes = new FakeResponse();
      var responder = new JsonStatus({}, fakeRes);
      responder.accepted();
      fakeRes.status.should.equal(202);
      fakeRes.ended.should.equal(true);
    });
  });
  describe("#noContent", function(){
    it ("sets the status to 204", function(){
      var fakeRes = new FakeResponse();
      var responder = new JsonStatus({}, fakeRes);
      responder.noContent();
      fakeRes.status.should.equal(204);
      fakeRes.ended.should.equal(true);
    });
  });
  describe("#resetContent", function(){
    it ("sets the status to 205", function(){
      var fakeRes = new FakeResponse();
      var responder = new JsonStatus({}, fakeRes);
      responder.resetContent();
      fakeRes.status.should.equal(205);
      fakeRes.ended.should.equal(true);
    });
  });
  describe("#movedPermanently", function(){
    it ("sets the Location header and sets the status to 301", function(){
      var fakeRes = new FakeResponse();
      var responder = new JsonStatus({}, fakeRes);
      responder.movedPermanently("SOMEURL");
      fakeRes.headers.Location.should.equal("SOMEURL");
      fakeRes.status.should.equal(301);
      fakeRes.ended.should.equal(true);
    });
  });
  describe("#OPTIONS", function(){
    it ("sets the Allow header and sets the status to 200", function(){
      var fakeRes = new FakeResponse();
      var responder = new JsonStatus({}, fakeRes);
      responder.OPTIONS(["GET", "POST"]);
      fakeRes.headers.Allow.should.equal("GET,POST");
      fakeRes.status.should.equal(200);
      fakeRes.ended.should.equal(true);
      JSON.parse(fakeRes.body)['allowed methods'].should.eql(["GET", "POST"]);
    });
  });
  describe("#found", function(){
    it ("sets the Location header and sets the status to 302", function(){
      var fakeRes = new FakeResponse();
      var responder = new JsonStatus({}, fakeRes);
      responder.found("SOMEURL");
      fakeRes.headers.Location.should.equal("SOMEURL");
      fakeRes.status.should.equal(302);
      fakeRes.ended.should.equal(true);
    });
  });
  describe("#redirect", function(){
    it ("sets the Location header and sets the status to 302", function(){
      var fakeRes = new FakeResponse();
      var responder = new JsonStatus({}, fakeRes);
      responder.redirect("SOMEURL");
      fakeRes.headers.Location.should.equal("SOMEURL");
      fakeRes.status.should.equal(302);
      fakeRes.ended.should.equal(true);
    });
  });
  describe("#created", function(){
    it ("sets the Location header and sets the status to 201", function(){
      var fakeRes = new FakeResponse();
      var responder = new JsonStatus({}, fakeRes);
      responder.created("SOMEURL");
      fakeRes.headers.Location.should.equal("SOMEURL");
      fakeRes.status.should.equal(201);
      fakeRes.ended.should.equal(true);
    });
  });
  describe("connectMiddleware", function(){
    it ("adds a 'status' object to the response object", function(done){
      var server = connect.createServer();
      server.use(JsonStatus.connectMiddleware());
      server.use(function(req, res){
        res.status.accepted();
      });
      server.listen(8081, function(){
        request('http://localhost:8081/', function(err, res, body){
          res.statusCode.should.equal(202);
          body.should.equal('');
          done();
        });
      });
    });
    it ("allows you to set the name of the 'status' object", function(done){
      var server = connect.createServer();
      server.use(JsonStatus.connectMiddleware("ohyeah"));
      server.use(function(req, res){
        res.ohyeah.accepted();
      });
      server.listen(8079, function(){
        request('http://localhost:8079/', function(err, res, body){
          res.statusCode.should.equal(202);
          body.should.equal('');
          done();
        });
      });
    });

  });
});
