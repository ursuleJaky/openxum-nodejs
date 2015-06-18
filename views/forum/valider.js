'use strict';

exports.init = function(req, res){


    req.app.db.models.categories.find({nom: req.param('categorie')}, null,
        { safe: true }, function(err, categorie) {

            if(categorie.length == 0){
                var fieldsToSet = {
                    nom : req.param('categorie'),
                    userCreated: {
                        id: req.user._id,
                        name: req.user.username
                    }
                }
                req.app.db.models.categories.create(fieldsToSet, function(err, user){});
            }
        });
    res.redirect('/forum');
};