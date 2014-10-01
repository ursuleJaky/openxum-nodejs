'use strict';
var colors = {0: 'black', 1: 'white'};

exports.init = function (req, res) {
	if (req.user) {
		req.app.db.models.Game.find({ type: 'offline', $or: [ {'userCreated.id': req.user._id }, {'opponent.id': req.user._id} ] }, null,
		function (err, games) {
			if (games != "") { 
				var gamesdetail = [];
				var notdone=true;
				games.forEach( function (game) {	 
					req.app.db.models.User.findOne({_id: game.userCreated.id }, null,
						{ safe: true }, function (err, userCreated) {	
							game.userCreated.name = userCreated.username;
							if (game.opponent !== null) {
								req.app.db.models.User.findOne({_id: game.opponent.id }, null,
									{ safe: true }, function (err, opponent) {
										if (opponent){
											game.opponent.name = opponent.username 
										}
 										if (game.opponent.id.toString() == req.user._id.toString()) {
											console.log(game.color + colors[0]);
 											if (game.color.toString() == colors[0].toString()){
 												game.color = colors[1];
 											} else {
 												game.color = colors[0];
 											}											
 										} 
										console.log(game);
										
										gamesdetail.push(game);
										if (gamesdetail.length === games.length){
											if (notdone){
											var my_offline_games = gamesdetail;
											res.render('mygames/index', {
												user_id: req.user._id,
												my_offline_games: my_offline_games,
											});
											notdone=false;
										}
										}
									});
								}
							});
					
						});
				 
						
					} else {
						res.render('mygames/index', {
							user_id: req.user._id,
							my_offline_games: {},
						});
					}
				});
			} else {
		res.redirect('/');
	}
}
