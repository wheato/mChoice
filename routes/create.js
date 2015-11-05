var express = require('express'),
    User = require('../db/user'),
    VoteItem = require('../db/voteItem'),
    Vote = require('../db/vote');

var router = express.Router();

function getUidFromCookie(req){
    return req.cookies["mChoice_uid"];
}

function createVotes(uid, leftData, rightData, intro, cb){
    var leftItem = new VoteItem(leftData),
        rightItem = new VoteItem(rightData),
        vote = null;

    var errMsg = null;

    leftItem.save().then(function(result){
        leftItem = result;
    }, function(err){
        err && (errMsg = err);
    })
    .then(function(){
        return rightItem.save();
    }, function(err){
        err && (errMsg = err);
    })
    .then(function(result){
        rightItem = result;
    })
    .then(function(){
        vote = new Vote({
            createUser: uid,
            endTime: Date.parse(new Date())/1000 + 3000,
            choiceIds: [leftItem['_id'], rightItem['_id']],
            winId: '',
            intro: intro
        });
        return vote.save();
    }, function(err){
        err && (errMsg = err);
    })
    .then(function(result){
        vote = result;
    }, function(){
        err && (errMsg = err);
    })
    .then(function(){
        cb && cb(errMsg, vote);
    });

}

/* Post create vote. */
router.post('/', function(req, res, next) {
    var uid = getUidFromCookie(req);
    var postData = {},
        leftVoteData = {},
        vote = {},
        rightVoteData = {},
        intro = '',
        errorMsg = null,
        statusCode = 10000;

    //判断用户是否登录
    if(!uid){
        errorMsg = '用户没有登录';
        statusCode = 10001;
        res.json({
            code: statusCode,
            data: {},
            errMsg: errorMsg
        });
    } else {
        postData = req.body;

        leftVoteData = {
            name: postData['leftVoteName'],
            image: postData['leftVoteImageId']
        };

        rightVoteData = {
            name: postData['rightVoteName'],
            image: postData['rightVoteImageId']
        };

        intro = postData['intro'];

        if(!(intro || leftVoteData.name || leftVoteData.image ||
            rightVoteData.name || rightVoteData.image)){

            res.json({
                code: 10002,
                data: {},
                errMsg: '提交数据不完整'
            });

        }

        //User.findOne({'uid': uid}).then(function(result){
        //    if(!result){
        //        res.json({
        //            code: 10001,
        //            data: {},
        //            errMsg: '用户未登录'
        //        });
        //    } else {
        //
        //    }
        //}, function(err){
        //    if(err){
        //        res.json({
        //            code: 10001,
        //            data: {},
        //            errMsg: '用户未登录'
        //        });
        //    }
        //});

        //存储voteItem和vote
        createVotes(uid, leftVoteData, rightVoteData, intro, function(err, data){
            var resData = {};
            if(err){
                resData = {
                    code: 10003,
                    errMsg: '创建失败：' + err.toString(),
                    data: {}
                }
            } else {
                resData = {
                    code: 10000,
                    errMsg: '',
                    data: {
                        id: data['_id']
                    }
                }
            }
            res.send(resData);
        });
    }
});



module.exports = router;
