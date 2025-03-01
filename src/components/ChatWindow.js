import React, { useCallback, useEffect, useRef, useState } from "react";
import { fixedWidth, keyframes, styled, theme } from "../stichesConfig";
import MenuIcon from "@mui/icons-material/Menu";
import { ErrorResponseComp, validTypes } from "./ErrorResponseComp";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DownloadIcon from "@mui/icons-material/Download";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ReactPlayer from "react-player";
import { AudioController } from "../utils/AudioRecorder";
import MicIcon from "@mui/icons-material/Mic";

const after120Seconds = 120 * 1000;
function ChatWindow({
  chat,
  sendMessage,
  disconnected,
  senderId,
  allMessages = [],
  showSideBar,
  setShowSideBar,
  ifNewMessage,
  sendFile,
  latestEpocTime,
}) {
  // console.log(allMessages);
  const [responseState, setResponseState] = useState({});
  const deviceWidth = window.innerWidth;
  const textRef = useRef(null);
  const [micAcc, setMicAcc] = useState(false);
  // const [, setRerender] = useState(false);
  // const timeinterval = useRef(null);
  // const timeOutinterval = useRef(null);
  useEffect(() => {
    if (textRef.current && !showSideBar) {
      textRef.current.focus();
    }
  }, [showSideBar]);

  useEffect(() => {
    if (textRef.current) {
      textRef.current.value = "";
    }
  }, [chat]);
  let mediaRecorder = useRef(document.mediaRecorder);
  useEffect(() => {
    const func = (e) => {
      sendFile({
        file: [new File([e.data], "", { type: "audio/webm" })],
        id: chat.id,
        senderId,
      });
    };
    (async () => {
      document.mediaRecorder = await AudioController();
      mediaRecorder.current = document.mediaRecorder;
      if (!chat || !senderId || !mediaRecorder.current) return;
      mediaRecorder.current.addEventListener("dataavailable", func);
      setMicAcc(true);
    })();
    return () => {
      if (mediaRecorder.current)
        mediaRecorder.current.removeEventListener("dataavailable", func);
    };
  }, [chat, senderId]);

  // useEffect(() => {
  //   // timer for file validation
  //   clearInterval(timeinterval.current);
  //   clearTimeout(timeOutinterval.current);

  //   if (latestEpocTime) {
  //     timeinterval.current = setInterval(() => {
  //       // console.log("chla");
  //       setRerender((prevState) => !prevState);
  //     }, 1000);
  //   }
  //   if (timeinterval.current) {
  //     timeOutinterval.current = setTimeout(() => {
  //       // console.log("interval end");
  //       clearInterval(timeinterval.current);
  //     }, after120Seconds + 2000); // adding two more second to keep updates consistent
  //   }

  //   return () => {
  //     // console.log("clear time interval");
  //     clearInterval(timeinterval.current);
  //   };
  // }, [latestEpocTime]);

  const send = useCallback(() => {
    const message = textRef.current.value;
    if (!message) {
      setResponseState({
        type: validTypes.error,
        message: "message can't be empty !",
        setState: setResponseState,
      });
      return;
    }
    const data = { message, id: chat.id, senderId };
    sendMessage(data, "text");
    textRef.current.value = "";
  }, [chat, senderId]);

  if (!chat) {
    return (
      <ChatWindowDiv>
        <ChatWindowHeader style={{ height: 24 }}></ChatWindowHeader>
      </ChatWindowDiv>
    );
  }

  const onfileSelect = (e) => {
    const allFiles = [...e.target.files];
    sendFile({ file: allFiles, id: chat.id, senderId });
    e.target.value = "";
  };

  const downloadFile = (blobUrl, name) => {
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = name;
    a.click();
  };

  return (
    <ChatWindowDiv>
      <ChatWindowHeader style={{ position: "relative" }}>
        <h2 style={{ display: "flex" }}>
          {chat.name}
          <> {!disconnected ? <ActiveCircle /> : <DeactiveCircle />}</>
        </h2>

        <MobileVisibility onClick={() => setShowSideBar(true)}>
          <MenuIcon />
        </MobileVisibility>
        {ifNewMessage && (
          <MobileVisibility
            style={{ position: "absolute", right: "5%", bottom: "35%" }}
          >
            <RedCircle />
          </MobileVisibility>
        )}
      </ChatWindowHeader>
      <ChatWindowMessages>
        {allMessages.map((each, index) => {
          if (!each.message) return;
          return (
            <React.Fragment key={index}>
              <SenderAndReceiver
                style={
                  each.myId && {
                    marginLeft: "auto",
                    backgroundColor: "rgb(233 233 233)",
                    color: "#0f5783",
                    // paddingRight: each.typeOfMessage ? 12 : "auto",
                  }
                }
              >
                {each.typeOfMessage === "text" && (
                  <pre
                    style={{
                      width: "100%",
                      margin: 0,
                      whiteSpace: "break-spaces",
                    }}
                  >
                    {each.message}
                  </pre>
                )}

                {each.typeOfMessage === "file" && (
                  <>
                    {/* {each.message?.percentageDone < 1
                    ? `${each.message.name} ${Math.round(
                        each.message?.percentageDone * 100
                      )}`
                    : each.message.name} */}
                    <div>
                      {each.message?.percentageDone >= 1 &&
                        (each?.message.type.includes("image") ? (
                          <PreviewImage
                            src={each.blobUrl}
                            type={each.message.type}
                          />
                        ) : each?.message.type.includes("video") ? (
                          // <PreviewVideo>
                          <PreviewVideo
                            // style={{ ...Preview }}
                            url={each.blobUrl}
                            controls={true}
                          />
                        ) : // </PreviewVideo>
                        each?.message.type.includes("audio") ? (
                          <PreviewAudio
                            controls
                            src={each.blobUrl}
                            type={each.message.type}
                          />
                        ) : (
                          <></>
                        ))}
                    </div>
                    <div style={{ display: "flex" }}>
                      <span
                        style={{
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          width: 175,
                        }}
                      >
                        {" "}
                        {each.message.name}
                      </span>{" "}
                      {each.message?.percentageDone < 1 ? (
                        <span
                          style={{
                            fontSize: 14,
                            marginLeft: 10,
                            marginTop: 3,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {Math.round(each.message?.percentageDone * 100)}%
                        </span>
                      ) : (
                        // new Date().getTime() - each.messageEpocTime <
                        //   after120Seconds &&
                        <>
                          <DownloadIcon
                            fontSize="12px"
                            style={{
                              marginLeft: 10,
                              marginTop: 3,
                              cursor: "pointer",
                            }}
                            titleAccess="Download"
                            onClick={() =>
                              downloadFile(each.blobUrl, each.message.name)
                            }
                          />
                          <OpenInNewIcon
                            fontSize="12px"
                            titleAccess="Preview"
                            style={{
                              marginLeft: 5,
                              marginTop: 3,
                              cursor: "pointer",
                            }}
                            onClick={() => window.open(each.blobUrl)}
                          />
                        </>
                      )}
                    </div>
                  </>
                )}
              </SenderAndReceiver>
              {/* {each.typeOfMessage === "file" ? (
                <SenderAndReceiverValidityDiv
                  style={
                    each.myId && {
                      marginLeft: "auto",
                      paddingRight: each.typeOfMessage ? 12 : "auto",
                      color: "rgb(233 233 233)",
                      backgroundColor: "rgb(12, 53, 79)",
                    }
                  }
                >
                  <span
                    style={{
                      opacity: 0.5,
                      fontSize: 9,
                    }}
                  >
                    {new Date().getTime() - each.messageEpocTime <
                    after120Seconds ? (
                      <>
                        {"Valid until "}
                        {Math.round(
                          (after120Seconds -
                            (new Date().getTime() - each.messageEpocTime)) /
                            1000
                        )}
                      </>
                    ) : (
                      <>{"Expired"}</>
                    )}
                  </span>
                </SenderAndReceiverValidityDiv>
              ) : (
                <></>
              )} */}
            </React.Fragment>
          );
        })}
        {/* Messages will be displayed here */}
      </ChatWindowMessages>
      {!disconnected && (
        <ChatWindowInput>
          <InputBox
            disabled={disconnected}
            onKeyUp={(e) => {
              if (e.ctrlKey && e.key === "Enter") {
                textRef.current.value += "\n";
              } else if (e.key === "Enter") send();
            }}
            ref={textRef}
            type="text"
            placeholder="Type a message..."
          />
          <MicIconComp
            onMouseDown={() => {
              if (mediaRecorder.current) mediaRecorder.current.start();
            }}
            onMouseUp={() => {
              if (mediaRecorder.current) mediaRecorder.current.stop();
            }}
            fontSize="16px"
          />

          <label htmlFor="myfile">
            {/* for attribute work fine with label only */}
            <AttachFileIcon style={{ color: "white" }} />
          </label>
          <input
            type="file"
            style={{ display: "none" }}
            name="myfile"
            id="myfile"
            onChange={onfileSelect}
            multiple={true}
          />
          <button disabled={disconnected} onClick={send}>
            Send
          </button>
          {/* <button>📎</button>  */}
        </ChatWindowInput>
      )}
      {responseState && (
        <ErrorResponseComp
          {...responseState}
          timeout={1000}
          propStyle={
            deviceWidth <= fixedWidth
              ? { bottom: "15%", right: "3%" }
              : { bottom: "10%", right: "22%" }
          }
        />
      )}
    </ChatWindowDiv>
  );
}

export default ChatWindow;
const opacityTransition = keyframes({
  "0%": { opacity: 0.2 },
  "50%": { opacity: 0.8 },
  "100%": { opacity: 0.2 },
});
const MicIconComp = styled(MicIcon, {
  position: "absolute",
  right: 114,
  cursor: "pointer",

  "&:active": {
    color: "Blue",
    scale: "1.7",
    animation: `${opacityTransition} 2s infinite`,
  },

  "@bp1": {
    right: 100,
  },
});

const InputBox = styled("textarea", {
  width: "100%",
  borderRadius: 5,
  outline: "none",
  border: "none",
  resize: "none",
});

const RedCircle = styled("span", {
  width: 8,
  height: 8,
  borderRadius: "100%",
  backgroundColor: "#f15858",
  display: "block",
});

const ActiveCircle = styled(RedCircle, {
  backgroundColor: "Green",
  marginLeft: "5px",
});
const DeactiveCircle = styled(RedCircle, {
  marginLeft: "5px",
  backgroundColor: "#d93a3a",
});

const MobileVisibility = styled("div", {
  "@bp1": {
    display: "block",
  },
  "@bp3": {
    display: "none",
  },
});

const ChatWindowDiv = styled("div", {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.colors.darkBlue,
  // borderLeft: "1px solid #ddd",
  boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
  "@bp1": {
    flex: "auto",
    borderLeft: "none",
    position: "fixed",
    height: "97%",
    width: "92%",
    marginTop: "9px",
  },
});

const ChatWindowHeader = styled("div", {
  padding: 20,
  color: "#ffffff",
  borderBottom: "1px solid white",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  // position: "relative",
  h2: {
    margin: 0,
    fontSize: 18,
    fontWeight: 600,
  },
  "@bp1": {
    position: "sticky",
    bottom: 0,
    h2: {
      fontSize: 15,
    },
  },
});

const ChatWindowMessages = styled("div", {
  flex: 1,
  padding: 20,
  overflowY: "auto",
  backgroundColor: theme.colors.darkBlue,
  alignItems: "flex-start",
  display: "flex",
  flexDirection: "column",
});

const ChatWindowInput = styled("div", {
  padding: 15,
  display: "flex",
  alignItems: "center",
  borderTop: "1px solid #ddd",
  backgroundColor: theme.colors.darkBlue,
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    border: "1px solid #ddd",
    marginRight: 10,
    fontSize: 14,
    outline: "none",
    "@bp1": {
      borderRadius: 4,
      marginRight: 0,
      flex: "none",
      width: "60%",
      backgroundColor: theme.colors.darkBlue,
      color: "white",
      border: "none",
    },
  },
  button: {
    // marginLeft: 10,
    border: "none",
    backgroundColor: "white",
    color: "rgb(4 43 73)",
    padding: "10px 15px",
    borderRadius: 20,
    cursor: "pointer",
    fontSize: 14,
    transition: "background-color 0.3s",
    "@bp1": {
      marginLeft: 0,
      borderRadius: 4,
      fontWeight: 600,
      color: "rgb(15, 87, 131)",
    },
  },
  "@bp1": {
    padding: "15px 0px",
    justifyContent: "space-evenly",
  },
});

const SenderAndReceiver = styled("div", {
  backgroundColor: "rgb(12 53 79)",
  maxWidth: "70%",
  textAlign: "start",
  bordeRadius: 15,
  // padding: "6px 19px",
  padding: "6px 10px",
  color: "white",
  display: "flex",
  alignItems: "center",
  margin: "1px 0px",
  fontWeight: 600,
  wordBreak: "break-word",
  display: "flex",
  flexDirection: "column",
  "@bp1": {
    fontSize: 14,
  },
});
const SenderAndReceiverValidityDiv = styled(SenderAndReceiver, {
  marginTop: "0px",
  height: "20px",
  padding: "0px 10px",
  marginBottom: "4px",
  backgroundColor: "transparent",
});

const Preview = {
  maxWidth: 500,
  maxHeight: 500,
  objectFit: "cover",
  "@bp1": {
    maxWidth: 200,
    maxHeight: 200,
  },
};
const PreviewImage = styled("img", {
  ...Preview,
});
const PreviewVideo = styled(ReactPlayer, {
  ...Preview,
});
const PreviewAudio = styled("audio", {
  ...Preview,
});
