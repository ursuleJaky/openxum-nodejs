"use strict";

Zertz.Manager = function (e, gui_player, other_player) {

// public methods
    this.load_level = function () {
        var key = 'openxum:zertz:level';

        level = 10;
        if (localStorage[key]) {
            level = JSON.parse(localStorage[key]);
        }
        return level;
    };

    this.play = function () {
        if (engine.phase() === Zertz.Phase.SELECT_MARBLE_IN_POOL) {
            engine.select_marble_in_pool(gui.get_selected_color());
        } else if (engine.phase() === Zertz.Phase.PUT_MARBLE) {
            engine.put_marble(gui.get_selected_coordinates(), gui.get_selected_color(), gui.color());
            gui.unselect();
        } else if (engine.phase() === Zertz.Phase.REMOVE_RING) {
            engine.remove_ring(gui.get_selected_coordinates(), gui.color());
            gui.unselect();
        } else if (engine.phase() === Zertz.Phase.CAPTURE) {
            engine.capture(gui.get_selected_marble(), gui.get_selected_coordinates(), gui.color());
            gui.unselect();
        }
        gui.draw();
        finish();
        if (engine.current_color() !== gui.color()) {
            if (!other.is_remote()) {
                this.play_other();
            }
        }
    };

    this.play_other = function () {
        if (engine.phase() === Zertz.Phase.SELECT_MARBLE_IN_POOL) {
            var marble_color = other.select_marble_in_pool();

            engine.select_marble_in_pool(marble_color);
            engine.put_marble(other.put_marble(), marble_color, other.color());
            engine.remove_ring(other.remove_ring(), other.color());
        } else if (engine.phase() === Zertz.Phase.CAPTURE) {
            while (engine.current_color() === other.color()) {
                var result = other.capture();

                engine.capture(result.origin, result.captured, other.color());
            }
        }

        if (engine.current_color() !== gui.color()) {
            console.log('oups');
        }

        gui.draw();
        finish();
    };

    this.redraw = function () {
        gui.draw();
    };

// private methods
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

    var load_win = function () {
        var key = 'openxum:zertz:win';
        var win = 0;

        if (localStorage[key]) {
            win = JSON.parse(localStorage[key]);
        }
        return win;
    };

    var init = function (e, g, o) {
        engine = e;
        gui = g;
        other = o;
        remove_row = false;
    };

// private attributes
    var engine;
    var gui;
    var other;

    var level;

    var turn;

    var remove_row;

    init(e, gui_player, other_player);
};