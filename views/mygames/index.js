'use strict';

exports.init = function (req, res) {
    if (req.user) {
        req.app.db.models.Game.find({ type: 'offline', status: 'run', $or: [
                { 'userCreated.id': req.user._id },
                { 'opponent.id': req.user._id }
            ] }, null,
            function (err, games) {
                if (games.length > 0) {
                    var gamesdetail = [];
                    var notdone = true;

                    games.forEach(function (game) {
                        req.app.db.models.User.findOne({_id: game.userCreated.id }, null,
                            { safe: true }, function (err, userCreated) {
                                game.userCreated.name = userCreated.username;
                                if (game.opponent !== null) {
                                    req.app.db.models.User.findOne({_id: game.opponent.id }, null,
                                        { safe: true }, function (err, opponent) {
                                            var isGameOwner = game.userCreated.id.toString() === req.user._id.toString();
                                            if (opponent) {
                                                game.opponent.name = opponent.username;
                                            }
                                            if (isGameOwner) {
                                                game.myturn = game.currentColor === game.color;
                                            } else {
                                                game.myturn = game.currentColor !== game.color;
                                            }
                                            gamesdetail.push(game);
                                            if (gamesdetail.length === games.length) {
                                                if (notdone) {
                                                    res.render('mygames/index', {
                                                        user_id: req.user._id,
                                                        my_offline_games: gamesdetail
                                                    });
                                                    notdone = false;
                                                }
                                            }
                                        });
                                }
                            });
                    });
                } else {
                    res.render('mygames/index', {
                        user_id: req.user._id,
                        my_offline_games: {}
                    });
                }
            });
    } else {
        res.redirect('/');
    }
};
