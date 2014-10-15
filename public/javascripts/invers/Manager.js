"use strict";

Invers.Manager = function (e, g, o, s) {
// private attributes
    var _super = new OpenXum.Manager(e, g, o, s);

// public methods
    this.load_level = _super.load_level;
    this.next = _super.next;
    this.play = _super.play;
    this.play_opponent = _super.play_opponent;
    this.play_remote = _super.play_remote;
    this.ready = _super.ready;
    this.redraw = _super.redraw;

    this.get_current_color = function () {
        return _super.engine().current_color() === Invers.Color.RED ? 'Red' : 'Yellow';
    };

    this.get_name = function () {
        return 'invers';
    };

    this.get_winner_color = function () {
        return _super.engine().winner_is() === Invers.Color.RED ? 'red' : 'yellow';
    };

    this.process_move = function () {
    };

    _super.that(this);
};