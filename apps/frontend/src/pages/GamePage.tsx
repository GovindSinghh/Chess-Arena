import { Chess } from "chess.js";
import { useState } from "react";
import { Button } from "../Components/Button";
import { ChessBoard } from "../Components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Bounce, toast, ToastContainer } from "react-toastify";
const INIT_GAME="init_game";
const MOVE="move";
const GAME_OVER="game_over";

export const GamePage =()=>{
    const {socket,user}=useSocket();
    

    const [chess,setChess]=useState(new Chess());
    const [board,setBoard]=useState(chess.board());// string of all the 8*8 squares on the board or FEN string
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
                toast.success(`Game Started and You are ${message.color}`,{
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
                time=message.startTime;
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
        <>
        <ToastContainer />
            <div className="relative flex justify-center p-40 pt-30 font-mono bg-gradient-to-r from-slate-800 to-neutral-400">
                <div className=" absolute top-5 left-7 flex items-center justify-center px-2 py-1 bg-gradient-to-b from-yellow-200 to-yellow-400 rounded-md">
                        <h2 className="text-white text-2xl">Welcome <i>{user?.username}</i></h2>
                </div>
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
        </>
    )
}