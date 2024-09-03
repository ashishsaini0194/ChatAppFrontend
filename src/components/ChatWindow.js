import React, { useRef } from "react";
import "../css/ChatWindow.css";

function ChatWindow({ chat, sendMessage, senderId, allMessages = [] }) {
  const textRef = useRef(null);
  if (!chat) {
    return <div className="chatWindow">Select a chat to start messaging</div>;
  }
  const send = () => {
    const message = textRef.current.value;
    if (!message) {
      alert("message can't be empty !");
      return;
    }
    const data = { message, id: chat.id, senderId };
    sendMessage(data);
    textRef.current.value = "";
  };

  return (
    <div className="chatWindow">
      <div className="chatWindow__header">
        <h2>{chat.name}</h2>
      </div>
      <div className="chatWindow__messages">
        {allMessages.map((each, index) => {
          if (!each.message) return;
          return (
            <div
              className={`senderAndReceiver ${
                each.myId ? "sender" : "receiver"
              }`}
              key={index}
            >
              {each.message}
            </div>
          );
        })}
        {/* Messages will be displayed here */}
      </div>
      <div className="chatWindow__input">
        <input
          onKeyUp={(e) => {
            e.key === "Enter" && send();
          }}
          ref={textRef}
          type="text"
          placeholder="Type a message..."
        />
        <button onClick={send}>Send</button>
        <button>📎</button> {/* File attachment icon */}
      </div>
    </div>
  );
}

export default ChatWindow;
