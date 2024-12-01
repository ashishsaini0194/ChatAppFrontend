import React, { useEffect, useRef, useState } from "react";
import { pickRandomColour } from "../constants";
import { Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { fixedWidth, styled, theme } from "../stichesConfig";

function ChatList({
  myDetails,
  onSelectChat,
  disconnectedGuestUsers,
  chats,
  newMessages,
  setShowSideBar,
  selectedChat,
}) {
  const [isGuestUser, setIsGuestUser] = useState(true);
  const deviceWidth = window.innerWidth;
  // console.log({ newMessages });
  return (
    <ChatListDiv style={{ overflowY: "auto" }}>
      <ChatListItem
        style={{
          backgroundColor: theme.colors.darkBlue,
          color: "white",
          border: "none",
        }}
      >
        {isGuestUser && (
          <ChatListItemAvatar
            style={{ backgroundColor: pickRandomColour(myDetails?.name[0]) }}
          >
            {myDetails?.name[0]}
          </ChatListItemAvatar>
        )}{" "}
        <ChatListItemDetails>
          <h4>{myDetails?.name}</h4>
        </ChatListItemDetails>
        {selectedChat && (
          <CloseIconStyled
            onClick={() => {
              setShowSideBar(false);
            }}
          >
            <CloseIcon />
          </CloseIconStyled>
        )}
      </ChatListItem>
      <Typography
        sx={{
          color: "white",
          backgroundColor: "#ffffff29",
          fontWeight: 700,
          textAlign: "start",
          padding: "10px",
        }}
      >
        Chats
      </Typography>
      <ChatListDiv style={{ height: "88%", overflowY: "auto", width: "100%" }}>
        {chats.map((chat) => (
          <ChatListItem
            key={chat.id}
            onClick={() => {
              onSelectChat(chat);
              if (deviceWidth <= fixedWidth) setShowSideBar(false);
            }}
            style={disconnectedGuestUsers[chat.id] ? { opacity: 0.5 } : {}}
          >
            {isGuestUser && (
              <ChatListItemAvatar
                style={{ backgroundColor: pickRandomColour(chat.name[0]) }}
              >
                {chat.name[0]}
              </ChatListItemAvatar>
            )}
            <ChatListItemDetails>
              <h4>{chat.name}</h4>
              {Object.keys(newMessages[chat.id] || {})?.length > 0 && (
                <p style={{ color: "white", fontWeight: 600 }}>
                  {Object.keys(newMessages[chat.id] || {})?.length === 1
                    ? `${
                        Object.keys(newMessages[chat.id] || {}).length
                      } new message `
                    : `${
                        Object.keys(newMessages[chat.id] || {}).length
                      } new messages `}
                </p>
              )}
              {disconnectedGuestUsers[chat.id] && (
                <p style={{ color: "red", fontWeight: 600 }}>
                  {"User Disconnected !"}
                </p>
              )}
              <p>{chat.lastMessage}</p>
            </ChatListItemDetails>
          </ChatListItem>
        ))}
      </ChatListDiv>
    </ChatListDiv>
  );
}

export default ChatList;

const CloseIconStyled = styled("div", {
  paddingRight: "8%",
  "@bp1": {
    display: "block",
  },
  "@bp3": {
    display: "none",
  },
});

const ChatListDiv = styled("div", {
  width: "30%",
  backgroundColor: theme.colors.darkBlue,
  borderRight: "1px solid #ddd",
  boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
  overflowX: "hidden",
  minWidth: "280px",
  height: "100%",
  "@bp1": {
    width: "100%",
    // position: "absolute",
  },
});

const ChatListItem = styled("div", {
  display: "flex",
  alignItems: "center",
  padding: 7,
  cursor: "pointer",
  borderBottom: "1px solid white",
  transition: "background-color 0.3s, transform 0.3s",
  color: "White",
  "@bp3": {
    "&:hover": {
      backgroundColor: "#f5f5f5",
      transform: "scale(1.04)",
      color: "rgb(4 43 73)",
    },
  },
  "@bp1": {
    // width: "100%",
  },
});

const ChatListItemAvatar = styled("div", {
  width: 50,
  height: 50,
  backgroundColor: "#0078d4",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  marginRight: 15,
  fontWeight: "bold",
  fontSize: 20,
});

const ChatListItemDetails = styled("div", {
  flex: 1,
  h4: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
  },
  p: {
    margin: "5px 0 0",
    color: "#888",
    fontSize: 14,
  },
});
