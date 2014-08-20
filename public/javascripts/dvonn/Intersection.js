"use strict";

Dvonn.Intersection = function (c) {
// public methods
    this.hash = function () {
        return coordinates.hash();
    };

    this.color = function () {
        if (state === Dvonn.State.VACANT) {
            return -1;
        }
        return stack.color();
    };

    this.coordinates = function () {
        return coordinates;
    };

    this.dvonn = function() {
        return stack.dvonn();
    };

    this.letter = function () {
        return coordinates.letter();
    };

    this.move_stack_to = function(destination) {
        var _stack = new Dvonn.Stack();

        while (!stack.empty()) {
            _stack.put_piece(stack.remove_top());
        }
        state = Dvonn.State.VACANT;
        while (!_stack.empty()) {
            destination.put_piece(_stack.remove_top().color());
        }
    };

    this.number = function () {
        return coordinates.number();
    };

    this.put_piece = function(color) {
        state = Dvonn.State.NO_VACANT;
        stack.put_piece(new Dvonn.Piece(color));
    };

    this.remove_stack = function() {
        state = Dvonn.State.VACANT;
        stack.clear();
    };

    this.state = function () {
        return state;
    };

    this.size = function() {
        return stack.size();
    };

// private methods
    var init = function(c) {
        coordinates = c;
        state = Dvonn.State.VACANT;
        stack = new Dvonn.Stack();
    };

// private attributes
    var coordinates;
    var state;
    var stack;

    init(c);
};
