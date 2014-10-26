"use strict";

Tzaar.Manager = function (e, g, o, s) {
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
        return new Tzaar.Move();
    };

    this.get_current_color = function () {
        return _super.engine().current_color() === Tzaar.Color.BLACK ? 'Black' : 'White';
    };

    this.get_name = function () {
        return 'tzaar';
    };

    this.get_winner_color = function () {
        return _super.engine().winner_is() === Tzaar.Color.BLACK ? 'black' : 'white';
    };

    this.process_move = function () {
    };

    _super.that(this);
};


/*Tzaar.Manager = function (e, gui_player, other_player) {

// public methods
    this.load_level = function () {
        var key = 'openxum:tzaar:level';

        level = 10;
        if (localStorage[key]) {
            level = JSON.parse(localStorage[key]);
        }
        return level;
    };

    this.play = function () {
        if (engine.phase() === Tzaar.Phase.FIRST_MOVE) {
            if (other.is_remote()) {
                other.first_move(gui.get_selected_piece(), gui.get_selected_coordinates());
            }
            engine.first_move(gui.get_selected_piece(), gui.get_selected_coordinates());
            gui.unselect(false);
        } else if (engine.phase() === Tzaar.Phase.CAPTURE) {
            if (other.is_remote()) {
                other.capture(gui.get_selected_piece(), gui.get_selected_coordinates());
            }
            engine.capture(gui.get_selected_piece(), gui.get_selected_coordinates());
            gui.unselect(false);
        } else if (engine.phase() === Tzaar.Phase.CHOOSE) {
            if (other.is_remote()) {
                other.choose(gui.get_selected_capture(), gui.get_selected_make_stack(), gui.get_selected_pass());
            }
            engine.choose(gui.get_selected_capture(), gui.get_selected_make_stack(), gui.get_selected_pass());
            gui.unselect(gui.get_selected_pass());
        } else if (engine.phase() === Tzaar.Phase.SECOND_CAPTURE) {
            if (other.is_remote()) {
                other.capture(gui.get_selected_piece(), gui.get_selected_coordinates());
            }
            engine.capture(gui.get_selected_piece(), gui.get_selected_coordinates());
            gui.unselect(true);
        } else if (engine.phase() === Tzaar.Phase.MAKE_STRONGER) {
            if (other.is_remote()) {
                other.make_stack(gui.get_selected_piece(), gui.get_selected_coordinates());
            }
            engine.make_stack(gui.get_selected_piece(), gui.get_selected_coordinates());
            gui.unselect(true);
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
        if (engine.phase() === Tzaar.Phase.FIRST_MOVE) {
            var result = other.first_move();

            engine.first_move(result.origin, result.destination);
        } else if (engine.phase() === Tzaar.Phase.CAPTURE) {
            var result = other.capture();

            engine.capture(result.origin, result.destination);

            var choose = other.choose();

            engine.choose(choose === Tzaar.Phase.SECOND_CAPTURE, choose === Tzaar.Phase.MAKE_STRONGER, choose == Tzaar.Phase.PASS);
            if (choose === Tzaar.Phase.SECOND_CAPTURE) {
                result = other.capture();
                engine.capture(result.origin, result.destination);
            } else if (choose === Tzaar.Phase.MAKE_STRONGER) {
                result = other.make_stack();
                engine.make_stack(result.origin, result.destination);
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
                (engine.winner_is() === Tzaar.Color.BLACK ? "black" : "white") + "!</h4>";
            $("#winnerModal").modal("show");

            if (engine.winner_is() === gui.color()) {
                var win = load_win() + 1;

                localStorage['openxum:tzaar:win'] = JSON.stringify(win);
                if (win > 5) {
                    localStorage['openxum:tzaar:level'] = JSON.stringify(level + 10);
                    localStorage['openxum:tzaar:win'] = JSON.stringify(0);
                }
            }
        }
    };

    var load_win = function () {
        var key = 'openxum:tzaar:win';
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