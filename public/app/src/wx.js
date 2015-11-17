var util = require('./util');


exports.initWxSdk = function(cb){
    window.localStorage.wxReady = 0;
    $.get(util.config.ajax.sign, function(res) {
        if (res.timestamp) {
            wx.config({
                debug: false,
                appId: util.config.wx.appId,
                timestamp: res.timestamp,
                nonceStr: res.noncestr,
                signature: res.signature,
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'hideMenuItems',
                    'showMenuItems',
                    'hideAllNonBaseMenuItem',
                    'showAllNonBaseMenuItem',
                    'translateVoice',
                    'startRecord',
                    'stopRecord',
                    'onRecordEnd',
                    'playVoice',
                    'pauseVoice',
                    'stopVoice',
                    'uploadVoice',
                    'downloadVoice',
                    'chooseImage',
                    'previewImage',
                    'uploadImage',
                    'downloadImage',
                    'getNetworkType',
                    'openLocation',
                    'getLocation',
                    'hideOptionMenu',
                    'showOptionMenu',
                    'closeWindow',
                    'scanQRCode',
                    'chooseWXPay',
                    'openProductSpecificView',
                    'addCard',
                    'chooseCard',
                    'openCard'
                ]
            })
        }
    });

    wx.error(function(res) {
        console.log('wx error')
    });

    wx.ready(function() {
        window.localStorage.wxReady = 1;
        cb && cb();
    });

};

exports.choseImg = function(cb) {

    wx.chooseImage({
        success: function(res) {
            cb && cb(res.localIds);
        }
    });

};

exports.uploadImg = function(id, cb){
    wx.uploadImage({
        localId: id,
        isShowProgressTips: 0,
        success: function(res) {
            var serverId = res.serverId;
            cb && cb(serverId);
        }
    });
};

exports.setShareData = function(data){
    wx.onMenuShareAppMessage({
        title: data.title,
        desc: data.desc,
        link: data.link,
        imgUrl: data.imgUrl,

        success: function() {

        },
        cancel: function() {

        }
    });

    wx.onMenuShareTimeline({
        title: data.desc,
        desc: data.desc,
        link: data.link,
        imgUrl: data.imgUrl,

        success: function() {

        },
        cancel: function() {

        }
    });
};

exports.login = function(state, cb){
    var code = util.getUrlParam('code');
    if (code) {
        $.get(util.config.ajax.login + code, function(res) {
            if (res.code == 10000) {
                util.setCookie('mChoice_nick', res.data.nickname, 7);
                util.setCookie('mChoice_uid', res.data.uid, 7);
                cb && cb();
            }
        });
    } else {

        location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + util.config.wx.appId +
            '&redirect_uri='+ encodeURIComponent(window.location.origin) +
            '&response_type=code&scope=snsapi_userinfo&state=' + state +'#wechat_redirect';
    }
};

exports.downloadImage = function(serverId, cb){
    wx.downloadImage({
        serverId: serverId, // 需要下载的图片的服务器端ID，由uploadImage接口获得
        isShowProgressTips: 0, // 默认为1，显示进度提示
        success: function (res) {
            var localId = res.localId; // 返回图片下载后的本地ID
            cb && cb(localId);
        }
    });
};