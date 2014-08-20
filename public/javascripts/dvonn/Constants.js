// grid constants definition
Dvonn.begin_letter = [ 'A', 'A', 'A', 'B', 'C' ];
Dvonn.end_letter = [ 'I', 'J', 'K', 'K', 'K' ];
Dvonn.begin_number = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3 ];
Dvonn.end_number = [ 3, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5 ];
Dvonn.begin_diagonal_letter = [ 'A', 'A', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I' ];
Dvonn.end_diagonal_letter = [ 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'K', 'K' ];
Dvonn.begin_diagonal_number = [ 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1 ];
Dvonn.end_diagonal_number = [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 3 ];

// enums definition
Dvonn.GameType = { STANDARD: 0 };
Dvonn.Color = { NONE: -1, BLACK: 0, WHITE: 1, RED: 2 };
Dvonn.Phase = { PUT_DVONN_PIECE: 0, PUT_PIECE: 1, MOVE_STACK: 2 };
Dvonn.State = { VACANT: 0, NO_VACANT: 1 };
Dvonn.Direction = { NORTH_WEST: 0, NORTH_EAST: 1, EAST: 2, SOUTH_EAST: 3, SOUTH_WEST: 4, WEST: 5 };
Dvonn.letters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K' ];
