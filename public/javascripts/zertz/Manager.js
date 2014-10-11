"use strict";

Zertz.Status = function (e) {
// private attributes
    var element = e;

    this.set_text = function (t) {
        e.innerHTML = t;
    };
};

Zertz.Manager = function (e, g, o, s) {

// private attributes
    var engine;
    var gui;
    var opponent;
    var status;
    var ready;

    var level;

    var move;
    var moves;

// private methods
    var update_status = function () {
        if (opponent.is_remote()) {
            if (ready) {
                if (engine.current_color() === opponent.color()) {
                    status.set_text('wait');
                } else {
                    status.set_text('ready');
                }
            } else {
                status.set_text('disconnect');
            }
        } else {
            status.set_text(engine.current_color() === Zertz.Color.ONE ? 'First' : 'Second');
        }
    };

    var apply_move = function (move) {
        engine.move(move);
        moves += move.get() + ';';
        update_status();
    };

    var load_win = function () {
        var key = 'openxum:zertz:win';
        var win = 0;

        if (localStorage[key]) {
            win = JSON.parse(localStorage[key]);
        }
        return win;
    };

    var finish = function () {
        if (engine.is_finished()) {
            var popup = document.getElementById("winnerModalText");

            popup.innerHTML = "<h4>The winner is player " +
                (engine.winner_is() === Zertz.Color.ONE ? "one" : "two") + "!</h4>";
            $("#winnerModal").modal("show");

            if (engine.winner_is() === gui.color()) {
                var win = load_win() + 1;

                localStorage['openxum:zertz:win'] = JSON.stringify(win);
                if (win > 5) {
                    localStorage['openxum:zertz:level'] = JSON.stringify(level + 10);
                    localStorage['openxum:zertz:win'] = JSON.stringify(0);
                }
            }
        }
    };

    var init = function (e, g, o, s) {
        engine = e;
        gui = g;
        opponent = o;
        status = s;
        update_status();
    };

// public methods
    this.load_level = function () {
        var key = 'openxum:zertz:level';

        level = 10;
        if (localStorage[key]) {
            level = JSON.parse(localStorage[key]);
        }
        return level;
    };

    this.next = function () {
        gui.draw();
        finish();
        if (!engine.is_finished() && engine.current_color() !== gui.color()) {
            if (!opponent.is_remote() && opponent !== gui) {
                this.play_opponent();
            }
        }
    };

    this.play = function () {
        move = null;
        if (engine.current_color() === gui.color() || opponent === gui) {
            move = gui.get_move();
            if (move) {
                apply_move(move);
                if (opponent.is_remote()) {
                    opponent.move(move);
                }
            } else if (engine.phase() === Zertz.Phase.SELECT_MARBLE_IN_POOL) {
                engine.select_marble_in_pool(gui.get_selected_color());
            }
        }
        if (move) {
            this.next();
        }
    };

    this.play_opponent = function () {
        move = null;
        if (!opponent.is_remote() || (opponent.is_remote() && opponent.is_ready())) {
            move = opponent.move();
        }
        if (move) {
            if (opponent.is_remote() && opponent.confirm()) {
                opponent.move(move);
            }
            apply_move(move);
            this.next();
        }
    };

    this.play_remote = function(move) {
        apply_move(move);
        gui.draw();
        finish();
    };

    this.ready = function (r) {
        ready = r;
        update_status();
    };

    this.redraw = function () {
        gui.draw();
    };

    init(e, g, o, s);
};