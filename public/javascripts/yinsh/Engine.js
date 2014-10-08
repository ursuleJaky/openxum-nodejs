"use strict";

// grid constants definition
Yinsh.begin_letter = [ 'B', 'A', 'A', 'A', 'A', 'B', 'B', 'C',
    'D', 'E', 'G' ];
Yinsh.end_letter = [ 'E', 'G', 'H', 'I', 'J', 'J', 'K', 'K', 'K',
    'K', 'J' ];
Yinsh.begin_number = [ 2, 1, 1, 1, 1, 2, 2, 3, 4, 5, 7 ];
Yinsh.end_number = [ 5, 7, 8, 9, 10, 10, 11, 11, 11, 11, 10 ];
Yinsh.begin_diagonal_letter = [ 'B', 'A', 'A', 'A', 'A', 'B',
    'B', 'C', 'D', 'E', 'G'];
Yinsh.end_diagonal_letter = [ 'E', 'G', 'H', 'I', 'J', 'J',
    'K', 'K', 'K', 'K', 'J' ];
Yinsh.begin_diagonal_number = [ 7, 5, 4, 3, 2, 2, 1, 1, 1, 1, 2 ];
Yinsh.end_diagonal_number = [ 10, 11, 11, 11, 11, 10, 10, 9, 8,
    7, 5 ];

// enums definition
Yinsh.GameType = { BLITZ: 0, REGULAR: 1 };
Yinsh.Color = { BLACK: 0, WHITE: 1, NONE: 2 };
Yinsh.Phase = { PUT_RING: 0, PUT_MARKER: 1, MOVE_RING: 2, REMOVE_ROWS_AFTER: 3,
    REMOVE_RING_AFTER: 4, REMOVE_ROWS_BEFORE: 5, REMOVE_RING_BEFORE: 6, FINISH: 7 };
Yinsh.State = { VACANT: 0, BLACK_MARKER: 1, WHITE_MARKER: 2, BLACK_RING: 3, WHITE_RING: 4,
    BLACK_MARKER_RING: 5, WHITE_MARKER_RING: 6 };
Yinsh.MoveType = { PUT_RING: 0, PUT_MARKER: 1, MOVE_RING: 2, REMOVE_ROW: 3, REMOVE_RING: 4 };

Yinsh.Coordinates = function (l, n) {

// public methods
    this.distance = function (coordinates) {
        if (coordinates.letter() === letter) {
            return coordinates.number() - number;
        } else {
            return coordinates.letter().charCodeAt(0) - letter.charCodeAt(0);
        }
    };

    this.hash = function () {
        return (letter.charCodeAt(0) - 'A'.charCodeAt(0)) + (number - 1) * 11;
    };

    this.is_valid = function () {
        return letter >= 'A' && letter <= 'K' && number >= 1 && number <= 11;
    };

    this.letter = function () {
        return letter;
    };

    this.number = function () {
        return number;
    };

    this.to_string = function () {
        return letter + number;
    };

// private attributes
    var letter = l;
    var number = n;
};

Yinsh.Intersection = function (c) {
// public methods
    this.hash = function () {
        return coordinates.hash();
    };

    this.color = function () {
        if (state === Yinsh.State.VACANT) {
            return -1;
        }

        if (state === Yinsh.State.BLACK_RING ||
            state === Yinsh.State.BLACK_MARKER ||
            state === Yinsh.State.BLACK_MARKER_RING) {
            return Yinsh.Color.BLACK;
        } else {
            return Yinsh.Color.WHITE;
        }
    };

    this.flip = function () {
        if (state === Yinsh.State.BLACK_MARKER) {
            state = Yinsh.State.WHITE_MARKER;
        } else if (state === Yinsh.State.WHITE_MARKER) {
            state = Yinsh.State.BLACK_MARKER;
        }
    };

    this.coordinates = function () {
        return coordinates;
    };

    this.letter = function () {
        return coordinates.letter();
    };

    this.number = function () {
        return coordinates.number();
    };

    this.put_marker = function (color) {
        if (color === Yinsh.Color.BLACK) {
            if (state === Yinsh.State.BLACK_RING) {
                state = Yinsh.State.BLACK_MARKER_RING;
            }
        } else {
            if (state === Yinsh.State.WHITE_RING) {
                state = Yinsh.State.WHITE_MARKER_RING;
            }
        }
    };

    this.put_ring = function (color) {
        if (color === Yinsh.Color.BLACK) {
            state = Yinsh.State.BLACK_RING;
        } else {
            state = Yinsh.State.WHITE_RING;
        }
    };

    this.remove_marker = function () {
        state = Yinsh.State.VACANT;
    };

    this.remove_ring = function () {
        if (state === Yinsh.State.BLACK_MARKER_RING || state === Yinsh.State.WHITE_MARKER_RING) {
            if (state === Yinsh.State.BLACK_MARKER_RING) {
                state = Yinsh.State.BLACK_MARKER;
            } else {
                state = Yinsh.State.WHITE_MARKER;
            }
        }
    };

    this.remove_ring_board = function () {
        state = Yinsh.State.VACANT;
    };

    this.state = function () {
        return state;
    };

// private attributes
    var coordinates = c;
    var state = Yinsh.State.VACANT;
};

Yinsh.Move = function (t, c1, c2) {

// private attributes
    var _type;
    var _coordinates;
    var _from;
    var _to;
    var _row;

// private methods
    var init = function (t, c1, c2) {
        _type = t;
        if (_type === Yinsh.MoveType.PUT_RING || _type === Yinsh.MoveType.PUT_MARKER || _type === Yinsh.MoveType.REMOVE_RING) {
            _coordinates = c1;
        } else if (_type === Yinsh.MoveType.MOVE_RING) {
            _from = c1;
            _to = c2;
        } else {
            _row = c1;
        }
    };

// public methods
    this.get = function () {
        if (_type === Yinsh.MoveType.PUT_RING) {
            return 'Pr' + _coordinates.to_string();
        } else if (_type === Yinsh.MoveType.PUT_MARKER) {
            return 'Pm' + _coordinates.to_string();
        } else if (_type === Yinsh.MoveType.REMOVE_RING) {
            return 'Rr' + _coordinates.to_string();
        } else if (_type === Yinsh.MoveType.MOVE_RING) {
            return 'Mr' + _from.to_string() + _to.to_string();
        } else {
            var str = 'RR';
            for (var index = 0; index < _row.length; ++index) {
                str += _row[index].to_string();
            }
            return str;
        }
    };

    this.coordinates = function () {
        return _coordinates;
    };

    this.from = function () {
        return _from;
    };

    this.row = function () {
        return _row;
    };

    this.to = function () {
        return _to;
    };

    this.type = function () {
        return _type;
    };

    this.parse = function (str) {
        var type = str.substring(0, 2);

        if (type === 'Pr') {
            _type = Yinsh.MoveType.PUT_RING;
        } else if (type === 'Pm') {
            _type = Yinsh.MoveType.PUT_MARKER;
        } else if (type === 'Rr') {
            _type = Yinsh.MoveType.REMOVE_RING;
        } else if (type === 'Mr') {
            _type = Yinsh.MoveType.MOVE_RING;
        } else if (type === 'RR') {
            _type = Yinsh.MoveType.REMOVE_ROW;
        }
        if (_type === Yinsh.MoveType.PUT_RING || _type === Yinsh.MoveType.PUT_MARKER || _type === Yinsh.MoveType.REMOVE_RING) {
            _coordinates = new Yinsh.Coordinates(str.charAt(2), parseInt(str.charAt(3)));
        } else if (_type === Yinsh.MoveType.MOVE_RING) {
            _from = new Yinsh.Coordinates(str.charAt(2), parseInt(str.charAt(3)));
            _to = new Yinsh.Coordinates(str.charAt(4), parseInt(str.charAt(5)));
        } else {
            _row = [];
            for (var index = 0; index < 5; ++index) {
                _row.push(new Yinsh.Coordinates(str.charAt(2 + 2 * index),
                    parseInt(str.charAt(3 + 2 * index))));
            }
        }
    };

    init(t, c1, c2);
};

Yinsh.Engine = function (type, color) {

// public methods
    this.available_marker_number = function () {
        return marker_number;
    };

    this.current_color = function () {
        return current_color;
    };

    this.exist_intersection = function (letter, number) {
        var coordinates = (new Yinsh.Coordinates(letter, number)).hash();

        return coordinates in intersections;
    };

    this.get_free_intersections = function () {
        var list = [];

        for (var i = 0; i < letters.length; ++i) {
            var l = letters[i];

            for (var n = Yinsh.begin_number[l.charCodeAt(0) - 'A'.charCodeAt(0)];
                 n <= Yinsh.end_number[l.charCodeAt(0) - 'A'.charCodeAt(0)]; ++n) {
                var coordinates = new Yinsh.Coordinates(l, n);

                if (intersections[coordinates.hash()].state() === Yinsh.State.VACANT) {
                    list.push(coordinates);
                }
            }
        }
        return list;
    };

    this.get_placed_ring_coordinates = function (color) {
        return (color === Yinsh.Color.BLACK) ? placed_black_ring_coordinates :
            placed_white_ring_coordinates;
    };

    this.get_possible_moving_list = function (origin, color, control) {
        var list = [];

        if (!origin.hash() in intersections) {
            return list;
        }

        if (control && !((intersections[origin.hash()].state() === Yinsh.State.BLACK_MARKER_RING &&
            color === Yinsh.Color.BLACK) ||
            (intersections[origin.hash()].state() === Yinsh.State.WHITE_MARKER_RING &&
                color === Yinsh.Color.WHITE))) {
            return list;
        }

        var state = {
            ok: true,
            no_vacant: false
        };
        var letter = intersections[origin.hash()].letter();
        var letter_index = intersections[origin.hash()].letter().charCodeAt(0) - 'A'.charCodeAt(0);
        var number = intersections[origin.hash()].number();
        var n;
        var l;

        // letter + number increase
        {
            n = number + 1;
            state.ok = true;
            state.no_vacant = false;
            while (n <= Yinsh.end_number[letter.charCodeAt(0) - 'A'.charCodeAt(0)] && state.ok) {
                state = verify_intersection(letter, n, state);
                if ((state.ok && !state.no_vacant) || (!state.ok && state.no_vacant)) {
                    list.push(get_intersection(letter, n).coordinates());
                }
                ++n;
            }
        }
        // letter + number decrease
        {
            n = number - 1;
            state.ok = true;
            state.no_vacant = false;
            while (n >= Yinsh.begin_number[letter.charCodeAt(0) - 'A'.charCodeAt(0)] && state.ok) {
                state = verify_intersection(letter, n, state);
                if ((state.ok && !state.no_vacant) || (!state.ok && state.no_vacant)) {
                    list.push(get_intersection(letter, n).coordinates());
                }
                --n;
            }
        }
        // number + letter increase
        {
            l = letter_index + 1;
            state.ok = true;
            state.no_vacant = false;
            while (l <= (Yinsh.end_letter[number - 1].charCodeAt(0) - 'A'.charCodeAt(0)) && state.ok) {
                state = verify_intersection(letters[l], number, state);
                if ((state.ok && !state.no_vacant) || (!state.ok && state.no_vacant)) {
                    list.push(get_intersection(letters[l], number).coordinates());
                }
                ++l;
            }
        }
        // number + letter decrease
        {
            l = letter_index - 1;
            state.ok = true;
            state.no_vacant = false;
            while (l >= (Yinsh.begin_letter[number - 1].charCodeAt(0) - 'A'.charCodeAt(0)) && state.ok) {
                state = verify_intersection(letters[l], number, state);
                if ((state.ok && !state.no_vacant) || (!state.ok && state.no_vacant)) {
                    list.push(get_intersection(letters[l], number).coordinates());
                }
                --l;
            }
        }
        // number increase + letter increase
        {
            n = number + 1;
            l = letter_index + 1;
            state.ok = true;
            state.no_vacant = false;
            while (n <= Yinsh.end_number[l] &&
                l <= (Yinsh.end_letter[n - 1].charCodeAt(0) - 'A'.charCodeAt(0)) && state.ok) {
                state = verify_intersection(letters[l], n, state);
                if ((state.ok && !state.no_vacant) || (!state.ok && state.no_vacant)) {
                    list.push(get_intersection(letters[l], n).coordinates());
                }
                ++l;
                ++n;
            }
        }
        // number decrease + letter decrease
        {
            n = number - 1;
            l = letter_index - 1;
            state.ok = true;
            state.no_vacant = false;
            while (n >= Yinsh.begin_number[l] &&
                l >= (Yinsh.begin_letter[n - 1].charCodeAt(0) - 'A'.charCodeAt(0)) && state.ok) {
                state = verify_intersection(letters[l], n, state);
                if ((state.ok && !state.no_vacant) || (!state.ok && state.no_vacant)) {
                    list.push(get_intersection(letters[l], n).coordinates());
                }
                --l;
                --n;
            }
        }
        return list;
    };

    this.get_rows = function (color) {
        var state = (color === Yinsh.Color.BLACK) ? Yinsh.State.BLACK_MARKER : Yinsh.State.WHITE_MARKER;
        var result = {
            start: false,
            row: [],
            rows: []
        };
        var n;
        var l;

        for (n = 1; n <= 11; ++n) {
            result.start = false;
            result.row = [];
            for (l = Yinsh.begin_letter[n - 1].charCodeAt(0); l <= Yinsh.end_letter[n - 1].charCodeAt(0); ++l) {
                result = build_row(letters[l - 'A'.charCodeAt(0)], n, state, result);
            }
            if (result.row.length >= 5) {
                result.rows.push(result.row);
            }
        }

        for (l = 'A'.charCodeAt(0); l < 'L'.charCodeAt(0); ++l) {
            result.start = false;
            result.row = [];
            for (n = Yinsh.begin_number[l - 'A'.charCodeAt(0)]; n <= Yinsh.end_number[l - 'A'.charCodeAt(0)]; ++n) {
                result = build_row(letters[l - 'A'.charCodeAt(0)], n, state, result);
            }
            if (result.row.length >= 5) {
                result.rows.push(result.row);
            }
        }

        for (var i = 0; i < 11; ++i) {
            n = Yinsh.begin_diagonal_number[i];
            l = Yinsh.begin_diagonal_letter[i].charCodeAt(0);
            result.start = false;
            result.row = [];
            while (l <= Yinsh.end_diagonal_letter[i].charCodeAt(0) &&
                n <= Yinsh.end_diagonal_number[i]) {
                result = build_row(letters[l - 'A'.charCodeAt(0)], n, state, result);
                ++l;
                ++n;
            }
            if (result.row.length >= 5) {
                result.rows.push(result.row);
            }
        }
        return result.rows;
    };

    this.intersection_state = function (letter, number) {
        return get_intersection(letter, number).state();
    };

    this.intersections = function () {
        return intersections;
    };

    this.is_blitz = function () {
        return this.type === Yinsh.Engine.GameType.BLITZ;
    };

    this.is_finished = function () {
        if (type === Yinsh.GameType.BLITZ) {
            return removed_black_ring_number === 1 || removed_white_ring_number === 1 || marker_number === 0;
        } else { // type = REGULAR
            return removed_black_ring_number === 3 || removed_white_ring_number === 3 || marker_number === 0;
        }
    };

    this.is_initialized = function () {
        return placed_black_ring_coordinates.length === 5 &&
            placed_white_ring_coordinates.length === 5;
    };

    this.is_regular = function () {
        return this.type === Yinsh.Engine.GameType.REGULAR;
    };

    this.move = function (move) {
        if (move.type() === Yinsh.MoveType.PUT_RING) {
            this.put_ring(move.coordinates(), current_color);
        } else if (move.type() === Yinsh.MoveType.PUT_MARKER) {
            this.put_marker(move.coordinates(), current_color);
        } else if (move.type() === Yinsh.MoveType.REMOVE_RING) {
            this.remove_ring(move.coordinates(), current_color);
        } else if (move.type() === Yinsh.MoveType.MOVE_RING) {
            this.move_ring(move.from(), move.to());
        } else if (move.type() === Yinsh.MoveType.REMOVE_ROW) {
            this.remove_row(move.row(), current_color)
        }
    };

    this.move_ring = function (origin, destination) {
        if (!origin.hash() in intersections) {
            return false;
        }
        if (!destination.hash() in intersections) {
            return false;
        }
        if (intersections[destination.hash()].state() !== Yinsh.State.VACANT) {
            return false;
        }
        if (!this.verify_moving(origin, destination)) {
            return false;
        }

        var intersection_origin = intersections[origin.hash()];
        var intersection_destination = intersections[destination.hash()];
        var color = intersection_origin.color();

        intersection_origin.remove_ring();
        intersection_destination.put_ring(color);
        flip_row(origin, destination);

        if (color === Yinsh.Color.BLACK) {
            remove_black_ring(origin);
            placed_black_ring_coordinates.push(destination);
        } else {
            remove_white_ring(origin);
            placed_white_ring_coordinates.push(destination);
        }
        if (this.get_rows(current_color).length > 0) {
            phase = Yinsh.Phase.REMOVE_ROWS_AFTER;
        } else {
            change_color();
            if (this.get_rows(current_color).length === 0) {
                phase = Yinsh.Phase.PUT_MARKER;
            } else {
                phase = Yinsh.Phase.REMOVE_ROWS_BEFORE;
            }
        }
        turn_list.push("move " + (color === Yinsh.Color.BLACK ? "black" : "white") + " ring from " +
            origin.to_string() + " to " + destination.to_string());
        return true;
    };

    this.phase = function () {
        return phase;
    };

    this.put_marker = function (coordinates, color) {
        if (marker_number > 0) {
            if (coordinates.hash() in intersections) {
                intersections[coordinates.hash()].put_marker(color);
            } else {
                return false;
            }
            --marker_number;
        } else {
            return false;
        }
        phase = Yinsh.Phase.MOVE_RING;
        turn_list.push("put " + (color === Yinsh.Color.BLACK ? "black" : "white") + " marker at " + coordinates.to_string());
        return true;
    };

    this.put_ring = function (coordinates, color) {
        if (color !== current_color) {
            return false;
        }
        if ((color === Yinsh.Color.BLACK && placed_black_ring_coordinates.length === 5) ||
            (color === Yinsh.Color.WHITE && placed_white_ring_coordinates.length === 5)) {
            return false;
        }

        if (coordinates.hash() in intersections) {
            intersections[coordinates.hash()].put_ring(color);
        } else {
            return false;
        }
        if (color === Yinsh.Color.WHITE) {
            placed_white_ring_coordinates.push(coordinates);
        } else {
            placed_black_ring_coordinates.push(coordinates);
        }
        if (placed_black_ring_coordinates.length === 5 &&
            placed_white_ring_coordinates.length === 5) {
            phase = Yinsh.Phase.PUT_MARKER;
        }
        change_color();
        turn_list.push("put " + (color === Yinsh.Color.BLACK ? "black" : "white") + " ring at " + coordinates.to_string());
        return true;
    };

    this.remove_row = function (row, color) {
        if (row.length !== 5) {
            return false;
        }
        for (var j = 0; j < row.length; ++j) {
            remove_marker(row[j].letter(), row[j].number());
        }
        if (phase === Yinsh.Phase.REMOVE_ROWS_AFTER) {
            phase = Yinsh.Phase.REMOVE_RING_AFTER;
        } else {
            phase = Yinsh.Phase.REMOVE_RING_BEFORE;
        }

        var turn = "remove " + (color === Yinsh.Color.BLACK ? "black" : "white") + " row [ ";
        for (var j = 0; j < row.length; ++j) {
            turn += row[j].to_string() + " ";
        }
        turn += "]";
        turn_list.push(turn);
        return true;
    };

    this.remove_ring = function (coordinates, color) {
        var intersection = intersections[coordinates.hash()];

        if (intersection.color() === color) {
            intersection.remove_ring_board();
        } else {
            return false;
        }

        if (color === Yinsh.Color.BLACK) {
            remove_black_ring(coordinates);
            ++removed_black_ring_number;
        } else {
            remove_white_ring(coordinates);
            ++removed_white_ring_number;
        }
        if (this.is_finished()) {
            phase = Yinsh.Phase.FINISH;
        } else {
            if (phase === Yinsh.Phase.REMOVE_RING_AFTER) {
                if (this.get_rows(current_color).length === 0) {
                    change_color();
                    if (this.get_rows(current_color).length === 0) {
                        phase = Yinsh.Phase.PUT_MARKER;
                    } else {
                        phase = Yinsh.Phase.REMOVE_ROWS_BEFORE;
                    }
                } else {
                    phase = Yinsh.Phase.REMOVE_ROWS_AFTER;
                }
            } else { // phase === Yinsh.Phase.REMOVE_RING_BEFORE
                if (this.get_rows(current_color).length === 0) {
                    phase = Yinsh.Phase.PUT_MARKER;
                } else {
                    phase = Yinsh.Phase.REMOVE_ROWS_BEFORE;
                }
            }
        }
        turn_list.push("remove " + (color === Yinsh.Color.BLACK ? "black" : "white") +
            " ring at " + coordinates.to_string());
        return true;
    };

    this.removed_ring_number = function (color) {
        return (color === Yinsh.Engine.Color.BLACK) ? removed_black_ring_number :
            removed_white_ring_number;
    };

    this.select_row = function (coordinates, color) {
        var rows = this.get_rows(color);

        //TODO: to finish
        return rows[0];
    };

    this.turn_list = function () {
        return turn_list;
    };

    this.verify_moving = function (origin, destination) {
        var letters = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K" ];
        var state = {
            ok: true,
            no_vacant: false
        };
        var n;
        var l;

        if (intersections[origin.hash()].state() !== Yinsh.State.BLACK_MARKER_RING &&
            intersections[origin.hash()].state() !== Yinsh.State.WHITE_MARKER_RING) {
            return false;
        }

        if (origin.hash() === destination.hash() ||
            intersections[destination.hash()].state() !== Yinsh.State.VACANT) {
            return false;
        }

        if (origin.letter() === destination.letter()) {
            if (origin.number() < destination.number()) {
                n = origin.number() + 1;
                state.no_vacant = false;
                while (n < destination.number() && state.ok) {
                    state = verify_intersection(origin.letter(), n, state);
                    ++n;
                }
            } else {
                n = origin.number() - 1;
                state.no_vacant = false;
                while (n > destination.number() && state.ok) {
                    state = verify_intersection(origin.letter(), n, state);
                    --n;
                }
            }
        } else if (origin.number() === destination.number()) {
            if (origin.letter().charCodeAt(0) < destination.letter().charCodeAt(0)) {
                l = (origin.letter().charCodeAt(0) - 'A'.charCodeAt(0)) + 1;
                state.no_vacant = false;
                while (l < (destination.letter().charCodeAt(0) - 'A'.charCodeAt(0)) && state.ok) {
                    state = verify_intersection(letters[l], origin.number(), state);
                    ++l;
                }
            } else {
                l = (origin.letter().charCodeAt(0) - 'A'.charCodeAt(0)) - 1;
                state.no_vacant = false;

                while (l > (destination.letter().charCodeAt(0) - 'A'.charCodeAt(0)) && state.ok) {
                    state = verify_intersection(letters[l], origin.number(), state);
                    --l;
                }
            }
        } else {
            if (origin.letter().charCodeAt(0) - destination.letter().charCodeAt(0) ===
                origin.number() - destination.number()) {
                if (origin.letter().charCodeAt(0) < destination.letter().charCodeAt(0)) {
                    n = origin.number() + 1;
                    l = (origin.letter().charCodeAt(0) - 'A'.charCodeAt(0)) + 1;
                    state.no_vacant = false;
                    while (l < (destination.letter().charCodeAt(0) - 'A'.charCodeAt(0)) && state.ok) {
                        state = verify_intersection(letters[l], n, state);
                        ++l;
                        ++n;
                    }
                } else {
                    n = origin.number() - 1;
                    l = (origin.letter().charCodeAt(0) - 'A'.charCodeAt(0)) - 1;
                    state.no_vacant = false;
                    while (l > (destination.letter().charCodeAt(0) - 'A'.charCodeAt(0)) && state.ok) {
                        state = verify_intersection(letters[l], n, state);
                        --l;
                        --n;
                    }
                }
            } else {
                state.ok = false;
            }
        }
        return state.ok;
    };

    this.winner_is = function () {
        if (this.is_finished()) {
            if (type === Yinsh.GameType.REGULAR) {
                if (removed_black_ring_number === 3 ||
                    removed_black_ring_number > removed_white_ring_number) {
                    return Yinsh.Color.BLACK;
                } else if (removed_white_ring_number === 3 ||
                    removed_black_ring_number < removed_white_ring_number) {
                    return Yinsh.Color.WHITE;
                } else {
                    return Yinsh.Color.NONE;
                }
            } else {
                if (removed_black_ring_number === 1) {
                    return Yinsh.Color.BLACK;
                } else if (removed_white_ring_number === 1) {
                    return Yinsh.Color.WHITE;
                } else {
                    return Yinsh.Color.NONE;
                }
            }
        }
        return false;
    };

// private methods
    var build_row = function (letter, number, state, previous) {
        var result = previous;
        var coordinates = new Yinsh.Coordinates(letter, number);
        var intersection = intersections[coordinates.hash()];

        if (!result.start && intersection.state() === state) {
            result.start = true;
            result.row.push(coordinates);
        } else if (result.start && intersection.state() === state) {
            result.row.push(coordinates);
        } else if (result.start && intersection.state() !== state) {
            if (result.row.length >= 5) {
                result.rows.push(result.row);
            }
            result.start = false;
            result.row = [];
        }
        return result;
    };

    var change_color = function () {
        if (current_color === Yinsh.Color.WHITE) {
            current_color = Yinsh.Color.BLACK;
        } else {
            current_color = Yinsh.Color.WHITE;
        }
    };

    var flip = function (letter, number) {
        var coordinates = (new Yinsh.Coordinates(letter, number)).hash();

        if (coordinates in intersections) {
            intersections[coordinates].flip();
        }
    };

    var flip_row = function (origin, destination) {
        var n;
        var l;

        if (origin.letter() === destination.letter()) {
            if (origin.number() < destination.number()) {
                n = origin.number() + 1;
                while (n < destination.number()) {
                    flip(origin.letter(), n);
                    ++n;
                }
            } else {
                n = origin.number() - 1;
                while (n > destination.number()) {
                    flip(origin.letter(), n);
                    --n;
                }
            }
        } else if (origin.number() === destination.number()) {
            if (origin.letter() < destination.letter()) {
                l = (origin.letter().charCodeAt(0) - 'A'.charCodeAt(0)) + 1;
                while (l < destination.letter().charCodeAt(0) - 'A'.charCodeAt(0)) {
                    flip(letters[l], origin.number());
                    ++l;
                }
            } else {
                l = (origin.letter().charCodeAt(0) - 'A'.charCodeAt(0)) - 1;
                while (l > destination.letter().charCodeAt(0) - 'A'.charCodeAt(0)) {
                    flip(letters[l], origin.number());
                    --l;
                }
            }
        } else {
            if (origin.letter() < destination.letter()) {
                n = origin.number() + 1;
                l = (origin.letter().charCodeAt(0) - 'A'.charCodeAt(0)) + 1;
                while (l < destination.letter().charCodeAt(0) - 'A'.charCodeAt(0)) {
                    flip(letters[l], n);
                    ++l;
                    ++n;
                }
            } else {
                n = origin.number() - 1;
                l = (origin.letter().charCodeAt(0) - 'A'.charCodeAt(0)) - 1;
                while (l > destination.letter().charCodeAt(0) - 'A'.charCodeAt(0)) {
                    flip(letters[l], n);
                    --l;
                    --n;
                }
            }
        }
    };

    var get_intersection = function (letter, number) {
        var coordinates = (new Yinsh.Coordinates(letter, number)).hash();

        if (coordinates in intersections) {
            return intersections[coordinates];
        } else {
            return false;
        }
    };

    var remove_black_ring = function (coordinates) {
        var list = [];
        var i = 0;

        while (i < placed_black_ring_coordinates.length) {
            if (placed_black_ring_coordinates[i].hash() !== coordinates.hash()) {
                list.push(placed_black_ring_coordinates[i]);
            }
            ++i;
        }
        placed_black_ring_coordinates = list;
    };

    var remove_white_ring = function (coordinates) {
        var list = [];
        var i = 0;

        while (i < placed_white_ring_coordinates.length) {
            if (placed_white_ring_coordinates[i].hash() !== coordinates.hash()) {
                list.push(placed_white_ring_coordinates[i]);
            }
            ++i;
        }
        placed_white_ring_coordinates = list;
    };

    var remove_marker = function (letter, number) {
        var coordinates = (new Yinsh.Coordinates(letter, number)).hash();

        if (coordinates in intersections) {
            intersections[coordinates].remove_marker();
            ++marker_number;
        }
    };

    var verify_intersection = function (letter, number, result) {
        var coordinates = (new Yinsh.Coordinates(letter, number)).hash();

        if (coordinates in intersections) {
            var state = intersections[coordinates].state();

            if (state === Yinsh.State.BLACK_RING || state === Yinsh.State.WHITE_RING) {
                result.no_vacant = false; // if ring is presenter after row of markers
                result.ok = false;
            } else if (state === Yinsh.State.BLACK_MARKER || state === Yinsh.State.WHITE_MARKER) {
                result.no_vacant = true;
            } else if (state === Yinsh.State.VACANT && result.no_vacant) {
                result.ok = false;
            }
        }
        return result;
    };

    var verify_intersection_in_row = function (letter, number, color, ok) {
        var _ok = ok;
        var coordinates = (new Yinsh.Coordinates(letter, number)).hash();

        if (coordinates in intersections) {
            if (intersections[coordinates].color() !== color) {
                _ok = false;
            }
        }
        return _ok;
    };

    var verify_row = function (begin, end, color) {
        var ok = true;
        var n;
        var l;

        if (begin.letter() === end.letter()) {
            if (begin.number() < end.number()) {
                n = begin.number() + 1;
                while (n < end.number() && ok) {
                    verify_intersection_in_row(begin.letter(), n, color, ok);
                    ++n;
                }
            } else {
                n = begin.number() - 1;
                while (n > end.number() && ok) {
                    verify_intersection_in_row(begin.letter(), n, color, ok);
                    --n;
                }
            }
        } else if (begin.number() === end.number()) {
            if (begin.letter() < end.letter()) {
                l = begin.letter() + 1;
                while (l < end.letter() && ok) {
                    verify_intersection_in_row(l, begin.number(), color, ok);
                    ++l;
                }
            } else {
                l = begin.letter() - 1;
                while (l > end.letter() && ok) {
                    verify_intersection_in_row(l, begin.number(), color, ok);
                    --l;
                }
            }
        } else {
            if (begin.letter() - end.letter() ===
                begin.number() - end.number()) {
                if (begin.letter() < end.letter()) {
                    n = begin.number() + 1;
                    l = begin.letter() + 1;
                    while (l < end.letter() && ok) {
                        verify_intersection_in_row(l, n, color, ok);
                        ++l;
                        ++n;
                    }
                } else {
                    n = begin.number() - 1;
                    l = begin.letter() - 1;
                    while (l > end.letter() && ok) {
                        verify_intersection_in_row(l, n, color, ok);
                        --l;
                        --n;
                    }
                }
            } else {
                ok = false;
            }
        }
        return ok;
    };

// private attributes
    var type = type;
    var current_color = color;
    var marker_number = 51;
    var placed_black_ring_coordinates = [];
    var placed_white_ring_coordinates = [];
    var removed_black_ring_number = 0;
    var removed_white_ring_number = 0;
    var intersections = {};
    var turn_list = [];
    var phase = Yinsh.Phase.PUT_RING;
    var letters = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K" ];

    for (var i = 0; i < letters.length; ++i) {
        var l = letters[i];

        for (var n = Yinsh.begin_number[l.charCodeAt(0) - 'A'.charCodeAt(0)];
             n <= Yinsh.end_number[l.charCodeAt(0) - 'A'.charCodeAt(0)]; ++n) {
            var coordinates = new Yinsh.Coordinates(l, n);

            intersections[coordinates.hash()] = new Yinsh.Intersection(coordinates);
        }
    }
};
