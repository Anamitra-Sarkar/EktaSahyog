import React, { useState } from 'react';
import ChatSidebar from '../Components/features/ChatSidebar';
import ChatInterface from '../Components/features/ChatInterface';
import io from 'socket.io-client';

const socket = io.connect(import.meta.env.VITE_API_URL || "http://localhost:5001");

const Chat = () => {
  const [selectedChannel, setSelectedChannel] = useState(null);

  return (
    <div className="flex h-screen bg-slate-900">
      <ChatSidebar onSelectChannel={setSelectedChannel} selectedChannel={selectedChannel} />
      <ChatInterface channelId={selectedChannel} socket={socket} />
    </div>
  );
};

export default Chat;