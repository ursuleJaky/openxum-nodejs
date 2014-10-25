"use strict";

Dvonn.Manager = function (e, g, o, s) {
// private attributes
    var _super = new OpenXum.Manager(e, g, o, s);

// public methods
    this.engine = _super.engine;
    this.load_level = _super.load_level;
    this.next = _super.next;
    this.play = _super.play;
    this.play_other = _super.play_other;
    this.play_remote = _super.play_remote;
    this.ready = _super.ready;
    this.redraw = _super.redraw;
    this.replay = _super.replay;

    this.build_move = function () {
        return new Dvonn.Move();
    };

    this.get_current_color = function () {
        return _super.engine().current_color() === Dvonn.Color.BLACK ? 'Black' : 'White';
    };

    this.get_name = function () {
        return 'dvonn';
    };

    this.get_winner_color = function () {
        return _super.engine().winner_is() === Dvonn.Color.BLACK ? 'black' : 'white';
    };

    this.process_move = function () {
    };

    _super.that(this);
};

/*Dvonn.Manager = function (e, gui_player, other_player) {

// public methods
    this.load_level = function () {
        var key = 'openxum:dvonn:level';

        level = 10;
        if (localStorage[key]) {
            level = JSON.parse(localStorage[key]);
        }
        return level;
    };

    this.play = function () {
        if (engine.phase() === Dvonn.Phase.PUT_DVONN_PIECE) {
            if (other.is_remote()) {
                other.put_dvonn_piece(gui.get_selected_coordinates());
            }
            engine.put_dvonn_piece(gui.get_selected_coordinates());
        } else if (engine.phase() === Dvonn.Phase.PUT_PIECE) {
            if (other.is_remote()) {
                other.put_piece(gui.get_selected_coordinates());
            }
            engine.put_piece(gui.get_selected_coordinates(), engine.current_color());
        } else if (engine.phase() === Dvonn.Phase.MOVE_STACK) {
            if (other.is_remote()) {
                other.move_stack(gui.get_selected_piece(), gui.get_selected_coordinates());
            }
            engine.move_stack(gui.get_selected_piece(), gui.get_selected_coordinates());
            gui.unselect();

            var list = engine.remove_isolated_stacks();

            if (list.length > 0) {
                if (other.is_remote()) {
                    other.remove_isolated_stacks(list);
                }
            }
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
        if (engine.phase() === Dvonn.Phase.PUT_DVONN_PIECE) {
            engine.put_dvonn_piece(other.put_dvonn_piece());
        } else if (engine.phase() === Dvonn.Phase.PUT_PIECE) {
            engine.put_piece(other.put_piece(), engine.current_color());
        } else if (engine.phase() === Dvonn.Phase.MOVE_STACK) {
            var result = other.move_stack();

            if (result.ok) {
                engine.move_stack(result.origin, result.destination);
                engine.remove_isolated_stacks();
            } else {
                engine.move_no_stack();
            }
        }
        gui.draw();
        finish();
    };

    this.redraw = function() {
        gui.draw();
    };

// private methods
    var finish = function () {
        if (engine.is_finished()) {
            var popup = document.getElementById("winnerModalText");

            popup.innerHTML = "<h4>The winner is " +
                (engine.winner_is() === Dvonn.Color.BLACK ? "black" : "white") + "!</h4>";
            $("#winnerModal").modal("show");

            if (engine.winner_is() === gui.color()) {
                var win = load_win() + 1;

                localStorage['openxum:dvonn:win'] = JSON.stringify(win);
                if (win > 5) {
                    localStorage['openxum:dvonn:level'] = JSON.stringify(level + 10);
                    localStorage['openxum:dvonn:win'] = JSON.stringify(0);
                }
            }
        }
    };

    var load_win = function () {
        var key = 'openxum:dvonn:win';
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
    };

// private attributes
    var engine;
    var gui;
    var other;

    var level;

    var turn;

    init(e, gui_player, other_player);
};*/