"use strict";

Invers.RandomPlayer = function (c, e) {

// private attributes
    var _color = c;
    var _engine = e;
    var _level = 10;

// public methods
    this.color = function() {
        return _color;
    };

    this.is_remote =function () {
        return false;
    };

    this.move = function () {
        var list = _engine.get_possible_move_list();
        var position;
        var l;
        var letter = 'X';
        var number = -1;
        var color = _engine.get_free_tiles()[Math.floor(Math.random() * 2)];

        do {
            position = Math.floor(Math.random() * 4);
            if (position === Invers.Position.TOP) {
                l = list.top;
            } else if (position === Invers.Position.BOTTOM) {
                l = list.bottom;
            } else if (position === Invers.Position.LEFT) {
                l = list.left;
            } else if (position === Invers.Position.RIGHT) {
                l = list.right;
            }
        } while (l.length === 0);
        if (position === Invers.Position.TOP || position === Invers.Position.BOTTOM) {
            letter = l[Math.floor(Math.random() * l.length)].letter;
        } else {
            number = l[Math.floor(Math.random() * l.length)].number;
        }
        return new Invers.Move(color, letter, number, position);
    };

    this.reinit = function (e) {
        _engine = e;
    };

    this.set_level = function (l) {
        _level = l;
    };

    this.set_manager = function () {
    };
};