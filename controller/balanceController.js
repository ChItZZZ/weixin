var balance = require("../models/balance");

exports.recharge = function(openId, amount, callback){
    // console.log('info: ' + 'in recharge');
    // var data = req.body;
    // var openId = req.session.openid || '123';
    // var amount = data.amount || 233;
    balance.recharge(openId, amount, function (err, result) {
        if (err) {
            callback(err);
            return;
        }
        callback(err,result);
    });

};

exports.deduct = function(openid, amount, callback){
    balance.deduct(openid,amount, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        callback(null,result);
    });

};

exports.inquire = function(req, res, next){
    var openId = req.body.openId || '123';
    balance.inquire(openId, function (err, result) {
        if (err) {
            res.end();
            return;
        }
        res.json(result);
        res.end();
    });
};

exports.deductForUnfinished = function(req,res,next){
    console.log("deductForUnfinished:" + "In controller!!!");
    var openId  = req.body.openId || '123';
    var orderId = req.body.orderId;
    console.log("openId: " + openId);
    console.log("orderId: " + orderId);
    balance.deductForUnfinished(openId, orderId, function (err, result) {
        if (err){
            console.log(err);
        }
        res.json(result);
        res.end();
        return;
    });
};