"use strict";

var invers = module.exports = function () {
};

invers.play = function (msg) {
    var response;

    if (msg.move === 'push_tile') {
        response = {
            type: 'turn',
            move: 'push_tile',
            color: msg.color,
            letter: msg.letter,
            number: msg.number,
            position: msg.position
        };
    }
    return response;
};