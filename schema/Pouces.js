'use strict';

exports = module.exports = function(app, mongoose) {

    var poucesSchema = new mongoose.Schema({
        valeur: { type: Number, default: ''},
        reponse_id: { type: mongoose.Schema.Types.ObjectId, ref:'questions'},
        userCreated: {
            id: { type: mongoose.Schema.Types.ObjectId, ref:'User'},
            name: {type: String, ref: 'User'}
        }
    });
    app.db.model('Pouces', poucesSchema);
};
