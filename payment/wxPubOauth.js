'use strict';
// api_key 获取方式：登录 [Dashboard](https://dashboard.pingxx.com)->点击管理平台右上角公司名称->开发信息-> Secret Key
var API_KEY = "sk_test_rDa1e5env5aPqPqHC8v1azv9"
var env = require('../app');
var http = require('http');
var _url = require('url');
var pingpp = env.pingpp;
http.createServer(function (req, res) {
  var urlParts = _url.parse(req.url, true);
  switch (urlParts.pathname) {
    case "/oauth": // 跳转到微信进行认证
      var oauthUrl = pingpp.wxPubOauth.createOauthUrlForCode('wx5bc13508fcdbca3c', 
      'http://wechat.qiancs.cn/getopenid?showwxpaytitle=1');
      res.writeHead(302, {
        "Location": oauthUrl
      });
      res.end('');
      break;
    case "/getopenid": // 回调地址，获取 openid
      pingpp.wxPubOauth.getOpenid('wx5bc13508fcdbca3c', '30337a4abdfb0a2c2ef892f23e141847 ', 
      urlParts.query.code, function(err, openid){
        console.log(openid);
        res.send(open_id);
        // ...
        // pass openid to extra['open_id'] and create a charge
        // ...
      });
      break;
    case "/signature": // 微信公众号获取签名
      pingpp.wxPubOauth.getJsapiTicket('WX_PUB_APP_ID', 'WX_PUB_APP_SECRET', function(e, response){
        // response['ticket'] 是获得的 jsapi_ticket，有效期为 7200 秒，需在自己的服务器全局缓存。
        var charge = {/* 准备支付的 charge */};
        var signature = pingpp.wxPubOauth.getSignature(charge, response['ticket'], 'PAY_PAGE_URL');
        res.writeHead(200);
        res.end(signature);
      });
      break;
    default:
      res.writeHead(404);
      res.end('');
      break;
  }
}).listen(80, "0.0.0.0");
