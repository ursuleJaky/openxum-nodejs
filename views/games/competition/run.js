'use strict';

exports.init = function (req, res) {
    if (req.user) {
        var game = req.param('game');
        var ai_types = req.param('ai_types');
        var urls = req.param('urls');
        var levels = req.param('levels');
        var players = [];

        for (var i = 0; i < 2; ++i) {
            if (ai_types[i] === 'random') {
                players[i] = 'RandomPlayer';
            } else if (ai_types[i] === 'mcts') {
                players[i] = 'MCTSPlayer';
            } else {
                players[i] = 'RestWebServicePlayer';
            }
        }

        res.render('games/competition/run', {
            game: game,
            name: game.charAt(0).toUpperCase() + game.substring(1, game.length),
            players: players,
            levels: levels,
            urls: urls,
            game_number: req.param('game_number')
        });
    } else {
        res.redirect('/');
    }
};