"use strict";

// grid constants definition
Zertz.begin_number = [ 1, 1, 1, 1, 2, 3, 4 ];
Zertz.end_number = [ 4, 5, 6, 7, 7, 7, 7 ];

// enums definition
Zertz.GameType = { BLITZ: 0, REGULAR: 1 };
Zertz.Color = { NONE: -1, ONE: 0, TWO: 1 };
Zertz.MarbleColor = { NONE: -1, BLACK: 0, WHITE: 1, GREY: 2 };
Zertz.Phase = { SELECT_MARBLE_IN_POOL: 0, PUT_MARBLE: 1, REMOVE_RING: 2, CAPTURE: 3 };
Zertz.State = { VACANT: 0, BLACK_MARBLE: 1, WHITE_MARBLE: 2, GREY_MARBLE: 3, EMPTY: 4 };
Zertz.Direction = { NORTH_WEST: 0, NORTH: 1, NORTH_EAST: 2, SOUTH_EAST: 3, SOUTH: 4, SOUTH_WEST: 5 };
Zertz.letters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G' ];
Zertz.MoveType = { PUT_MARBLE: 0, REMOVE_RING: 1, CAPTURE: 2 };

Zertz.Coordinates = function (l, n) {

// private attributes
    var letter = l;
    var number = n;

// public methods
    this.hash = function () {
        return (letter.charCodeAt(0) - 'A'.charCodeAt(0)) + (number - 1) * 7;
    };

    this.is_valid = function () {
        return (letter === 'A' && number >= 1 && number <= 4) ||
            (letter === 'B' && number >= 1 && number <= 5) ||
            (letter === 'C' && number >= 1 && number <= 6) ||
            (letter === 'D' && number >= 1 && number <= 7) ||
            (letter === 'E' && number >= 2 && number <= 7) ||
            (letter === 'F' && number >= 3 && number <= 7) ||
            (letter === 'G' && number >= 4 && number <= 7);
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
};

Zertz.Intersection = function (c) {
// private attributes
    var coordinates;
    var state;

// public methods
    this.color = function () {
        if (state === Zertz.State.VACANT || state === Zertz.State.EMPTY) {
            return Zertz.MarbleColor.NONE;
        } else if (state === Zertz.State.BLACK_MARBLE) {
            return Zertz.MarbleColor.BLACK;
        } else if (state === Zertz.State.GREY_MARBLE) {
            return Zertz.MarbleColor.GREY;
        } else {
            return Zertz.MarbleColor.WHITE;
        }
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

    this.marble_is_present = function () {
        return state === Zertz.State.BLACK_MARBLE || state === Zertz.State.WHITE_MARBLE || state === Zertz.State.GREY_MARBLE;
    };

    this.number = function () {
        return coordinates.number();
    };

    this.put_marble = function (color) {
        if (color === Zertz.MarbleColor.BLACK) {
            state = Zertz.State.BLACK_MARBLE;
        } else if (color === Zertz.MarbleColor.WHITE) {
            state = Zertz.State.WHITE_MARBLE;
        } else if (color === Zertz.MarbleColor.GREY) {
            state = Zertz.State.GREY_MARBLE;
        }
    };

    this.remove_marble = function () {
        state = Zertz.State.VACANT;
    };

    this.remove_ring = function () {
        state = Zertz.State.EMPTY;
    };

    this.state = function () {
        return state;
    };

// private methods
    var init = function (c) {
        coordinates = c;
        state = Zertz.State.VACANT;
    };

    init(c);
};

Zertz.Move = function (t, c, to, mc, f) {

// private attributes
    var _type;
    var _color;
    var _to;
    var _marble_color;
    var _from;

// private methods
    var init = function (t, c, to, mc, f) {
        _type = t;
        _color = c;
        _to = to;
        _marble_color = mc;
        _from = f;
    };

// public methods
    this.color = function () {
        return _color;
    };

    this.from = function () {
        return _from;
    };

    this.get = function () {
        var str;

        if (_type === Zertz.MoveType.PUT_MARBLE) {
            str = 'Pm' + (_color === Zertz.Color.ONE ? '1' : '2') +
                _to.to_string() +
                (_marble_color === Zertz.MarbleColor.BLACK ? 'B' :
                        _marble_color === Zertz.MarbleColor.WHITE ? 'W' : 'G');
        } else if (_type === Zertz.MoveType.REMOVE_RING) {
            str = 'Rr' + (_color === Zertz.Color.ONE ? '1' : '2') + _to.to_string();
        } else { // _type === Zertz.MoveType.CAPTURE
            str = 'Ca' + (_color === Zertz.Color.ONE ? '1' : '2') + _from.to_string() + _to.to_string();
        }
        return str;
    };

    this.marble_color = function () {
        return _marble_color;
    };

    this.parse = function (str) {
        var type = str.substring(0, 2);

        if (type === 'Pm') {
            _type = Zertz.MoveType.PUT_MARBLE;
            _to = new Zertz.Coordinates(str.charAt(3), parseInt(str.charAt(4)));
            _marble_color = str.charAt(5) === 'B' ? Zertz.MarbleColor.BLACK :
                    str.charAt(5) === 'W' ? Zertz.MarbleColor.WHITE : Zertz.MarbleColor.GREY;
        } else if (type === 'Rr') {
            _type = Zertz.MoveType.REMOVE_RING;
            _to = new Zertz.Coordinates(str.charAt(3), parseInt(str.charAt(4)));
        } else if (type === 'Ca') {
            _type = Zertz.MoveType.CAPTURE;
            _from = new Zertz.Coordinates(str.charAt(3), parseInt(str.charAt(4)));
            _to = new Zertz.Coordinates(str.charAt(5), parseInt(str.charAt(6)));
        }
        _color = str.charAt(2) === '1' ? Zertz.Color.ONE : Zertz.Color.TWO;
    };

    this.to = function () {
        return _to;
    };

    this.type = function () {
        return _type;
    };

    init(t, c, to, mc, f);
};

Zertz.Engine = function (t, c) {

// private attributes
    var type;
    var color;
    var intersections;

    var state;
    var phase;

    var blackMarbleNumber;
    var greyMarbleNumber;
    var whiteMarbleNumber;
    var capturedBlackMarbleNumber;
    var capturedGreyMarbleNumber;
    var capturedWhiteMarbleNumber;

    var selected_marble_in_pool;

// private methods
    var belong_to = function (element, list) {
        for (var index = 0; index < list.length; ++index) {
            if (list[index].coordinates().hash() === element.coordinates().hash()) {
                return true;
            }
        }
        return false;
    };

    var belong_to2 = function (element, list) {
        for (var index = 0; index < list.length; ++index) {
            if (list[index].hash() === element.hash()) {
                return true;
            }
        }
        return false;
    };

    var capture = function (intersection, player) {
        if (intersection.state() === Zertz.State.BLACK_MARBLE) {
            ++capturedBlackMarbleNumber[player];
        } else if (intersection.state() === Zertz.State.GREY_MARBLE) {
            ++capturedGreyMarbleNumber[player];
        } else {
            ++capturedWhiteMarbleNumber[player];
        }
        intersection.remove_marble();
    };

    var next_color = function (c) {
        return c === Zertz.Color.ONE ? Zertz.Color.TWO : Zertz.Color.ONE;
    };

    var change_color = function () {
        color = next_color(color);
    };

    var capture_marble_and_ring = function (captured, player) {
        for (var index = 0; index < captured.length; ++index) {
            var intersection = intersections[captured[index].hash()];

            capture(intersection, player);
            intersection.remove_ring();
        }
        change_color();
    };

    var get_destination = function (origin, captured) {
        var delta_letter = captured.letter().charCodeAt(0) - origin.letter().charCodeAt(0);
        var delta_number = captured.number() - origin.number();

        return new Zertz.Coordinates(String.fromCharCode(captured.letter().charCodeAt(0) + delta_letter), captured.number() + delta_number);
    };

    var get_intersection = function (letter, number) {
        var coordinates = new Zertz.Coordinates(letter, number);

        if (coordinates.is_valid()) {
            return intersections[coordinates.hash()];
        } else {
            return null;
        }
    };

    var is_isolated_marble = function (intersection) {
        if (intersection.marble_is_present()) {
            var list = [];
            var visited = [];
            var stop = false;

            list.push(intersection);
            while (list.length > 0 && !stop) {
                var current = list[0];
                var letter = current.letter();
                var number = current.number();
                var N = get_intersection(letter, number + 1);
                var NE = get_intersection(String.fromCharCode(letter.charCodeAt(0) + 1), number + 1);
                var SE = get_intersection(String.fromCharCode(letter.charCodeAt(0) + 1), number);
                var S = get_intersection(letter, number - 1);
                var SO = get_intersection(String.fromCharCode(letter.charCodeAt(0) - 1), number - 1);
                var NO = get_intersection(String.fromCharCode(letter.charCodeAt(0) - 1), number);

                visited.push(current);
                list.pop();
                if (N && N.state() === Zertz.State.VACANT) {
                    stop = true;
                    break;
                } else if (N && N.state() !== Zertz.State.EMPTY) {
                    if (!belong_to(N, list) && !belong_to(N, visited)) {
                        list.push(N);
                    }
                }
                if (NE && NE.state() === Zertz.State.VACANT) {
                    stop = true;
                    break;
                } else if (NE && NE.state() !== Zertz.State.EMPTY) {
                    if (!belong_to(NE, list) && !belong_to(NE, visited)) {
                        list.push(NE);
                    }
                }
                if (SE && SE.state() === Zertz.State.VACANT) {
                    stop = true;
                    break;
                } else if (SE && SE.state() !== Zertz.State.EMPTY) {
                    if (!belong_to(SE, list) && !belong_to(SE, visited)) {
                        list.push(SE);
                    }
                }
                if (S && S.state() === Zertz.State.VACANT) {
                    stop = true;
                    break;
                } else if (S && S.state() !== Zertz.State.EMPTY) {
                    if (!belong_to(S, list) && !belong_to(S, visited)) {
                        list.push(S);
                    }
                }
                if (SO && SO.state() === Zertz.State.VACANT) {
                    stop = true;
                    break;
                } else if (SO && SO.state() !== Zertz.State.EMPTY) {
                    if (!belong_to(SO, list) && !belong_to(SO, visited)) {
                        list.push(SO);
                    }
                }
                if (NO && NO.state() === Zertz.State.VACANT) {
                    stop = true;
                    break;
                } else if (NO && NO.state() !== Zertz.State.EMPTY) {
                    if (!belong_to(NO, list) && !belong_to(NO, visited)) {
                        list.push(NO);
                    }
                }
            }
            return !stop;
        } else {
            return false;
        }
    };

    var get_isolated_marbles = function () {
        var list = [];

        for (var index in intersections) {
            var intersection = intersections[index];

            if (is_isolated_marble(intersection)) {
                list.push(intersection.coordinates());
            }
        }
        return list;
    };

    var init = function (t, c) {
        type = t;
        color = c;
        phase = Zertz.Phase.SELECT_MARBLE_IN_POOL;
        blackMarbleNumber = 10;
        greyMarbleNumber = 8;
        whiteMarbleNumber = 6;
        capturedBlackMarbleNumber = [ 0, 0 ];
        capturedGreyMarbleNumber = [ 0, 0 ];
        capturedWhiteMarbleNumber = [ 0, 0 ];

        intersections = [];
        for (var i = 0; i < Zertz.letters.length; ++i) {
            var l = Zertz.letters[i];

            for (var n = Zertz.begin_number[l.charCodeAt(0) - 'A'.charCodeAt(0)];
                 n <= Zertz.end_number[l.charCodeAt(0) - 'A'.charCodeAt(0)]; ++n) {
                var coordinates = new Zertz.Coordinates(l, n);

                intersections[coordinates.hash()] = new Zertz.Intersection(coordinates);
            }
        }
    };

    var is_finished = function (player) {
        if (type === Zertz.GameType.BLITZ) {
            if (player === Zertz.Color.ONE) {
                return (capturedBlackMarbleNumber[0] === 2 &&
                    capturedGreyMarbleNumber[0] === 2 &&
                    capturedWhiteMarbleNumber[0] === 2) ||
                    (capturedBlackMarbleNumber[0] === 5 ||
                        capturedGreyMarbleNumber[0] === 4 ||
                        capturedWhiteMarbleNumber[0] === 3);
            } else {
                return (capturedBlackMarbleNumber[1] === 2 &&
                    capturedGreyMarbleNumber[1] === 2 &&
                    capturedWhiteMarbleNumber[1] === 2) ||
                    (capturedBlackMarbleNumber[1] === 5 ||
                        capturedGreyMarbleNumber[1] === 4 ||
                        capturedWhiteMarbleNumber[1] === 3);
            }
        } else { // type = Zertz.GameType.REGULAR
            if (player === Zertz.Color.ONE) {
                return (capturedBlackMarbleNumber[0] === 3 &&
                    capturedGreyMarbleNumber[0] === 3 &&
                    capturedWhiteMarbleNumber[0] === 3) ||
                    (capturedBlackMarbleNumber[0] === 6 ||
                        capturedGreyMarbleNumber[0] === 5 ||
                        capturedWhiteMarbleNumber[0] === 4);
            } else {
                return (capturedBlackMarbleNumber[1] === 3 &&
                    capturedGreyMarbleNumber[1] === 3 &&
                    capturedWhiteMarbleNumber[1] === 3) ||
                    (capturedBlackMarbleNumber[1] === 6 ||
                        capturedGreyMarbleNumber[1] === 5 ||
                        capturedWhiteMarbleNumber[1] === 4);
            }
        }
    };

    /*    var next_direction = function (direction) {
     if (direction === Zertz.Direction.NORTH_WEST) {
     return Zertz.Direction.NORTH;
     } else if (direction === Zertz.Direction.NORTH) {
     return Zertz.Direction.NORTH_EAST;
     } else if (direction === Zertz.Direction.NORTH_EAST) {
     return Zertz.Direction.SOUTH_EAST;
     } else if (direction === Zertz.Direction.SOUTH_EAST) {
     return Zertz.Direction.SOUTH;
     } else if (direction === Zertz.Direction.SOUTH) {
     return Zertz.Direction.SOUTH_WEST;
     } else if (direction === Zertz.Direction.SOUTH_WEST) {
     return Zertz.Direction.NORTH_WEST;
     }
     }; */

// public methods
    this.can_capture = function () {
        return this.get_can_capture_marbles().length > 0;
    };

    this.capture = function (origin, captured, player) {
        var destination = get_destination(origin, captured);
        var ito = intersections[origin.hash()];
        var itd = intersections[destination.hash()];
        var color = ito.color();

        ito.remove_marble();
        capture(intersections[captured.hash()], player);
        itd.put_marble(color);
        if (!this.is_possible_to_capture_with(itd)) {
            change_color();
            if (this.can_capture()) {
                phase = Zertz.Phase.CAPTURE;
            } else {
                phase = Zertz.Phase.SELECT_MARBLE_IN_POOL;
            }
        }
    };

    this.captured_marble_number = function (color, player) {
        if (color === Zertz.MarbleColor.BLACK) {
            return capturedBlackMarbleNumber[player];
        } else if (color === Zertz.MarbleColor.GREY) {
            return capturedGreyMarbleNumber[player];
        } else {
            return capturedWhiteMarbleNumber[player];
        }
    };

    this.current_color = function () {
        return color;
    };

    this.exist_intersection = function (letter, number) {
        var coordinates = new Zertz.Coordinates(letter, number);

        if (coordinates.is_valid()) {
            return intersections[coordinates.hash()] !== null;
        } else {
            return false;
        }
    };

    this.get_black_marble_number = function () {
        return blackMarbleNumber;
    };

    this.get_can_capture_marbles = function () {
        var list = [];

        for (var index in intersections) {
            var intersection = intersections[index];

            if (this.is_possible_to_capture_with(intersection)) {
                list.push(intersection.coordinates());
            }
        }
        return list;
    };

    this.get_captured_black_marble_number = function (color) {
        return capturedBlackMarbleNumber[color];
    };

    this.get_captured_grey_marble_number = function (color) {
        return capturedGreyMarbleNumber[color];
    };

    this.get_captured_white_marble_number = function (color) {
        return capturedWhiteMarbleNumber[color];
    };

    this.get_free_rings = function () {
        var list = [];

        for (var index in intersections) {
            var intersection = intersections[index];

            if (intersection.state() === Zertz.State.VACANT) {
                list.push(intersection.coordinates());
            }
        }
        return list;
    };

    this.get_grey_marble_number = function () {
        return greyMarbleNumber;
    };

    this.get_intersections = function () {
        return intersections;
    };

    this.get_intersection = function (letter, number) {
        return get_intersection(letter, number);
    };

    this.get_possible_move_list = function () {
        // TODO
    };

    this.get_possible_move_number = function(list) {
        // TODO
    };

    this.get_possible_capturing_marbles = function (coordinates) {
        var list = [];
        var intersection = intersections[coordinates.hash()];

        if (intersection.marble_is_present()) {
            var letter = intersection.letter();
            var number = intersection.number();

            // letter + number increase
            if (get_intersection(letter, number + 1) && get_intersection(letter, number + 2) && get_intersection(letter, number + 1).marble_is_present() && get_intersection(letter, number + 2).state() === Zertz.State.VACANT) {
                list.push(new Zertz.Coordinates(letter, number + 1));
            }

            // letter + number decrease
            if (get_intersection(letter, number - 1) && get_intersection(letter, number - 2) && get_intersection(letter, number - 1).marble_is_present() && get_intersection(letter, number - 2).state() === Zertz.State.VACANT) {
                list.push(new Zertz.Coordinates(letter, number - 1));
            }

            // letter increase + number
            if (get_intersection(String.fromCharCode(letter.charCodeAt(0) + 1), number) && get_intersection(String.fromCharCode(letter.charCodeAt(0) + 2), number) && get_intersection(String.fromCharCode(letter.charCodeAt(0) + 1), number).marble_is_present() && get_intersection(String.fromCharCode(letter.charCodeAt(0) + 2), number).state() === Zertz.State.VACANT) {
                list.push(new Zertz.Coordinates(String.fromCharCode(letter.charCodeAt(0) + 1), number));
            }

            // letter decrease + number
            if (get_intersection(String.fromCharCode(letter.charCodeAt(0) - 1), number) && get_intersection(String.fromCharCode(letter.charCodeAt(0) - 2), number) && get_intersection(String.fromCharCode(letter.charCodeAt(0) - 1), number).marble_is_present() && get_intersection(String.fromCharCode(letter.charCodeAt(0) - 2), number).state() === Zertz.State.VACANT) {
                list.push(new Zertz.Coordinates(String.fromCharCode(letter.charCodeAt(0) - 1), number));
            }

            // letter increase + number increase
            if (get_intersection(String.fromCharCode(letter.charCodeAt(0) + 1), number + 1) && get_intersection(String.fromCharCode(letter.charCodeAt(0) + 2), number + 2) && get_intersection(String.fromCharCode(letter.charCodeAt(0) + 1), number + 1).marble_is_present() && get_intersection(String.fromCharCode(letter.charCodeAt(0) + 2), number + 2).state() === Zertz.State.VACANT) {
                list.push(new Zertz.Coordinates(String.fromCharCode(letter.charCodeAt(0) + 1), number + 1));
            }

            // letter decrease + number decrease
            if (get_intersection(String.fromCharCode(letter.charCodeAt(0) - 1), number - 1) && get_intersection(String.fromCharCode(letter.charCodeAt(0) - 2), number - 2) && get_intersection(String.fromCharCode(letter.charCodeAt(0) - 1), number - 1).marble_is_present() && get_intersection(String.fromCharCode(letter.charCodeAt(0) - 2), number - 2).state() === Zertz.State.VACANT) {
                list.push(new Zertz.Coordinates(String.fromCharCode(letter.charCodeAt(0) - 1), number - 1));
            }
        }
        return list;
    };

    this.get_possible_removing_rings = function () {
        var list = [];

        for (var index in intersections) {
            var intersection = intersections[index];
            var neighbour = null;
            var next_neighbour;

            if (intersection.state() === Zertz.State.VACANT) {
                var letter = intersection.letter();
                var number = intersection.number();

                // letter + number increase
                neighbour = get_intersection(letter, number + 1);
                if (neighbour === null || (neighbour && neighbour.state() === Zertz.State.EMPTY)) {
                    next_neighbour = get_intersection(String.fromCharCode(letter.charCodeAt(0) + 1), number + 1);
                    if (next_neighbour === null || (next_neighbour && next_neighbour.state() === Zertz.State.EMPTY)) {
                        list.push(intersection.coordinates());
                    }
                }

                // letter + number decrease
                neighbour = get_intersection(letter, number - 1);
                if (neighbour === null || (neighbour && neighbour.state() === Zertz.State.EMPTY)) {
                    next_neighbour = get_intersection(String.fromCharCode(letter.charCodeAt(0) - 1), number - 1);
                    if (next_neighbour === null || (next_neighbour && next_neighbour.state() === Zertz.State.EMPTY)) {
                        list.push(intersection.coordinates());
                    }
                }

                // letter increase + number
                neighbour = get_intersection(String.fromCharCode(letter.charCodeAt(0) + 1), number);
                if (neighbour === null || (neighbour && neighbour.state() === Zertz.State.EMPTY)) {
                    next_neighbour = get_intersection(letter, number - 1);
                    if (next_neighbour === null || (next_neighbour && next_neighbour.state() === Zertz.State.EMPTY)) {
                        list.push(intersection.coordinates());
                    }
                }

                // letter decrease + number
                neighbour = get_intersection(String.fromCharCode(letter.charCodeAt(0) - 1), number);
                if (neighbour === null || (neighbour && neighbour.state() === Zertz.State.EMPTY)) {
                    next_neighbour = get_intersection(letter, number + 1);
                    if (next_neighbour === null || (next_neighbour && next_neighbour.state() === Zertz.State.EMPTY)) {
                        list.push(intersection.coordinates());
                    }
                }

                // letter increase + number increase
                neighbour = get_intersection(String.fromCharCode(letter.charCodeAt(0) + 1), number + 1);
                if (neighbour === null || (neighbour && neighbour.state() === Zertz.State.EMPTY)) {
                    next_neighbour = get_intersection(String.fromCharCode(letter.charCodeAt(0) + 1), number);
                    if (next_neighbour === null || (next_neighbour && next_neighbour.state() === Zertz.State.EMPTY)) {
                        list.push(intersection.coordinates());
                    }
                }

                // letter decrease + number decrease
                neighbour = get_intersection(String.fromCharCode(letter.charCodeAt(0) - 1), number - 1);
                if (neighbour === null || (neighbour && neighbour.state() === Zertz.State.EMPTY)) {
                    next_neighbour = get_intersection(String.fromCharCode(letter.charCodeAt(0) - 1), number);
                    if (next_neighbour === null || (next_neighbour && next_neighbour.state() === Zertz.State.EMPTY)) {
                        list.push(intersection.coordinates());
                    }
                }
            }
        }
        return list;
    };

    this.get_selected_marble_in_pool = function () {
        return color;
    };

    this.get_state = function () {
        return state;
    };

    this.get_white_marble_number = function () {
        return whiteMarbleNumber;
    };

    this.phase = function () {
        return phase;
    };

    this.is_finished = function () {
        return is_finished(Zertz.Color.ONE) || is_finished(Zertz.Color.TWO);
    };

    this.is_possible_capturing_marble_with = function (origin, capturing) {
        return belong_to2(capturing, this.get_possible_capturing_marbles(origin));
    };

    this.is_possible_capturing_marbles = function (coordinates) {
        return this.is_possible_to_capture_with(intersections[coordinates.hash()]);
    };

    this.is_possible_to_capture_with = function (intersection) {
        if (intersection.marble_is_present()) {
            var letter = intersection.letter();
            var number = intersection.number();

            // letter + number increase
            if (get_intersection(letter, number + 1) && get_intersection(letter, number + 2) && get_intersection(letter, number + 1).marble_is_present() && get_intersection(letter, number + 2).state() === Zertz.State.VACANT) {
                return true;
            }

            // letter + number decrease
            if (get_intersection(letter, number - 1) && get_intersection(letter, number - 2) && get_intersection(letter, number - 1).marble_is_present() && get_intersection(letter, number - 2).state() === Zertz.State.VACANT) {
                return true;
            }

            // letter increase + number
            if (get_intersection(String.fromCharCode(letter.charCodeAt(0) + 1), number) && get_intersection(String.fromCharCode(letter.charCodeAt(0) + 2), number) && get_intersection(String.fromCharCode(letter.charCodeAt(0) + 1), number).marble_is_present() && get_intersection(String.fromCharCode(letter.charCodeAt(0) + 2), number).state() === Zertz.State.VACANT) {
                return true;
            }

            // letter decrease + number
            if (get_intersection(String.fromCharCode(letter.charCodeAt(0) - 1), number) && get_intersection(String.fromCharCode(letter.charCodeAt(0) - 2), number) && get_intersection(String.fromCharCode(letter.charCodeAt(0) - 1), number).marble_is_present() && get_intersection(String.fromCharCode(letter.charCodeAt(0) - 2), number).state() === Zertz.State.VACANT) {
                return true;
            }

            // letter increase + number increase
            if (get_intersection(String.fromCharCode(letter.charCodeAt(0) + 1), number + 1) && get_intersection(String.fromCharCode(letter.charCodeAt(0) + 2), number + 2) && get_intersection(String.fromCharCode(letter.charCodeAt(0) + 1), number + 1).marble_is_present() && get_intersection(String.fromCharCode(letter.charCodeAt(0) + 2), number + 2).state() === Zertz.State.VACANT) {
                return true;
            }

            // letter decrease + number decrease
            if (get_intersection(String.fromCharCode(letter.charCodeAt(0) - 1), number - 1) && get_intersection(String.fromCharCode(letter.charCodeAt(0) - 2), number - 2) && get_intersection(String.fromCharCode(letter.charCodeAt(0) - 1), number - 1).marble_is_present() && get_intersection(String.fromCharCode(letter.charCodeAt(0) - 2), number - 2).state() === Zertz.State.VACANT) {
                return true;
            }
        }
    };

    this.move = function (move) {
        if (move.type() === Zertz.MoveType.PUT_MARBLE) {
            this.put_marble(move.to(), move.marble_color(), move.color());
        } else if (move.type() === Zertz.MoveType.REMOVE_RING) {
            this.remove_ring(move.to(), move.color());
        } else if (move.type() === Zertz.MoveType.CAPTURE) {
            this.capture(move.from(), move.to(), move.color());
        }
    };

    this.put_marble = function (coordinates, color) {
        var intersection = intersections[coordinates.hash()];

        intersection.put_marble(color);
        if (color === Zertz.MarbleColor.BLACK) {
            --blackMarbleNumber;
        } else if (color === Zertz.MarbleColor.GREY) {
            --greyMarbleNumber;
        } else {
            --whiteMarbleNumber;
        }
        phase = Zertz.Phase.REMOVE_RING;
    };

    this.remove_ring = function (coordinates, player) {
        var intersection = intersections[coordinates.hash()];

        intersection.remove_ring();

        var list = get_isolated_marbles();

        if (list.length > 0) {
            capture_marble_and_ring(list, player);
        }
        change_color();
        if (this.can_capture()) {
            phase = Zertz.Phase.CAPTURE;
        } else {
            phase = Zertz.Phase.SELECT_MARBLE_IN_POOL;
        }
    };

    this.select_marble_in_pool = function (color) {
        selected_marble_in_pool = color;
        phase = Zertz.Phase.PUT_MARBLE;
    };

    this.remove_first_possible_move = function(list) {
        // TODO
    };

    this.select_move = function (list, index) {
        // TODO
    };

    this.type = function () {
        return type;
    };

    this.verify_remove_ring = function (coordinates) {
        var list = this.get_possible_removing_rings();

        for (var index = 0; index < list.length; ++index) {
            if (list[index].hash() === coordinates.hash()) {
                return true;
            }
        }
        return false;
    };

    this.winner_is = function () {
        if (type === Zertz.GameType.BLITZ) {
            if ((capturedBlackMarbleNumber[0] === 2 &&
                capturedGreyMarbleNumber[0] === 2 &&
                capturedWhiteMarbleNumber[0] === 2) ||
                (capturedBlackMarbleNumber[0] === 5 ||
                    capturedGreyMarbleNumber[0] === 4 ||
                    capturedWhiteMarbleNumber[0] === 3)) {
                return Zertz.Color.ONE;
            } else {
                return Zertz.Color.TWO;
            }
        } else { // type = Zertz.GameType.REGULAR
            if ((capturedBlackMarbleNumber[0] === 3 &&
                capturedGreyMarbleNumber[0] === 3 &&
                capturedWhiteMarbleNumber[0] === 3) ||
                (capturedBlackMarbleNumber[0] === 6 ||
                    capturedGreyMarbleNumber[0] === 5 ||
                    capturedWhiteMarbleNumber[0] === 4)) {
                return Zertz.Color.ONE;
            } else {
                return Zertz.Color.TWO;
            }
        }
    };

    init(t, c);
};