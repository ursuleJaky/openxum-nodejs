'use strict';
var colors = { black: 0, white: 1};

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
                                        var isGameOwner = (game.userCreated.id.toString() === req.user._id.toString());
                                        
                                        if (isGameOwner) {
                                            game.turnsequence++;
                                        }
                                        game.myturn = ((game.turnsequence+colors[game.color])%2 === 0);
                                        
                                        if (game.opponent.id){
                                            if (isGameOwner) {
                                                if (game.color.toString() === 'black'){
                                                    game.color = 'white';
                                                } else {
                                                    game.color = 'black';
                                                }											
                                            } 
                                        }		
                                        								
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
