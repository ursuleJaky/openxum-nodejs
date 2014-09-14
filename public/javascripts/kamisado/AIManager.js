"use strict";

Kamisado.AIManager = function (e, black_player, white_player) {

// public methods
    this.eval = function () {
        while (!engine.is_finished()) {
            if (!engine.is_finished() && engine.current_color() === Kamisado.Color.BLACK) {
                play(black);
            }
            if (!engine.is_finished() && engine.current_color() === Kamisado.Color.WHITE) {
                play(white);
            }
        }
        return engine.winner_is();
    };

// private methods
    var play = function(player) {
        if (engine.phase() === Kamisado.Phase.MOVE_TOWER) {
            var turn = player.move_tower();

//            console.log(player.color() + ": " + turn.from + " => " + turn.to);

            engine.move_tower(turn);
        }
    };

// private attributes
    var engine = e;
    var black = black_player;
    var white = white_player;
};