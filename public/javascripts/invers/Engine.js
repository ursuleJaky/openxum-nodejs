"use strict";

// enums definition
Invers.GameType = { STANDARD: 0 };
Invers.Color = { NONE: -1, RED: 0, YELLOW: 1 };
Invers.Phase = { PUSH_TILE: 0, FINISH: 1 };
Invers.Position = { NONE: -1, TOP: 0, BOTTOM: 1, LEFT: 2, RIGHT: 3 };
Invers.State = { UNDEFINED: -1, RED_FULL: 0, YELLOW_FULL: 1, RED_REVERSE: 2, YELLOW_REVERSE: 3 };

Invers.Move = function (c, l, n, p) {

// private attributes
    var _color;
    var _letter;
    var _number;
    var _position;

// private methods
    var init = function (c, l, n, p) {
        _color = c;
        _letter = l;
        _number = n;
        _position = p;
    };

// public methods
    this.color = function () {
        return _color;
    };

    this.get = function () {
        return (_color === Invers.Color.RED ? 'R' : 'Y') + _letter + _number +
            (_position === Invers.Position.BOTTOM ? 'b' : (_position === Invers.Position.TOP ? 't' : (_position === Invers.Position.RIGHT ? 'r' : 'l')));
    };

    this.letter = function () {
        return _letter;
    };

    this.number = function () {
        return _number;
    };

    this.parse = function (str) {
        _color = str.charAt(0) === 'R' ? Invers.Color.RED : Invers.Color.YELLOW;
        _letter = str.charAt(1);
        _number = str.charCodeAt(2) - '1'.charCodeAt(0) + 1;
        _position = str.charAt(3) === 'b' ? Invers.Position.BOTTOM : str.charAt(3) === 't' ? Invers.Position.TOP : str.charAt(3) === 'r' ? Invers.Position.RIGHT: Invers.Position.LEFT;
    };

    this.position = function () {
        return _position;
    };

    this.to_object = function () {
        return { color: _color, letter: _letter, number: _number, position: _position };
    };

    init(c, l, n, p);
};

Invers.Engine = function (t, c) {

// private attributes
    var type;
    var color;

    var phase;
    var state;

    var redTileNumber;
    var yellowTileNumber;

// private methods
    var init = function (t, c) {
        var tile_color = Invers.State.RED_FULL;

        type = t;
        color = c;
        phase = Invers.Phase.PUSH_TILE;
        state = [];
        for (var i = 0; i < 6; ++i) {
            var line = [];

            for (var j = 0; j < 6; ++j) {
                line.push(tile_color);
                tile_color = tile_color === Invers.State.RED_FULL ? Invers.State.YELLOW_FULL : Invers.State.RED_FULL;
            }
            state.push(line);
            tile_color = tile_color === Invers.State.RED_FULL ? Invers.State.YELLOW_FULL : Invers.State.RED_FULL;
        }
        redTileNumber = 1;
        yellowTileNumber = 1;
    };

    var get_tile_state = function (coordinates) {
        var i = coordinates.letter.charCodeAt(0) - "A".charCodeAt(0);
        var j = coordinates.number - 1;

        return state[i][j];
    };

    var is_finished = function(color) {
        var state = (color === Invers.Color.RED ? Invers.State.RED_FULL : Invers.State.YELLOW_FULL);
        var found = false;

        for (var n = 1; n <= 6 && !found; ++n) {
            for (var l = 0; l < 6 && !found; ++l) {
                found = get_tile_state({ letter: String.fromCharCode('A'.charCodeAt(0) + l), number: n }) === state;
            }
        }
        return !found;
    };

    var set_tile_state = function (coordinates, s) {
        var i = coordinates.letter.charCodeAt(0) - "A".charCodeAt(0);
        var j = coordinates.number - 1;

        state[i][j] = s;
    };

// public methods
    this.change_color = function () {
        color = this.next_color(color);
    };

    this.clone = function () {
        var o = new Invers.Engine(type, color);

        o.set(phase, state, redTileNumber, yellowTileNumber);
        return o;
    };

    this.current_color = function () {
        return color;
    };

    this.get_different_color_number_of_free_tiles = function () {
        return (redTileNumber === 2 || yellowTileNumber === 2) ? 1 : 2;
    };

    this.get_free_tiles = function () {
        var free_colors = [];
        var index = 0;
        var i;

        for (i = 0; i < redTileNumber; ++i) {
            free_colors[index] = Invers.Color.RED;
            ++index;
        }
        for (i = 0; i < yellowTileNumber; ++i) {
            free_colors[index] = Invers.Color.YELLOW;
            ++index;
        }
        return free_colors;
    };

    this.getRedTileNumber = function() {
        return redTileNumber;
    };

    this.getYellowTileNumber = function() {
        return yellowTileNumber;
    };

    this.get_phase = function () {
        return phase;
    };

    this.get_possible_move_list = function () {
        var right = [ ];
        var left = [ ];
        var top = [ ];
        var bottom = [ ];
        var state = color === Invers.Color.RED ? Invers.State.YELLOW_REVERSE : Invers.State.RED_REVERSE;
        var coordinates;

        for (var n = 0; n < 6; ++n) {
            // RIGHT
            {
                coordinates = { letter: 'A', number: n + 1 };
                if (get_tile_state(coordinates) !== state) {
                    right.push({ letter: 'X', number: n + 1 });
                }
            }
            // LEFT
            {
                coordinates = { letter: 'F', number: n + 1 };
                if (get_tile_state(coordinates) !== state) {
                    left.push({ letter: 'X', number: n + 1 });
                }
            }
        }

        for (var l = 0; l < 6; ++l) {
            // BOTTOM
            {
                coordinates = { letter: String.fromCharCode('A'.charCodeAt(0) + l), number: 1 };
                if (get_tile_state(coordinates) !== state) {
                    bottom.push({ letter: String.fromCharCode('A'.charCodeAt(0) + l), number: 0 });
                }
            }
            // TOP
            {
                coordinates = { letter: String.fromCharCode('A'.charCodeAt(0) + l), number: 6 };
                if (get_tile_state(coordinates) !== state) {
                    top.push({ letter: String.fromCharCode('A'.charCodeAt(0) + l), number: 0 });
                }
            }
        }
        return { right: right, left: left, top: top, bottom: bottom };
    };

    this.get_possible_move_number = function(list) {
        return (list.top.length + list.bottom.length + list.left.length + list.right.length) * this.get_different_color_number_of_free_tiles();
    };

    this.get_state = function () {
        return state;
    };

    this.is_finished = function () {
        return phase === Invers.Phase.FINISH;
    };

    this.is_possible = function(coordinates) {
        var found = false;
        var list = this.get_possible_move_list();
        var i = 0;

        while (!found && i < list.length) {
            if (list[i].letter === coordinates.letter && list[i].number === coordinates.number) {
                found = true;
            } else {
                ++i;
            }
        }
        return found;
    };

    this.move = function (move) {
        var out;
        var letter, number, state;
        var origin, destination;
        var n, l;

        if (move.letter() !== 'X') {
            letter = move.letter();
            if (move.position() === Invers.Position.TOP) {
                state = get_tile_state({ letter: letter, number: 6 });
                out = state === Invers.State.RED_FULL || state === Invers.State.RED_REVERSE ? Invers.Color.RED : Invers.Color.YELLOW;
                for (n = 5; n >= 1; --n) {
                    destination = { letter: letter, number: n + 1 };
                    origin = { letter: letter, number: n };
                    set_tile_state(destination, get_tile_state(origin));
                }
                set_tile_state({ letter: letter, number: 1 },
                    (move.color() === Invers.Color.RED ? Invers.State.RED_REVERSE : Invers.State.YELLOW_REVERSE));
            } else {
                state = get_tile_state({ letter: letter, number: 1 });
                out = state === Invers.State.RED_FULL || state === Invers.State.RED_REVERSE ? Invers.Color.RED : Invers.Color.YELLOW;
                for (n = 1; n < 6; ++n) {
                    destination = { letter: letter, number: n };
                    origin = { letter: letter, number: n + 1 };
                    set_tile_state(destination, get_tile_state(origin));
                }
                set_tile_state({ letter: letter, number: 6 },
                    (move.color() === Invers.Color.RED ? Invers.State.RED_REVERSE : Invers.State.YELLOW_REVERSE));
            }
        } else {
            number = move.number();
            if (move.position() === Invers.Position.RIGHT) {
                state = get_tile_state({letter: 'A', number: number });
                out = state === Invers.State.RED_FULL || state === Invers.State.RED_REVERSE ? Invers.Color.RED : Invers.Color.YELLOW;
                for (l = 0; l < 5; ++l) {
                    destination = { letter: String.fromCharCode('A'.charCodeAt(0) + l), number: number };
                    origin = { letter: String.fromCharCode('A'.charCodeAt(0) + l + 1), number: number };
                    set_tile_state(destination, get_tile_state(origin));
                }
                set_tile_state({ letter: 'F', number: number },
                    (move.color() === Invers.Color.RED ? Invers.State.RED_REVERSE : Invers.State.YELLOW_REVERSE));
            } else {
                state = get_tile_state({ letter: 'F', number: number });
                out = state === Invers.State.RED_FULL || state === Invers.State.RED_REVERSE ? Invers.Color.RED : Invers.Color.YELLOW;
                for (l = 4; l >= 0; --l) {
                    destination = { letter: String.fromCharCode('A'.charCodeAt(0) + l + 1), number: number };
                    origin = { letter: String.fromCharCode('A'.charCodeAt(0) + l), number: number };
                    set_tile_state(destination, get_tile_state(origin));
                }
                set_tile_state({ letter: 'A', number: number },
                    (move.color() === Invers.Color.RED ? Invers.State.RED_REVERSE : Invers.State.YELLOW_REVERSE));
            }
        }
        if (move.color() === Invers.Color.RED) {
            --redTileNumber;
        } else {
            --yellowTileNumber;
        }
        if (out === Invers.Color.RED) {
            ++redTileNumber;
        } else {
            ++yellowTileNumber;
        }
        if (is_finished(Invers.Color.RED) || is_finished(Invers.Color.YELLOW)) {
            phase = Invers.Phase.FINISH;
        } else {
            this.change_color();
        }
    };

    this.next_color = function (c) {
        return c === Invers.Color.RED ? Invers.Color.YELLOW : Invers.Color.RED;
    };

    this.phase = function() {
        return phase;
    };

    this.remove_first_possible_move = function(list) {
        var L = list;

        if (L.top.length > 0) {
            L.top.shift();
        } else if (L.bottom.length > 0) {
            L.bottom.shift();
        } else if (L.left.length > 0) {
            L.left.shift();
        } else if (L.right.length > 0) {
            L.right.shift();
        }
        return L;
    };

    this.select_move = function (list, index) {
        var color_index;
        var position;
        var N = list.top.length + list.bottom.length + list.left.length + list.right.length;
//        var N2 = N * this.get_different_color_number_of_free_tiles();
        var L;

        if (index >= N) {
            index -= N;
            color_index = 1;
        } else {
            color_index = 0;
        }
        if (index < list.top.length) {
            L = list.top;
            position = Invers.Position.TOP;
        } else if (index < list.top.length + list.bottom.length) {
            L = list.bottom;
            position = Invers.Position.BOTTOM;
            index -= list.top.length;
        } else if (index < list.top.length + list.bottom.length + list.left.length) {
            L = list.left;
            position = Invers.Position.LEFT;
            index -= list.top.length + list.bottom.length;
        } else {
            L = list.right;
            position = Invers.Position.RIGHT;
            index -= list.top.length + list.bottom.length + list.left.length;
        }
        return new Invers.Move(this.get_free_tiles()[color_index], L[index].letter, L[index].number, position);
    };

    this.set = function (_phase, _state, _redTileNumber, _yellowTileNumber) {
        var i = _state.length;

        while (i--) {
            var j = _state[i].length;

            while (j--) {
                state[i][j] = _state[i][j];
            }
        }
        phase = _phase;
        redTileNumber = _redTileNumber;
        yellowTileNumber = _yellowTileNumber;
    };

    this.winner_is = function () {
        if (this.is_finished()) {
            if (is_finished(Invers.Color.RED)) {
                return Invers.Color.RED;
            } else {
                return Invers.Color.YELLOW;
            }
        } else {
            return false;
        }
    };

    init(t, c);
};
