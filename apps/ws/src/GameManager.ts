import { WebSocket } from "ws";
import { Game } from "./Game";
import { INIT_GAME, MOVE, PLAY_WITH_FRIEND, TOKEN_MESSAGE } from "./messages";
import jwt from "jsonwebtoken";
import prisma from "@repo/db/client";

export class GameManager{
    private games:Game[];
    private pendingUser:WebSocket | null;
    private users:WebSocket[];

    constructor(){
        this.games=[];
        this.pendingUser=null;
        this.users=[];
    }

    addUser(ws:WebSocket){
        this.addHandler(ws);
    }

    addHandler(socket:WebSocket){
        
        socket.on('message',async (data) => {
            const message=JSON.parse(data.toString());

            if(message.type===TOKEN_MESSAGE){
                const token=message.token;
                const { userId }=jwt.verify(token,"govind-key") as { userId:string }
                const user=await prisma.user.findUnique({
                    where:{
                        id:userId
                    }
                });
                
                if(!user){
                    console.log("User not found");
                    return;
                }
                this.users.push(socket);
            }
            
            if(message.type===INIT_GAME){
        
                if(this.pendingUser!==null && this.pendingUser!==socket){
                    const game=new Game(this.pendingUser,socket);
                    console.log("Game initialized");


                    this.games.push(game);
                    this.pendingUser=null;
                }
                else{
                    this.pendingUser=socket;
                }
            }

            if(message.type===MOVE){
                const game=this.games.find((game) => (game.player1===socket || game.player2===socket));
                if(!game){
                    console.log("Game not found");
                    return;
                }

                game.makeMove(socket,message.payload.move);
            }
        });

        socket.on('close', () => {
            this.removeUser(socket);
        });


    }

    removeUser(socket:WebSocket){
        const user=this.users.find(user => user===socket);
        if(!user){
            console.log("User not found");
            return;
        }

        this.users=this.users.filter(user => user!==socket);
    }

}