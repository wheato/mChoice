var express = require('express'),
    weixin = require('../util/wxnode');
var router = express.Router();

/* GET sign listing. */
router.get('/', function(req, res, next) {
    weixin.sign(req.headers['referer'], function (resData) {

        res.send(resData);

    });
});



module.exports = router;
