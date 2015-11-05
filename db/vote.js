var mongoose = require('./dbHelper');

var Schema = mongoose.Schema;

var VoteSchema = new Schema({
    createUser: {type: String},
    pubTime: {type: Number, default: Date.parse(new Date())/1000},
    endTime: {type: Number, default: 0},
    choiceIds: {type: Array, default: []},
    winId: {type: String},
    intro: {type: String}
});

var Vote = mongoose.model('Vote', VoteSchema);

module.exports = Vote;

