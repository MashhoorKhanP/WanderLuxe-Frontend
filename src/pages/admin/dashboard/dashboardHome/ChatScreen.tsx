import { KeyboardDoubleArrowDownOutlined, Send } from "@mui/icons-material";
import { TextField } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Socket } from "socket.io-client";
import {
  addNewMessage,
  getConversations,
  getMessages,
} from "../../../../actions/chat";
import { NoChatFound } from "../../../../assets/extraImages";
import Conversation from "../../../../components/admin/chat/Conversation";
import Message from "../../../../components/admin/chatMessage/Message";
import useCheckToken from "../../../../components/hooks/useCheckToken";
import { setNewMessages } from "../../../../store/slices/adminSlices/adminSlice";
import { AppDispatch } from "../../../../store/store";
import "./chatScreen.css";

interface ChatProps {
  setSelectedLink?: React.Dispatch<React.SetStateAction<string>>;
  link?: string;
  socket?: Socket | null;
}

const ChatScreen: React.FC<ChatProps> = ({ setSelectedLink, link, socket }) => {
  const checkToken = useCheckToken();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState<any>(null);
  const [messages, setMessages] = useState<any>([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [decodedToken, setDecodedToken] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("Socket", socket?.id);
    if (socket) {
      socket.on("getMessage", (data) => {
        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now(),
        });
      });
    }
  }, [socket]);

  useEffect(() => {
    const token =
      localStorage.getItem("AdminToken") || localStorage.getItem("UserToken");
    const decodedToken: any = jwtDecode(token as string);
    setDecodedToken(decodedToken);
    setUserId(decodedToken._id);
  }, [userId]);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev: any) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    if (
      decodedToken?.role === "user" &&
      conversations.length > 0 &&
      !currentChat
    ) {
      setTimeout(() => {
        setCurrentChat(conversations[0]);
      }, 500);
    }
    dispatch(setNewMessages(messages.length));
  }, [conversations, currentChat]);

  useEffect(() => {
    const response = dispatch(getConversations(userId));
    const responseUnwrapped = response.unwrap();
    responseUnwrapped.then((thenResponse) => {
      setConversations(thenResponse.message.conv);
    });
  }, [userId]);

  useEffect(() => {
    const response = dispatch(getMessages(currentChat?._id));
    const responseUnwrapped = response.unwrap();
    responseUnwrapped.then((thenResponse) => {
      setMessages(thenResponse.message);
    });
  }, [currentChat]);

  useEffect(() => {
    if (setSelectedLink && link) {
      setSelectedLink(link);
    }
  }, [dispatch, setSelectedLink, link]);

  checkToken;
  useEffect(() => {
    const goDownButton =
      document.querySelector(".goDownButton") ||
      document.querySelector(".goDownButtonUser");
    const chatBoxTop = document.querySelector(".chatBoxTop");
    if (goDownButton && chatBoxTop) {
      goDownButton.addEventListener("click", function () {
        chatBoxTop.scrollTop = chatBoxTop.scrollHeight;
      });
    }

    return () => {
      if (goDownButton) {
        goDownButton.removeEventListener("click", () => {});
      }
    };
  }, []);

  const chatBoxTopRef = useRef<HTMLDivElement>(null);
  const goDownButtonRef = useRef<HTMLButtonElement>(null);

  const showGoDownButton = () => {
    const chatBoxTopHeight = chatBoxTopRef.current?.clientHeight;
    const goDownButton = goDownButtonRef.current;
    const viewportHeight = window.innerHeight;

    if (goDownButton) {
      const viewportHeight = window.innerHeight;
      if (chatBoxTopHeight && chatBoxTopHeight > viewportHeight / 1.5) {
        goDownButton.style.display = "block";
      } else {
        goDownButton.style.display = "none";
      }
    }
  };

  useEffect(() => {
    showGoDownButton();
    window.addEventListener("resize", showGoDownButton);

    return () => {
      window.removeEventListener("resize", showGoDownButton);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const messageData = {
      sender: userId,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member: any) => member !== messageData.sender
    );

    socket?.emit("sendMessage", {
      senderId: userId,
      receiverId: receiverId,
      text: messageData.text,
    });
    const response = dispatch(addNewMessage(messageData));
    const responseUnwrapped = response.unwrap();
    responseUnwrapped.then((thenResponse) => {
      setMessages([...messages, thenResponse.message]);
      setNewMessage("");
    });
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="messenger">
      {decodedToken?.role === "admin" && (
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <TextField
              variant="standard"
              placeholder="Search for users"
              sx={{ pb: 1 }}
              className="chatMenuInput"
            />
            {conversations.map((conversation: any) => (
              <div
                key={conversation._id}
                onClick={() => setCurrentChat(conversation)}
                className={
                  currentChat?._id === conversation._id
                    ? "activeConversation"
                    : ""
                }
              >
                <Conversation
                  conversation={conversation}
                  currentUserId={userId}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="chatBox">
        <div className="chatBoxWrapper">
          {currentChat ? (
            <>
              <div className="chatBoxTop" ref={chatBoxTopRef}>
                {messages.length > 0 ? (
                  messages.map((message: any) => (
                    <div className="" key={message.id} ref={scrollRef}>
                      <Message
                        message={message}
                        own={message.sender === userId}
                      />
                    </div>
                  ))
                ) : (
                  <div className="noMessagesContainer">
                    <img
                      src={NoChatFound}
                      alt="No messages"
                      className="noMessagesImage"
                    />
                    <div className="noMessagesText">
                      No messages yet!, Start conversation
                    </div>
                  </div>
                )}
              </div>
              <div className="chatBoxBottom">
                <textarea
                  className="chatMessageInput"
                  onChange={(e) => setNewMessage(e.target.value)}
                  value={newMessage}
                  placeholder="Your message here"
                />
                <button
                  hidden={newMessage.trim().length <= 0}
                  className="chatSubmitButton"
                  onClick={handleSubmit}
                >
                  <Send sx={{ fontSize: "20px" }} />
                </button>
                <button
                  className={
                    decodedToken?.role === "admin"
                      ? "goDownButton"
                      : "goDownButtonUser"
                  }
                  ref={goDownButtonRef}
                >
                  <KeyboardDoubleArrowDownOutlined sx={{ fontSize: "20px" }} />
                </button>
              </div>
            </>
          ) : decodedToken?.role === "admin" ? (
            <span className="noConversationText">
              Open a conversation to start a chat.
            </span>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
              }}
            >
              <span className="noConversationText">Opening chat...</span>
              <img
                className="spinnerGif"
                src={import.meta.env.VITE_LOADING_IMAGE}
                alt="Loading"
              />
            </div>
          )}
        </div>
      </div>
      {/* {decodedToken?.role === 'admin' &&
     <div className="chatOnline">
      <div className="chatOnlineWrapper">
        <ChatOnline/>
      </div>
     </div>} */}
    </div>
  );
};

export default ChatScreen;
