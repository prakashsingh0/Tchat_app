import React from 'react'
import { useChatStore } from '../store/useChatStore'
import Sidebar from '../components/Sidebar';
import NoChatSelected from '../components/NoChatSelected';
import ChatContainer from '../components/ChatContainer';
import PostSkeletons from '../components/skeletons/PostSkeletons';
import Post from '../components/Post';

function HomePage() {
  const { selectedUser } = useChatStore();
  return (
    <div className='h-screen bg-base-200'>
      <div className='flex flex-center justify-center pt-20 px-4'>
        <div className='bg-base-200 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]'>
          <div className='flex h-full rounded-lg overflow-hidden'>
            <Sidebar />
            {!selectedUser ? <Post /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
