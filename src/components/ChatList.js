import React from "react";
import "../css/ChatList.css";

function ChatList({ onSelectChat, chats }) {
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
