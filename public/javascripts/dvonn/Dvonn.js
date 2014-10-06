// namespace Dvonn
var Dvonn = { };

Dvonn.load = function (callback) {
    $.getScript('/javascripts/dvonn/Engine.js', function () {
        $.getScript('/javascripts/dvonn/Manager.js', function () {
            $.getScript('/javascripts/dvonn/Gui.js', function () {
                $.getScript('/javascripts/dvonn/RandomPlayer.js', function () {
                    callback();
                });
            });
        });
    });
};
