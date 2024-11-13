import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import ChatList from "../../components/ChatList";
import ChatWindow from "../../components/ChatWindow";
import { CircularProgress, Container, Backdrop } from "@mui/material";
import { styled, keyframes, fixedWidth } from "../../stichesConfig";
import { showNotification } from "../../components/PushNotification";
let chunkSize = 1024;

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
  let fileMessages = [];

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

  const bufferToBlob = () => {
    const buffers = [];
    fileMessages.forEach((eachBuffer) => {
      buffers.push(new Uint8Array(eachBuffer.singleChunk.data));
    });
    const blobData = new Blob(buffers, { type: fileMessages[0].type });
    const link = URL.createObjectURL(blobData);
    console.log(link);
    fileMessages = [];
    return link;
  };

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
      ({ message, receiverId, type }) => {
        // console.log(
        //   "message received",
        //   message,
        //   receiverId,
        //   selectedChat,
        //   type
        // );

        let parseMessage = message;
        let blobUrl = undefined;
        if (type === "file") {
          parseMessage = JSON.parse(message);
          if (parseMessage.type != fileMessages[0]?.type) {
            fileMessages = []; // resest chunk if file type differs from previous chunks
          }
          fileMessages.push(parseMessage);

          if (!parseMessage.final) {
            return;
          }
          // console.log(fileMessages, parseMessage.size);
          blobUrl = bufferToBlob();
        }

        if (selectedChat?.id === receiverId) {
          const newObj = updateMessages(
            type === "file" ? parseMessage : message,
            receiverId,
            allMessages,
            type,
            blobUrl
          );
          setAllMessages(newObj);
        } else {
          const newObj = updateMessages(
            type === "file" ? parseMessage : message,
            receiverId,
            newMessages,
            type,
            blobUrl
          );
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

  const updateMessages = (
    message,
    receiverId,
    source,
    typeOfMessage,
    blobUrl
  ) => {
    const newObj = { ...source };
    newObj[receiverId] = [
      ...(source[receiverId] || []),
      { message: message, yourId: receiverId, typeOfMessage, blobUrl },
    ];
    return newObj;
  };

  const sendMessage = async (data, typeOfMessage) => {
    let messageData = data.message;
    if (typeOfMessage === "file") {
      messageData = data.message();
    }
    document.socket.emit(
      "singleUserMessage",
      { ...data, message: messageData },
      ({ status }) => {
        if (status) {
          const newObj = { ...allMessages };
          newObj[data.id] = [
            ...(allMessages[data.id] || []),
            {
              message: messageData,
              myId: data.senderId,
              yourId: data.id,
              typeOfMessage,
              blobUrl: data?.blobUrl,
            },
          ];
          // console.log("sent", messageData);
          setAllMessages(newObj);

          if (typeOfMessage === "file") {
            if (!messageData.final) {
              setTimeout(() => {
                sendMessage(data, "file");
              }, 0);
            }
          }
        }
      }
    );
  };

  const getChunk = (file) => {
    const InKB = file.size / chunkSize;
    if (InKB > 100) chunkSize = file.size / 100; //changing chunk size if the file is too big, so that maximum number of chunks will be 100
    let iFrom = 0;

    return () => {
      const singleChunk = file.slice(iFrom, (iFrom += chunkSize));

      return {
        singleChunk,
        name: file.name,
        size: file.size,
        type: file.type,
        final: iFrom >= file.size ? true : false,
        percentageDone: iFrom / file.size,
      };
    };
  };

  const sendHere = async (chunkFunc, id, senderId) => {
    await sendMessage({ message: chunkFunc, id, senderId }, "file");
  };

  const sendFile = (data) => {
    const files = data.file;
    for (var a of files) {
      const chunkFunc = getChunk(a);
      sendHere(chunkFunc, data.id, data.senderId);
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
