/**
 * user: wheatowu
 * date: 2015/4/28
 * time: 10:29
 * description:
 * param:
 */
var needle = require('needle'),
    wxconfig = require('../config').wx,
    nodegrass = require('nodegrass'),
    crypto = require('crypto');

var getAccessToken = function(appid, secret, cb){
    var access_url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="
        + appid + "&secret=" + secret;
    needle.get(access_url, function(err, res){
        console.log(err);
        if(!err){
            var access_token = res.body.access_token;
            console.log("ac::"+ access_token);
            cb && cb(null, access_token);
        } else {
            cb && cb(err, null);
        }
    });
};

var getAuth = function(optionData, cb){
    var access_url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid={0}" +
        "&secret={1}&code={2}&grant_type=authorization_code";
    access_url = access_url.replace('{0}', optionData.appid).replace('{1}',
        optionData.secret).replace('{2}', optionData.code);
    needle.get(access_url, function(err, res){
        cb && cb(err, res.body);
    });
};

var getUserInfo = function(ac, openid, cb){
    console.log("ac::" + ac);
    var url = 'https://api.weixin.qq.com/sns/userinfo?access_token=' + ac
        + '&openid=' + openid + '&lang=zh_CN';
    nodegrass.get(url, function(data, status, headers){
        console.log(data);
        cb && cb(data);
    },{
        "Content-Type": "charset=UTF-8"
    });
};

var encryptString = function(ticket, url, cb){
    var sha1 = crypto.createHash('sha1');
    var str = "", noncestr, timestamp, signature;
    noncestr = createNoncestr(16);
    timestamp = Date.parse(new Date()) / 1000;
    str = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + "&timestamp=" + timestamp + "&url=" + url;
    sha1.update(str);
    signature = sha1.digest('hex');
    cb && cb({
        noncestr: noncestr,
        timestamp: timestamp,
        signature: signature
    });
};

var createNoncestr = function(){
    return (Math.random()).toString(36).slice(2);
};

var sign = function(url, cb){
    var ticket_url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token={act}&type=jsapi";
    if(global.jsapiTicket && Date.parse(new Date()) / 1000 - global.jsapiTicket.timestamp < 7200){

        var ticket = global.jsapiTicket.ticket;
        encryptString(ticket, url, cb);

    } else {
        getAccessToken(wxconfig.appid, wxconfig.secret, function(error, access_token){
            //全局缓存access_token
            if(error){
                throw error;
                return false;
            }
            global.accessToken = {
                timestamp: Date.parse(new Date()) / 1000,
                token: access_token
            };
            console.log(global.accessToken);

            //获取ticket
            needle.get(ticket_url.replace('{act}', access_token), function(err, res){
                if(!err){

                    //缓存ticket
                    global.jsapiTicket = {
                        timestamp: Date.parse(new Date()) / 1000,
                        ticket: res.body.ticket
                    };

                    //加密字符
                    encryptString(res.body.ticket, url, cb);

                } else {
                    throw 'ticket获取失败';
                }
            });
        });
    }
};



var getImageFromWx = function(serverId, cb){
    var image_url = "http://file.api.weixin.qq.com/cgi-bin/media/get?access_token={act}&media_id={id}";
    if(global.accessToken && global.accessToken.token &&

        Date.parse(new Date()) / 1000  - global.accessToken.timestamp < 7200){

        image_url = image_url.replace('{act}', global.accessToken.token).replace('{id}', serverId);

        needle.get(image_url, function(error, res){
            console.log("get Image::" + error);
            console.log("get Image res::" + res.headers);
            if(res.body["errmsg"] != 40007){
                var name = res.headers['content-disposition'];
                if(name == 'undefined') {name = 'name=' + Date.parse(new Date()) + '.jpg';}
                name = name.split('=')[1].slice(1).replace('"', '');
                cb && cb(null, name, res.body);
            } else {
                cb && cb(res.body);
            }
        });
    }
};

/*
 * 微信网页授权登录
 */
var auth = function(code, cb){
    /*  1 服务器错误
     *  2 微信openid获取失败
     *  3 用户信息获取失败
     */
    getAuth({
        code: code,
        appid: wxconfig.appid,
        secret: wxconfig.secret
    }, function(err, data){
        if(err){
            cb && cb(1, null);
        } else {
            console.log("auth::" + data);
            data = JSON.parse(data);

            if(data["errmsg"]){
                cb && cb(data["errmsg"], null);
            } else {
                getUserInfo(data["access_token"], data["openid"], function(res){
                    console.log("userInfo::" + res);
                    res = JSON.parse(res);
                    if(data["errmsg"]){
                        cb && cb(data["errmsg"], null);
                    } else {
                        var user = {
                            uid: res.unionid,
                            avatar: res.headimgurl,
                            nickname: res.nickname,
                            openid: res.openid,
                            accessToken: res.access_token,
                            refreshToken: res.refresh_token
                        };
                        cb && cb(null, user);
                    }
                });
            }
        }
    })
};

//外部接口
exports.sign = sign;
exports.auth = auth;
exports.getImageFromWx = getImageFromWx;