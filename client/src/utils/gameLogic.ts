import type { Board, Position, Player } from '../types/game';
import {
  PLAYER_ONE,
  PLAYER_TWO,
  GRID_ROWS,
  GRID_COLS,
  MIN_SQUARES_PER_MOVE,
  MAX_SQUARES_PER_MOVE,
} from '../types/game';

/**
 * Create an empty game board
 */
export function createEmptyBoard(): Board {
  return Array.from({ length: GRID_ROWS }, () =>
    Array.from({ length: GRID_COLS }, () => null)
  );
}

/**
 * Check if a position is valid (within grid bounds)
 */
export function isValidPosition(pos: Position): boolean {
  return pos.row >= 0 && pos.row < GRID_ROWS && pos.col >= 0 && pos.col < GRID_COLS;
}

/**
 * Get neighbors (up, down, left, right) of a position
 */
export function getNeighbors(pos: Position): Position[] {
  const neighbors: Position[] = [
    { row: pos.row - 1, col: pos.col }, // up
    { row: pos.row + 1, col: pos.col }, // down
    { row: pos.row, col: pos.col - 1 }, // left
    { row: pos.row, col: pos.col + 1 }, // right
  ];

  return neighbors.filter(isValidPosition);
}

/**
 * Check if a set of positions forms a connected group
 * Uses BFS to verify all positions are reachable from the first one
 */
export function arePositionsConnected(positions: Position[]): boolean {
  if (positions.length === 0) return false;
  if (positions.length === 1) return true;

  // Create a set for quick lookup
  const posSet = new Set(positions.map((p) => `${p.row},${p.col}`));
  const visited = new Set<string>();
  const queue: Position[] = [positions[0]];
  visited.add(`${positions[0].row},${positions[0].col}`);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = getNeighbors(current);

    for (const neighbor of neighbors) {
      const key = `${neighbor.row},${neighbor.col}`;
      if (posSet.has(key) && !visited.has(key)) {
        visited.add(key);
        queue.push(neighbor);
      }
    }
  }

  return visited.size === positions.length;
}

/**
 * Check if all positions are empty on the board
 */
export function arePositionsEmpty(board: Board, positions: Position[]): boolean {
  return positions.every((pos) => board[pos.row][pos.col] === null);
}

/**
 * Validate a move
 */
export function isValidMove(
  board: Board,
  positions: Position[],
  moveCount: number
): { valid: boolean; reason?: string } {
  // Check move size
  if (positions.length < MIN_SQUARES_PER_MOVE) {
    return { valid: false, reason: 'Te weinig vakjes geselecteerd' };
  }
  if (positions.length > MAX_SQUARES_PER_MOVE) {
    return { valid: false, reason: 'Te veel vakjes geselecteerd' };
  }

  // Check all positions are valid
  if (!positions.every(isValidPosition)) {
    return { valid: false, reason: 'Ongeldige positie' };
  }

  // Check all positions are empty
  if (!arePositionsEmpty(board, positions)) {
    return { valid: false, reason: 'Vakje is al gevuld' };
  }

  // Check positions are connected
  if (!arePositionsConnected(positions)) {
    return { valid: false, reason: 'Vakjes moeten verbonden zijn' };
  }

  // Check first move special rules
  if (moveCount === 0) {
    // Player 1: must include top-left corner
    const hasTopLeft = positions.some((p) => p.row === 0 && p.col === 0);
    if (!hasTopLeft) {
      return { valid: false, reason: 'Eerste zet moet linksboven bevatten' };
    }
  } else if (moveCount === 1) {
    // Player 2: must include bottom-right corner
    const hasBottomRight = positions.some(
      (p) => p.row === GRID_ROWS - 1 && p.col === GRID_COLS - 1
    );
    if (!hasBottomRight) {
      return { valid: false, reason: 'Eerste zet moet rechtsonder bevatten' };
    }
  }

  return { valid: true };
}

/**
 * Check if there are any valid moves left
 */
export function hasValidMoves(board: Board): boolean {
  // Check if there's at least one empty square
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      if (board[row][col] === null) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Apply a move to the board (returns new board, doesn't mutate)
 */
export function applyMove(
  board: Board,
  positions: Position[],
  player: Player
): Board {
  const newBoard = board.map((row) => [...row]);
  positions.forEach((pos) => {
    newBoard[pos.row][pos.col] = player;
  });
  return newBoard;
}

/**
 * Get the other player
 */
export function getOtherPlayer(player: Player): Player {
  return player === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
}
