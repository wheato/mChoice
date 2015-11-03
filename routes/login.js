var express = require('express');
var router = express.Router();

var User = require('../db/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.findOne({uid: 'sdfsdfsdfdsf'}, function(err, data){

  });
  res.send('respond with a resource');
});



module.exports = router;
