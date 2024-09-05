import React, { useEffect, useState } from "react";
import { pickRandomColour } from "../constants";
import { styled } from "@stitches/react";

function ChatList({ myDetails, onSelectChat, chats }) {
  const [isGuestUser, setIsGuestUser] = useState(true);
  useEffect(() => {
    // const urlParam = window.location;
    // const ifGuest = urlParam.pathname.includes("guest");
    // setIsGuestUser(ifGuest);
  });
  return (
    <ChatListDiv>
      <ChatListItem
        style={{ backgroundColor: "rgb(0, 120, 212)", color: "white" }}
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
      </ChatListItem>
      {chats.map((chat) => (
        <ChatListItem key={chat.id} onClick={() => onSelectChat(chat)}>
          {isGuestUser && (
            <ChatListItemAvatar
              style={{ backgroundColor: pickRandomColour(chat.name[0]) }}
            >
              {chat.name[0]}
            </ChatListItemAvatar>
          )}
          <ChatListItemDetails>
            <h4>{chat.name}</h4>
            <p>{chat.lastMessage}</p>
          </ChatListItemDetails>
        </ChatListItem>
      ))}
    </ChatListDiv>
  );
}

export default ChatList;

const ChatListDiv = styled("div", {
  width: "30%",
  backgroundColor: "#ffffff",
  borderRight: "1px solid #ddd",
  overflowY: "auto",
  boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
});

const ChatListItem = styled("div", {
  display: "flex",
  alignItems: "center",
  padding: 7,
  cursor: "pointer",
  borderBottom: "1px solid #ddd",
  transition: "background-color 0.3s, transform 0.3s",
  "&:hover": {
    backgroundColor: "#f5f5f5",
    transform: "scale(1.02)",
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
