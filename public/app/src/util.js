

/* 获取URL参数值 */
exports.getUrlParam = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

/* 设置cookie值 */
exports.setCookie = function(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + encodeURIComponent(value) +
        ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
};

/* 获取cookie值 */
exports.getCookie = function(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return decodeURIComponent(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
};

exports.checkLogin = function(){
    var uid = exports.getCookie('mChoice_uid');
    return (uid ? true : false);
};

var host = 'http://sbk.treedom.cn/';
exports.config = {
    ajax: {
        getVote: host + 'getVote/',
        up: host + 'up/',
        login: host + 'login/',
        sign: host + 'sign/',
        create: host + 'create'
    },
    wx: {
        appId: "wxb942ad39c3f82624",
        appSecret: ""
    }
};