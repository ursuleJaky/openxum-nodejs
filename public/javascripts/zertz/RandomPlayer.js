"use strict";

Zertz.RandomPlayer = function (color, e) {

// public methods
    this.put_marble = function(color) {
        var list = engine.get_free_rings();
        var index = Math.floor(Math.random() * list.length);

        return list[index];
    };

    this.capture = function(origin, destination) {
        var list = engine.get_can_capture_marbles();
        var index = Math.floor(Math.random() * list.length);
        var origin = list[index];
        var capturing_marbles = engine.get_possible_capturing_marbles(origin);
        var capturing_marble_index = Math.floor(Math.random() * capturing_marbles.length);
        var captured = capturing_marbles[capturing_marble_index];

        return { origin: origin, captured: captured };
    };

    this.color = function () {
        return mycolor;
    };

    this.is_remote = function () {
        return false;
    };

    this.remove_ring = function()     {
        var list = engine.get_possible_removing_rings();
        var index = Math.floor(Math.random() * list.length);

        return list[index];
    };

    this.select_marble_in_pool = function()  {
        var number = engine.get_black_marble_number() + engine.get_grey_marble_number() + engine.get_white_marble_number();
        var index = Math.floor(Math.random() * number) + 1;
        var color;

        if (index <= engine.get_black_marble_number()) {
            color = Zertz.MarbleColor.BLACK;
        } else if (index <= engine.get_black_marble_number() + engine.get_grey_marble_number()) {
            color = Zertz.MarbleColor.GREY;
        } else {
            color = Zertz.MarbleColor.WHITE;
        }
        return color;
    };

    this.set_level = function (l) {
        level = l;
    };

// private attributes
    var mycolor = color;
    var engine = e;
    var level = 10;
};