'use strict';

exports.init = function (req, res) {
    res.render('games/create/index', { game: req.param('game') });
};

exports.create = function (req, res) {
    if (req.param('game_type') === 'ai') {
        res.redirect('/games/play/?game=' + req.param('game') +
            '&color=' + req.param('color') + '&game_id=-1');
    } else {
        res.redirect('/');
    }
};
