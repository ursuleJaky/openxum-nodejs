'use strict';

exports.init = function(req, res) {
    console.log(req.param('question_id'));

    req.app.db.models.questions.findOne({_id: req.param('question_id')}, null,
        {safe: true}, function (err, question) {

            res.render('forum/index', {
                question: question
            });
        });
}