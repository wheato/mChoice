var express = require('express'),
    weixin = require('../util/wxnode');
var router = express.Router();

var User = require('../db/user');

/* GET users listing. */
router.get('/:code', function(req, res, next) {

  weixin.auth(req.params.code, function (err, user) {
    if (err) {
      res.json({
        code: 1001,
        data: '',
        msg: err
      });

    } else {
      var newUser = new User(user);
      var promise = newUser.save();

      promise.then(function(result){
        res.send(result);
      }, function(err){
        console.log(err);
      });

    }

  });

});



module.exports = router;
