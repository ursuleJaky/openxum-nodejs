"use strict";

Dvonn.RandomPlayer = function (c, e) {
// private attributes
    var _color = c;
    var _engine = e;

// public methods
    this.color = function () {
        return _color;
    };

    this.is_remote = function () {
        return false;
    };

    this.move = function () {
        var move = null;

        if (_engine.phase() === Dvonn.Phase.PUT_DVONN_PIECE) {
            move = new Dvonn.Move(Dvonn.Phase.PUT_DVONN_PIECE, _engine.current_color(), this.put_dvonn_piece());
        } else if (_engine.phase() === Dvonn.Phase.PUT_PIECE) {
            move = new Dvonn.Move(Dvonn.Phase.PUT_PIECE, _engine.current_color(), this.put_piece());
        } else if (_engine.phase() === Dvonn.Phase.MOVE_STACK) {
            var result = this.move_stack();

            if (result.ok) {
                var e = _engine.clone();

                e.move_stack(result.origin, result.destination);
                move = new Dvonn.Move(Dvonn.Phase.MOVE_STACK, _engine.current_color(), result.origin,
                    result.destination, e.remove_isolated_stacks());
            }
        }
        return move;
    };

    this.move_stack = function () {
        var stack_list = _engine.get_possible_moving_stacks(_color);

        if (stack_list.length > 0) {
            var stack_index = Math.floor(Math.random() * stack_list.length);
            var origin = stack_list[stack_index];
            var destination_list = _engine.get_stack_possible_move(origin);

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
        var list = _engine.get_free_intersections();
        var index = Math.floor(Math.random() * list.length);

        return list[index];
    };

    this.put_piece = function () {
        var list = _engine.get_free_intersections();
        var index = Math.floor(Math.random() * list.length);

        return list[index];
    };

    this.remove_isolated_stacks = function () {
        return _engine.remove_isolated_stacks();
    };

    this.reinit = function (e) {
        _engine = e;
    };

    this.set_level = function (l) {
    };

    this.set_manager = function () {
    };
};