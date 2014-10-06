// namespace Tzaar
var Tzaar = { };

Tzaar.load = function (callback) {
    $.getScript('/javascripts/tzaar/Engine.js', function () {
        $.getScript('/javascripts/tzaar/Manager.js', function () {
            $.getScript('/javascripts/tzaar/Gui.js', function () {
                $.getScript('/javascripts/tzaar/RandomPlayer.js', function () {
                    callback();
                });
            });
        });
    });
};
