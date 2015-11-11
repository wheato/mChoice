var util = require('./util');


function init(voteId){

    var tpl = $('#J_index_tpl');
    console.log('index:' + voteId);

    getVoteData(voteId, function(data){
        console.log(data);
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

exports.init = init;
