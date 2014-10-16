"use strict";

Pentago.RandomPlayer = function (c, e) {
// private attributes
    var _color = c;
    var _engine = e;

// public methods
    this.color = function() {
        return _color;
    };

    this.is_remote =function () {
        return false;
    };

    this.move = function () {
        var move = null;

        if (_engine.phase() === Pentago.Phase.PUT_MARBLE) {
            var list = _engine.get_free_cells();
            var index = Math.floor(Math.random() * list.length);

            move = new Pentago.Move(Pentago.MoveType.PUT_MARBLE, _engine.current_color(), list[index]);
        } else  if (_engine.phase() === Pentago.Phase.ROTATE) {
            var board = Math.floor(Math.random() * 4);
            var orientation = Math.floor(Math.random() * 2);

            if (board === 0) {
                if (orientation === 0) {
                    move = new Pentago.Move(Pentago.MoveType.ROTATE, _engine.current_color(), Pentago.Board.BOTTOM_LEFT, Pentago.Direction.ANTI_CLOCKWISE);
                } else {
                    move = new Pentago.Move(Pentago.MoveType.ROTATE, _engine.current_color(), Pentago.Board.BOTTOM_LEFT, Pentago.Direction.CLOCKWISE);
                }
            } else if (board === 1) {
                if (orientation === 0) {
                    move = new Pentago.Move(Pentago.MoveType.ROTATE, _engine.current_color(), Pentago.Board.BOTTOM_RIGHT, Pentago.Direction.ANTI_CLOCKWISE);
                } else {
                    move = new Pentago.Move(Pentago.MoveType.ROTATE, _engine.current_color(), Pentago.Board.BOTTOM_RIGHT, Pentago.Direction.CLOCKWISE);
                }
            } else if (board === 2) {
                if (orientation === 0) {
                    move = new Pentago.Move(Pentago.MoveType.ROTATE, _engine.current_color(), Pentago.Board.TOP_LEFT, Pentago.Direction.ANTI_CLOCKWISE);
                } else {
                    move = new Pentago.Move(Pentago.MoveType.ROTATE, _engine.current_color(), Pentago.Board.TOP_LEFT, Pentago.Direction.CLOCKWISE);
                }
            } else {
                if (orientation === 0) {
                    move = new Pentago.Move(Pentago.MoveType.ROTATE, _engine.current_color(), Pentago.Board.TOP_RIGHT, Pentago.Direction.ANTI_CLOCKWISE);
                } else {
                    move = new Pentago.Move(Pentago.MoveType.ROTATE, _engine.current_color(), Pentago.Board.TOP_RIGHT, Pentago.Direction.CLOCKWISE);
                }
            }
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