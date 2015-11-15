var express = require('express'),
    com = require('../util/common'),
    User = require('../db/user'),
    VoteItem = require('../db/voteItem'),
    Vote = require('../db/vote');

var router = express.Router();

var endTimeMapping = [
    15 * 60,
    30 * 60,
    60 * 60,
    2 * 60 * 60,
    4 * 60 * 60,
    8 * 60 * 60,
    24 * 60 * 60,
];

function getUidFromCookie(req){
    return req.cookies["mChoice_uid"];
}

function createVotes(voteData, cb){
    var leftItem = new VoteItem(voteData.leftData),
        rightItem = new VoteItem(voteData.rightData),
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
            createUser: voteData.uid,
            endTime: Date.parse(new Date())/1000 + endTimeMapping[voteData.endTime],
            choiceIds: [leftItem['_id'], rightItem['_id']],
            winId: '',
            intro: voteData.intro
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
        rightVoteData = {},
        endTime = {},
        intro = '';

    //获取post数据
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
    endTime = postData['endTime'];

    if(!(intro && leftVoteData.name && leftVoteData.image &&
        rightVoteData.name && rightVoteData.image && endTime)){

        res.json({
            code: 10002,
            data: {},
            errMsg: '提交数据不完整'
        });
    }

    com.isLogin(uid, function(user){
        createVotes({
            uid: uid,
            leftData: leftVoteData,
            rightData: rightVoteData,
            intro: intro,
            endTime: endTime
        }, function(err, data){
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

    }, function(){
        res.json({
            code: 10001,
            data: {},
            errMsg: '用户未登录'
        });
    });
});



module.exports = router;
