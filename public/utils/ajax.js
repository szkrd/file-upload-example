// quirksmode cross browser ajax wrapper with some extra sugar
// http://www.quirksmode.org/js/xmlhttp.html
(function (global) {
  'use strict';

  function sendRequest(url, callback, requestType, responseType, postData) {
    var req = createXMLHTTPObject();
    if (!req) return;

    var method = (postData) ? 'POST' : 'GET';
    req.open(method, url, true);
    if (postData) {
      if (requestType === 'json') {
        req.setRequestHeader('Content-type','application/json; charset=utf-8');
      } else if (requestType === 'x-www-form-urlencoded') {
        req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      } // or do NOT set it at all.
    }
    req.onreadystatechange = function () {
      if (req.readyState !== 4) return;
      if (req.status !== 200 && req.status !== 304) {
        console.error('HTTP error ' + req.status);
        return;
      }
      var result = req.responseText;
      if (responseType === 'json') {
        try {
          result = JSON.parse(result);
        } catch (err) {
          console.error(err);
          result = { error: err };
        }
      }
      callback(result);
    };
    if (req.readyState === 4) {
      return;
    }
    if (requestType === 'json') {
      postData = JSON.stringify(postData);
    }
    req.send(postData);
  }

  var XMLHttpFactories = [
    function () {return new XMLHttpRequest()},
    function () {return new ActiveXObject("Msxml3.XMLHTTP")},
    function () {return new ActiveXObject("Msxml2.XMLHTTP.6.0")},
    function () {return new ActiveXObject("Msxml2.XMLHTTP.3.0")},
    function () {return new ActiveXObject("Msxml2.XMLHTTP")},
    function () {return new ActiveXObject("Microsoft.XMLHTTP")}
  ];

  function createXMLHTTPObject() {
    var xmlhttp = false;
    for (var i=0;i<XMLHttpFactories.length;i++) {
      try {
        xmlhttp = XMLHttpFactories[i]();
      }
      catch (e) {
        continue;
      }
      break;
    }
    return xmlhttp;
  }

  global.sendRequest = sendRequest;
})(this);
