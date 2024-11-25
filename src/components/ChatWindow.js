import React, { useEffect, useRef, useState } from "react";
import { fixedWidth, styled, theme } from "../stichesConfig";
import MenuIcon from "@mui/icons-material/Menu";
import { ErrorResponseComp, validTypes } from "./ErrorResponseComp";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DownloadIcon from "@mui/icons-material/Download";

function ChatWindow({
  chat,
  sendMessage,
  disconnected,
  senderId,
  allMessages = [],
  showSideBar,
  setShowSideBar,
  ifNewMessage,
  sendFile,
}) {
  const [responseState, setResponseState] = useState({});
  const deviceWidth = window.innerWidth;
  const textRef = useRef(null);
  useEffect(() => {
    if (textRef.current && !showSideBar) {
      textRef.current.focus();
    }
  }, [showSideBar]);
  useEffect(() => {
    if (textRef.current) {
      textRef.current.value = "";
    }
  }, [chat]);
  const send = () => {
    const message = textRef.current.value;
    if (!message) {
      setResponseState({
        type: validTypes.error,
        message: "message can't be empty !",
        setState: setResponseState,
      });
      return;
    }
    const data = { message, id: chat.id, senderId };
    sendMessage(data, "text");
    textRef.current.value = "";
  };

  if (!chat) {
    return (
      <ChatWindowDiv>
        <ChatWindowHeader style={{ height: 24 }}></ChatWindowHeader>
      </ChatWindowDiv>
    );
  }

  const onfileSelect = (e) => {
    sendFile({ file: e.target.files, id: chat.id, senderId });
    // e.target.value = "";
  };

  const downloadFile = (blobUrl, name) => {
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = name;
    a.click();
  };

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
                  paddingRight: each.typeOfMessage ? 12 : "auto",
                }
              }
              key={index}
            >
              {each.typeOfMessage === "text" && each.message}
              {each.typeOfMessage === "file" && (
                <>
                  {/* {each.message?.percentageDone < 1
                    ? `${each.message.name} ${Math.round(
                        each.message?.percentageDone * 100
                      )}`
                    : each.message.name} */}
                  {each.message.name}{" "}
                  {each.message?.percentageDone < 1 ? (
                    <span
                      style={{ fontSize: 14, marginLeft: 10, marginTop: 3 }}
                    >
                      {Math.round(each.message?.percentageDone * 100)}%
                    </span>
                  ) : (
                    <DownloadIcon
                      fontSize="12px"
                      style={{ marginLeft: 10, marginTop: 3 }}
                      onClick={() =>
                        downloadFile(each.blobUrl, each.message.name)
                      }
                    />
                  )}
                </>
              )}
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

          <label htmlFor="myfile">
            {/* for attribute work fine with label only */}
            <AttachFileIcon style={{ color: "white" }} />
          </label>
          <input
            type="file"
            style={{ display: "none" }}
            name="myfile"
            id="myfile"
            onChange={onfileSelect}
            multiple
          />
          <button disabled={disconnected} onClick={send}>
            Send
          </button>
          {/* <button>📎</button>  */}
        </ChatWindowInput>
      )}
      {responseState && (
        <ErrorResponseComp
          {...responseState}
          timeout={1000}
          propStyle={
            deviceWidth <= fixedWidth
              ? { bottom: "15%", right: "3%" }
              : { bottom: "10%", right: "22%" }
          }
        />
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
  // borderLeft: "1px solid #ddd",
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
      width: "60%",
      backgroundColor: theme.colors.darkBlue,
      color: "white",
      border: "none",
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
      color: "rgb(15, 87, 131)",
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
  fontWeight: 600,
  wordBreak: "break-word",
  "@bp1": {
    fontSize: 14,
  },
});
