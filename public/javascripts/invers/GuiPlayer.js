"use strict";

Invers.GuiPlayer = function (color, engine) {

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
//        draw_forbidden_moves();
    };

    this.engine = function () {
        return engine;
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
    };

// private methods
    var compute_coordinates = function (x, y) {
        return { x: Math.floor((x - offsetX) / (deltaX + 4)), y: Math.floor((y - offsetY) / (deltaY + 4)) };
    };

    var draw_free_tile = function (index, color) {
        context.lineWidth = 2;
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
            draw_free_tile(index, 'red');
            ++index;
        }
        for (i = 0; i < engine.getYellowTileNumber(); ++i) {
            draw_free_tile(index, 'yellow');
            ++index;
        }
    };

    var draw_grid = function () {
        context.lineWidth = 1;
        context.strokeStyle = "#000000";
        for (var i = 0; i < 6; ++i) {
            for (var j = 0; j < 6; ++j) {
                context.fillStyle = engine.get_state()[i][j] === Invers.State.RED_FULL ? 'red' : 'yellow';
                context.beginPath();
                context.moveTo(offsetX + i * deltaX, offsetY + j * deltaY);
                context.lineTo(offsetX + (i + 1) * deltaX - 2, offsetY + j * deltaY);
                context.lineTo(offsetX + (i + 1) * deltaX - 2, offsetY + (j + 1) * deltaY - 2);
                context.lineTo(offsetX + i * deltaX, offsetY + (j + 1) * deltaY - 2);
                context.moveTo(offsetX + i * deltaX, offsetY + j * deltaY);
                context.closePath();
                context.fill();
            }
        }
    };

    var draw_inputs = function () {
        context.lineWidth = 1;
        context.strokeStyle = "#ffffff";
        context.fillStyle = "#ffffff";
        // LEFT
        for (var i = 0; i < 6; ++i) {
            context.beginPath();
            context.moveTo(offsetX - 25, offsetY + (i + 0.3) * deltaY);
            context.lineTo(offsetX - 5, offsetY + (i + 0.5) * deltaY);
            context.lineTo(offsetX - 25, offsetY + (i + 0.7) * deltaY);
            context.moveTo(offsetX - 25, offsetY + (i + 0.3) * deltaY);
            context.closePath();
            context.fill();
        }
        // RIGHT
        for (var i = 0; i < 6; ++i) {
            context.beginPath();
            context.moveTo(offsetX + deltaX * 6 + 25, offsetY + (i + 0.3) * deltaY);
            context.lineTo(offsetX + deltaX * 6 + 5, offsetY + (i + 0.5) * deltaY);
            context.lineTo(offsetX + deltaX * 6 + 25, offsetY + (i + 0.7) * deltaY);
            context.moveTo(offsetX + deltaX * 6 + 25, offsetY + (i + 0.3) * deltaY);
            context.closePath();
            context.fill();
        }
        // TOP
        for (var i = 0; i < 6; ++i) {
            context.beginPath();
            context.moveTo(offsetX + deltaX * (i + 0.3), offsetY - 25);
            context.lineTo(offsetX + deltaX * (i + 0.5), offsetY - 5);
            context.lineTo(offsetX + deltaX * (i + 0.7), offsetY - 25);
            context.moveTo(offsetX + deltaX * (i + 0.3), offsetY - 25);
            context.closePath();
            context.fill();
        }
        // BOTTOM
        for (var i = 0; i < 6; ++i) {
            context.beginPath();
            context.moveTo(offsetX + deltaX * (i + 0.3), offsetY + 6 * deltaY + 25);
            context.lineTo(offsetX + deltaX * (i + 0.5), offsetY + 6 * deltaY + 5);
            context.lineTo(offsetX + deltaX * (i + 0.7), offsetY + 6 * deltaY + 25);
            context.moveTo(offsetX + deltaX * (i + 0.3), offsetY + 6 * deltaY + 25);
            context.closePath();
            context.fill();
        }
    };

    var draw_forbidden_moves = function () {
        context.lineWidth = 2;
        context.strokeStyle = "#000000";

        // RIGHT
        for (var j = 0; j < 6; ++j) {
            if (!engine.is_possible({letter: String.fromCharCode("A".charCodeAt(0) + j),
                number: 6})) {
                context.beginPath();
                context.moveTo(offsetX + i * deltaX, offsetY + j * deltaY);
                context.lineTo(offsetX + (i + 1) * deltaX - 2, offsetY + (j + 1) * deltaY - 2);
                context.closePath();
                context.stroke();
            }
        }
    };

    var getClickPosition = function (e) {
        var rect = canvas.getBoundingClientRect();

        return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
    };

    var init = function () {
    };

    var onClick = function (event) {
        var pos = getClickPosition(event);
        var index = -1;

        // TOP
        if (pos.y < offsetY - 5 && pos.y > offsetY - 25) {
            if (pos.x < offsetX - 5 && pos.x > offsetX - 25) {
                index = 0;
                console.log("index 0");
            } else if (pos.x > offsetX + 6 * deltaX + 5 && pos.x < offsetX + 6 * deltaX + 25) {
                index = 1;
                console.log("index 1");
            } else {
                index = Math.round((pos.x - offsetX) / deltaX + 0.5);
                console.log('column: ' + index);
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

// private attributes
    var engine = engine;
    var mycolor = color;

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

    var selected_cell;
    var selected_tower;
    var possible_move_list;

    var moving_tower;
    var target;
    var delta;
    var id;

    init();
}
;
