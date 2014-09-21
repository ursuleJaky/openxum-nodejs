// namespace Gipf
var Gipf = { };

Gipf.load = function (callback) {
    $.getScript('/javascripts/gipf/Constants.js', function () {
        $.getScript('/javascripts/gipf/Coordinates.js', function () {
            $.getScript('/javascripts/gipf/Intersection.js', function () {
                $.getScript('/javascripts/gipf/Engine.js', function () {
                    $.getScript('/javascripts/gipf/Manager.js', function () {
                        $.getScript('/javascripts/gipf/GuiPlayer.js', function () {
                            $.getScript('/javascripts/gipf/RandomPlayer.js', function () {
                                callback();
                            });
                        });
                    });
                });
            });
        });
    });
};
