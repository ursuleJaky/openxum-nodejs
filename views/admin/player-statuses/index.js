'use strict';

exports.init = function (req, res, next) {
    req.app.db.models.User.find({}, {username: 1, roles: 1}, function (err, players) {
        var list = [];

        for(var i in players) {
            list.push({
                username: players[i].username,
                role: players[i].roles.admin !== undefined ? 'admin' : 'player'});
        }
        res.render('admin/player-statuses/index', {players: list});
    });
};