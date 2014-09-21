// namespace Zertz
var Zertz = { };

Zertz.load = function (callback) {
    $.getScript('/javascripts/zertz/Constants.js', function () {
        $.getScript('/javascripts/zertz/Coordinates.js', function () {
            $.getScript('/javascripts/zertz/Intersection.js', function () {
                $.getScript('/javascripts/zertz/Engine.js', function () {
                    $.getScript('/javascripts/zertz/Manager.js', function () {
                        $.getScript('/javascripts/zertz/GuiPlayer.js', function () {
                            $.getScript('/javascripts/zertz/RandomPlayer.js', function () {
                                callback();
                            });
                        });
                    });
                });
            });
        });
    });
};
