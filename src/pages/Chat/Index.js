import React, { useEffect } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

function Chat() {
  const navigate = useNavigate();
  const socket = io(process.env.REACT_APP_BACKEND_URL);

  const checkLogin = () => {
    const getLoginInfo = localStorage.getItem("auth");
    if (getLoginInfo) navigate("/login");
  };

  useEffect(() => {
    checkLogin();
    socket.on("connect", () => {
      console.log('socketId ',socket.id);
    });
  }, []);

  if (!socket.connected) {
  }

  return <div></div>;
}

export default Chat;
