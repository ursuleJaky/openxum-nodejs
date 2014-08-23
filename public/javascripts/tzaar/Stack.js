"use strict";

Tzaar.Stack = function () {

// public methods
    this.color = function () {
        return top().color();
    };

    this.clear = function () {
        while (!this.empty()) {
            _pieces.pop();
        }
    };

    this.empty = function () {
        return _pieces.length == 0;
    };

    this.put_piece = function (piece) {
        _pieces.push(piece);
    };

    this.remove_top = function () {
        var _top = top();

        _pieces.pop();
        return _top;
    };

    this.size = function () {
        return _pieces.length;
    };

    this.type = function () {
        return top().type();
    };

// private attributes
    var init = function () {
        _pieces = [];
    };

    var top = function () {
        return _pieces[_pieces.length - 1];
    };

    var _pieces;

    init();
};