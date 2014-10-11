"use strict";

Zertz.RandomPlayer = function (c, e) {

// private attributes
    var _color = c;
    var _engine = e;
    var _level = 10;

// private methods
    var capture = function () {
        var list = _engine.get_can_capture_marbles();
        var index = Math.floor(Math.random() * list.length);
        var origin = list[index];
        var capturing_marbles = _engine.get_possible_capturing_marbles(origin);
        var capturing_marble_index = Math.floor(Math.random() * capturing_marbles.length);
        var captured = capturing_marbles[capturing_marble_index];

        return { origin: origin, captured: captured };
    };

    var put_marble = function () {
        var list = _engine.get_free_rings();
        var index = Math.floor(Math.random() * list.length);

        return list[index];
    };

    var remove_ring = function () {
        var list = _engine.get_possible_removing_rings();
        var index = Math.floor(Math.random() * list.length);

        return list[index];
    };

    var select_marble_in_pool = function () {
        var number = _engine.get_black_marble_number() + _engine.get_grey_marble_number() + _engine.get_white_marble_number();
        var index = Math.floor(Math.random() * number) + 1;
        var color;

        if (index <= _engine.get_black_marble_number()) {
            color = Zertz.MarbleColor.BLACK;
        } else if (index <= _engine.get_black_marble_number() + _engine.get_grey_marble_number()) {
            color = Zertz.MarbleColor.GREY;
        } else {
            color = Zertz.MarbleColor.WHITE;
        }
        return color;
    };

// public methods
    this.color = function () {
        return _color;
    };

    this.is_remote = function () {
        return false;
    };

    this.move = function () {
        var move = null;
        var marble_color;
        var to;
        var r;

        if (_engine.phase() === Zertz.Phase.SELECT_MARBLE_IN_POOL) {
            marble_color = select_marble_in_pool();
            to = put_marble();
            move = new Zertz.Move(Zertz.MoveType.PUT_MARBLE, _color, to, marble_color, null);
        } else if (_engine.phase() === Zertz.Phase.REMOVE_RING) {
            to = remove_ring();
            move = new Zertz.Move(Zertz.MoveType.REMOVE_RING, _color, to, null, null);
        } else if (_engine.phase() === Zertz.Phase.CAPTURE) {
            r = capture();
            move = new Zertz.Move(Zertz.MoveType.CAPTURE, _color, r.captured, null, r.origin);
        }
        return move;
    };

    this.set_level = function (l) {
        _level = l;
    };
};