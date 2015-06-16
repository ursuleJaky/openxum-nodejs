'use strict';

exports = module.exports = function(app, mongoose) {
    var categoriesSchema = new mongoose.Schema({
        nom: { type: String, default: ''},
        userCreated: {
            id: { type: mongoose.Schema.Types.ObjectId,  ref:'User'}
        }
    });
    app.db.model('categories', categoriesSchema);
};
