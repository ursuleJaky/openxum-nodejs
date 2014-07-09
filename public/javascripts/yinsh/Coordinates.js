Yinsh.Coordinates = function (l, n) {

// public methods
    this.distance = function (coordinates) {
        if (coordinates.letter() == letter) {
            return coordinates.number() - number;
        } else {
            return coordinates.letter().charCodeAt(0) - letter.charCodeAt(0);
        }
    };

    this.hash = function () {
        return (letter.charCodeAt(0) - 'A'.charCodeAt(0)) + (number - 1) * 11;
    };

    this.is_valid = function () {
        return letter >= 'A' && letter <= 'K' && number >= 1 && number <= 11;
    };

    this.letter = function () {
        return letter;
    };

    this.number = function () {
        return number;
    };

    this.to_string = function()
    {
        return letter + number;
    };

// private attributes
    var letter = l;
    var number = n;
};
