'use strict';

exports.init = function (req, res) {
    if (req.user) {
        var game = req.param('game');

        res.render('games/competition/index', {
            game: game
        });
    } else {
        res.redirect('/');
    }
};