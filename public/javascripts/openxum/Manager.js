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

    var computeElo = function (elo, win) {
        var k = 20;
        var difference = elo.ai - elo.player;
        var expectedScoreWinner = 1 / (1 + Math.pow(10, difference / 400));
        var e = k * (1 - expectedScoreWinner);

        if (win) {
            return ({'ai': elo.ai - e, 'player': elo.player + e, 'last': elo.last - 1});
        } else {
            return ({'ai': elo.ai + e, 'player': elo.player - e, 'last': elo.last - 1});
        }
    };

    var load_win = function () {
        var key = 'openxum' + _that.get_name() + ':win';
        var win = 0;

        if (localStorage[key]) {
            win = JSON.parse(localStorage[key]);
        }
        return win;
    };

    var load_elo = function () {
        var key = 'openxum:' + _that.get_name() + ':elo';
        var elo = {'ai': 1000, 'player': 1000, 'last': 3};

        if (localStorage[key]) {
            elo = JSON.parse(localStorage[key]);
        }
        return elo;
    };

    var finish = function () {
        if (_engine.is_finished()) {
            var winner = false;

            $('#winnerBodyText').html('<h4>The winner is ' + _that.get_winner_color() + '!</h4>');
            $("#winnerModal").modal("show");
            if (_engine.winner_is() === _gui.color()) {
                winner = true;
            }
            var elo = load_elo();
            var new_elo = computeElo(elo, winner);

            localStorage['openxum:' + _that.get_name() + ':elo'] = JSON.stringify(new_elo);

            var eloDiff = elo.ai - elo.player;

            if (eloDiff < -40 && new_elo.last < 1) {
                localStorage['openxum:' + _that.get_name() + ':level'] = JSON.stringify(_level + 10);
                localStorage['openxum:' + _that.get_name() + ':elo'] = JSON.stringify(
                    {
                        'ai': new_elo.ai,
                        'player': new_elo.player,
                        'last': 3
                    });
            } else if (eloDiff > 40 && new_elo.last < 1) {
                if (_level > 10) {
                    localStorage['openxum:' + _that.get_name() + ':level'] = JSON.stringify(_level - 10);
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
                    _engine.move(_move);
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