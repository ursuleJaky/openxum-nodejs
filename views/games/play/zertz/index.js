'use strict';

exports.init = function (req, res) {
    res.render('games/play/zertz/index', {
        mode: (req.param('mode') === 'regular') ? 0 : 1,
        color: req.param('color') === 'one' ? 0 : 1,
        other_color: req.param('color') === 'one' ? 1 : 0,
        game_id: req.param('game_id')
    });
};