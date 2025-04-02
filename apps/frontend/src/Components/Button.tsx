export const Button=({label,onClick}:{
    label:string,
    onClick:()=> void
})=>{
    return(
        <button onClick={onClick} className=" m-6 rounded-xl p-2 md:p-4 text-lg md:text-xl text-yellow-100 font-mono hover:cursor-pointer bg-gradient-to-r  from-indigo-300 to-slate-600 hover:shadow-2xl ">{label}</button>
    )
}