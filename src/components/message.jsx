import React from 'react'

const Message = ({data, id}) => {
  return (
    <div className={`p-2 rounded-md shadow-sm w-max max-w-[300px] text-sm text-gray-800 ${data.from === id ? 'sender' : 'client'}`}>
        {
          data.type === 'image' && <img src={`https://localhost:41200/uploads?pathFile=${data.src}`} alt='image' className='w-full rounded-md' />
        }
        <p>{data?.message}</p>
        <span className='text-xs text-gray-400'>{new Date(data?.date).toLocaleString()}</span>
    </div>
  )
}

export default Message