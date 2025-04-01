interface PopUpProps {
    onClose:()=> void,
    children:React.ReactNode
}

export const PopUp=({onClose,children}:PopUpProps)=>{
    return(
        <div className="fixed inset-0 flex justify-center items-center z-2 bg-opacity-50 ">
            <div className="relative bg-gradient-to-b from-slate-800 to-neutral-400 rounded-xl shadow-lg p-4 h-fit w-[350px] md:w-[500px] flex items-center justify-center">
                <div className="absolute top-1 right-1 flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 p-1 rounded-md cursor-pointer" onClick={onClose}>
                    ❌
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    )

}