"use strict";

// grid constants definition
Dvonn.begin_letter = [ 'A', 'A', 'A', 'B', 'C' ];
Dvonn.end_letter = [ 'I', 'J', 'K', 'K', 'K' ];
Dvonn.begin_number = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3 ];
Dvonn.end_number = [ 3, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5 ];
Dvonn.begin_diagonal_letter = [ 'A', 'A', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I' ];
Dvonn.end_diagonal_letter = [ 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'K', 'K' ];
Dvonn.begin_diagonal_number = [ 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1 ];
Dvonn.end_diagonal_number = [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 3 ];

// enums definition
Dvonn.GameType = { STANDARD: 0 };
Dvonn.Color = { NONE: -1, BLACK: 0, WHITE: 1, RED: 2 };
Dvonn.Phase = { PUT_DVONN_PIECE: 0, PUT_PIECE: 1, MOVE_STACK: 2 };
Dvonn.State = { VACANT: 0, NO_VACANT: 1 };
Dvonn.Direction = { NORTH_WEST: 0, NORTH_EAST: 1, EAST: 2, SOUTH_EAST: 3, SOUTH_WEST: 4, WEST: 5 };
Dvonn.letters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K' ];

Dvonn.Coordinates = function (l, n) {

// public methods
    this.clone = function () {
        return new Dvonn.Coordinates(l, n);
    };

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
        return (number === 1 && letter >= 'A' && letter <= 'I') ||
            (number === 2 && letter >= 'A' && letter <= 'J') ||
            (number === 3 && letter >= 'A' && letter <= 'K') ||
            (number === 4 && letter >= 'B' && letter <= 'K') ||
            (number === 5 && letter >= 'C' && letter <= 'K');
    };

    this.letter = function () {
        return letter;
    };

    this.move = function(distance, direction) {
        switch (direction) {
            case Dvonn.Direction.NORTH_WEST: return new Dvonn.Coordinates(compute_letter(letter, -distance), number - distance);
            case Dvonn.Direction.NORTH_EAST: return new Dvonn.Coordinates(letter, number - distance);
            case Dvonn.Direction.EAST: return new Dvonn.Coordinates(compute_letter(letter, distance), number);
            case Dvonn.Direction.SOUTH_EAST: return new Dvonn.Coordinates(compute_letter(letter, distance), number + distance);
            case Dvonn.Direction.SOUTH_WEST: return new Dvonn.Coordinates(letter, number + distance);
            case Dvonn.Direction.WEST: return new Dvonn.Coordinates(compute_letter(letter, -distance), number);
        }
    };

    this.number = function () {
        return number;
    };

    this.to_string = function() {
        return letter + number;
    };

// private attributes
    var compute_letter = function(l, d) {
        var index = letter.charCodeAt(0) - 'A'.charCodeAt(0) + d;

        if (index >= 0 && index <= 11) {
            return Dvonn.letters[index];
        } else {
            return 'X';
        }
    };

    var letter = l;
    var number = n;
};

Dvonn.Intersection = function (c) {
// public methods
    this.clone = function () {
        var intersection = new Dvonn.Intersection(coordinates.clone());

        intersection.set(state, stack.clone());
        return intersection;
    };

    this.color = function () {
        if (state === Dvonn.State.VACANT) {
            return -1;
        }
        return stack.color();
    };

    this.coordinates = function () {
        return coordinates;
    };

    this.dvonn = function() {
        return stack.dvonn();
    };

    this.hash = function () {
        return coordinates.hash();
    };

    this.letter = function () {
        return coordinates.letter();
    };

    this.move_stack_to = function(destination) {
        var _stack = new Dvonn.Stack();

        while (!stack.empty()) {
            _stack.put_piece(stack.remove_top());
        }
        state = Dvonn.State.VACANT;
        while (!_stack.empty()) {
            destination.put_piece(_stack.remove_top().color());
        }
    };

    this.number = function () {
        return coordinates.number();
    };

    this.put_piece = function(color) {
        state = Dvonn.State.NO_VACANT;
        stack.put_piece(new Dvonn.Piece(color));
    };

    this.remove_stack = function() {
        state = Dvonn.State.VACANT;
        stack.clear();
    };

    this.state = function () {
        return state;
    };

    this.set = function (_state, _stack) {
        state = _state;
        stack = _stack;
    };

    this.size = function() {
        return stack.size();
    };

// private methods
    var init = function(c) {
        coordinates = c;
        state = Dvonn.State.VACANT;
        stack = new Dvonn.Stack();
    };

// private attributes
    var coordinates;
    var state;
    var stack;

    init(c);
};

Dvonn.Piece = function (c) {

// public methods
    this.color = function() {
        return _color;
    };

    this.clone = function () {
        return new Dvonn.Piece(_color);
    };

    this.dvonn = function() {
        return _dvonn;
    };

// private attributes
    var init = function(c) {
        _color = c;
        _dvonn = c === Dvonn.Color.RED;
    };

    var _color;
    var _dvonn;

    init(c);
};

Dvonn.Stack = function () {

// public methods
    this.color = function() {
        return top().color();
    };

    this.clear = function() {
        while (!this.empty()) {
            _pieces.pop();
        }
    };

    this.clone = function () {
        var o = new Dvonn.Stack();

        for (var i = 0; i < _pieces.length; ++i) {
            o.put_piece(_pieces[i].clone());
        }
        return o;
    };

    this.dvonn = function() {
        return _dvonn;
    };

    this.empty = function() {
        return _pieces.length === 0;
    };

    this.put_piece = function(piece) {
        if (!_dvonn) {
            _dvonn = piece.dvonn();
        }
        _pieces.push(piece);
    };

    this.remove_top = function() {
        var _top = top();

        _pieces.pop();
        if (this.empty()) {
            _dvonn = false;
        }
        return _top;
    };

    this.size = function() {
        return _pieces.length;
    };

// private attributes
    var init = function() {
        _pieces = [];
        _dvonn = false;
    };

    var top = function() {
        return _pieces[_pieces.length - 1];
    };

    var _pieces;
    var _dvonn;

    init();
};

Dvonn.Move = function (t, c, f, to, l) {
// private attributes
    var _type;
    var _color;
    var _from;
    var _to;
    var _list;

// private methods
    var init = function (t, c, f, to, l) {
        _type = t;
        _color = c;
        _from = f;
        _to = to;
        _list = l;
    };

// public methods
    this.color = function () {
        return _color;
    };

    this.from = function () {
        return _from;
    };

    this.get = function () {
        if (_type === Dvonn.Phase.PUT_DVONN_PIECE) {
            return 'PP' + (_color === Dvonn.Color.BLACK ? 'B' : 'W') + _from.to_string();
        } else if (_type === Dvonn.Phase.PUT_PIECE) {
            return 'Pp' + (_color === Dvonn.Color.BLACK ? 'B' : 'W') + _from.to_string();
        } else if (_type === Dvonn.Phase.MOVE_STACK) {
            var str = 'Ms' + (_color === Dvonn.Color.BLACK ? 'B' : 'W') + _from.to_string() + _to.to_string() +
                '[';

            for (var i = 0; i < _list.length; ++i) {
                str += _list[i].to_string();
            }
            str += ']';
            return str;
        }
    };

    this.list = function () {
        return _list;
    };

    this.parse = function (str) {
        var type = str.substring(0, 2);

        if (type === 'PP') {
            _type = Dvonn.Phase.PUT_DVONN_PIECE;
            _from = new Dvonn.Coordinates(str.charAt(3), parseInt(str.charAt(4)));
        } else if (type === 'Pp') {
            _type = Dvonn.Phase.PUT_PIECE;
            _from = new Dvonn.Coordinates(str.charAt(3), parseInt(str.charAt(4)));
        } else if (type === 'Ms') {
            _type = Dvonn.Phase.MOVE_STACK;
            _from = new Dvonn.Coordinates(str.charAt(3), parseInt(str.charAt(4)));
            _to = new Dvonn.Coordinates(str.charAt(5), parseInt(str.charAt(6)));
            _list = [];
            for (var index = 0; index < (str.length - 8) / 2; ++index) {
                _list.push(new Dvonn.Coordinates(str.charAt(8 + 2 * index),
                    parseInt(str.charAt(9 + 2 * index))));
            }
        }
    };

    this.to = function () {
        return _to;
    };

    this.to_object = function () {
        return { type: _type, color: _color, from: _from, to: _to, list: _list};
    };

    this.to_string = function () {
        if (_type === Dvonn.Phase.PUT_DVONN_PIECE) {
            return 'put ' + (_color === Dvonn.Color.BLACK ? 'black' : 'white') + ' dvonn piece at ' + _from.to_string();
        } else if (_type === Dvonn.Phase.PUT_PIECE) {
            return 'put ' + (_color === Dvonn.Color.BLACK ? 'black' : 'white') + ' piece at ' + _from.to_string();
        } else if (_type === Dvonn.Phase.MOVE_STACK) {
            var str = 'move stack from ' + _from.to_string() + ' to ' + _to.to_string();

            if (_list.length > 0) {
                str += ' and remove pieces at ( '
                for (var i = 0; i < _list.length; ++i) {
                    str += _list[i].to_string() + ' ';
                }
                str += ')';
            }
            return str;
        }
    };

    this.type = function () {
        return _type;
    };

    init(t, c, f, to, l);
};

Dvonn.Engine = function (t, c) {

// public methods
    this.can_move = function (coordinates) {
        var intersection = intersections[coordinates.hash()];
        var size = intersection.size();
        var direction = Dvonn.Direction.NORTH_WEST;
        var stop = false;
        var found = false;

        while (!stop && !found) {
            var neighbor = coordinates.move(size, direction);

            if (neighbor.is_valid()) {
                found = intersections[neighbor.hash()].state() === Dvonn.State.NO_VACANT;
            } else {
                found = true;
            }
            if (direction === Dvonn.Direction.WEST) {
                stop = true;
            } else {
                direction = next_direction(direction);
            }
        }
        return found;
    };

    this.change_color = function () {
        if (phase === Dvonn.Phase.MOVE_STACK) {
            if ((color === Dvonn.Color.BLACK && this.get_possible_moving_stacks(Dvonn.Color.WHITE).length > 0) ||
                (color === Dvonn.Color.WHITE && this.get_possible_moving_stacks(Dvonn.Color.BLACK).length > 0)) {
                color = this.next_color(color);
            }
        } else {
            color = this.next_color(color);
        }
    };

    this.clone = function () {
        var o = new Dvonn.Engine(type, color);

        o.set(phase, state, intersections, placedDvonnPieceNumber, placedPieceNumber);
        return o;
    };

    this.current_color = function () {
        return color;
    };

    this.current_color_string = function () {
        return color === Dvonn.Color.BLACK ? 'black' : 'white';
    };

    this.exist_intersection = function (letter, number) {
        var coordinates = new Dvonn.Coordinates(letter, number);

        if (coordinates.is_valid()) {
            return intersections[coordinates.hash()] != null;
        } else {
            return false;
        }
    };

    this.get_free_intersections = function () {
        var list = [];

        for (var index in intersections) {
            var intersection = intersections[index];

            if (intersection.state() === Dvonn.State.VACANT) {
                list.push(intersection.coordinates());
            }
        }
        return list;
    };

    this.get_intersection = function (letter, number) {
        return intersections[(new Dvonn.Coordinates(letter, number)).hash()];
    };

    this.get_intersections = function () {
        return intersections;
    };

    /*    this.get_possible_move_list = function () {
     // TODO
     };

     this.get_possible_move_number = function (list) {
     // TODO
     }; */

    this.get_possible_moving_stacks = function (color) {
        var list = [];

        for (var index in intersections) {
            var intersection = intersections[index];

            if (intersection.state() === Dvonn.State.NO_VACANT && intersection.color() === color) {
                if (!(intersection.size() === 1 && intersection.dvonn())) {
                    if (this.can_move(intersection.coordinates()) &&
                        this.get_stack_possible_move(intersection.coordinates()).length > 0) {
                        list.push(intersection.coordinates());
                    }
                }
            }
        }
        return list;
    };

    this.get_stack_possible_move = function (origin) {
        if (this.can_move(origin)) {
            var list = [];
            var intersection = intersections[origin.hash()];
            var size = intersection.size();
            var direction = Dvonn.Direction.NORTH_WEST;
            var stop = false;

            while (!stop) {
                var destination = origin.move(size, direction);

                if (destination.is_valid()) {
                    var destination_it = intersections[destination.hash()];

                    if (destination_it.state() === Dvonn.State.NO_VACANT) {
                        list.push(destination);
                    }
                }
                if (direction === Dvonn.Direction.WEST) {
                    stop = true;
                } else {
                    direction = next_direction(direction);
                }
            }
            return list;
        }
    };

    this.get_state = function () {
        return state;
    };

    this.is_finished = function () {
        return phase === Dvonn.Phase.MOVE_STACK &&
            this.get_possible_moving_stacks(Dvonn.Color.WHITE).length === 0 &&
            this.get_possible_moving_stacks(Dvonn.Color.BLACK).length === 0;
    };

    this.move = function (move) {
        if (move.type() === Dvonn.Phase.PUT_DVONN_PIECE) {
            this.put_dvonn_piece(move.from());
        } else if (move.type() === Dvonn.Phase.PUT_PIECE) {
            this.put_piece(move.from(), color);
        } else if (move.type() === Dvonn.Phase.MOVE_STACK) {
            this.move_stack(move.from(), move.to());
            if (move.list().length > 0) {
                this.remove_stacks(move.list());
            }
        }
    };

    this.move_no_stack = function () {
        this.change_color();
    };

    this.move_stack = function (origin, destination) {
        var origin_it = intersections[origin.hash()];
        var destination_it = intersections[destination.hash()];

        origin_it.move_stack_to(destination_it);
        this.change_color();
    };

    this.next_color = function (c) {
        return c === Dvonn.Color.BLACK ? Dvonn.Color.WHITE : Dvonn.Color.BLACK;
    };

    this.put_dvonn_piece = function (coordinates) {
        if (coordinates.hash() in intersections) {
            var intersection = intersections[coordinates.hash()];

            if (intersection.state() === Dvonn.State.VACANT) {
                intersection.put_piece(Dvonn.Color.RED);
                placedDvonnPieceNumber++;
                if (placedDvonnPieceNumber === 3) {
                    phase = Dvonn.Phase.PUT_PIECE;
                }
            }
        }
        this.change_color();
    };

    this.phase = function () {
        return phase;
    };

    this.put_piece = function (coordinates, color) {
        if (coordinates.hash() in intersections) {
            if (intersections[coordinates.hash()].state() === Dvonn.State.VACANT) {
                intersections[coordinates.hash()].put_piece(color);
                placedPieceNumber++;
                if (placedPieceNumber === 46) {
                    phase = Dvonn.Phase.MOVE_STACK;
                } else {
                    this.change_color();
                }
            }
        }
    };

    this.remove_isolated_stacks = function () {
        var list = [];

        for (var index in intersections) {
            var intersection = intersections[index];

            if (intersection.state() === Dvonn.State.NO_VACANT && !intersection.dvonn()) {
                if (!is_connected(intersection.coordinates())) {
                    list.push(intersection.coordinates());
                }
            }
        }
        return list;
    };

    this.remove_stacks = function (list) {
        for (var index in list) {
            intersections[list[index].hash()].remove_stack();
        }
    };

    /*    this.remove_first_possible_move = function (list) {
     // TODO
     };

     this.select_move = function (list, index) {
     // TODO
     }; */

    this.set = function (_phase, _state, _intersections, _placedDvonnPieceNumber, _placedPieceNumber) {
        var index;

        for (index in _intersections) {
            intersections[index] = _intersections[index].clone();
        }

        phase = _phase;
        state = _state;
        placedDvonnPieceNumber = _placedDvonnPieceNumber;
        placedPieceNumber = _placedPieceNumber;
    };

    this.verify_moving = function (origin, destination) {
        if (this.can_move(origin)) {
            var list = this.get_stack_possible_move(origin);

            for (var index in list) {
                if (list[index].hash() === destination.hash()) {
                    return true;
                }
            }
            return false;
        } else {
            return false;
        }
    };

    this.winner_is = function () {
        if (this.is_finished()) {
            return color;
        } else {
            return false;
        }
    };

// private methods
    var get_max_stack_size = function (color) {
        var max = 0;

        for (var index in intersections) {
            var intersection = intersections[index];

            if (intersection.state() === Dvonn.State.NO_VACANT && intersection.color() === color) {
                if (intersection.size() > max) {
                    max = intersection.size();
                }
            }
        }
        return max;
    };

    var is_connected = function (coordinates) {
        var checking_list = [];
        var checked_list = [];
        var found = false;

        checking_list.push(coordinates);
        while (checking_list.length > 0 && !found) {
            var current_coordinates = checking_list[checking_list.length - 1];
            var intersection = intersections[current_coordinates.hash()];

            checked_list.push(current_coordinates);
            checking_list.pop();
            if (intersection.dvonn()) {
                found = true;
            } else {
                var direction = Dvonn.Direction.NORTH_WEST;
                var stop = false;

                while (!stop) {
                    var destination = current_coordinates.move(1, direction);

                    if (destination.is_valid()) {
                        var destination_it = intersections[destination.hash()];

                        if (destination_it.state() === Dvonn.State.NO_VACANT) {
                            var found2 = false;

                            for (var index in checked_list) {
                                if (checked_list[index].hash() === destination.hash()) {
                                    found2 = true;
                                    break;
                                }
                            }
                            if (!found2) {
                                checking_list.push(destination);
                            }
                        }
                    }
                    if (direction === Dvonn.Direction.WEST) {
                        stop = true;
                    } else {
                        direction = next_direction(direction);
                    }
                }
            }
        }
        return found;
    };

    var next_direction = function (direction) {
        if (direction === Dvonn.Direction.NORTH_WEST) {
            return Dvonn.Direction.NORTH_EAST;
        } else if (direction === Dvonn.Direction.NORTH_EAST) {
            return Dvonn.Direction.EAST;
        } else if (direction === Dvonn.Direction.EAST) {
            return Dvonn.Direction.SOUTH_EAST;
        } else if (direction === Dvonn.Direction.SOUTH_EAST) {
            return Dvonn.Direction.SOUTH_WEST;
        } else if (direction === Dvonn.Direction.SOUTH_WEST) {
            return Dvonn.Direction.WEST;
        } else if (direction === Dvonn.Direction.WEST) {
            return Dvonn.Direction.NORTH_WEST;
        }
    };

    var init = function (t, c) {
        type = t;
        color = c;
        placedDvonnPieceNumber = 0;
        placedPieceNumber = 0;
        phase = Dvonn.Phase.PUT_DVONN_PIECE;
        intersections = [];
        for (var i = 0; i < Dvonn.letters.length; ++i) {
            var l = Dvonn.letters[i];

            for (var n = Dvonn.begin_number[l.charCodeAt(0) - 'A'.charCodeAt(0)];
                 n <= Dvonn.end_number[l.charCodeAt(0) - 'A'.charCodeAt(0)]; ++n) {
                var coordinates = new Dvonn.Coordinates(l, n);

                intersections[coordinates.hash()] = new Dvonn.Intersection(coordinates);
            }
        }
    };

// private attributes
    var type;
    var color;
    var intersections;

    var phase;
    var state;
    var placedDvonnPieceNumber;
    var placedPieceNumber;

    init(t, c);
};
