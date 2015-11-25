'use strict';

exports = module.exports = function(app, mongoose) {
    var reponsesSchema = new mongoose.Schema({
        contenu: { type: String, default: ''},
        question_id: { type: mongoose.Schema.Types.ObjectId, ref:'questions'},
        date: { type: Date, default: Date.now},
        pleve: { type: Number, default: '0'},
        pbaisse: { type: Number, default: '0'},
        userCreated: {
            id: { type: mongoose.Schema.Types.ObjectId, ref:'User'},
            name: {type: String, ref: 'User'}
        }
    });
    app.db.model('reponses', reponsesSchema);
};