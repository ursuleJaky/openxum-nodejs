// grid constants definition
Yinsh.begin_letter = [ 'B', 'A', 'A', 'A', 'A', 'B', 'B', 'C',
        'D', 'E', 'G' ];
Yinsh.end_letter = [ 'E', 'G', 'H', 'I', 'J', 'J', 'K', 'K', 'K',
    'K', 'J' ];
Yinsh.begin_number = [ 2, 1, 1, 1, 1, 2, 2, 3, 4, 5, 7 ];
Yinsh.end_number = [ 5, 7, 8, 9, 10, 10, 11, 11, 11, 11, 10 ];
Yinsh.begin_diagonal_letter = [ 'B', 'A', 'A', 'A', 'A', 'B',
    'B', 'C', 'D', 'E', 'G'];
Yinsh.end_diagonal_letter = [ 'E', 'G', 'H', 'I', 'J', 'J',
    'K', 'K', 'K', 'K', 'J' ];
Yinsh.begin_diagonal_number = [ 7, 5, 4, 3, 2, 2, 1, 1, 1, 1, 2 ];
Yinsh.end_diagonal_number = [ 10, 11, 11, 11, 11, 10, 10, 9, 8,
    7, 5 ];

// enums definition
Yinsh.GameType = { BLITZ: 0, REGULAR: 1 };
Yinsh.Color = { BLACK: 0, WHITE: 1, NONE: 2 };
Yinsh.Phase = { PUT_RING: 0, PUT_MARKER: 1, MOVE_RING: 2, REMOVE_ROWS_AFTER: 3,
    REMOVE_RING_AFTER: 4, REMOVE_ROWS_BEFORE: 5, REMOVE_RING_BEFORE: 6, FINISH: 7 };
Yinsh.State = { VACANT: 0, BLACK_MARKER: 1, WHITE_MARKER: 2, BLACK_RING: 3, WHITE_RING: 4,
    BLACK_MARKER_RING: 5, WHITE_MARKER_RING: 6 };