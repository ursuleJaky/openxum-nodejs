"use strict";

Gipf.RandomPlayer = function (color, e) {

// public methods
    this.color = function () {
        return mycolor;
    };

    this.is_remote = function () {
        return false;
    };

    this.push_piece = function (origin) {
        var list = engine.get_possible_pushing_list(origin);

        if (list.length > 0) {
            var index = Math.floor(Math.random() * list.length);

            return list[index];
        } else {
            return new Coordinates('X', -1);
        }
    };

    this.put_first_piece = function () {
        var list = engine.get_possible_first_putting_list();

        if (list.length > 0) {
            var index = Math.floor(Math.random() * list.length);

            return list[index];
        } else {
            return new Coordinates('X', -1);
        }
    };

    this.put_piece = function () {
        var list = engine.get_possible_putting_list();

        if (list.length > 0) {
            var index = Math.floor(Math.random() * list.length);

            return list[index];
        } else {
            return Gipf.Coordinates('X', -1);
        }
    };

    this.remove_row = function() {
        var rows = engine.get_rows(mycolor);
        var selectedRow;

        if (rows.length === 1) {
            selectedRow = rows[0];
        } else {
            selectedRow = rows[Math.floor(Math.random() * rows.length)];
        }
        return selectedRow[0];
    };

    this.set_level = function (l) {
        level = l;
    };

// private attributes
    var mycolor = color;
    var engine = e;
    var level = 10;
};