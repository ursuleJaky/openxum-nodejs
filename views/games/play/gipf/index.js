'use strict';

exports.init = function (req, res) {
    if (req.user) {
        res.render('games/play/gipf/index', {
            mode: (req.param('mode') === 'basic') ? 0 : (req.param('mode') === 'standard' ? 1 : 2),
            color: req.param('color') === 'black' ? 0 : 1,
            other_color: req.param('color') === 'black' ? 1 : 0,
            game_id: req.param('game_id')
        });
    } else {
        res.redirect('/');
    }
};