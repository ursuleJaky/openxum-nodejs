"use strict";

Tzaar.Piece = function (c, t) {

// public methods
    this.color = function () {
        return _color;
    };

    this.type = function () {
        return _type;
    };

// private attributes
    var init = function (c, t) {
        _color = c;
        _type = t;
    };

    var _color;
    var _type;

    init(c, t);
};