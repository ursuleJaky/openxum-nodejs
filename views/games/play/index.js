'use strict';

exports.init = function (req, res) {
    res.redirect('/games/play/' + req.param('game') + '/?color=' + req.param('color') +
        '&game_id=' + req.param('game_id'));
};