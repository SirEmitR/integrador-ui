'use client'
import Message from '@/components/message';
import { useConnection } from '@/providers/connection';
import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation';

const ChatId = ({ params }) => {
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const id = params.id;
    const { getClient, sendMessage, user, messages, handleChat } = useConnection();
    const client = getClient(id);
    const [chat, setChat] = useState([]);
    const [file, setFile] = useState(null);
    const textArea = React.createRef();

    const insertSvgEmoji = (emoji) => {
        const em = emojiMap[emoji];
        const msgCon = textArea.current.value + em;
        textArea.current.value = msgCon;
        textArea.current.focus();
    };

    const emojiMap = {
        'smile': '😊',
        'money': '🤑',
        'whistle': '😮‍💨',
        'nervous': '😬'
    };

    const handleChange = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    };

    const handleFile = (e) => {
        if(e.target.files.length === 0) {
            setFile(null);
        }
        setFile({
            name: e.target.files[0].name,
            size: e.target.files[0].size * 0.001 + 'kb'
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const hasFile = e.target.file.files.length > 0;
        const message = e.target.msg.value;
        const data = {
            type: hasFile ? 'file' : 'text',
            message,
            to: id,
            from: user,
            file: hasFile ? e.target.file.files[0] : null,
            targetType: type
        };
        sendMessage(data);
        setFile(null);
        e.target.reset();
    };

    useEffect(() => {
        handleChat(id);
    }, [id]);

    useEffect(() => {
        function setMessages(id) {
            return messages.filter(msg => msg.target.includes(id) && msg.targetType === type);
        }
        setChat(setMessages(id));
    }, [messages, id]);

    return (
        <main
            style={{
                backgroundImage: 'url(/bg.png)',
                backgroundSize: '500px'
            }}
            className="flex flex-col flex-1 bg-[#e8ebe5]"
        >
            <div className='flex w-full p-4 bg-gray-100 items-center justify-between'>
                <h3 className='text-xl'>{client?.name}</h3>
                <span className='text-xs text-gray-400'>
                    {client?.active ? 'En linea' : client?.lastSeen ? `Ultima conexion ${new Date(client.lastSeen).toLocaleString()}` : ''}
                </span>
            </div>
            <section className='p-4 flex h-full flex-col justify-end flex-1 gap-2 overflow-y-scroll'>
                {chat.map((msg, i) => (
                    <Message key={i} data={msg} id={user} />
                ))}
            </section>
            <div className='flex justify-center gap-5 justify-between'>
                {
                    file && (
                        <div className='p-2 text-xs text-gray-500 rounded-lg bg-white flex items-center gap-4'>
                            <span>{file.name}</span>
                            <span>{file.size} bytes</span>
                        </div>
                    )
                }
                <div className={'w-max mx-auto p-2 px-4 bg-white rounded-xl flex justify-center items-center gap-4'}>
                    <button onClick={() => insertSvgEmoji('smile')} className='w-8 h-8'>
                        {emojiMap['smile']}
                    </button>
                    <button onClick={() => insertSvgEmoji('money')} className='w-8 h-8'>
                        {emojiMap['money']}
                    </button>
                    <button onClick={() => insertSvgEmoji('whistle')} className='w-8 h-8'>
                        {emojiMap['whistle']}
                    </button>
                    <button onClick={() => insertSvgEmoji('nervous')} className='w-8 h-8'>
                        {emojiMap['nervous']}
                    </button>
                </div>
                
            </div>
            <form onSubmit={handleSubmit} className='p-4 flex items-center gap-4'>
                <label className='flex cursor-pointer justify-center items-center p-2 rounded-lg bg-gray-300'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <input onChange={handleFile} name='file' type='file' className='hidden' />
                </label>
                <textarea ref={textArea} name='msg' onChange={handleChange} className='w-full flex-1 text-sm text-gray-500 p-1 h-10 max-h-[160px] outline-none border-none bg-[#ffffff] rounded-md resize-none' />
                <button className='flex justify-center items-center p-2 rounded-full text-white bg-[#949761] self-end'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                </button>
            </form>
        </main>
    );
};

export default ChatId;
