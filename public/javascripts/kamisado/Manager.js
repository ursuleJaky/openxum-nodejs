"use strict";

Kamisado.Manager = function (e, gui_player, other_player) {

// public methods
    this.load_level = function() {
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
                if (other.is_remote()) {
                    other.move_tower(move.from(), move.to());
                }
                gui.unselect();
            }
            gui.draw();
            finish();
            if (engine.current_color() !== gui.color()) {
                if (!other.is_remote()) {
                    this.play_other();
                }
            }
        } else {
            if (engine.phase() === Kamisado.Phase.MOVE_TOWER) {
                apply_move(move);
                if (other.is_remote() && other.confirm()) {
                    other.move_tower(move.from(), move.to());
                }
                gui.unselect();
            }
            gui.draw();
            finish();
            if (engine.current_color() !== gui.color()) {
                if (!other.is_remote()) {
                    this.play_other();
                }
            }
        }
    };

    this.play_other = function() {
        if (engine.phase() === Kamisado.Phase.MOVE_TOWER) {
            if (!other.is_remote() || (other.is_remote() && other.is_ready())) {
                move = other.move_tower();
            }
            if (!other.is_remote()) {
                gui.move_tower({
                        x: move.from().x,
                        y: move.from().y,
                        tower_color: engine.find_tower(move.from(), engine.current_color()).tower_color },
                    move.to());
            }
        }
    };

    this.play_remote = function(m) {
        move = m;
        if (engine.phase() === Kamisado.Phase.MOVE_TOWER) {
            gui.move_tower({
                    x: move.from().x,
                    y: move.from().y,
                    tower_color: engine.find_tower(move.from(), engine.current_color()).tower_color },
                move.to());
        }
    };

    this.redraw = function () {
        gui.draw();
    };

// private methods
    var apply_move = function (move) {
        engine.move(move);
        moves += move.get() + ';';
    };

    var finish = function() {
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

    var load_win = function() {
        var key = 'openxum:kamisado:win';
        var win = 0;

        if (localStorage[key]) {
            win = JSON.parse(localStorage[key]);
        }
        return win;
    };

    var init = function(e, g, o) {
        engine = e;
        gui = g;
        other = o;
        moves = '';
    };

// private attributes
    var engine;
    var gui;
    var other;

    var level;

    var move;
    var moves;

    init(e, gui_player, other_player);
};