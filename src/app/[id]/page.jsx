'use client'
import { useConnection } from '@/providers/connection';
import React from 'react'

const ChatId = ({params}) => {
    const id = params.id;
    const { getClient } = useConnection();
    const client = getClient();
    console.log(client);
    return (
        <main
            style={{
                backgroundImage: 'url(/bg.png)',
                backgroundSize: '500px'
            }}
        className="flex flex-col flex-1 bg-[#e8ebe5]">{id}</main>
    )
}

export default ChatId