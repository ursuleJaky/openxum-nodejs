"use strict";

Dvonn.Coordinates = function (l, n) {

// public methods
    this.distance = function (coordinates) {
        if (coordinates.letter() === letter) {
            return coordinates.number() - number;
        } else {
            return coordinates.letter().charCodeAt(0) - letter.charCodeAt(0);
        }
    };

    this.hash = function () {
        return (letter.charCodeAt(0) - 'A'.charCodeAt(0)) + (number - 1) * 11;
    };

    this.is_valid = function () {
        return (number == 1 && letter >= 'A' && letter <= 'I') ||
            (number == 2 && letter >= 'A' && letter <= 'J') ||
            (number == 3 && letter >= 'A' && letter <= 'K') ||
            (number == 4 && letter >= 'B' && letter <= 'K') ||
            (number == 5 && letter >= 'C' && letter <= 'K');
    };

    this.letter = function () {
        return letter;
    };

    this.move = function(distance, direction) {
        switch (direction) {
            case Dvonn.Direction.NORTH_WEST: return new Dvonn.Coordinates(compute_letter(letter, -distance), number - distance);
            case Dvonn.Direction.NORTH_EAST: return new Dvonn.Coordinates(letter, number - distance);
            case Dvonn.Direction.EAST: return new Dvonn.Coordinates(compute_letter(letter, distance), number);
            case Dvonn.Direction.SOUTH_EAST: return new Dvonn.Coordinates(compute_letter(letter, distance), number + distance);
            case Dvonn.Direction.SOUTH_WEST: return new Dvonn.Coordinates(letter, number + distance);
            case Dvonn.Direction.WEST: return new Dvonn.Coordinates(compute_letter(letter, -distance), number);
        }
    };

    this.number = function () {
        return number;
    };

    this.to_string = function() {
        return letter + number;
    };

// private attributes
    var compute_letter = function(l, d) {
        var index = letter.charCodeAt(0) - 'A'.charCodeAt(0) + d;

        if (index >= 0 && index <= 11) {
            return Dvonn.letters[index];
        } else {
            return 'X';
        }
    };

    var letter = l;
    var number = n;
};
