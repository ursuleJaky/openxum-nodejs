'use strict';

exports.init = function(req, res){
    console.log('id della reponse');
    console.log(req.param('reponse_id'));

    req.app.db.models.Pouces.findOne({reponse_id: req.param('reponse_id')}, {"userCreated.id": req.user._id}, null,
        { safe: true }, function(err, pouce) {

            if(pouce!=null){
                console.log('pouce');
                console.log(pouce);
                req.app.db.models.Pouces.remove({_id: pouce._id}, function(err, user){});

                req.app.db.models.reponses.findOne({_id: req.param('reponse_id')}, null,
                    { safe: true }, function(err, reponse) {
                        console.log('reponse');
                        console.log(reponse);
                        var val = reponse.pleve--;
                        req.app.db.models.reponses.update({_id: req.param('reponse_id')},{$set:{plevee: val}}, function(err, user){});
                    });
            }

            else{
                var fieldsToSet = {
                    valeur : 1,
                    reponse_id: req.param('reponse_id'),
                    userCreated: {
                        id: req.user._id,
                        name: req.user.username
                    }
                };
                req.app.db.models.Pouces.create(fieldsToSet, function(err, user){});

                req.app.db.models.reponses.findOne({_id: req.param('reponse_id')}, null,
                    { safe: true }, function(err, reponse) {
                        console.log('reponse');
                        console.log(reponse);
                        var val = reponse.pleve++;
                        req.app.db.models.reponses.update({_id: req.param('reponse_id')},{$set:{plevee: val}}, function(err, user){});
                    });
            }
    });

    console.log('fin');
    res.redirect('/forum');
};
