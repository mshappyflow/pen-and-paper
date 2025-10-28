import { useState } from 'react';
import { GameBoard } from './GameBoard';
import type { Player, Position } from '../types/game';
import { PLAYER_ONE } from '../types/game';
import {
  createEmptyBoard,
  isValidMove,
  applyMove,
  getOtherPlayer,
  hasValidMoves,
} from '../utils/gameLogic';

export function Game() {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>(PLAYER_ONE);
  const [selectedSquares, setSelectedSquares] = useState<Position[]>([]);
  const [moveCount, setMoveCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSquareClick = (pos: Position) => {
    if (isGameOver) return;

    // If square is already filled, ignore
    if (board[pos.row][pos.col] !== null) return;

    // Toggle selection
    const isAlreadySelected = selectedSquares.some(
      (p) => p.row === pos.row && p.col === pos.col
    );

    if (isAlreadySelected) {
      setSelectedSquares(selectedSquares.filter((p) => p.row !== pos.row || p.col !== pos.col));
      setErrorMessage(null);
    } else {
      setSelectedSquares([...selectedSquares, pos]);
      setErrorMessage(null);
    }
  };

  const handleConfirmMove = () => {
    if (selectedSquares.length === 0) {
      setErrorMessage('Selecteer minstens 1 vakje');
      return;
    }

    const validation = isValidMove(board, selectedSquares, moveCount);

    if (!validation.valid) {
      setErrorMessage(validation.reason || 'Ongeldige zet');
      return;
    }

    // Apply the move
    const newBoard = applyMove(board, selectedSquares, currentPlayer);
    setBoard(newBoard);
    setSelectedSquares([]);
    setErrorMessage(null);
    setMoveCount(moveCount + 1);

    // Check if next player has valid moves
    if (!hasValidMoves(newBoard)) {
      setIsGameOver(true);
      setWinner(currentPlayer); // Current player wins because opponent can't move
    } else {
      setCurrentPlayer(getOtherPlayer(currentPlayer));
    }
  };

  const handleClearSelection = () => {
    setSelectedSquares([]);
    setErrorMessage(null);
  };

  const handleResetGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer(PLAYER_ONE);
    setSelectedSquares([]);
    setMoveCount(0);
    setIsGameOver(false);
    setWinner(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-5xl font-bold text-white text-center mb-8">No 67</h1>

        <div className="flex flex-col items-center gap-6">
          {/* Game Status */}
          <div className="bg-white rounded-lg p-6 shadow-lg min-w-96 text-center">
            {isGameOver ? (
              <div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">Spel afgelopen!</h2>
                <p className="text-xl">
                  Speler {winner} wint! 🎉
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Speler {currentPlayer} is aan de beurt
                </h2>
                <p className="text-gray-600">
                  Selecteer {selectedSquares.length > 0 ? `${selectedSquares.length}/` : ''}1-6 verbonden vakjes
                </p>
              </div>
            )}
          </div>

          {/* Game Board */}
          <GameBoard
            board={board}
            selectedSquares={selectedSquares}
            onSquareClick={handleSquareClick}
          />

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {errorMessage}
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-4">
            {!isGameOver && (
              <>
                <button
                  onClick={handleConfirmMove}
                  disabled={selectedSquares.length === 0}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Bevestig zet
                </button>
                <button
                  onClick={handleClearSelection}
                  disabled={selectedSquares.length === 0}
                  className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Wis selectie
                </button>
              </>
            )}
            <button
              onClick={handleResetGame}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Nieuw spel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
