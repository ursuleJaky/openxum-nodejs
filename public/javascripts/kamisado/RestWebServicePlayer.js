"use strict";

Kamisado.RestWebServicePlayer = function (c, e, l) {

// private attributes
    var _color;
    var _engine;
    var _level;
    var _login;
    var _manager;

    var _id;
    var _start;

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
        var m;

        if (!_start) {
            _start = true;
        }
        if (move) {
            $.ajax({
                type: "PUT",
                url: "http://127.0.0.1/openxum-ws-php/index.php/openxum/move",
                data: { id: _id, game: 'kamisado',
                    from: JSON.stringify(move.from()), to: JSON.stringify(move.to()) },
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
                data: { id: _id, game: 'kamisado', color: _color },
                xhrFields: { withCredentials: true },
                success: function (data) {
                    m = JSON.parse(data);
                    _manager.play_remote(new Kamisado.Move(m.from, m.to));
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
            data: { game: 'kamisado', color: 0, login: _login },
            xhrFields: { withCredentials: true },
            success: function (data) {
                var response = JSON.parse(data);

                _id = response.id;
                if (_engine.current_color() === _color && !_start) {
                    _manager.play_other();
                }
            }
        });
    };

    init(c, e, l);
};
