// namespace Gipf
var Gipf = { };

Gipf.load = function (callback) {
    $.getScript('/javascripts/gipf/Engine.js', function () {
        $.getScript('/javascripts/gipf/Manager.js', function () {
            $.getScript('/javascripts/gipf/Gui.js', function () {
                $.getScript('/javascripts/gipf/RandomPlayer.js', function () {
                    callback();
                });
            });
        });
    });
};
