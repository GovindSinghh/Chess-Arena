"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.startTime = new Date();
        this.chess = new chess_js_1.Chess();
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            color: "white",
            startTime: this.startTime.getTime()
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            color: "black",
            startTime: this.startTime.getTime()
        }));
    }
    makeMove(socket, move) {
        const moves = this.chess.history(); // array of all past moves in the game
        if (moves.length % 2 === 0 && socket === this.player2) {
            this.player2.send("Not your turn");
            return;
        }
        else if (moves.length % 2 === 1 && socket === this.player1) {
            this.player1.send("Not your turn");
            return;
        }
        this.chess.move(move);
        if (this.chess.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.chess.isDraw() ? "Draw" : moves.length % 2 === 1 && this.player1
                }
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.chess.isDraw() ? "Draw" : moves.length % 2 === 0 && this.player2
                }
            }));
            this.player1.close();
            this.player2.close();
            return;
        }
        if (moves.length % 2 === 0) {
            this.player2.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: {
                    move
                }
            }));
        }
        else {
            this.player1.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: {
                    move
                }
            }));
        }
    }
}
exports.Game = Game;
