// namespace Zertz
var Zertz = { };

Zertz.load = function (callback) {
    $.getScript('/javascripts/zertz/Engine.js', function () {
        $.getScript('/javascripts/zertz/Manager.js', function () {
            $.getScript('/javascripts/zertz/Gui.js', function () {
                $.getScript('/javascripts/zertz/RandomPlayer.js', function () {
                    $.getScript('/javascripts/zertz/RemotePlayer.js', function () {
                        callback();
                    });
                });
            });
        });
    });
};
