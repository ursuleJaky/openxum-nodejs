"use strict";

Yinsh.Gui = function (color, e, local) {

// public methods
    this.clear_selected_ring = function () {
        selected_ring = new Yinsh.Coordinates('X', -1);
    };

    this.clear_selected_row = function () {
        selected_row = [];
        row_index = -1;
    };

    this.color = function () {
        return mycolor;
    };

    this.draw = function () {
        compute_deltas();

        context.lineWidth = 1;

        // background
        context.fillStyle = "#ffffff";
        roundRect(0, 0, canvas.width, canvas.height, 17, true, false);

        draw_grid();
        draw_coordinates();
        draw_state();

        if (engine.phase() === Yinsh.Phase.MOVE_RING && selected_ring.is_valid()) {
            draw_possible_moving();
        } else if (engine.phase() === Yinsh.Phase.REMOVE_ROWS_AFTER || engine.phase() === Yinsh.Phase.REMOVE_ROWS_BEFORE) {
            draw_remove_markers();
        }

        //intersection
        show_intersection();

        // opponent status
        show_opponent_status(10, 10);
    };

    this.engine = function () {
        return engine;
    };

    this.get_selected_coordinates = function () {
        return selected_coordinates;
    };

    this.get_selected_ring = function () {
        return selected_ring;
    };

    this.ready = function (r) {
        opponentPresent = r;
        manager.redraw();
    };

    this.set_canvas = function (c) {
        canvas = c;
        context = c.getContext("2d");
        height = canvas.height;
        width = canvas.width;

        scaleX = height / canvas.offsetHeight;
        scaleY = width / canvas.offsetWidth;

        canvas.addEventListener("click", onClick, true);
        canvas.addEventListener('mousemove', onMove, false);
        this.draw();
    };

    this.set_manager = function (m) {
        manager = m;
    };

// private methods
    var compute_coordinates = function (letter, number) {
        var index_x = letter - 'A'.charCodeAt(0);
        var x = offset + delta_x * index_x;
        var y = offset + 7 * delta_y + delta_xy * index_x -
            (number - 1) * delta_y;

        return [x, y];
    };

    var compute_deltas = function () {
        offset = 30;
        delta_x = (width - 2 * offset) / 10.0;
        delta_y = delta_x;
        delta_xy = delta_y / 2;
    };

    var compute_letter = function (x, y) {
        var letters = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K" ];
        var index = Math.floor((x - offset) / delta_x);
        var x_ref = offset + delta_x * index;
        var x_ref_2 = offset + delta_x * (index + 1);
        var _letter = 'X';

        if (x < offset) {
            _letter = 'A';
        } else if (x <= x_ref + delta_x / 2 && x >= x_ref && x <= x_ref + tolerance) {
            _letter = letters[index];
        } else if (x > x_ref + delta_x / 2 && x >= x_ref_2 - tolerance) {
            _letter = letters[index + 1];
        }
        return _letter;
    };

    var compute_number = function (x, y) {
        var pt = compute_coordinates('A'.charCodeAt(0), 1);

        // translation to A1 and rotation
        var X = x - pt[0];
        var Y = y - pt[1];
        var sin_alpha = 1.0 / Math.sqrt(5);
        var cos_alpha = 2.0 * sin_alpha;

        var x2 = Math.floor((X * sin_alpha - Y * cos_alpha) + pt[0]);
        var delta_x2 = Math.floor(delta_x * cos_alpha);

        var index = Math.floor((x2 - offset) / delta_x2);
        var x_ref = Math.floor(offset + delta_x2 * index);
        var x_ref_2 = Math.floor(offset + delta_x2 * (index + 1));

        var _number = -1;

        if (x2 > 0 && x2 < offset) {
            _number = 1;
        } else if (x2 <= x_ref + delta_x2 / 2 && x2 >= x_ref && x2 <= x_ref + tolerance) {
            _number = index + 1;
        } else if (x2 > x_ref + delta_x2 / 2 && x2 >= x_ref_2 - tolerance) {
            _number = index + 2;
        }
        return _number;
    };

    var compute_pointer = function (x, y) {
        var change = false;
        var letter = compute_letter(x, y);

        if (letter != 'X') {
            var number = compute_number(x, y);

            if (number != -1) {
                if (engine.exist_intersection(letter, number)) {
                    var pt = compute_coordinates(letter.charCodeAt(0), number);

                    pointerX = pt[0];
                    pointerY = pt[1];
                    change = true;
                } else {
                    pointerX = pointerY = -1;
                    change = true;
                }
            } else {
                if (pointerX != -1) {
                    pointerX = pointerY = -1;
                    change = true;
                }
            }
        } else {
            if (pointerX != -1) {
                pointerX = pointerY = -1;
                change = true;
            }
        }
        return change;
    };

    var draw_coordinates = function () {
        var pt;

        context.fillStyle = "#000000";
        context.font = "16px _sans";
        context.textBaseline = "top";

        // letters
        for (var l = 'A'.charCodeAt(0); l < 'L'.charCodeAt(0); ++l) {
            pt = compute_coordinates(l, Yinsh.begin_number[l - 'A'.charCodeAt(0)]);
            pt[0] -= 5;
            pt[1] += 20;

            context.fillText(String.fromCharCode(l), pt[0], pt[1]);
        }

        // numbers
        context.textBaseline = "bottom";
        for (var n = 1; n < 12; ++n) {
            pt = compute_coordinates(Yinsh.begin_letter[n - 1].charCodeAt(0), n);
            pt[0] -= 15 + (n > 9 ? 5 : 0);
            pt[1] -= 3;

            context.fillText(n.toString(), pt[0], pt[1]);
        }
    };

    var draw_grid = function () {
        var _pt_begin;
        var _pt_end;

        context.lineWidth = 1;
        context.strokeStyle = "#000000";
        for (var l = 'A'.charCodeAt(0); l < 'L'.charCodeAt(0); ++l) {
            var index = l - 'A'.charCodeAt(0);

            _pt_begin = compute_coordinates(l, Yinsh.begin_number[index]);
            _pt_end = compute_coordinates(l, Yinsh.end_number[index]);
            context.moveTo(_pt_begin[0], _pt_begin[1]);
            context.lineTo(_pt_end[0], _pt_end[1]);
        }
        for (var n = 1; n < 12; ++n) {
            _pt_begin = compute_coordinates(Yinsh.begin_letter[n - 1].charCodeAt(0), n);
            _pt_end = compute_coordinates(Yinsh.end_letter[n - 1].charCodeAt(0), n);
            context.moveTo(_pt_begin[0], _pt_begin[1]);
            context.lineTo(_pt_end[0], _pt_end[1]);
        }

        for (var i = 0; i < 11; ++i) {
            _pt_begin = compute_coordinates(Yinsh.begin_diagonal_letter[i].charCodeAt(0),
                Yinsh.begin_diagonal_number[i]);
            _pt_end = compute_coordinates(Yinsh.end_diagonal_letter[i].charCodeAt(0),
                Yinsh.end_diagonal_number[i]);
            context.moveTo(_pt_begin[0], _pt_begin[1]);
            context.lineTo(_pt_end[0], _pt_end[1]);
        }
        context.stroke();
    };

    var draw_marker = function (x, y, color) {
        context.beginPath();
        context.lineWidth = 1;
        if (color === Yinsh.Color.BLACK) {
            context.fillStyle = "#000000";
        } else if (color === Yinsh.Color.WHITE) {
            context.fillStyle = "rgb(192, 192, 192)";
        } else {
            context.fillStyle = "#ff0000";
        }
        context.arc(x, y, delta_x * (1.0 / 3 - 1.0 / 10) - 1, 0.0, 2 * Math.PI, false);
        context.fill();
        context.stroke();
        context.closePath();
    };

    var draw_possible_moving = function () {
        var list = engine.get_possible_moving_list(selected_ring, engine.current_color(), true);

        context.strokeStyle = "#FFFFFF";
        context.fillStyle = "#FF0000";
        context.lineWidth = 1;
        for (var i = 0; i < list.length; ++i) {
            var pt;

            pt = compute_coordinates(list[i].letter().charCodeAt(0), list[i].number());
            context.beginPath();
            context.arc(pt[0], pt[1], 10, 0.0, 2 * Math.PI, false);
            context.fill();
            context.stroke();
            context.closePath();
        }

    };

    var draw_remove_markers = function () {
        if (selected_row.length > 0) {
            for (var index = 0; index < selected_row.length; ++index) {
                var pt = compute_coordinates(selected_row[index].letter().charCodeAt(0), selected_row[index].number());

                draw_marker(pt[0], pt[1]);
            }
        }
    };

    var draw_ring = function (x, y, color) {
        context.beginPath();
        context.lineWidth = 1;
        context.strokeStyle = "#000000";
        context.arc(x, y, delta_x * (1.0 / 3 + 1.0 / 10), 0.0, 2 * Math.PI, false);
        context.stroke();
        context.arc(x, y, delta_x * (1.0 / 3 - 1.0 / 10) - 1, 0.0, 2 * Math.PI, false);
        context.stroke();
        context.closePath();

        context.beginPath();
        context.lineWidth = delta_x / 5;

        /*            var gr = context.createLinearGradient(0, 0, 100, 100);
         if (color === Yinsh.Color.BLACK) {
         gr.addColorStop(0,'rgb(0,0,0)');
         gr.addColorStop(1,'rgb(192,192,192)');
         } else {
         gr.addColorStop(0,'rgb(192,192,192)');
         gr.addColorStop(1,'rgb(255,255,255)');
         }
         context.strokeStyle = gr; */

        if (color === Yinsh.Color.BLACK) {
            context.strokeStyle = "#000000";
        } else {
            context.strokeStyle = "#ffffff";
        }

        context.arc(x, y, delta_x / 3, 0.0, 2 * Math.PI, false);
        context.stroke();
        context.closePath();
    };

    var draw_rows = function () {
        if (engine.phase() === Yinsh.Phase.REMOVE_ROWS_AFTER ||
            engine.phase() === Yinsh.Phase.REMOVE_ROWS_BEFORE) {
            var srows = [engine.get_rows(engine.current_color())];

            for (var i = 0; i < srows.length; ++i) {
                for (var j = 0; j < srows[i].length; ++j) {
                    var begin = srows[i][j][0];
                    var end = srows[i][j][srows[i][j].length - 1];
                    var pt1, pt2;
                    var alpha_1, beta_1;
                    var alpha_2, beta_2;

                    pt1 = compute_coordinates(begin.letter().charCodeAt(0), begin.number());
                    pt2 = compute_coordinates(end.letter().charCodeAt(0), end.number());

                    if (pt1[0] === pt2[0]) {
                        if (pt1[1] < pt2[1]) {
                            alpha_1 = Math.PI;
                            beta_1 = 0;
                            alpha_2 = 0;
                            beta_2 = Math.PI;
                        } else {
                            alpha_1 = 0;
                            beta_1 = Math.PI;
                            alpha_2 = Math.PI;
                            beta_2 = 0;
                        }
                    } else {
                        var omega_1 = Math.acos(1.0 / Math.sqrt(5));

                        if (pt1[0] < pt2[0]) {
                            if (pt1[1] < pt2[1]) {
                                alpha_1 = Math.PI - omega_1;
                                beta_1 = 3 * Math.PI / 2 + omega_1 / 2;
                                alpha_2 = 3 * Math.PI / 2 + omega_1 / 2;
                                beta_2 = Math.PI - omega_1;
                            } else {
                                alpha_1 = omega_1;
                                beta_1 = Math.PI + omega_1;
                                alpha_2 = Math.PI + omega_1;
                                beta_2 = omega_1;
                            }
                        }
                    }
                    context.beginPath();
                    context.strokeStyle = "#00FF00";
                    context.lineWidth = 4;
                    context.arc(pt1[0], pt1[1], delta_x / 3 + 5, alpha_1, beta_1, false);
                    context.lineTo(pt2[0] + (delta_x / 3 + 5) * Math.cos(alpha_2),
                            pt2[1] + (delta_x / 3 + 5) * Math.sin(alpha_2));
                    context.arc(pt2[0], pt2[1], delta_x / 3 + 5, alpha_2, beta_2, false);
                    context.lineTo(pt1[0] + (delta_x / 3 + 5) * Math.cos(alpha_1),
                            pt1[1] + (delta_x / 3 + 5) * Math.sin(alpha_1));
                    context.stroke();
                    context.closePath();
                }
            }
        }
    };

    var draw_state = function () {
        var intersections = engine.intersections();

        for (var key in intersections) {
            var intersection = intersections[key];
            var pt = compute_coordinates(intersection.letter().charCodeAt(0), intersection.number());

            switch (intersection.state()) {
                case Yinsh.State.VACANT:
                    break;
                case Yinsh.State.BLACK_MARKER:
                    draw_marker(pt[0], pt[1], Yinsh.Color.BLACK);
                    break;
                case Yinsh.State.WHITE_MARKER:
                    draw_marker(pt[0], pt[1], Yinsh.Color.WHITE);
                    break;
                case Yinsh.State.BLACK_MARKER_RING:
                    draw_marker(pt[0], pt[1], Yinsh.Color.BLACK);
                    draw_ring(pt[0], pt[1], Yinsh.Color.BLACK);
                    break;
                case Yinsh.State.BLACK_RING:
                    draw_ring(pt[0], pt[1], Yinsh.Color.BLACK);
                    break;
                case Yinsh.State.WHITE_MARKER_RING:
                    draw_marker(pt[0], pt[1], Yinsh.Color.WHITE);
                    draw_ring(pt[0], pt[1], Yinsh.Color.WHITE);
                    break;
                case Yinsh.State.WHITE_RING:
                    draw_ring(pt[0], pt[1], Yinsh.Color.WHITE);
                    break;
            }
        }
        draw_rows();
    };

    var getClickPosition = function (e) {
        var rect = canvas.getBoundingClientRect();

        return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
    };

    this.get_selected_row = function () {
        return selected_row;
    };

    var onClick = function (event) {
        if (/type=offline/.test(self.location.href)) {
            opponentPresent = 'local';
        }
        if (opponentPresent && engine.current_color() === mycolor) {
            if (engine.current_color() === mycolor) {

                var pos = getClickPosition(event);
                var letter = compute_letter(pos.x, pos.y);
                var number = compute_number(pos.x, pos.y);
                var ok = false;

                if (letter !== 'X' && number !== -1 &&
                    engine.exist_intersection(letter, number)) {
                    if (engine.phase() === Yinsh.Phase.PUT_RING &&
                        engine.intersection_state(letter, number) === Yinsh.State.VACANT) {
                        selected_coordinates = new Yinsh.Coordinates(letter, number);
                        ok = true;
                    } else if (engine.phase() === Yinsh.Phase.PUT_MARKER &&
                        ((engine.intersection_state(letter, number) === Yinsh.State.BLACK_RING &&
                            engine.current_color() === Yinsh.Color.BLACK) ||
                            (engine.intersection_state(letter, number) === Yinsh.State.WHITE_RING &&
                                engine.current_color() === Yinsh.Color.WHITE))) {
                        selected_coordinates = new Yinsh.Coordinates(letter, number);
                        selected_ring = selected_coordinates;
                        ok = true;
                    } else if (engine.phase() === Yinsh.Phase.MOVE_RING) {
                        if (selected_ring.is_valid()) {
                            if (engine.verify_moving(selected_ring,
                                new Yinsh.Coordinates(letter, number))) {
                                selected_coordinates = new Yinsh.Coordinates(letter, number);
                                ok = true;
                            }
                        }
                    } else if (engine.phase() === Yinsh.Phase.REMOVE_ROWS_AFTER ||
                        engine.phase() === Yinsh.Phase.REMOVE_ROWS_BEFORE) {
                        /*                 selected_coordinates = new Yinsh.Coordinates(letter, number);
                         ok = true; */
                    } else if ((engine.phase() === Yinsh.Phase.REMOVE_RING_AFTER ||
                        engine.phase() === Yinsh.Phase.REMOVE_RING_BEFORE) &&
                        ((engine.intersection_state(letter, number) === Yinsh.State.BLACK_RING &&
                            engine.current_color() === Yinsh.Color.BLACK) ||
                            (engine.intersection_state(letter, number) === Yinsh.State.WHITE_RING &&
                                engine.current_color() === Yinsh.Color.WHITE))) {
                        selected_coordinates = new Yinsh.Coordinates(letter, number);
                        ok = true;
                    }
                }
                if (ok) {
                    manager.play();
                }
            }
        }
    };

    var onMove = function (event) {
        if (opponentPresent) {
            var pos = getClickPosition(event);
            var letter = compute_letter(pos.x, pos.y);

            if (letter !== 'X') {
                var number = compute_number(pos.x, pos.y);

                if (number !== -1) {
                    if (compute_pointer(pos.x, pos.y)) {
                        if (engine.phase() === Yinsh.Phase.REMOVE_ROWS_AFTER ||
                            engine.phase() === Yinsh.Phase.REMOVE_ROWS_BEFORE) {
                            if ((engine.current_color() === Yinsh.Color.BLACK && engine.intersection_state(letter, number) === Yinsh.State.BLACK_MARKER) ||
                                (engine.current_color() === Yinsh.Color.WHITE && engine.intersection_state(letter, number) === Yinsh.State.WHITE_MARKER)) {
                                var coordinates = new Yinsh.Coordinates(letter, number);
                                var found = false;
                                var index, index2, index3;

                                for (index = 0; index < selected_row.length && !found; ++index) {
                                    found = selected_row[index].letter() === letter && selected_row[index].number() === number;
                                }
                                if (!found) {
                                    var rows = engine.get_rows(engine.current_color());
                                    var ok = false;

                                    if (row_index === -1) {
                                        found = false;
                                        for (index = 0; index < rows.length && !found; ++index) {
                                            var row = rows[index];

                                            for (index2 = 0; index2 < row.length && !found; ++index2) {
                                                found = row[index2].letter() === coordinates.letter() &&
                                                    row[index2].number() === coordinates.number();
                                                if (found) {
                                                    row_index = index;
                                                    ok = true;
                                                }
                                            }
                                        }
                                    } else {
                                        var row = rows[row_index];

                                        found = false;
                                        for (index2 = 0; index2 < row.length && !found; ++index2) {
                                            found = row[index2].letter() === coordinates.letter() &&
                                                row[index2].number() === coordinates.number();
                                            if (found) {
                                                ok = true;
                                            }
                                        }
                                    }
                                    if (ok) {
                                        selected_row.push(coordinates);
                                        if (selected_row.length === 5) {
                                            manager.play();
                                        }
                                    } else {
                                        selected_row = [];
                                        row_index = -1;
                                        manager.redraw();
                                    }
                                } else {
                                    manager.redraw();
                                }
                            } else {
                                selected_row = [];
                                row_index = -1;
                                manager.redraw();
                            }
                        } else {
                            manager.redraw();
                        }
                    }
                } else if (engine.phase() === Yinsh.Phase.REMOVE_ROWS_AFTER ||
                    engine.phase() === Yinsh.Phase.REMOVE_ROWS_BEFORE) {
                    /*                 selected_coordinates = new Yinsh.Coordinates(letter, number);
                     ok = true; */
                } else if ((engine.phase() === Yinsh.Phase.REMOVE_RING_AFTER ||
                    engine.phase() === Yinsh.Phase.REMOVE_RING_BEFORE) &&
                    ((engine.intersection_state(letter, number) === Yinsh.State.BLACK_RING &&
                        engine.current_color() === Yinsh.Color.BLACK) ||
                        (engine.intersection_state(letter, number) === Yinsh.State.WHITE_RING &&
                            engine.current_color() === Yinsh.Color.WHITE))) {
                    selected_coordinates = new Yinsh.Coordinates(letter, number);
                    ok = true;
                }
            }
        }
    };

    var onMove = function (event) {
        if (opponentPresent) {
            var pos = getClickPosition(event);
            var letter = compute_letter(pos.x, pos.y);

            if (letter !== 'X') {
                var number = compute_number(pos.x, pos.y);

                if (number !== -1) {
                    if (compute_pointer(pos.x, pos.y)) {
                        if (engine.phase() === Yinsh.Phase.REMOVE_ROWS_AFTER ||
                            engine.phase() === Yinsh.Phase.REMOVE_ROWS_BEFORE) {
                            if ((engine.current_color() === Yinsh.Color.BLACK && engine.intersection_state(letter, number) === Yinsh.State.BLACK_MARKER) ||
                                (engine.current_color() === Yinsh.Color.WHITE && engine.intersection_state(letter, number) === Yinsh.State.WHITE_MARKER)) {
                                var coordinates = new Yinsh.Coordinates(letter, number);
                                var found = false;
                                var index, index2, index3;

                                for (index = 0; index < selected_row.length && !found; ++index) {
                                    found = selected_row[index].letter() === letter && selected_row[index].number() === number;
                                }
                                if (!found) {
                                    var rows = engine.get_rows(engine.current_color());
                                    var ok = false;

                                    if (row_index === -1) {
                                        found = false;
                                        for (index = 0; index < rows.length && !found; ++index) {
                                            var row = rows[index];

                                            for (index2 = 0; index2 < row.length && !found; ++index2) {
                                                found = row[index2].letter() === coordinates.letter() &&
                                                    row[index2].number() === coordinates.number();
                                                if (found) {
                                                    row_index = index;
                                                    ok = true;
                                                }
                                            }
                                        }
                                    } else {
                                        var row = rows[row_index];

                                        found = false;
                                        for (index2 = 0; index2 < row.length && !found; ++index2) {
                                            found = row[index2].letter() === coordinates.letter() &&
                                                row[index2].number() === coordinates.number();
                                            if (found) {
                                                ok = true;
                                            }
                                        }
                                    }
                                    if (ok) {
                                        selected_row.push(coordinates);
                                        if (selected_row.length === 5) {
                                            manager.play();
                                        }
                                    } else {
                                        selected_row = [];
                                        row_index = -1;
                                        manager.redraw();
                                    }
                                } else {
                                    manager.redraw();
                                }
                            } else {
                                selected_row = [];
                                row_index = -1;
                                manager.redraw();
                            }
                        } else {
                            manager.redraw();
                        }
                    }
                }
            }
        }
    };

    var roundRect = function (x, y, width, height, radius, fill, stroke) {
        if (typeof stroke === "undefined") {
            stroke = true;
        }
        if (typeof radius === "undefined") {
            radius = 5;
        }
        context.beginPath();
        context.moveTo(x + radius, y);
        context.lineTo(x + width - radius, y);
        context.quadraticCurveTo(x + width, y, x + width, y + radius);
        context.lineTo(x + width, y + height - radius);
        context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        context.lineTo(x + radius, y + height);
        context.quadraticCurveTo(x, y + height, x, y + height - radius);
        context.lineTo(x, y + radius);
        context.quadraticCurveTo(x, y, x + radius, y);
        context.closePath();
        if (stroke) {
            context.stroke();
        }
        if (fill) {
            context.fill();
        }
    };

    var show_intersection = function () {
        if (pointerX != -1 && pointerY != -1) {
            context.fillStyle = "#0000ff";
            context.strokeStyle = "#0000ff";
            context.lineWidth = 1;
            context.beginPath();
            context.arc(pointerX, pointerY, 5, 0.0, 2 * Math.PI);
            context.closePath();
            context.fill();
            context.stroke();
        }
    };

    var show_opponent_status = function (x, y) {
        var text;
        var _height = 25;
        var _width = 100;

        context.lineWidth = 1;
        if (opponentPresent) {
            if (engine.current_color() === mycolor) {
                context.strokeStyle = "#00ff00";
                context.fillStyle = "#00ff00";
                text = 'ready';
            } else {
                context.strokeStyle = "#ffa500";
                context.fillStyle = "#ffa500";
                text = 'wait';
            }
        } else {
            context.strokeStyle = "#ff0000";
            context.fillStyle = "#ff0000";
            text = 'disconnect';
        }
        context.beginPath();
        context.fillRect(x, y, _width, _height);
        context.strokeRect(x, y, _width, _height);
        context.closePath();

        context.strokeStyle = "#000000";
        context.fillStyle = "#000000";
        context.font = "16px arial";
        context.textBaseline = "top";

        var textWidth = context.measureText(text).width;

        context.fillText(text, x + (_width - textWidth) / 2, y + 4);

        context.strokeStyle = "#000000";
        context.beginPath();
        context.strokeRect(x, y, _width, _height);
        context.closePath();
    };

// private attributes
    var engine = e;
    var mycolor = color;

    var canvas;
    var context;
    var manager;
    var height;
    var width;

    var tolerance = 15;
    var delta_x = 0;
    var delta_y = 0;
    var delta_xy = 0;
    var offset = 0;

    var scaleX;
    var scaleY;

    var opponentPresent = local;

    var pointerX = -1;
    var pointerY = -1;

    var selected_coordinates = new Yinsh.Coordinates('X', -1);
    var selected_ring = new Yinsh.Coordinates('X', -1);
    var selected_row = [];
    var row_index = -1;
};
