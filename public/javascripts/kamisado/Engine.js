"use strict";

Kamisado.Turn = function(f, t) {

    this.from = function () {
        return _from;
    };

    this.get = function () {
        return String.fromCharCode('a'.charCodeAt(0) + _from.x) + (_from.y + 1) +
            String.fromCharCode('a'.charCodeAt(0) + _to.x) + (_to.y + 1);
    };

    this.to = function () {
        return _to;
    };

// private methods
    var init = function (f, t) {
        _from = f;
        _to = t;
    };

    var _from;
    var _to;

    init(f, t);
};

Kamisado.Engine = function (t, c) {

// public methods
    this.clone = function () {
        var o = new Kamisado.Engine(type, color);

        o.set(phase, black_towers, white_towers, play_color);
        return o;
    };

    this.current_color = function () {
        return color;
    };

    this.find_playable_tower = function (color) {
        return find_playable_tower(color);
    };

    this.find_tower = function (coordinates, color) {
        var tower = find_tower2(coordinates, color);

        return { x: tower.x, y: tower.y, tower_color: tower.color };
    };

    this.get_black_towers = function () {
        return black_towers;
    };

    this.get_current_towers = function () {
        return color === Kamisado.Color.BLACK ? black_towers : white_towers;
    };

    this.get_play_color = function () {
        return play_color;
    };

    this.get_possible_move_list = function () {
        var color = this.current_color();
        var playable_tower = find_playable_tower(color);

        if (!playable_tower) {
            playable_tower = {
                x: Math.floor(Math.random() * 8),
                y: color === Kamisado.Color.BLACK ? 0 : 7
            };
        }
        return {
            playable_tower: playable_tower,
            list: get_possible_moving_list({ x: playable_tower.x, y: playable_tower.y, color: color })
        };
    };

    this.get_possible_move_number = function (list) {
        return list.list.length;
    };

    this.get_possible_moving_list = function (tower) {
        return get_possible_moving_list(tower);
    };

    this.get_white_towers = function () {
        return white_towers;
    };

    this.is_possible_move = function (coordinates, list) {
        return belong_to(coordinates, list);
    };

    this.is_finished = function () {
        return phase === Kamisado.Phase.FINISH;
    };

    this.move = function (move) {
        move_tower(move.from(), move.to());
    };

    this.phase = function () {
        return phase;
    };

    this.remove_first_possible_move = function (list) {
        var L = list;

        L.list.shift();
        return L;
    };

    this.select_move = function (list, index) {
        return new Kamisado.Turn(list.playable_tower, list.list[index]);
    };

    this.set = function (_phase, _black_towers, _white_towers, _play_color) {
        var i = _black_towers.length;

        while (i--) {
            black_towers[i].x = _black_towers[i].x;
            black_towers[i].y = _black_towers[i].y;
            black_towers[i].color = _black_towers[i].color;
        }
        i = _white_towers.length;
        while (i--) {
            white_towers[i].x = _white_towers[i].x;
            white_towers[i].y = _white_towers[i].y;
            white_towers[i].color = _white_towers[i].color;
        }
        phase = _phase;
        play_color = _play_color;
    };

    this.winner_is = function () {
        if (this.is_finished()) {
            return color;
        } else {
            return false;
        }
    };

// private methods
    var belong_to = function (element, list) {
        for (var index in list) {
            if (list[index].x === element.x && list[index].y === element.y) {
                return true;
            }
        }
        return false;
    };

    var change_color = function () {
        color = next_color(color);
    };

    var find_playable_tower = function (color) {
        var playable_tower = undefined;

        if (play_color) {
            var list = get_towers(color);

            for (var i = 0; i < 8; ++i) {
                if (list[i].color === play_color) {
                    playable_tower = { x: list[i].x, y: list[i].y };
                }
            }
        }
        return playable_tower;
    };

    var find_tower2 = function (coordinates, color) {
        var tower;
        var list = color === Kamisado.Color.BLACK ? black_towers : white_towers;
        var found = false;
        var i = 0;

        while (i < 8 && !found) {
            if (list[i].x === coordinates.x && list[i].y === coordinates.y) {
                tower = list[i];
                found = true;
            } else {
                ++i;
            }
        }
        return tower;
    };

    var get_possible_moving_list = function (tower) {
        var list = [];
        var step = tower.color === Kamisado.Color.BLACK ? 1 : -1;
        var limit = tower.color === Kamisado.Color.BLACK ? 8 : -1;

        // column
        var line = tower.y + step;

        while (line !== limit && is_empty({x: tower.x, y: line })) {
            list.push({x: tower.x, y: line });
            line += step;
        }

        // right diagonal
        var col = tower.x + 1;

        line = tower.y + step;
        while (line !== limit && col !== 8 && is_empty({x: col, y: line })) {
            list.push({x: col, y: line });
            line += step;
            ++col;
        }

        // left diagonal
        col = tower.x - 1;
        line = tower.y + step;
        while (line !== limit && col !== -1 && is_empty({x: col, y: line })) {
            list.push({x: col, y: line });
            line += step;
            --col;
        }
        return list;
    };

    var get_towers = function (color) {
        return  color === Kamisado.Color.BLACK ? black_towers : white_towers;
    };

    var init = function (t, c) {
        var i;

        type = t;
        color = c;
        black_towers = [];
        for (i = 0; i < 8; ++i) {
            black_towers[i] = { x: i, y: 0, color: Kamisado.colors[i][0] };
        }
        white_towers = [];
        for (i = 0; i < 8; ++i) {
            white_towers[i] = { x: i, y: 7, color: Kamisado.colors[i][7] };
        }
        phase = Kamisado.Phase.MOVE_TOWER;
        play_color = undefined;
    };

    var is_empty = function (coordinates) {
        var found = false;
        var i = 0;

        while (i < 8 && !found) {
            if (black_towers[i].x === coordinates.x && black_towers[i].y === coordinates.y) {
                found = true;
            } else {
                ++i;
            }
        }
        i = 0;
        while (i < 8 && !found) {
            if (white_towers[i].x === coordinates.x && white_towers[i].y === coordinates.y) {
                found = true;
            } else {
                ++i;
            }
        }
        return !found;
    };

    var move_tower = function (selected_tower, selected_cell) {
        var tower = find_tower2(selected_tower, color);

        if (tower) {
            tower.x = selected_cell.x;
            tower.y = selected_cell.y;
        }
        if ((color === Kamisado.Color.BLACK && tower.y === 7) ||
            (color === Kamisado.Color.WHITE && tower.y === 0)) {
            phase = Kamisado.Phase.FINISH;
        } else {
            play_color = Kamisado.colors[tower.x][tower.y];
            if (!pass(next_color(color))) {
                change_color();
            } else {
                var playable_tower = find_playable_tower(next_color(color));

                play_color = Kamisado.colors[playable_tower.x][playable_tower.y];
                if (pass(color)) {
                    phase = Kamisado.Phase.FINISH;
                    change_color();
                }
            }
        }
    };

    var next_color = function (color) {
        return color === Kamisado.Color.WHITE ? Kamisado.Color.BLACK : Kamisado.Color.WHITE;
    };

    var pass = function (color) {
        var playable_tower = find_playable_tower(color);
        var list = get_possible_moving_list({ x: playable_tower.x, y: playable_tower.y, color: color });

        return list.length === 0;
    };

// private attributes
    var type;
    var color;

    var black_towers;
    var white_towers;
    var play_color;

    var phase;

    init(t, c);
};
