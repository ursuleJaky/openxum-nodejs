'use strict';

exports.init = function(req, res){
    console.log('id categorie')
    console.log(req.param('categorie_id'))

    if (req.param('categorie_id')){
        req.app.db.models.questions.find({categorie_id: req.param('categorie_id')}, null,
            { safe: true }, function(err, questions) {
                console.log(questions)
               // var mes_questions = questions ? questions : [];

                req.app.db.models.categories.find({_id: req.param('categorie_id')}, null,
                    { safe: true }, function(err, categorie) {

                        console.log(categorie)
                        console.log('mes questions')
                        console.log(questions)
                        console.log('toi')
                        res.render('forum/index', {
                            categorie: categorie,
                            questions: questions,
                            cat: false,
                            quest: true,
                            rep: false
                        });
                        console.log('moi')
                    });
            });
    }

    if (req.param('question_id')){
        req.app.db.models.reponses.find({question_id: req.param('question_id')}, null,
            { safe: true }, function(err, reponses) {

                req.app.db.models.questions.find({_id: req.param('question_id')}, null,
                    { safe: true }, function(err, question) {

                        console.log(question)
                        console.log('mes reponses')
                        console.log(reponses)
                        res.render('forum/index', {
                            question: question,
                            reponses: reponses,
                            cat: false,
                            quest: false,
                            rep: true
                        });
                    });
            });
    }

    else{
        req.app.db.models.categories.find({}, null,
            { safe: true }, function(err, categories) {

                res.render('forum/index', {
                    categories: categories,
                    cat: true,
                    quest: false,
                    rep: false
                });
            });
    }
};



/* derniere version
'use strict';

exports.init = function(req, res){

    if (req.param('nomCategorie')){
        req.app.db.models.questions.find({nomCategorie: req.param('nomCategorie')}, null,
            { safe: true }, function(err, questions) {
                console.log(req.param('nomCategorie'))
                console.log('mes questions')
                console.log(questions)
                res.render('forum/index', {
                    categorie: req.param('nomCategorie'),
                    questions: questions,
                    cat: false,
                    quest: true,
                    rep: false
                });
        });
    }

    if (req.param('titreQuestion')){
        req.app.db.models.reponses.find({titreQuestion: req.param('titreQuestion')}, null,
            { safe: true }, function(err, reponses) {
                req.app.db.models.questions.find({titre: req.param('titreQuestion')}, null,
                    { safe: true }, function(err, questions) {

                        console.log(req.param('titreQuestion'))
                        console.log(questions.contenu)
                        console.log('mes reponses')
                         console.log(reponses)
                        res.render('forum/index', {
                            question: req.param('titreQuestion'),
                            contenuQuestion: questions.contenu,
                            reponses: reponses,
                            cat: false,
                            quest: false,
                            rep: true
                        });
                    });
        });
    }

    else{
        req.app.db.models.categories.find({}, null,
            { safe: true }, function(err, categories) {
                res.render('forum/index', {
                    categories: categories,
                    cat: true,
                    quest: false,
                    rep: false
                });
            });
    }
};*/


/*'use strict';

exports.init = function(req, res){

    if (req.param('categorie_id')){
        req.app.db.models.questions.find({categorie_id: req.param('categorie_id')}, null,
            { safe: true }, function(err, questions) {

                var mesQuestions;

                if(questions == null){
                    mesQuestions = []
                }
                else{
                    mesQuestions= questions
                }

                req.app.db.models.categories.find({'userCreated.id': req.param('categorie_id')}, null,
                    { safe: true }, function(err, cat) {

                        res.render('forum/index', {
                            cat: cat,
                            categories: [],
                            questions: mesQuestions,
                            reponses: []
                        });
                    });
            });
    }

    if (req.param('question_id')){
        req.app.db.models.reponses.find({question_id: req.param('question_id')}, null,
            { safe: true }, function(err, reponses) {

                req.app.db.models.questions.find({'userCreated.id': req.param('question_id')}, null,
                    { safe: true }, function(err, quest) {
                        res.render('forum/index', {
                            quest: quest,
                            categories: [],
                            questions: [],
                            reponses: reponses
                        });
                    });
            });
    }

    else{
        req.app.db.models.categories.find({}, null,
            { safe: true }, function(err, categories) {
                res.render('forum/index', {
                    categories: categories,
                    questions: [],
                    reponses: []
                });
            });
    }
};*/
/*
 if (req.param('nomCategorie')){
 req.app.db.models.questions.find({nomCategorie: req.param('nomCategorie')}, null,
 { safe: true }, function(err, questions) {

 console.log(req.param('nomCategorie'))
 console.log('mes questions')
 console.log(questions)
 res.render('forum/index', {
 categorie: req.param('nomCategorie'),
 categories: [],
 questions: questions,
 reponses: []
 });
 */