import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import ChatList from "../../components/ChatList";
import ChatWindow from "../../components/ChatWindow";
import "../../css/App.css";

function Chat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const navigate = useNavigate();
  const socket = io(process.env.REACT_APP_BACKEND_URL);

  const checkLogin = () => {
    const getLoginInfo = localStorage.getItem("auth");
    if (getLoginInfo) navigate("/login");
  };

  useEffect(() => {
    checkLogin();
    socket.on("connect", () => {
      console.log("socketId ", socket.id);
    });
  }, []);

  if (!socket.connected) {
  }

  return (
    <div style={{ height: " 100vh" }}>
      {/* <Sidebar /> */}
      <div className="mainDiv">
        <ChatList onSelectChat={setSelectedChat} />
        <ChatWindow chat={selectedChat} />
      </div>
    </div>
  );
}

export default Chat;
