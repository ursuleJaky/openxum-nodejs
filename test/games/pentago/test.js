"use strict";

var PentagoTestCase = TestCase("PentagoTestCase");

PentagoTestCase.prototype.testStory1 = function () {
    var engine = new Engine(Color.WHITE);

    assertEquals(engine.get_marble_number(), 0);
};

PentagoTestCase.prototype.testStory2 = function () {
    var engine = new Engine(Color.WHITE);

    assertEquals(engine.get_current_color(), Color.WHITE);
};

PentagoTestCase.prototype.testStory3 = function () {
    var engine = new Engine(Color.WHITE);

    engine.put_marble('a1', Color.WHITE);
    assertEquals(engine.get_state('a1'), State.WHITE);
};

PentagoTestCase.prototype.testStory4 = function () {
    var engine = new Engine(Color.WHITE);

    engine.put_marble('a1', Color.WHITE);
    assertEquals(engine.get_marble_number(), 1);
};

PentagoTestCase.prototype.testStory5 = function () {
    var engine = new Engine(Color.WHITE);

    engine.put_marble('a1', Color.WHITE);
    engine.rotate(Board.TOP_LEFT, Direction.CLOCKWISE);
    assertEquals(engine.get_state('a1'), State.EMPTY);
    assertEquals(engine.get_state('c1'), State.WHITE);
};

PentagoTestCase.prototype.testStory6 = function () {
    var engine = new Engine(Color.WHITE);

    engine.put_marble('a1', Color.WHITE);
    engine.rotate(Board.TOP_LEFT, Direction.CLOCKWISE);
    assertEquals(engine.get_current_color(), Color.BLACK);
};

PentagoTestCase.prototype.testStory7 = function () {
    var engine = new Engine(Color.WHITE);

    engine.put_marble('a1', Color.WHITE);
    engine.rotate(Board.TOP_LEFT, Direction.CLOCKWISE);
    engine.put_marble('a1', Color.BLACK);
    assertEquals(engine.get_marble_number(), 2);
    assertEquals(engine.get_state('a1'), State.BLACK);
};

PentagoTestCase.prototype.testStory8 = function () {
    var engine = new Engine(Color.WHITE);

    engine.put_marble('a1', Color.WHITE);
    engine.rotate(Board.TOP_LEFT, Direction.CLOCKWISE);
    engine.put_marble('a1', Color.BLACK);
    engine.rotate(Board.TOP_LEFT, Direction.ANTI_CLOCKWISE);
    assertEquals(engine.get_state('a1'), State.WHITE);
    assertEquals(engine.get_state('a3'), State.BLACK);
};

PentagoTestCase.prototype.testStory9 = function () {
    var engine = new Engine(Color.WHITE);

    engine.put_marble('a1', Color.WHITE);
    engine.rotate(Board.TOP_LEFT, Direction.CLOCKWISE);
    engine.put_marble('a1', Color.BLACK);
    engine.rotate(Board.TOP_LEFT, Direction.ANTI_CLOCKWISE);
    assertException(function () {
        engine.put_marble('a3', Color.WHITE);
    }, 'Error');
};

PentagoTestCase.prototype.testStory10 = function () {
    var engine = new Engine(Color.WHITE);

    engine.put_marble('a1', Color.WHITE);
    engine.rotate(Board.TOP_LEFT, Direction.CLOCKWISE);
    engine.put_marble('a1', Color.BLACK);
    engine.rotate(Board.TOP_LEFT, Direction.ANTI_CLOCKWISE);
    engine.put_marble('b1', Color.WHITE);
    engine.rotate(Board.TOP_LEFT, Direction.CLOCKWISE);
    engine.put_marble('a2', Color.BLACK);
    engine.rotate(Board.TOP_LEFT, Direction.ANTI_CLOCKWISE);
    engine.put_marble('c1', Color.WHITE);
    engine.rotate(Board.TOP_LEFT, Direction.CLOCKWISE);
    engine.put_marble('a3', Color.BLACK);
    engine.rotate(Board.TOP_LEFT, Direction.ANTI_CLOCKWISE);
    engine.put_marble('d1', Color.WHITE);
    engine.rotate(Board.TOP_RIGHT, Direction.ANTI_CLOCKWISE);
    engine.put_marble('f3', Color.BLACK);
    engine.rotate(Board.TOP_RIGHT, Direction.CLOCKWISE);
    assertEquals(engine.get_marble_number(), 8);
    assertEquals(engine.get_state('a1'), State.WHITE);
    assertEquals(engine.get_state('b1'), State.WHITE);
    assertEquals(engine.get_state('c1'), State.WHITE);
    assertEquals(engine.get_state('d1'), State.WHITE);
    assertEquals(engine.get_state('a3'), State.BLACK);
    assertEquals(engine.get_state('b3'), State.BLACK);
    assertEquals(engine.get_state('c3'), State.BLACK);
    assertEquals(engine.get_state('d3'), State.BLACK);
};

PentagoTestCase.prototype.testStory11 = function () {
    var engine = new Engine(Color.WHITE);

    engine.put_marble('a1', Color.WHITE);
    engine.rotate(Board.TOP_LEFT, Direction.CLOCKWISE);
    engine.put_marble('a1', Color.BLACK);
    engine.rotate(Board.TOP_LEFT, Direction.ANTI_CLOCKWISE);
    engine.put_marble('b1', Color.WHITE);
    engine.rotate(Board.TOP_LEFT, Direction.CLOCKWISE);
    engine.put_marble('a2', Color.BLACK);
    engine.rotate(Board.TOP_LEFT, Direction.ANTI_CLOCKWISE);
    engine.put_marble('c1', Color.WHITE);
    engine.rotate(Board.TOP_LEFT, Direction.CLOCKWISE);
    engine.put_marble('a3', Color.BLACK);
    engine.rotate(Board.TOP_LEFT, Direction.ANTI_CLOCKWISE);
    engine.put_marble('d1', Color.WHITE);
    engine.rotate(Board.TOP_RIGHT, Direction.ANTI_CLOCKWISE);
    engine.put_marble('f3', Color.BLACK);
    engine.rotate(Board.TOP_RIGHT, Direction.CLOCKWISE);
    assertFalse(engine.is_finished());
    engine.put_marble('e1', Color.WHITE);
    assertTrue(engine.is_finished());
    assertEquals(engine.winner_is(), Color.WHITE);
};

PentagoTestCase.prototype.testStory12 = function () {
    var engine = new Engine(Color.WHITE);

    engine.play('c4cbl;d4abr;c3ctl;c3ctl;c4cbl;e5cbr;b1ctl;b2ctr;c4cbl;c3');
    assertTrue(engine.is_finished());
    assertEquals(engine.winner_is(), Color.BLACK);
};

PentagoTestCase.prototype.testStory13 = function () {
    var engine = new Engine(Color.BLACK);

    assertEquals(engine.get_current_color(), Color.BLACK);
};

PentagoTestCase.prototype.testStory14 = function () {
    var engine = new Engine(Color.WHITE);

    engine.play('a1cbl;d1cbr;b1cbl;e1cbr;c1cbl;f1cbr');
    engine.play('a2cbl;d2cbr;b2cbl;e2cbr;c2cbl;f2cbr');
    engine.play('a3cbl;d3cbr;b3cbl;e3cbr;c3cbl;f3cbr');
    engine.play('b5ctl;a4ctr;e4ctl;b4ctr;f4ctl;d4ctr');
    engine.play('d5ctl;a5ctr;f5ctl;c4ctr;a6ctl;c5ctr');
    engine.play('b6ctl;e5ctr;d6ctl;c6ctr;f6ctl;e6ctr');
    assertTrue(engine.is_finished());
    assertNull(engine.winner_is());
};
