import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { Slide, toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const Signup=()=>{
    interface formInfo{
        Username:string,
        Email:string,
        Password:string
    }
    const [formData,setFormData]=useState<formInfo>({
        Username:"",
        Email:"",
        Password:""
    });

    const navigate=useNavigate();
    async function handleSubmit(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        try {
            const response=await axios.post("http://localhost:3000/api/auth/signup",{
                username:formData.Username,
                email:formData.Email,
                password:formData.Password
            });
            
            if(response.status===201){
                toast.success("Account created successfully!", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Slide,
                });
                navigate("/gameArena");
                localStorage.setItem("token",response.data.token);
            }
        } catch (error) {
            const axiosError = error as AxiosError<{message: string}>;
            toast.error(axiosError.response?.data?.message || "Something went wrong!", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Slide,
            });
        }
    }
    return(
        <>
            <ToastContainer newestOnTop />
            <form onSubmit={handleSubmit}
            className="flex flex-col mx-4">
                <div className="text-slate-400 text-2xl font-bold font-mono m-4 text-center">Create Account</div>
                <label htmlFor="Username" className="text-slate-300 text-lg font-semibold font-mono">Username</label>
                <input type="text" name="Username" id="Username" className="bg-slate-100 font-serif rounded-lg p-2 m-1" required onChange={(e)=>setFormData({...formData,[e.target.name]:e.target.value})}/>
                <label htmlFor="Email" className="text-slate-300 text-lg font-semibold font-mono">Email</label>
                <input type="text" name="Email" id="Email" className="bg-slate-100 font-serif rounded-lg p-2 m-1" required onChange={(e)=>setFormData({...formData,[e.target.name]:e.target.value})}/>
                <label htmlFor="Password" className="text-slate-300 text-lg font-semibold font-mono">Password</label>
                <input type="password" name="Password" id="Password" className="bg-slate-100 font-serif rounded-lg p-2 m-1" required onChange={(e)=>setFormData({...formData,[e.target.name]:e.target.value})}/>
                <button type="submit" className="bg-slate-600 text-slate-300 w-[250px] rounded-lg p-2 m-4 hover:bg-slate-500 active:bg-slate-700 cursor-pointer">Create Account</button>
            </form>
        </>
    )
}