'use strict';

exports = module.exports = function(app, mongoose) {
    var categoriesSchema = new mongoose.Schema({
        nom: { type: String, default: ''},
        date: { type: Date, default: Date.now },
        userCreated: {
            id: { type: mongoose.Schema.Types.ObjectId,  ref:'User'},
            name: {type: String, ref: 'User'}
        }
    });
    app.db.model('categories', categoriesSchema);
};
