"use strict";

// grid constants definition
Gipf.begin_letter = [ 'A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E' ];
Gipf.end_letter = [ 'E', 'F', 'G', 'H', 'I', 'I', 'I', 'I', 'I' ];
Gipf.begin_number = [ 1, 1, 1, 1, 1, 2, 3, 4, 5 ];
Gipf.end_number = [ 5, 6, 7, 8, 9, 9, 9, 9, 9 ];
Gipf.begin_diagonal_letter = [ 'A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E' ];
Gipf.end_diagonal_letter = [ 'E', 'F', 'G', 'H', 'I', 'I', 'I', 'I', 'I' ];
Gipf.begin_diagonal_number = [ 5, 4, 3, 2, 1, 1, 1, 1, 1 ];
Gipf.end_diagonal_number = [ 9, 9, 9, 9, 9, 8, 7, 6, 5 ];

// enums definition
Gipf.GameType = { BASIC: 0, STANDARD: 1, TOURNAMENT: 2 };
Gipf.Color = { NONE: -1, BLACK: 0, WHITE: 1 };
Gipf.Phase = { PUT_FIRST_PIECE: 0, PUT_PIECE: 1, PUSH_PIECE: 2, CAPTURE_PIECE: 3, REMOVE_ROWS: 4 };
Gipf.State = { VACANT: 0, WHITE_PIECE: 1, WHITE_GIPF: 2, BLACK_PIECE: 3, BLACK_GIPF: 4 };
Gipf.Direction = { NORTH_WEST: 0, NORTH: 1, NORTH_EAST: 2, SOUTH_EAST: 3, SOUTH: 4, SOUTH_WEST: 5 };
Gipf.letters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I' ];

Gipf.Coordinates = function (l, n) {

// public methods
    this.hash = function () {
        return (letter.charCodeAt(0) - 'A'.charCodeAt(0)) + (number - 1) * 9;
    };

    this.is_valid = function () {
        return (letter == 'A' && number >= 1 && number <= 5) ||
            (letter == 'B' && number >= 1 && number <= 6) ||
            (letter == 'C' && number >= 1 && number <= 7) ||
            (letter == 'D' && number >= 1 && number <= 8) ||
            (letter == 'E' && number >= 1 && number <= 9) ||
            (letter == 'F' && number >= 2 && number <= 9) ||
            (letter == 'G' && number >= 3 && number <= 9) ||
            (letter == 'H' && number >= 4 && number <= 9) ||
            (letter == 'I' && number >= 5 && number <= 9);
    };

    this.letter = function () {
        return letter;
    };

    this.move = function (letter_distance, number_distance) {
        return new Gipf.Coordinates(String.fromCharCode(letter.charCodeAt(0) + letter_distance), number + number_distance);
    };

    this.number = function () {
        return number;
    };

    this.to_string = function () {
        return letter + number;
    };

// private attributes
    var compute_letter = function (l, d) {
        var index = letter.charCodeAt(0) - 'A'.charCodeAt(0) + d;

        if (index >= 0 && index <= 11) {
            return Gipf.letters[index];
        } else {
            return 'X';
        }
    };

    var letter = l;
    var number = n;
};

Gipf.Intersection = function (c) {
// public methods
    this.color = function () {
        if (state === Gipf.State.VACANT) {
            return -1;
        } else if (state === Gipf.State.WHITE_GIPF || state === Gipf.State.WHITE_PIECE) {
            return Gipf.Color.WHITE;
        } else {
            return Gipf.Color.BLACK;
        }
    };

    this.coordinates = function () {
        return coordinates;
    };

    this.gipf = function() {
        return state === Gipf.State.WHITE_GIPF || state === Gipf.State.BLACK_GIPF;
    };

    this.hash = function () {
        return coordinates.hash();
    };

    this.letter = function () {
        return coordinates.letter();
    };

    this.number = function () {
        return coordinates.number();
    };

    this.put_piece = function (color, gipf) {
        if (gipf) {
            state = color === Gipf.Color.WHITE ? Gipf.State.WHITE_GIPF : Gipf.State.BLACK_GIPF;
        } else {
            state = color === Gipf.Color.WHITE ? Gipf.State.WHITE_PIECE : Gipf.State.BLACK_PIECE;
        }
    };

    this.remove_piece = function () {
        var color = (state === Gipf.State.WHITE_GIPF || state === Gipf.State.WHITE_PIECE) ? Gipf.Color.WHITE : Gipf.Color.BLACK;
        var gipf = (state === Gipf.State.WHITE_GIPF || state === Gipf.State.BLACK_GIPF);

        state = Gipf.State.VACANT;
        return { color: color, gipf: gipf };
    };

    this.state = function () {
        return state;
    };

// private methods
    var init = function (c) {
        coordinates = c;
        state = Gipf.State.VACANT;
    };

// private attributes
    var coordinates;
    var state;

    init(c);
};

Gipf.Engine = function (t, c) {

// public methods
    this.change_color = function () {
        color = this.next_color(color);
    };

    this.current_color = function () {
        return color;
    };

    this.exist_intersection = function (letter, number) {
        var coordinates = new Gipf.Coordinates(letter, number);

        if (coordinates.is_valid()) {
            return intersections[coordinates.hash()] != null;
        } else {
            return false;
        }
    };

    this.get_black_captured_piece_number = function() {
        return blackCapturedPieceNumber;
    };

    this.get_black_piece_number = function() {
        return blackPieceNumber;
    };

    this.get_free_intersections = function () {
        var list = [];

        for (var index in intersections) {
            var intersection = intersections[index];

            if (intersection.state() === Gipf.State.VACANT) {
                list.push(intersection.coordinates());
            }
        }
        return list;
    };

    this.get_intersection = function (letter, number) {
        return intersections[(new Gipf.Coordinates(letter, number)).hash()];
    };

    this.get_intersections = function () {
        return intersections;
    };

/*    this.get_no_free_intersections = function (color) {
        var list = [];

        for (var index in intersections) {
            var intersection = intersections[index];

            if (intersection.state() === Gipf.State.NO_VACANT && intersection.color() === color) {
                list.push(intersection);
            }
        }
        return list;
    }; */

    this.get_possible_first_putting_list = function() {
        var list = [];

        if (get_intersection('B', 2).state() === Gipf.State.VACANT) {
            list.push(new Gipf.Coordinates('B', 2));
        }
        if (get_intersection('B', 5).state() === Gipf.State.VACANT) {
            list.push(new Gipf.Coordinates('B', 5));
        }
        if (get_intersection('E', 2).state() === Gipf.State.VACANT) {
            list.push(new Gipf.Coordinates('E', 2));
        }
        if (get_intersection('E', 8).state() === Gipf.State.VACANT) {
            list.push(new Gipf.Coordinates('E', 8));
        }
        if (get_intersection('H', 5).state() === Gipf.State.VACANT) {
            list.push(new Gipf.Coordinates('H', 5));
        }
        if (get_intersection('H', 8).state() === Gipf.State.VACANT) {
            list.push(new Gipf.Coordinates('H', 8));
        }
        return list;
    };

    this.get_possible_pushing_list = function(origin) {
        var list = [];
        var direction = Gipf.Direction.NORTH_WEST;
        var stop = false;

        while (!stop) {
            // column
            if (direction === Gipf.Direction.NORTH || direction === Gipf.Direction.SOUTH) {
                var l = origin.letter();

                if (l >= 'B' && l <= 'H') {
                    if (check_column(l)) {
                        if (origin.number() === Gipf.begin_number[l.charCodeAt(0) - 'A'.charCodeAt(0)]) {
                            if (direction === Gipf.Direction.NORTH) {
                                list.push(new Gipf.Coordinates(l, Gipf.begin_number[l.charCodeAt(0) - 'A'.charCodeAt(0)] + 1));
                            }
                        } else {
                            if (direction === Gipf.Direction.SOUTH) {
                                list.push(new Gipf.Coordinates(l, Gipf.end_number[l.charCodeAt(0) - 'A'.charCodeAt(0)] - 1));
                            }
                        }
                    }
                }
            }
            // line
            if (direction === Gipf.Direction.SOUTH_EAST || direction === Gipf.Direction.NORTH_WEST) {
                var n = origin.number();

                if (n >= 2 && n <= 8) {
                    if (check_line(n)) {
                        if (origin.letter() === Gipf.begin_letter[n - 1]) {
                            if (direction === Gipf.Direction.SOUTH_EAST) {
                                list.push(new Gipf.Coordinates(String.fromCharCode(Gipf.begin_letter[n - 1].charCodeAt(0) + 1), n));
                            }
                        } else {
                            if (direction === Gipf.Direction.NORTH_WEST) {
                                list.push(new Gipf.Coordinates(String.fromCharCode(Gipf.end_letter[n - 1].charCodeAt(0) - 1), n));
                            }
                        }
                    }
                }
             }
             // diagonal
            if (direction === Gipf.Direction.NORTH_EAST || direction === Gipf.Direction.SOUTH_WEST) {
                var i = find_diagonal(origin);

                if (i >= 2 && i <= 8) {
                    if (check_diagonal(i)) {
                        if (origin.letter() === Gipf.begin_diagonal_letter[i - 1] && origin.number() === Gipf.begin_diagonal_number[i - 1]) {
                            if (direction === Gipf.Direction.NORTH_EAST) {
                                list.push(new Gipf.Coordinates(String.fromCharCode(Gipf.begin_diagonal_letter[i - 1].charCodeAt(0) + 1), Gipf.begin_diagonal_number[i - 1] + 1));
                            }
                        } else {
                            if (direction === Gipf.Direction.SOUTH_WEST) {
                                list.push(new Gipf.Coordinates(String.fromCharCode(Gipf.end_diagonal_letter[i - 1].charCodeAt(0) - 1), Gipf.end_diagonal_number[i - 1] - 1));
                            }
                        }
                    }
                }
            }

            if (direction === Gipf.Direction.SOUTH_WEST) {
                stop = true;
            } else {
                direction = next_direction(direction);
            }
        }
        return list;
    };

    this.get_possible_putting_list = function() {
        var list = [];

        // column
        for (var l = 'B'.charCodeAt(0); l <= 'H'.charCodeAt(0); ++l) {
            if (check_column(String.fromCharCode(l))) {
                list.push(new Gipf.Coordinates(String.fromCharCode(l), Gipf.begin_number[l - 'A'.charCodeAt(0)]));
                list.push(new Gipf.Coordinates(String.fromCharCode(l), Gipf.end_number[l - 'A'.charCodeAt(0)]));
            }
        }
        // line
        for (var n = 2; n <= 8; ++n) {
            if (check_line(n)) {
                list.push(new Gipf.Coordinates(Gipf.begin_letter[n - 1], n));
                list.push(new Gipf.Coordinates(Gipf.end_letter[n - 1], n));
            }
        }
        // diagonal
        for (var i = 2; i <= 8; ++i) {
            if (check_diagonal(i)) {
                list.push(new Gipf.Coordinates(Gipf.begin_diagonal_letter[i - 1], Gipf.begin_diagonal_number[i - 1]));
                list.push(new Gipf.Coordinates(Gipf.end_diagonal_letter[i -1], Gipf.end_diagonal_number[i - 1]));
            }
        }
        return list;
    };

    this.get_rows = function (color) {
        var result = {
            start: false,
            row: [],
            rows: []
        };
        var n;
        var l;

        // line
        for (n = 2; n < 9; ++n) {
            result.start = false;
            result.row = [];
            for (l = Gipf.begin_letter[n - 1].charCodeAt(0); l <= Gipf.end_letter[n - 1].charCodeAt(0); ++l) {
                result = build_row(Gipf.letters[l - 'A'.charCodeAt(0)], n, color, result);
            }
            if (result.row.length >= 4) {
                result.rows.push(result.row);
            }
        }

        // column
        for (l = 'B'.charCodeAt(0); l < 'I'.charCodeAt(0); ++l) {
            result.start = false;
            result.row = [];
            for (n = Gipf.begin_number[l - 'A'.charCodeAt(0)]; n <= Gipf.end_number[l - 'A'.charCodeAt(0)]; ++n) {
                result = build_row(Gipf.letters[l - 'A'.charCodeAt(0)], n, color, result);
            }
            if (result.row.length >= 4) {
                result.rows.push(result.row);
            }
        }

        // diagonal
        for (var i = 1; i < 8; ++i) {
            n = Gipf.begin_diagonal_number[i];
            l = Gipf.begin_diagonal_letter[i].charCodeAt(0);
            result.start = false;
            result.row = [];
            while (l <= Gipf.end_diagonal_letter[i].charCodeAt(0) &&
                n <= Gipf.end_diagonal_number[i]) {
                result = build_row(Gipf.letters[l - 'A'.charCodeAt(0)], n, color, result);
                ++l;
                ++n;
            }
            if (result.row.length >= 4) {
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

         while (it !== srows.end() and not found) {
         Rows::const_iterator itr = it->begin();

         while (itr !== it->end() and not found) {
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

    this.get_state = function () {
        return state;
    };

    this.get_white_captured_piece_number = function() {
        return whiteCapturedPieceNumber;
    };

    this.get_white_piece_number = function() {
        return whitePieceNumber;
    };

    this.phase = function () {
        return phase;
    };

    this.is_finished = function () {
        return blackPieceNumber === 0 || whitePieceNumber === 0;
    };

    this.next_color = function (c) {
        return c === Gipf.Color.BLACK ? Gipf.Color.WHITE : Gipf.Color.BLACK;
    };

    this.push_piece = function(origin, destination, color) {
        var it_origin = intersections[origin.hash()];
        var it_destination = intersections[destination.hash()];

        if (it_destination.state() === Gipf.State.VACANT) {
            var result = it_origin.remove_piece();

            it_destination.put_piece(result.color, result.gipf);
        } else {
            var delta_letter = destination.letter().charCodeAt(0) - origin.letter().charCodeAt(0);
            var delta_number = destination.number() - origin.number();
            var found = false;
            var coordinates = destination.move(delta_letter, delta_number);

            while (!found) {
                var intersection = intersections[coordinates.hash()];

                found = intersection.state() === Gipf.State.VACANT;
                if (!found) {
                    coordinates = coordinates.move(delta_letter, delta_number);
                }
            }
            delta_letter = -delta_letter;
            delta_number = -delta_number;
            while (coordinates.hash() != origin.hash()) {
                move_piece(coordinates, coordinates.move(delta_letter, delta_number));
                coordinates = coordinates.move(delta_letter, delta_number);
            }
        }
        if (this.get_rows(color).length > 0) {
            phase = Gipf.Phase.REMOVE_ROWS;
        } else {
            phase = Gipf.Phase.PUT_PIECE;
            this.change_color();
        }
    };

    this.put_first_piece = function(coordinates, color, gipf) {
        var letter = coordinates.letter();
        var number = coordinates.number();

        if ((letter === 'B' && number === 2) || (letter === 'B' && number === 5) ||
            (letter === 'E' && number === 2) || (letter === 'E' && number === 8) ||
            (letter === 'H' && number === 5) || (letter === 'H' && number === 8)) {
            var intersection = intersections[coordinates.hash()];

            if (intersection.state() === Gipf.State.VACANT) {
                intersection.put_piece(color, gipf);
                ++initialPlacedPieceNumber;
                remove_piece_from_reserve(color);
            }
        }
        if (initialPlacedPieceNumber === 6) {
            phase = Gipf.Phase.PUT_PIECE;
        }
        this.change_color();
    };

    this.put_piece = function(coordinates, color) {
        var letter = coordinates.letter();
        var number = coordinates.number();

        if (letter === 'A'  || letter === 'I' || number === 1 || number === 9 ||
            (letter === 'B' && number === 6) || (letter === 'C' && number === 7) ||
            (letter === 'D' && number === 8) || (letter === 'F' && number === 2) ||
            (letter === 'G' && number === 3) || (letter === 'H' && number === 4)) {
            var intersection = intersections[coordinates.hash()];

            if (intersection.state() === Gipf.State.VACANT) {
                intersection.put_piece(color, false);
                remove_piece_from_reserve(color);
            }
        }
        phase = Gipf.Phase.PUSH_PIECE;
    };

    this.remove_row = function(coordinates, color, change) {
        var rows = this.get_rows(color);
        var row;

        for (var i in rows) {
            var r = rows[i];

            for (var j in rows[i]) {
                if (rows[i][j].hash() === coordinates.hash()) {
                    row = r;
                    break;
                }
            }
            if (row) {
                break;
            }
        }

        for (var index in row) {
            remove_piece(row[index].letter(), row[index].number(), color);
        }
        if (this.get_rows(color).length === 0) {
            phase = Gipf.Phase.PUT_PIECE;
            if (change) {
                this.change_color();
            }
        }
    };

    this.type = function() {
        return type;
    };

    this.verify_first_putting = function(letter, number) {
        var coordinates = new Gipf.Coordinates(letter, number);
        var list = this.get_possible_first_putting_list();
        var found = false;

        for (var index in list) {
            if (list[index].hash() === coordinates.hash()) {
                found = true;
                break;
            }
        }
        return found;
    };

    this.verify_pushing = function(origin, letter, number) {
        var coordinates = new Gipf.Coordinates(letter, number);
        var list = this.get_possible_pushing_list(origin);
        var found = false;

        for (var index in list) {
            if (list[index].hash() === coordinates.hash()) {
                found = true;
                break;
            }
        }
        return found;
    };

    this.verify_putting = function(letter, number) {
        var coordinates = new Gipf.Coordinates(letter, number);
        var list = this.get_possible_putting_list();
        var found = false;

        for (var index in list) {
            if (list[index].hash() === coordinates.hash()) {
                found = true;
                break;
            }
        }
        return found;
    };

    this.winner_is = function () {
        if (this.is_finished()) {
            if (blackPieceNumber === 0) {
                return Gipf.Color.WHITE;
            } else {
                return Gipf.Color.BLACK;
            }
        } else {
            return false;
        }
    };

// private methods
    var build_row = function (letter, number, color, previous) {
        var result = previous;
        var coordinates = new Gipf.Coordinates(letter, number);
        var intersection = intersections[coordinates.hash()];

        if (!result.start && intersection.state() != Gipf.State.VACANT && intersection.color() === color) {
            result.start = true;
            result.row.push(coordinates);
        } else if (result.start && intersection.state() != Gipf.State.VACANT && intersection.color() === color) {
            result.row.push(coordinates);
        } else if (result.start && ((intersection.state() != Gipf.State.VACANT && intersection.color() != color) || intersection.state() === Gipf.State.VACANT)) {
            if (result.row.length >= 4) {
                result.row = complete_row(result.row, color);
                result.rows.push(result.row);
            }
            result.start = false;
            result.row = [];
        }
        return result;
    };

    var check_column = function(l) {
        var found = false;
        var n = Gipf.begin_number[l.charCodeAt(0) - 'A'.charCodeAt(0)] + 1;

        while (!found && n < Gipf.end_number[l.charCodeAt(0) - 'A'.charCodeAt(0)]) {
            if (get_intersection(l, n).state() === Gipf.State.VACANT) {
                found = true;
            } else {
                ++n;
            }
        }
        return found;
    };

    var check_diagonal = function(i) {
        var found = false;
        var l = String.fromCharCode(Gipf.begin_diagonal_letter[i - 1].charCodeAt(0) + 1);
        var n = Gipf.begin_diagonal_number[i - 1] + 1;

        while (!found && l < Gipf.end_diagonal_letter[i - 1] && n < Gipf.end_diagonal_number[i - 1]) {
            if (get_intersection(l, n).state() === Gipf.State.VACANT) {
                found = true;
            } else {
                l = String.fromCharCode(l.charCodeAt(0) + 1);
                ++n;
            }
        }
        return found;
    };

    var check_line = function(n) {
        var found = false;
        var l = String.fromCharCode(Gipf.begin_letter[n - 1].charCodeAt(0) + 1);

        while (!found && l < Gipf.end_letter[n - 1]) {
            if (get_intersection(l, n).state() === Gipf.State.VACANT) {
                found = true;
            } else {
                l = String.fromCharCode(l.charCodeAt(0) + 1);
            }
        }
        return found;
    };

    var complete_row = function(row, color) {
        // column
        if (row[0].letter() === row[row.length - 1].letter()) {
            var found = true;
            var l = row[0].letter();
            var n_front = row[0].number();
            var n_back = row[row.length - 1].number();

            for (var n = n_front - 1; found && n > Gipf.begin_number[l.charCodeAt(0) - 'A'.charCodeAt(0)]; --n) {
                if (get_intersection(l, n).state() != Gipf.State.VACANT) {
                    row.unshift(new Gipf.Coordinates(l, n));
                } else {
                    found = false;
                }
            }
            found = true;
            for (var n = n_back + 1; found && n < Gipf.end_number[l.charCodeAt(0) - 'A'.charCodeAt(0)]; ++n) {
                if (get_intersection(l, n).state() != Gipf.State.VACANT) {
                    row.push(new Gipf.Coordinates(l, n));
                } else {
                    found = false;
                }
            }
        // line
        } else if (row[0].number() === row[row.length - 1].number()) {
            var found = true;
            var n = row[0].number();
            var l_front = row[0].letter();
            var l_back = row[row.length - 1].letter();

            for (var l = String.fromCharCode(l_front.charCodeAt(0) - 1); found && l > Gipf.begin_letter[n - 1]; l = String.fromCharCode(l.charCodeAt(0) - 1)) {
                if (get_intersection(l, n).state() != Gipf.State.VACANT) {
                    row.unshift(new Gipf.Coordinates(l, n));
                } else {
                    found = false;
                }
            }
            found = true;
            for (var l = String.fromCharCode(l_back.charCodeAt(0) + 1); found && l < Gipf.end_letter[n - 1]; l = String.fromCharCode(l.charCodeAt(0) + 1)) {
                if (get_intersection(l, n).state() != Gipf.State.VACANT) {
                    row.push(new Gipf.Coordinates(l, n));
                } else {
                    found = false;
                }
            }
        // diagonal
        } else {
            var n_front = row[0].number();
            var n_back = row[row.length - 1].number();
            var l_front = row[0].letter();
            var l_back = row[row.length - 1].letter();

            {
                var l = String.fromCharCode(l_front.charCodeAt(0) - 1);
                var n = n_front - 1;

                while (get_intersection(l, n).state() != Gipf.State.VACANT) {
                    row.unshift(new Gipf.Coordinates(l, n));
                    l = String.fromCharCode(l.charCodeAt(0) - 1);
                    --n;
                }
            }
            {
                var l = String.fromCharCode(l_back.charCodeAt(0) + 1);
                var n = n_back + 1;

                while (get_intersection(l, n).state() != Gipf.State.VACANT) {
                    row.push(new Gipf.Coordinates(l, n));
                    l = String.fromCharCode(l.charCodeAt(0) + 1);
                    ++n;
                }
            }
        }
        return row;
    };

    var find_diagonal = function(coordinates) {
        var found = false;
        var i = 0;

        while (!found && i < 9) {
            found = coordinates.letter() === Gipf.begin_diagonal_letter[i] && coordinates.number() === Gipf.begin_diagonal_number[i];
            if (!found) {
                ++i;
            }
        }
        if (!found) {
            i = 0;
            while (!found && i < 9) {
                found = coordinates.letter() === Gipf.end_diagonal_letter[i] && coordinates.number() === Gipf.end_diagonal_number[i];
                if (!found) {
                    ++i;
                }
            }
        }
        if (found) {
            return i + 1;
        } else {
            return -1;
        }
    };

    var get_intersection = function (letter, number) {
        return intersections[new Gipf.Coordinates(letter, number).hash()];
    };

    var init = function (t, c) {
        type = t;
        color = c;
        phase = Gipf.Phase.PUT_FIRST_PIECE;
        initialPlacedPieceNumber = 0;
        blackPieceNumber = 18;
        whitePieceNumber = 18;
        blackCapturedPieceNumber = 0;
        whiteCapturedPieceNumber = 0;
        intersections = [];
        for (var i = 0; i < Gipf.letters.length; ++i) {
            var l = Gipf.letters[i];

            for (var n = Gipf.begin_number[l.charCodeAt(0) - 'A'.charCodeAt(0)];
                 n <= Gipf.end_number[l.charCodeAt(0) - 'A'.charCodeAt(0)]; ++n) {
                var coordinates = new Gipf.Coordinates(l, n);

                intersections[coordinates.hash()] = new Gipf.Intersection(coordinates);
            }
        }
    };

    var move_piece = function(origin, destination) {
        var to = get_intersection(origin.letter(), origin.number());
        var from = get_intersection(destination.letter(), destination.number());
        var result = from.remove_piece();

        to.put_piece(result.color, result.gipf);
    };

    var next_direction = function (direction) {
        if (direction === Gipf.Direction.NORTH_WEST) {
            return Gipf.Direction.NORTH;
        } else if (direction === Gipf.Direction.NORTH) {
            return Gipf.Direction.NORTH_EAST;
        } else if (direction === Gipf.Direction.NORTH_EAST) {
            return Gipf.Direction.SOUTH_EAST;
        } else if (direction === Gipf.Direction.SOUTH_EAST) {
            return Gipf.Direction.SOUTH;
        } else if (direction === Gipf.Direction.SOUTH) {
            return Gipf.Direction.SOUTH_WEST;
        } else if (direction === Gipf.Direction.SOUTH_WEST) {
            return Gipf.Direction.NORTH_WEST;
        }
    };

    var remove_piece = function(letter, number, color) {
        var coordinates = new Gipf.Coordinates(letter, number);
        var intersection = intersections[coordinates.hash()];
        var result = intersection.remove_piece();

        if (color === result.color) {
            if (color === Gipf.Color.BLACK) {
                ++blackPieceNumber;
            } else {
                ++whitePieceNumber;
            }
        } else {
            if (result.color === Gipf.Color.BLACK) {
                ++blackCapturedPieceNumber;
            } else {
                ++whiteCapturedPieceNumber;
            }
        }
        return result;
    };

    var remove_piece_from_reserve = function(color) {
        if (color === Gipf.Color.BLACK) {
            --blackPieceNumber;
        } else {
            --whitePieceNumber;
        }
    };

// private attributes
    var type;
    var color;
    var intersections;

    var phase;
    var state;

    var initialPlacedPieceNumber;
    var blackPieceNumber;
    var whitePieceNumber;
    var blackCapturedPieceNumber;
    var whiteCapturedPieceNumber;

    init(t, c);
};
