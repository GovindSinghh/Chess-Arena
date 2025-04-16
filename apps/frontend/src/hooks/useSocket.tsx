import axios from "axios";
import { useEffect, useState } from "react";

const WS_URL="ws://localhost:8000";
interface User{
    id: string;
    email: string;
    username: string | null;
    rating:number;
}
export const useSocket =() =>{
    const [socket,setSocket]=useState<WebSocket | null>(null);
    const [user,setUser]=useState<User | null>({
        id: "",
        email: "",
        username: null,
        rating: 0,
    });

    useEffect(()=>{

        
        const ws=new WebSocket(WS_URL);
        ws.onopen = () => {
            setSocket(ws);
        }
        axios.get("http://localhost:3000/api/auth/me",{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((res)=>{
            setUser(res.data.user);
        });

        return ()=>{
            ws.close();
        }

    },[]);


    return {socket,user};
}