Yinsh.Status = function (markerNumber, turnList) {
    this.markerNumber = markerNumber;
    this.turnList = turnList;
};

Yinsh.Manager = function (e, gui_player, other_player, s) {

// public methods
    this.play = function () {
        if (engine.phase() == Yinsh.Phase.PUT_RING) {
            if (other.is_remote()) {
                other.put_ring(gui.get_selected_coordinates(), engine.current_color());
            }
            engine.put_ring(gui.get_selected_coordinates(), engine.current_color());
        } else if (engine.phase() == Yinsh.Phase.PUT_MARKER) {
            if (other.is_remote()) {
                other.put_marker(gui.get_selected_coordinates(), engine.current_color());
            }
            engine.put_marker(gui.get_selected_coordinates(), engine.current_color());
        } else if (engine.phase() == Yinsh.Phase.MOVE_RING) {
            if (other.is_remote()) {
                other.move_ring(gui.get_selected_ring(), gui.get_selected_coordinates());
            }
            engine.move_ring(gui.get_selected_ring(), gui.get_selected_coordinates());
            gui.clear_selected_ring();
            if (engine.get_rows(engine.current_color()).length == 0) {
                engine.remove_no_row();
                if (engine.get_rows(engine.current_color()).length == 0) {
                    engine.remove_no_row();
                }
            }
        } else if (engine.phase() == Yinsh.Phase.REMOVE_ROWS_AFTER ||
            engine.phase() == Yinsh.Phase.REMOVE_ROWS_BEFORE) {
            if (other.is_remote()) {
                other.remove_row(gui.get_selected_coordinates(), engine.current_color());
            }
            engine.remove_row(engine.select_row(gui.get_selected_coordinates(),
                engine.current_color()), engine.current_color());
            gui.clear_selected_row();
        } else if (engine.phase() == Yinsh.Phase.REMOVE_RING_AFTER ||
            engine.phase() == Yinsh.Phase.REMOVE_RING_BEFORE) {
            if (other.is_remote()) {
                other.remove_ring(gui.get_selected_coordinates(), engine.current_color());
            }
            engine.remove_ring(gui.get_selected_coordinates(), engine.current_color());
            if (engine.phase() == Yinsh.Phase.REMOVE_ROWS_BEFORE) {
                if (engine.get_rows(engine.current_color()).length == 0) {
                    engine.remove_no_row();
                }
            }
        }
        gui.draw();
        update_status();
        finish();
        if (engine.current_color() != gui.color()) {
            if (!other.is_remote()) {
                this.play_other();
            }
        }
    };

    this.play_other = function () {
        if (engine.phase() == Yinsh.Phase.PUT_RING) {
            other.put_ring();
        } else if (engine.phase() == Yinsh.Phase.REMOVE_ROWS_BEFORE) {
            other.remove_rows();
            other.remove_ring();
        } else if (engine.phase() == Yinsh.Phase.PUT_MARKER) {
            if (other.is_remote()) {
                other.put_marker();
            } else {
                other.move_ring(other.put_marker());
                if (engine.get_rows(engine.current_color()).length == 0) {
                    other.remove_no_row();
                    if (engine.phase() == Yinsh.Phase.REMOVE_ROWS_BEFORE) {
                        if (engine.get_rows(engine.current_color()).length == 0) {
                            engine.remove_no_row();
                        }
                    }
                } else {
                    if (!other.is_remote()) {
                        other.remove_row();
                        other.remove_ring();
                    }
                }
            }
        } else if (engine.phase() == Yinsh.Phase.MOVE_RING) {
            other.move_ring();
            if (engine.get_rows(engine.current_color()).length == 0) {
                other.remove_no_row();
                if (engine.phase() == Yinsh.Phase.REMOVE_ROWS_BEFORE) {
                    if (engine.get_rows(engine.current_color()).length == 0) {
                        engine.remove_no_row();
                    }
                }
            } else {
                if (!other.is_remote()) {
                    other.remove_row();
                    other.remove_ring();
                }
            }
        } else if (engine.phase() == Yinsh.Phase.REMOVE_ROWS_AFTER ||
            engine.phase() == Yinsh.Phase.REMOVE_ROWS_BEFORE) {
            other.remove_row();
        } else if (engine.phase() == Yinsh.Phase.REMOVE_RING_AFTER ||
            engine.phase() == Yinsh.Phase.REMOVE_RING_BEFORE) {
            other.remove_ring();
        }
        gui.draw();
        update_status();
        finish();
    };

// private methods
    var finish = function () {
        if (engine.is_finished()) {
            var popup = document.getElementById("winnerModalText");

            popup.innerHTML = "<h4>The winner is " +
                (engine.winner_is() == Yinsh.Color.BLACK ? "black" : "white") + "!</h4>";
            $("#winnerModal").modal("show");
        }
    };

    var update_status = function () {
        status.markerNumber.innerHTML = engine.available_marker_number();
        status.turnList.innerHTML = "";

        var turn_list = engine.turn_list();
        for (var i = 0; i < turn_list.length; ++i) {
            status.turnList.innerHTML += turn_list[i] + "<br />";
        }
    };

// private attributes
    var engine = e;
    var gui = gui_player;
    var other = other_player;
    var status = s;

    status.markerNumber.innerHTML = engine.available_marker_number();
};