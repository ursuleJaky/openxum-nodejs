Kamisado.MCTSPlayer = function (color, engine) {

// public methods
    this.color = function() {
        return mycolor;
    };

    this.is_remote =function () {
        return false;
    };

    this.move_tower = function () {
        return (new MCTS.Player(mycolor, engine, level)).move();
    };

    this.set_level = function (l) {
        level = l;
    };

// private attributes
    var mycolor = color;
    var engine = engine;
    var level = 10;
};
