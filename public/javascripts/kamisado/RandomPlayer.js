"use strict";

Kamisado.RandomPlayer = function (c, e) {
// private attributes
    var _color = c;
    var _engine = e;

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
        var playable_tower = _engine.find_playable_tower(_color);

        if (!playable_tower) {
            playable_tower = { x: Math.floor(Math.random() * 8), y: 0 };
        }

        var list = _engine.get_possible_moving_list({ x: playable_tower.x, y: playable_tower.y, color: _color });

        if (list.length !== 0) {
            var coordinates = list[Math.floor(Math.random() * list.length)];

            return new Kamisado.Move(playable_tower, coordinates);
        } else {
            return undefined;
        }
    };

    this.reinit = function (e) {
        _engine = e;
    };

    this.set_level = function () {
    };

    this.set_manager = function () {
    };
};
