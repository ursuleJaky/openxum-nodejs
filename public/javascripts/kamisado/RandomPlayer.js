Kamisado.RandomPlayer = function (color, engine) {

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
            playable_tower = { x: Math.floor(Math.random() * 8), y: 0 };
        }

        var list = engine.get_possible_moving_list({ x: playable_tower.x, y: playable_tower.y, color: mycolor });

        if (list.length != 0) {
            var coordinates = list[Math.floor(Math.random() * list.length)];

            return { from: playable_tower, to: coordinates };
        } else {
            return undefined;
        }
    };

// private attributes
    var mycolor = color;
    var engine = engine;
};
