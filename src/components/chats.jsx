'use client'

import { useConnection } from "@/providers/connection"
import ChatItem from "./chat-item";
import Link from "next/link";
import NewGroup from "./new-group";

const Chats = () => {
    const {chats} = useConnection();
  return (
    <aside className='h-full p-4 bg-[#f1efef]'>
        <Link href={'/'} className='flex items-center gap-1'>
            <img src='/logo.png' alt='Logo' className='w-full max-w-[40px]' />
            <h1 className='text-sm text-gray-400 font-semibold'>Emiliano Reyes mensajeria</h1>
        </Link>
        
        <section className='mt-2'>
            <div className="flex items-center justify-between">
            <h2 className='text-xl text-gray-700 font-semibold'>Chats</h2>
            <NewGroup />
            </div>
            <div>
                {
                    chats.map((chat, index) => {
                        return <ChatItem key={index} data={chat} />
                    })
                }
            </div>
        </section>
    </aside>
  )
}

export default Chats