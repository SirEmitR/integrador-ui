'use client'

import { useConnection } from "@/providers/connection";
import { useState } from "react"

const NewGroup = () => {
    const [open, setOpen] = useState(false);
    const  { chats, sendMessage, user } = useConnection()

    const handleGroup = (e) => {
        e.preventDefault(); 
        const data = {
            type: 'new_group',
            message: e.target.name.value,
            members: chats.filter(chat => e.target[chat.id].checked).map(chat => chat.id).concat(user)
        }
        sendMessage(data);
        setOpen(false);
    }
  return (
    <div>
        <button onClick={() =>  setOpen(true)} className="flex items-center justify-center gap-1 text-sm bg-white p-2 rounded-lg">
            +
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>
        </button>
        {open && (
            <div className="fixed bg-black/40 top-0 left-0 right-0 bottom-0 flex justify-center items-center">
            <div className="bg-white p-8 w-1/3 min-h-32">
                <button onClick={() => setOpen(false)} className="text-gray-400 text-sm">Cerrar</button>
                <form onSubmit={handleGroup} className="flex flex-col gap-2">
                    <h2 className="text-xl font-semibold text-gray-700">Nuevo grupo</h2>
                    <input type="text" name="name" placeholder="Nombre del grupo" className="w-full p-2 border border-gray-300 rounded-lg" />
                    {
                        chats.map((chat, index) => {
                            return (
                                <div key={index} className="flex items-center gap-2">
                                    <input name={chat.id} type="checkbox" />
                                    <span>{chat.name}</span>
                                </div>
                            )
                        })
                    }
                    <button className="bg-blue-500 text-white p-2 rounded-lg w-full mt-2">Crear grupo</button>
                </form>
            </div>
        </div>
        )}
    </div>
  )
}

export default NewGroup