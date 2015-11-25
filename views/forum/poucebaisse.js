'use strict';

exports.init = function(req, res){

    console.log(req.param('reponse_id'));

    req.app.db.models.pouces.findOne({reponse_id: req.param('reponse_id')}, {"userCreated.id": req.user._id}, null,
        { safe: true }, function(err, pouce) {

            if(pouce!=null){
                req.app.db.models.pouces.remove({_id: pouce._id}, function(err, user){});

                req.app.db.models.reponses.findOne({_id: req.param('reponse_id')}, null,
                    { safe: true }, function(err, reponse) {
                        var val = reponse.pleve++;
                        req.app.db.models.reponses.update({_id: req.param('reponse_id')},{$set:{plevee: val}}, function(err, user){});
                    });
            }

            else{
                var fieldsToSet = {
                    valeur : -1,
                    reponse_id: req.param('reponse_id'),
                    userCreated: {
                        id: req.user._id,
                        name: req.user.username
                    }
                };
                req.app.db.models.pouces.create(fieldsToSet, function(err, user){});

                req.app.db.models.reponses.findOne({_id: req.param('reponse_id')}, null,
                    { safe: true }, function(err, reponse) {
                        var val = reponse.pleve--;
                        req.app.db.models.reponses.update({_id: req.param('reponse_id')},{$set:{plevee: val}}, function(err, user){});
                    });
            }
        });

    res.redirect('/forum');
};
