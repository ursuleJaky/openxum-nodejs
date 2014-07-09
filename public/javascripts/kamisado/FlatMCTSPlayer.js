Kamisado.FlatMCTSPlayer = function (color, engine) {

// public methods
    this.color = function() {
        return mycolor;
    };

    this.is_remote =function () {
        return false;
    };

    this.move_tower = function () {
        var playable_tower = engine.find_playable_tower(mycolor);

        if (!playable_tower) {
            playable_tower = {
                x: Math.floor(Math.random() * 8),
                y: mycolor == Kamisado.Color.BLACK ? 0 : 7
            };
        }

        var list = engine.get_possible_moving_list({ x: playable_tower.x, y: playable_tower.y, color: mycolor });

        if (list.length > 0) {
            var max = 0;
            var index = -1;

            for (var i = 0; i < list.length; ++i) {
                var e = clone(engine);
                var score = process_turn(e, playable_tower, list[i]);

                if (score > max) {
                    max = score;
                    index = i;
                }
            }
            if (index == -1) {
                index = Math.floor(Math.random() * list.length);
            }
            return { from: playable_tower, to: list[index] };
        } else {
            return undefined;
        }
    };

// private methods
    var process_turn = function (e, playable_tower, coordinates) {
        var score = 0;

        e.move_tower(playable_tower, coordinates);
        for (var i = 0; i < 10; ++i) {
            var e2 = clone(e);

            while (!e2.is_finished()) {
                play_a_random_turn(e2, e2.current_color());
            }
            if (color == e2.winner_is()) {
                ++score;
            }
        }
        return score;
    };

    var play_a_random_turn = function (e, color) {
        var playable_tower = e.find_playable_tower(color);

        if (!playable_tower) {
            playable_tower = {
                x: Math.floor(Math.random() * 8),
                y: color == Kamisado.Color.BLACK ? 0 : 7
            };
        }

        var list = e.get_possible_moving_list({ x: playable_tower.x, y: playable_tower.y, color: color });

        e.move_tower(playable_tower, list[Math.floor(Math.random() * list.length)]);
    };

// private attributes
    var mycolor = color;
    var engine = engine;
};
