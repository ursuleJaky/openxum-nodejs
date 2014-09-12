"use strict";

Invers.RestWebServicePlayer = function (c, e, l) {

// public methods
    this.color = function () {
        return mycolor;
    };

    this.is_ready = function() {
        return id !== -1;
    };

    this.is_remote = function () {
        return true;
    };

    this.move = function (move) {
        if (!start) {
            start = true;
        }
        if (move) {
            $.ajax({
                type: "PUT",
                url: "http://127.0.0.1/openxum-ws-php/index.php/openxum/move",
                data: { id: id, game: 'invers', move: JSON.stringify(move) },
                xhrFields: { withCredentials: true },
                success: function(data) {
                    var response = JSON.parse(data);

                    if (response.color === mycolor) {
                        manager.play_other();
                    }
                }
            });
        } else {
            $.ajax({
                type: "GET",
                url: "http://127.0.0.1/openxum-ws-php/index.php/openxum/move",
                data: { id: id, game: 'invers', color: mycolor },
                xhrFields: { withCredentials: true },
                success: function(data) {
                    var move = JSON.parse(data);

                    manager.play_remote(move);
                }
            });
        }
    };

    this.set_level = function (l) {
        level = l;
    };

    this.set_manager = function (m) {
        manager = m;
    };

// private method
    var init = function (c, e, l) {
        mycolor = c;
        engine = e;
        level = 10;
        login = l;
        start = false;
        id = -1;

        $.ajax({
            type: "POST",
            url: "http://127.0.0.1/openxum-ws-php/index.php/openxum/create",
            data: { game: 'invers', color: 0, login: login },
            xhrFields: { withCredentials: true },
            success: function(data) {
                var response = JSON.parse(data);

                id = response.id;
                if (engine.current_color() === mycolor && !start) {
                    manager.play_other();
                }
            }
        });
    };

// private attributes
    var mycolor;
    var engine;
    var level;
    var login;
    var manager;

    var id;
    var start;

    init(c, e, l);
};
