'use strict';

Pentago.Gui = function (c, e, l, g) {

// private attributes
    var _engine = e;
    var _color = c;
    var opponentPresent = l;
    var _gui = g;

    var _canvas;
    var _context;
    var _manager;

    var _height;
    var _width;
    var _scaleX;
    var _scaleY;

    var _deltaX;
    var _deltaY;
    var _offsetX;
    var _offsetY;

    var _pointerX;
    var _pointerY;

    var _selected_coordinates;
    var _selected_board;
    var _selected_direction;

// private methods
    var compute_coordinates = function (letter, number) {
        return [
            _offsetX + ((letter - 'a'.charCodeAt(0)) + 0.5) * _deltaX,
            _offsetY + ((number - 1) + 0.5) * _deltaY ];
    };

    var compute_letter = function (x, y) {
        var index = Math.floor((x - _offsetX) / _deltaX);
        var x_ref = _offsetX + _deltaX * index;
        var x_ref2 = _offsetX + _deltaX * (index + 1);
        var letter = 'X';

        if (x >= x_ref && x <= x_ref2) {
            letter = String.fromCharCode('a'.charCodeAt(0) + index);
        }
        return letter;
    };

    var compute_number = function (x, y) {
        var index = Math.floor((y - _offsetY) / _deltaY);
        var y_ref = _offsetY + _deltaY * index;
        var y_ref2 = _offsetY + _deltaY * (index + 1);
        var number = -1;

        if (y >= y_ref && y <= y_ref2) {
            number = index + 1;
        }
        return number;
    };

    var compute_pointer = function (x, y) {
        var change = false;
        var letter = compute_letter(x, y);

        if (letter !== 'X') {
            var number = compute_number(x, y);

            if (number !== -1) {
//                if (_engine.exist_intersection(letter, number)) {
                    var pt = compute_coordinates(letter.charCodeAt(0), number);

                    _pointerX = pt[0];
                    _pointerY = pt[1];
                    change = true;
/*                } else {
                    _pointerX = _pointerY = -1;
                    change = true;
                } */
            } else {
                if (_pointerX !== -1) {
                    _pointerX = _pointerY = -1;
                    change = true;
                }
            }
        } else {
            if (_pointerX != -1) {
                _pointerX = _pointerY = -1;
                change = true;
            }
        }
        return change;
    };

    var draw_rotation_arrow = function (x, y, orientation) {
        var i;
        var xnew, ynew;
        var width    = 40;
        var height   = 10;
        var arrowW   = 0.35 * width;
        var arrowH   = 0.75 * height;
        var points   = [ {x: 0, y: (height-arrowH)/2},
            {x: (width-arrowW), y: (height-arrowH)/2},
            {x: (width-arrowW), y: 0},
            {x: width, y: height/2},
            {x: (width-arrowW), y: height},
            {x: (width-arrowW), y: height-((height-arrowH)/2)},
            {x: 0, y: height-((height-arrowH)/2)} ];
        var s = Math.sin(orientation);
        var c = Math.cos(orientation);

        for (i = 0; i < points.length; i++) {
            points[i].y -= height/2;
        }
        for (i = 0; i < points.length; i++) {
            xnew = points[i].x * c - points[i].y * s;
            ynew = points[i].x * s + points[i].y * c;
            points[i].x = xnew;
            points[i].y = ynew + height/2;
        }
        _context.fillStyle = "#FF0000";
        _context.beginPath();
        _context.moveTo(points[0].x + x, points[0].y + y);
        for (i = 1; i < points.length; i++) {
            _context.lineTo(points[i].x + x, points[i].y + y);
        }
        _context.closePath();
        _context.fill();
    };

    var draw_hole = function (x, y, width) {
        var gr = _context.createRadialGradient(x, y, width / 5, x, y, width);

        _context.beginPath();
        gr.addColorStop(1, '#000000');
        gr.addColorStop(0, '#ece88c');
        _context.fillStyle = gr;
        _context.arc(x, y, width / 2, 0.0, 2 * Math.PI, false);
        _context.closePath();
        _context.fill();
    };

    var draw_marble = function (x, y, width, color) {
        var gr = _context.createLinearGradient(x, y, x + width / 3, y + width / 3);

        _context.beginPath();
        if (color === Pentago.State.WHITE) {
            gr.addColorStop(0, '#ffffff');
            gr.addColorStop(1, '#c0c0c0');
        } else if (color === Pentago.State.BLACK) {
            gr.addColorStop(0, '#000000');
            gr.addColorStop(1, '#c0c0c0');
        }
        _context.fillStyle = gr;
        _context.arc(x, y, width / 2, 0.0, 2 * Math.PI, false);
        _context.closePath();
        _context.fill();
        _context.stroke();
    };

    var draw_grid = function () {
        var i, j;

        _context.lineWidth = 1;
        _context.strokeStyle = "#000000";

        // background
        _context.fillStyle = 'white';
        _context.beginPath();
        _context.moveTo(_offsetX - 10, _offsetY - 10);
        _context.lineTo(_offsetX + 6 * _deltaX + 10, _offsetY - 10);
        _context.lineTo(_offsetX + 6 * _deltaX + 10, _offsetY + 6 * _deltaY + 10);
        _context.lineTo(_offsetX - 10, _offsetY + 6 * _deltaY + 10);
        _context.moveTo(_offsetX - 10, _offsetY - 10);
        _context.closePath();
        _context.fill();

        // grid
        for (i = 0; i < 6; ++i) {
            for (j = 0; j < 6; ++j) {
                _context.fillStyle = '#ece88c';
                _context.lineWidth = 1;
                _context.beginPath();
                _context.moveTo(_offsetX + i * _deltaX, _offsetY + j * _deltaY);
                _context.lineTo(_offsetX + (i + 1) * _deltaX - 2, _offsetY + j * _deltaY);
                _context.lineTo(_offsetX + (i + 1) * _deltaX - 2, _offsetY + (j + 1) * _deltaY - 2);
                _context.lineTo(_offsetX + i * _deltaX, _offsetY + (j + 1) * _deltaY - 2);
                _context.lineTo(_offsetX + i * _deltaX, _offsetY + j * _deltaY);
                _context.closePath();
                _context.fill();
                _context.stroke();
                draw_hole(_offsetX + (i + 0.5) * _deltaX, _offsetY + (j + 0.5) * _deltaY, _deltaX / 2)
            }
        }
    };

    var draw_state = function () {
        var state, i, j;

        for (i = 0; i < 6; ++i) {
            for (j = 0; j < 6; ++j) {
                state = _engine.get_state(String.fromCharCode('a'.charCodeAt(0) + i) + (j + 1));
                if (state !== Pentago.State.EMPTY) {
                    draw_marble(_offsetX + (i + 0.5) * _deltaX,
                            _offsetY + (j + 0.5) * _deltaY, _deltaX / 1.5, state);
                }
            }
        }
    };

    var getClickPosition = function (e) {
        var rect = _canvas.getBoundingClientRect();

        return { x: (e.clientX - rect.left) * _scaleX, y: (e.clientY - rect.top) * _scaleY };
    };

    var init = function () {
        _selected_coordinates = null;
        _selected_board = null;
        _selected_direction = null;
    };

    var onClick = function (event) {
        if (_engine.current_color() === _color || _gui) {
            var pos = getClickPosition(event);

            if (_engine.phase() === Pentago.Phase.PUT_MARBLE) {
                var letter = compute_letter(pos.x, pos.y);

                if (letter !== 'X') {
                    var number = compute_number(pos.x, pos.y);

                    if (number !== -1) {
                        _selected_coordinates = new Pentago.Coordinates(letter, number);
                        _manager.play();
                    }
                }
            } else if (_engine.phase() === Pentago.Phase.ROTATE) {
                var ok = false;

                if (pos.x > 0 && pos.x <= 25) {
                    if (pos.y > 20 && pos.y <= 20 + 40) {
                        _selected_board = Pentago.Board.TOP_LEFT;
                        _selected_direction = Pentago.Direction.ANTI_CLOCKWISE;
                        ok = true;
                    } else if (pos.y < _height - 20 && pos.y >= _height - 20 - 40) {
                        _selected_board = Pentago.Board.BOTTOM_LEFT;
                        _selected_direction = Pentago.Direction.CLOCKWISE;
                        ok = true;
                    }
                } else if (pos.x > 25 && pos.x <= 40 + 25) {
                    if (pos.y > 0 && pos.y <= 20) {
                        _selected_board = Pentago.Board.TOP_LEFT;
                        _selected_direction = Pentago.Direction.CLOCKWISE;
                        ok = true;
                    } else if (pos.y < _height && pos.y >= _height - 20) {
                        _selected_board = Pentago.Board.BOTTOM_LEFT;
                        _selected_direction = Pentago.Direction.ANTI_CLOCKWISE;
                        ok = true;
                    }
                } else if (pos.x >= _width - 25 - 40 && pos.x < _width - 25) {
                    if (pos.y > 0 && pos.y <= 20) {
                        _selected_board = Pentago.Board.TOP_RIGHT;
                        _selected_direction = Pentago.Direction.ANTI_CLOCKWISE;
                        ok = true;
                    } else if (pos.y < _height && pos.y >= _height - 20) {
                        _selected_board = Pentago.Board.BOTTOM_RIGHT;
                        _selected_direction = Pentago.Direction.CLOCKWISE;
                        ok = true;
                    }
                } else if (pos.x >= _width - 25 && pos.x < _width) {
                    if (pos.y > 20 && pos.y <= 20 + 40) {
                        _selected_board = Pentago.Board.TOP_RIGHT;
                        _selected_direction = Pentago.Direction.CLOCKWISE;
                        ok = true;
                    } else if (pos.y < _height - 20 && pos.y >= _height - 20 - 40) {
                        _selected_board = Pentago.Board.BOTTOM_RIGHT;
                        _selected_direction = Pentago.Direction.ANTI_CLOCKWISE;
                        ok = true;
                    }
                }
                if (ok) {
                    _manager.play();
                }
            }
        }
    };

    var onMove = function (event) {
        if (_engine.current_color() === _color || _gui) {
            var pos = getClickPosition(event);
            var letter = compute_letter(pos.x, pos.y);

            if (letter !== 'X') {
                var number = compute_number(pos.x, pos.y);

                if (number !== -1) {
                    if (compute_pointer(pos.x, pos.y)) {
                        _manager.redraw();
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
        _context.beginPath();
        _context.moveTo(x + radius, y);
        _context.lineTo(x + width - radius, y);
        _context.quadraticCurveTo(x + width, y, x + width, y + radius);
        _context.lineTo(x + width, y + height - radius);
        _context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        _context.lineTo(x + radius, y + height);
        _context.quadraticCurveTo(x, y + height, x, y + height - radius);
        _context.lineTo(x, y + radius);
        _context.quadraticCurveTo(x, y, x + radius, y);
        _context.closePath();
        if (stroke) {
            _context.stroke();
        }
        if (fill) {
            _context.fill();
        }
    };

    var show_intersection = function () {
        if (_pointerX !== -1 && _pointerY !== -1) {
            _context.fillStyle = "#0000ff";
            _context.strokeStyle = "#0000ff";
            _context.lineWidth = 1;
            _context.beginPath();
            _context.arc(_pointerX, _pointerY, 5, 0.0, 2 * Math.PI);
            _context.closePath();
            _context.fill();
            _context.stroke();
        }
    };
    var show_rotation_arrows = function () {
        // TOP LEFT
        draw_rotation_arrow(25, 8, 0);
        draw_rotation_arrow(12, 20, Math.PI / 2);
        // TOP RIGHT
        draw_rotation_arrow(_width - 25, 8, Math.PI);
        draw_rotation_arrow(_width - 12, 20, Math.PI / 2);
        //  BOTTOM LEFT
        draw_rotation_arrow(25, _height - 18, 0);
        draw_rotation_arrow(12, _height- 28, 3 * Math.PI / 2);
        // BOTTOM RIGHT
        draw_rotation_arrow(_width - 25, _height - 18, Math.PI);
        draw_rotation_arrow(_width - 12, _height- 28, 3 * Math.PI / 2);
    };

// public methods
    this.color = function () {
        return _color;
    };

    this.draw = function () {
        _context.lineWidth = 1;

        // background
        _context.fillStyle = "#000000";
        roundRect(0, 0, _canvas.width, _canvas.height, 17, true, false);

        draw_grid();
        draw_state();
        if (_engine.phase() === Pentago.Phase.PUT_MARBLE) {
            show_intersection();
        } else if (_engine.phase() === Pentago.Phase.ROTATE) {
            show_rotation_arrows();
        }
   };

    this.get_move = function () {
        if (_engine.phase() === Pentago.Phase.PUT_MARBLE) {
            return new Pentago.Move(Pentago.MoveType.PUT_MARBLE, _engine.current_color(), _selected_coordinates);
        } else if (_engine.phase() === Pentago.Phase.ROTATE) {
            return new Pentago.Move(Pentago.MoveType.ROTATE, _engine.current_color(), _selected_board, _selected_direction);
        }
    };

    this.is_animate = function () {
        return false;
    };

    this.is_remote = function () {
        return false;
    };

    this.move = function (move, color) {
        _manager.play();
    };

    this.ready = function (r) {
        opponentPresent = r;
        if (_manager) {
            _manager.redraw();
        }
    };

    this.set_canvas = function (c) {
        _canvas = c;
        _context = c.getContext("2d");
        _height = _canvas.height;
        _width = _canvas.width;
        _scaleX = _height / _canvas.offsetHeight;
        _scaleY = _width / _canvas.offsetWidth;

        _deltaX = (_width * 0.95 - 40) / 6;
        _deltaY = (_height * 0.95 - 40) / 6;
        _offsetX = _width / 2 - _deltaX * 3;
        _offsetY = _height / 2 - _deltaY * 3;

        _canvas.addEventListener("click", onClick);
        _canvas.addEventListener('mousemove', onMove, false);
        this.draw();
    };

    this.set_manager = function (m) {
        _manager = m;
    };

    this.unselect = function () {
    };

    init();
};