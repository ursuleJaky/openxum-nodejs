'use strict';

 exports = module.exports = function(app, mongoose) {

     var questionsSchema = new mongoose.Schema({

         titre: { type: String, default: ''},
         contenu: { type: String, default: '' },
         categorie_id: { type: mongoose.Schema.Types.ObjectId, ref:'categories' },
         date: { type: Date, default: Date.now },
         rep: { type: Number, default: '0'},
         userCreated: {
             id: { type: mongoose.Schema.Types.ObjectId, ref:'User'},
             name: {type: String, ref: 'User'}
         }
     });

     app.db.model('questions', questionsSchema);
 };