"use strict";

Gipf.Manager = function (e, gui_player, other_player) {

// public methods
    this.load_level = function () {
        var key = 'openxum:gipf:level';

        level = 10;
        if (localStorage[key]) {
            level = JSON.parse(localStorage[key]);
        }
        return level;
    };

    this.play = function () {
        if (engine.phase() === Gipf.Phase.REMOVE_ROWS) {
            if (other.is_remote()) {
                other.remove_row(gui.get_selected_coordinates());
            }
            engine.remove_row(gui.get_selected_coordinates(), gui_player.color(), remove_row);
            gui.unselect();
        } else {
            remove_row = false;
            if (engine.phase() === Gipf.Phase.PUT_FIRST_PIECE) {
                if (other.is_remote()) {
                    other.put_first_piece(gui.get_selected_coordinates());
                }
                engine.put_first_piece(gui.get_selected_coordinates(), gui_player.color(), engine.type() != Gipf.GameType.BASIC);
                gui.unselect();
            } else if (engine.phase() === Gipf.Phase.PUT_PIECE) {
                if (other.is_remote()) {
                    other.put_piece(gui.get_selected_piece());
                }
                engine.put_piece(gui.get_selected_piece(), gui_player.color());
            } else if (engine.phase() === Gipf.Phase.PUSH_PIECE) {
                if (other.is_remote()) {
                    other.push_piece(gui.get_selected_piece(), gui.get_selected_coordinates());
                }
                engine.push_piece(gui.get_selected_piece(), gui.get_selected_coordinates(), gui_player.color());
                gui.unselect();
            }
        }
        gui.draw();
        finish();
        if (engine.current_color() !== gui.color()) {
            if (!other.is_remote()) {
                this.play_other();
                remove_row = engine.phase() === Gipf.Phase.REMOVE_ROWS;
            }
        }
    };

    this.play_other = function () {
        if (engine.phase() === Gipf.Phase.REMOVE_ROWS) {
            engine.remove_row(other.remove_row(), other_player.color(), false);
        } else if (engine.phase() === Gipf.Phase.PUT_FIRST_PIECE) {
            engine.put_first_piece(other.put_first_piece(), other_player.color(), engine.type() != Gipf.GameType.BASIC);
        } else if (engine.phase() === Gipf.Phase.PUT_PIECE) {
            var coordinates = other.put_piece();

            engine.put_piece(coordinates, other_player.color());
            if (engine.phase() === Gipf.Phase.PUSH_PIECE) {
                engine.push_piece(coordinates, other.push_piece(coordinates), other_player.color());
                while (engine.phase() === Gipf.Phase.REMOVE_ROWS && engine.current_color() !== gui.color()) {
                    engine.remove_row(other.remove_row(), other_player.color(), true);
                }
            }
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

            popup.innerHTML = "<h4>The winner is " +
                (engine.winner_is() === Gipf.Color.BLACK ? "black" : "white") + "!</h4>";
            $("#winnerModal").modal("show");

            if (engine.winner_is() === gui.color()) {
                var win = load_win() + 1;

                localStorage['openxum:gipf:win'] = JSON.stringify(win);
                if (win > 5) {
                    localStorage['openxum:gipf:level'] = JSON.stringify(level + 10);
                    localStorage['openxum:gipf:win'] = JSON.stringify(0);
                }
            }
        }
    };

    var load_win = function () {
        var key = 'openxum:gipf:win';
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