'use strict';

exports = module.exports = function(app, mongoose) {
    var reponsesSchema = new mongoose.Schema({
        contenu: { type: String, default: ''},
        question_id: {
            id: {type: mongoose.Schema.Types.ObjectId, ref:'questions'}
        },
        userCreated: {
            id: { type: mongoose.Schema.Types.ObjectId, ref:'User'}
        }
    });
    app.db.model('reponses', reponsesSchema);
};


/*'use strict';

exports = module.exports = function(app, mongoose) {
    var reponsesSchema = new mongoose.Schema({
        contenu: { type: String, default: ''},
        titreQuestion: { type: String, default: ''},
        userCreated: {
            id: { type: mongoose.Schema.Types.ObjectId, ref:'User'}
        }
    });
    app.db.model('reponses', reponsesSchema);
};*/
