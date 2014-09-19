KamisadoTestCase = TestCase("KamisadoTestCase");

KamisadoTestCase.prototype.testA = function(){
    var engine = new Kamisado.Engine(Kamisado.GameType.STANDARD, Kamisado.Color.BLACK);
    assertEquals(Kamisado.Color.BLACK, engine.current_color());
    assertEquals(Kamisado.Phase.MOVE_TOWER, engine.phase());
};

KamisadoTestCase.prototype.testB = function(){
    var engine = new Kamisado.Engine(Kamisado.GameType.STANDARD, Kamisado.Color.WHITE);
    assertEquals(Kamisado.Color.WHITE, engine.current_color());
    assertEquals(Kamisado.Phase.MOVE_TOWER, engine.phase());
};

KamisadoTestCase.prototype.testC = function(){
    var engine = new Kamisado.Engine(Kamisado.GameType.STANDARD, Kamisado.Color.BLACK);

    engine.move(new Kamisado.Turn({x: 0, y: 0}, {x: 0, y: 1}));
    assertEquals('orange', engine.get_black_towers()[0].color);
    assertEquals(0, engine.get_black_towers()[0].x);
    assertEquals(1, engine.get_black_towers()[0].y);
};