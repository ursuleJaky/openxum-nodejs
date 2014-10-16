'use strict';

Pentago.Color = { BLACK: 0, WHITE: 1 };
Pentago.State = { EMPTY: -1, BLACK: 0, WHITE: 1 };
Pentago.Board = { TOP_LEFT: 0, TOP_RIGHT: 1, BOTTOM_RIGHT: 2, BOTTOM_LEFT: 3 };
Pentago.Direction = { CLOCKWISE: 0, ANTI_CLOCKWISE: 1 };
Pentago.Phase = { PUT_MARBLE: 0, ROTATE: 1 };
Pentago.MoveType = { PUT_MARBLE: 0, ROTATE: 1 };

Pentago.BoardMap = {
    'tl': Pentago.Board.TOP_LEFT,
    'tr': Pentago.Board.TOP_RIGHT,
    'bl': Pentago.Board.BOTTOM_LEFT,
    'br': Pentago.Board.BOTTOM_RIGHT
};
Pentago.Pivot = [
    { l: 0, c: 0 },
    { l: 0, c: 3 },
    { l: 3, c: 3 },
    { l: 3, c: 0 }
];

Pentago.Coordinates = function (l, n) {
// private attributes
    var _letter = l;
    var _number = n;

// public methods
    this.clone = function () {
        return new Pentago.Coordinates(l, n);
    };

    this.hash = function () {
        return (_letter.charCodeAt(0) - 'a'.charCodeAt(0)) + (_number - 1) * 6;
    };

    this.is_valid = function () {
        var l = _letter.charCodeAt(0) - 'a'.charCodeAt(0) + 1;

        return (l >= 1 && l <= 6 && _number >= 1 && _number <= 6);
    };

    this.letter = function () {
        return _letter;
    };

    this.number = function () {
        return _number;
    };

    this.to_string = function () {
        return _letter + _number;
    };
};

Pentago.Move = function (t, c, p1, p2) {
// private attributes
    var _type;
    var _color;
    var _coordinates;
    var _board;
    var _direction;

// private methods
    var init = function (t, c, p1, p2) {
        _type = t;
        _color = c;
        if (_type === Pentago.MoveType.PUT_MARBLE) {
            _coordinates = p1;
        } else if (_type === Pentago.MoveType.ROTATE) {
            _board = p1;
            _direction = p2;
        }
    };

// public methods
    this.board = function () {
        return _board;
    };

    this.color = function () {
        return _color;
    };

    this.direction = function () {
        return _direction;
    };

    this.get = function () {
        if (_type === Pentago.MoveType.PUT_MARBLE) {
            return 'P' + (_color === Pentago.Color.BLACK ? "B" : "W") + _coordinates.to_string();
        } else if (_type === Pentago.MoveType.ROTATE) {
            return 'R' + (_color === Pentago.Color.BLACK ? "B" : "W") +
                (_board === Pentago.Board.BOTTOM_LEFT ? 'bl' : _board === Pentago.Board.BOTTOM_RIGHT ? 'br' : _board === Pentago.Board.TOP_LEFT ? 'tl' : 'tr')+
                (_direction === Pentago.Direction.CLOCKWISE ? 'c' : 'a');
        }
    };

    this.coordinates = function () {
        return _coordinates;
    };

    this.parse = function (str) {
        var type = str.charAt(0);

        if (type === 'P') {
            _type = Pentago.MoveType.PUT_MARBLE;
        } else if (type === 'R') {
            _type = Pentago.MoveType.ROTATE;
        }
        _color = str.charAt(1) === 'B' ? Pentago.Color.BLACK : Pentago.Color.WHITE;
        if (_type === Pentago.MoveType.PUT_MARBLE) {
            _coordinates = new Pentago.Coordinates(str.charAt(2), parseInt(str.charAt(3)));
        } else if (_type === Pentago.MoveType.ROTATE) {
            var board = str.substring(2, 4);

            if (board === 'bl') {
                _board = Pentago.Board.BOTTOM_LEFT;
            } else if (board === 'br') {
                _board = Pentago.Board.BOTTOM_RIGHT;
            }  else if (board === 'tl') {
                _board = Pentago.Board.TOP_LEFT;
            } else { // board === 'tr'
                _board = Pentago.Board.TOP_RIGHT;
            }
            if (str.charAt(4) === 'c') {
                _direction = Pentago.Direction.CLOCKWISE;
            } else {
                _direction = Pentago.Direction.ANTI_CLOCKWISE;
            }
        }
    };

    this.to_object = function () {
        return { type: _type, color: _color, coordinates: _coordinates, board: _board, direction: _direction };
    };

    this.to_string = function () {
        if (_type === Pentago.MoveType.PUT_MARBLE) {
            return 'put ' + (_color === Pentago.Color.BLACK ? "black" : "white") + ' marble to ' + _coordinates.to_string();
        } else if (_type === Pentago.MoveType.ROTATE) {
            return 'rotate ' +
                (_board === Pentago.Board.BOTTOM_LEFT ? 'bottom left' : _board === Pentago.Board.BOTTOM_RIGHT ? 'bottom right' : _board === Pentago.Board.TOP_LEFT ? 'top left' : 'top right') +
                    ' board with ' +
                (_direction === Pentago.Direction.CLOCKWISE ? 'clockwise' : 'anticlockwise') + ' direction';
        }
    };

    this.type = function () {
        return _type;
    };

    init(t, c, p1, p2);
};

Pentago.Engine = function (t, c) {
// private attributes
    var type;
    var current_color;

    var marble_number;
    var state;
    var phase;

// private methods
    var change_color = function () {
        current_color = current_color === Pentago.Color.BLACK ? Pentago.Color.WHITE : Pentago.Color.BLACK;
    };

    var build_alignment = function (c, l, a, s) {
        if (state[c][l] === s) {
            if (a.n > 0) {
                ++a.n;
            } else {
                a.n = 1;
            }
        } else {
            a.found = a.n >= 5;
            a.n = 0;
        }
        return a;
    };

    var check_left_right_diagonal_alignment = function (s) {
        var k, l, c;
        var a = { n: 0, found: false };

        for (k = -1; k < 2; ++k) {
            for (l = k < 0 ? 1 : 0, c = k > 0 ? 1 : 0; l < 6 && c < 6 && !a.found; ++l, ++c) {
                a = build_alignment(c, l, a, s);
            }
            a.n = 0;
        }
        return a.found;
    };

    var check_right_left_diagonal_alignment = function (s) {
        var k, l, c;
        var a = { n: 0, found: false };

        for (k = -1; k < 2; ++k) {
            for (l = k < 0 ? 1 : 0, c = k > 0 ? 4 : 5; l >= 0 && c >= 0 && !a.found; --l, --c) {
                a = build_alignment(c, l, a, s);
            }
            a.n = 0;
        }
        return a.found;
    };

    var check_diagonal_alignment = function (s) {
        return check_left_right_diagonal_alignment(s) || check_right_left_diagonal_alignment(s);
    };

    var check_horizontal_alignment = function (s) {
        var l, c;
        var a = { n: 0, found: false};

        for (l = 0; l < 6 && !a.found; ++l) {
            for (c = 0; c < 6 && !a.found; ++c) {
                a = build_alignment(c, l, a, s);
            }
            a.n = 0;
        }
        return a.found;
    };

    var check_vertical_alignment = function (s) {
        var l, c;
        var a = { n: 0, found: false};

        for (c = 0; c < 6 && !a.found; ++c) {
            for (l = 0; l < 6 && !a.found; ++l) {
                a = build_alignment(c, l, a, s);
            }
            a.n = 0;
        }
        return a.found;
    };

    var check_alignment = function (color) {
        var s = color === Pentago.Color.BLACK ? Pentago.State.BLACK : Pentago.State.WHITE;

        if (!check_horizontal_alignment(s)) {
            if (!check_vertical_alignment(s)) {
                return check_diagonal_alignment(s);
            }
        }
        return true;
    };

    var copy_board = function (pivot, new_state) {
        var l, c;

        for (l = 0; l < 3; ++l) {
            for (c = 0; c < 3; ++c) {
                state[pivot.c + c][pivot.l + l] = new_state[c][l];
            }
        }
    };

    var get_pivot = function (board) {
        return Pentago.Pivot[board];
    };

    var init = function (t, c) {
        var l, c, column;

        type = t;
        current_color = c;
        marble_number = 0;
        phase = Pentago.Phase.PUT_MARBLE;
        state = [];
        for (c = 0; c < 6; ++c) {
            column = [];
            for (l = 0; l < 6; ++l) {
                column.push(Pentago.State.EMPTY);
            }
            state.push(column);
        }
    };

    var init_empty_board = function () {
        return [
            [ Pentago.State.EMPTY, Pentago.State.EMPTY, Pentago.State.EMPTY ],
            [ Pentago.State.EMPTY, Pentago.State.EMPTY, Pentago.State.EMPTY ],
            [ Pentago.State.EMPTY, Pentago.State.EMPTY, Pentago.State.EMPTY ]
        ];
    };

    var parse_board = function (board) {
        return Pentago.BoardMap[board];
    };

    var parse_coordinates = function (coordinates) {
        return { c: coordinates.charCodeAt(0) - 'a'.charCodeAt(0),
            l: coordinates.charCodeAt(1) - '1'.charCodeAt(0) };
    };

    var parse_direction = function (direction) {
        return direction === 'c' ? Pentago.Direction.CLOCKWISE : Pentago.Direction.ANTI_CLOCKWISE;
    };

    var rotate_clockwise = function (pivot) {
        var index, new_state = init_empty_board();

        for (index = 0; index < 3; ++index) {
            new_state[0][index] = state[pivot.c + index][pivot.l + 2];
            new_state[1][index] = state[pivot.c + index][pivot.l + 1];
            new_state[2][index] = state[pivot.c + index][pivot.l];
        }
        return new_state;
    };

    var rotate_anticlockwise = function (pivot) {
        var index, new_state = init_empty_board();

        for (index = 0; index < 3; ++index) {
            new_state[0][2 - index] = state[pivot.c + index][pivot.l];
            new_state[1][2 - index] = state[pivot.c + index][pivot.l + 1];
            new_state[2][2 - index] = state[pivot.c + index][pivot.l + 2];
        }
        return new_state;
    };

// public methods
    this.clone = function () {
        var o = new Pentago.Engine(type, current_color);

        o.set(marble_number, state, phase);
        return o;
    };

    this.current_color = function () {
        return current_color;
    };

    this.current_color_string = function () {
        return current_color === Pentago.Color.BLACK ? 'black' : 'white';
    };

    this.display = function () {
        var l, c, str = '\n';

        for (l = 0; l < 6; ++l) {
            for (c = 0; c < 6; ++c) {
                if (state[c][l] === Pentago.State.EMPTY) {
                    str += 'E';
                } else if (state[c][l] === Pentago.State.BLACK) {
                    str += 'B';
                } else {
                    str += 'W';
                }
            }
            str += '\n';
        }
        console.log(str);
    };

    this.get_free_cells = function () {
        var list = [];
        var l, c;

        for (l = 0; l < 6; ++l) {
            for (c = 0; c < 6; ++c) {
                if (state[c][l] === Pentago.State.EMPTY) {
                    list.push(new Pentago.Coordinates(String.fromCharCode('a'.charCodeAt(0) + c), l + 1));
                }
            }
        }
        return list;
    };

    this.get_marble_number = function () {
        return marble_number;
    };

    /*    this.get_possible_move_list = function () {
     // TODO
     };

     this.get_possible_move_number = function (list) {
     // TODO
     }; */

    this.get_state = function (coordinates) {
        var c = parse_coordinates(coordinates);

        return state[c.c][c.l];
    };

    this.is_finished = function () {
        return check_alignment(Pentago.Color.BLACK) || check_alignment(Pentago.Color.WHITE) || marble_number === 36;
    };

    this.move = function (move) {
        if (move.type() === Pentago.MoveType.PUT_MARBLE) {
            this.put_marble(move.coordinates().to_string(), move.color());
        } else if (move.type() === Pentago.MoveType.ROTATE) {
            this.rotate(move.board(), move.direction());
        }
    };

    this.phase = function () {
        return phase;
    };

    this.play = function (str) {
        var index, list = str.split(';');
        var coordinates, direction, board;

        for (index = 0; index < list.length; ++index) {
            coordinates = list[index].substring(0, 2);
            this.put_marble(coordinates, current_color);
            if (list[index].length > 2) {
                direction = parse_direction(list[index].charAt(2));
                board = parse_board(list[index].substring(3, 5));
                this.rotate(board, direction);
            }
        }
    };

    this.put_marble = function (coordinates, color) {
        var c = parse_coordinates(coordinates);

        if (state[c.c][c.l] === Pentago.State.EMPTY) {
            state[c.c][c.l] = color === Pentago.Color.BLACK ? Pentago.State.BLACK : Pentago.State.WHITE;
            marble_number++;
            phase = Pentago.Phase.ROTATE;
        } else {
            throw new Error("InvalidMove");
        }
    };

    /*    this.remove_first_possible_move = function (list) {
     // TODO
     };

     this.select_move = function (list, index) {
     // TODO
     }; */

    this.rotate = function (board, direction) {
        var pivot = get_pivot(board);

        if (direction === Pentago.Direction.CLOCKWISE) {
            copy_board(pivot, rotate_clockwise(pivot));
        } else {
            copy_board(pivot, rotate_anticlockwise(pivot));
        }
        phase = Pentago.Phase.PUT_MARBLE;
        change_color();
    };

    this.set = function (_marble_number, _state, _phase) {
        var l, c, column;

        marble_number = _marble_number;
        phase = _phase;

        state = [];
        for (c = 0; c < 6; ++c) {
            column = [];
            for (l = 0; l < 6; ++l) {
                column.push(_state[c][l]);
            }
            state.push(column);
        }
    };

    this.winner_is = function () {
        return check_alignment(Pentago.Color.BLACK) ? Pentago.Color.BLACK : (check_alignment(Pentago.Color.WHITE) ? Pentago.Color.WHITE : null);
    };

    init(t, c);
};
