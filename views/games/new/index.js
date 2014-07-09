'use strict';

exports.init = function (req, res) {
    res.render('games/new/index', { game: req.param('game') });
};