import type { Board, Position } from '../types/game';
import { PLAYER_ONE, PLAYER_TWO } from '../types/game';

interface GameBoardProps {
  board: Board;
  selectedSquares: Position[];
  onSquareClick: (pos: Position) => void;
}

export function GameBoard({ board, selectedSquares, onSquareClick }: GameBoardProps) {
  const isSelected = (row: number, col: number): boolean => {
    return selectedSquares.some((pos) => pos.row === row && pos.col === col);
  };

  const getSquareColor = (row: number, col: number): string => {
    const square = board[row][col];

    if (isSelected(row, col)) {
      return 'bg-yellow-300 border-yellow-500';
    }

    if (square === PLAYER_ONE) {
      console.log(`Square [${row},${col}] is PLAYER_ONE (${square})`);
      return 'bg-blue-400 border-blue-600';
    }

    if (square === PLAYER_TWO) {
      console.log(`Square [${row},${col}] is PLAYER_TWO (${square})`);
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
                w-16 h-16 border-2 rounded transition-colors
                ${getSquareColor(rowIndex, colIndex)}
              `}
              aria-label={`Rij ${rowIndex + 1}, Kolom ${colIndex + 1}`}
            />
          ))
        )}
      </div>
    </div>
  );
}
