"use strict";

Dvonn.Stack = function () {

// public methods
    this.color = function() {
        return top().color();
    };

    this.clear = function() {
        while (!this.empty()) {
            _pieces.pop();
        }
    };

    this.dvonn = function() {
        return _dvonn;
    };

    this.empty = function() {
        return _pieces.length == 0;
    };

    this.put_piece = function(piece) {
        if (!_dvonn) {
            _dvonn = piece.dvonn();
        }
        _pieces.push(piece);
    };

    this.remove_top = function() {
        var _top = top();

        _pieces.pop();
        if (this.empty()) {
            _dvonn = false;
        }
        return _top;
    };

    this.size = function() {
        return _pieces.length;
    };

// private attributes
    var init = function() {
        _pieces = [];
        _dvonn = false;
    };

    var top = function() {
        return _pieces[_pieces.length - 1];
    };

    var _pieces;
    var _dvonn;

    init();
};