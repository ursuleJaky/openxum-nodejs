"use strict";

Dvonn.Piece = function (c) {

// public methods
    this.color = function() {
        return _color;
    };

    this.dvonn = function() {
        return _dvonn;
    };

// private attributes
    var init = function(c) {
        _color = c;
        _dvonn = c == Dvonn.Color.RED;
    };

    var _color;
    var _dvonn;

    init(c);
};