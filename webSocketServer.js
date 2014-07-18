var wss = require('websocket').server;

exports.Server = function (app) {

    this.init = function (app) {
        this.server = new wss({
            httpServer: app.server
        });
        clients = { };
        currentGames = { };
    };

    this.processRequest = function (request) {
        var connection = request.accept(null, request.origin);

        connection.on('message', function (message) {
            onMessage(connection, message);
        });

        connection.on('close', function (connection) {
            onDisconnect(request.socket._peername.port);
        });
    };

    var onConnect = function (connection, msg) {
//        console.log('[OpenXum] connect ' + msg.user_id);

        clients[msg.user_id] = connection;
        sendConnectedClients();
    };
	 

    var onDisconnect = function (port) {
        var index;
        var found = false;

        for (index in clients) {
            if (clients[index] && clients[index].socket._peername.port == port) {
                found = true;
            }
        }
        if (found) {
//            console.log('[OpenXum] disconnect ' + index);

            clients[index] = undefined;
            currentGames[index] = undefined;
            sendConnectedClients();
        }
    };

    var onConfirm = function (msg) {
        app.db.models.Game.update({ _id: msg.game_id }, { status: 'run', 'opponent.id': msg.opponent_id }, { }, function (err, numAffected) {
            app.db.models.Game.findOne({ _id: msg.game_id }, null,
                { safe: true }, function (err, game) {
                    app.db.models.User.findOne({ _id: msg.opponent_id }, null,
                        { safe: true }, function (err, user) {
                            var c_opponent = clients[user.username];

                            app.db.models.User.findOne({ _id: msg.owner_id }, null,
                                { safe: true }, function (err, user2) {
                                    var c_owner = clients[user2.username];
                                    var response = {
                                        type: 'confirm',
                                        game_id: msg.game_id,
                                        owner_id: user2.username,
                                        opponent_id: user.username,
                                        color: game.color,
                                        mode: game.mode
                                    };

//                                    console.log('confirm ' + msg.game_id + ' by ' + user2.username + ' against ' + user.username);

                                    c_owner.send(JSON.stringify(response));
                                    if (c_opponent) {
                                        c_opponent.send(JSON.stringify(response));
                                    }
                                });
                        });
                });
        });
    };

    var onFinish = function (msg) {
        var game_id = currentGames[msg.user_id].game_id;

        app.db.models.Game.findOne({ _id: game_id }, null,
            { safe: true }, function (err, game) {
                delete clients[msg.user_id];
                delete currentGames[msg.user_id];
                if (game) {
                    game.remove(function(err) { });
                }
            });
    };

    var onJoin = function (msg) {
        app.db.models.Game.findOne({ _id: msg.game_id }, null,
            { safe: true }, function (err, game) {
                app.db.models.User.findOne({ _id: msg.opponent_id }, null,
                    { safe: true }, function (err, user) {
                        var owner_id = game.userCreated.id;
                        var c_opponent = clients[user.username];

                        app.db.models.User.findOne({ _id: owner_id }, null,
                            { safe: true }, function (err, user2) {
                                var c_owner = clients[user2.username];
                                var response = {
                                    type: 'join',
                                    game_id: msg.game_id,
                                    owner_id: owner_id,
                                    owner_name: user2.username,
                                    opponent_id: msg.opponent_id,
                                    opponent_name: user.username
                                };

//                                console.log('join ' + msg.game_id + ' by ' + user2.username + ' [owner] against ' + user.username + ' [opponent]');

                                c_opponent.send(JSON.stringify(response));
                                if (c_owner) {
                                    c_owner.send(JSON.stringify(response));
                                }
                            });
                    });
            });
    };

    var onMessage = function (connection, message) {
        var msg = JSON.parse(message.utf8Data);

        if (msg.type === 'connect') {
            onConnect(connection, msg);
        } else if (msg.type === 'join') {
            onJoin(msg);
        } else if (msg.type === 'confirm') {
            onConfirm(msg);
        } else if (msg.type === 'play') {
            onPlay(connection, msg);
        } else if (msg.type === 'turn') {
            onTurn(msg);
        } else if (msg.type === 'finish') {
            onFinish(msg);
        } else if (msg.type === 'info') {
            onConnect(connection,msg);
        }
    };

    var onPlay = function (connection, msg) {
//        console.log('play: ' + msg.game_id + ' by ' + msg.user_id + ' against ' + msg.opponent_id);

        clients[msg.user_id] = connection;
        currentGames[msg.user_id] = {
            game_id: msg.game_id,
            opponent_id: msg.opponent_id
        };
    };

    var onTurn = function (msg) {
        var c_opponent = clients[currentGames[msg.user_id].opponent_id];
        var response;

        if (msg.move == 'put_ring' || msg.move == 'put_marker' || msg.move == 'remove_ring' ||
            msg.move == 'remove_row') {

//            console.log('turn: ' + msg.move + ' ' + msg.coordinates.letter + msg.coordinates.number
//                + ' by ' + msg.color + ' / ' + msg.user_id);

            response = {
                type: 'turn',
                move: msg.move,
                coordinates: {
                    letter: msg.coordinates.letter,
                    number: msg.coordinates.number
                },
                color: msg.color
            };
        } else if (msg.move == 'move_ring') {

//            console.log('turn: ' + msg.move + ' ' + msg.coordinates.letter + msg.coordinates.number
//                + ' to ' + msg.ring.letter + msg.ring.number + ' / ' + msg.user_id);

            response = {
                type: 'turn',
                move: msg.move,
                ring: {
                    letter: msg.ring.letter,
                    number: msg.ring.number
                },
                coordinates: {
                    letter: msg.coordinates.letter,
                    number: msg.coordinates.number
                }
            };
        }
        if (c_opponent != undefined) {
            c_opponent.send(JSON.stringify(response));
        }
    };

    var sendConnectedClients = function () {
        if (clients['root']) {
            var users = [ ];

            for (var id in clients) {
                if (clients[id]) {
                    if (currentGames[id] != undefined) {
                        users.push({ id: id, status: 'play' });
                    } else {
                        users.push({ id: id, status: 'wait' });
                    }
                }
            }

            var response = {
                type: 'connected',
                users: users
            };

            clients['root'].send(JSON.stringify(response));
        }
    };

    var clients;
    var currentGames;

    this.init(app);
}