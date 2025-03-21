import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import ChatList from "../../components/ChatList";
import ChatWindow from "../../components/ChatWindow";
import { CircularProgress, Container, Backdrop } from "@mui/material";
import { styled, keyframes, fixedWidth } from "../../stichesConfig";
import { showNotification } from "../../components/PushNotification";
import { getSwipe } from "../../utils/SwipeTouch";
import { v4 as uuidv4 } from "uuid";

let chunkSize = 1024;
const after120Seconds = 120 * 1000;

function Chat() {
  const [showSideBar, setShowSideBar] = useState(true);
  const [myDetails, setMyDetails] = useState({ name: "" });
  const [selectedChat, setSelectedChat] = useState(null);
  const [allGuestUsers, setAllGuestUsers] = useState({});
  const [disconnectedGuestUsers, setDisconnectedAllGuestUsers] = useState({});
  const [allMessages, setAllMessages] = useState({});
  const [newMessages, setNewMessages] = useState({});
  // const [loader, setLoader] = useState(true);
  const navigate = useNavigate();
  const [documentSocket, setDocumentSocket] = useState(true);
  let socket = undefined;
  const deviceWidth = window.innerWidth;
  let fileMessages = useRef({});
  const latestEpocTime = useRef(undefined);
  const swipableElement = useRef();

  const pullNewMessages = () => {
    if (!selectedChat) return;
    const messages = newMessages[selectedChat.id];
    if (!messages) return;
    let newObj = { ...allMessages };
    newObj[selectedChat.id] = {
      ...(newObj[selectedChat.id] || {}),
      ...messages,
    };
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
      // console.log(result);
    });
    if (!checkLogin()) return;
    setTimeout(() => {
      if (!socket && document.socket === undefined) {
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
      setTimeout(() => {
        setAllGuestUsers((prevState) => {
          return {
            ...prevState,
            botAi: { id: "botAi", name: "AI BOT" },
          };
        });
      }, 500);
      // socket.on("connect", () => {
      //   // console.log("socketId ", socket.id);
      // });
    }, 0);

    getSwipe(
      () => {
        setShowSideBar(true);
      },
      () => {
        setShowSideBar(false);
      },
      swipableElement
    );
  }, []);

  const bufferToBlob = (filename) => {
    try {
      const buffers = [];
      fileMessages.current[filename].forEach((eachBuffer) => {
        buffers.push(
          eachBuffer.singleChunk.data
            ? new Uint8Array(eachBuffer.singleChunk.data) // for reciever buffer data
            : eachBuffer.singleChunk // for sender blob data
        );
      });
      const blobData = new Blob(buffers, {
        type: fileMessages.current[filename][0].type,
      });
      const link = URL.createObjectURL(blobData);
      fileMessages.current[filename] = [];
      // setTimeout(() => {
      //   URL.revokeObjectURL(link);
      // }, after120Seconds); // link will be revoked and memory will be freed after 2 minutes
      return link;
    } catch (e) {
      return "";
    }
  };

  const messageReceived = async ({
    message,
    receiverId,
    type,
    messageId,
    streamDetails,
  }) => {
    // console.log(
    //   "message received",
    //   message,
    //   receiverId,
    //   selectedChat,
    //   type,
    //   streamDetails
    // );
    let parseMessage = message;
    let blobUrl = undefined;
    if (type === "file") {
      parseMessage = JSON.parse(message);

      //saving format {filename:[obj,obj, ..so on]}
      if (fileMessages.current?.[parseMessage.name]) {
        fileMessages.current[parseMessage.name].push(parseMessage);
      } else {
        fileMessages.current[parseMessage.name] = [parseMessage];
      }

      if (parseMessage.final) {
        blobUrl = bufferToBlob(parseMessage.name);
        latestEpocTime.current = new Date().getTime();
      }
    }

    if (selectedChat?.id === receiverId) {
      setAllMessages((prevState) => {
        return updateMessages(
          type === "file" ? parseMessage : message,
          receiverId,
          prevState,
          type,
          blobUrl,
          messageId,
          streamDetails
        );
      });
    } else {
      const newObj = updateMessages(
        type === "file" ? parseMessage : message,
        receiverId,
        newMessages,
        type,
        blobUrl,
        messageId,
        streamDetails
      );
      const count = newObj[receiverId].length;
      if (type != "file" || parseMessage?.final) {
        showNotification({
          message: `${Object.values(newObj[receiverId] || {}).length} ${
            count > 1 ? "new messages" : "new message"
          }`,
        }); // if chat is not selected then show push notification
      }
      setNewMessages(newObj);

      pullNewMessages();
    }
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
      let obj = disconnectedGuestUsers;
      obj[userId] = userId;

      setDisconnectedAllGuestUsers({ ...obj });
    });

    document.socket.removeAllListeners("singleUserMessageReceived");
    document.socket.on("singleUserMessageReceived", messageReceived);
  }

  const updateMessages = (
    message,
    receiverId,
    source,
    typeOfMessage,
    blobUrl,
    messageId,
    streamDetails
  ) => {
    if (!message) {
      return source;
    }
    // console.log(" streamDetails", streamDetails, message);
    const newObj = { ...source };
    if (streamDetails) {
      if (!newObj[receiverId][messageId]) {
        newObj[receiverId][messageId] = {
          message: message,
          yourId: receiverId,
          typeOfMessage,
          blobUrl,
          messageEpocTime: new Date().getTime(),
        };
      } else newObj[receiverId][messageId].message += message;
      // console.log({ newObj });
      return { ...newObj };
    }
    newObj[receiverId] = {
      ...(source[receiverId] || {}),
      [messageId]: {
        message: message,
        yourId: receiverId,
        typeOfMessage,
        blobUrl,
        messageEpocTime: new Date().getTime(),
      },
    };
    // console.log({ newObj });
    return newObj;
  };

  // useEffect(() => {
  //   sessionStorage.setItem("data", JSON.stringify(allMessages));
  // }, [allMessages]);

  const sendMessage = async (data, typeOfMessage, recursionMessageId) => {
    const messageId = recursionMessageId || uuidv4();
    // console.log(data, typeOfMessage, messageId);

    let messageData = data.message;
    if (typeOfMessage === "file") {
      messageData = data.message();
      if (messageData.final) {
        data.blobUrl = bufferToBlob(messageData.name);
        latestEpocTime.current = new Date().getTime();
      }
    }

    document.socket.emit(
      "singleUserMessage",
      {
        ...data,
        message: data.id == "botAi" ? `bot:${messageData}` : messageData, // sending message to chat gpt if message done to botAi
        messageId,
      },
      ({ status }) => {
        if (status) {
          setAllMessages((prevState) => {
            prevState[data.id] = {
              ...(prevState[data.id] || {}),
              [messageId]: {
                message: messageData,
                myId: data.senderId,
                yourId: data.id,
                typeOfMessage,
                blobUrl: data?.blobUrl,
                messageId,
                messageEpocTime: new Date().getTime(),
              },
            };
            return { ...prevState };
          });

          if (typeOfMessage === "file") {
            if (!messageData.final) {
              sendMessage(data, "file", messageId);
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

      const obj = {
        singleChunk,
        name: file.name,
        size: file.size,
        type: file.type,
        final: iFrom >= file.size ? true : false,
        percentageDone: iFrom / file.size,
      };

      //saving format {filename:[obj,obj, ..so on]}
      if (fileMessages.current?.[file.name]) {
        fileMessages.current[file.name].push(obj);
      } else {
        fileMessages.current[file.name] = [obj];
      }

      return obj;
    };
  };

  const sendHere = async (chunkFunc, id, senderId) => {
    await sendMessage({ message: chunkFunc, id, senderId }, "file");
  };

  const sendFile = (data) => {
    const files = data.file;
    for (let a of files) {
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
      <StyledContainer ref={swipableElement}>
        <div
          style={{
            height: "100vh",
          }}
        >
          {/* <Sidebar /> */}
          <MainDiv>
            <ChatListParent
              style={
                deviceWidth <= fixedWidth
                  ? {
                      transform: showSideBar
                        ? "translateX(-4%)"
                        : "translateX(-105%)",
                    }
                  : {}
              }
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

            <ChatWindow
              sendMessage={sendMessage}
              chat={selectedChat}
              disconnected={
                disconnectedGuestUsers[selectedChat?.id] ? true : false
              }
              senderId={document.socket?.id || ""}
              allMessages={
                Object.values(allMessages[selectedChat?.id] || {}) || []
              }
              showSideBar={showSideBar}
              setShowSideBar={setShowSideBar}
              ifNewMessage={Object.keys(newMessages).length > 0}
              sendFile={sendFile}
              latestEpocTime={latestEpocTime.current}
            />
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
  position: "relative",
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
    width: "96%",
    transition: "transform 0.3s ease-in-out",
    zIndex: 1,
  },
});
