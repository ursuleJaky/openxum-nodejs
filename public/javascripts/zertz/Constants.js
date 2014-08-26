// grid constants definition
Zertz.begin_number = [ 1, 1, 1, 1, 2, 3, 4 ];
Zertz.end_number = [ 4, 5, 6, 7, 7, 7, 7 ];

// enums definition
Zertz.GameType = { BLITZ: 0, REGULAR: 1 };
Zertz.Color = { NONE: -1, ONE: 0, TWO: 1 };
Zertz.MarbleColor = { NONE: -1, BLACK: 0, WHITE: 1, GREY: 2 };
Zertz.Phase = { SELECT_MARBLE_IN_POOL: 0, PUT_MARBLE: 1, REMOVE_RING: 2, CAPTURE: 3 };
Zertz.State = { VACANT: 0, BLACK_MARBLE: 1, WHITE_MARBLE: 2, GREY_MARBLE: 3, EMPTY: 4 };
Zertz.Direction = { NORTH_WEST: 0, NORTH: 1, NORTH_EAST: 2, SOUTH_EAST: 3, SOUTH: 4, SOUTH_WEST: 5 };
Zertz.letters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G' ];
