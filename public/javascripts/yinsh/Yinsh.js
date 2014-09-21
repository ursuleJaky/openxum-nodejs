// namespace Yinsh
var Yinsh = { };

Yinsh.load = function (callback) {
    $.getScript('/javascripts/yinsh/Constants.js', function () {
        $.getScript('/javascripts/yinsh/Coordinates.js', function () {
            $.getScript('/javascripts/yinsh/Intersection.js', function () {
                $.getScript('/javascripts/yinsh/Engine.js', function () {
                    $.getScript('/javascripts/yinsh/Manager.js', function () {
                        $.getScript('/javascripts/yinsh/GuiPlayer.js', function () {
                            $.getScript('/javascripts/yinsh/RandomPlayer.js', function () {
                                $.getScript('/javascripts/yinsh/RemotePlayer.js', function () {
                                    callback();
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};
