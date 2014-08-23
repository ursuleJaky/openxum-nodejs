"use strict";

Tzaar.Coordinates = function (l, n) {

// public methods
    this.hash = function () {
        return (letter.charCodeAt(0) - 'A'.charCodeAt(0)) + (number - 1) * 9;
    };

    this.is_valid = function () {
        return ((letter == 'A' && number >= 1 && number <= 5) ||
            (letter == 'B' && number >= 1 && number <= 6) ||
            (letter == 'C' && number >= 1 && number <= 7) ||
            (letter == 'D' && number >= 1 && number <= 8) ||
            (letter == 'E' && number >= 1 && number <= 9) ||
            (letter == 'F' && number >= 2 && number <= 9) ||
            (letter == 'G' && number >= 3 && number <= 9) ||
            (letter == 'H' && number >= 4 && number <= 9) ||
            (letter == 'I' && number >= 5 && number <= 9)) && (letter != 'E' || number != 5);
    };

    this.letter = function () {
        return letter;
    };

    this.move = function (distance, direction) {
        switch (direction) {
            case Tzaar.Direction.NORTH_WEST:
                return new Tzaar.Coordinates(compute_letter(letter, -distance), number);
            case Tzaar.Direction.NORTH:
                return new Tzaar.Coordinates(letter, number + distance);
            case Tzaar.Direction.NORTH_EAST:
                return new Tzaar.Coordinates(compute_letter(letter, distance), number + distance);
            case Tzaar.Direction.SOUTH_EAST:
                return new Tzaar.Coordinates(compute_letter(letter, distance), number);
            case Tzaar.Direction.SOUTH:
                return new Tzaar.Coordinates(letter, number - distance);
            case Tzaar.Direction.SOUTH_WEST:
                return new Tzaar.Coordinates(compute_letter(letter, -distance), number - distance);
        }
    };

    this.number = function () {
        return number;
    };

    this.to_string = function () {
        return letter + number;
    };

// private attributes
    var compute_letter = function (l, d) {
        var index = letter.charCodeAt(0) - 'A'.charCodeAt(0) + d;

        if (index >= 0 && index <= 11) {
            return Tzaar.letters[index];
        } else {
            return 'X';
        }
    };

    var letter = l;
    var number = n;
};