// namespace Kamisado
var Kamisado = { };

Kamisado.load = function (callback) {
    $.getScript('/javascripts/utils/utils.js', function () {
        $.getScript('/javascripts/MCTS/MCTS.js', function () {
            $.getScript('/javascripts/MCTS/Node.js', function () {
                $.getScript('/javascripts/MCTS/Player.js', function () {
                    $.getScript('/javascripts/openxum/OpenXum.js', function () {
                        $.getScript('/javascripts/openxum/Manager.js', function () {
                            $.getScript('/javascripts/openxum/RemotePlayer.js', function () {
                                $.getScript('/javascripts/openxum/MCTSPlayer.js', function () {
                                    $.getScript('/javascripts/openxum/RestWebServicePlayer.js', function () {
                                        $.getScript('/javascripts/openxum/AIManager.js', function () {
                                            $.getScript('/javascripts/openxum/GamePage.js', function () {
                                                $.getScript('/javascripts/kamisado/Engine.js', function () {
                                                    $.getScript('/javascripts/kamisado/Manager.js', function () {
                                                        $.getScript('/javascripts/kamisado/Gui.js', function () {
                                                            $.getScript('/javascripts/kamisado/RandomPlayer.js', function () {
                                                                $.getScript('/javascripts/kamisado/RemotePlayer.js', function () {
                                                                    $.getScript('/javascripts/kamisado/RestWebServicePlayer.js', function () {
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
                        });
                    });
                });
            });
        });
    });
};
