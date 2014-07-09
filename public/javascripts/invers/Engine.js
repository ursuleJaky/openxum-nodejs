Invers.Engine = function (t, c) {

// public methods
    this.change_color = function () {
        color = this.next_color(color);
    };

    this.current_color = function () {
        return this.color;
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
        var state = color == Invers.Color.RED ? Invers.State.YELLOW_REVERSE : Invers.State.RED_REVERSE;

        for (var n = 1; n <= 6; ++n) {
            // RIGHT
            {
                var coordinates = { letter: 'A', number: n };

                if (get_tile_state(coordinates) != state) {
                    right.push({ letter: 'X', number: n });
                }
            }
            // LEFT
            {
                var coordinates = { letter: 'F', number: n };

                if (get_tile_state(coordinates) != state) {
                    left.push({ letter: 'X', number: n });
                }
            }
        }

        for (var l = 'A'; l <= 'F'; ++l) {
            // BOTTOM
            {
                var coordinates = { letter: l, number: 1 };

                if (get_tile_state(coordinates) != state) {
                    bottom.push({ letter: l, number: 0 });
                }
            }
            // TOP
            {
                var coordinates = { letter: l, number: 6 };

                if (get_tile_state(coordinates) != state) {
                    top.push({ letter: l, number: 0 });
                }
            }
        }
        return { right: right, left: left, top: top, bottom: bottom };
    };

    this.get_state = function () {
        return state;
    };

    this.is_finished = function () {
        return phase == Invers.Phase.FINISH;
    };

    this.is_possible = function(coordinates) {
        var found = false;
        var list = this.get_possible_move_list();
        var i = 0;

        while (!found && i < list.length) {
            if (list[i].letter == coordinates.letter && list[i].number == coordinates.number) {
                found = true;
            } else {
                ++i;
            }
        }
        return found;
    };

    this.move = function (move) {
        var out;

        if (move.letter != 'X') {
            var letter = move.letter;

            if (move.position == Invers.Position.TOP) {
                out = get_tile_state({ letter: letter, number: 6 }) == Invers.State.RED_FULL ? Invers.Color.RED : Invers.Color.YELLOW;
                for (var n = 5; n >= 1; --n) {
                    var destination = { letter: letter, number: n + 1 };
                    var origin = { letter: letter, number: n };

                    set_tile_state(destination, get_tile_state(origin));
                }
                set_tile_state({ letter: letter, number: 1 },
                    (move.color == Invers.Color.RED ? Invers.State.RED_REVERSE : Invers.State.YELLOW_REVERSE));
            } else {
                out = get_tile_state({ letter: letter, number: 1 }) == Invers.State.RED_FULL ? Invers.Color.RED : Invers.Color.YELLOW;
                for (var n = 1; n < 6; ++n) {
                    var destination = { letter: letter, number: n };
                    var origin = { letter: letter, number: n + 1 };

                    set_tile_state(destination, get_tile_state(origin));
                }
                set_tile_state({ letter: letter, number: 6 },
                    (move.color == Invers.Color.RED ? Invers.State.RED_REVERSE : Invers.State.YELLOW_REVERSE));
            }
        } else {
            var number = move.number;

            if (move.position == Invers.Position.RIGHT) {
                out = get_tile_state({letter: 'A', number: number }) == Invers.State.RED_FULL ? Invers.Color.RED : Invers.Color.YELLOW;
                for (var l = 'B'; l <= 'F'; ++l) {
                    var destination = { letter: l - 1, number: number };
                    var origin = { letter: l, number: number };

                    set_tile_state(destination, get_tile_state(origin));
                }
                set_tile_state({ letter: 'F', number: number },
                    (move.color == Invers.Color.RED ? Invers.State.RED_REVERSE : Invers.State.YELLOW_REVERSE));
            } else {
                out = get_tile_state({letter: 'F', number: number }) == Invers.State.RED_FULL ? Invers.Color.RED : Invers.Color.YELLOW;
                for (var l = 'E'; l >= 'A'; --l) {
                    var destination = { letter: l + 1, number: number };
                    var origin = { letter: l, number: number };

                    set_tile_state(destination, get_tile_state(origin));
                }
                set_tile_state({ letter: 'A', number: number },
                    (move.color == Invers.Color.RED ? Invers.State.RED_REVERSE : Invers.State.YELLOW_REVERSE));
            }
        }
        if (move.color == Invers.Color.RED) {
            --redTileNumber;
        } else {
            --yellowTileNumber;
        }
        if (out == Invers.Color.RED) {
            ++redTileNumber;
        } else {
            ++yellowTileNumber;
        }
        this.change_color();
    };

    this.next_color = function (c) {
        return c == Invers.Color.RED ? Invers.Color.YELLOW : Invers.Color.RED;
    };

    this.select_move = function (list, index) {
    };

    this.winner_is = function () {
        if (this.is_finished()) {
            return this.color;
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
                tile_color = tile_color == Invers.State.RED_FULL ? Invers.State.YELLOW_FULL : Invers.State.RED_FULL;
            }
            state.push(line);
            tile_color = tile_color == Invers.State.RED_FULL ? Invers.State.YELLOW_FULL : Invers.State.RED_FULL;
        }
        redTileNumber = 1;
        yellowTileNumber = 1;
    };

    var get_tile_state = function (coordinator) {
        var i = coordinator.letter.charCodeAt(0) - "A".charCodeAt(0);
        var j = coordinator.number - 1;

        return state[i][j];
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
