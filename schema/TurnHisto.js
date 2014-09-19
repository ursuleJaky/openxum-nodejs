'use strict';

exports = module.exports = function (app, mongoose) {
	var turnHistoSchema = new mongoose.Schema({
		gameId: { type: String, default: ''}, 
		gameDetail: [
		{
         type: { type: Number, default: ''},
         move: { type: String, default: ''},
         ring: {},
         coordinates: {},
         color: { type: String, default: ''}
			
		}]
	
    });
    turnHistoSchema.index({ name: 1 });
    turnHistoSchema.set('autoIndex', (app.get('env') === 'development'));
    app.db.model('TurnHisto', turnHistoSchema);
};