import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import ChatList from "../../components/ChatList";
import ChatWindow from "../../components/ChatWindow";
import { CircularProgress, Container, Backdrop } from "@mui/material";
import { styled, keyframes, fixedWidth } from "../../stichesConfig";
import { showNotification } from "../../components/PushNotification";
const chunkSize = 1024;

function Chat() {
  const [showSideBar, setShowSideBar] = useState(true);
  const [myDetails, setMyDetails] = useState({ name: "" });
  const [selectedChat, setSelectedChat] = useState(null);
  const [allGuestUsers, setAllGuestUsers] = useState({});
  const [disconnectedGuestUsers, setDisconnectedAllGuestUsers] = useState({});
  const [allMessages, setAllMessages] = useState({});
  const [newMessages, setNewMessages] = useState({});
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();
  const [documentSocket, setDocumentSocket] = useState(true);
  let socket = undefined;
  const deviceWidth = window.innerWidth;

  const pullNewMessages = () => {
    if (!selectedChat) return;
    const messages = newMessages[selectedChat.id];
    if (!messages) return;
    let newObj = { ...allMessages };
    messages.forEach((each) => {
      newObj[selectedChat.id] = [
        ...(newObj[selectedChat.id] || []),
        { ...each },
      ];
    });
    setAllMessages(newObj);

    let obj = { ...newMessages };
    delete obj[selectedChat.id];
    setNewMessages(obj);
  };

  useEffect(() => {
    pullNewMessages();
  }, [selectedChat]);

  const checkLogin = () => {
    const getLoginInfo = sessionStorage.getItem("guest");
    if (getLoginInfo !== "true") {
      navigate("/mode/guest", { replace: true });
      return false;
    }
    return true;
  };

  useEffect(() => {
    Notification.requestPermission().then((result) => {
      console.log(result);
    });
    if (!checkLogin()) return;
    setTimeout(() => {
      if (!socket && document.socket == undefined) {
        socket = io(process.env.REACT_APP_BACKEND_URL, {
          reconnection: true, // Enable reconnection
          reconnectionAttempts: 5, // Number of reconnection attempts
          reconnectionDelay: 2000, // Delay between reconnections
          reconnectionDelayMax: 5000, // Maximum delay between reconnections
        });
      }
      if (document.socket) {
        socket = document.socket;
      } else document.socket = socket;
      setDocumentSocket(!documentSocket);
      // socket.on("connect", () => {
      //   // console.log("socketId ", socket.id);
      // });
    }, 0);

    // return () => {
    //   if (socket) socket.disconnect();
    // };
  }, []);

  if (document.socket) {
    document.socket.removeAllListeners("guests");
    document.socket.on("guests", (data) => {
      // console.log(data, callback);
      const details = data[document.socket.id];
      if (details && details?.name !== myDetails?.name) {
        setMyDetails(details);
      }

      delete data[document.socket.id];
      console.log(allGuestUsers, data);
      setAllGuestUsers({ ...allGuestUsers, ...data });
      // callback(true);
    });

    document.socket.removeAllListeners("disconnectedGuest"); //removing old listeners to prevent multiple times output
    document.socket.on("disconnectedGuest", (userId) => {
      console.log({ allGuestUsers });
      let obj = disconnectedGuestUsers;
      obj[userId] = userId;

      setDisconnectedAllGuestUsers({ ...obj });
    });

    document.socket.removeAllListeners("singleUserMessageReceived");
    document.socket.on(
      "singleUserMessageReceived",
      ({ message, receiverId }) => {
        console.log({ message, receiverId }, selectedChat);

        if (selectedChat?.id === receiverId) {
          const newObj = updateMessages(message, receiverId, allMessages);
          setAllMessages(newObj);
        } else {
          const newObj = updateMessages(message, receiverId, newMessages);
          const count = newObj[receiverId].length;
          showNotification({
            message: `${newObj[receiverId].length} ${
              count > 1 ? "new messages" : "new message"
            }`,
          }); // if chat is not selected then show push notification
          setNewMessages(newObj);

          pullNewMessages();
        }
      }
    );
  }

  const updateMessages = (message, receiverId, source) => {
    const newObj = { ...source };
    newObj[receiverId] = [
      ...(source[receiverId] || []),
      { message: message, yourId: receiverId },
    ];
    return newObj;
  };

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

  const chunksFileData = (file) => {
    const size = file.size;
  };

  const sendFile = (files) => {
    // console.log(files);
    for (var a of files) {
      console.log(a);
    }
  };

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
            open={Object.keys(allGuestUsers).length < 1}
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
        open={Object.keys(allGuestUsers).length < 1}
      >
        <WaitingOtherUsers>Waiting for other users...</WaitingOtherUsers>
        <CircularProgress color="inherit" />
      </Backdrop>
      <StyledContainer>
        <div
          style={{
            height: "100vh",
          }}
        >
          {/* <Sidebar /> */}
          <MainDiv>
            {
              <ChatListParent
                style={{
                  transform: showSideBar
                    ? deviceWidth <= fixedWidth
                      ? "translateX(-5%)"
                      : "none"
                    : "translateX(-105%)",
                }}
              >
                <ChatList
                  myDetails={myDetails}
                  chats={Object.values(allGuestUsers)}
                  disconnectedGuestUsers={disconnectedGuestUsers}
                  selectedChat={selectedChat}
                  onSelectChat={setSelectedChat}
                  newMessages={newMessages}
                  setShowSideBar={setShowSideBar}
                />
              </ChatListParent>
            }
            {/* {(!showSideBar || deviceWidth > fixedWidth) && ( */}
            <ChatWindow
              sendMessage={sendMessage}
              chat={selectedChat}
              disconnected={
                disconnectedGuestUsers[selectedChat?.id] ? true : false
              }
              senderId={document.socket?.id || ""}
              allMessages={allMessages[selectedChat?.id]}
              showSideBar={showSideBar}
              setShowSideBar={setShowSideBar}
              ifNewMessage={Object.keys(newMessages).length > 0}
              sendFile={sendFile}
            />
            {/* )} */}
          </MainDiv>
        </div>
      </StyledContainer>
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

const StyledContainer = styled(Container, {
  // "@bp1": {
  //   padding: "0px !important",
  // },
});

const ChatListParent = styled("div", {
  "@bp1": {
    width: "100%",
    transition: "transform 0.3s ease-in-out",
    zIndex: 1,
  },
});
