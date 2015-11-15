var express = require('express'),
    com = require('../util/common'),
    User = require('../db/user'),
    VoteItem = require('../db/voteItem'),
    Vote = require('../db/vote');

var router = express.Router();

router.get('/:id', function(req, res, next){
    var voteId = req.params.id,
        uid = req.cookies["mChoice_uid"];

    var user = null,
        creator = null,
        leftVote = null,
        rightVote = null;

    if(!voteId){
        res.json({
            code: 10020,
            errMsg: 'ID为空',
            data: {}
        });
    }

    Vote.findOne({'_id': voteId}, function(err, vote){

        var leftId = null,
            rightId = null,
            creatorId = null;

        if(err){
            res.json({
                code: 10021,
                errMsg: '数据获取失败',
                data: {}
            });
        }

        if(!vote){
            res.json({
                code: 10022,
                errMsg: 'ID不正确',
                data: {}
            });

            return;
        }

        creatorId = vote.createUser;
        leftId = vote.choiceIds[0];
        rightId = vote.choiceIds[1];

        User.findOne({uid: creatorId}).then(function(user){
            creator = {
                avatar: user.avatar,
                nickname: user.nickname
            };

            return VoteItem.findOne({'_id': leftId});
        }, function(err){

        })
        .then(function(result){
             leftVote = result;
             return VoteItem.findOne({'_id': rightId});
        }, function(err){

        })
        .then(function(result){
            rightVote = result;

            var posData = {
                voteId: voteId,
                intro: vote.intro,
                pubTime: vote.pubTime,
                endTime: vote.endTime,
                creator: creator,
                leftVote: leftVote,
                rightVote: rightVote,
                isVoted: 0
            };

            //判断投票是否结束
            if(Date.parse(new Date())/1000 >= vote.endTime){
                posData.isEnd = 1;

                if(leftVote.voteTotal > rightVote.voteTotal){
                    posData.winId = 0;
                } else if(leftVote.voteTotal < rightVote.voteTotal){
                    posData.windId = 1;
                } else {
                    posData.windId = 3;
                }
            } else {
                posData.isEnd = 0;
                posData.windId = null;
            }
            if(uid){
                for(var i = 0, len = leftVote.voteRecord.length; i < len; i++){
                    if(uid == leftVote.voteRecord[i]){
                        posData.isVoted = 1;
                        posData.voteItem = 0;
                    }
                }
                for(var i = 0, len = rightVote.voteRecord.length; i < len; i++){
                    if(uid == rightVote.voteRecord[i]){
                        posData.isVoted = 1;
                        posData.voteItem = 1;
                    }
                }
            }
            res.json({
                code: 10000,
                errMsg: "",
                data: posData
            });
        }, function(err){

        });

    })


});



module.exports = router;