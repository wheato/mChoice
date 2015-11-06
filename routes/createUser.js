
var express = require('express'),
    com = require('../util/common'),
    User = require('../db/user');

var router = express.Router();


router.get('/', function(req, res, next) {
    var user = new User({
        avatar: '......',
        uid: '112233',
        nickname: '测试用户',
        sex: 0
    });
    user.save();
});


module.exports = router;
