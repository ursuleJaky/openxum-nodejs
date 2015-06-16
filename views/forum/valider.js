'use strict';

exports.init = function(req, res){
   /* console.log(req.param('titre'));
    console.log(req.param('contenu'));
    console.log(req.param('categorie'));*/

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




/*'use strict';

exports.init = function(req, res){
    console.log(req.param('titre'));
    console.log(req.param('contenu'));
    console.log(req.param('categorie'));

    req.app.db.models.categories.find({nom: req.param('categorie')}, null,
        { safe: true }, function(err, categories) {

            if(categories.length == 0){
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

    var fieldsToSet = {
        titre : req.param('titre'),
        contenu : req.param('contenu'),
        nomCategorie: req.param('categorie'),
        userCreated: {
            id: req.user._id,
            name: req.user.username
        }
    }
    console.log(fieldsToSet);
    req.app.db.models.questions.create(fieldsToSet, function(err, user){});
    res.redirect('/forum');
};*/

/*'use strict';

 exports.init = function(req, res){
 console.log(req.param('categorie'));
 console.log(req.param('titre'));
 console.log(req.param('contenu'));

 if(req.user){
 req.app.db.models.categories.find({nom: req.param('categorie')}, null,
 { safe: true }, function(err, categories) {

 if(categories.length == 0){
 var fieldsToSet = {
 nom : req.param('categorie'),
 userCreated: {
 id: req.user._id,
 name: req.user.username
 }
 }
 }

 console.log(categories.nom);
 console.log(fieldsToSet);
 req.app.db.models.categories.create(fieldsToSet, function(err, user){});

 var fieldsToSet1 = {
 titre : req.param('titre'),
 contenu : req.param('contenu'),
 categorie_id: categories.id,
 userCreated: {
 id: req.user._id,
 name: req.user.username
 }
 }

 //console.log(fieldsToSet1);
 req.app.db.models.questions.create(fieldsToSet1, function(err, user){});
 });
 }
 res.redirect('/forum');
 };*/