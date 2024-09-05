import React, { useRef } from "react";
import "../css/ChatWindow.css";
import { styled } from "@stitches/react";

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
    <ChatWindowDiv>
      <ChatWindowHeader>
        <h2>{chat.name}</h2>
      </ChatWindowHeader>
      <ChatWindowMessages>
        {allMessages.map((each, index) => {
          if (!each.message) return;
          return (
            <SenderAndReceiver
              style={each.myId && { marginLeft: "auto" }}
              key={index}
            >
              {each.message}
            </SenderAndReceiver>
          );
        })}
        {/* Messages will be displayed here */}
      </ChatWindowMessages>
      <ChatWindowInput>
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
      </ChatWindowInput>
    </ChatWindowDiv>
  );
}

export default ChatWindow;

const ChatWindowDiv = styled("div", {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#ffffff",
  borderLeft: "1px solid #ddd",
  boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
});

const ChatWindowHeader = styled("div", {
  padding: 20,
  backgroundColor: "#0078d4",
  color: "#ffffff",
  borderBottom: "1px solid #005bb5",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  h2: {
    margin: 0,
    fontSize: 18,
    fontWeight: 600,
  },
});

const ChatWindowMessages = styled("div", {
  flex: 1,
  padding: 20,
  overflowY: "auto",
  backgroundColor: "#f5f5f5",
  alignItems: "flex-start",
  display: "flex",
  flexDirection: "column",
});

const ChatWindowInput = styled("div", {
  padding: 15,
  display: "flex",
  alignItems: "center",
  borderTop: "1px solid #ddd",
  backgroundColor: "#ffffff",
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    border: "1px solid #ddd",
    marginRight: 10,
    fontSize: 14,
  },
  button: {
    marginLeft: 10,
    border: "none",
    backgroundColor: "#0078d4",
    color: "white",
    padding: "10px 15px",
    borderRadius: 20,
    cursor: "pointer",
    fontSize: 14,
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "#005bb5",
    },
  },
});

const SenderAndReceiver = styled("div", {
  backgroundColor: "#0f5783",
  maxWidth: "50%",
  textAlign: "start",
  bordeRadius: 15,
  padding: "6px 19px",
  color: "white",
  display: "flex",
  alignItems: "center",
  margin: "1px 0px",
});
