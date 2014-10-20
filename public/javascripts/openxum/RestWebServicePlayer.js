"use strict";

OpenXum.RestWebServicePlayer = function (c, e, l) {
// private attributes
    var _that;
    var _color;
    var _engine;
    var _level;
    var _url;
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
            url: _url + "openxum/create",
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
                url: _url + "openxum/move",
                data: { id: _id, game: _that.get_name(), move: JSON.stringify(move.to_object()) },
                xhrFields: { withCredentials: true },
                success: function (data) {
                    _manager.play_other(JSON.parse(data).color === _color);
                }
            });
        } else {
            $.ajax({
                type: "GET",
                url: _url + "openxum/move",
                data: { id: _id, game: _that.get_name(), color: _color },
                xhrFields: { withCredentials: true },
                success: function (data) {
                    _manager.play_remote(_that.buildMove(JSON.parse(data)));
                }
            });
        }
        return null;
    };

    this.reinit = function (e) {
        create();
    };

    this.set_level = function (l) {
        _level = l;
    };

    this.set_manager = function (m) {
        _manager = m;
    };

    this.set_url = function (u) {
        _url = u;
        create();
    };

    this.that = function (t) {
        _that = t;
    };

    init(c, e, l);
};
