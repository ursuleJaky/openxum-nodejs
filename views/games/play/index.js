'use strict';

exports.init = function (req, res) {
    res.redirect('/games/play/' + req.param('game') + '/?color=' + req.param('color') +
        '&mode=' + req.param('mode') + '&game_type=' + req.param('game_type') + '&game_id=' + req.param('game_id'));
};