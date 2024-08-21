'use client'
import Message from '@/components/message';
import { useConnection } from '@/providers/connection';
import React from 'react'

const ChatId = ({params}) => {
    const id = params.id;
    const { getClient, sendMessage, user } = useConnection();
    const client = getClient(id);

    const handleChange = (e) => {
        //set text size
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const hasFile = e.target.file.files.length > 0;
        const message = e.target.msg.value;
        const data = {
            type: hasFile ? 'file' : 'text',
            message: hasFile ? e.target.file.files[0] : message,
            to: id,
            from: user
        }
        sendMessage(data);
        e.target.reset();
    }
    return (
        <main
            style={{
                backgroundImage: 'url(/bg.png)',
                backgroundSize: '500px'
            }}
        className="flex flex-col flex-1 bg-[#e8ebe5]">
            <div className='flex w-full p-4 bg-gray-100 items-center justify-between'>
                <h3 className='text-xl'>{client?.name}</h3>
                <span className='text-xs text-gray-400'>{
                   client?.active ? 'En linea' :  client?.lastSeen ? `Ultima conexion ${new Date(client.lastSeen).toLocaleString()}` : ''
                }</span>
            </div>
            <section className='p-4 flex h-full flex-col justify-end flex-1 gap-2 overflow-y-scroll'>
                <Message data={{message: 'Hola'}} />
                <Message data={{message: 'Hol2'}} />
                <Message data={{message: 'Hola3'}} />
            </section>
            <form onSubmit={handleSubmit} className='p-4 flex items-center gap-4'>
                <label className='flex cursor-pointer justify-center items-center p-2 rounded-lg bg-gray-300'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <input name='file' type='file' className='hidden' />
                </label>
                <textarea name='msg' onChange={handleChange} className='w-full flex-1 text-sm text-gray-500 p-1 h-10 max-h-[160px] outline-none border-none bg-[#ffffff] rounded-md resize-none' />
                <button className='flex justify-center items-center p-2 rounded-full text-white bg-[#949761] self-end'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
                </button>
            </form>
        </main>
    )
}

export default ChatId