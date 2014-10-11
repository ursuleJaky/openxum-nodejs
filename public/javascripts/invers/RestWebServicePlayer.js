"use strict";

Invers.RestWebServicePlayer = function (c, e, l) {

// private attributes
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

        $.ajax({
            type: "POST",
            url: "http://127.0.0.1/openxum-ws-php/index.php/openxum/create",
            data: { game: 'invers', color: 0, login: _login },
            xhrFields: { withCredentials: true },
            success: function (data) {
                var response = JSON.parse(data);

                id = response.id;
                if (engine.current_color() === _color && !_start) {
                    _manager.play_other();
                }
            }
        });
    };

// public methods
    this.color = function () {
        return _color;
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
                data: { id: id, game: 'invers', move: JSON.stringify(move) },
                xhrFields: { withCredentials: true },
                success: function (data) {
                    if (JSON.parse(data).color === _color) {
                        _manager.play_other();
                    }
                }
            });
        } else {
            $.ajax({
                type: "GET",
                url: "http://127.0.0.1/openxum-ws-php/index.php/openxum/move",
                data: { id: id, game: 'invers', color: mycolor },
                xhrFields: { withCredentials: true },
                success: function (data) {
                    _manager.play_remote(JSON.parse(data));
                }
            });
        }
    };

    this.set_level = function (l) {
        _level = l;
    };

    this.set_manager = function (m) {
        _manager = m;
    };

    init(c, e, l);
};
