'use strict';

exports = module.exports = function(app, mongoose) {
    var reponsesSchema = new mongoose.Schema({
        contenu: { type: String, default: ''},
        question_id: { type: mongoose.Schema.Types.ObjectId, ref:'questions'},
        date: { type: Date, default: Date.now },
        userCreated: {
            id: { type: mongoose.Schema.Types.ObjectId, ref:'User'},
            name: {type: String, ref: 'User'}
        }
    });
    app.db.model('reponses', reponsesSchema);
};