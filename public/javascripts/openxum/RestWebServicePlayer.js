"use strict";

OpenXum.RestWebServicePlayer = function (c, e, l) {
// private attributes
    var _that;
    var _color;
    var _engine;
    var _level;
    var _login;
    var _manager;

    var _id;
    var _start;

// private method
    var init = function (c, e, l) {
        _color = c;
        _engine = e;
        _level = 10;
        _login = l;
        _start = false;
        _id = -1;
    };

    var create = function () {
        $.ajax({
            type: "POST",
            url: "http://127.0.0.1/openxum-ws-php/index.php/openxum/create",
            data: { game: _that.get_name(), color: 0, login: _login },
            xhrFields: { withCredentials: true },
            success: function (data) {
                _id = JSON.parse(data).id;
                _manager.ready(true);
                if (_engine.current_color() === _color && !_start) {
                    _manager.play_opponent();
                }
            }
        });
    };

// public methods
    this.color = function () {
        return _color;
    };

    this.confirm = function () {
        return true;
    };

    this.is_ready = function () {
        return _id !== -1;
    };

    this.is_remote = function () {
        return true;
    };

    this.move = function (move) {
        if (!_start) {
            _start = true;
        }
        if (move) {
            $.ajax({
                type: "PUT",
                url: "http://127.0.0.1/openxum-ws-php/index.php/openxum/move",
                data: { id: _id, game: _that.get_name(), move: JSON.stringify(move.to_object()) },
                xhrFields: { withCredentials: true },
                success: function (data) {
                    if (JSON.parse(data).color === _color) {
                        _manager.play_opponent();
                    }
                }
            });
        } else {
            $.ajax({
                type: "GET",
                url: "http://127.0.0.1/openxum-ws-php/index.php/openxum/move",
                data: { id: _id, game: _that.get_name(), color: _color },
                xhrFields: { withCredentials: true },
                success: function (data) {
                    _manager.play_remote(_that.buildMove(JSON.parse(data)));
                }
            });
        }
        return null;
    };

    this.set_level = function (l) {
        _level = l;
    };

    this.set_manager = function (m) {
        _manager = m;
    };

    this.that = function (t) {
        _that = t;
        create();
    };

    init(c, e, l);
};
