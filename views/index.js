'use strict';

exports.init = function (req, res, next) {
    var sigma = {};
    var collections = ['User', 'Account', 'GameType', 'Game'];
    var queries = [];
    var last = [];

    collections.forEach(function (el, i, arr) {
        queries.push(function (done) {
            req.app.db.models[el].count({}, function (err, count) {
                if (err) {
                    return done(err, null);
                }
                sigma['count' + el] = count;
                done(null, el);
            });
        });
    });

    queries.push(function (done) {
        req.app.db.models.GameHisto.find({ }, null,
            { safe: true }, function (err, gamehisto) {
                for (var key in gamehisto) {
                    var itemdata = {};
                    var item = gamehisto[key];

                    req.app.db.models.User.findOne({_id: item.userCreated.id }, null,
                        { safe: true }, function (err, userCreated) {
                            if (userCreated) {
                                itemdata.userCreated = userCreated.username;
                                req.app.db.models.User.findOne({_id: item.opponent.id }, null,
                                    { safe: true }, function (err, opponent) {
                                        if (opponent) {
                                            itemdata.opponent = opponent.username
                                            req.app.db.models.User.findOne({_id: item.winner.id }, null,
                                                { safe: true }, function (err, winner) {
                                                    if (winner) {
                                                        itemdata.winner = winner.username
                                                        req.app.db.models.GameType.findOne({_id: item.game }, null,
                                                            { safe: true }, function (err, gametype) {
                                                                if (gametype) {
                                                                    itemdata.gameType = gametype.name
                                                                    last.push(itemdata);
                                                                }
                                                            });
                                                    }
                                                });
                                        }
                                    });
                            }
                        });
                }
                done(null);
            });
    });

    var asyncFinally = function (err, results) {
        if (err) {
            return next(err);
        }
        res.render('index', { count: sigma, histo: last });
    };

    require('async').parallel(queries, asyncFinally);
};