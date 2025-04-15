import React from 'react'
import { useChatStore } from '../components/store/useChatStore'
import NoChatSelected from '../components/NoChatSelected';
import ChatContainer from '../components/ChatContainer';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useLocation } from 'react-router-dom';

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const location = useLocation();
  const chatpage = location.pathname === '/';
  return (
    <SidebarProvider>
      {chatpage && <AppSidebar />}
      <div className="overflow-hidden w-full h-screen overflow-hidden">
        {chatpage && <SidebarTrigger arrow='true' className='flex lg:hidden' />}
        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
      </div>
    </SidebarProvider>
  )
}

export default HomePage