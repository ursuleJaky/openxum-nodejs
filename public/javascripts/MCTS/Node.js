MCTS.KUCT = 0.25;

MCTS.Node = function (e, f, m, l) {

// public methods
    this.choice = function (max) {
        if (childNodes.length == 0) {
            return null;
        } else {
            var best = childNodes[0];
            var bestScore = best.computeNodeScore();

            for (var i = 1; i < childNodes.length; i++) {
                var score = childNodes[i].computeNodeScore();

                if ((max && score > bestScore) || (!max && score < bestScore)) {
                    bestScore = score;
                    best = childNodes[i];
                }
            }
            return best;
        }
    };

    this.computeNodeScore = function () {
        var exploitation = winNumber / visitNumber;
        var exploration = Math.sqrt(2 * Math.log(father.getVisitNumber()) / visitNumber);

        return exploitation + MCTS.KUCT * exploration;
    };

    this.isFinished = function () {
        return engine.is_finished();
    };

    this.getEngine = function () {
        return engine;
    };

    this.getFather = function () {
        return father;
    };

    this.getNumberOfWins = function () {
        return winNumber;
    };

    this.getNumberOfLosses = function () {
        return lossNumber;
    };

    this.getVisitNumber = function () {
        return visitNumber;
    };

    this.visit = function () {
        ++visitNumber;
    };

    this.addChildren = function (n) {
        childNodes.push(n);
    };

    this.getChildNodes = function () {
        return childNodes;
    };

    this.getFirstPossibleMove = function () {
        return engine.select_move(possibleMoves, 0);
    };

    this.getPossibleMoves = function () {
        return possibleMoves.list;
    };

    this.removeFirstPossibleMove = function () {
        possibleMoves.list.shift();
    };

    this.incWins = function () {
        winNumber++;
    };

    this.incLosses = function () {
        lossNumber++;
    };

    this.getMove = function () {
        return move;
    };

    this.getLevel = function () {
        return level;
    };

// private methods
    var init = function (e, f, m, l) {
        engine = e;
        father = f;
        if (f) {
            level = f.getLevel() + 1;
        } else {
            level = 0;
        }
        move = m;
        possibleMoves = l;
        visitNumber = 0;
        lossNumber = 0;
        winNumber = 0;
        childNodes = [ ];
    };

// private attributes
    var engine;
    var father;
    var level;

    var move;

    var winNumber;
    var lossNumber;
    var visitNumber;

    var childNodes;
    var possibleMoves;

    init(e, f, m ,l);
};
