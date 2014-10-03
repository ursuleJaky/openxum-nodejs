"use strict";

Yinsh.Status = function (markerNumber, turnList) {
    this.markerNumber = markerNumber;
    this.turnList = turnList;
};

Yinsh.Manager = function (e, gui_player, other_player, s) {

// public methods
    this.load_level = function() {
        var key = 'openxum:yinsh:level';

        level = 10;
        if (localStorage[key]) {
            level = JSON.parse(localStorage[key]);
        }
        return level;
    };

    this.play = function () {
        if (engine.current_color() === gui.color()) {
            if (engine.phase() === Yinsh.Phase.PUT_RING) {
                if (other.is_remote()) {
                    other.put_ring(gui.get_selected_coordinates(), engine.current_color());
                }
                apply_move(new Yinsh.Move(Yinsh.MoveType.PUT_RING, gui.get_selected_coordinates()));
            } else if (engine.phase() === Yinsh.Phase.PUT_MARKER) {
                if (other.is_remote()) {
                    other.put_marker(gui.get_selected_coordinates(), engine.current_color());
                }
                apply_move(new Yinsh.Move(Yinsh.MoveType.PUT_MARKER, gui.get_selected_coordinates()));
            } else if (engine.phase() === Yinsh.Phase.MOVE_RING) {
                if (other.is_remote()) {
                    other.move_ring(gui.get_selected_ring(), gui.get_selected_coordinates());
                }
                apply_move(new Yinsh.Move(Yinsh.MoveType.MOVE_RING, gui.get_selected_ring(), gui.get_selected_coordinates()));
                gui.clear_selected_ring();
            } else if (engine.phase() === Yinsh.Phase.REMOVE_ROWS_AFTER ||
                engine.phase() === Yinsh.Phase.REMOVE_ROWS_BEFORE) {
                if (other.is_remote()) {
                    other.remove_row(gui.get_selected_row(), engine.current_color());
                }
                apply_move(new Yinsh.Move(Yinsh.MoveType.REMOVE_ROW, gui.get_selected_row()));
                gui.clear_selected_row();
            } else if (engine.phase() === Yinsh.Phase.REMOVE_RING_AFTER ||
                engine.phase() === Yinsh.Phase.REMOVE_RING_BEFORE) {
                if (other.is_remote()) {
                    other.remove_ring(gui.get_selected_coordinates(), engine.current_color());
                }
                apply_move(new Yinsh.Move(Yinsh.MoveType.REMOVE_RING, gui.get_selected_coordinates()));
            }
        }
        gui.draw();
        update_status();
        finish();
        if (!engine.is_finished() && engine.current_color() !== gui.color()) {
            if (!other.is_remote()) {
                this.play_other();
            }
        }
    };

    this.play_other = function () {
        if (engine.phase() === Yinsh.Phase.PUT_RING) {
            apply_move(new Yinsh.Move(Yinsh.MoveType.PUT_RING, other.put_ring()))
        } else if (engine.phase() === Yinsh.Phase.PUT_MARKER) {
            var from, to;

            from = other.put_marker();
            apply_move(new Yinsh.Move(Yinsh.MoveType.PUT_MARKER, from))
            to = other.move_ring(from);
            apply_move(new Yinsh.Move(Yinsh.MoveType.MOVE_RING, from, to))
        } else if (engine.phase() === Yinsh.Phase.REMOVE_ROWS_AFTER ||
            engine.phase() === Yinsh.Phase.REMOVE_ROWS_BEFORE) {
            apply_move(new Yinsh.Move(Yinsh.MoveType.REMOVE_ROW, other.remove_row()))
        } else if (engine.phase() === Yinsh.Phase.REMOVE_RING_AFTER ||
            engine.phase() === Yinsh.Phase.REMOVE_RING_BEFORE) {
            apply_move(new Yinsh.Move(Yinsh.MoveType.REMOVE_RING, other.remove_ring()))
        }
        gui.draw();
        update_status();
        finish();
        if (!engine.is_finished() && engine.current_color() !== gui.color()) {
            if (!other.is_remote()) {
                this.play_other();
            }
        }
    };

    this.play_remote = function (move) {
        apply_move(move);
        gui.draw();
        update_status();
        finish();
    };

    this.redraw = function () {
        gui.draw();
    };

// private methods
    var apply_move = function (move) {
        engine.move(move);
        moves += move.get() + ';';
    };

    var finish = function () {
        if (engine.is_finished()) {
            if (other.is_remote()) {
                other.finish(moves);
            }

            var popup = document.getElementById("winnerModalText");

            popup.innerHTML = "<h4>The winner is " +
                (engine.winner_is() === Yinsh.Color.BLACK ? "black" : "white") + "!</h4>";
            $("#winnerModal").modal("show");

            if (engine.winner_is() === gui.color()) {
                var win = load_win() + 1;

                localStorage['openxum:yinsh:win'] = JSON.stringify(win);
                if (win > 5) {
                    localStorage['openxum:yinsh:level'] = JSON.stringify(level + 10);
                    localStorage['openxum:yinsh:win'] = JSON.stringify(0);
                }
            }
        }
    };

    var load_win = function() {
        var key = 'openxum:yinsh:win';
        var win = 0;

        if (localStorage[key]) {
            win = JSON.parse(localStorage[key]);
        }
        return win;
    };

    var update_status = function () {
        status.markerNumber.innerHTML = engine.available_marker_number();
        status.turnList.innerHTML = "";

        var turn_list = engine.turn_list();
        for (var i = 0; i < turn_list.length; ++i) {
            status.turnList.innerHTML += turn_list[i] + "<br />";
        }
    };

// private attributes
    var engine = e;
    var gui = gui_player;
    var other = other_player;
    var status = s;

    var level;

    var moves = '';

    status.markerNumber.innerHTML = engine.available_marker_number();
};