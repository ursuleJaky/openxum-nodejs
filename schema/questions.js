'use strict';

 exports = module.exports = function(app, mongoose) {

     var questionsSchema = new mongoose.Schema({

         titre: { type: String, default: ''},
         contenu: { type: String, default: '' },
         categorie_id: {
             id: { type: mongoose.Schema.Types.ObjectId, ref:'categories'}
         },
         userCreated: {
             id: { type: mongoose.Schema.Types.ObjectId, ref:'User'}
         }
     });

     app.db.model('questions', questionsSchema);
 };


/*'use strict';

exports = module.exports = function(app, mongoose) {
    var questionsSchema = new mongoose.Schema({
        titre: { type: String, default: ''},
        contenu: { type: String, default: '' },
        nomCategorie: { type: String, default: '' },
        userCreated: {
            id: { type: mongoose.Schema.Types.ObjectId, ref:'User'}
        }
    });
    app.db.model('questions', questionsSchema);
};*/
