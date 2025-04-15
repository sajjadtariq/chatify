import React, { useEffect, useRef } from 'react';
import { useChatStore } from './store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import { useAuthStore } from './store/useAuthStore';
import { formatMessageTime } from '../lib/formatTime';
import avatar from '../assets/images/avatar.webp';
import { SkeletonDemo } from './ui/messageskeleton';

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messagesContainerRef = useRef(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);


  useEffect(() => {
    if (messagesContainerRef.current && !isMessagesLoading) {
      if (isInitialLoad.current) {

        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        isInitialLoad.current = false;
      } else {

        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }
  }, [messages, isMessagesLoading]);

  console.log(selectedUser);
  

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <div className="h-[100px]">
        <ChatHeader />
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto flex flex-col justify-end">
          <div
            ref={messagesContainerRef}
            className="max-h-full w-full overflow-y-auto scrollbar-hide p-5 flex flex-col gap-4 "
          >
            {isMessagesLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div className="h-full w-full flex flex-col justify-end" key={i}>
                  <SkeletonDemo styling="flex justify-start w-full" />
                  <SkeletonDemo styling="flex justify-end w-full" />
                </div>
              ))
            ) : messages.length > 0 ? (
              messages.map((message) => {
                const sendercheck = message.senderId === authUser._id;
                return (
                  <div
                    key={message._id}
                    className={`flex w-full ${sendercheck ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex flex-col gap-2">
                      <img
                        src={message.image || ''}
                        alt=""
                        className={`w-32 h-32 rounded-lg ${message.image ? 'block' : 'hidden'}`}
                      />
                      <p
                        className={`max-w-[150px] md:max-w-[300px] text-base lg:text-lg font-normal px-5 py-3 rounded-xl 
                        ${sendercheck ? 'bg-blue-600 text-white' : 'bg-[#2C2C2C] text-gray-300'}
                        ${message.text ? 'block' : 'hidden'}`}
                        style={{
                          wordBreak:
                            message.text && message.text.split(' ')[0].length > 20 ? 'break-all' : 'normal',
                        }}
                      >
                        {message.text}
                      </p>
                      <div className={`text-sm w-full px-1 flex ${sendercheck ? 'justify-end' : 'justify-start'}`}>
                        <span>{formatMessageTime(message.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <h3 className="text-xl text-center">Send a message to start conversation</h3>
            )}
          </div>
        </div>
      </div>

      <div className="h-[100px]">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatContainer;