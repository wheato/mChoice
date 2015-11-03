var mongoose = require('./dbHelper');

var Schema = mongoose.Schema;

var VoteItemSchema = new Schema({
    name: {type: String},
    image: {type: String},
    voteRecord: {type: Array, default: []},
    voteTotal: {type: Number, default: 0}
});

var VoteItem = mongoose.model('VoteItem', VoteItemSchema);

module.exports = VoteItem;

