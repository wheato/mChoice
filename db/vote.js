var mongoose = require('./dbHelper');

var Schema = mongoose.Schema;

var VoteSchema = new Schema({
    id: {type: String},
    createUser: {type: String},
    pubTime: {type: Number, default: 0},
    endTime: {type: Number, default: 0},
    choiceIds: {type: Array, default: []},
    winId: {type: String},
    intro: {type: String}
});

var Vote = mongoose.model('Vote', VoteSchema);

module.exports = Vote;




