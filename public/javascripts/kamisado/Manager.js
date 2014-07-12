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
                engine.move_tower(gui.get_selected_tower(), gui.get_selected_cell());
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
                engine.move_tower(turn.from, turn.to);
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
            turn = other.move_tower();
            gui.move_tower({
                    x: turn.from.x,
                    y: turn.from.y,
                    tower_color: engine.find_tower(turn.from, engine.current_color()).tower_color },
                turn.to);
        }
    };

// private methods
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
    };

// private attributes
    var engine;
    var gui;
    var other;

    var level;

    var turn;

    init(e, gui_player, other_player);
};