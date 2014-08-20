"use strict";

Dvonn.RandomPlayer = function (color, e) {

// public methods
    this.color = function () {
        return mycolor;
    };

    this.is_remote = function () {
        return false;
    };

    this.move_stack = function () {
        var stack_list = engine.get_possible_moving_stacks(mycolor);

        if (stack_list.length > 0) {
            var stack_index = Math.floor(Math.random() * stack_list.length);
            var origin = stack_list[stack_index];
            var destination_list = engine.get_stack_possible_move(origin);

            if (destination_list.length > 0) {
                var destination_index = Math.floor(Math.random() * destination_list.length);
                var destination = destination_list[destination_index];

                return { ok: true, origin: origin, destination: destination };
            } else {
                return { ok: false, origin: null, destination: null };
            }
        } else {
            return { ok: false, origin: null, destination: null };
        }
    };

    this.put_dvonn_piece = function () {
        var list = engine.get_free_intersections();
        var index = Math.floor(Math.random() * list.length);
        var coordinates = list[index];

        return coordinates;
    };

    this.put_piece = function () {
        var list = engine.get_free_intersections();
        var index = Math.floor(Math.random() * list.length);
        var coordinates = list[index];

        return coordinates;
    };

    this.remove_isolated_stacks = function () {
        return engine.remove_isolated_stacks();
    };

    this.set_level = function (l) {
        level = l;
    };

// private attributes
    var mycolor = color;
    var engine = e;
    var level = 10;
};