"use strict";

Zertz.Coordinates = function (l, n) {

// public methods
    this.hash = function () {
        return (letter.charCodeAt(0) - 'A'.charCodeAt(0)) + (number - 1) * 7;
    };

    this.is_valid = function () {
        return (letter === 'A' && number >= 1 && number <= 4) ||
            (letter === 'B' && number >= 1 && number <= 5) ||
            (letter === 'C' && number >= 1 && number <= 6) ||
            (letter === 'D' && number >= 1 && number <= 7) ||
            (letter === 'E' && number >= 2 && number <= 7) ||
            (letter === 'F' && number >= 3 && number <= 7) ||
            (letter === 'G' && number >= 4 && number <= 7);
    };

    this.letter = function () {
        return letter;
    };

    this.number = function () {
        return number;
    };

// private attributes
    var letter = l;
    var number = n;
};