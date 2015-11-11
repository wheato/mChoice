var util = require('./util');

var $checks = null,
    $intro = null,
    $voteNames = null,
    $leftPhoto = null,
    $rightPhoto = null,
    $btnCreate = null;

function init(){

    var tpl = $('#J_create_tpl').html(),
        $el = $('.m-wrap'),
        $footer = $('footer');

    var $currentContent = $footer.siblings('div');

    if($currentContent.length > 0){
        $currentContent.remove();
    }
    $footer.before(tpl);

    $checks = $('.select-items input');
    $intro = $('#J_form_intro');
    $voteNames = $('.vote input');
    $leftPhoto = $('#J_form_leftPhoto');
    $rightPhoto = $('#J_form_rightPhoto');
    $btnCreate = $('.btn-create');

    $el.on('change', 'input', checkInput);
    $el.on('change', 'textarea', checkInput);

    $btnCreate.on('click', upload);
}

function checkInput(e){
    var $checks = $('.select-items input'),
        $intro = $('#J_form_intro'),
        $voteNames = $('.vote input'),
        $leftPhoto = $('#J_form_leftPhoto'),
        $rightPhoto = $('#J_form_rightPhoto'),
        $btnCreate = $('.btn-create'),
        all = false;

    //判断是否选中倒计时
    $checks.each(function(){
        if($(this).get(0).checked){
            all = true;
        }
    });

    //判断是否有填写介绍
    if($intro.val() == ''){
        all = false;
    }

    //判断是否有照片
    if(!$leftPhoto.attr('data-value') || !$rightPhoto.attr('data-value')){
        all = false;
    }

    //判断是否填写名称
    $voteNames.each(function(){
        if(!$(this).val()){
            all = false;
        }
    });

    if(all){
        if(!$btnCreate.hasClass('able')){
            $btnCreate.removeClass('disable').addClass('able');
        }
    } else {
        if(!$btnCreate.hasClass('disable')){
            $btnCreate.removeClass('able').addClass('disable');
        }
    }
}

function upload(){

    if($(this).hasClass('disable')){
        return false;
    }

    var endTime = null,
        leftName = $voteNames.eq(0).val(),
        rightName = $voteNames.eq(1).val();

    $checks.each(function(){
        if($(this).get(0).checked){
            endTime = $(this).val();
        }
    });
    var postData = {
        intro: $intro.val(),
        leftVoteImageId: $leftPhoto.attr('data-value'),
        rightVoteImageId: $rightPhoto.attr('data-value'),
        endTime: endTime,
        leftVoteName: leftName,
        rightVoteName: rightName
    };

    $.post(util.config.ajax.create, postData, function(res){
        if(res.code != 10000){
            alert(res.errMsg);
        } else {
            window.location.hash = '#/v/' + res.data.id;
        }
    });
}

exports.init = init;
