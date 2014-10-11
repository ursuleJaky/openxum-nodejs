"use strict";

Kamisado.Manager = function (e, g, o) {

// private attributes
    var engine;
    var gui;
    var opponent;

    var level;

    var move;
    var moves;

// private methods
    var apply_move = function (move) {
        engine.move(move);
        moves += move.get() + ';';
    };

    var load_win = function () {
        var key = 'openxum:kamisado:win';
        var win = 0;

        if (localStorage[key]) {
            win = JSON.parse(localStorage[key]);
        }
        return win;
    };

    var finish = function () {
        if (engine.is_finished()) {
            var popup = document.getElementById("winnerModalText");

            popup.innerHTML = "<h4>The winner is " +
                (engine.winner_is() === Kamisado.Color.BLACK ? "black" : "white") + "!</h4>";
            $("#winnerModal").modal("show");

            if (engine.winner_is() === gui.color()) {
                var win = load_win() + 1;

                localStorage['openxum:kamisado:win'] = JSON.stringify(win);
                if (win > 5) {
                    localStorage['openxum:kamisado:level'] = JSON.stringify(level + 10);
                    localStorage['openxum:kamisado:win'] = JSON.stringify(0);
                }
            }
        }
    };

    var init = function (e, g, o) {
        engine = e;
        gui = g;
        opponent = o;
        moves = '';
    };

// public methods
    this.load_level = function () {
        var key = 'openxum:kamisado:level';

        level = 10;
        if (localStorage[key]) {
            level = JSON.parse(localStorage[key]);
        }
        return level;
    };

    this.play = function () {
        if (engine.current_color() === gui.color()) {
            if (engine.phase() === Kamisado.Phase.MOVE_TOWER && gui.get_selected_tower() && gui.get_selected_cell()) {
                move = new Kamisado.Move(gui.get_selected_tower(), gui.get_selected_cell());
                apply_move(move);
                if (opponent.is_remote()) {
                    opponent.move(move);
                }
                gui.unselect();
            }
            gui.draw();
            finish();
            if (engine.current_color() !== gui.color()) {
                if (!opponent.is_remote()) {
                    this.play_opponent();
                }
            }
        } else {
            if (engine.phase() === Kamisado.Phase.MOVE_TOWER) {
                apply_move(move);
                if (opponent.is_remote() && opponent.confirm()) {
                    opponent.move(move);
                }
                gui.unselect();
            }
            gui.draw();
            finish();
            if (engine.current_color() !== gui.color()) {
                if (!opponent.is_remote()) {
                    this.play_opponent();
                }
            }
        }
    };

    this.play_opponent = function () {
        if (engine.phase() === Kamisado.Phase.MOVE_TOWER) {
            if (!opponent.is_remote() || (opponent.is_remote() && opponent.is_ready())) {
                move = opponent.move();
            }
            if (!opponent.is_remote()) {
                gui.move_tower(
                    {
                        x: move.from().x,
                        y: move.from().y,
                        tower_color: engine.find_tower(move.from(), engine.current_color()).tower_color
                    },
                    move.to());
            }
        }
    };

    this.play_remote = function (m) {
        move = m;
        if (engine.phase() === Kamisado.Phase.MOVE_TOWER) {
            gui.move_tower(
                {
                    x: move.from().x,
                    y: move.from().y,
                    tower_color: engine.find_tower(move.from(), engine.current_color()).tower_color
                },
                move.to());
        }
    };

    this.redraw = function () {
        gui.draw();
    };

    init(e, g, o);
};