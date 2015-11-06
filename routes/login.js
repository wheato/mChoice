var express = require('express'),
    weixin = require('../util/wxnode');
var router = express.Router();

var User = require('../db/user');

/* GET users listing. */
router.get('/:code', function(req, res, next) {

  weixin.auth(req.params.code, function (err, user) {
    if (err) {
      res.json({
        code: 10001,
        data: '',
        msg: err
      });

    } else {

        User.findOne({uid: user.uid}, function(err, data){

            if(err){
                res.json({
                    code: 10011,
                    data: data,
                    errMsg: '用户数据读取失败'
                });
                return;
            }

            if(data){
                res.json({
                    code: 10000,
                    data: data,
                    errMsg: ''
                });
                return;
            } else {
                var newUser = new User(user);

                var promise = newUser.save();

                promise.then(function(result){
                    res.json({
                        code: 10000,
                        data: result,
                        errMsg: ''
                    });
                }, function(err){
                    res.json({
                        code: 10010,
                        data: {},
                        errMsg: '创建用户失败'
                    });
                });
            }
        });


    }

  });

});



module.exports = router;
