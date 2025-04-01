import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Signup=()=>{
    interface formInfo{
        Username:string,
        Password:string,
        Nickname:string
    }
    const [formData,setFormData]=useState<formInfo>({
        Username:"",
        Password:"",
        Nickname:""
    });

    const navigate=useNavigate();
    function handleSubmit(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setFormData({...formData,[e.currentTarget.name]:e.currentTarget.value});
        console.log(formData);
        navigate("/gameArena");
    }
    return(
        <form onSubmit={handleSubmit} className="flex flex-col mx-4">
            <div className="text-slate-400 text-2xl font-bold font-mono m-4 text-center">Create Account</div>
            <label htmlFor="Username" className="text-slate-300 text-lg font-semibold font-mono">Username</label>
            <input type="text" name="Username" id="Username" className="bg-slate-100 font-serif rounded-lg p-2 m-1" required onChange={(e)=>setFormData({...formData,[e.target.name]:e.target.value})}/>
            <label htmlFor="Password" className="text-slate-300 text-lg font-semibold font-mono">Password</label>
            <input type="password" name="Password" id="Password" className="bg-slate-100 font-serif rounded-lg p-2 m-1" required onChange={(e)=>setFormData({...formData,[e.target.name]:e.target.value})}/>
            <label htmlFor="Nickname" className="text-slate-300 text-lg font-semibold font-mono">Nickname</label>
            <input type="text" name="Nickname" id="Nickname" className="bg-slate-100 font-serif rounded-lg p-2 m-1" required onChange={(e)=>setFormData({...formData,[e.target.name]:e.target.value})}/>
            <button type="submit" className="bg-slate-600 text-slate-300 w-[250px] rounded-lg p-2 m-4 hover:bg-slate-500 active:bg-slate-700 cursor-pointer">Create Account</button>
        </form>
    )
}