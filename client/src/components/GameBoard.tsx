import type { Board, Position, MoveHistory } from '../types/game';
import { PLAYER_ONE, PLAYER_TWO } from '../types/game';

interface GameBoardProps {
  board: Board;
  selectedSquares: Position[];
  history: MoveHistory[];
  onSquareClick: (pos: Position) => void;
}

export function GameBoard({ board, selectedSquares, history, onSquareClick }: GameBoardProps) {
  const isSelected = (row: number, col: number): boolean => {
    return selectedSquares.some((pos) => pos.row === row && pos.col === col);
  };

  // Find which move a square belongs to
  const getMoveIndex = (row: number, col: number): number => {
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].positions.some((pos) => pos.row === row && pos.col === col)) {
        return i;
      }
    }
    return -1;
  };

  // Check if a neighbor is part of the same move
  const isNeighborInSameMove = (row: number, col: number, moveIndex: number): { top: boolean; right: boolean; bottom: boolean; left: boolean } => {
    if (moveIndex === -1) return { top: false, right: false, bottom: false, left: false };

    const move = history[moveIndex];
    const isInMove = (r: number, c: number) =>
      move.positions.some((pos) => pos.row === r && pos.col === c);

    return {
      top: isInMove(row - 1, col),
      right: isInMove(row, col + 1),
      bottom: isInMove(row + 1, col),
      left: isInMove(row, col - 1),
    };
  };

  const getSquareColor = (row: number, col: number): string => {
    const square = board[row][col];

    if (isSelected(row, col)) {
      return 'bg-yellow-300 border-yellow-500';
    }

    if (square === PLAYER_ONE) {
      return 'bg-blue-400 border-blue-600';
    }

    if (square === PLAYER_TWO) {
      return 'bg-red-400 border-red-600';
    }

    return 'bg-gray-100 border-gray-300 hover:bg-gray-200';
  };

  return (
    <div className="inline-block p-4 bg-gray-800 rounded-lg">
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${board[0].length}, 1fr)` }}>
        {board.map((row, rowIndex) =>
          row.map((_, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => onSquareClick({ row: rowIndex, col: colIndex })}
              className={`
                w-16 h-16 rounded transition-colors relative
                ${getSquareColor(rowIndex, colIndex)}
              `}
              style={(() => {
                const moveIndex = getMoveIndex(rowIndex, colIndex);
                if (moveIndex === -1) {
                  return {
                    borderWidth: '2px',
                    borderColor: getSquareColor(rowIndex, colIndex).includes('blue') ? '#2563eb' :
                                 getSquareColor(rowIndex, colIndex).includes('red') ? '#dc2626' :
                                 '#d1d5db',
                    borderStyle: 'solid',
                  };
                }

                const neighbors = isNeighborInSameMove(rowIndex, colIndex, moveIndex);
                return {
                  borderTopWidth: neighbors.top ? '0px' : '4px',
                  borderRightWidth: neighbors.right ? '0px' : '4px',
                  borderBottomWidth: neighbors.bottom ? '0px' : '4px',
                  borderLeftWidth: neighbors.left ? '0px' : '4px',
                  borderColor: '#000',
                  borderStyle: 'solid',
                };
              })()}
              aria-label={`Rij ${rowIndex + 1}, Kolom ${colIndex + 1}`}
            />
          ))
        )}
      </div>
    </div>
  );
}
