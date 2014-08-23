"use strict";

Tzaar.Intersection = function (c, cl, t) {
// public methods
    this.capture = function (destination) {
        var _stack = new Tzaar.Stack();

        while (!stack.empty()) {
            _stack.put_piece(stack.remove_top());
        }
        state = Tzaar.State.VACANT;
        destination.remove_stack();
        while (!_stack.empty()) {
            var piece = _stack.remove_top();

            destination.put_piece(piece.color(), piece.type());
        }
    };

    this.color = function () {
        if (state === Tzaar.State.VACANT) {
            return -1;
        }
        return stack.color();
    };

    this.coordinates = function () {
        return coordinates;
    };

    this.hash = function () {
        return coordinates.hash();
    };

    this.letter = function () {
        return coordinates.letter();
    };

    this.move_stack_to = function (destination) {
        var _stack = new Tzaar.Stack();

        while (!stack.empty()) {
            _stack.put_piece(stack.remove_top());
        }
        state = Tzaar.State.VACANT;
        while (!_stack.empty()) {
            var piece = _stack.remove_top();

            destination.put_piece(piece.color(), piece.type());
        }
    };

    this.number = function () {
        return coordinates.number();
    };

    this.put_piece = function (color, type) {
        state = Tzaar.State.NO_VACANT;
        stack.put_piece(new Tzaar.Piece(color, type));
    };

    this.remove_stack = function () {
        state = Tzaar.State.VACANT;
        stack.clear();
    };

    this.size = function () {
        return stack.size();
    };

    this.state = function () {
        return state;
    };

    this.type = function () {
        return stack.type();
    };

// private methods
    var init = function (c, cl, t) {
        coordinates = c;
        state = Tzaar.State.NO_VACANT;
        stack = new Tzaar.Stack();
        stack.put_piece(new Tzaar.Piece(cl, t));
    };

// private attributes
    var coordinates;
    var state;
    var stack;

    init(c, cl, t);
};
