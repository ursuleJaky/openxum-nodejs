// namespace Invers
var Invers = { };

Invers.load = function (callback) {
    $.getScript('/javascripts/utils/utils.js', function () {
        $.getScript('/javascripts/MCTS/MCTS.js', function () {
            $.getScript('/javascripts/MCTS/Node.js', function () {
                $.getScript('/javascripts/MCTS/Player.js', function () {
                    $.getScript('/javascripts/invers/Constants.js', function () {
                        $.getScript('/javascripts/invers/Engine.js', function () {
                            $.getScript('/javascripts/invers/Manager.js', function () {
                                $.getScript('/javascripts/invers/GuiPlayer.js', function () {
                                    $.getScript('/javascripts/invers/MCTSPlayer.js', function () {
                                        $.getScript('/javascripts/invers/RemotePlayer.js', function () {
                                            $.getScript('/javascripts/invers/RestWebServicePlayer.js', function () {
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
        });
    });
};
