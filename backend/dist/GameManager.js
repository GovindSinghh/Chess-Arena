"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Game_1 = require("./Game");
const messages_1 = require("./messages");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(ws) {
        this.users.push(ws);
        this.addHandler(ws);
    }
    addHandler(socket) {
        socket.on('message', (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === messages_1.INIT_GAME) {
                if (this.pendingUser !== null && this.pendingUser !== socket) {
                    const game = new Game_1.Game(this.pendingUser, socket);
                    console.log("Game initialized");
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = socket;
                }
            }
            if (message.type === messages_1.MOVE) {
                const game = this.games.find((game) => (game.player1 === socket || game.player2 === socket));
                if (!game) {
                    console.log("Game not found");
                    return;
                }
                game.makeMove(socket, message.payload.move);
            }
        });
        socket.on('close', () => {
            this.removeUser(socket);
        });
    }
    removeUser(socket) {
        const user = this.users.find(user => user === socket);
        if (!user) {
            console.log("User not found");
            return;
        }
        this.users = this.users.filter(user => user !== socket);
    }
}
exports.GameManager = GameManager;
