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
    var _move_list;
    var _index;
    var _loop;

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
        if (!_gui.is_animate()) {
            _gui.draw();
        }
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
            $('#winnerBodyText').html('<h4>The winner is ' + _that.get_winner_color() + '!</h4>');
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
        _ready = _opponent === _gui;
        if (_ready) {
            _gui.ready(true);
        }
        _move = null;
        _moves = '';
    };

    var replay = function () {
        _move = _move_list[_index];
        _engine.move(_move);
        _gui.draw();
        _index++;
        if (_index === _move_list.length) {
            clearInterval(_loop);
            _gui.ready(true);
        }
    };

// public methods
    this.engine = function () {
        return _engine;
    };

    this.get_moves = function () {
        return _moves;
    };

    this.gui = function () {
        return _gui;
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
        finish();
        if (!_engine.is_finished() && _engine.current_color() !== _gui.color()) {
            if (!_opponent.is_remote() && _opponent !== _gui) {
                this.play_other(true);
            }
        }
    };

    this.play = function () {
        if (_engine.current_color() === _gui.color() || _opponent === _gui) {
            _move = _gui.get_move();
            if (_move) {
                apply_move(_move);
                if (_opponent.is_remote()) {
                    _opponent.move(_move);
                }
                _gui.unselect();
                this.next();
            } else {
                _that.process_move();
            }
        } else {
            apply_move(_move);
            if (_opponent.is_remote() && _opponent.confirm()) {
                _opponent.move(_move);
            }
            _gui.unselect();
            this.next();
        }
    };

    this.play_other = function (opponent) {
        if (opponent) {
            _move = null;
            if (!_opponent.is_remote() || (_opponent.is_remote() && _opponent.is_ready())) {
                _move = _opponent.move();
            }
            if (_move) {
                _gui.move(_move, _opponent.color());
            }
        }
    };

    this.play_remote = function (move) {
        _move = move;
        _gui.move(move, _opponent.color());
    };

    this.ready = function (r) {
        _ready = r;
        _gui.ready(r);
        update_status();
    };

    this.redraw = function () {
        _gui.draw();
    };

    this.replay = function (moves, pause) {
        _moves = moves;
        _index = 0;
        _move_list = [];
        moves.split(";").forEach(function (move) {
            if (move !== '') {
                _move = _that.build_move();
                _move.parse(move);
                _move_list.push(_move);
                if (!pause) {
                    _engine.move(move);
                }
            }
        });
        if (pause) {
            _loop = setInterval(replay, 1000);
        } else {
            this.ready(true);
        }
    };

    this.that = function (t) {
        _that = t;
        update_status();
    };

    init(e, g, o, s);
};