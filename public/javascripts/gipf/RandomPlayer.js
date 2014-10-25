"use strict";

Gipf.RandomPlayer = function (c, e) {
// private attributes
    var _color = c;
    var _engine = e;

    var _origin = null;

// public methods
    this.color = function () {
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

        if (_engine.phase() === Gipf.Phase.PUT_FIRST_PIECE) {
            move = new Gipf.Move(Gipf.MoveType.PUT_FIRST_PIECE, _engine.current_color(), this.put_first_piece());
        } else if (_engine.phase() === Gipf.Phase.PUT_PIECE) {
            _origin = this.put_piece();
            move = new Gipf.Move(Gipf.MoveType.PUT_PIECE, _engine.current_color(), _origin);
        } else if (_engine.phase() === Gipf.Phase.PUSH_PIECE) {
            move = new Gipf.Move(Gipf.MoveType.PUSH_PIECE, _engine.current_color(), _origin, this.push_piece(_origin));
            _origin = null;
        } else if (_engine.phase() === Gipf.Phase.REMOVE_ROW_AFTER) {
            move = new Gipf.Move(Gipf.MoveType.REMOVE_ROW_AFTER, _engine.current_color(), this.remove_row());
        } else if (_engine.phase() === Gipf.Phase.REMOVE_ROW_BEFORE) {
            move = new Gipf.Move(Gipf.MoveType.REMOVE_ROW_BEFORE, _engine.current_color(), this.remove_row());
        }
        return move;
    };

    this.push_piece = function (origin) {
        var list = _engine.get_possible_pushing_list(origin);

        if (list.length > 0) {
            var index = Math.floor(Math.random() * list.length);

            return list[index];
        } else {
            return new Gipf.Coordinates('X', -1);
        }
    };

    this.put_first_piece = function () {
        var list = _engine.get_possible_first_putting_list();

        if (list.length > 0) {
            var index = Math.floor(Math.random() * list.length);

            return list[index];
        } else {
            return new Gipf.Coordinates('X', -1);
        }
    };

    this.put_piece = function () {
        var list = _engine.get_possible_putting_list();

        if (list.length > 0) {
            var index = Math.floor(Math.random() * list.length);

            return list[index];
        } else {
            return Gipf.Coordinates('X', -1);
        }
    };

    this.reinit = function (e) {
        _engine = e;
    };

    this.remove_row = function() {
        var rows = _engine.get_rows(_color);
        var selectedRow;

        if (rows.length === 1) {
            selectedRow = rows[0];
        } else {
            selectedRow = rows[Math.floor(Math.random() * rows.length)];
        }
        return selectedRow[0];
    };

    this.set_level = function () {
    };

    this.set_manager = function () {
    };
};