import React, { useRef } from "react";
import { styled, theme } from "../stichesConfig";
import MenuIcon from "@mui/icons-material/Menu";

function ChatWindow({
  chat,
  sendMessage,
  disconnected,
  senderId,
  allMessages = [],
  setShowSideBar,
  ifNewMessage,
}) {
  const textRef = useRef(null);
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

  if (!chat) {
    return (
      <ChatWindowDiv>
        <ChatWindowHeader style={{ height: 24 }}></ChatWindowHeader>
      </ChatWindowDiv>
    );
  }

  return (
    <ChatWindowDiv>
      <ChatWindowHeader style={{ position: "relative" }}>
        <h2>{chat.name}</h2>
        <MobileVisibility onClick={() => setShowSideBar(true)}>
          <MenuIcon />
        </MobileVisibility>
        {ifNewMessage && (
          <MobileVisibility
            style={{ position: "absolute", right: "5%", bottom: "35%" }}
          >
            <RedCircle />
          </MobileVisibility>
        )}
      </ChatWindowHeader>
      <ChatWindowMessages>
        {allMessages.map((each, index) => {
          if (!each.message) return;
          return (
            <SenderAndReceiver
              style={
                each.myId && {
                  marginLeft: "auto",
                  backgroundColor: "rgb(233 233 233)",
                  color: "#0f5783",
                }
              }
              key={index}
            >
              {each.message}
            </SenderAndReceiver>
          );
        })}
        {/* Messages will be displayed here */}
      </ChatWindowMessages>
      {!disconnected && (
        <ChatWindowInput>
          <input
            disabled={disconnected}
            onKeyUp={(e) => {
              e.key === "Enter" && send();
            }}
            ref={textRef}
            type="text"
            placeholder="Type a message..."
          />
          <button disabled={disconnected} onClick={send}>
            Send
          </button>
          {/* <button>📎</button>  */}
        </ChatWindowInput>
      )}
    </ChatWindowDiv>
  );
}

export default ChatWindow;

const RedCircle = styled("span", {
  width: 8,
  height: 8,
  borderRadius: "100%",
  backgroundColor: "#f15858",
  display: "block",
});

const MobileVisibility = styled("div", {
  "@bp1": {
    display: "block",
  },
  "@bp3": {
    display: "none",
  },
});

const ChatWindowDiv = styled("div", {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.colors.darkBlue,
  borderLeft: "1px solid #ddd",
  boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
  "@bp1": {
    flex: "auto",
    borderLeft: "none",
    position: "fixed",
    height: "100%",
    width: "92%",
  },
});

const ChatWindowHeader = styled("div", {
  padding: 20,
  color: "#ffffff",
  borderBottom: "1px solid white",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  // position: "relative",
  h2: {
    margin: 0,
    fontSize: 18,
    fontWeight: 600,
  },
  "@bp1": {
    h2: {
      fontSize: 15,
    },
  },
});

const ChatWindowMessages = styled("div", {
  flex: 1,
  padding: 20,
  overflowY: "auto",
  backgroundColor: theme.colors.darkBlue,
  alignItems: "flex-start",
  display: "flex",
  flexDirection: "column",
});

const ChatWindowInput = styled("div", {
  padding: 15,
  display: "flex",
  alignItems: "center",
  borderTop: "1px solid #ddd",
  backgroundColor: theme.colors.darkBlue,
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    border: "1px solid #ddd",
    marginRight: 10,
    fontSize: 14,
    outline: "none",
    "@bp1": {
      borderRadius: 4,
      marginRight: 0,
      flex: "none",
      width: "67%",
    },
  },
  button: {
    marginLeft: 10,
    border: "none",
    backgroundColor: "white",
    color: "rgb(4 43 73)",
    padding: "10px 15px",
    borderRadius: 20,
    cursor: "pointer",
    fontSize: 14,
    transition: "background-color 0.3s",
    "@bp1": {
      marginLeft: 0,
      borderRadius: 4,
      fontWeight: 600,
    },
  },
  "@bp1": {
    padding: "15px 0px",
    justifyContent: "space-evenly",
  },
});

const SenderAndReceiver = styled("div", {
  backgroundColor: "rgb(12 53 79)",
  maxWidth: "50%",
  textAlign: "start",
  bordeRadius: 15,
  padding: "6px 19px",
  color: "white",
  display: "flex",
  alignItems: "center",
  margin: "1px 0px",
});
