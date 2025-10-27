# Project Requirements

## Long-term Vision

A web-based gaming platform where players can compete 1v1 in mathematical strategy games.

### Key Features (Long-term)
- Online multiplayer with player matchmaking
- Players connect from their own computers
- Multiple mathematical/combinatorial games
- Real-time game state synchronization

### Game Characteristics
- **Turn-based**: Players alternate making moves
- **Perfect information**: All game state visible to both players
- **Deterministic**: No random elements or chance
- **Finite**: Games always terminate (no cycles possible)
- **Solved games**: Optimal play determines the winner from the start

Examples: Connect Four, Nim, and custom mathematical games.

## Short-term Goals

Build a single game implementation with local play.

### Scope (Short-term)
- Implement one specific game: **No 67**
- Local hot-seat multiplayer (both players on same computer)
- Web-based interface (no online features yet)
- Focus on game logic and user experience

### Out of Scope (Short-term)
- Online multiplayer
- Player accounts/authentication
- Matchmaking system
- Multiple games
- AI opponent

## Success Criteria

### Short-term
- Two players can play a complete game of No 67
- Game enforces rules correctly
- Clear visual feedback for game state
- Intuitive user interface in Dutch

### Long-term
- Support for multiple games
- Players can find and play against others online
- Scalable architecture for concurrent games
- Responsive across devices
