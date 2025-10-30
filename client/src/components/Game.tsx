import { useState, useEffect } from 'react';
import { GameBoard } from './GameBoard';
import { PlayerAvatar } from './PlayerAvatar';
import { WinAnimation } from './WinAnimation';
import type { Player, Position, MoveHistory } from '../types/game';
import { PLAYER_ONE, PLAYER_TWO } from '../types/game';
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
  const [selectedSquares, setSelectedSquares] = useState<Position[]>([{ row: 0, col: 0 }]); // Start with top-left selected for P1
  const [moveCount, setMoveCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<MoveHistory[]>([]);
  const [gamePhase, setGamePhase] = useState<'playing' | 'phase2' | 'phase3'>('playing');

  // Timer effect for game phases
  useEffect(() => {
    if (isGameOver && gamePhase === 'phase2') {
      const timer = setTimeout(() => {
        setGamePhase('phase3');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isGameOver, gamePhase]);

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
    const newMoveCount = moveCount + 1;

    // Add to history
    const newMove: MoveHistory = {
      player: currentPlayer,
      positions: [...selectedSquares],
      moveNumber: newMoveCount,
    };

    setBoard(newBoard);
    setHistory([...history, newMove]);
    setErrorMessage(null);
    setMoveCount(newMoveCount);

    // Check if next player has valid moves
    if (!hasValidMoves(newBoard)) {
      setIsGameOver(true);
      setWinner(currentPlayer); // Current player wins because opponent can't move
      setSelectedSquares([]);
      setGamePhase('phase2'); // Start phase 2 (intermediate message)
    } else {
      const nextPlayer = getOtherPlayer(currentPlayer);
      setCurrentPlayer(nextPlayer);

      // Pre-select required square for second move (Player 2's first move)
      if (newMoveCount === 1) {
        setSelectedSquares([{ row: 5, col: 6 }]); // Bottom-right for Player 2
      } else {
        setSelectedSquares([]);
      }
    }
  };

  const handleClearSelection = () => {
    setSelectedSquares([]);
    setErrorMessage(null);
  };

  const handleUndo = () => {
    if (history.length === 0) return;

    // Remove last move from history
    const newHistory = history.slice(0, -1);
    const lastMove = history[history.length - 1];

    // Rebuild board from history
    const newBoard = createEmptyBoard();
    newHistory.forEach((move) => {
      move.positions.forEach((pos) => {
        newBoard[pos.row][pos.col] = move.player;
      });
    });

    setHistory(newHistory);
    setBoard(newBoard);
    setMoveCount(newHistory.length);
    setCurrentPlayer(lastMove.player); // Go back to player who made the last move
    setIsGameOver(false);
    setWinner(null);
    setSelectedSquares([]);
    setErrorMessage(null);
    setGamePhase('playing');
  };

  const handleResetGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer(PLAYER_ONE);
    setSelectedSquares([{ row: 0, col: 0 }]); // Start with top-left selected for P1
    setMoveCount(0);
    setIsGameOver(false);
    setWinner(null);
    setErrorMessage(null);
    setHistory([]);
    setGamePhase('playing');
  };

  const handleGiveUp = () => {
    setIsGameOver(true);
    setWinner(getOtherPlayer(currentPlayer)); // Other player wins
    setGamePhase('phase2'); // Start phase 2 (intermediate message)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-8">
      <div className="max-w-7xl w-full">
        <h1 className="text-5xl font-bold text-white text-center mb-8">No 67</h1>

        <div className="flex gap-8 items-center justify-center">
          {/* Player 1 Avatar */}
          <PlayerAvatar
            player={PLAYER_ONE}
            isActive={!isGameOver && currentPlayer === PLAYER_ONE}
            isWinner={gamePhase !== 'playing' && winner === PLAYER_ONE}
            isLoser={gamePhase !== 'playing' && winner === PLAYER_TWO}
          />

          {/* Main Game Area */}
          <div className="flex flex-col items-center gap-6">
          {/* Game Status */}
          <div className="bg-white rounded-lg p-6 shadow-lg min-w-96 text-center">
            {gamePhase === 'phase2' ? (
              <div>
                <h2 className="text-2xl font-bold text-red-600 mb-2">6×7 gevuld, je kan niets meer doen</h2>
              </div>
            ) : gamePhase === 'phase3' ? (
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
                <p className="text-gray-500 text-sm mt-2">
                  Vermijd dat alle 6 bij 7 vakjes ingekleurd zijn, als je aan de beurt bent.
                </p>
              </div>
            )}
          </div>

          {/* Game Board */}
          <GameBoard
            board={board}
            selectedSquares={selectedSquares}
            history={history}
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
                <button
                  onClick={handleGiveUp}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Geef op
                </button>
              </>
            )}
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Ongedaan maken
            </button>
            <button
              onClick={handleResetGame}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Nieuw spel
            </button>
          </div>
        </div>

          {/* Player 2 Avatar */}
          <PlayerAvatar
            player={PLAYER_TWO}
            isActive={!isGameOver && currentPlayer === PLAYER_TWO}
            isWinner={gamePhase !== 'playing' && winner === PLAYER_TWO}
            isLoser={gamePhase !== 'playing' && winner === PLAYER_ONE}
          />
        </div>

        {/* Win Animation */}
        {gamePhase === 'phase3' && winner && <WinAnimation winner={winner} />}
      </div>
    </div>
  );
}
