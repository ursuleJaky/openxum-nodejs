Yinsh.RandomPlayer = function (color, engine) {

// public methods
    this.color = function() {
        return mycolor;
    };

    this.is_remote =function () {
        return false;
    };

    this.move_ring = function (origin) {
        var list = engine.get_possible_moving_list(origin, mycolor, false);

        if (list.length != 0) {
            var ring_coordinates = list[Math.floor(Math.random() * list.length)];

            engine.move_ring(origin, ring_coordinates);
            return ring_coordinates;
        } else {
            return new Yinsh.Coordinates('X', -1);
        }
    };

    this.put_marker = function () {
        var ring_coordinates;
        var list = engine.get_placed_ring_coordinates(mycolor);
        var ok = false;

        while (!ok) {
            ring_coordinates = list[Math.floor(Math.random() * list.length)];
            ok = engine.get_possible_moving_list(ring_coordinates, mycolor, false).length > 0;
        }
        engine.put_marker(ring_coordinates, mycolor);
        return ring_coordinates;
    };

    this.put_ring = function () {
        var list = engine.get_free_intersections();
        var index = Math.floor(Math.random() * list.length);
        var coordinates = list[index];

        engine.put_ring(coordinates, mycolor);
        return coordinates;
    };

    this.remove_ring = function () {
        var ring_index = Math.floor(Math.random() * engine.get_placed_ring_coordinates(mycolor).length);
        var ring_coordinates = engine.get_placed_ring_coordinates(mycolor)[ring_index];

        engine.remove_ring(ring_coordinates, mycolor);
        return ring_coordinates;
    };

    this.remove_rows = function () {
        // TODO
    };

    this.remove_no_row = function () {
        engine.remove_no_row();
    };

// private methods

// private attributes
    var mycolor = color;
    var engine = engine;
};
