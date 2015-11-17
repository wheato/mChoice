var index = require('./index'),
    create = require('./create'),
    util = require('./util'),
    weixin = require('./wx');

var routes = {
    '/v/:voteId': index.init,
    '/c': create.init,
};

var router = Router(routes);

router.init();

var state = util.getUrlParam('state');

if(state.indexOf('CREATE') >= 0){
    window.location.hash = '#/c';
    window.history.pushState(null, document.title, window.location.href);
} else if(state.indexOf('INDEX') >= 0){
    window.location.hash = '#/v/' + state.replace('INDEX', '');
    window.history.pushState(null, document.title, window.location.href);
}
//util.setCookie('mChoice_uid', '112233');

document.body.addEventListener('touchstart', function () { });
