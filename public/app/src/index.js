var util = require('./util'),
    weixin = require('./wx');

var tpl = $('#J_index_tpl').html(),
    $el = $('.m-wrap'),
    $footer = $('footer');

function init(voteId){

    var $currentContent = $footer.siblings('div');

    $currentContent.length > 0 && ($currentContent.remove());

    getVoteData(voteId, function(data){

        data.createTime = timestampToDate(data.pubTime);
        var html = doT.template(tpl)(data);
        $footer.before(html);
        bindEvent(data);
        countDown($('.m-countdown time'), data.endTime, data.isEnd);
        if(data.voteItem){
            $('.btn-vote').eq(data.voteItem).addClass('already');
        }

        //download image from weixin
        weixin.downloadImage(data.leftVote.image, function(localId){
            var imgSrc = 'url(' + localId + ');';
            $('#J_left_photo').css('background-image', imgSrc);
        });
        weixin.downloadImage(data.rightVote.image, function(localId){
            var imgSrc = 'url(' + localId + ');';
            $('#J_right_photo').css('background-image', imgSrc);
        });

    });

}

function getVoteData(voteId, cb){

    var url = util.config.ajax.getVote + voteId;

    $.get(url, function(res){
        if(res.code != 10000){
            alert(data.errMsg);
            return ;
        }
        cb && cb(res.data);

    });
}

function bindEvent(data){

    $('#J_goto_create').on('click', gotoCreateHandle);

    if(!data.isEnd && !data.isVoted){
        $el.on('click', '.btn-vote', voteHandle);
    }
}

function voteHandle(e){
    var itemId = $(this).attr('data-id'),
        url = util.config.ajax.up + itemId;

    var $that = $(this);

    $(this).addClass('already');

    $.get(url, function(res){
        if(res.code != 10000){
            alert(res.errMsg);
            return ;
        } else {
            //更新投票数
            var $num = $that.prev().find('span');
            $num.html(parseInt($num.html()) + 1);
            $el.off('click', '.btn-vote', voteHandle);
        }
    });
}

function gotoCreateHandle(e){
    window.location.hash = '#/c';
}

function timestampToDate(st){
    var date = new Date(parseInt(st) * 1000),
        year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes();

    month < 10 && (month = '0'+ month);
    day < 10 && (day = '0'+ day);
    hour < 10 && (hour = '0'+ hour);
    minute < 10 && (minute = '0' + minute);

    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
}

function countDown($target, time, end){

    var count = time - Date.parse(new Date()) / 1000,
        timer = null;

    if(end){
        $target.html('00:00:00');
        return ;
    }

    function down(){
        var hour = Math.floor(count / 3600),
            minutes = Math.floor(count % (3600) / 60),
            senconds = count - hour * 3600 - minutes * 60;

        hour < 10 && (hour = '0' + hour);
        minutes < 10 && (minutes = '0' + minutes);
        senconds < 10 && (senconds = '0' + senconds);

        var str = hour + ':' + minutes + ':' + senconds;

        $target.html(str);
        count--;
        if(count >= 0){
            timer = setTimeout(down, 1000);
        } else {
            //倒计时结束
            clearTimeout(timer);
            $el.off('click', '.btn-vote', voteHandle);
        }
    }

    down();

}

exports.init = init;
