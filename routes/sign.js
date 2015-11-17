var express = require('express'),
    config = require('../config'),
    weixin = require('../util/wxnode');
var router = express.Router();

/* GET sign listing. */
router.get('/', function(req, res, next) {
    var url = req.headers['referer'].split('#')[0];
    console.log(url);
    weixin.sign(url, function (resData) {
        res.send(resData);

    });
});



module.exports = router;
