'use strict';

exports.init = function(req, res) {
    console.log('question_id');
    console.log(req.param('question_id'));

    req.app.db.models.questions.findOne({_id: req.param('question_id')}, null,
        {safe: true}, function (err, question) {

            console.log(question);

            res.render('forum/modifier/index', {
                question: question
            });
        });
};