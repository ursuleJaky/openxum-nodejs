"use strict";

Invers.Gui = function (c, e) {

// private attributes
    var engine = e;
    var mycolor = c;

    var canvas;
    var context;
    var manager;
    var height;
    var width;

    var deltaX;
    var deltaY;
    var offsetX;
    var offsetY;
    var scaleX;
    var scaleY;

    var free_colors;
    var selected_color;
    var selected_position;
    var selected_index;

// private methods
/*    var compute_coordinates = function (x, y) {
        return { x: Math.floor((x - offsetX) / (deltaX + 4)), y: Math.floor((y - offsetY) / (deltaY + 4)) };
    }; */

    var draw_free_tile = function (index, color, selected) {
        if (selected) {
            context.lineWidth = 5;
        } else {
            context.lineWidth = 2;
        }
        context.strokeStyle = "#ffffff";
        context.fillStyle = color;
        context.beginPath();
        if (index === 0) {
            context.moveTo(offsetX - 25, offsetY - 25);
            context.lineTo(offsetX - 5, offsetY - 25);
            context.lineTo(offsetX - 5, offsetY - 5);
            context.lineTo(offsetX - 25, offsetY - 5);
            context.lineTo(offsetX - 25, offsetY - 25);
        } else {
            context.moveTo(offsetX + 6 * deltaX + 25, offsetY - 25);
            context.lineTo(offsetX + 6 * deltaX + 5, offsetY - 25);
            context.lineTo(offsetX + 6 * deltaX + 5, offsetY - 5);
            context.lineTo(offsetX + 6 * deltaX + 25, offsetY - 5);
            context.lineTo(offsetX + 6 * deltaX + 25, offsetY - 25);
        }
        context.closePath();
        context.fill();
        context.stroke();
    };

    var draw_free_tiles = function () {
        var index = 0;
        var i;

        for (i = 0; i < engine.getRedTileNumber(); ++i) {
            draw_free_tile(index, 'red', selected_color === index);
            free_colors[index] = Invers.Color.RED;
            ++index;
        }
        for (i = 0; i < engine.getYellowTileNumber(); ++i) {
            draw_free_tile(index, 'yellow', selected_color === index);
            free_colors[index] = Invers.Color.YELLOW;
            ++index;
        }
    };

    var draw_grid = function () {
        var i, j;

        context.lineWidth = 1;
        context.strokeStyle = "#000000";
        for (i = 0; i < 6; ++i) {
            for (j = 0; j < 6; ++j) {
                context.fillStyle = (engine.get_state()[i][j] === Invers.State.RED_FULL ||
                    engine.get_state()[i][j] === Invers.State.RED_REVERSE) ? 'red' : 'yellow';
                context.lineWidth = 1;
                context.beginPath();
                context.moveTo(offsetX + i * deltaX, offsetY + j * deltaY);
                context.lineTo(offsetX + (i + 1) * deltaX - 2, offsetY + j * deltaY);
                context.lineTo(offsetX + (i + 1) * deltaX - 2, offsetY + (j + 1) * deltaY - 2);
                context.lineTo(offsetX + i * deltaX, offsetY + (j + 1) * deltaY - 2);
                context.moveTo(offsetX + i * deltaX, offsetY + j * deltaY);
                context.closePath();
                context.fill();
                if (engine.get_state()[i][j] === Invers.State.RED_REVERSE ||
                    engine.get_state()[i][j] === Invers.State.YELLOW_REVERSE) {
                    context.fillStyle = "#000000";
                    context.beginPath();
                    context.moveTo(offsetX + (i + 0.4) * deltaX, offsetY + (j + 0.4) * deltaY);
                    context.lineTo(offsetX + (i + 0.6) * deltaX - 2, offsetY + (j + 0.4) * deltaY);
                    context.lineTo(offsetX + (i + 0.6) * deltaX - 2, offsetY + (j + 0.6) * deltaY - 2);
                    context.lineTo(offsetX + (i + 0.4) * deltaX, offsetY + (j + 0.6) * deltaY - 2);
                    context.moveTo(offsetX + (i + 0.4) * deltaX, offsetY + (j + 0.4) * deltaY);
                    context.closePath();
                    context.fill();
                }
            }
        }
    };

    var is_forbidden = function (i, j, position, list) {
        var ok = false;
        var k;

        if (position === Invers.Position.LEFT) {
            ok = true;
            for (k = 0; k < list.left.length; ++k) {
                if (list.left[k].number === j + 1) {
                    return false;
                }
            }
        } else if (position === Invers.Position.RIGHT) {
            ok = true;
            for (k = 0; k < list.right.length; ++k) {
                if (list.right[k].number === j + 1) {
                    return false;
                }
            }
        } else if (position === Invers.Position.TOP) {
            ok = true;
            for (k = 0; k < list.top.length; ++k) {
                if (list.top[k].letter === String.fromCharCode('A'.charCodeAt(0) + i)) {
                    return false;
                }
            }
        } else if (position === Invers.Position.BOTTOM) {
            ok = true;
            for (k = 0; k < list.bottom.length; ++k) {
                if (list.bottom[k].letter === String.fromCharCode('A'.charCodeAt(0) + i)) {
                    return false;
                }
            }
        }
        return ok;
    };

    var draw_inputs = function () {
        var i;
        var list = engine.get_possible_move_list();

        context.lineWidth = 1;
        context.strokeStyle = "#ffffff";
        context.fillStyle = "#ffffff";
        // LEFT
        for (i = 0; i < 6; ++i) {
            if (!is_forbidden(0, i, Invers.Position.LEFT, list)) {
                context.beginPath();
                context.moveTo(offsetX - 25, offsetY + (i + 0.3) * deltaY);
                context.lineTo(offsetX - 5, offsetY + (i + 0.5) * deltaY);
                context.lineTo(offsetX - 25, offsetY + (i + 0.7) * deltaY);
                context.moveTo(offsetX - 25, offsetY + (i + 0.3) * deltaY);
                context.closePath();
                context.fill();
            }
        }
        // RIGHT
        for (i = 0; i < 6; ++i) {
            if (!is_forbidden(5, i, Invers.Position.RIGHT, list)) {
                context.beginPath();
                context.moveTo(offsetX + deltaX * 6 + 25, offsetY + (i + 0.3) * deltaY);
                context.lineTo(offsetX + deltaX * 6 + 5, offsetY + (i + 0.5) * deltaY);
                context.lineTo(offsetX + deltaX * 6 + 25, offsetY + (i + 0.7) * deltaY);
                context.moveTo(offsetX + deltaX * 6 + 25, offsetY + (i + 0.3) * deltaY);
                context.closePath();
                context.fill();
            }
        }
        // TOP
        for (i = 0; i < 6; ++i) {
            if (!is_forbidden(i, 0, Invers.Position.TOP, list)) {
                context.beginPath();
                context.moveTo(offsetX + deltaX * (i + 0.3), offsetY - 25);
                context.lineTo(offsetX + deltaX * (i + 0.5), offsetY - 5);
                context.lineTo(offsetX + deltaX * (i + 0.7), offsetY - 25);
                context.moveTo(offsetX + deltaX * (i + 0.3), offsetY - 25);
                context.closePath();
                context.fill();
            }
        }
        // BOTTOM
        for (i = 0; i < 6; ++i) {
            if (!is_forbidden(i, 5, Invers.Position.BOTTOM, list)) {
                context.beginPath();
                context.moveTo(offsetX + deltaX * (i + 0.3), offsetY + 6 * deltaY + 25);
                context.lineTo(offsetX + deltaX * (i + 0.5), offsetY + 6 * deltaY + 5);
                context.lineTo(offsetX + deltaX * (i + 0.7), offsetY + 6 * deltaY + 25);
                context.moveTo(offsetX + deltaX * (i + 0.3), offsetY + 6 * deltaY + 25);
                context.closePath();
                context.fill();
            }
        }
    };

    var getClickPosition = function (e) {
        var rect = canvas.getBoundingClientRect();

        return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
    };

    var init = function () {
        selected_color = Invers.Color.NONE;
        selected_index = -1;
        selected_position = Invers.Position.NONE;
        free_colors = [];
    };

    var onClick = function (event) {
        var pos = getClickPosition(event);
        var change_color = false;

        selected_index = -1;
        selected_position = Invers.Position.NONE;
        if (pos.y < offsetY - 5 && pos.y > offsetY - 25) { // TOP
            if (pos.x < offsetX - 5 && pos.x > offsetX - 25) {
                selected_color = free_colors[0];
                change_color = true;
            } else if (pos.x > offsetX + 6 * deltaX + 5 && pos.x < offsetX + 6 * deltaX + 25) {
                selected_color = free_colors[1];
                change_color = true;
            } else {
                selected_index = Math.round((pos.x - offsetX) / deltaX + 0.5);
                if (selected_index > 0 && selected_index < 7) {
                    selected_position = Invers.Position.TOP;
                } else {
                    selected_index = -1;
                }
            }
        } else if (pos.y > offsetY + 6 * deltaY + 5 && pos.y < offsetY + 6 * deltaY + 25) { // BOTTOM
            selected_index = Math.round((pos.x - offsetX) / deltaX + 0.5);
            if (selected_index > 0 && selected_index < 7) {
                selected_position = Invers.Position.BOTTOM;
            } else {
                selected_index = -1;
            }
        } else if (pos.x < offsetX - 5 && pos.x > offsetX - 25) { // LEFT
            selected_index = Math.round((pos.y - offsetY) / deltaY + 0.5);
            if (selected_index > 0 && selected_index < 7) {
                selected_position = Invers.Position.LEFT;
            } else {
                selected_index = -1;
            }
        } else if (pos.x > offsetX + 6 * deltaX + 5 && pos.x < offsetX + 6 * deltaX + 25) { // RIGHT
            selected_index = Math.round((pos.y - offsetY) / deltaY + 0.5);
            if (selected_index > 0 && selected_index < 7) {
                selected_position = Invers.Position.RIGHT;
            } else {
                selected_index = -1;
            }
        }

        if (change_color) {
            draw_free_tiles();
        }

        if (engine.phase() === Invers.Phase.PUSH_TILE && selected_color !== Invers.Color.NONE &&
            selected_index !== -1 && selected_position !== Invers.Position.NONE) {
            manager.play();
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

// public methods
    this.color = function () {
        return mycolor;
    };

    this.draw = function () {
        context.lineWidth = 1;

        // background
        context.fillStyle = "#000000";
        roundRect(0, 0, canvas.width, canvas.height, 17, true, false);

        draw_grid();
        draw_inputs();
        draw_free_tiles();
    };

    this.engine = function () {
        return engine;
    };

    this.get_move = function () {
        if (selected_color !== Invers.Color.NONE && selected_index !== -1 && selected_position !== Invers.Position.NONE) {
            var letter = 'X';
            var number = 0;

            if (selected_position === Invers.Position.LEFT || selected_position === Invers.Position.RIGHT) {
                number = selected_index;
            } else {
                letter = String.fromCharCode('A'.charCodeAt(0) + (selected_index - 1));
            }
            return new Invers.Move(selected_color, letter, number, selected_position);
        } else {
            return undefined;
        }
    };

    this.set_canvas = function (c) {
        canvas = c;
        context = c.getContext("2d");
        height = canvas.height;
        width = canvas.width;

        canvas.addEventListener("click", onClick);
        deltaX = (width * 0.95 - 40) / 6;
        deltaY = (height * 0.95 - 40) / 6;
        offsetX = width / 2 - deltaX * 3;
        offsetY = height / 2 - deltaY * 3;

        scaleX = height / canvas.offsetHeight;
        scaleY = width / canvas.offsetWidth;

        this.draw();
    };

    this.set_manager = function (m) {
        manager = m;
    };

    this.unselect = function () {
        selected_color = Invers.Color.NONE;
        selected_index = -1;
        selected_position = Invers.Position.NONE;
    };

    init();
};
