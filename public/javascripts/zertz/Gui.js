"use strict";

Zertz.GuiPlayer = function (color, e) {

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

        draw_rings();

        draw_pool();

        draw_marbles();

        draw_captured_marbles();

        if (engine.phase() === Zertz.Phase.SELECT_MARBLE_IN_POOL) {
            show_marble_in_pool();
        }
        if (engine.phase() === Zertz.Phase.PUT_MARBLE) {
            show_selected_marble_in_pool();
        }
        if (engine.phase() === Zertz.Phase.REMOVE_RING) {
            show_possible_removing_rings();
        }
        if (engine.phase() === Zertz.Phase.CAPTURE) {
            if (selected_marble) {
                show_possible_capturing_marbles();
            } else {
                show_possible_capture();
            }
        }

        // intersection
        if (engine.phase() === Zertz.Phase.PUT_MARBLE || engine.phase() === Zertz.Phase.REMOVE_RING) {
            show_intersection();
        }
    };

    this.engine = function () {
        return engine;
    };

    this.get_selected_color = function () {
        return selected_color;
    };

    this.get_selected_coordinates = function () {
        return selected_coordinates;
    };

    this.get_selected_marble = function () {
        return selected_marble;
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
        selected_marble = null;
        selected_marble_in_pool = null;
        selected_color = null;
        pointerX = -1;
        pointerY = -1;
    };

// private methods
    var compute_coordinates = function (letter, number) {
        return [ offset + (letter - 'A'.charCodeAt(0)) * delta_x * Math.sqrt(3) / 2 + delta_x / 2,
            offset / 2 + 9 * delta_xy + delta_xy * (letter - 'A'.charCodeAt(0)) - (number - 1) * delta_y + delta_y / 2 ];
    };

    var compute_deltas = function () {
        offset = 30;
        delta_x = (width - 2 * offset) / 7.0;
        delta_y = delta_x;
        delta_xy = delta_y / 2;
        offset = (width - 7.0 * delta_x * Math.sqrt(3) / 2) / 2;
    };

    var compute_letter = function (x, y) {
        x /= Math.sqrt(3) / 2;
        x -= delta_x / 2;
//        y -= delta_y / 2;

        var index = Math.floor((x - offset) / delta_x);
        var x_ref = offset + delta_x * index;
        var x_ref_2 = offset + delta_x * (index + 1);
        var _letter = 'X';

        if (x < offset) {
            _letter = 'A';
        } else if (x <= x_ref + delta_x / 2 && x >= x_ref && x <= x_ref + tolerance) {
            _letter = Zertz.letters[index];
        } else if (x > x_ref + delta_x / 2 && x >= x_ref_2 - tolerance) {
            _letter = Zertz.letters[index + 1];
        }
        return _letter;
    };

    var compute_number = function (x, y) {
        x /= Math.sqrt(3) / 2;
        x -= delta_x / 2;
        y += delta_y / 2;

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

    var draw_captured_marbles_of = function(player) {
        var i = 0;
        var l = 0;
        var c = 0;
        var nc = [ 8, 7, 5, 3, 1 ];

        while (i < engine.get_captured_black_marble_number(player)) {
            if (player === Zertz.Color.ONE) {
                draw_marble(20 + 30 * c, height - (20 + 30 * l), 25, Zertz.MarbleColor.BLACK);
            } else {
                draw_marble(width - (20 + 30 * c), height - (20 + 30 * l), 25, Zertz.MarbleColor.BLACK);
            }
            ++c;
            ++i;
            if (c === nc[l]) {
                c = 0;
                ++l;
            }
        }

        i = 0;
        while (i < engine.get_captured_grey_marble_number(player)) {
            if (player === Zertz.Color.ONE) {
                draw_marble(20 + 30 * c, height - (20 + 30 * l), 25, Zertz.MarbleColor.GREY);
            } else {
                draw_marble(width - (20 + 30 * c), height - (20 + 30 * l), 25, Zertz.MarbleColor.GREY);
            }
            ++c;
            ++i;
            if (c === nc[l]) {
                c = 0;
                ++l;
            }
        }

        i = 0;
        while (i < engine.get_captured_white_marble_number(player)) {
            if (player === Zertz.Color.ONE) {
                draw_marble(20 + 30 * c, height - (20 + 30 * l), 25, Zertz.MarbleColor.WHITE);
            } else {
                draw_marble(width - (20 + 30 * c), height - (20 + 30 * l), 25, Zertz.MarbleColor.WHITE);
            }
            ++c;
            ++i;
            if (c === nc[l]) {
                c = 0;
                ++l;
            }
        }
    };

    var draw_captured_marbles = function() {
        draw_captured_marbles_of(Zertz.Color.ONE);
        draw_captured_marbles_of(Zertz.Color.TWO);
    };

    var draw_coordinates = function () {
        var pt;

        context.strokeStyle = "#000000";
        context.fillStyle = "#000000";
        context.font = "16px _sans";
        context.textBaseline = "top";
        // letters
        for (var l = 'A'.charCodeAt(0); l < 'J'.charCodeAt(0); ++l) {
            pt = compute_coordinates(l, Zertz.begin_number[l - 'A'.charCodeAt(0)]);
            pt[1] += 5;
            context.fillText(String.fromCharCode(l), pt[0], pt[1]);
        }

        // numbers
        context.textBaseline = "bottom";
        for (var n = 1; n < 10; ++n) {
            pt = compute_coordinates(Zertz.begin_letter[n - 1].charCodeAt(0), n);
            pt[0] -= 15 + (n > 9 ? 5 : 0);
            pt[1] -= 3;
            context.fillText(n.toString(), pt[0], pt[1]);
        }
    };

    var draw_marble = function (x, y, width, color) {
        var gr = context.createLinearGradient(x, y, x + width / 3, y + width / 3);

        context.beginPath();
        if (color === Zertz.MarbleColor.WHITE) {
            gr.addColorStop(0, '#ffffff');
            gr.addColorStop(1, '#c0c0c0');
        } else if (color === Zertz.MarbleColor.GREY) {
            gr.addColorStop(0, '#b0b0b0');
            gr.addColorStop(1, '#ffffff');
        } else if (color === Zertz.MarbleColor.BLACK) {
            gr.addColorStop(0, '#000000');
            gr.addColorStop(1, '#c0c0c0');
        }
        context.fillStyle = gr;
        context.arc(x, y, width / 2, 0.0, 2 * Math.PI, false);
        context.fill();
        context.stroke();
        context.closePath();
    };

    var draw_marbles = function () {
        for (var index in engine.get_intersections()) {
            var intersection = engine.get_intersections()[index];
            var state = intersection.state();

            if (state != Zertz.State.EMPTY) {
                if (state === Zertz.State.BLACK_MARBLE || state === Zertz.State.GREY_MARBLE || state === Zertz.State.WHITE_MARBLE) {
                    var pt = compute_coordinates(intersection.letter().charCodeAt(0), intersection.number());

                    draw_marble(pt[0], pt[1], 2 * delta_x / 3.0, intersection.color());
                }
            }
        }
    };

    var draw_ring = function (x, y, color) {
        var gr = context.createLinearGradient(x, y, x + delta_x / 3.0, y + delta_x / 3.0);

        context.beginPath();
        gr.addColorStop(0, '#008000');
        gr.addColorStop(1, '#98FB98');
        context.fillStyle = gr;
        context.arc(x, y, delta_x / 2.0 - 1, 0.0, 2 * Math.PI, false);
        context.fill();
        context.closePath();

        context.lineWidth = 1;
        context.strokeStyle = "#000000";
        context.beginPath();
        context.arc(x, y, delta_x / 2.0 - 1, 0.0, 2 * Math.PI, false);
        context.stroke();
        context.closePath();

        context.fillStyle = "#ffffff";
        context.beginPath();
        context.arc(x, y, delta_x / 5, 0.0, 2 * Math.PI, false);
        context.fill();
        context.stroke();
        context.closePath();
    };

    var draw_rings = function () {
        for (var index in engine.get_intersections()) {
            var intersection = engine.get_intersections()[index];

            if (intersection.state() != Zertz.State.EMPTY) {
                var pt = compute_coordinates(intersection.letter().charCodeAt(0), intersection.number());

                draw_ring(pt[0], pt[1]);
            }
        }
    };

    var draw_pool = function () {
        var i = 0;
        var l = 0;
        var c = 0;
        var nc = [ 8, 7, 5, 3, 1 ];

        while (i < engine.get_black_marble_number()) {
            draw_marble(20 + 30 * c, 20 + 30 * l, 25, Zertz.MarbleColor.BLACK);
            ++c;
            ++i;
            if (c === nc[l]) {
                c = 0;
                ++l;
            }
        }

        i = 0;
        while (i < engine.get_grey_marble_number()) {
            draw_marble(20 + 30 * c, 20 + 30 * l, 25, Zertz.MarbleColor.GREY);
            ++c;
            ++i;
            if (c === nc[l]) {
                c = 0;
                ++l;
            }
        }

        i = 0;
        while (i < engine.get_white_marble_number()) {
            draw_marble(20 + 30 * c, 20 + 30 * l, 25, Zertz.MarbleColor.WHITE);
            ++c;
            ++i;
            if (c === nc[l]) {
                c = 0;
                ++l;
            }
        }
    };

    var getClickPosition = function (e) {
        var rect = canvas.getBoundingClientRect();

        return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
    };

    var init = function () {
        selected_coordinates = null;
        selected_marble = null;
        selected_marble_in_pool = null;
    };

    var onClick = function (event) {
        var pos = getClickPosition(event);

        if (engine.phase() === Zertz.Phase.SELECT_MARBLE_IN_POOL) {
            if (pointerX != -1 && pointerY != -1) {
                selected_marble_in_pool = { x: pointerX, y: pointerY };
                manager.play();
            }
        } else {
            var letter = compute_letter(pos.x, pos.y);

            if (letter != 'X') {
                var number = compute_number(pos.x, pos.y);

                if (number != -1) {
                    var ok = false;

                    if (engine.phase() === Zertz.Phase.PUT_MARBLE) {
                        if (engine.get_intersection(letter, number).state() === Zertz.State.VACANT) {
                            selected_coordinates = new Zertz.Coordinates(letter, number);
                            ok = true;
                        }
                    } else if (engine.phase() === Zertz.Phase.REMOVE_RING) {
                        var coordinates = new Zertz.Coordinates(letter, number);

                        if (engine.verify_remove_ring(coordinates)) {
                            selected_coordinates = coordinates;
                            ok = true;
                        }
                    } else if (engine.phase() === Zertz.Phase.CAPTURE) {
                        var coordinates = new Zertz.Coordinates(letter, number);

                        if (selected_marble && engine.is_possible_capturing_marble_with(selected_marble, coordinates)) {
                            selected_coordinates = coordinates;
                            ok = true;
                        } else {
                            if (engine.is_possible_to_capture_with(engine.get_intersection(letter, number))) {
                                selected_marble = coordinates;
                            }
                        }
                    }
                    if (ok) {
                        manager.play();
                    }
                }
            }
        }
    };

    var find_marble_color = function(ref_l, ref_c) {
        var i = 0;
        var l = 0;
        var c = 0;
        var nc = [ 8, 7, 5, 3, 1 ];

        while (i < engine.get_black_marble_number()) {
            if (ref_l === l && ref_c === c) {
                return Zertz.MarbleColor.BLACK;
            }
            ++c;
            ++i;
            if (c === nc[l]) {
                c = 0;
                ++l;
            }
        }

        i = 0;
        while (i < engine.get_grey_marble_number()) {
            if (ref_l === l && ref_c === c) {
                return Zertz.MarbleColor.GREY;
            }
            ++c;
            ++i;
            if (c === nc[l]) {
                c = 0;
                ++l;
            }
        }

        i = 0;
        while (i < engine.get_white_marble_number()) {
            if (ref_l === l && ref_c === c) {
                return Zertz.MarbleColor.WHITE;
            }
            ++c;
            ++i;
            if (c === nc[l]) {
                c = 0;
                ++l;
            }
        }
    };

    var onMove = function (event) {
        var pos = getClickPosition(event);

        if (engine.phase() === Zertz.Phase.SELECT_MARBLE_IN_POOL) {
            var l = Math.floor((pos.y - 8.5) / 30);

            if (l < 6) {
                var c = Math.floor(pos.x / 30);
                var nc = [ 8, 7, 5, 3, 1 ];

                if (c < nc[l]) {
                    var n = 0;

                    for (var i = 0; i < l; ++i) {
                        n += nc[i];
                    }
                    n += c + 1;
                    if (n <= engine.get_black_marble_number() + engine.get_grey_marble_number() + engine.get_white_marble_number()) {
                        selected_color = find_marble_color(l, c);
                        pointerX = 20 + 30 * c;
                        pointerY = 20 + 30 * l;
                        manager.redraw();
                    }
                } else {
                    if (pointerX != -1 && pointerY != -1) {
                        pointerX = -1;
                        pointerY = -1;
                        manager.redraw();
                    } else {
                        pointerX = -1;
                        pointerY = -1;
                    }
                }
            } else {
                if (pointerX != -1 && pointerY != -1) {
                    pointerX = -1;
                    pointerY = -1;
                    manager.redraw();
                } else {
                    pointerX = -1;
                    pointerY = -1;
                }
            }
        } else {
            var change = pointerX != -1 && pointerY != -1;
            var letter = compute_letter(pos.x, pos.y);

            if (letter != 'X') {
                var number = compute_number(pos.x, pos.y);

                if (number != -1) {
                    if (compute_pointer(pos.x, pos.y)) {
                        manager.redraw();
                    }
                } else {
                    if (change) {
                        pointerX = -1;
                        pointerY = -1;
                        manager.redraw();
                    }
                }
            } else {
                if (change) {
                    pointerX = -1;
                    pointerY = -1;
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

    var show_marble_in_pool = function () {
        if (pointerX != -1 && pointerY != -1) {
            context.fillStyle = "#0000ff";
            context.strokeStyle = "#0000ff";
            context.lineWidth = 4;
            context.beginPath();
            context.arc(pointerX, pointerY, 12.5, 0.0, 2 * Math.PI);
            context.closePath();
            context.stroke();
        }
    };

    var show_possible_capturing_marbles = function()
    {
        var list = engine.get_possible_capturing_marbles(selected_marble);

        for (var index in list) {
            var pt = compute_coordinates(list[index].letter().charCodeAt(0), list[index].number());

            context.fillStyle = "#ff0000";
            context.strokeStyle = "#ff0000";
            context.lineWidth = 4;
            context.beginPath();
            context.arc(pt[0], pt[1], delta_x / 2.0, 0.0, 2 * Math.PI);
            context.closePath();
            context.stroke();
        }
    };

    var show_possible_capture = function() {
        var list = engine.get_can_capture_marbles();

        for (var index in list) {
            var pt = compute_coordinates(list[index].letter().charCodeAt(0), list[index].number());

            context.fillStyle = "#0000ff";
            context.strokeStyle = "#0000ff";
            context.lineWidth = 4;
            context.beginPath();
            context.arc(pt[0], pt[1], delta_x / 2.0, 0.0, 2 * Math.PI);
            context.closePath();
            context.stroke();
        }
   };

    var show_possible_removing_rings = function() {
        var list = engine.get_possible_removing_rings();

        for (var index in list) {
            var pt = compute_coordinates(list[index].letter().charCodeAt(0), list[index].number());

            context.fillStyle = "#0000ff";
            context.strokeStyle = "#0000ff";
            context.lineWidth = 4;
            context.beginPath();
            context.arc(pt[0], pt[1], delta_x / 2.0, 0.0, 2 * Math.PI);
            context.closePath();
            context.stroke();
        }
    };

    var show_selected_marble_in_pool = function () {
        if (selected_marble_in_pool) {
            context.fillStyle = "#0000ff";
            context.strokeStyle = "#0000ff";
            context.lineWidth = 4;
            context.beginPath();
            context.arc(selected_marble_in_pool.x, selected_marble_in_pool.y, 12.5, 0.0, 2 * Math.PI);
            context.closePath();
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
    var selected_marble;
    var selected_marble_in_pool;
    var selected_color;

    init();
};
