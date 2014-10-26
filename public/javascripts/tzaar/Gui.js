"use strict";

Tzaar.Gui = function (c, e, l) {
// private attributes
    var engine = e;
    var mycolor = c;

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

    var opponentPresent = l;

    var pointerX = -1;
    var pointerY = -1;

    var selected_coordinates;
    var selected_piece;
    var selected_capture;
    var selected_make_stack;
    var selected_pass;

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

        //state
        draw_state();

        //intersection
        show_intersection();

        if (engine.phase() === Tzaar.Phase.CHOOSE || engine.phase() === Tzaar.Phase.SECOND_CAPTURE || engine.phase() === Tzaar.Phase.MAKE_STRONGER) {
            draw_choice();
        }

        if ((engine.phase() === Tzaar.Phase.FIRST_MOVE || engine.phase() === Tzaar.Phase.CAPTURE ||
            engine.phase() === Tzaar.Phase.SECOND_CAPTURE) && selected_piece && selected_piece.is_valid()) {
            draw_possible_capture();
        }

        if (engine.phase() === Tzaar.Phase.MAKE_STRONGER && selected_piece && selected_piece.is_valid()) {
            draw_possible_make_stack();
        }
    };

    this.engine = function () {
        return engine;
    };

    this.get_move = function () {
        var move = null;

        if (engine.phase() === Tzaar.Phase.FIRST_MOVE) {
            move = new Tzaar.Move(Tzaar.MoveType.FIRST_MOVE, engine.current_color(), this.get_selected_piece(), this.get_selected_coordinates());
        } else if (engine.phase() === Tzaar.Phase.CAPTURE) {
            move = new Tzaar.Move(Tzaar.MoveType.CAPTURE, engine.current_color(), this.get_selected_piece(), this.get_selected_coordinates());
        } else if (engine.phase() === Tzaar.Phase.CHOOSE) {
            move = new Tzaar.Move(Tzaar.MoveType.CHOOSE, engine.current_color(), null, null, this.get_selected_capture() ? Tzaar.Phase.SECOND_CAPTURE : this.get_selected_make_stack() ? Tzaar.Phase.MAKE_STRONGER : Tzaar.Phase.PASS);
        } else if (engine.phase() === Tzaar.Phase.SECOND_CAPTURE) {
            move = new Tzaar.Move(Tzaar.MoveType.SECOND_CAPTURE, engine.current_color(), this.get_selected_piece(), this.get_selected_coordinates());
        } else if (engine.phase() === Tzaar.Phase.MAKE_STRONGER) {
            move = new Tzaar.Move(Tzaar.MoveType.MAKE_STRONGER, engine.current_color(), this.get_selected_piece(), this.get_selected_coordinates());
        }
        return move;
    };

    this.get_selected_capture = function () {
        return selected_capture;
    };

    this.get_selected_coordinates = function () {
        return selected_coordinates;
    };

    this.get_selected_make_stack = function () {
        return selected_make_stack;
    };

    this.get_selected_pass = function () {
        return selected_pass;
    };

    this.get_selected_piece = function () {
        return selected_piece;
    };

    this.is_animate = function () {
        return false;
    };

    this.is_remote = function () {
        return false;
    };

    this.move = function (move, color) {
        manager.play();
    };

    this.ready = function (r) {
        opponentPresent = r;
        if (manager) {
            manager.redraw();
        }
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

    this.unselect = function (all) {
        if (engine.phase() === Tzaar.Phase.FIRST_MOVE || engine.phase() === Tzaar.Phase.CAPTURE || engine.phase() === Tzaar.Phase.CHOOSE) {
            selected_capture = false;
            selected_make_stack = false;
            selected_pass = false;
        }
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
            _letter = Tzaar.letters[index];
        } else if (x > x_ref + delta_x / 2 && x >= x_ref_2 - tolerance) {
            _letter = Tzaar.letters[index + 1];
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

    var draw_button = function (x, y, text, select) {
        var _height = 25;
        var _width = 100;

        if (select) {
            context.strokeStyle = "#ff0000";
            context.fillStyle = "#ff0000";
        } else {
            context.strokeStyle = "#c0c0c0";
            context.fillStyle = "#c0c0c0";
        }
        context.beginPath();
        context.fillRect(x, y, _width, _height);
        context.strokeRect(x, y, _width, _height);
        context.closePath();

        context.strokeStyle = "#000000";
        context.fillStyle = "#000000";
        context.font = "bold 16px _sans";
        context.textBaseline = "top";

        var textWidth = context.measureText(text).width;

        context.fillText(text, x + (_width - textWidth) / 2, y + 3);

        context.strokeStyle = "#000000";
        context.beginPath();
        context.strokeRect(x, y, _width, _height);
        context.closePath();
    };

    var draw_choice = function () {
        var x = (width - (2 * 150 + 100)) / 2;

        draw_button(x, 3, "capture", selected_capture);
        draw_button(x + 150, 3, "make stack", selected_make_stack);
        draw_button(x + 300, 3, "pass", selected_pass);
    };

    var draw_coordinates = function () {
        var pt;

        context.strokeStyle = "#000000";
        context.fillStyle = "#000000";
        context.font = "16px _sans";
        context.textBaseline = "top";
        // letters
        for (var l = 'A'.charCodeAt(0); l < 'J'.charCodeAt(0); ++l) {
            pt = compute_coordinates(l, Tzaar.begin_number[l - 'A'.charCodeAt(0)]);
            pt[1] += 5;
            context.fillText(String.fromCharCode(l), pt[0], pt[1]);
        }

        // numbers
        context.textBaseline = "bottom";
        for (var n = 1; n < 10; ++n) {
            pt = compute_coordinates(Tzaar.begin_letter[n - 1].charCodeAt(0), n);
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
        context.fillStyle = "#ffffff";

        for (var l = 'A'.charCodeAt(0); l < 'J'.charCodeAt(0); ++l) {
            var index = l - 'A'.charCodeAt(0);

            _pt_begin = compute_coordinates(l, Tzaar.begin_number[index]);
            _pt_end = compute_coordinates(l, Tzaar.end_number[index]);
            if (l === 'E'.charCodeAt(0)) {
                var _pt_3 = compute_coordinates('E'.charCodeAt(0), 4);
                var _pt_4 = compute_coordinates('E'.charCodeAt(0), 6);

                context.moveTo(_pt_begin[0], _pt_begin[1]);
                context.lineTo(_pt_3[0], _pt_3[1]);
                context.moveTo(_pt_4[0], _pt_4[1]);
                context.lineTo(_pt_end[0], _pt_end[1]);
            } else {
                context.moveTo(_pt_begin[0], _pt_begin[1]);
                context.lineTo(_pt_end[0], _pt_end[1]);
            }
        }

        for (var n = 1; n < 10; ++n) {
            _pt_begin = compute_coordinates(Tzaar.begin_letter[n - 1].charCodeAt(0), n);
            _pt_end = compute_coordinates(Tzaar.end_letter[n - 1].charCodeAt(0), n);
            if (n === 5) {
                var _pt_3 = compute_coordinates('D'.charCodeAt(0), 5);
                var _pt_4 = compute_coordinates('F'.charCodeAt(0), 5);

                context.moveTo(_pt_begin[0], _pt_begin[1]);
                context.lineTo(_pt_3[0], _pt_3[1]);
                context.moveTo(_pt_4[0], _pt_4[1]);
                context.lineTo(_pt_end[0], _pt_end[1]);
            } else {
                context.moveTo(_pt_begin[0], _pt_begin[1]);
                context.lineTo(_pt_end[0], _pt_end[1]);
            }
        }

        for (var i = 0; i < 9; ++i) {
            _pt_begin = compute_coordinates(Tzaar.begin_diagonal_letter[i].charCodeAt(0),
                Tzaar.begin_diagonal_number[i]);
            _pt_end = compute_coordinates(Tzaar.end_diagonal_letter[i].charCodeAt(0),
                Tzaar.end_diagonal_number[i]);
            if (Tzaar.begin_diagonal_letter[i] === 'A' && Tzaar.begin_diagonal_number[i] === 1) {
                var _pt_3 = compute_coordinates('D'.charCodeAt(0), 4);
                var _pt_4 = compute_coordinates('F'.charCodeAt(0), 6);

                context.moveTo(_pt_begin[0], _pt_begin[1]);
                context.lineTo(_pt_3[0], _pt_3[1]);
                context.moveTo(_pt_4[0], _pt_4[1]);
                context.lineTo(_pt_end[0], _pt_end[1]);
            } else {
                context.moveTo(_pt_begin[0], _pt_begin[1]);
                context.lineTo(_pt_end[0], _pt_end[1]);
            }
        }
        context.stroke();
    };

    var draw_piece = function (x, y, color, type, selected) {
        var _width = delta_x;

        if (selected) {
            context.strokeStyle = "#00ff00";
            context.fillStyle = "#00ff00";
            context.lineWidth = delta_x / 5;
            context.beginPath();
            context.arc(x, y, _width / 3, 0.0, 2 * Math.PI);
            context.closePath();
            context.fill();
            context.stroke();
        } else {
            if (type === Tzaar.PieceType.TZAAR) {
                if (color === Tzaar.Color.BLACK) {
                    context.strokeStyle = "#000000";
                    context.fillStyle = "#000000";
                } else {
                    context.strokeStyle = "#ffffff";
                    context.fillStyle = "#ffffff";
                }
                context.beginPath();
                context.arc(x, y, _width * (1. / 3 + 1. / 10), 0.0, 2 * Math.PI);
                context.closePath();
                context.fill();

                context.strokeStyle = "#000000";
                context.lineWidth = 1;
                context.beginPath();
                context.arc(x, y, _width * (1. / 3 + 1. / 10), 0.0, 2 * Math.PI);
                context.closePath();
                context.stroke();

                if (color === Tzaar.Color.WHITE) {
                    context.strokeStyle = "#D2691E";
                    context.fillStyle = "#D2691E";
                } else {
                    context.strokeStyle = "#ffffff";
                    context.fillStyle = "#ffffff";
                }
                context.lineWidth = _width * 1. / 10;
                context.beginPath();
                context.arc(x, y, _width * 2 * (1. / 3 + 1. / 10) / 3, 0.0, 2 * Math.PI);
                context.closePath();
                context.stroke();
                context.beginPath();
                context.arc(x, y, _width * (1. / 3 - 1. / 10) / 3, 0.0, 2 * Math.PI);
                context.closePath();
                context.fill();
                context.stroke();
            } else if (type === Tzaar.PieceType.TZARRA) {
                if (color === Tzaar.Color.BLACK) {
                    context.strokeStyle = "#000000";
                    context.fillStyle = "#000000";
                } else {
                    context.strokeStyle = "#ffffff";
                    context.fillStyle = "#ffffff";
                }
                context.beginPath();
                context.arc(x, y, _width * (1. / 3 + 1. / 10), 0.0, 2 * Math.PI);
                context.closePath();
                context.fill();

                context.strokeStyle = "#000000";
                context.lineWidth = 1;
                context.beginPath();
                context.arc(x, y, _width * (1. / 3 + 1. / 10), 0.0, 2 * Math.PI);
                context.closePath();
                context.stroke();

                if (color === Tzaar.Color.WHITE) {
                    context.strokeStyle = "#D2691E";
                    context.fillStyle = "#D2691E";
                } else {
                    context.strokeStyle = "#ffffff";
                    context.fillStyle = "#ffffff";
                }

                context.lineWidth = 1;
                context.beginPath();
                context.arc(x, y, _width * 2 * (1. / 3 + 1. / 10) / 3, 0.0, 2 * Math.PI);
                context.closePath();
                context.stroke();

                context.lineWidth = 1;
                context.beginPath();
                context.arc(x, y, _width * (1. / 3 + 1. / 10) / 3, 0.0, 2 * Math.PI);
                context.closePath();
                context.fill();
                context.stroke();
            } else { // TOTT
                if (color === Tzaar.Color.BLACK) {
                    context.strokeStyle = "#000000";
                    context.fillStyle = "#000000";
                } else {
                    context.strokeStyle = "#ffffff";
                    context.fillStyle = "#ffffff";
                }
                context.beginPath();
                context.arc(x, y, _width * (1. / 3 + 1. / 10), 0.0, 2 * Math.PI);
                context.closePath();
                context.fill();

                context.strokeStyle = "#000000";
                context.lineWidth = 1;
                context.beginPath();
                context.arc(x, y, _width * (1. / 3 + 1. / 10), 0.0, 2 * Math.PI);
                context.closePath();
                context.stroke();

                if (color === Tzaar.Color.WHITE) {
                    context.strokeStyle = "#000000";
                    context.fillStyle = "#000000";
                } else {
                    context.strokeStyle = "#ffffff";
                    context.fillStyle = "#ffffff";
                }
                context.lineWidth = 1;
                context.beginPath();
                context.arc(x, y, _width * 2 * (1. / 3 + 1. / 10) / 3, 0.0, 2 * Math.PI);
                context.closePath();
                context.stroke();
                context.beginPath();
                context.arc(x, y, _width * (1. / 3 - 1. / 10) / 3, 0.0, 2 * Math.PI);
                context.closePath();
                context.stroke();
            }
        }
    };

    var draw_possible_capture = function () {
        var list = engine.get_possible_capture(selected_piece);

        for (var index in list) {
            var pt;

            pt = compute_coordinates(list[index].letter().charCodeAt(0), list[index].number());
            context.lineWidth = 4;
            context.strokeStyle = "#0000ff";
            context.fillStyle = "#0000ff";
            context.beginPath();
            context.arc(pt[0], pt[1], delta_x * (1. / 3 + 1. / 10), 0.0, 2 * Math.PI);
            context.closePath();
            context.stroke();
        }
    };

    var draw_possible_make_stack = function () {
        var list = engine.get_possible_make_stack(selected_piece);

        for (var index in list) {
            var pt;

            pt = compute_coordinates(list[index].letter().charCodeAt(0), list[index].number());
            context.lineWidth = 4;
            context.strokeStyle = "#0000ff";
            context.fillStyle = "#0000ff";
            context.beginPath();
            context.arc(pt[0], pt[1], delta_x * (1. / 3 + 1. / 10), 0.0, 2 * Math.PI);
            context.closePath();
            context.stroke();
        }
    };

    var draw_state = function () {
        for (var index in engine.get_intersections()) {
            var intersection = engine.get_intersections()[index];

            if (intersection.state() === Tzaar.State.NO_VACANT) {
                var pt = compute_coordinates(intersection.letter().charCodeAt(0), intersection.number());
                var n = intersection.size();

                draw_piece(pt[0], pt[1], intersection.color(), intersection.type(), selected_piece && selected_piece.is_valid() && intersection.coordinates().hash() === selected_piece.hash());
                if (n > 1) {
                    var text;
                    var shift_x = 0;

                    context.font = "10px _sans";
                    context.textBaseline = "top";
                    if (n < 10) {
                        text = n.toString();
                        shift_x = 3;
                    } else {
                        text = '1' + (n - 10).toString();
                        shift_x = 8;
                    }
                    context.fillStyle = "#ffff00";
                    context.beginPath();
                    context.fillRect(pt[0] - 10, pt[1] - delta_y * (1.0 / 3 + 1.0 / 10), 20, 15);
                    context.closePath();

                    context.fillStyle = "#000000";
                    context.fillText(text, pt[0] - shift_x, pt[1] - delta_y * (1.0 / 3 + 1.0 / 10));
                }
            }
        }
    };

    var getClickPosition = function (e) {
        var rect = canvas.getBoundingClientRect();

        return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
    };

    var init = function () {
        selected_capture = false;
        selected_coordinates = null;
        selected_make_stack = false;
        selected_pass = false;
        selected_piece = null;
    };

    var onClick = function (event) {
        var pos = getClickPosition(event);
        var letter = compute_letter(pos.x, pos.y);

        if (engine.phase() != Tzaar.Phase.CHOOSE) {
            if (letter != 'X') {
                var number = compute_number(pos.x, pos.y);

                if (number != -1) {
                    if (letter != 'E' || number != 5) {
                        var ok = false;

                        if (engine.phase() === Tzaar.Phase.FIRST_MOVE) {
                            if (selected_piece && selected_piece.is_valid() && engine.get_intersection(letter, number).state() === Tzaar.State.NO_VACANT && engine.get_intersection(letter, number).color() != engine.current_color()) {
                                selected_coordinates = new Tzaar.Coordinates(letter, number);
                                ok = true;
                            } else if (engine.get_intersection(letter, number).color() === engine.current_color()) {
                                selected_piece = new Tzaar.Coordinates(letter, number);
                                manager.redraw();
                            }
                        } else if (engine.phase() === Tzaar.Phase.CAPTURE || engine.phase() === Tzaar.Phase.SECOND_CAPTURE) {
                            if (selected_piece && selected_piece.is_valid() && engine.verify_capture(selected_piece, new Tzaar.Coordinates(letter, number))) {
                                selected_coordinates = new Tzaar.Coordinates(letter, number);
                                ok = true;
                            } else if (engine.get_intersection(letter, number).color() === engine.current_color()) {
                                selected_piece = new Tzaar.Coordinates(letter, number);
                                manager.redraw();
                            }
                        } else if (engine.phase() === Tzaar.Phase.MAKE_STRONGER) {
                            if (selected_piece && selected_piece.is_valid() && engine.get_intersection(letter, number).state() === Tzaar.State.NO_VACANT && engine.get_intersection(letter, number).color() === engine.current_color()) {
                                selected_coordinates = new Tzaar.Coordinates(letter, number);
                                ok = true;
                            } else if (engine.get_intersection(letter, number).color() === engine.current_color()) {
                                selected_piece = new Tzaar.Coordinates(letter, number);
                                manager.redraw();
                            }
                        }
                        if (ok) {
                            manager.play();
                        }
                    }
                }
            }
        } else {
            var x = (width - (2 * 150 + 100)) / 2;

            selected_capture = pos.x >= x && pos.x <= x + 100 && pos.y >= 3 && pos.y <= 28;
            selected_make_stack = pos.x >= x + 150 && pos.x <= x + 250 && pos.y >= 3 && pos.y <= 28;
            selected_pass = pos.x >= x + 300 && pos.x <= x + 400 && pos.y >= 3 && pos.y <= 28;
            if (selected_capture || selected_make_stack || selected_pass) {
                manager.play();
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

    init();
};
