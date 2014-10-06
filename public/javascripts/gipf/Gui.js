"use strict";

Gipf.GuiPlayer = function (color, e) {

// public methods
    this.color = function () {
        return mycolor;
    };

    this.draw = function () {
        compute_deltas();
        context.lineWidth = 1;

        // background
        context.strokeStyle = "#000000";
        context.fillStyle = "#ffffff";
        roundRect(0, 0, canvas.width, canvas.height, 17, true, true);

        // grid
        draw_grid();
        draw_coordinates();

        // state
        draw_state();

        // reserve
        draw_reserve();

        //intersection
        show_intersection();

        if (engine.phase() === Gipf.Phase.PUT_FIRST_PIECE) {
            show_possible_first_putting();
        } else if (engine.phase() === Gipf.Phase.PUT_PIECE) {
            show_possible_putting();
        } else if (engine.phase() === Gipf.Phase.PUSH_PIECE) {
            show_possible_pushing();
        }
        /*else if (parent()->phase() == Gui::REMOVE_ROWS) {
         show_possible_pushing();
         } */
    };

    this.engine = function () {
        return engine;
    };

    this.get_selected_coordinates = function () {
        return selected_coordinates;
    };

    this.get_selected_piece = function () {
        return selected_piece;
    };

    this.set_canvas = function (c) {
        canvas = c;
        context = c.getContext("2d");
        height = canvas.height;
        width = canvas.width;

        scaleX = width / canvas.offsetWidth;
        scaleY = height / canvas.offsetHeight;

        canvas.addEventListener("click", onClick);
        canvas.addEventListener('mousemove', onMove, false);

        this.draw();
    };

    this.set_manager = function (m) {
        manager = m;
    };

    this.unselect = function () {
        selected_coordinates = null;
        selected_piece = null;
    };

// private methods
    var compute_coordinates = function (letter, number) {
        return [ offset + (letter - 'A'.charCodeAt(0)) * delta_x,
            7 * delta_y + delta_xy * (letter - 'A'.charCodeAt(0)) - (number - 1) * delta_y ];
    };

    var compute_deltas = function () {
        offset = 30;
        delta_x = (width - 2 * offset) / 9.0;
        delta_y = delta_x;
        delta_xy = delta_y / 2;
        offset = (width - 8 * delta_x) / 2;
    };

    var compute_letter = function (x, y) {
        var index = Math.floor((x - offset) / delta_x);
        var x_ref = offset + delta_x * index;
        var x_ref_2 = offset + delta_x * (index + 1);
        var _letter = 'X';

        if (x < offset) {
            _letter = 'A';
        } else if (x <= x_ref + delta_x / 2 && x >= x_ref && x <= x_ref + tolerance) {
            _letter = Gipf.letters[index];
        } else if (x > x_ref + delta_x / 2 && x >= x_ref_2 - tolerance) {
            _letter = Gipf.letters[index + 1];
        }
        return _letter;
    };

    var compute_middle = function (first_letter, first_number, second_letter, second_number) {
        var pt1 = compute_coordinates(first_letter.charCodeAt(0), first_number);
        var pt2 = compute_coordinates(second_letter.charCodeAt(0), second_number);

        return { x: pt1[0] + (pt2[0] - pt1[0]) / 2, y: pt1[1] + (pt2[1] - pt1[1]) / 2 };
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

    var draw_background = function () {
        var pt;

        context.lineWidth = 1;
        context.strokeStyle = "#ffffff";
        context.fillStyle = "#c0c0c0";
        context.beginPath();
        pt = compute_middle('A', 1, 'B', 2);
        context.moveTo(pt.x, pt.y);
        pt = compute_middle('A', 5, 'B', 5);
        context.lineTo(pt.x, pt.y);
        pt = compute_middle('E', 9, 'E', 8);
        context.lineTo(pt.x, pt.y);
        pt = compute_middle('I', 9, 'H', 8);
        context.lineTo(pt.x, pt.y);
        pt = compute_middle('I', 5, 'H', 5);
        context.lineTo(pt.x, pt.y);
        pt = compute_middle('E', 1, 'E', 2);
        context.lineTo(pt.x, pt.y);
        pt = compute_middle('A', 1, 'B', 2);
        context.lineTo(pt.x, pt.y);
        context.closePath();
        context.fill();
    };

    var draw_coordinates = function () {
        var pt;

        context.strokeStyle = "#000000";
        context.fillStyle = "#000000";
        context.font = "16px _sans";
        context.textBaseline = "top";
        // letters
        for (var l = 'A'.charCodeAt(0); l < 'J'.charCodeAt(0); ++l) {
            pt = compute_coordinates(l, Gipf.begin_number[l - 'A'.charCodeAt(0)]);
            pt[1] += 5;
            context.fillText(String.fromCharCode(l), pt[0], pt[1]);
        }

        // numbers
        context.textBaseline = "bottom";
        for (var n = 1; n < 10; ++n) {
            pt = compute_coordinates(Gipf.begin_letter[n - 1].charCodeAt(0), n);
            pt[0] -= 15 + (n > 9 ? 5 : 0);
            pt[1] -= 3;
            context.fillText(n.toString(), pt[0], pt[1]);
        }
    };

    var draw_grid = function () {
        var _pt_begin;
        var _pt_end;

        draw_background();

        context.lineWidth = 1;
        context.strokeStyle = "#000000";
        context.fillStyle = "#ffffff";

        for (var l = 'A'.charCodeAt(0); l < 'J'.charCodeAt(0); ++l) {
            var index = l - 'A'.charCodeAt(0);

            _pt_begin = compute_coordinates(l, Gipf.begin_number[index]);
            _pt_end = compute_coordinates(l, Gipf.end_number[index]);
            context.moveTo(_pt_begin[0], _pt_begin[1]);
            context.lineTo(_pt_end[0], _pt_end[1]);
        }

        for (var n = 1; n < 10; ++n) {
            _pt_begin = compute_coordinates(Gipf.begin_letter[n - 1].charCodeAt(0), n);
            _pt_end = compute_coordinates(Gipf.end_letter[n - 1].charCodeAt(0), n);
            context.moveTo(_pt_begin[0], _pt_begin[1]);
            context.lineTo(_pt_end[0], _pt_end[1]);
        }

        for (var i = 0; i < 9; ++i) {
            _pt_begin = compute_coordinates(Gipf.begin_diagonal_letter[i].charCodeAt(0),
                Gipf.begin_diagonal_number[i]);
            _pt_end = compute_coordinates(Gipf.end_diagonal_letter[i].charCodeAt(0),
                Gipf.end_diagonal_number[i]);
            context.moveTo(_pt_begin[0], _pt_begin[1]);
            context.lineTo(_pt_end[0], _pt_end[1]);
        }
        context.stroke();
    };

    var draw_piece = function (x, y, color, gipf) {
        if (color === Gipf.Color.BLACK) {
            context.strokeStyle = "#000000";
            context.fillStyle = "#000000";
        } else {
            context.strokeStyle = "#ffffff";
            context.fillStyle = "#ffffff";
        }
        context.beginPath();
        context.arc(x, y, delta_x * (1. / 3 + 1. / 10), 0.0, 2 * Math.PI);
        context.closePath();
        context.fill();

        if (color === Gipf.Color.WHITE) {
            context.strokeStyle = "#000000";
            context.fillStyle = "#000000";
        } else {
            context.strokeStyle = "#ffffff";
            context.fillStyle = "#ffffff";
        }

        context.lineWidth = 3;
        context.beginPath();
        context.arc(x, y, delta_x * (1. / 3 + 1. / 10), 0.0, 2 * Math.PI);
        context.closePath();
        context.stroke();

        if (gipf) {
            context.beginPath();
            context.arc(x, y, delta_x * (1. / 3 + 1. / 10) / 2, 0.0, 2 * Math.PI);
            context.closePath();
            context.stroke();
        }
    };

    var draw_reserve = function() {
        context.lineWidth = 1;
        context.strokeStyle = "#000000";
        context.fillStyle = "#000000";
        for (var i = 0; i < engine.get_black_piece_number(); ++i) {
            context.beginPath();
            context.rect(10 + i * 10, 10, 5, 15);
            context.closePath();
            context.stroke();
            context.fill();
        }
        context.fillStyle = "#ffffff";
        for (var i = 0; i < engine.get_white_piece_number(); ++i) {
            context.beginPath();
            context.rect(10 + i * 10, 30, 5, 15);
            context.closePath();
            context.stroke();
            context.fill();
        }
        context.lineWidth = 3;
        context.strokeStyle = "#ff0000";
        context.fillStyle = "#000000";
        for (var i = 0; i < engine.get_black_captured_piece_number(); ++i) {
            context.beginPath();
            context.rect(10 + (engine.get_black_piece_number() + i) * 10, 10, 5, 15);
            context.closePath();
            context.stroke();
            context.fill();
        }
        context.fillStyle = "#ffffff";
        for (var i = 0; i < engine.get_white_captured_piece_number(); ++i) {
            context.beginPath();
            context.rect(10 + (engine.get_white_piece_number() + i) * 10, 30, 5, 15);
            context.closePath();
            context.stroke();
            context.fill();
        }
    };

    var draw_rows = function () {
        if (engine.phase() === Gipf.Phase.REMOVE_ROWS) {
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

            //TODO
            /*                yinsh::Row::const_iterator it = mSelectedRow.begin();

             while (it != mSelectedRow.end()) {
             int x,y;

             computeCoordinates(it->letter(), it->number(), x, y);
             mContext->set_source_rgb(0, 0, 255);
             mContext->set_line_width(1.);
             mContext->arc(x, y, mDelta_x * (1. / 3 - 1. / 10) - 1,
             0.0, 2 * M_PI);
             mContext->fill();
             mContext->stroke();
             ++it;
             } */
        }
    };

    var draw_state = function () {
        for (var index in engine.get_intersections()) {
            var intersection = engine.get_intersections()[index];

            if (intersection.state() != Gipf.State.VACANT) {
                var pt = compute_coordinates(intersection.letter().charCodeAt(0), intersection.number());

                draw_piece(pt[0], pt[1], intersection.color(), intersection.gipf());
            }
        }
        draw_rows();
    };

    var getClickPosition = function (e) {
        var rect = canvas.getBoundingClientRect();

        return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
    };

    var init = function () {
        selected_coordinates = null;
        selected_piece = null;
    };

    var onClick = function (event) {
        var pos = getClickPosition(event);
        var letter = compute_letter(pos.x, pos.y);

        if (letter != 'X') {
            var number = compute_number(pos.x, pos.y);

            if (number != -1) {
                var ok = false;

                if (engine.phase() === Gipf.Phase.PUT_FIRST_PIECE) {
                    if (engine.verify_first_putting(letter, number)) {
                        selected_coordinates = new Gipf.Coordinates(letter, number);
                        ok = true;
                    }
                } else if (engine.phase() === Gipf.Phase.PUT_PIECE) {
                    if (engine.verify_putting(letter, number)) {
                        selected_piece = new Gipf.Coordinates(letter, number);
                        ok = true;
                    }
                } else if (engine.phase() === Gipf.Phase.PUSH_PIECE) {
                    if (engine.verify_pushing(selected_piece, letter, number)) {
                        selected_coordinates = new Gipf.Coordinates(letter, number);
                        ok = true;
                    }
                } else if (engine.phase() === Gipf.Phase.REMOVE_ROWS) {
                    selected_coordinates = new Gipf.Coordinates(letter, number);
                    ok = true;
                }
                if (ok) {
                    manager.play();
                }
            }
        }
    };

    var onMove = function (event) {
        var pos = getClickPosition(event);
        var letter = compute_letter(pos.x, pos.y);

        if (letter != 'X') {
            var number = compute_number(pos.x, pos.y);

            if (number != -1) {
                if (compute_pointer(pos.x, pos.y)) {
                    manager.redraw();
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
        if (fill) {
            context.fill();
        }
        if (stroke) {
            context.stroke();
        }
    };

    var show_possible_first_putting = function () {
        var list = engine.get_possible_first_putting_list();

        for (var index in list) {
            var coordinates = list[index];
            var pt = compute_coordinates(coordinates.letter().charCodeAt(0), coordinates.number());

            context.fillStyle = "#0000ff";
            context.strokeStyle = "#0000ff";
            context.lineWidth = 4;
            context.beginPath();
            context.arc(pt[0], pt[1], delta_x * (1. / 3 + 1. / 10), 0.0, 2 * Math.PI);
            context.closePath();
            context.stroke();
        }
    };

    var show_possible_pushing = function () {
        var list = engine.get_possible_pushing_list(selected_piece);

        for (var index in list) {
            var coordinates = list[index];
            var pt = compute_coordinates(coordinates.letter().charCodeAt(0), coordinates.number());

            context.fillStyle = "#0000ff";
            context.strokeStyle = "#0000ff";
            context.lineWidth = 4;
            context.beginPath();
            context.arc(pt[0], pt[1], delta_x * (1. / 3 + 1. / 10), 0.0, 2 * Math.PI);
            context.closePath();
            context.stroke();
        }
    };

    var show_possible_putting = function () {
        var list = engine.get_possible_putting_list();

        for (var index in list) {
            var coordinates = list[index];
            var pt = compute_coordinates(coordinates.letter().charCodeAt(0), coordinates.number());

            context.fillStyle = "#0000ff";
            context.strokeStyle = "#0000ff";
            context.lineWidth = 4;
            context.beginPath();
            context.arc(pt[0], pt[1], delta_x * (1. / 3 + 1. / 10), 0.0, 2 * Math.PI);
            context.closePath();
            context.stroke();
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

// private attributes
    var engine = e;
    var mycolor = color;

    var canvas;
    var context;
    var manager;
    var height;
    var width;

    var tolerance = 15;

    var delta_x;
    var delta_y;
    var delta_xy;
    var offset;

    var scaleX;
    var scaleY;

    var pointerX = -1;
    var pointerY = -1;

    var selected_coordinates;
    var selected_piece;

    init();
};
