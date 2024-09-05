import React, { useEffect, useState } from "react";
import "../css/ChatList.css";
import { pickRandomColour } from "../constants";

function ChatList({ onSelectChat, chats }) {
  const [isGuestUser, setIsGuestUser] = useState(true);
  useEffect(() => {
    // const urlParam = window.location;
    // const ifGuest = urlParam.pathname.includes("guest");
    // setIsGuestUser(ifGuest);
  });
  return (
    <div className="chatList">
      <div className="chatListItem">
        {isGuestUser && (
          <div
            style={{ backgroundColor: pickRandomColour("A") }}
            className="chatListItem__avatar"
          >
            {"A"}
          </div>
        )}{" "}
        <div className="chatListItem__details">
          <h4>{"You"}</h4>
        </div>
      </div>
      {chats.map((chat) => (
        <div
          key={chat.id}
          className="chatListItem"
          onClick={() => onSelectChat(chat)}
        >
          {isGuestUser && (
            <div
              style={{ backgroundColor: pickRandomColour(chat.name[0]) }}
              className="chatListItem__avatar"
            >
              {chat.name[0]}
            </div>
          )}
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
