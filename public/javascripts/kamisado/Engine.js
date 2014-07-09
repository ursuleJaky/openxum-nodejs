Kamisado.Engine = function (type, color) {

// public methods
    this.current_color = function () {
        return this.color;
    };

    this.find_playable_tower = function(color) {
        var playable_tower =  undefined;

        if (this.play_color) {
            var list = this.get_towers(color);

            for (var i = 0; i < 8; ++i) {
                if (list[i].color == this.play_color) {
                    playable_tower = { x: list[i].x, y: list[i].y };
                }
            }
        }
        return playable_tower;
    };

    this.get_black_towers = function() {
        return this.black_towers;
    };

    this.get_current_towers = function() {
        return this.color == Kamisado.Color.BLACK ? this.black_towers : this.white_towers;
    };

    this.get_play_color = function() {
        return this.play_color;
    };

    this.get_white_towers = function() {
        return this.white_towers;
    };

    this.get_possible_move_list = function() {
        var color = this.current_color();
        var playable_tower = this.find_playable_tower(color);

        if (!playable_tower) {
            playable_tower = {
                x: Math.floor(Math.random() * 8),
                y: color == Kamisado.Color.BLACK ? 0 : 7
            };
        }
        return {
            playable_tower: playable_tower,
            list: this.get_possible_moving_list({ x: playable_tower.x, y: playable_tower.y, color: color })
        };
    };

    this.get_possible_moving_list = function(tower) {
        var list = [];
        var step = tower.color == Kamisado.Color.BLACK ? 1 : -1;
        var limit = tower.color == Kamisado.Color.BLACK ? 8 : -1;

        // column
        var line = tower.y + step;

        while (line != limit && this.is_empty({x: tower.x, y: line })) {
            list.push({x: tower.x, y: line });
            line += step;
        }

        // right diagonal
        var col = tower.x + 1;

        line = tower.y + step;
        while (line != limit && col != 8 && this.is_empty({x: col, y: line })) {
            list.push({x: col, y: line });
            line += step;
            ++col;
        }

        // left diagonal
        col = tower.x - 1;
        line = tower.y + step;
        while (line != limit && col != -1 && this.is_empty({x: col, y: line })) {
            list.push({x: col, y: line });
            line += step;
            --col;
        }
        return list;
    };

    this.is_finished = function () {
        return this._phase == Kamisado.Phase.FINISH;
    };

    this.move = function (move) {
        this.move_tower(move.from, move.to);
    };

    this.move_tower = function(selected_tower, selected_cell) {
        var tower = this.find_tower2(selected_tower, this.color);

        if (tower) {
            tower.x = selected_cell.x;
            tower.y = selected_cell.y;
        }
        if ((this.color == Kamisado.Color.BLACK && tower.y == 7) ||
            (this.color == Kamisado.Color.WHITE && tower.y == 0)) {
            this._phase = Kamisado.Phase.FINISH;
        } else {
            this.play_color = Kamisado.colors[tower.x][tower.y];
            if (!this.pass(this.next_color(this.color))) {
                this.change_color();
            } else {
                var playable_tower = this.find_playable_tower(this.next_color(this.color));

                this.play_color = Kamisado.colors[playable_tower.x][playable_tower.y];
                if (this.pass(this.color)) {
                    this._phase = Kamisado.Phase.FINISH;
                    this.color = this.next_color(this.color);
                }
            }
        }
    };

    this.pass = function(color) {
        var playable_tower = this.find_playable_tower(color);
        var list = this.get_possible_moving_list({ x: playable_tower.x, y: playable_tower.y, color: color });

        return list.length == 0;
    };

    this.phase = function() {
        return this._phase;
    };

    this.select_move = function(list, index) {
        return { from: list.playable_tower, to: list.list[index] };
    };

    this.winner_is = function () {
        if (this.is_finished()) {
            return this.color;
        } else {
            return false;
        }
    };

    this.change_color = function () {
        this.color = this.next_color(this.color);
    };

    this.find_tower = function(coordinates, color) {
        var tower = this.find_tower2(coordinates, color);

        return { x: tower.x, y: tower.y, tower_color: tower.color };
    };

    this.get_towers = function(color) {
        return  color == Kamisado.Color.BLACK ? this.black_towers : this.white_towers;
    };

    this.is_empty = function(coordinates) {
        var found = false;
        var i = 0;

        while (i < 8 && !found) {
            if (this.black_towers[i].x == coordinates.x && this.black_towers[i].y == coordinates.y) {
                found = true;
            } else {
                ++i;
            }
        }
        i = 0;
        while (i < 8 && !found) {
            if (this.white_towers[i].x == coordinates.x && this.white_towers[i].y == coordinates.y) {
                found = true;
            } else {
                ++i;
            }
        }
        return !found;
    };

    this.init = function() {
        this.black_towers = [];
        for (var i = 0; i < 8; ++i) {
            this.black_towers[i] = { x: i, y: 0, color: Kamisado.colors[i][0] };
        }
        this.white_towers = [];
        for (var i = 0; i < 8; ++i) {
            this.white_towers[i] = { x: i, y: 7, color: Kamisado.colors[i][7] };
        }
        this._phase = Kamisado.Phase.MOVE_TOWER;
        this.color = Kamisado.Color.BLACK;
        this.play_color = undefined;
    };

    this.next_color = function(color) {
        return color == Kamisado.Color.WHITE ? Kamisado.Color.BLACK : Kamisado.Color.WHITE
    };

// private methods
    this.find_tower2 = function(coordinates, color) {
        var tower;
        var list = color == Kamisado.Color.BLACK ? this.black_towers : this.white_towers;
        var found = false;
        var i = 0;

        while (i < 8 && !found) {
            if (list[i].x == coordinates.x && list[i].y == coordinates.y) {
                tower = list[i];
                found = true;
            } else {
                ++i;
            }
        }
        return tower;
    };

// private attributes
    this.type = type;
    this.color = color;

    this.black_towers;
    this.white_towers;
    this.play_color;

    this._phase;

    this.init();
};
