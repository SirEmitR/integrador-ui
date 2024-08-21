import Link from 'next/link'
import React from 'react'

const ChatItem = ({data}) => {
  return (
    <Link href={`/${data.id}`} className='p-4 border-b border-gray-500/40 flex flex-col'>
        <h3 className='text-sm font-semibold text-gray-700'>{data.name}</h3>
        <div className='flex justify-between text-xs'>
            <p>{data?.lastMessage?.message}</p>
            <span>{data?.lastMessage?.time}</span>
        </div>
    </Link>
  )
}

export default ChatItem