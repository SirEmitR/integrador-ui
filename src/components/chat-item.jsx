import Link from 'next/link'
import React from 'react'

const ChatItem = ({data}) => {
  return (
    <Link href={`/${data.id}?type=${data.type}`} className='p-4 border-b border-gray-500/40 flex flex-col'>
        <h3 className='text-sm font-semibold text-gray-700'>{data.name}</h3>
        <div className='flex justify-between text-xs items-center'>
            <p>{data?.lastMessage?.message.slice(0,20)}...</p>
            <span className='text-[10px] whitespace-break-spaces text-right'>{data?.lastMessage?.date && new Date(data.lastMessage.date).toLocaleString().split(',').join('\n')}</span>
        </div>
    </Link>
  )
}

export default ChatItem