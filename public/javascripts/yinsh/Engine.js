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

                if (intersections[coordinates.hash()].state() == Yinsh.State.VACANT) {
                    list.push(coordinates);
                }
            }
        }
        return list;
    };

    this.get_placed_ring_coordinates = function (color) {
        return (color == Yinsh.Color.BLACK) ? placed_black_ring_coordinates :
            placed_white_ring_coordinates;
    };

    this.get_possible_moving_list = function (origin, color, control) {
        var list = new Array();

        if (!origin.hash() in intersections) {
            return list;
        }

        if (control && !((intersections[origin.hash()].state() == Yinsh.State.BLACK_MARKER_RING &&
            color == Yinsh.Color.BLACK) ||
            (intersections[origin.hash()].state() == Yinsh.State.WHITE_MARKER_RING &&
                color == Yinsh.Color.WHITE))) {
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
        var state = (color == Yinsh.Color.BLACK) ? Yinsh.State.BLACK_MARKER : Yinsh.State.WHITE_MARKER;
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

        /*            var srows = [];

         if (!result.rows.empty()) {
         var list = [];

         list.push(result.rows.back());
         srows.push(list);
         result.rows.pop();
         while (!rows.empty()) {
         var row = rows.back();
         var found = false;
         SeparatedRows::iterator it = srows.begin();

         while (it != srows.end() and not found) {
         Rows::const_iterator itr = it->begin();

         while (itr != it->end() and not found) {
         if (not row.is_separated(*itr)) {
         it->push_back(row);
         found = true;
         } else {
         ++itr;
         }
         }
         ++it;
         }
         if (not found) {
         Rows list;

         list.push_back(row);
         srows.push_back(list);
         }
         rows.pop_back();
         }
         }
         return srows; */

        return result.rows;
    };

    this.intersection_state = function (letter, number) {
        return get_intersection(letter, number).state();
    };

    this.intersections = function () {
        return intersections;
    };

    this.is_blitz = function () {
        return this.type == Yinsh.Engine.GameType.BLITZ;
    };

    this.is_finished = function () {
        if (type == Yinsh.GameType.BLITZ) {
            return removed_black_ring_number == 1 || removed_white_ring_number == 1 || marker_number == 0;
        } else { // type = REGULAR
            return removed_black_ring_number == 3 || removed_white_ring_number == 3 || marker_number == 0;
        }
    };

    this.is_initialized = function () {
        return placed_black_ring_coordinates.length == 5 &&
            placed_white_ring_coordinates.length == 5;
    };

    this.is_regular = function () {
        return this.type == Yinsh.Engine.GameType.REGULAR;
    };

    this.move_ring = function (origin, destination) {
        if (!origin.hash() in intersections) {
            return false;
        }
        if (!destination.hash() in intersections) {
            return false;
        }
        if (intersections[destination.hash()].state() != Yinsh.State.VACANT) {
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

        if (color == Yinsh.Color.BLACK) {
            remove_black_ring(origin);
            placed_black_ring_coordinates.push(destination);
        } else {
            remove_white_ring(origin);
            placed_white_ring_coordinates.push(destination);
        }
        phase = Yinsh.Phase.REMOVE_ROWS_AFTER;
        turn_list.push("move " + (color == Yinsh.Color.BLACK ? "black" : "white") + " ring from " +
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
        turn_list.push("put " + (color == Yinsh.Color.BLACK ? "black" : "white") + " marker at " + coordinates.to_string());
        return true;
    };

    this.put_ring = function (coordinates, color) {
        if (color != current_color) {
            return false;
        }
        if ((color == Yinsh.Color.BLACK && placed_black_ring_coordinates.length == 5) ||
            (color == Yinsh.Color.WHITE && placed_white_ring_coordinates.length == 5)) {
            return false;
        }

        if (coordinates.hash() in intersections) {
            intersections[coordinates.hash()].put_ring(color);
        } else {
            return false;
        }
        if (color == Yinsh.Color.WHITE) {
            placed_white_ring_coordinates.push(coordinates);
        } else {
            placed_black_ring_coordinates.push(coordinates);
        }
        if (placed_black_ring_coordinates.length == 5 &&
            placed_white_ring_coordinates.length == 5) {
            phase = Yinsh.Phase.PUT_MARKER;
        }
        change_color();
        turn_list.push("put " + (color == Yinsh.Color.BLACK ? "black" : "white") + " ring at " + coordinates.to_string());
        return true;
    };

    this.remove_no_row = function () {
        if (phase == Yinsh.Phase.REMOVE_ROWS_AFTER) {
            change_color();
            phase = Yinsh.Phase.REMOVE_ROWS_BEFORE;
        } else {
            phase = Yinsh.Phase.PUT_MARKER;
        }
    };

    this.remove_row = function (row, color) {
        //TODO: multiple rows !
        if (row.length != 5) {
            return false;
        }
        for (var j = 0; j < row.length; ++j) {
            remove_marker(row[j].letter(), row[j].number());
        }
        if (phase == Yinsh.Phase.REMOVE_ROWS_AFTER) {
            phase = Yinsh.Phase.REMOVE_RING_AFTER;
        } else {
            phase = Yinsh.Phase.REMOVE_RING_BEFORE;
        }

        var turn = "remove " + (color == Yinsh.Color.BLACK ? "black" : "white") + " row [ ";
        for (var j = 0; j < row.length; ++j) {
            turn += row[j].to_string() + " ";
        }
        turn += "]";
        turn_list.push(turn);
        return true;
    };

    this.remove_ring = function (coordinates, color) {
        var intersection = intersections[coordinates.hash()];

        if (intersection.color() == color) {
            intersection.remove_ring_board();
        } else {
            return false;
        }

        if (color == Yinsh.Color.BLACK) {
            remove_black_ring(coordinates);
            ++removed_black_ring_number;
        } else {
            remove_white_ring(coordinates);
            ++removed_white_ring_number;
        }
        if (this.is_finished()) {
            phase = Yinsh.Phase.FINISH;
        } else {
            if (phase == Yinsh.Phase.REMOVE_RING_AFTER) {
                phase = Yinsh.Phase.REMOVE_ROWS_BEFORE;
                change_color();
            } else { // phase == Yinsh.Phase.REMOVE_RING_BEFORE
                phase = Yinsh.Phase.PUT_MARKER;
            }
        }
        turn_list.push("remove " + (color == Yinsh.Color.BLACK ? "black" : "white") +
            " ring at " + coordinates.to_string());
        return true;
    };

    this.removed_ring_number = function (color) {
        return (color == Yinsh.Engine.Color.BLACK) ? removed_black_ring_number :
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

        if (intersections[origin.hash()].state() != Yinsh.State.BLACK_MARKER_RING &&
            intersections[origin.hash()].state() != Yinsh.State.WHITE_MARKER_RING) {
            return false;
        }

        if (origin.hash() == destination.hash() ||
            intersections[destination.hash()].state() != Yinsh.State.VACANT) {
            return false;
        }

        if (origin.letter() == destination.letter()) {
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
        } else if (origin.number() == destination.number()) {
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
            if (origin.letter().charCodeAt(0) - destination.letter().charCodeAt(0) ==
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
            if (type == Yinsh.GameType.REGULAR) {
                if (removed_black_ring_number == 3 ||
                    removed_black_ring_number > removed_white_ring_number) {
                    return Yinsh.Color.BLACK;
                } else if (removed_white_ring_number == 3 |
                    removed_black_ring_number < removed_white_ring_number) {
                    return Yinsh.Color.WHITE;
                } else {
                    return Yinsh.Color.NONE;
                }
            } else {
                if (removed_black_ring_number == 1) {
                    return Yinsh.Color.BLACK;
                } else if (removed_white_ring_number == 1) {
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

        if (!result.start && intersection.state() == state) {
            result.start = true;
            result.row.push(coordinates);
        } else if (result.start && intersection.state() == state) {
            result.row.push(coordinates);
        } else if (result.start && intersection.state() != state) {
            if (result.row.length >= 5) {
                result.rows.push(result.row);
            }
            result.start = false;
            result.row = [];
        }
        return result;
    };

    var change_color = function () {
        if (current_color == Yinsh.Color.WHITE) {
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

        if (origin.letter() == destination.letter()) {
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
        } else if (origin.number() == destination.number()) {
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
            if (placed_black_ring_coordinates[i].hash() != coordinates.hash()) {
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
            if (placed_white_ring_coordinates[i].hash() != coordinates.hash()) {
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

            if (state == Yinsh.State.BLACK_RING || state == Yinsh.State.WHITE_RING) {
                result.no_vacant = false; // if ring is presenter after row of markers
                result.ok = false;
            } else if (state == Yinsh.State.BLACK_MARKER || state == Yinsh.State.WHITE_MARKER) {
                result.no_vacant = true;
            } else if (state == Yinsh.State.VACANT && result.no_vacant) {
                result.ok = false;
            }
        }
        return result;
    };

    var verify_intersection_in_row = function (letter, number, color, ok) {
        var _ok = ok;
        var coordinates = (new Yinsh.Coordinates(letter, number)).hash();

        if (coordinates in intersections) {
            if (intersections[coordinates].color() != color) {
                _ok = false;
            }
        }
        return _ok;
    };

    var verify_row = function (begin, end, color) {
        var ok = true;
        var n;
        var l;

        if (begin.letter() == end.letter()) {
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
        } else if (begin.number() == end.number()) {
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
            if (begin.letter() - end.letter() ==
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
