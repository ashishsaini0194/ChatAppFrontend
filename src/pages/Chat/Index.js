import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import ChatList from "../../components/ChatList";
import ChatWindow from "../../components/ChatWindow";
import { CircularProgress, Container, Backdrop } from "@mui/material";
import { keyframes, styled } from "@stitches/react";

function Chat() {
  const [myDetails, setMyDetails] = useState({ name: "" });
  const [selectedChat, setSelectedChat] = useState(null);
  const [allGuestUsers, setAllGuestUsers] = useState([]);
  const [disconnectedGuestUsers, setDisconnectedAllGuestUsers] = useState({});
  const [allMessages, setAllMessages] = useState({});
  const [newMessages, setNewMessages] = useState({});
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();
  let socket = undefined;

  const checkLogin = () => {
    const getLoginInfo = sessionStorage.getItem("guest");
    if (getLoginInfo !== "true") {
      navigate("/mode/guest", { replace: true });
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!checkLogin()) return;
    setTimeout(() => {
      if (!socket) {
        socket = io(process.env.REACT_APP_BACKEND_URL, {
          timeout: 1000,
          reconnectionAttempts: 5,
        });
      }
      document.socket = socket;
      socket.on("connect", () => {
        console.log("socketId ", socket.id);
      });

      socket.on("guests", (data) => {
        const details = data[socket.id];
        if (details && details?.name !== myDetails?.name) {
          console.log(details);
          setMyDetails(details);
        }

        delete data[socket.id];
        setAllGuestUsers(Object.values(data));
      });

      socket.on("disconnectedGuest", (userId) => {
        console.log("before", disconnectedGuestUsers);
        let obj = disconnectedGuestUsers;
        obj[userId] = userId;

        setDisconnectedAllGuestUsers({ ...obj });
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

  console.log({ disconnectedGuestUsers });

  if (!checkLogin()) {
    return (
      <>
        <div
          style={{
            backgroundColor: "black",
            height: "100vh",
            width: "100%",
          }}
        >
          <Backdrop
            sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
            open={allGuestUsers.length < 1}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      </>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "black",
      }}
    >
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={allGuestUsers.length < 1}
      >
        <WaitingOtherUsers>Waiting for other users...</WaitingOtherUsers>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container>
        <div
          style={{
            height: " 100vh",
          }}
        >
          {/* <Sidebar /> */}
          <MainDiv>
            <ChatList
              myDetails={myDetails}
              chats={allGuestUsers}
              disconnectedGuestUsers={disconnectedGuestUsers}
              onSelectChat={setSelectedChat}
            />
            <ChatWindow
              sendMessage={sendMessage}
              chat={selectedChat}
              disconnected={
                disconnectedGuestUsers[selectedChat?.id] ? true : false
              }
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

const opacityTransition = keyframes({
  "0%": { opacity: 0.2 },
  "50%": { opacity: 0.8 },
  "100%": { opacity: 0.2 },
});

const WaitingOtherUsers = styled("div", {
  color: "darkgray",
  position: "absolute",
  top: "54%",
  animation: `${opacityTransition} 4s infinite`,
});
