"use strict";

Yinsh.RandomPlayer = function (c, e) {
// private attributes
    var _color = c;
    var _engine = e;

    var _selected_ring = null;

// private methods
    var move_ring = function (origin) {
        var list = _engine.get_possible_moving_list(origin, _color, false);

        if (list.length !== 0) {
            return list[Math.floor(Math.random() * list.length)];
        } else {
            return new Yinsh.Coordinates('X', -1);
        }
    };

    var put_marker = function () {
        var ring_coordinates;
        var list = _engine.get_placed_ring_coordinates(_color);
        var ok = false;

        while (!ok) {
            ring_coordinates = list[Math.floor(Math.random() * list.length)];
            ok = _engine.get_possible_moving_list(ring_coordinates, _color, false).length > 0;
        }
        return ring_coordinates;
    };

    var put_ring = function () {
        var list = _engine.get_free_intersections();
        var index = Math.floor(Math.random() * list.length);

        return list[index];
    };

    var remove_ring = function () {
        var ring_index = Math.floor(Math.random() * _engine.get_placed_ring_coordinates(_color).length);

        return _engine.get_placed_ring_coordinates(_color)[ring_index];
    };

    var remove_row = function () {
        var rows = _engine.get_rows(_color);
        var index = Math.floor(Math.random() * rows.length);

        if (rows[index].length === 5) {
            return rows[index];
        } else {
            var first = Math.floor(Math.random() * (rows[index].length - 4));
            var row = [];

            for (var i = first; i < first + 5; ++i) {
                row.push(rows[index][i]);
            }
            return row;
        }
    };

// public methods
    this.color = function() {
        return _color;
    };

    this.confirm = function() {
        return false;
    };

    this.is_remote = function () {
        return false;
    };

    this.move = function () {
        var move = null;

        if (_engine.phase() === Yinsh.Phase.PUT_RING) {
            move = new Yinsh.Move(Yinsh.MoveType.PUT_RING, _engine.current_color(), put_ring());
        } else if (_engine.phase() === Yinsh.Phase.PUT_MARKER) {
            _selected_ring = put_marker();
            move = new Yinsh.Move(Yinsh.MoveType.PUT_MARKER, _engine.current_color(), _selected_ring);
        } else if (_engine.phase() === Yinsh.Phase.MOVE_RING) {
            move = new Yinsh.Move(Yinsh.MoveType.MOVE_RING, _engine.current_color(), _selected_ring, move_ring(_selected_ring));
            _selected_ring = null;
        } else if (_engine.phase() === Yinsh.Phase.REMOVE_ROWS_AFTER ||
            _engine.phase() === Yinsh.Phase.REMOVE_ROWS_BEFORE) {
            move = new Yinsh.Move(Yinsh.MoveType.REMOVE_ROW, _engine.current_color(), remove_row());
        } else if (_engine.phase() === Yinsh.Phase.REMOVE_RING_AFTER ||
            _engine.phase() === Yinsh.Phase.REMOVE_RING_BEFORE) {
            move = new Yinsh.Move(Yinsh.MoveType.REMOVE_RING, _engine.current_color(), remove_ring());
        }
        return move;
    };

    this.reinit = function (e) {
        _engine = e;
    };

    this.set_level = function () {
    };

    this.set_manager = function () {
    };
};
