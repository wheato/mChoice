var express = require('express'),
    com = require('../util/common'),
    User = require('../db/user'),
    VoteItem = require('../db/voteItem'),
    Vote = require('../db/vote');

var router = express.Router();

router.get('/:id', function(req, res, next){
    var voteId = req.params.id;

    if(!voteId){
        //id 为 null
    }

    Vote.findOne({'_id': voteId}, function(err, vote){

        if(!vote){

        }


    })


});



module.exports = router;