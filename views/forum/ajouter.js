'use strict';

exports.init = function(req, res){
    console.log(req.param('contenu'));
    console.log(req.param('question_id'));

    var fieldsToSet = {
        contenu : req.param('contenu'),
        question_id: req.param('question_id'),
        userCreated: {
            id: req.user._id,
            name: req.user.username
        }
    };
    req.app.db.models.reponses.create(fieldsToSet, function(err, user){});
    res.redirect('/forum');
};
