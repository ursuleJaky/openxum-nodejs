Yinsh.Intersection = function (c) {
// public methods
    this.hash = function () {
        return coordinates.hash();
    };

    this.color = function () {
        if (state == Yinsh.State.VACANT) {
            return -1;
        }

        if (state == Yinsh.State.BLACK_RING ||
            state == Yinsh.State.BLACK_MARKER ||
            state == Yinsh.State.BLACK_MARKER_RING) {
            return Yinsh.Color.BLACK;
        } else {
            return Yinsh.Color.WHITE;
        }
    };

    this.flip = function () {
        if (state == Yinsh.State.BLACK_MARKER) {
            state = Yinsh.State.WHITE_MARKER;
        } else if (state == Yinsh.State.WHITE_MARKER) {
            state = Yinsh.State.BLACK_MARKER;
        }
    };

    this.coordinates = function () {
        return coordinates;
    };

    this.letter = function () {
        return coordinates.letter();
    };

    this.number = function () {
        return coordinates.number();
    };

    this.put_marker = function (color) {
        if (color == Yinsh.Color.BLACK) {
            if (state == Yinsh.State.BLACK_RING) {
                state = Yinsh.State.BLACK_MARKER_RING;
            }
        } else {
            if (state == Yinsh.State.WHITE_RING) {
                state = Yinsh.State.WHITE_MARKER_RING;
            }
        }
    };

    this.put_ring = function (color) {
        if (color == Yinsh.Color.BLACK) {
            state = Yinsh.State.BLACK_RING;
        } else {
            state = Yinsh.State.WHITE_RING;
        }
    };

    this.remove_marker = function () {
        state = Yinsh.State.VACANT;
    };

    this.remove_ring = function () {
        if (state == Yinsh.State.BLACK_MARKER_RING || state == Yinsh.State.WHITE_MARKER_RING) {
            if (state == Yinsh.State.BLACK_MARKER_RING) {
                state = Yinsh.State.BLACK_MARKER;
            } else {
                state = Yinsh.State.WHITE_MARKER;
            }
        }
    };

    this.remove_ring_board = function () {
        state = Yinsh.State.VACANT;
    };

    this.state = function () {
        return state;
    };

// private attributes
    var coordinates = c;
    var state = Yinsh.State.VACANT;
};
