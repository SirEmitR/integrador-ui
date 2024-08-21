import React from 'react'

const Message = ({data}) => {
  return (
    <div className='p-2 rounded-md shadow-sm bg-white w-max max-w-[300px] text-sm text-gray-800'>
        <p>{data.message}</p>
    </div>
  )
}

export default Message