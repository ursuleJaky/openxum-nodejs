"use strict";

// grid constants definition
Tzaar.begin_letter = [ 'A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E' ];
Tzaar.end_letter = [ 'E', 'F', 'G', 'H', 'I', 'I', 'I', 'I', 'I' ];
Tzaar.begin_number = [ 1, 1, 1, 1, 1, 2, 3, 4, 5 ];
Tzaar.end_number = [ 5, 6, 7, 8, 9, 9, 9, 9, 9 ];
Tzaar.begin_diagonal_letter = [ 'A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E' ];
Tzaar.end_diagonal_letter = [ 'E', 'F', 'G', 'H', 'I', 'I', 'I', 'I', 'I' ];
Tzaar.begin_diagonal_number = [ 5, 4, 3, 2, 1, 1, 1, 1, 1 ];
Tzaar.end_diagonal_number = [ 9, 9, 9, 9, 9, 8, 7, 6, 5 ];

// enums definition
Tzaar.GameType = { STANDARD: 0 };
Tzaar.Color = { NONE: -1, BLACK: 0, WHITE: 1 };
Tzaar.Phase = { FIRST_MOVE: 0, CAPTURE: 1, CHOOSE: 2, SECOND_CAPTURE: 3, MAKE_STRONGER: 4, PASS: 5 };
Tzaar.State = { VACANT: 0, NO_VACANT: 1 };
Tzaar.MoveType = { FIRST_MOVE: 0, CAPTURE: 1, CHOOSE: 2, SECOND_CAPTURE: 3, MAKE_STRONGER: 4 };
Tzaar.PieceType = { TZAAR: 0, TZARRA: 1, TOTT: 2 };
Tzaar.Direction = { NORTH_WEST: 0, NORTH: 1, NORTH_EAST: 2, SOUTH_EAST: 3, SOUTH: 4, SOUTH_WEST: 5 };
Tzaar.letters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I' ];

// initial state
Tzaar.initial_type = [
    // column A
    Tzaar.PieceType.TOTT, Tzaar.PieceType.TOTT, Tzaar.PieceType.TOTT, Tzaar.PieceType.TOTT, Tzaar.PieceType.TOTT,
    // column B
    Tzaar.PieceType.TOTT, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TOTT,
    // column C
    Tzaar.PieceType.TOTT, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TZAAR, Tzaar.PieceType.TZAAR, Tzaar.PieceType.TZAAR, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TOTT,
    // column D
    Tzaar.PieceType.TOTT, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TZAAR, Tzaar.PieceType.TOTT, Tzaar.PieceType.TOTT, Tzaar.PieceType.TZAAR, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TOTT,
    // column E
    Tzaar.PieceType.TOTT, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TZAAR, Tzaar.PieceType.TOTT, Tzaar.PieceType.TOTT, Tzaar.PieceType.TZAAR, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TOTT,
    // column F
    Tzaar.PieceType.TOTT, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TZAAR, Tzaar.PieceType.TOTT, Tzaar.PieceType.TOTT, Tzaar.PieceType.TZAAR, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TOTT,
    // column G
    Tzaar.PieceType.TOTT, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TZAAR, Tzaar.PieceType.TZAAR, Tzaar.PieceType.TZAAR, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TOTT,
    // column H
    Tzaar.PieceType.TOTT, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TOTT,
    // column I
    Tzaar.PieceType.TOTT, Tzaar.PieceType.TOTT, Tzaar.PieceType.TOTT, Tzaar.PieceType.TOTT, Tzaar.PieceType.TOTT
];

Tzaar.initial_color = [
    // column A
    Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.WHITE,
    // column B
    Tzaar.Color.WHITE, Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.WHITE, Tzaar.Color.WHITE,
    // column C
    Tzaar.Color.WHITE, Tzaar.Color.WHITE, Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.WHITE, Tzaar.Color.WHITE, Tzaar.Color.WHITE,
    // column D
    Tzaar.Color.WHITE, Tzaar.Color.WHITE, Tzaar.Color.WHITE, Tzaar.Color.BLACK, Tzaar.Color.WHITE, Tzaar.Color.WHITE, Tzaar.Color.WHITE, Tzaar.Color.WHITE,
    // column E
    Tzaar.Color.WHITE, Tzaar.Color.WHITE, Tzaar.Color.WHITE, Tzaar.Color.WHITE, Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.BLACK,
    // column F
    Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.WHITE, Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.BLACK,
    // column G
    Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.WHITE, Tzaar.Color.WHITE, Tzaar.Color.BLACK, Tzaar.Color.BLACK,
    // column H
    Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.WHITE, Tzaar.Color.WHITE, Tzaar.Color.WHITE, Tzaar.Color.BLACK,
    // column I
    Tzaar.Color.BLACK, Tzaar.Color.WHITE, Tzaar.Color.WHITE, Tzaar.Color.WHITE, Tzaar.Color.WHITE
];

Tzaar.Coordinates = function (l, n) {

// public methods
    this.clone = function () {
        return new Tzaar.Coordinates(l, n);
    };

    this.hash = function () {
        return (letter.charCodeAt(0) - 'A'.charCodeAt(0)) + (number - 1) * 9;
    };

    this.is_valid = function () {
        return ((letter === 'A' && number >= 1 && number <= 5) ||
            (letter === 'B' && number >= 1 && number <= 6) ||
            (letter === 'C' && number >= 1 && number <= 7) ||
            (letter === 'D' && number >= 1 && number <= 8) ||
            (letter === 'E' && number >= 1 && number <= 9) ||
            (letter === 'F' && number >= 2 && number <= 9) ||
            (letter === 'G' && number >= 3 && number <= 9) ||
            (letter === 'H' && number >= 4 && number <= 9) ||
            (letter === 'I' && number >= 5 && number <= 9)) && (letter !== 'E' || number !== 5);
    };

    this.letter = function () {
        return letter;
    };

    this.move = function (distance, direction) {
        switch (direction) {
            case Tzaar.Direction.NORTH_WEST:
                return new Tzaar.Coordinates(compute_letter(letter, -distance), number);
            case Tzaar.Direction.NORTH:
                return new Tzaar.Coordinates(letter, number + distance);
            case Tzaar.Direction.NORTH_EAST:
                return new Tzaar.Coordinates(compute_letter(letter, distance), number + distance);
            case Tzaar.Direction.SOUTH_EAST:
                return new Tzaar.Coordinates(compute_letter(letter, distance), number);
            case Tzaar.Direction.SOUTH:
                return new Tzaar.Coordinates(letter, number - distance);
            case Tzaar.Direction.SOUTH_WEST:
                return new Tzaar.Coordinates(compute_letter(letter, -distance), number - distance);
        }
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
            return Tzaar.letters[index];
        } else {
            return 'X';
        }
    };

    var letter = l;
    var number = n;
};

Tzaar.Intersection = function (c, cl, t) {
// private attributes
    var coordinates;
    var state;
    var stack;

// public methods
    this.capture = function (destination) {
        var _stack = new Tzaar.Stack();

        while (!stack.empty()) {
            _stack.put_piece(stack.remove_top());
        }
        state = Tzaar.State.VACANT;
        destination.remove_stack();
        while (!_stack.empty()) {
            var piece = _stack.remove_top();

            destination.put_piece(piece.color(), piece.type());
        }
    };

    this.clone = function () {
        var intersection = new Tzaar.Intersection(coordinates.clone());

        intersection.set(state, stack.clone());
        return intersection;
    };

    this.color = function () {
        if (state === Tzaar.State.VACANT) {
            return -1;
        }
        return stack.color();
    };

    this.coordinates = function () {
        return coordinates;
    };

    this.hash = function () {
        return coordinates.hash();
    };

    this.letter = function () {
        return coordinates.letter();
    };

    this.move_stack_to = function (destination) {
        var _stack = new Tzaar.Stack();

        while (!stack.empty()) {
            _stack.put_piece(stack.remove_top());
        }
        state = Tzaar.State.VACANT;
        while (!_stack.empty()) {
            var piece = _stack.remove_top();

            destination.put_piece(piece.color(), piece.type());
        }
    };

    this.number = function () {
        return coordinates.number();
    };

    this.put_piece = function (color, type) {
        state = Tzaar.State.NO_VACANT;
        stack.put_piece(new Tzaar.Piece(color, type));
    };

    this.remove_stack = function () {
        state = Tzaar.State.VACANT;
        stack.clear();
    };

    this.set = function (_state, _stack) {
        state = _state;
        stack = _stack;
    };

    this.size = function () {
        return stack.size();
    };

    this.state = function () {
        return state;
    };

    this.type = function () {
        return stack.type();
    };

// private methods
    var init = function (c, cl, t) {
        coordinates = c;
        state = Tzaar.State.NO_VACANT;
        stack = new Tzaar.Stack();
        stack.put_piece(new Tzaar.Piece(cl, t));
    };

    init(c, cl, t);
};

Tzaar.Piece = function (c, t) {
// private attributes
    var _color;
    var _type;

// public methods
    this.clone = function () {
        return new Tzaar.Piece(_color);
    };

    this.color = function () {
        return _color;
    };

    this.type = function () {
        return _type;
    };

// private methods
    var init = function (c, t) {
        _color = c;
        _type = t;
    };

    init(c, t);
};

Tzaar.Stack = function () {
// private attributes
    var _pieces;

// public methods
    this.color = function () {
        return top().color();
    };

    this.clear = function () {
        while (!this.empty()) {
            _pieces.pop();
        }
    };

    this.clone = function () {
        var o = new Tzaar.Stack();

        for (var i = 0; i < _pieces.length; ++i) {
            o.put_piece(_pieces[i].clone());
        }
        return o;
    };

    this.empty = function () {
        return _pieces.length === 0;
    };

    this.put_piece = function (piece) {
        _pieces.push(piece);
    };

    this.remove_top = function () {
        var _top = top();

        _pieces.pop();
        return _top;
    };

    this.size = function () {
        return _pieces.length;
    };

    this.type = function () {
        return top().type();
    };

// private attributes
    var init = function () {
        _pieces = [];
    };

    var top = function () {
        return _pieces[_pieces.length - 1];
    };

    init();
};

Tzaar.Move = function (t, c, f, to, ch) {
// private attributes
    var _type;
    var _color;
    var _from;
    var _to;
    var _choice;

// private methods
    var init = function (t, c, f, to, choice) {
        _type = t;
        _color = c;
        _from = f;
        _to = to;
        _choice = choice;
    };

// public methods
    this.choice = function () {
        return _choice;
    };

    this.color = function () {
        return _color;
    };

    this.from = function () {
        return _from;
    };

    this.get = function () {
        if (_type === Tzaar.MoveType.FIRST_MOVE) {
            return 'FM' + (_color === Tzaar.Color.BLACK ? 'B' : 'W') + _from.to_string() + _to.to_string();
        } else if (_type === Tzaar.MoveType.CAPTURE) {
            return 'Ca' + (_color === Tzaar.Color.BLACK ? 'B' : 'W') + _from.to_string() + _to.to_string();
        } else if (_type === Tzaar.MoveType.CHOOSE) {
            return 'Ch' + _choice === Tzaar.Phase.SECOND_CAPTURE ? 'Ca' : _choice === Tzaar.Phase.MAKE_STRONGER ? 'MS' : 'Pa';
        } else if (_type === Tzaar.MoveType.SECOND_CAPTURE) {
            return 'SC' + (_color === Tzaar.Color.BLACK ? 'B' : 'W') + _from.to_string() + _to.to_string();
        } else if (_type === Tzaar.MoveType.MAKE_STRONGER) {
            return 'MS' + (_color === Tzaar.Color.BLACK ? 'B' : 'W') + _from.to_string() + _to.to_string();
        }
    };

    this.parse = function (str) {
        var type = str.substring(0, 2);

        if (type === 'FM') {
            _type = Tzaar.MoveType.FIRST_MOVE;
            _from = new Tzaar.Coordinates(str.charAt(3), parseInt(str.charAt(4)));
            _to = new Tzaar.Coordinates(str.charAt(5), parseInt(str.charAt(6)));
        } else if (type === 'Ca') {
            _type = Tzaar.MoveType.CAPTURE;
            _from = new Tzaar.Coordinates(str.charAt(3), parseInt(str.charAt(4)));
            _to = new Tzaar.Coordinates(str.charAt(5), parseInt(str.charAt(6)));
        } else if (type === 'Ch') {
            var choice = str.substring(2, 4);

            _type = Tzaar.MoveType.CHOOSE;
            if (choice === 'Ca') {
                _choice = Tzaar.Phase.SECOND_CAPTURE;
            } else if (choice === 'MS') {
                _choice = Tzaar.Phase.MAKE_STRONGER;
            } else {
                _choice = Tzaar.Phase.PASS;
            }
        } else if (type === 'SC') {
            _type = Tzaar.MoveType.SECOND_CAPTURE;
            _from = new Tzaar.Coordinates(str.charAt(3), parseInt(str.charAt(4)));
            _to = new Tzaar.Coordinates(str.charAt(5), parseInt(str.charAt(6)));
        } else if (type === 'MS') {
            _type = Tzaar.MoveType.MAKE_STRONGER;
            _from = new Tzaar.Coordinates(str.charAt(3), parseInt(str.charAt(4)));
            _to = new Tzaar.Coordinates(str.charAt(5), parseInt(str.charAt(6)));
        }
    };

    this.to = function () {
        return _to;
    };

    this.to_object = function () {
        return { type: _type, color: _color, from: _from, to: _to, choice: _choice};
    };

    this.to_string = function () {
        if (_type === Tzaar.MoveType.FIRST_MOVE) {
            return 'Move ' + (_color === Tzaar.Color.BLACK ? 'black' : 'white') + ' piece from ' + _from.to_string() + ' to ' + _to.to_string();
        } else if (_type === Tzaar.MoveType.CAPTURE) {
            return 'Capture with ' + (_color === Tzaar.Color.BLACK ? 'black' : 'white') + ' piece from ' +
                _from.to_string() + ' to ' + _to.to_string();
        } else if (_type === Tzaar.MoveType.CHOOSE) {
            return 'Choose ' + _choice === Tzaar.Phase.SECOND_CAPTURE ? 'to capture' : _choice === Tzaar.Phase.MAKE_STRONGER ? 'to make stronger' : 'to pass';
        } else if (_type === Tzaar.MoveType.SECOND_CAPTURE) {
            return 'Capture with ' + (_color === Tzaar.Color.BLACK ? 'black' : 'white') + ' piece from ' + _from.to_string() + ' to ' + _to.to_string();
        } else if (_type === Tzaar.MoveType.MAKE_STRONGER) {
            return 'Make stronger with ' + (_color === Tzaar.Color.BLACK ? 'black' : 'white') + ' piece from ' + _from.to_string() + ' to ' + _to.to_string();
        }
    };

    this.type = function () {
        return _type;
    };

    init(t, c, f, to, ch);
};

Tzaar.Engine = function (t, c) {
// private attributes
    var type;
    var color;
    var intersections;

    var phase;
    var state;
    var placedTzaarPieceNumber;
    var placedPieceNumber;

// public methods
    this.can_capture = function (color) {
        var found = false;
        var list = this.get_no_free_intersections(color);
        var index = 0;

        while (!found && index < list.length) {
            found = this.get_distant_neighbors(list[index].coordinates(), color === Tzaar.Color.BLACK ? Tzaar.Color.WHITE : Tzaar.Color.BLACK, true).length > 0;
            ++index;
        }
        return found;
    };

    this.can_make_stack = function (color) {
        var found = false;
        var list = this.get_no_free_intersections(color);
        var index = 0;

        while (!found && index < list.length) {
            found = this.get_distant_neighbors(list[index].coordinates(), color, false).length > 0;
            ++index;
        }
        return found;
    };

    this.capture = function (origin, destination) {
        var origin_it = intersections[origin.hash()];
        var destination_it = intersections[destination.hash()];

        origin_it.capture(destination_it);
        if (phase === Tzaar.Phase.CAPTURE) {
            phase = Tzaar.Phase.CHOOSE;
        } else if (phase === Tzaar.Phase.SECOND_CAPTURE) {
            phase = Tzaar.Phase.CAPTURE;
            this.change_color();
        }
    };

    this.change_color = function () {
        color = this.next_color(color);
    };

    this.choose = function (capture, make_stack, pass) {
        if (capture) {
            phase = Tzaar.Phase.SECOND_CAPTURE;
        } else if (make_stack) {
            phase = Tzaar.Phase.MAKE_STRONGER;
        } else if (pass) {
            this.pass();
        }
    };

    this.clone = function () {
        var o = new Tzaar.Engine(type, color);

        o.set(phase, state, intersections, placedTzaarPieceNumber, placedPieceNumber);
        return o;
    };

    this.current_color = function () {
        return color;
    };

    this.current_color_string = function () {
        return color === Tzaar.Color.BLACK ? 'black' : 'white';
    };

    this.exist_intersection = function (letter, number) {
        var coordinates = new Tzaar.Coordinates(letter, number);

        if (coordinates.is_valid()) {
            return intersections[coordinates.hash()] !== null;
        } else {
            return false;
        }
    };

    this.first_move = function (origin, destination) {
        var origin_it = intersections[origin.hash()];
        var destination_it = intersections[destination.hash()];

        origin_it.capture(destination_it);
        phase = Tzaar.Phase.CAPTURE;
        this.change_color();
    };

    this.get_distant_neighbors = function (origin, color, control) {
        var list = [];
        var origin_it = intersections[origin.hash()];
        var direction = Tzaar.Direction.NORTH_WEST;
        var stop = false;

        while (!stop) {
            var distance = 0;
            var destination;
            var destination_it;

            do {
                ++distance;
                destination = origin.move(distance, direction);
                if (destination.is_valid()) {
                    destination_it = intersections[destination.hash()];
                }
            } while (destination.is_valid() && destination_it.state() === Tzaar.State.VACANT);
            if (destination.is_valid() && destination_it.state() === Tzaar.State.NO_VACANT && destination_it.color() === color) {
                if (!control || (control && origin_it.size() >= destination_it.size())) {
                    list.push(destination);
                }
            }
            if (direction === Tzaar.Direction.SOUTH_WEST) {
                stop = true;
            } else {
                direction = next_direction(direction);
            }
        }
        return list;
    };

    this.get_free_intersections = function () {
        var list = [];

        for (var index in intersections) {
            var intersection = intersections[index];

            if (intersection.state() === Tzaar.State.VACANT) {
                list.push(intersection.coordinates());
            }
        }
        return list;
    };

    this.get_intersection = function (letter, number) {
        return intersections[(new Tzaar.Coordinates(letter, number)).hash()];
    };

    this.get_intersections = function () {
        return intersections;
    };

    this.get_no_free_intersections = function (color) {
        var list = [];

        for (var index in intersections) {
            var intersection = intersections[index];

            if (intersection.state() === Tzaar.State.NO_VACANT && intersection.color() === color) {
                list.push(intersection);
            }
        }
        return list;
    };

    /*    this.get_possible_move_list = function () {
     // TODO
     };

     this.get_possible_move_number = function (list) {
     // TODO
     }; */

    this.get_possible_capture = function (coordinates) {
        return this.get_distant_neighbors(coordinates, intersections[coordinates.hash()].color() === Tzaar.Color.BLACK ? Tzaar.Color.WHITE : Tzaar.Color.BLACK, true);
    };

    this.get_possible_make_stack = function (coordinates) {
        return this.get_distant_neighbors(coordinates, intersections[coordinates.hash()].color(), false);
    };

    this.get_state = function () {
        return state;
    };

    this.make_stack = function (origin, destination) {
        var origin_it = intersections[origin.hash()];
        var destination_it = intersections[destination.hash()];

        origin_it.move_stack_to(destination_it);
        phase = Tzaar.Phase.CAPTURE;
        this.change_color();
    };

    this.move = function (move) {
        if (move.type() === Tzaar.MoveType.FIRST_MOVE) {
            this.first_move(move.from(), move.to());
        } else if (move.type() === Tzaar.MoveType.CAPTURE) {
            this.capture(move.from(), move.to());
        } else if (move.type() === Tzaar.MoveType.CHOOSE) {
            this.choose(move.choice() === Tzaar.Phase.SECOND_CAPTURE,
                    move.choice() === Tzaar.Phase.MAKE_STRONGER,
                    move.choice() === Tzaar.Phase.PASS);
        } else if (move.type() === Tzaar.MoveType.SECOND_CAPTURE) {
            this.capture(move.from(), move.to());
        } else if (move.type() === Tzaar.MoveType.MAKE_STRONGER) {
            this.make_stack(move.from(), move.to());
        }
    };

    this.pass = function () {
        phase = Tzaar.Phase.CAPTURE;
        this.change_color();
    };

    this.phase = function () {
        return phase;
    };

    this.is_finished = function () {
        return (!this.can_capture(Tzaar.Color.BLACK) || !is_all_types_presented(Tzaar.Color.BLACK) || !this.can_capture(Tzaar.Color.WHITE) || !is_all_types_presented(Tzaar.Color.WHITE));
    };

    this.move_stack = function (origin, destination) {
        var origin_it = intersections[origin.hash()];
        var destination_it = intersections[destination.hash()];

        origin_it.move_stack_to(destination_it);
        this.change_color();
    };

    this.next_color = function (c) {
        return c === Tzaar.Color.BLACK ? Tzaar.Color.WHITE : Tzaar.Color.BLACK;
    };

    /*    this.remove_first_possible_move = function (list) {
     // TODO
     };

     this.select_move = function (list, index) {
     // TODO
     }; */

    this.set = function (_phase, _state, _intersections, _placedTzaarPieceNumber, _placedPieceNumber) {
        var index;

        for (index in _intersections) {
            intersections[index] = _intersections[index].clone();
        }

        phase = _phase;
        state = _state;
        placedTzaarPieceNumber = _placedTzaarPieceNumber;
        placedPieceNumber = _placedPieceNumber;
    };

    this.verify_capture = function (origin, destination) {
        var origin_it = intersections[origin.hash()];
        var list = this.get_distant_neighbors(origin, origin_it.color() === Tzaar.Color.BLACK ? Tzaar.Color.WHITE : Tzaar.Color.BLACK, true);
        var found = false;

        for (var index in list) {
            if (list[index].hash() === destination.hash()) {
                found = true;
                break;
            }
        }
        return found;
    };

    this.winner_is = function () {
        if (this.is_finished()) {
            return color;
        } else {
            return false;
        }
    };

// private methods
    var next_direction = function (direction) {
        if (direction === Tzaar.Direction.NORTH_WEST) {
            return Tzaar.Direction.NORTH;
        } else if (direction === Tzaar.Direction.NORTH) {
            return Tzaar.Direction.NORTH_EAST;
        } else if (direction === Tzaar.Direction.NORTH_EAST) {
            return Tzaar.Direction.SOUTH_EAST;
        } else if (direction === Tzaar.Direction.SOUTH_EAST) {
            return Tzaar.Direction.SOUTH;
        } else if (direction === Tzaar.Direction.SOUTH) {
            return Tzaar.Direction.SOUTH_WEST;
        } else if (direction === Tzaar.Direction.SOUTH_WEST) {
            return Tzaar.Direction.NORTH_WEST;
        }
    };

    var init = function (t, c) {
        var k = 0;

        type = t;
        color = c;
        placedTzaarPieceNumber = 0;
        placedPieceNumber = 0;
        phase = Tzaar.Phase.FIRST_MOVE;
        intersections = [];
        for (var i = 0; i < Tzaar.letters.length; ++i) {
            var l = Tzaar.letters[i];

            for (var n = Tzaar.begin_number[l.charCodeAt(0) - 'A'.charCodeAt(0)];
                 n <= Tzaar.end_number[l.charCodeAt(0) - 'A'.charCodeAt(0)]; ++n) {
                if (l !== 'E' || n !== 5) {
                    var coordinates = new Tzaar.Coordinates(l, n);

                    intersections[coordinates.hash()] = new Tzaar.Intersection(coordinates, Tzaar.initial_color[k], Tzaar.initial_type[k]);
                    ++k;
                }
            }
        }
    };

    var is_all_types_presented = function (color) {
        var tzaar_found = false;
        var tzara_found = false;
        var tott_found = false;

        for (var index in intersections) {
            var intersection = intersections[index];

            if (intersection.state() === Tzaar.State.NO_VACANT && intersection.color() === color) {
                if (intersection.type() === Tzaar.PieceType.TZAAR) {
                    tzaar_found = true;
                }
                if (intersection.type() === Tzaar.PieceType.TZARRA) {
                    tzara_found = true;
                }
                if (intersection.type() === Tzaar.PieceType.TOTT) {
                    tott_found = true;
                }
            }
            if (tzaar_found && tzara_found && tott_found) {
                break;
            }
        }
        return tzaar_found && tzara_found && tott_found;
    };

    init(t, c);
};
