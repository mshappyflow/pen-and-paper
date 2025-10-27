# No 67 - Game Rules

## Overview

No 67 is a two-player strategic territory game played on a 6×7 grid. Players take turns filling squares, trying to force their opponent into a position where they cannot make a valid move.

## Game Setup

- Grid: 6 rows (height) × 7 columns (width) = 42 squares total
- All squares start empty
- Two players alternate turns

## Objective

**Don't be the player who cannot make a move.** If the grid fills up (all 67... wait, 42 squares) and you cannot move, you lose.

## Rules

### Turn Structure

On your turn, you must fill between **1 and 6 squares** that meet these requirements:

1. **Empty only**: You can only fill squares that are not already filled
2. **Connected**: All squares you fill in a single turn must form a connected group
   - Squares are connected if they share an edge (horizontal or vertical)
   - Diagonal connections do not count
   - The group must be contiguous (each square connects to another in the group)

### First Turn Special Rules

- **Player 1** (first turn): Must include the **bottom-right corner** square in their move
- **Player 2** (first turn): Must include the **top-left corner** square in their move
- After these opening moves, players may fill any valid connected group

### Losing Condition

A player loses when they cannot make a valid move on their turn. This happens when:
- No empty squares remain, OR
- No valid connected groups of 1-6 empty squares exist

## Strategy Notes

- The game is finite - it will always end
- There are no random elements
- Both players have perfect information
- With optimal play, the outcome is determined from the start
- Player colors (if used) are for visualization only - they don't affect rules

## Name Origin

"No 67" refers to avoiding filling the 6×7 grid. It's also a reference to the "67" meme popular with children.
