"use strict";

Yinsh.RemotePlayer = function (color, e, u, o, g) {

// public methods
    this.color = function () {
        return mycolor;
    };

    this.finish = function (moves) {
        var msg = {
            type: 'finish',
            user_id: uid,
            moves: moves
        };
        connection.send(JSON.stringify(msg));
    };

    this.is_remote = function () {
        return true;
    };

    this.move_ring = function (ring, coordinates) {
        if (coordinates === undefined) {
            engine.move_ring(selected_ring, selected_coordinates);
        } else {
            var msg = {
                game_id: game_id,
                type: 'turn',
                user_id: uid,
                move: 'move_ring',
                ring: {
                    letter: ring.letter(),
                    number: ring.number()
                },
                coordinates: {
                    letter: coordinates.letter(),
                    number: coordinates.number()
                }
            };
            connection.send(JSON.stringify(msg));
        }
    };

    this.put_marker = function (coordinates, color) {
        if (coordinates === undefined) {
            engine.put_marker(selected_coordinates, mycolor);
        } else {
            var msg = {
                game_id: game_id,
                type: 'turn',
                user_id: uid,
                move: 'put_marker',
                coordinates: {
                    letter: coordinates.letter(),
                    number: coordinates.number()
                },
                color: color
            };
            connection.send(JSON.stringify(msg));
        }
    };

    this.put_ring = function (coordinates, color) {
        if (coordinates === undefined) {
            engine.put_ring(selected_coordinates, mycolor);
        } else {
            var msg = {
                game_id: game_id,
                type: 'turn',
                user_id: uid,
                move: 'put_ring',
                coordinates: {
                    letter: coordinates.letter(),
                    number: coordinates.number()
                },
                color: color
            };
            connection.send(JSON.stringify(msg));
        }
    };

    this.remove_ring = function (coordinates, color) {
        if (coordinates === undefined) {
            engine.remove_ring(selected_coordinates, mycolor);
        } else {
            var msg = {
                game_id: game_id,
                type: 'turn',
                user_id: uid,
                move: 'remove_ring',
                coordinates: {
                    letter: coordinates.letter(),
                    number: coordinates.number()
                },
                color: color
            };
            connection.send(JSON.stringify(msg));
        }
    };

    this.remove_row = function (row, color) {
        if (row === undefined) {
            engine.remove_row(engine.select_row(selected_coordinates, mycolor), mycolor);
        } else {
            var r = [];
            var msg;

            for (var index = 0; index < row.length; ++index) {
                r.push({ letter: row[index].letter(), number: row[index].number() });
            }
            msg = {
                game_id: game_id,
                type: 'turn',
                user_id: uid,
                move: 'remove_row',
                row: r,
                color: color
            };
            connection.send(JSON.stringify(msg));
        }
    };

    this.set_gui = function (g) {
        gui = g;
    };

    this.set_manager = function (m) {
        manager = m;
    };

// private methods
    var init = function () {
        window.onbeforeunload = function () {
            if (connection.readyState === 1) {
                connection.close();
            }
        };

        connection = new WebSocket('ws://127.0.0.1:3000');

        connection.onopen = function () {

        };
        connection.onerror = function (error) {

        };
        connection.onmessage = function (message) {
            var msg = JSON.parse(message.data);

            if (msg.type === 'start') {
                gui.ready(true);
            } else if (msg.type === 'disconnect') {
                gui.ready(false);
            } else if (msg.type === 'turn') {
                var ok = false;
                var move;

                if (msg.move === 'put_ring' && engine.phase() === Yinsh.Phase.PUT_RING) {
                    selected_coordinates = new Yinsh.Coordinates(msg.coordinates.letter, msg.coordinates.number);
                    move = new Yinsh.Move(Yinsh.MoveType.PUT_RING, selected_coordinates);
                    ok = true;
                } else if (msg.move === 'put_marker' && engine.phase() === Yinsh.Phase.PUT_MARKER) {
                    selected_coordinates = new Yinsh.Coordinates(msg.coordinates.letter, msg.coordinates.number);
                    move = new Yinsh.Move(Yinsh.MoveType.PUT_MARKER, selected_coordinates);
                    selected_ring = selected_coordinates;
                    ok = true;
                } else if (msg.move === 'move_ring' && engine.phase() === Yinsh.Phase.MOVE_RING) {
                    selected_coordinates = new Yinsh.Coordinates(msg.coordinates.letter, msg.coordinates.number);
                    move = new Yinsh.Move(Yinsh.MoveType.MOVE_RING, selected_ring, selected_coordinates);
                    ok = true;
                } else if (msg.move === 'remove_row' && (engine.phase() === Yinsh.Phase.REMOVE_ROWS_AFTER ||
                    engine.phase() === Yinsh.Phase.REMOVE_ROWS_BEFORE)) {
                    var r = [];

                    for (var index = 0; index < msg.row.length; ++index) {
                        r.push(new Yinsh.Coordinates(msg.row[index].letter, msg.row[index].number));
                    }
                    move = new Yinsh.Move(Yinsh.MoveType.REMOVE_ROW, r);
                    ok = true;
                } else if (msg.move === 'remove_ring' && (engine.phase() === Yinsh.Phase.REMOVE_RING_AFTER ||
                    engine.phase() === Yinsh.Phase.REMOVE_RING_BEFORE)) {
                    selected_coordinates = new Yinsh.Coordinates(msg.coordinates.letter, msg.coordinates.number);
                    move = new Yinsh.Move(Yinsh.MoveType.REMOVE_RING, selected_coordinates);
                    ok = true;
                }
                if (ok) {
                    manager.play_remote(move);
                }
            }
        };

        var loop = setInterval(function () {
            if (connection.readyState !== 1) {
                console.log('error connection');
            } else {
                console.log('connecting ' + uid + ' ...');

                var msg = {
                    type: 'play',
                    user_id: uid,
                    opponent_id: opponent_id,
                    game_id: game_id,
                    game_type: 'yinsh'
                };

                connection.send(JSON.stringify(msg));
                clearInterval(loop);
            }
        }, 1000);
    };

    var parse_message = function (message) {
    };

// private attributes
    var mycolor = color;
    var engine = e;
    var uid = u;
    var game_id = g;
    var opponent_id = o;
    var manager;
    var gui;
    var connection;

    var selected_coordinates = new Yinsh.Coordinates('X', -1);
    var selected_ring = new Yinsh.Coordinates('X', -1);
    var selected_row = [];

    init();
};
