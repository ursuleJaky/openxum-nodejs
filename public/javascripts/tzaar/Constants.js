// grid constants definition
Tzaar.begin_letter = [ 'A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E' ];
Tzaar.end_letter = [ 'E', 'F', 'G', 'H', 'I', 'I', 'I', 'I', 'I' ];
Tzaar.begin_number = [ 1, 1, 1, 1, 1, 2, 3, 4, 5 ];
Tzaar.end_number = [ 5, 6, 7, 8, 9, 9, 9, 9, 9 ];
Tzaar.begin_diagonal_letter = [ 'A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E' ];
Tzaar.end_diagonal_letter = [ 'E', 'F', 'G', 'H', 'I', 'I', 'I', 'I', 'I' ];
Tzaar.begin_diagonal_number = [ 5, 4, 3, 2, 1, 1, 1, 1, 1 ];
Tzaar.end_diagonal_number = [ 9, 9, 9, 9, 9, 8, 7, 6, 5 ];

// enums definition
Tzaar.GameType = { STANDARD: 0 };
Tzaar.Color = { NONE: -1, BLACK: 0, WHITE: 1 };
Tzaar.Phase = { FIRST_MOVE: 0, CAPTURE: 1, CHOOSE: 2, SECOND_CAPTURE: 3, MAKE_STRONGER: 4, PASS: 5 };
Tzaar.State = { VACANT: 0, NO_VACANT: 1 };
Tzaar.PieceType = { TZAAR: 0, TZARRA: 1, TOTT: 2 };
Tzaar.Direction = { NORTH_WEST: 0, NORTH: 1, NORTH_EAST: 2, SOUTH_EAST: 3, SOUTH: 4, SOUTH_WEST: 5 };
Tzaar.letters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I' ];

// initial state
Tzaar.initial_type = [
    // column A
    Tzaar.PieceType.TOTT, Tzaar.PieceType.TOTT, Tzaar.PieceType.TOTT, Tzaar.PieceType.TOTT, Tzaar.PieceType.TOTT,
    // column B
    Tzaar.PieceType.TOTT, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TOTT,
    // column C
    Tzaar.PieceType.TOTT, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TZAAR, Tzaar.PieceType.TZAAR, Tzaar.PieceType.TZAAR, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TOTT,
    // column D
    Tzaar.PieceType.TOTT, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TZAAR, Tzaar.PieceType.TOTT, Tzaar.PieceType.TOTT, Tzaar.PieceType.TZAAR, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TOTT,
    // column E
    Tzaar.PieceType.TOTT, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TZAAR, Tzaar.PieceType.TOTT, Tzaar.PieceType.TOTT, Tzaar.PieceType.TZAAR, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TOTT,
    // column F
    Tzaar.PieceType.TOTT, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TZAAR, Tzaar.PieceType.TOTT, Tzaar.PieceType.TOTT, Tzaar.PieceType.TZAAR, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TOTT,
    // column G
    Tzaar.PieceType.TOTT, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TZAAR, Tzaar.PieceType.TZAAR, Tzaar.PieceType.TZAAR, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TOTT,
    // column H
    Tzaar.PieceType.TOTT, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TZARRA, Tzaar.PieceType.TOTT,
    // column I
    Tzaar.PieceType.TOTT, Tzaar.PieceType.TOTT, Tzaar.PieceType.TOTT, Tzaar.PieceType.TOTT, Tzaar.PieceType.TOTT
];

Tzaar.initial_color = [
    // column A
    Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.WHITE,
    // column B
    Tzaar.Color.WHITE, Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.WHITE, Tzaar.Color.WHITE,
    // column C
    Tzaar.Color.WHITE, Tzaar.Color.WHITE, Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.WHITE, Tzaar.Color.WHITE, Tzaar.Color.WHITE,
    // column D
    Tzaar.Color.WHITE, Tzaar.Color.WHITE, Tzaar.Color.WHITE, Tzaar.Color.BLACK, Tzaar.Color.WHITE, Tzaar.Color.WHITE, Tzaar.Color.WHITE, Tzaar.Color.WHITE,
    // column E
    Tzaar.Color.WHITE, Tzaar.Color.WHITE, Tzaar.Color.WHITE, Tzaar.Color.WHITE, Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.BLACK,
    // column F
    Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.WHITE, Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.BLACK,
    // column G
    Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.WHITE, Tzaar.Color.WHITE, Tzaar.Color.BLACK, Tzaar.Color.BLACK,
    // column H
    Tzaar.Color.BLACK, Tzaar.Color.BLACK, Tzaar.Color.WHITE, Tzaar.Color.WHITE, Tzaar.Color.WHITE, Tzaar.Color.BLACK,
    // column I
    Tzaar.Color.BLACK, Tzaar.Color.WHITE, Tzaar.Color.WHITE, Tzaar.Color.WHITE, Tzaar.Color.WHITE
];