var orderController = require('../controller/orderController');
var balanceController = require('../controller/balanceController');

exports.handleResult = function (req,res,next) 
{
  req.setEncoding('utf8');
  var data = req.body;
  console.log(data);
  var resp = function (ret, status_code) {
      res.writeHead(status_code, {
        "Content-Type": "text/plain; charset=utf-8"
      });
      res.end(ret);
    }
  switch (data.type) {

        case "charge.succeeded":
            var results = new Array();
            results = data.data.object.order_no.split("s");
            if(results[1]){
                var id = results[1];
                console.log(id);
                //balanceController.recharge()
            }else{
                orderController.updateOrder(data);
            }

            // 开发者在此处加入对支付异步通知的处理代码
            console.log("支付成功");
            return resp("OK", 200);
            break;
        case "refund.succeeded":
            // 开发者在此处加入对退款异步通知的处理代码
            console.log("退款成功");
            return resp("OK", 200);
            break;
        default:
            console.log("支付错误");
            return resp("未知 Event 类型", 400);
            break;
  }
}
