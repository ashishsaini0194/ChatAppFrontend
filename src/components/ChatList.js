import React from "react";
import "../css/ChatList.css";

function ChatList({ onSelectChat }) {
  const chats = [
    { id: 1, name: "John Doe", lastMessage: "Hello, how are you?" },
    { id: 2, name: "Jane Smith", lastMessage: "Let’s discuss the project." },
    // More chats...
  ];

  return (
    <div className="chatList">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className="chatListItem"
          onClick={() => onSelectChat(chat)}
        >
          <div className="chatListItem__avatar">{chat.name[0]}</div>
          <div className="chatListItem__details">
            <h4>{chat.name}</h4>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatList;
