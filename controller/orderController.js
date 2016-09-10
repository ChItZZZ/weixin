/**
 * Created by 重书 on 2016/9/7.
 */
var db = require('../utils/db');
var sd = require('silly-datetime');

exports.createOrder = function (req,res,next) {
    var data = req.body;
    var userOpenId = data.open_id;
    var time=sd.format(new Date(), 'YYYY/MM/DD/hh:mm');
    var store_id = parseInt(data.store_id);
    var desk_id = parseInt(data.desk_id);
    var foods = JSON.parse(data.order_str);
    var price = 0;
    var str = "";
    for(var key in foods){
        price = price + foods[key].price * foods[key].counter;
        str = str + foods[key].name+"*"+foods[key].counter +";";
    }
    var values_order = [store_id, desk_id,time,userOpenId,0,price,str];

    var sql_order = 'INSERT INTO od_hdr (od_store_id,od_desk_id,od_date,od_wechatopenid,od_state,od_total_price,od_string) ' +
        'VALUES (?,?,?,?,?,?,?)';
    db.exec(sql_order, values_order, function(err, result) {
        if (err) {
            res.send('insert database failed');
            res.end();
            return;
        }
        var order_id = result.insertId;
        var i = 0 ;
        for(var key in foods){
            var sql_food = 'INSERT INTO od_ln (od_id,od_line_number,gd_name,gd_quantity,od_price) ' +
                'VALUES (?,?,?,?,?)';
           // var food_id = foods[i].food_id;
            var food_name = foods[key].name;
            var food_quantity= foods[key].counter;
            var food_price = foods[key].price;
            var values_food = [order_id, i+1,food_name,food_quantity,food_price];
            ++i;
            db.exec(sql_food,values_food, function(err, result) {
                if (err) 
                {
                    res.send('insert database failed');
                    res.end();
                    return;
                }
                console.log("food inserted");
            });
        }
        res.send('insert database successed');
    });

}

exports.searchOrder = function (req,res,next) {
    console.log(req.body);
    //var data = JSON.parse(req.body);
    var data = req.body;
    var userOpenId = data.wechatopenid;
    var values_order = [userOpenId];
    var sql_order = 'SELECT * FROM od_hdr where od_wechatopenid = ? ';
    db.exec(sql_order, values_order, function(err, result) {
        if (err) {
            //callback(err);
            return;
        }
        //callback(null, result);
        console.log(result);
    });
    res.end();

}