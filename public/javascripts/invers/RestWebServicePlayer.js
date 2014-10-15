"use strict";

Invers.RestWebServicePlayer = function (c, e, l) {
// private attributes
    var _super = new OpenXum.RestWebServicePlayer(c, e, l);

// public methods
    this.color = _super.color;
    this.confirm = _super.confirm;
    this.is_ready = _super.is_ready;
    this.is_remote = _super.is_remote;
    this.move = _super.move;
    this.set_level = _super.set_level;
    this.set_manager = _super.set_manager;

    this.buildMove = function (o) {
        return new Invers.Move(o.color, o.letter, o.number, o.position);
    };

    this.get_name = function () {
        return 'invers';
    };

    _super.that(this);
};
