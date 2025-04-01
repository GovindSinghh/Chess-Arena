import { useNavigate } from 'react-router-dom';
import { Button } from '../Components/Button';
import { useState } from 'react';
import { PopUp } from '../Components/PopUp';
import { Signup } from '../Components/Signup';
import { Login } from '../Components/Login';

export const Landing=()=>{
    const navigate=useNavigate();
    const [isSignupPopUpOpen,setIsSignupPopUpOpen]=useState<boolean>(false);
    const [isLogInPopUpOpen,setIsLogInPopUpOpen]=useState<boolean>(false);
    
    return(
        <>
            {isSignupPopUpOpen && <PopUp onClose={()=>setIsSignupPopUpOpen(false)}>
                <Signup />
            </PopUp>}
            {isLogInPopUpOpen && <PopUp onClose={()=>setIsLogInPopUpOpen(false)}>
                <Login />
            </PopUp>}
            
            <div className={`bg-gradient-to-r from-slate-800 to-neutral-400 ${isSignupPopUpOpen && 'blur-sm'} ${isLogInPopUpOpen && 'blur-sm'}`}>
                <div className="h-screen flex justify-center items-center relative">
                <div className="flex justify-end p-4 absolute top-0 right-10 gap-7">
                    <button className="rounded-xl p-2 h-11 w-20 text-center text-md font-mono text-yellow-100 hover:cursor-pointer  bg-gradient-to-r from-slate-500 to-slate-400 hover:shadow-2xl shadow-md" onClick={()=>{
                        setIsLogInPopUpOpen(true);
                    }}>Login</button>
                    <button className="rounded-xl p-2 h-11  w-20 text-md text-center font-mono text-yellow-100 hover:cursor-pointer  bg-gradient-to-r from-slate-500 to-slate-400 hover:shadow-2xl shadow-md" onClick={()=>{
                        setIsSignupPopUpOpen(true);
                    }}>Signup</button>
                </div>
                    <div className="flex w-50% h-50%">
                        <img src='/chessBoard.jpg' alt="chess" className="w-98 h-96 rounded-sm mr-55 shadow-2xl"/>
                        <div className='flex flex-col items-center'>
                            <div className="text-4xl text-center w-100 font-bold font-mono text-slate-800 m-4">Welcome to #1 Chess playing Arena</div>
                            <Button label="Play Online" onClick={()=>{
                                navigate("/gameArena");
                            }}  />
                        </div>

                    </div>

                </div>
            </div>
        </>
    )
}