TestCase("KamisadoTestCase", {
    testA:function(){
        var engine = new Kamisado.Engine(Kamisado.GameType.STANDARD, Kamisado.Color.BLACK);
        assertEquals(Kamisado.Color.BLACK, engine.current_color());
        assertEquals(Kamisado.Phase.MOVE_TOWER, engine.phase());
    },
    testB:function(){
        var engine = new Kamisado.Engine(Kamisado.GameType.STANDARD, Kamisado.Color.WHITE);
        assertEquals(Kamisado.Color.WHITE, engine.current_color());
    }
  });