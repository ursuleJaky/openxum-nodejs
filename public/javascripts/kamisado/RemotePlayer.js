"use strict";

Kamisado.RemotePlayer = function (c, e, u, o, g) {

// private attributes
    var _color = c;
//    var _engine = e;
    var _uid = u;
    var _gameID = g;
    var _opponentID = o;
    var _manager;
    var _gui;
    var _connection;

// public methods
    this.color = function () {
        return _color;
    };

    this.confirm = function () {
        return false;
    };

    this.finish = function(moves) {
        var msg = {
            type: 'finish',
            user_id: _uid,
            moves: moves
        };
        _connection.send(JSON.stringify(msg));
    };

    this.is_ready = function () {
        return true;
    };

    this.is_remote = function () {
        return true;
    };

    this.move = function (move) {
        if (move) {
            var msg = {
                type: 'turn',
                user_id: _uid,
                move: move.get()
            };
            _connection.send(JSON.stringify(msg));
        }
    };

    this.set_manager = function (m) {
        _manager = m;
    };

    this.set_gui = function (g) {
        _gui = g;
    };

// private methods
    var init = function () {
        _connection = new WebSocket('ws://127.0.0.1:3000');

        _connection.onopen = function () {
        };
        _connection.onerror = function () {
        };
        _connection.onmessage = function (message) {
            var msg = JSON.parse(message.data);

            if (msg.type === 'start') {
                _gui.ready(true);
            } else if (msg.type === 'disconnect') {
                _gui.ready(false);
            } else if (msg.type === 'turn') {
                var move = new Kamisado.Move();

                move.parse(msg.move);
                _manager.play_remote(move);
            }
        };

        var loop = setInterval(function () {
            if (_connection.readyState !== 1) {
                console.log('error connection');
            } else {
                console.log('connecting ' + _uid + ' ...');

                var msg = {
                    type: 'play',
                    user_id: _uid,
                    opponent_id: _opponentID,
                    game_id: _gameID,
                    game_type: 'kamisado'
                };

                _connection.send(JSON.stringify(msg));
                clearInterval(loop);
            }
        }, 1000);
    };

    init();
};
