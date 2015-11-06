var User = require('../db/user');

function isLogin(uid, isFunc, noFunc){
    if(!uid){
        noFunc && noFunc();
    } else {
        User.findOne({'uid': uid}).then(function(result){
            if(!result){
                noFunc && noFunc();
            } else {
                isFunc(result);
            }
        }, function(err){
            if(err) {
                noFunc && noFunc();
            }
        });
    }
}


exports.isLogin = isLogin;