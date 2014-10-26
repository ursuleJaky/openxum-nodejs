// namespace Tzaar
var Tzaar = { };

Tzaar.load = function (callback) {
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
                                                $.getScript('/javascripts/tzaar/Engine.js', function () {
                                                    $.getScript('/javascripts/tzaar/Manager.js', function () {
                                                        $.getScript('/javascripts/tzaar/Gui.js', function () {
                                                            $.getScript('/javascripts/tzaar/RandomPlayer.js', function () {
                                                                $.getScript('/javascripts/tzaar/RemotePlayer.js', function () {
                                                                    $.getScript('/javascripts/tzaar/RestWebServicePlayer.js', function () {
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
