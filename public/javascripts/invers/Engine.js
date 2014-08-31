"use strict";

Invers.Engine = function (t, c) {

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

        for (var n = 0; n < 6; ++n) {
            // RIGHT
            {
                var coordinates = { letter: 'A', number: n + 1 };

                if (get_tile_state(coordinates) !== state) {
                    right.push({ letter: 'X', number: n + 1 });
                }
            }
            // LEFT
            {
                var coordinates = { letter: 'F', number: n + 1 };

                if (get_tile_state(coordinates) !== state) {
                    left.push({ letter: 'X', number: n + 1 });
                }
            }
        }

        for (var l = 0; l < 6; ++l) {
            // BOTTOM
            {
                var coordinates = { letter: String.fromCharCode('A'.charCodeAt(0) + l), number: 1 };

                if (get_tile_state(coordinates) !== state) {
                    bottom.push({ letter: String.fromCharCode('A'.charCodeAt(0) + l), number: 0 });
                }
            }
            // TOP
            {
                var coordinates = { letter: String.fromCharCode('A'.charCodeAt(0) + l), number: 6 };

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

        if (move.letter !== 'X') {
            var letter = move.letter;

            if (move.position === Invers.Position.TOP) {
                var state = get_tile_state({ letter: letter, number: 6 });

                out = state === Invers.State.RED_FULL || state === Invers.State.RED_REVERSE ? Invers.Color.RED : Invers.Color.YELLOW;
                for (var n = 5; n >= 1; --n) {
                    var destination = { letter: letter, number: n + 1 };
                    var origin = { letter: letter, number: n };

                    set_tile_state(destination, get_tile_state(origin));
                }
                set_tile_state({ letter: letter, number: 1 },
                    (move.color === Invers.Color.RED ? Invers.State.RED_REVERSE : Invers.State.YELLOW_REVERSE));
            } else {
                var state = get_tile_state({ letter: letter, number: 1 });

                out = state === Invers.State.RED_FULL || state === Invers.State.RED_REVERSE ? Invers.Color.RED : Invers.Color.YELLOW;
                for (var n = 1; n < 6; ++n) {
                    var destination = { letter: letter, number: n };
                    var origin = { letter: letter, number: n + 1 };

                    set_tile_state(destination, get_tile_state(origin));
                }
                set_tile_state({ letter: letter, number: 6 },
                    (move.color === Invers.Color.RED ? Invers.State.RED_REVERSE : Invers.State.YELLOW_REVERSE));
            }
        } else {
            var number = move.number;

            if (move.position === Invers.Position.RIGHT) {
                var state = get_tile_state({letter: 'A', number: number });

                out = state === Invers.State.RED_FULL || state === Invers.State.RED_REVERSE ? Invers.Color.RED : Invers.Color.YELLOW;
                for (var l = 0; l < 5; ++l) {
                    var destination = { letter: String.fromCharCode('A'.charCodeAt(0) + l), number: number };
                    var origin = { letter: String.fromCharCode('A'.charCodeAt(0) + l + 1), number: number };

                    set_tile_state(destination, get_tile_state(origin));
                }
                set_tile_state({ letter: 'F', number: number },
                    (move.color === Invers.Color.RED ? Invers.State.RED_REVERSE : Invers.State.YELLOW_REVERSE));
            } else {
                var state = get_tile_state({ letter: 'F', number: number });

                out = state === Invers.State.RED_FULL || state === Invers.State.RED_REVERSE ? Invers.Color.RED : Invers.Color.YELLOW;
                for (var l = 4; l >= 0; --l) {
                    var destination = { letter: String.fromCharCode('A'.charCodeAt(0) + l + 1), number: number };
                    var origin = { letter: String.fromCharCode('A'.charCodeAt(0) + l), number: number };

                    set_tile_state(destination, get_tile_state(origin));
                }
                set_tile_state({ letter: 'A', number: number },
                    (move.color === Invers.Color.RED ? Invers.State.RED_REVERSE : Invers.State.YELLOW_REVERSE));
            }
        }
        if (move.color === Invers.Color.RED) {
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
        var N2 = N * this.get_different_color_number_of_free_tiles();
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
        return { color: this.get_free_tiles()[color_index], letter: L[index].letter, number: L[index].number, position: position}
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
            return color;
        } else {
            return false;
        }
    };

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

    var get_tile_state = function (coordinator) {
        var i = coordinator.letter.charCodeAt(0) - "A".charCodeAt(0);
        var j = coordinator.number - 1;

        return state[i][j];
    };

    var is_finished = function(color) {
        var state = (color == Invers.Color.RED ? Invers.State.RED_FULL : Invers.State.YELLOW_FULL);
        var found = false;

        for (var n = 1; n <= 6 && !found; ++n) {
            for (var l = 0; l < 6 && !found; ++l) {
                found = get_tile_state({ letter: String.fromCharCode('A'.charCodeAt(0) + l), number: n }) == state;
            }
        }
        return !found;
    };

    var set_tile_state = function (coordinator, s) {
        var i = coordinator.letter.charCodeAt(0) - "A".charCodeAt(0);
        var j = coordinator.number - 1;

        state[i][j] = s;
    };

// private attributes
    var type;
    var color;

    var phase;
    var state;

    var redTileNumber;
    var yellowTileNumber;

    init(t, c);
};
