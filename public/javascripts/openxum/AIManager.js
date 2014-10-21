OpenXum.ProgressStatus = function (pb, r, p, n) {
// private attributes
    var progress_bar = pb;
    var abstract;
    var list;
    var progress = p;
    var simulation_number = n;

    var first_victories = 0;
    var second_victories = 0;
    var index = 0;

    var build_move_list = function (moves) {
        var list = $('<ol>');

        for (var index = 0; index < moves.length; ++index) {
            var item = $('<li>');

            item.html(moves[index].to_string());
            item.appendTo(list);
        }
        return list;
    };

    var compute_pourcent = function () {
        var x = index / simulation_number * 100;

        return (Math.round(x * 100) / 100) + '%';
    };

    var init = function (r) {
        var pourcent = compute_pourcent();

        progress_bar.width(pourcent);
        progress_bar.text(pourcent);
        progress.addClass('active');
        abstract = r.find('div#abstract');
        list = r.find('div#list');
    };

    var update = function () {
        var pourcent = compute_pourcent();

        progress_bar.width(pourcent);
        progress_bar.text(pourcent);
        abstract.html('Results: ' + first_victories + ' first victories and ' +
            second_victories + ' second victories <br>');
    };

// public methods
    this.display_games = function (moves) {
        var main_div = $('<div/>', {
            class: 'panel-group',
            id: 'accordion'
        });

        main_div.appendTo(list);
        for (var index = 0; index < moves.length; ++index) {
            var panel = $('<div/>', {
                class: 'panel panel-default'
            });
            var panel_heading = $('<div/>', {
                class: 'panel-heading'
            });
            var title = $('<h4/>', {
                class: 'panel-title'
            });
            var collapse = $('<a/>', {
                'data-toggle': 'collapse',
                'data-parent': '#accordion',
                href: '#collapse' + (index + 1)
            });
            var collapse_div = $('<div/>', {
                id: 'collapse' + (index + 1),
                class: 'panel-collapse collapse' + (index === 0 ? ' in' : '')
            });
            var panel_body = $('<div/>', {
                class: 'panel-body'
            });

            collapse.html('Game #' + (index + 1));
            collapse.appendTo(title);
            title.appendTo(panel_heading);
            panel_heading.appendTo(panel);

            var move_list = build_move_list(moves[index]);

            move_list.appendTo(panel_body);
            panel_body.appendTo(collapse_div);
            collapse_div.appendTo(panel);
            panel.appendTo(main_div);
        }
    };

    this.end = function () {
        return index === simulation_number;
    };

    this.index = function () {
        return index;
    };

    this.update = function (winner) {
        index++;
        if (winner === 0) {
            ++first_victories;
        } else {
            ++second_victories;
        }
        update();
    };

    init(r);
};

OpenXum.AIManager = function (e, f, s, st) {
// private attributes
    var _that = this;
    var _ready;
    var engine;
    var first_player;
    var second_player;
    var current_player;
    var other_player;
    var status;
    var timeout;
    var backup;

    var moves;
    var all_moves;

// public methods
    this.play_other = function () {
        if (engine.current_color() === other_player.color()) {
            play(other_player);
        } else {
            play(current_player);
        }
    };

    this.play_remote = function (move) {
        engine.move(move);
        if (current_player.confirm()) {
            current_player.move(move);
        }
    };

    this.ready = function (r) {
        _ready = r;
    };

    this.start = function () {
        timeout = setTimeout(run, 1000);
    };

// private methods
    var init = function (e, f, s, st) {
        _ready = false;
        engine = e;
        first_player = f;
        first_player.set_manager(_that);
        second_player = s;
        second_player.set_manager(_that);
        status = st;
        all_moves = [];
    };

    var finish = function () {
        all_moves.push(moves);
        status.update(engine.winner_is());
        engine = backup;
        first_player.reinit(backup);
        second_player.reinit(backup);
        if (!status.end()) {
            timeout = setTimeout(run, 15);
        } else {
            clearTimeout(timeout);
            status.display_games(all_moves);
        }
    };

    var play = function (player) {
        if (!engine.is_finished()) {
            current_player = player;
            other_player = current_player === first_player ? second_player : first_player;

            var move = current_player.move();

            if (!current_player.is_remote()) {
                engine.move(move);
                moves.push(move);
                if (other_player.is_remote()) {
                    other_player.move(move);
                } else {
                    if (engine.current_color() === other_player.color()) {
                        play(other_player);
                    } else {
                        play(current_player);
                    }
                }
            }
        } else {
            finish();
        }
    };

    var run = function () {
        backup = engine.clone();
        moves = [];
        if (engine.current_color() === first_player.color()) {
            play(first_player);
        } else {
            play(second_player);
        }
    };

    init(e, f, s, st);
};