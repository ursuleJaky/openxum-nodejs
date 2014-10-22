"use strict";

Zertz.Manager = function (e, g, o, s) {
// private attributes
    var _super = new OpenXum.Manager(e, g, o, s);

// public methods
    this.load_level = _super.load_level;
    this.next = _super.next;
    this.play = _super.play;
    this.play_other = _super.play_other;
    this.play_remote = _super.play_remote;
    this.ready = _super.ready;
    this.redraw = _super.redraw;
    this.replay = _super.replay;

    this.build_move = function () {
        return new Zertz.Move();
    };

    this.get_current_color = function () {
        return _super.engine().current_color() === Zertz.Color.ONE ? 'One' : 'Two';
    };

    this.get_name = function () {
        return 'zertz';
    };

    this.get_winner_color = function () {
        return _super.engine().winner_is() === Zertz.Color.ONE ? 'one' : 'two';
    };

    this.process_move = function () {
        if (_super.engine().phase() === Zertz.Phase.SELECT_MARBLE_IN_POOL) {
            _super.engine().select_marble_in_pool(_super.gui().get_selected_color());
        }
    };

    _super.that(this);
};