var mongoose = require('mongoose'),
    config = rquire('../config');

mongoose.connect(config.db);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection Error'));

db.once('open', function(){
    console.log('Connection OK!');
});

module.exports = mongoose;