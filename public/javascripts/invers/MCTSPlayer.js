"use strict";

Invers.MCTSPlayer = function (color, e) {

// public methods
    this.color = function() {
        return mycolor;
    };

    this.is_remote =function () {
        return false;
    };

    this.move = function () {
        return (new MCTS.Player(mycolor, engine, level)).move();
    };

    this.set_level = function (l) {
        level = l;
    };

// private attributes
    var mycolor = color;
    var engine = e;
    var level = 10;
};
