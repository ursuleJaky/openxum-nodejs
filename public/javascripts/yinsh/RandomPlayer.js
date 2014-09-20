"use strict";

Yinsh.RandomPlayer = function (color, e) {

// public methods
    this.color = function() {
        return mycolor;
    };

    this.is_remote = function () {
        return false;
    };

    this.move_ring = function (origin) {
        var list = engine.get_possible_moving_list(origin, mycolor, false);

        if (list.length !== 0) {
            return list[Math.floor(Math.random() * list.length)];
        } else {
            return new Yinsh.Coordinates('X', -1);
        }
    };

    this.put_marker = function () {
        var ring_coordinates;
        var list = engine.get_placed_ring_coordinates(mycolor);
        var ok = false;

        while (!ok) {
            ring_coordinates = list[Math.floor(Math.random() * list.length)];
            ok = engine.get_possible_moving_list(ring_coordinates, mycolor, false).length > 0;
        }
        return ring_coordinates;
    };

    this.put_ring = function () {
        var list = engine.get_free_intersections();
        var index = Math.floor(Math.random() * list.length);

        return list[index];
    };

    this.remove_ring = function () {
        var ring_index = Math.floor(Math.random() * engine.get_placed_ring_coordinates(mycolor).length);

        return engine.get_placed_ring_coordinates(mycolor)[ring_index];
    };

    this.remove_row = function () {
        var rows = engine.get_rows(mycolor);
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

    this.set_level = function (l) {
        level = l;
    };

// private methods

// private attributes
    var mycolor = color;
    var engine = e;

    var level;
};
