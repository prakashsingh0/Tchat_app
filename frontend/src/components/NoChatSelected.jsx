import React from 'react'
import { MessageSquare } from 'lucide-react'
const NoChatSelected = () => {
  return (
    <div className='w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50'>
      <div className='max-w-md text-center space-y-6'>
        {/* Icon Display */}
        <div className='flex justify-center gap-4 mb-4'>
          <div className='relative'>
            <div className='w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce'>
              <MessageSquare className='w-8 h-8 text-primary' />
            </div>
          </div>
        </div>
        {/* welcome text */}

        <h2 className='text-2xl font-bold'> Welcome to TChat!</h2>
        <p className='text-base-content/60'>
          Select a conversation from the Sidebar to start chatting
        </p>
        <h2 className='text-2xl font-bold'> Developed by Prakash Singh Kshatreeya</h2>

        <p className='text-base-content/60'>
          Contact us : singhprakash545@gmail.com
        </p>

      </div>
    </div>
  )
}

export default NoChatSelected
