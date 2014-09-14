"use strict";

var kamisado = module.exports = function () {
};

kamisado.play = function (msg) {
    var response;

    if (msg.move === 'move_tower') {
        response = {
            type: 'turn',
            move: 'move_tower',
            from: msg.from,
            to: msg.to
        };
    }
    return response;
};