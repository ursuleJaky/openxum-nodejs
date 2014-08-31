'use strict';

exports.init = function (req, res) {
    res.render('games/play/invers/index', {
        color: req.param('color') === 'red' ? 0 : 1,
        other_color: req.param('color') === 'red' ? 1 : 0,
        game_id: req.param('game_id')
    });
};