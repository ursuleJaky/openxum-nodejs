'use strict';

exports.init = function(req, res){

    console.log(req.param('modification'));

    req.app.db.models.questions.update({_id: req.param('question_id')},{$set:{titre: req.param('modification')}}, function(err, user){});

    req.app.db.models.questions.findOne({_id: req.param('question_id')}, null,
        { safe: true }, function(err, question) {
            console.log(question.titre);
        });
    res.redirect('/account');
};
