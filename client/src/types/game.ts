// Grid dimensions
export const GRID_ROWS = 6;
export const GRID_COLS = 7;

// Move constraints
export const MIN_SQUARES_PER_MOVE = 1;
export const MAX_SQUARES_PER_MOVE = 6;

// Player values
export const PLAYER_ONE = 1;
export const PLAYER_TWO = 2;

// Player type
export type Player = typeof PLAYER_ONE | typeof PLAYER_TWO;

// Position on the grid
export type Position = {
  row: number;
  col: number;
};

// Square state - who filled it
export type SquareState = Player | null;

// Game board - 2D array of square states
export type Board = SquareState[][];

// Move history entry
export type MoveHistory = {
  player: Player;
  positions: Position[];
  moveNumber: number;
};

// Game state
export type GameState = {
  board: Board;
  currentPlayer: Player;
  isGameOver: boolean;
  winner: Player | null;
  moveCount: number;
  history: MoveHistory[];
};
