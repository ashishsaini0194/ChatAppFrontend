import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import ChatList from "../../components/ChatList";
import ChatWindow from "../../components/ChatWindow";
import "../../css/App.css";

function Chat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [allGuestUsers, setAllGuestUsers] = useState([]);
  const navigate = useNavigate();
  let socket = undefined;

  const checkLogin = () => {
    const getLoginInfo = localStorage.getItem("auth");
    if (getLoginInfo) navigate("/login");
  };

  useEffect(() => {
    checkLogin();
    if (!socket) {
      socket = io(process.env.REACT_APP_BACKEND_URL, { timeout: 1000 });
    }
    document.socket = socket;
    socket.on("connect", () => {
      console.log("socketId ", socket.id);
    });

    socket.on("guests", (data) => {
      console.log(data);
      delete data[socket.id];
      setAllGuestUsers(Object.values(data));
    });

    socket.on("singleUserMessageReceived", ({ message, senderId }) => {
      console.log(message, senderId);
    });
  }, []);

  const sendMessage = (data) => {
    console.log(document.socket);
    document.socket.emit("singleUserMessage", data);
  };

  return (
    <div style={{ height: " 100vh" }}>
      {/* <Sidebar /> */}
      <div className="mainDiv">
        <ChatList chats={allGuestUsers} onSelectChat={setSelectedChat} />
        <ChatWindow
          sendMessage={sendMessage}
          chat={selectedChat}
          senderId={socket?.id || ""}
        />
      </div>
    </div>
  );
}

export default Chat;
