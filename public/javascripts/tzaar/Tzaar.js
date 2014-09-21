// namespace Tzaar
var Tzaar = { };

Tzaar.load = function (callback) {
    $.getScript('/javascripts/tzaar/Constants.js', function () {
        $.getScript('/javascripts/tzaar/Coordinates.js', function () {
            $.getScript('/javascripts/tzaar/Intersection.js', function () {
                $.getScript('/javascripts/tzaar/Piece.js', function () {
                    $.getScript('/javascripts/tzaar/Stack.js', function () {
                        $.getScript('/javascripts/tzaar/Engine.js', function () {
                            $.getScript('/javascripts/tzaar/Manager.js', function () {
                                $.getScript('/javascripts/tzaar/GuiPlayer.js', function () {
                                    $.getScript('/javascripts/tzaar/RandomPlayer.js', function () {
                                        callback();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};
