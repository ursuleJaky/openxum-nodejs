"use strict";

OpenXum.Status = function (e) {
// private attributes
    var element = e;

    this.set_text = function (t) {
        e.innerHTML = t;
    };
};

OpenXum.Manager = function (e, g, o, s) {
// private attributes
    var _that;
    var _engine;
    var _gui;
    var _opponent;
    var _status;
    var _ready;

    var _level;

    var _move;
    var _moves;

// private methods
    var update_status = function () {
        if (_opponent.is_remote()) {
            if (_ready) {
                if (_engine.current_color() === _opponent.color()) {
                    _status.set_text('wait');
                } else {
                    _status.set_text('ready');
                }
            } else {
                _status.set_text('disconnect');
            }
        } else {
            _status.set_text(_that.get_current_color());
        }
    };

    var apply_move = function (move) {
        _engine.move(move);
        _moves += move.get() + ';';
        update_status();
    };

    var load_win = function () {
        var key = 'openxum' + _that.get_name() + ':win';
        var win = 0;

        if (localStorage[key]) {
            win = JSON.parse(localStorage[key]);
        }
        return win;
    };

    var finish = function () {
        if (_engine.is_finished()) {
            var popup = document.getElementById("winnerModalText");

            popup.innerHTML = "<h4>The winner is " + _that.get_winner_color() + "!</h4>";
            $("#winnerModal").modal("show");

            if (_engine.winner_is() === _gui.color()) {
                var win = load_win() + 1;

                localStorage['openxum:' + _that.get_name() + ':win'] = JSON.stringify(win);
                if (win > 5) {
                    localStorage['openxum:' + _that.get_name() + ':level'] = JSON.stringify(_level + 10);
                    localStorage['openxum:' + _that.get_name() + ':win'] = JSON.stringify(0);
                }
            }
        }
    };

    var init = function (e, g, o, s) {
        _engine = e;
        _gui = g;
        _opponent = o;
        _status = s;
        _ready = false;
    };

// public methods
    this.engine = function () {
        return _engine;
    };

    this.load_level = function () {
        var key = 'openxum:' + _that.get_name() + ':level';

        _level = 10;
        if (localStorage[key]) {
            _level = JSON.parse(localStorage[key]);
        }
        return _level;
    };

    this.next = function () {
        _gui.draw();
        finish();
        if (!_engine.is_finished() && _engine.current_color() !== _gui.color()) {
            if (!_opponent.is_remote()) {
                this.play_opponent();
            }
        }
    };

    this.play = function () {
        _move = null;
        if (_engine.current_color() === _gui.color()) {
            if (_gui.get_move()) {
                _move = _gui.get_move();
                apply_move(_move);
                if (_opponent.is_remote()) {
                    _opponent.move(_move);
                }
                _gui.unselect();
            }
        }
        if (_move) {
            this.next();
        }
    };

    this.play_opponent = function () {
        _move = null;
        if (!_opponent.is_remote() || (_opponent.is_remote() && _opponent.is_ready())) {
            _move = _opponent.move();
        }
        if (_move) {
            apply_move(_move);
            this.next();
        }
    };

    this.play_remote = function(move) {
        apply_move(move);
        if (_opponent.is_remote() && _opponent.confirm()) {
            _opponent.move(move);
        }
        _gui.draw();
        finish();
    };

    this.ready = function (r) {
        _ready = r;
        update_status();
    };

    this.redraw = function () {
        _gui.draw();
    };

    this.that = function (t) {
        _that = t;
        update_status();
    };

    init(e, g, o, s);
};