"use strict";

Yinsh.RemotePlayer = function (c, e, u, o, g) {

// private attributes
    var _color = c;
    var _engine = e;
    var _uid = u;
    var _game_id = g;
    var _opponent_id = o;
    var _manager;
    var _gui;
    var _connection;

    var selected_coordinates = new Yinsh.Coordinates('X', -1);
    var selected_ring = new Yinsh.Coordinates('X', -1);

// public methods
    this.color = function () {
        return _color;
    };

    this.finish = function (moves) {
        var msg = {
            type: 'finish',
            user_id: _uid,
            moves: moves
        };
        _connection.send(JSON.stringify(msg));
    };

    this.is_remote = function () {
        return true;
    };

    this.replayGame = function () {

        var msg = {
            type: 'replay',
            game_id: _game_id,
            user_id: _uid
        };

        var sendreplay = setInterval(function () {
            if (_connection.readyState === 1) {
                _connection.send(JSON.stringify(msg));
                clearInterval(sendreplay);
            }
        }, 100);

    };

    this.move_ring = function (ring, coordinates) {
        if (coordinates === undefined) {
            _engine.move_ring(selected_ring, selected_coordinates);
        } else {
            var msg = {
                game_id: _game_id,
                type: 'turn',
                user_id: _uid,
                move: 'move_ring',
                ring: {
                    letter: ring.letter(),
                    number: ring.number()
                },
                coordinates: {
                    letter: coordinates.letter(),
                    number: coordinates.number()
                },
                next_color: _engine.current_color() === Yinsh.Color.BLACK ? "black" : "white"
            };
            _connection.send(JSON.stringify(msg));
        }
    };

    this.put_marker = function (coordinates, color) {
        if (coordinates === undefined) {
            _engine.put_marker(selected_coordinates, _color);
        } else {
            var msg = {
                game_id: _game_id,
                type: 'turn',
                user_id: _uid,
                move: 'put_marker',
                coordinates: {
                    letter: coordinates.letter(),
                    number: coordinates.number()
                },
                color: color,
                next_color: _engine.current_color() === Yinsh.Color.BLACK ? "black" : "white"
            };
            _connection.send(JSON.stringify(msg));
        }
    };

    this.put_ring = function (coordinates, color) {
        if (coordinates === undefined) {
            _engine.put_ring(selected_coordinates, _color);
        } else {
            var msg = {
                game_id: _game_id,
                type: 'turn',
                user_id: _uid,
                move: 'put_ring',
                coordinates: {
                    letter: coordinates.letter(),
                    number: coordinates.number()
                },
                color: color,
                next_color: _engine.current_color() === Yinsh.Color.BLACK ? "black" : "white"
            };
            _connection.send(JSON.stringify(msg));
        }
    };

    this.remove_ring = function (coordinates, color) {
        if (coordinates === undefined) {
            _engine.remove_ring(selected_coordinates, _color);
        } else {
            var msg = {
                game_id: _game_id,
                type: 'turn',
                user_id: _uid,
                move: 'remove_ring',
                coordinates: {
                    letter: coordinates.letter(),
                    number: coordinates.number()
                },
                color: color,
                next_color: _engine.current_color() === Yinsh.Color.BLACK ? "black" : "white"
            };
            _connection.send(JSON.stringify(msg));
        }
    };

    this.remove_row = function (row, color) {
        if (row === undefined) {
            _engine.remove_row(_engine.select_row(selected_coordinates, _color), _color);
        } else {
            var r = [];
            var msg;

            for (var index = 0; index < row.length; ++index) {
                r.push({ letter: row[index].letter(), number: row[index].number() });
            }
            msg = {
                game_id: _game_id,
                type: 'turn',
                user_id: _uid,
                move: 'remove_row',
                row: r,
                color: color,
                next_color: _engine.current_color() === Yinsh.Color.BLACK ? "black" : "white"
            };
            _connection.send(JSON.stringify(msg));
        }
    };

    this.set_gui = function (g) {
        _gui = g;
    };

    this.set_manager = function (m) {
        _manager = m;
    };

// private methods
    var init = function () {
        window.onbeforeunload = function () {
            if (_connection.readyState === 1) {
                _connection.close();
            }
        };

        _connection = new WebSocket('ws://127.0.0.1:3000');

        _connection.onopen = function () {

        };
        _connection.onerror = function () {

        };
        _connection.onmessage = function (message) {
            var msg = JSON.parse(message.data);
            var move;

            if (msg.type === 'start') {
                _gui.ready(true);
            } else if (msg.type === 'disconnect') {
                _gui.ready(false);
            } else if (msg.type === 'turn') {
                var ok = false;

                if (msg.move === 'put_ring' && _engine.phase() === Yinsh.Phase.PUT_RING) {
                    selected_coordinates = new Yinsh.Coordinates(msg.coordinates.letter, msg.coordinates.number);
                    move = new Yinsh.Move(Yinsh.MoveType.PUT_RING, selected_coordinates);
                    ok = true;
                } else if (msg.move === 'put_marker' && _engine.phase() === Yinsh.Phase.PUT_MARKER) {
                    selected_coordinates = new Yinsh.Coordinates(msg.coordinates.letter, msg.coordinates.number);
                    move = new Yinsh.Move(Yinsh.MoveType.PUT_MARKER, selected_coordinates);
                    selected_ring = selected_coordinates;
                    ok = true;
                } else if (msg.move === 'move_ring' && _engine.phase() === Yinsh.Phase.MOVE_RING) {
                    selected_coordinates = new Yinsh.Coordinates(msg.coordinates.letter, msg.coordinates.number);
                    move = new Yinsh.Move(Yinsh.MoveType.MOVE_RING, selected_ring, selected_coordinates);
                    ok = true;
                } else if (msg.move === 'remove_row' && (_engine.phase() === Yinsh.Phase.REMOVE_ROWS_AFTER ||
                    _engine.phase() === Yinsh.Phase.REMOVE_ROWS_BEFORE)) {
                    var r = [];

                    for (var index = 0; index < msg.row.length; ++index) {
                        r.push(new Yinsh.Coordinates(msg.row[index].letter, msg.row[index].number));
                    }
                    move = new Yinsh.Move(Yinsh.MoveType.REMOVE_ROW, r);
                    ok = true;
                } else if (msg.move === 'remove_ring' && (_engine.phase() === Yinsh.Phase.REMOVE_RING_AFTER ||
                    _engine.phase() === Yinsh.Phase.REMOVE_RING_BEFORE)) {
                    selected_coordinates = new Yinsh.Coordinates(msg.coordinates.letter, msg.coordinates.number);
                    move = new Yinsh.Move(Yinsh.MoveType.REMOVE_RING, selected_coordinates);
                    ok = true;
                }
                if (ok) {
                    _manager.play_remote(move);
                }
            } else if (msg.type === 'replay') {
                msg.moves.split(";").forEach(function (turn) {
                    if (turn !== "") {
                        move = new Yinsh.Move();
                        move.parse(turn);
                        _manager.play_remote(move);
                    }
                });
            }
        };

        var loop = setInterval(function () {
            if (_connection.readyState !== 1) {
                console.log('error connection');
            } else {
                console.log('connecting ' + _uid + ' ...');
                var type_of_game = "";

                if (/type=offline/.test(self.location.href)) {
                    type_of_game = 'offline';
                }

                var msg = {
                    type: 'play',
                    user_id: _uid,
                    opponent_id: _opponent_id,
                    game_id: _game_id,
                    game_type: 'yinsh',
                    type_of_game: type_of_game
                };

                _connection.send(JSON.stringify(msg));
                clearInterval(loop);
            }
        }, 1000);
    };

    init();
};
