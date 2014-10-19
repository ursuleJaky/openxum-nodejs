// namespace Kamisado
var Kamisado = { };

Kamisado.load = function (callback) {
    $.getScript('/javascripts/utils/utils.js', function () {
        $.getScript('/javascripts/MCTS/MCTS.js', function () {
            $.getScript('/javascripts/MCTS/Node.js', function () {
                $.getScript('/javascripts/MCTS/Player.js', function () {
                    $.getScript('/javascripts/kamisado/Engine.js', function () {
                        $.getScript('/javascripts/kamisado/Manager.js', function () {
                            $.getScript('/javascripts/kamisado/Gui.js', function () {
                                $.getScript('/javascripts/kamisado/MCTSPlayer.js', function () {
                                    $.getScript('/javascripts/kamisado/RandomPlayer.js', function () {
                                        $.getScript('/javascripts/kamisado/RestWebServicePlayer.js', function () {
                                            $.getScript('/javascripts/kamisado/RemotePlayer.js', function () {
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
