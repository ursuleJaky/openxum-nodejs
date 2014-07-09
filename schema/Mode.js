'use strict';

exports = module.exports = function (app, mongoose) {
    var modeSchema = new mongoose.Schema({
        value: { type: String, default: '' }
    });
    app.db.model('Mode', modeSchema);
};
