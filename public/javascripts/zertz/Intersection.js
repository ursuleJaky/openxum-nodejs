"use strict";

Zertz.Intersection = function (c) {
// public methods
    this.color = function () {
        if (state === Zertz.State.VACANT || state === Zertz.State.EMPTY) {
            return Zertz.MarbleColor.NONE;
        } else if (state === Zertz.State.BLACK_MARBLE) {
            return Zertz.MarbleColor.BLACK;
        } else if (state === Zertz.State.GREY_MARBLE) {
            return Zertz.MarbleColor.GREY;
        } else {
            return Zertz.MarbleColor.WHITE;
        }
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

    this.marble_is_present = function() {
        return state === Zertz.State.BLACK_MARBLE || state === Zertz.State.WHITE_MARBLE || state === Zertz.State.GREY_MARBLE;
    };

    this.number = function () {
        return coordinates.number();
    };

    this.put_marble = function(color) {
        if (color === Zertz.MarbleColor.BLACK) {
            state = Zertz.State.BLACK_MARBLE;
        } else if (color === Zertz.MarbleColor.WHITE) {
            state = Zertz.State.WHITE_MARBLE;
        } else if (color === Zertz.MarbleColor.GREY) {
            state = Zertz.State.GREY_MARBLE;
        }
    };

    this.remove_marble = function() {
        state = Zertz.State.VACANT;
    };

    this.remove_ring = function() {
        state = Zertz.State.EMPTY;
    };

    this.state = function () {
        return state;
    };

// private methods
    var init = function (c) {
        coordinates = c;
        state = Zertz.State.VACANT;
    };

// private attributes
    var coordinates;
    var state;

    init(c);
};
