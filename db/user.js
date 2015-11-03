var mongoose = require('./dbHelper');


var Schema = mongoose.Schema;

var UserScheme = new Schema({
    avatar: {type: String},
    uid: {type: String},
    nickname: {type: String},
    sex: {type: String}
});

var User = mongoose.model('User', UserScheme);

module.exports = User;

