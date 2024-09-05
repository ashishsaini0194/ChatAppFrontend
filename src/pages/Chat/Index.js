import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import ChatList from "../../components/ChatList";
import ChatWindow from "../../components/ChatWindow";
import { Container } from "@mui/material";
import { styled } from "@stitches/react";

function Chat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [allGuestUsers, setAllGuestUsers] = useState([]);
  const [allMessages, setAllMessages] = useState({});
  const [newMessages, setNewMessages] = useState({});
  const navigate = useNavigate();
  let socket = undefined;

  const checkLogin = () => {
    const getLoginInfo = localStorage.getItem("auth");
    if (getLoginInfo) navigate("/login");
  };

  useEffect(() => {
    checkLogin();
    setTimeout(() => {
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
    }, 0);

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  if (document.socket) {
    document.socket.on(
      "singleUserMessageReceived",
      ({ message, receiverId }) => {
        console.log(allMessages);
        console.log({ message, receiverId });

        const newObj = { ...allMessages };
        newObj[receiverId] = [
          ...(allMessages[receiverId] || []),
          { message: message, yourId: receiverId },
        ];
        setAllMessages(newObj);
      }
    );
  }

  const sendMessage = (data) => {
    document.socket.emit("singleUserMessage", data, ({ status }) => {
      if (status) {
        const newObj = { ...allMessages };
        newObj[data.id] = [
          ...(allMessages[data.id] || []),
          { message: data.message, myId: data.senderId, yourId: data.id },
        ];
        setAllMessages(newObj);
      }
    });
  };

  useEffect(() => {
    console.log(allMessages);
  }, [allMessages]);

  return (
    <div
      style={{
        backgroundColor: "black",
      }}
    >
      <Container>
        <div
          style={{
            height: " 100vh",
          }}
        >
          {/* <Sidebar /> */}
          <MainDiv>
            <ChatList chats={allGuestUsers} onSelectChat={setSelectedChat} />
            <ChatWindow
              sendMessage={sendMessage}
              chat={selectedChat}
              senderId={document.socket?.id || ""}
              allMessages={allMessages[selectedChat?.id]}
            />
          </MainDiv>
        </div>
      </Container>
    </div>
  );
}

export default Chat;

const MainDiv = styled("div", {
  display: "flex",
  flexSirection: "row",
  width: "100%",
  height: "100%",
});
