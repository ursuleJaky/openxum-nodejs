'use strict';

exports.init = function (req, res) {
	if (req.user) {
        

		req.app.db.models.Game.find({ type: 'offline', userCreated: { id: req.user._id } }, null,
		{ safe: true }, function (err, games) {
			var my_offline_games = games;
			res.render('mygames/index', {
				game: req.param('game'),
				user_id: req.user._id,
				my_offline_games: my_offline_games,
			});
		});                  
	} else {
		res.redirect('/');
	}
}
