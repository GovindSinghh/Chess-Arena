import { Chess } from 'chess.js';
import { WebSocket } from 'ws';
import { GAME_OVER, INIT_GAME, MOVE } from './messages';

export class Game{
    public player1:WebSocket;
    public player2:WebSocket;
    private startTime:Date;
    private chess:Chess;


    constructor(player1:WebSocket,player2:WebSocket){
        this.player1=player1;
        this.player2=player2;
        this.startTime=new Date();
        this.chess=new Chess();
        this.player1.send(JSON.stringify({
            type:INIT_GAME,
            color:"white",
            startTime:this.startTime.getTime()
        }));
        this.player2.send(JSON.stringify({
            type:INIT_GAME,
            color:"black",
            startTime:this.startTime.getTime()
        }));
    }

    makeMove(socket:WebSocket,move:{
        from:string,
        to:string,
    }){
        const moves=this.chess.history(); // array of all past moves in the game
        if(moves.length%2===0 && socket===this.player2){
            this.player2.send("Not your turn");
            return;
        }
        else if(moves.length%2===1 && socket===this.player1){
            this.player1.send("Not your turn");
            return;
        }

        this.chess.move(move);

        if(this.chess.isGameOver()){
            this.player1.send(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner:this.chess.isDraw() ? "Draw" :moves.length%2===1 && this.player1
                }
            }));
            this.player2.send(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner:this.chess.isDraw() ? "Draw" :moves.length%2===0 && this.player2
                }
            }));
            this.player1.close();
            this.player2.close();
            return;
        }

        if(moves.length%2===0){
            this.player2.send(JSON.stringify({
                type:MOVE,
                payload:{
                    move
                }
            }));
        }
        else{
            this.player1.send(JSON.stringify({
                type:MOVE,
                payload:{
                    move
                }
            }));
        }
        
    }
}