import { Chess } from "chess.js";
import { useState } from "react";
import { Button } from "../Components/Button";
import { ChessBoard } from "../Components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
const INIT_GAME="init_game";
const MOVE="move";
const GAME_OVER="game_over";

export const GamePage =()=>{
    const socket=useSocket();
    

    const [chess,setChess]=useState(new Chess());
    const [board,setBoard]=useState(chess.board());// string of all the 8*8 squares on the board
    const [started,setStarted]=useState(false);
    let time=0;

    if(!socket){
        return(
            <h1>Connecting to Server..</h1>
        )
    }

    socket.onmessage=(msg)=>{
        const message=JSON.parse(msg.data);

        switch(message.type){
            case INIT_GAME:{
                setStarted(true);
                alert("Game Started");
                time=message.payload.startTime;
                break;
            }

            case MOVE :{
                const move=message.payload.move;
                chess.move(move);
                setBoard(chess.board());
                break;
            }
            case GAME_OVER:{
                const winner=message.payload.winner;
                if(winner==="Draw"){
                    alert("Game Draw");
                }
                else if(winner===socket){
                    alert("You Win");
                }
                else{
                    alert("Friend Wins");
                }
                setStarted(false);
                setBoard(chess.board());
                break;
            }
        }
    }
    
    return(
        <div className="flex justify-center p-40 pt-30 font-mono bg-gradient-to-r from-slate-800 to-neutral-400">
            {started && <div className="absolute bottom-5 right-5 w-12 h-8 text-center p-2 text-md font-mono bg-neutral-200">{time}</div>}
            <div className="grid grid-cols-3 md:grid grid-cols-6 w-max-screen-lg w-full">
                <div className="grid col-span-2 md:grid col-span-4 p-3">

                    <ChessBoard board={board} socket={socket} setBoard={setBoard} chess={chess}/>
                </div>
                <div className="grid col-span-1 md:grid col-span-2 bg-neutral-600 rounded-md p-2 h-fit">
                    <div className="text-center flex flex-col font-mono ">
                    {!started && <Button label="Play" onClick={()=>{
                        socket.send(JSON.stringify({
                            type:INIT_GAME
                        }));
                    }}  />}
                    {started && (
                        <>
                            <h2 className="text-xl text-yellow-100 mb-1">Moves</h2>
                            {chess.history({verbose:true}).map((move)=>{
                                return(
                                    <div key={move.before} className="text-md text-slate-200 m-2 flex flex-row justify-center">
                                        <h3>{move.color==='w' ? "White" : "Black"}</h3> {" -> "} {move.from} to {move.to}
                                    </div>
                                )
                            })}
                        </>
                    )}
                    </div>
                </div>
            </div>
            
        </div>
    )
}