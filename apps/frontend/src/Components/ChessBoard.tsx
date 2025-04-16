import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { Slide, toast } from "react-toastify";
const MOVE="move";

export const ChessBoard =({ board,socket,setBoard,chess }:{
    board:({
            square: Square;
            type: PieceSymbol;
            color: Color;
        } | null)[][];
    socket:WebSocket,
    setBoard:(board:({
            square: Square;
            type: PieceSymbol;
            color: Color;
        } | null)[][])=>void;
    chess:Chess
})=>{

    const [from,setFrom]=useState<Square | null>(null);
    const [validMoves, setValidMoves] = useState<string[]>([]);

    const isSquareValidMove = (square: string) => {
        return validMoves.includes(square);
    };

    return(
        <div>
            {board.map((row,i) => {
                return <div key={i} className="flex">
                    {row.map((boardSquare,j)=>{
                        const square = String.fromCharCode(97+j)+String(8-i);
                        const isValidMove = isSquareValidMove(square);
                        return <div key={j} onClick={()=>{
                            if(!from){
                                setFrom(boardSquare?.square || null);
                                const moves = chess.moves({square:boardSquare?.square}) as string[];
                                setValidMoves(moves);
                            }
                            else{
                                let to=square;
                                try{
                                    chess.move({
                                        from,
                                        to
                                    });
                                    setBoard(chess.board());
                                    socket.send(JSON.stringify({
                                        type:MOVE,
                                        payload:{
                                            move:{
                                                from,
                                                to
                                            }
                                        }
                                    }));
                                    setValidMoves([]);
                                }
                                catch(error){
                                    toast.warn("Invalid Move", {
                                        position: "bottom-right",
                                        autoClose: 1000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                        theme: "light",
                                        transition: Slide,
                                    });
                                }
                                setFrom(null);
                            }
                        }} className={`w-8 h-8 flex justify-center items-center hover:border-2 border-slate-700 hover:cursor-pointer active:border-4 rounded-lg md:w-16 h-16 
                            ${(i+j)%2===0 ? `bg-slate-500` :`bg-neutral-300`}
                            ${isValidMove && 'border-3 border-yellow-500'}
                            ${from === square && 'border-2 border-yellow-500'}`}>
                            {boardSquare ? <img src={`/${boardSquare.color==='b' ? 'b' : 'w'}${boardSquare.type}.png`} /> : ""}
                        </div>
                    })}
                </div>
            })}
        </div>
    )
}