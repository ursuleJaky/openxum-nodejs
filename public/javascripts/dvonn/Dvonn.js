// namespace Dvonn
var Dvonn = { };

Dvonn.load = function (callback) {
    $.getScript('/javascripts/dvonn/Constants.js', function () {
        $.getScript('/javascripts/dvonn/Coordinates.js', function () {
            $.getScript('/javascripts/dvonn/Intersection.js', function () {
                $.getScript('/javascripts/dvonn/Piece.js', function () {
                    $.getScript('/javascripts/dvonn/Stack.js', function () {
                        $.getScript('/javascripts/dvonn/Engine.js', function () {
                            $.getScript('/javascripts/dvonn/Manager.js', function () {
                                $.getScript('/javascripts/dvonn/GuiPlayer.js', function () {
                                    $.getScript('/javascripts/dvonn/RandomPlayer.js', function () {
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
