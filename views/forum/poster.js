'use strict';

exports.init = function(req, res){

    var fieldsToSet = {
        titre : req.param('titre'),
        contenu : req.param('contenu'),
        categorie_id: req.param('categorie_id'),
        userCreated: {
            id: req.user._id,
            name: req.user.username
        }
    }
    req.app.db.models.questions.create(fieldsToSet, function(err, user){});

    //var id_cat = req.param('categorie_id');
    //res.redirect('/forum/?categorie_id=#');
    res.redirect('/forum');
};