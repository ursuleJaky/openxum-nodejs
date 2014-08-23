"use strict";

Tzaar.RandomPlayer = function (color, e) {

// public methods
    this.capture = function () {
        var found = false;
        var list = engine.get_no_free_intersections(mycolor);
        var origin = new Tzaar.Coordinates('X', -1);
        var destination = new Tzaar.Coordinates('X', -1);

        while (!found && list.length > 0) {
            var index = Math.floor(Math.random() * list.length);

            origin = list[index];
            var destination_list = engine.get_distant_neighbors(origin.coordinates(), mycolor === Tzaar.Color.BLACK ? Tzaar.Color.WHITE : Tzaar.Color.BLACK, true);

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
        return { origin: origin, destination: destination };
    };

    this.choose = function () {
        if (engine.can_capture(mycolor)) {
            if (engine.can_make_stack(mycolor)) {
                var i = Math.floor(Math.random() * 3);

                if (i === 0) {
                    return Tzaar.Phase.SECOND_CAPTURE;
                } else if (i == 1) {
                    return Tzaar.Phase.MAKE_STRONGER;
                } else {
                    return Tzaar.Phase.PASS;
                }
            } else {
                var i = Math.floor(Math.random() * 2);

                if (i == 0) {
                    return Tzaar.Phase.SECOND_CAPTURE;
                } else {
                    return Tzaar.Phase.PASS;
                }
            }
        } else {
            if (engine.can_make_stack(mycolor)) {
                var i = Math.floor(Math.random() * 2);

                if (i == 0) {
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
        return mycolor;
    };

    this.first_move = function (origin, destination) {
        var found = false;
        var list = engine.get_no_free_intersections(mycolor);
        var origin = new Tzaar.Coordinates('X', -1);
        var destination = new Tzaar.Coordinates('X', -1);

        while (!found) {
            var index = Math.floor(Math.random() * list.length);

            origin = list[index];
            var destination_list = engine.get_distant_neighbors(origin.coordinates(), mycolor === Tzaar.Color.BLACK ? Tzaar.Color.WHITE : Tzaar.Color.BLACK, true);

            if (destination_list.length > 0) {
                var destination_index = Math.floor(Math.random() * destination_list.length);

                destination = destination_list[destination_index];
                found = true;
            }
        }
        return { origin: origin, destination: destination };
    };

    this.is_remote = function () {
        return false;
    };

    this.make_stack = function () {
        var found = false;
        var list = engine.get_no_free_intersections(mycolor);
        var origin = new Tzaar.Coordinates('X', -1);
        var destination = new Tzaar.Coordinates('X', -1);

        while (!found && list.length > 0) {
            var index = Math.floor(Math.random() * list.length);

            origin = list[index];
            var destination_list = engine.get_distant_neighbors(origin.coordinates(), mycolor, false);

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
        return { origin: origin, destination: destination };
    };

    this.set_level = function (l) {
        level = l;
    };

// private attributes
    var mycolor = color;
    var engine = e;
    var level = 10;
};