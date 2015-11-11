var index = require('./index'),
    create = require('./create'),
    wx = require('./wx');

var routes = {
    '/v/:voteId': index.init,
    '/c': create.init
};

var router = Router(routes);

wx.initWxSdk();
router.init();

