# Json-Status
[![Build
Status](https://secure.travis-ci.org/cainus/json-status.png?branch=master)](http://travis-ci.org/cainus/json-status)
[![Coverage Status](https://coveralls.io/repos/cainus/json-status/badge.png?branch=master)](https://coveralls.io/r/cainus/json-status)
[![NPM version](https://badge.fury.io/js/json-status.png)](http://badge.fury.io/js/json-status)
[![Size](http://wapiti.io/api/sizeBadges/json-status)](http://wapiti.io/api/sizeBadges/json-status)

Json-status is a node.js library that makes JSON status and error
messages simpler and more consistent.

##Installation
```
npm install json-status --save
```

<!--
<h5>res.status</h5>
<p>
The status module is automatically attached to your resource handler at request time. It is just a bunch of helper functions for dealing with response statuses.
</p>

<p>
This is an important module because building great APIs requires excellent and consistent error and status reporting.
</p>

<p>
To understand what the codes mean, please refer to <a href="http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html">http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html</a>.
</p>

<h6>Usage</h6>
These methods generally set the HTTP status and end the response, so in general you should 
not expect to write more to the response after these. If a response body makes sense, it 
will generally be written automatically. For clarity, it's recommended that when you call 
one of these functions, you call it with <code class="incode">return</code> in front of it. Here's an example:

<pre class="sh_javascript">
server.route('/', {  GET : function(req, res){
                              return res.status.redirect('/someOtherUrl');
                            }});
</pre>
<p>
Here are the functions that it makes available in your method handler:
</p>

<h6>Redirect scenarios</h6>
<section id="res-status-created">
<dl>
  <dt>
res.status.created(redirectUrl);
  </dt>
  <dd>
This method is used for HTTP STATUS 201 scenarios when the server has just created a resource successfully so that the server can tell the client where to find it. It sets the status to 201 and sets the 'Location' header to the redirectUrl.
  </dd>
</dl>
</section>

<section id="res-status-movedPermanently">
<dl>
  <dt>
    res.status.movedPermanently(redirectUrl);
  </dt>
  <dd>
    This method is used for HTTP STATUS 301 scenarios where a resource has been permanently moved somewhere else so the server can tell the client where to find it. It sets the status to 301 and sets the 'Location' header to the redirectUrl.
  </dd>
</dl>
</section>

<section id="res-status-redirect">
<dl>
  <dt>
    res.status.redirect(redirectUrl);
  </dt>
  <dd>
    This is just an alias of movedPermanently()
  </dd>
</dl>
</section>

<h6>Success responses</h6>
<p>
"200 OK" statuses are the default, so you don't need to specify those explicitly.
</p>
<p>
201 Created statuses are described in the redirect section above.
</p>

<section id="res-status-accepted">
<dl>
  <dt>
    res.status.accepted();
  </dt>
  <dd>
    Used to indicate that a response has been accepted, but not yet processed, this response will emit a "202 Accepted" status.
  </dd>
</dl>
</section>
<section id="res-status-noContent">
<dl>
  <dt>
    res.status.noContent();
  </dt>
  <dd>
    Used to indicate that a request was successful, but there's no body to return (for example, a successful DELETE).  This response will emit a "204 No Content" status.
  </dd>
</dl>
</section>
<section id="res-status-resetContent">
<dl>
  <dt>
    req.status.resetContent();
  </dt>
  <dd>
    Used to indicate that a request was sucessful so a related UI (usually a form) should clear its content.  This response will emit a "205 Reset Content" status.
  </dd>
</dl>
</section>

<h6>Error Scenarios</h6>
All of the error scenarios are handled similarly and attempt to show a response body that indicates the error that occurred as well. The status code will be set on the response as well as in that response body.

All of these methods additionally take a single parameter where additional detail information can be added. For example:

<pre class="sh_javascript">
server.route('/', {  GET : function(req, res){
                              return res.status.internalServerError('The server is on fire.');
                            }});
</pre>

Output:<br />
<code>
{"type":500,"message":"Internal Server Error","detail":"The server is on fire"}
</code>
<h6>Error response methods:</h6>

<section id="res-status-badRequest">
<dl>
  <dt>
    res.status.badRequest([detail])
  </dt>
  <dd>
    <code>
    {"type":400,"message":"Bad Request"}
    </code>
  </dd>
</dl>
</section>

<section id="res-status-unauthenticated">
<dl>
  <dt>
    res.status.unauthenticated([detail])
  </dt>
  <dd>
    <code>
      {"type":401,"message":"Unauthenticated"}
    </code>
  </dd>
</dl>
</section>

<section id="res-status-forbidden">
<dl>
  <dt>
      res.status.forbidden([detail])
  </dt>
  <dd>
    <code>
      {"type":403,"message":"Forbidden"}
    </code>
  </dd>
</dl>
</section>

<section id="res-status-notFound">
<dl>
  <dt>
      res.status.notFound([detail])
  </dt>
  <dd>
    <code>
        {"type":404,"message":"Not Found"}
    </code>
  </dd>
</dl>
</section>

<section id="res-status-methodNotAllowed">

<dl>
  <dt>
      res.status.methodNotAllowed([detail])
  </dt>
  <dd>
    <code>
      {"type":405,"message":"Method Not Allowed"}
    </code>
  </dd>
</dl>
</section>

<section id="res-status-notAcceptable">
<dl>
  <dt>
      res.status.notAcceptable([detail])
  </dt>
  <dd>
    <code>
      {"type":406,"message":"Not Acceptable"}
    </code>
  </dd>
</dl>
</section>


<section id="res-status-conflict">
<dl>
  <dt>
      res.status.conflict([detail])
  </dt>
  <dd>
    <code>
        {"type":409,"message":"Conflict"}
    </code>
  </dd>
</dl>
</section>

<section id="res-status-gone">
<dl>
  <dt>
      res.status.gone([detail])
  </dt>
  <dd>
    <code>
        {"type":410,"message":"Gone"}
    </code>
  </dd>
</dl>
</section>

<section id="res-status-lengthRequired">
<dl>
  <dt>
      res.status.lengthRequired([detail])
  </dt>
  <dd>
    <code>
        {"type":411,"message":"Length Required"}
    </code>
  </dd>
</dl>
</section>

<section id="res-status-preconditionFailed">
<dl>
  <dt>
      res.status.preconditionFailed([detail])
  </dt>
  <dd>
    <code>
        {"type":412,"message":"Precondition Failed"}
    </code>
  </dd>
</dl>
</section>

<section id="res-status-requestEntityTooLarge">
<dl>
  <dt>
      res.status.requestEntityTooLarge([detail])
  </dt>
  <dd>
    <code>
        {"type":413,"message":"'Request Entity Too Large"}
    </code>
  </dd>
</dl>
</section>

<section id="res-status-requestUriTooLong">
<dl>
  <dt>
res.status.requestUriTooLong([detail])
  </dt>
  <dd>
    <code>
{"type":414,"message":"Request URI Too Long"}
    </code>
  </dd>
</dl>
</section>

<section id="res-status-unsupportedMediaType">
<dl>
  <dt>
res.status.unsupportedMediaType([detail])
  </dt>
  <dd>
    <code>
{"type":415,"message":"Unsupported Media Type"}
    </code>
  </dd>
</dl>
</section>

<section id="res-status-unprocessableEntity">
<dl>
  <dt>
res.status.unprocessableEntity([detail])
  </dt>
  <dd>
    <code>
{"type":422,"message":"'Unprocessable Entity"}
    </code>
  </dd>
</dl>
</section>

<section id="res-status-tooManyRequests">
<dl>
  <dt>
res.status.tooManyRequests([detail])
  </dt>
  <dd>
    <code>
{"type":429,"message":"Too Many Requests"}
    </code>
  </dd>
</dl>
</section>

<section id="res-status-internalServerError">
<dl>
  <dt>
res.status.internalServerError([detail])
  </dt>
  <dd>
    <code>
{"type":500,"message":"Internal Server Error"}
    </code>
  </dd>
</dl>
</section>

<section id="res-status-notImplemented">
<dl>
  <dt>
res.status.notImplemented([detail])
  </dt>
  <dd>
    <code>
{"type":501,"message":"Not Implemented"}
    </code>
  </dd>
</dl>
</section>

<section id="res-status-badGateway">
<dl>
  <dt>
res.status.badGateway([detail])
  </dt>
  <dd>
    <code>
{"type":502,"message":"Bad Gateway"}
    </code>
  </dd>
</dl>
</section>

<section id="res-status-serviceUnavailable">
<dl>
  <dt>
      res.status.serviceUnavailable([detail])
  </dt>
  <dd>
    <code>
        {"type":503,"message":"Service Unavailable"}
    </code>
  </dd>
</dl>
</section>

<section id="res-status-gatewayTimeout">
<dl>
  <dt>
      res.status.gatewayTimeout([detail])
  </dt>
  <dd>
    <code>
        {"type":504,"message":"Gateway Timeout"}
    </code>
  </dd>
</dl>
</section>
-->
