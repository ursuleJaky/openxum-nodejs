"use strict";

Tzaar.RandomPlayer = function (c, e) {
// private attributes
    var _color = c;
    var _engine = e;

// public methods
    this.capture = function () {
        var found = false;
        var list = _engine.get_no_free_intersections(_color);
        var origin = new Tzaar.Coordinates('X', -1);
        var destination = new Tzaar.Coordinates('X', -1);

        while (!found && list.length > 0) {
            var index = Math.floor(Math.random() * list.length);

            origin = list[index];
            var destination_list = _engine.get_distant_neighbors(origin.coordinates(), _color === Tzaar.Color.BLACK ? Tzaar.Color.WHITE : Tzaar.Color.BLACK, true);

            if (destination_list.length > 0) {
                var destination_index = Math.floor(Math.random() * destination_list.length);

                destination = destination_list[destination_index];
                found = true;
            } else {
                var found2 = false;
                var index2 = 0;

                while (index2 < list.length && !found2) {
                    if (list[index2].hash() === origin.hash()) {
                        found2 = true;
                    } else {
                        ++index2;
                    }
                }
                list.splice(index2, 1);
            }
        }
        return { origin: origin.coordinates(), destination: destination };
    };

    this.choose = function () {
        var i;

        if (_engine.can_capture(_color)) {
            if (_engine.can_make_stack(_color)) {
                i = Math.floor(Math.random() * 3);
                if (i === 0) {
                    return Tzaar.Phase.SECOND_CAPTURE;
                } else if (i === 1) {
                    return Tzaar.Phase.MAKE_STRONGER;
                } else {
                    return Tzaar.Phase.PASS;
                }
            } else {
                i = Math.floor(Math.random() * 2);
                if (i === 0) {
                    return Tzaar.Phase.SECOND_CAPTURE;
                } else {
                    return Tzaar.Phase.PASS;
                }
            }
        } else {
            if (_engine.can_make_stack(_color)) {
                i = Math.floor(Math.random() * 2);
                if (i === 0) {
                    return Tzaar.Phase.MAKE_STRONGER;
                } else {
                    return Tzaar.Phase.PASS;
                }
            } else {
                return Tzaar.Phase.PASS;
            }
        }
    };

    this.color = function () {
        return _color;
    };

    this.first_move = function (origin, destination) {
        var found = false;
        var list = _engine.get_no_free_intersections(_color);
        var origin = new Tzaar.Coordinates('X', -1);
        var destination = new Tzaar.Coordinates('X', -1);

        while (!found) {
            var index = Math.floor(Math.random() * list.length);

            origin = list[index];
            var destination_list = _engine.get_distant_neighbors(origin.coordinates(), _color === Tzaar.Color.BLACK ? Tzaar.Color.WHITE : Tzaar.Color.BLACK, true);

            if (destination_list.length > 0) {
                var destination_index = Math.floor(Math.random() * destination_list.length);

                destination = destination_list[destination_index];
                found = true;
            }
        }
        return { origin: origin.coordinates(), destination: destination };
    };

    this.is_remote = function () {
        return false;
    };

    this.make_stack = function () {
        var found = false;
        var list = _engine.get_no_free_intersections(_color);
        var origin = new Tzaar.Coordinates('X', -1);
        var destination = new Tzaar.Coordinates('X', -1);

        while (!found && list.length > 0) {
            var index = Math.floor(Math.random() * list.length);

            origin = list[index];
            var destination_list = _engine.get_distant_neighbors(origin.coordinates(), _color, false);

            if (destination_list.length > 0) {
                var destination_index = Math.floor(Math.random() * destination_list.length);

                destination = destination_list[destination_index];
                found = true;
            } else {
                var found2 = false;
                var index2 = 0;

                while (index2 < list.length && !found2) {
                    if (list[index2].hash() === origin.hash()) {
                        found2 = true;
                    } else {
                        ++index2;
                    }
                }
                list.splice(index2, 1);
            }
        }
        return { origin: origin.coordinates(), destination: destination };
    };

    this.move = function () {
        var m;
        var move = null;

        if (_engine.phase() === Tzaar.Phase.FIRST_MOVE) {
            m = this.first_move();
            move = new Tzaar.Move(Tzaar.MoveType.FIRST_MOVE, _engine.current_color(), m.origin, m.destination);
        } else if (_engine.phase() === Tzaar.Phase.CAPTURE) {
            m = this.capture();
            move = new Tzaar.Move(Tzaar.MoveType.CAPTURE, _engine.current_color(), m.origin, m.destination);
        } else if (_engine.phase() === Tzaar.Phase.CHOOSE) {
            move = new Tzaar.Move(Tzaar.MoveType.CHOOSE, _engine.current_color(), null, null, this.choose());
        } else if (_engine.phase() === Tzaar.Phase.SECOND_CAPTURE) {
            m = this.capture();
            move = new Tzaar.Move(Tzaar.MoveType.SECOND_CAPTURE, _engine.current_color(), m.origin, m.destination);
        } else if (_engine.phase() === Tzaar.Phase.MAKE_STRONGER) {
            m = this.make_stack();
            move = new Tzaar.Move(Tzaar.MoveType.MAKE_STRONGER, _engine.current_color(), m.origin, m.destination);
        }
        return move;
    };

    this.reinit = function (e) {
        _engine = e;
    };

    this.set_level = function (l) {
    };

    this.set_manager = function () {
    };
};