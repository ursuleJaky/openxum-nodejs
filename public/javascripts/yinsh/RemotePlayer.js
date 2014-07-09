Yinsh.RemotePlayer = function (color, e, u, o, g) {

// public methods
    this.is_remote = function () {
        return true;
    };

    this.move_ring = function (ring, coordinates) {
        if (coordinates == undefined) {
            engine.move_ring(selected_ring, selected_coordinates);
        } else {
            var msg = {
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
        if (coordinates == undefined) {
            engine.put_marker(selected_coordinates, mycolor);
        } else {
            var msg = {
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

    this.remove_ring = function (coordinates, color) {
        if (coordinates == undefined) {
            engine.remove_ring(selected_coordinates, mycolor);
        } else {
            var msg = {
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

    this.remove_row = function (coordinates, color) {
        if (coordinates == undefined) {
            engine.remove_row(engine.select_row(selected_coordinates, mycolor), mycolor);
        } else {
            var msg = {
                type: 'turn',
                user_id: uid,
                move: 'remove_row',
                coordinates: {
                    letter: coordinates.letter(),
                    number: coordinates.number()
                },
                color: color
            };
            connection.send(JSON.stringify(msg));
        }
    };

    this.remove_no_row = function () {
        engine.remove_no_row();
    };

    this.put_ring = function (coordinates, color) {
        if (coordinates == undefined) {
            engine.put_ring(selected_coordinates, mycolor);
        } else {
            var msg = {
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

    this.set_manager = function (m) {
        manager = m;
    };

// private methods
    var init = function () {
        connection = new WebSocket('ws://127.0.0.1:1337');

        connection.onopen = function () {

        };
        connection.onerror = function (error) {

        };
        connection.onmessage = function (message) {
            var msg = JSON.parse(message.data);

            if (msg.type == 'turn') {
                var ok = false;

                if (msg.move == 'put_ring' && engine.phase() == Yinsh.Phase.PUT_RING) {
                    selected_coordinates = new Yinsh.Coordinates(msg.coordinates.letter, msg.coordinates.number);
                    ok = true;
                } else if (msg.move == 'put_marker' && engine.phase() == Yinsh.Phase.PUT_MARKER) {
                    selected_coordinates = new Yinsh.Coordinates(msg.coordinates.letter, msg.coordinates.number);
                    selected_ring = selected_coordinates;
                    ok = true;
                } else if (msg.move == 'move_ring' && engine.phase() == Yinsh.Phase.MOVE_RING) {
                    selected_coordinates = new Yinsh.Coordinates(msg.coordinates.letter, msg.coordinates.number);
                    ok = true;
                } else if (msg.move == 'remove_row' && (engine.phase() == Yinsh.Phase.REMOVE_ROWS_AFTER ||
                    engine.phase() == Yinsh.Phase.REMOVE_ROWS_BEFORE)) {
                    selected_coordinates = new Yinsh.Coordinates(msg.coordinates.letter, msg.coordinates.number);
                    ok = true;
                } else if (msg.move == 'remove_ring' && (engine.phase() == Yinsh.Phase.REMOVE_RING_AFTER ||
                    engine.phase() == Yinsh.Phase.REMOVE_RING_BEFORE)) {
                    selected_coordinates = new Yinsh.Coordinates(msg.coordinates.letter, msg.coordinates.number);
                    ok = true;
                }
                if (ok) {
                    manager.play_other();
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
                    game_id: game_id
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
    var connection;

    var selected_coordinates = new Yinsh.Coordinates('X', -1);
    var selected_ring = new Yinsh.Coordinates('X', -1);
    var selected_row = [];

    init();
};
