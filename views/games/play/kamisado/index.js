'use strict';

exports.init = function (req, res) {
    if (req.user) {
        res.render('games/play/kamisado/index', {
            color: req.param('color') === 'black' ? 0 : 1,
            other_color: req.param('color') === 'black' ? 1 : 0,
            game_type: req.param('game_type'),
            game_id: req.param('game_id')
        });
    } else {
        res.redirect('/');
    }
};