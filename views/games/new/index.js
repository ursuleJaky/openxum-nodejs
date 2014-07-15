'use strict';

exports.init = function (req, res) {
    req.app.db.models.Game.find({ type: 'online', userCreated: { id: req.user._id } }, null,
        { safe: true }, function (err, games) {
            var my_online_games = games;

            req.app.db.models.Game.find({ type: 'offline', userCreated: { id: req.user._id } }, null,
                { safe: true }, function (err, games) {
                    var my_offline_games = games;

                    req.app.db.models.Game.find({ type: 'online', 'userCreated.id': { '$ne': req.user._id } }, null,
                        { safe: true }, function (err, games) {
                            var other_online_games = games;

                            req.app.db.models.Game.find({ type: 'offline', 'userCreated.id': { '$ne': req.user._id } }, null,
                                { safe: true }, function (err, games) {
                                    var other_offline_games = games;

                                    res.render('games/new/index', {
                                        game: req.param('game'),
                                        user_id: req.user._id,
                                        my_online_games: my_online_games,
                                        my_offline_games: my_offline_games,
                                        other_online_games: other_online_games,
                                        other_offline_games: other_offline_games
                                    });
                                });
                        });
                });
        });
}