"use strict";

Invers.Status = function (e) {
// private attributes
    var element = e;

    this.set_text = function (t) {
        e.innerHTML = t;
    };
};

Invers.Manager = function (e, g, o, s) {

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
            status.set_text(engine.current_color() === Invers.Color.RED ? 'Red' : 'Yellow');
        }
    };

    var apply_move = function (move) {
        engine.move(move);
        moves += move.get() + ';';
        update_status();
    };

    var load_win = function () {
        var key = 'openxum:invers:win';
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
                (engine.winner_is() === Invers.Color.RED ? "red" : "yellow") + "!</h4>";
            $("#winnerModal").modal("show");

            if (engine.winner_is() === gui.color()) {
                var win = load_win() + 1;

                localStorage['openxum:invers:win'] = JSON.stringify(win);
                if (win > 5) {
                    localStorage['openxum:invers:level'] = JSON.stringify(level + 10);
                    localStorage['openxum:invers:win'] = JSON.stringify(0);
                }
            }
        }
    };

    var init = function (e, g, o, s) {
        engine = e;
        gui = g;
        opponent = o;
        status = s;
        ready = false;
        update_status();
    };

// public methods
    this.load_level = function () {
        var key = 'openxum:invers:level';

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
            if (!opponent.is_remote()) {
                this.play_opponent();
            }
        }
    };

    this.play = function () {
        move = null;
        if (engine.current_color() === gui.color()) {
            if (engine.phase() === Invers.Phase.PUSH_TILE && gui.get_move()) {
                move = gui.get_move();
                apply_move(move);
                if (opponent.is_remote()) {
                    opponent.move(move);
                }
                gui.unselect();
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