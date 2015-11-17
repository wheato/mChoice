var express = require('express'),
    VoteItem = require('../db/voteItem');

var com = require('../util/common');

var router = express.Router();

var voteItem = null;
router.get('/:id', function(req, res, next) {

    var voteId = req.params.id,
        uid = req.cookies["mChoice_uid"];

    if(!voteId){
        res.json({
            code: 10004,
            data: {},
            errMsg: '缺少投票ID'
        });
    }

    com.isLogin(uid, function(user){

        var isVoted = false;

        VoteItem.findOne({'_id': voteId}, function(err, item){
            console.log(voteId);
            if(err){
                res.json({
                    code: 10005,
                    data: {},
                    errMsg: 'ID错误'
                });
                return ;
            }

            //判断该用户是否已经投过票
            var record = item.voteRecord;
            voteItem = item;
            for(var i = 0, len = record.length; i < len; i++){
                if(record[i] == user.uid){
                    //已投过票
                    res.json({
                        code: 10006,
                        data: {},
                        errMsg: '该用户已经投过票'
                    });
                    return;
                }
            }

            //更新voteItem
            voteItem.voteRecord.push(user.uid);
            voteItem.update({
                voteRecord: voteItem.voteRecord,
                voteTotal: ++voteItem.voteTotal
            }, function(err, result){
                if(err){
                    res.json({
                        code: 10007,
                        data: {},
                        errMsg: '投票失败'
                    });
                }
                res.json({
                    code: 10000,
                    data: result,
                    errMsg: ''
                });
            });

        });

    }, function(){
        res.json({
            code: 10001,
            data: {},
            errMsg: '用户未登录'
        });
    });




});


module.exports = router;