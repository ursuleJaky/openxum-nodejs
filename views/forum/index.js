'use strict';

exports.init = function(req, res){

    if (req.param('categorie_id')){
        req.app.db.models.questions.find({categorie_id: req.param('categorie_id')}, null,
            { safe: true }, function(err, questions) {
                var mes_questions = questions ? questions : [];

                req.app.db.models.categories.findOne({_id: req.param('categorie_id')}, null,
                    { safe: true }, function(err, categorie) {

                        res.render('forum/index', {
                            categorie: categorie,
                            questions: mes_questions,
                            cat: false,
                            quest: true,
                            rep: false
                        });
                    });
            });
    }

    else if (req.param('question_id')){

        req.app.db.models.reponses.find({question_id: req.param('question_id')}, null,
            { safe: true }, function(err, reponses) {

                var mes_reponses = reponses ? reponses : [];
                req.app.db.models.questions.findOne({_id: req.param('question_id')}, null,
                    { safe: true }, function(err, question) {

                        res.render('forum/index', {
                            question: question,
                            reponses: mes_reponses,
                            cat: false,
                            quest: false,
                            rep: true
                        });
                    });
            });
    }

    else{
        var obj = ['a, b, c'];

        for (var prop in obj) {
            console.log('mes objects')
            console.log(prop)
        }
        req.app.db.models.categories.find({}, null,
            { safe: true }, function(err, categories) {
                var mes_categories = categories ? categories : [];

                res.render('forum/index',{
                    categories: mes_categories,
                    cat: true,
                    quest: false,
                    rep: false
                });
            });
    }
};