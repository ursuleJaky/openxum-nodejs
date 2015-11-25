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

    req.app.db.models.User.find({}, null,
        { safe: true }, function(err, users) {
            console.log(users)

            for(var utilisateur in users){
                console.log('notification initiale')
                console.log(utilisateur.notification)
                console.log(utilisateur)

                var notif = utilisateur.notification;
                notif++;
                req.app.db.models.User.update({_id: utilisateur._id},{$set:{notification: notif}}, function(err, user){});

                console.log('notification finale')
                console.log(utilisateur.notification)
            }
        });

    req.app.db.models.questions.create(fieldsToSet, function(err, user){});

    //res.redirect('/forum/?categorie_id=#');
    res.redirect('/forum');
};