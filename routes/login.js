var express = require('express'),
    weixin = require('../util/wxnode');
var router = express.Router();

var User = require('../db/user');

/* GET users listing. */
router.get('/:code', function(req, res, next) {

  weixin.auth(req.params.code, function (err, user) {
    if (err) {
      res.json({
        code: 1000,
        data: '',
        msg: err
      });

    } else {
      res.send(user.toString());
    }

  });

});



module.exports = router;
