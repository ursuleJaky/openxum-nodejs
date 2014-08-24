"use strict";

Gipf.Intersection = function (c) {
// public methods
    this.color = function () {
        if (state === Gipf.State.VACANT) {
            return -1;
        } else if (state === Gipf.State.WHITE_GIPF || state === Gipf.State.WHITE_PIECE) {
            return Gipf.Color.WHITE;
        } else {
            return Gipf.Color.BLACK;
        }
    };

    this.coordinates = function () {
        return coordinates;
    };

    this.gipf = function() {
        return state === Gipf.State.WHITE_GIPF || state === Gipf.State.BLACK_GIPF;
    };

    this.hash = function () {
        return coordinates.hash();
    };

    this.letter = function () {
        return coordinates.letter();
    };

    this.number = function () {
        return coordinates.number();
    };

    this.put_piece = function (color, gipf) {
        if (gipf) {
            state = color === Gipf.Color.WHITE ? Gipf.State.WHITE_GIPF : Gipf.State.BLACK_GIPF;
        } else {
            state = color === Gipf.Color.WHITE ? Gipf.State.WHITE_PIECE : Gipf.State.BLACK_PIECE;
        }
    };

    this.remove_piece = function () {
        var color = (state === Gipf.State.WHITE_GIPF || state === Gipf.State.WHITE_PIECE) ? Gipf.Color.WHITE : Gipf.Color.BLACK;
        var gipf = (state === Gipf.State.WHITE_GIPF || state === Gipf.State.BLACK_GIPF);

        state = Gipf.State.VACANT;
        return { color: color, gipf: gipf };
    };

    this.state = function () {
        return state;
    };

// private methods
    var init = function (c) {
        coordinates = c;
        state = Gipf.State.VACANT;
    };

// private attributes
    var coordinates;
    var state;

    init(c);
};
