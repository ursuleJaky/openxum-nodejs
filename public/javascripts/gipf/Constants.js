// grid constants definition
Gipf.begin_letter = [ 'A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E' ];
Gipf.end_letter = [ 'E', 'F', 'G', 'H', 'I', 'I', 'I', 'I', 'I' ];
Gipf.begin_number = [ 1, 1, 1, 1, 1, 2, 3, 4, 5 ];
Gipf.end_number = [ 5, 6, 7, 8, 9, 9, 9, 9, 9 ];
Gipf.begin_diagonal_letter = [ 'A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E' ];
Gipf.end_diagonal_letter = [ 'E', 'F', 'G', 'H', 'I', 'I', 'I', 'I', 'I' ];
Gipf.begin_diagonal_number = [ 5, 4, 3, 2, 1, 1, 1, 1, 1 ];
Gipf.end_diagonal_number = [ 9, 9, 9, 9, 9, 8, 7, 6, 5 ];

// enums definition
Gipf.GameType = { BASIC: 0, STANDARD: 1, TOURNAMENT: 2 };
Gipf.Color = { NONE: -1, BLACK: 0, WHITE: 1 };
Gipf.Phase = { PUT_FIRST_PIECE: 0, PUT_PIECE: 1, PUSH_PIECE: 2, CAPTURE_PIECE: 3, REMOVE_ROWS: 4 };
Gipf.State = { VACANT: 0, WHITE_PIECE: 1, WHITE_GIPF: 2, BLACK_PIECE: 3, BLACK_GIPF: 4 };
Gipf.Direction = { NORTH_WEST: 0, NORTH: 1, NORTH_EAST: 2, SOUTH_EAST: 3, SOUTH: 4, SOUTH_WEST: 5 };
Gipf.letters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I' ];
