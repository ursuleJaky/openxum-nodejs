MCTS.Player = function (c, e, sn) {

// public methods
	this.move = function() {
        var choice = null;

		init_search();
		for (var i = 0; i < simulationNumber; i++) {
			simulate_one_game_from_root();
		}
		return get_final_choice();
	};

// private methods
    var evaluate = function(b) {
        var b2 = clone(b);

        while (!b2.is_finished()) {
            play_a_random_turn(b2);
        }
        return b2.winner_is();
    };

    var get_final_choice = function() {
        var finalChoice = root.getChildNodes()[0].getMove();
        var best = root.getChildNodes()[0].getVisitNumber()

        for (var i = 1; i < root.getChildNodes().length; i++) {
            if (root.getChildNodes()[i].getVisitNumber() > best) {
                best = root.getChildNodes()[i].getVisitNumber();
                finalChoice = root.getChildNodes()[i].getMove();
            }
        }
        return finalChoice;
    };

    var init_search = function() {
        root = new MCTS.Node(engine, null, null, engine.get_possible_move_list());
    };

    var play_a_random_turn = function (e) {
        var list = e.get_possible_move_list();
        var move = e.select_move(list, Math.floor(Math.random() * list.list.length));

        e.move(move);
    };

    var simulate_one_game_from_root = function() {
		var current = root;
		var node = current;
		var monteCarloEngine = null;

		// descent
		while (current != null && !current.getEngine().is_finished()) {
            var possibleMoves = current.getPossibleMoves();

			if (possibleMoves.length > 0) {
				node = current;
				break;
			} else {
                node = current;
                current = current.choice(current.getEngine().current_color() == color);
            }
		}

		// expansion
		if (current == null || !current.getEngine().is_finished()) {
			current = node;

			var newEngine = clone(current.getEngine());
			var move = current.getFirstPossibleMove();

            newEngine.move(move);

			var newNode = new MCTS.Node(newEngine, current, move, newEngine.get_possible_move_list());

            current.removeFirstPossibleMove();
            current.addChildren(newNode);
			monteCarloEngine = newNode.getEngine();
			current = newNode;
		} else {
			monteCarloEngine = current.getEngine();
		}

		// evaluation
        var winner = evaluate(monteCarloEngine);

		// update
        updateScore(current, winner);
	};

    var updateScore = function(current, winner) {
        while (current != null) {
            current.visit();
            if (winner == color) {
                current.incWins();
            } else {
                current.incLosses();
            }
            current = current.getFather();
        }
    };

	var init = function(c, e, sn) {
        color = c;
        engine = e;
        simulationNumber = sn;
        root = null;
	};

// private attributes
    var color;
    var engine;
    var simulationNumber;
	var root;

    init(c, e, sn);
};