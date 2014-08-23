"use strict";

Tzaar.Engine = function (t, c) {

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

    this.current_color = function () {
        return color;
    };

    this.exist_intersection = function (letter, number) {
        var coordinates = new Tzaar.Coordinates(letter, number);

        if (coordinates.is_valid()) {
            return intersections[coordinates.hash()] != null;
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
                if (l != 'E' || n != 5) {
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

// private attributes
    var type;
    var color;
    var intersections;

    var phase;
    var state;
    var placedTzaarPieceNumber;
    var placedPieceNumber;

    init(t, c);
};
