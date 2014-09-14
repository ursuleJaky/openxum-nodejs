"use strict";

var yinsh = module.exports = function () {
};

yinsh.play = function (msg) {
    var response;

    if (msg.move == 'put_ring' || msg.move == 'put_marker' || msg.move == 'remove_ring' ||
        msg.move == 'remove_row') {

        console.log('turn: ' + msg.move + ' ' + msg.coordinates.letter + msg.coordinates.number
            + ' by ' + msg.color + ' / ' + msg.user_id);

        response = {
            type: 'turn',
            move: msg.move,
            coordinates: {
                letter: msg.coordinates.letter,
                number: msg.coordinates.number
            },
            color: msg.color
        };
    } else if (msg.move == 'move_ring') {

        console.log('turn: ' + msg.move + ' ' + msg.coordinates.letter + msg.coordinates.number
            + ' to ' + msg.ring.letter + msg.ring.number + ' / ' + msg.user_id);

        response = {
            type: 'turn',
            move: msg.move,
            ring: {
                letter: msg.ring.letter,
                number: msg.ring.number
            },
            coordinates: {
                letter: msg.coordinates.letter,
                number: msg.coordinates.number
            }
        };
    }
    return response;
};