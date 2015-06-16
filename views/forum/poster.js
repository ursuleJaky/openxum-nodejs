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
    console.log(req.param('categorie_id'))
    req.app.db.models.questions.create(fieldsToSet, function(err, user){});
    res.redirect('/forum');
};






/*
 extends ../../layouts/default

 block head
 title Forum

 block neck
 link(rel='stylesheet', href='bootstrap.min.css')
 link(rel='stylesheet', href='/views/index.min.css?#{cacheBreaker}')

 block body
 br
 div.row
 div.col-sm-12
 div.page-header
 h1(style="text-align: center; width: 100%; height: 70px; padding-top: 10px; border-color: #000000; border-width: 5px; border-radius:5px; background-color: #d3d3d3; color: #00008b") #{__('Forum')}
 div.panel-body



 if rep == true

 h3(style="text-align: center; width: 100%; height: 30px; font-family: purisa; border-radius:5px; background-color: #d3d3d3; color: #528CE0") #{question.titre}
 p
 #{question.contenu}

 table.table
 each reponse in reponses
 tr
 td
 p #{reponse.contenu}

 if user && user.username
 h3(style="text-decoration: underline; font-family: purisa; color: #528CE0") #{__('ajouter un reponse')}
 br
 br
 form(name="postez", method ="post" action = "/forum/ajouter")
 textarea(style="width: 50%; height: 100px;", id="reponse" name="contenu" placeholder="contenu de la reponse")
 br
 br
 input(type="submit", value="ajouter")





 if quest == true

 h3(style="text-align: center; width: 100%; height: 30px; font-family: purisa; border-radius:5px; background-color: #d3d3d3; color: #528CE0") #{categorie.nom}
 br
 br
 h3(style="text-align: center; width: 100%; height: 30px; font-family: liberation serif; border-radius:5px; background-color: #d3d3d3; color: #528CE0") #{__('Discussion/Auteur')}
 br
 br
 table.table
 each question in questions
 tr
 td
 a(style="color: #000000; font-size: 20px;", href='/forum?question_id=#{question._id}') #{question.titre}



 if cat == true

 h2(style="text-align: center; width: 100%; height: 40px; font-family: liberation serif; border-radius:5px; background-color: #d3d3d3; color: #0000ff") #{__('Bienvenu sur le forum')}

 if user && user.username
 h3(style="text-decoration: underline; font-family: purisa; color: #528CE0") #{__('ajouter un sujet')}
 br
 form(name="cat", method ="post" action = "/forum/valider")
 input(type="text", name="categorie", placeholder="entrez votre categorie")
 br
 br
 input(type="text", name="titre", placeholder="titre")
 br
 br
 textarea(style="width: 50%; height: 100px;", id="questions", name="contenu" placeholder="contenu du sujet")
 br
 br
 input(type="submit", value="postez")
 br
 br

 h3(style="text-align: center; width: 100%; height: 30px; font-family: liberation serif; border-radius:5px; background-color: #d3d3d3; color: #528CE0") #{__('Mes differentes categories')}
 br
 br
 table.table
 each categorie in categories
 tr
 td
 a(style="color: #000000; font-size: 20px;", href='/forum/?categorie_id=#{categorie._id}') #{categorie.nom}
 */