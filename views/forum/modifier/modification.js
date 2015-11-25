'use strict';

exports.init = function(req, res){

    db.questions.update({_id: req.param('question_id')},{$set:{titre: req.param('modification')}})
    res.redirect('/account');
};
