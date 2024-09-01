import React from "react";
import "../css/ChatWindow.css";

function ChatWindow({ chat }) {
  if (!chat) {
    return <div className="chatWindow">Select a chat to start messaging</div>;
  }

  return (
    <div className="chatWindow">
      <div className="chatWindow__header">
        <h2>{chat.name}</h2>
      </div>
      <div className="chatWindow__messages">
        {/* Messages will be displayed here */}
      </div>
      <div className="chatWindow__input">
        <input type="text" placeholder="Type a message..." />
        <button>Send</button>
        <button>📎</button> {/* File attachment icon */}
      </div>
    </div>
  );
}

export default ChatWindow;
