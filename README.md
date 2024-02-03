# Chess TypeScript Project

This is a Chess project implemented in TypeScript. It includes move validator functions to validate legal chess moves.

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository to your local machine:

```bash
git clone https://github.com/barrymun/chess.git
```

2. Navigate to the project directory:

```bash
cd chess
```

3. Install the required dependencies:

```bash
yarn install
```

4. Build the TypeScript code:

```bash
yarn build
```

5. Start the development server:

```bash
yarn start
```

6. Open your web browser and visit `http://localhost:3000` to play the Chess game.

## Move Validator Functions

The project includes TypeScript functions to validate chess moves. These functions can be found in the `move-validator.ts` file. You can use these functions to ensure that the moves made in the game adhere to the rules of chess.

## Contributing

If you'd like to contribute to this project, feel free to fork the repository and submit a pull request with your changes. Make sure to follow the coding standards and conventions used in the project.

## License

This Chess TypeScript project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## TODO

- [x] check if king is in check
- [x] check if there is a checkmate or stalemate (similar logic) (sample stalemate: https://www.chess.com/forum/view/more-puzzles/stalemate-in-10-moves)
- [x] pawn promotion logic
- [x] castling logic
- [x] highlight areas on piece grab that the selected piece can move to (legal moves dots)
- [x] add `break;` statements in the direction loop checks to exit early
- [x] add `break;` statement from queen moves early if diagonal checked and move is diagonal as there would be no need to then check the straight moves
- [x] problem with rook move logic - can move from g5 to a4
- [x] show where the last piece was moved from and to with colours?
- [ ] have the game run through many sample games in the chess db
- [ ] integrate the stockfish JS engine or something along these lines: https://github.com/nmrugg/stockfish.js
- [ ] preserve the game state before a reload
- [ ] multiplayer (websockets with rooms?)
- [ ] make the legal dots optional (player can toggle this setting on and off)
- [ ] lots of test cases
- [x] game over (reason, winner, etc.) modal
- [ ] add sound effects
- [ ] different colour themes for different boards and pieces
- [ ] show all of the moves made so far
- [ ] validate the chess board to prevent cheating (based on the moves made so far?)
