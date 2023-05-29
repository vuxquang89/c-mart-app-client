import React, { useState, useEffect } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { useEffectOnce } from "usehooks-ts";

var stompClient = null;
const Chat = () => {
  const [privateChats, setPrivateChats] = useState(new Map());
  const [publicChats, setPublicChats] = useState([]);
  const [tab, setTab] = useState("C-Mart");
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    username: localStorage.getItem("username"),
    receivername: tab,
    connected: false,
    message: "",
  });

  /*
  useEffectOnce(() => {
    // code here
    if (userData.connected) {
      console.log("run code load message");
      loadMessage();
    }
  });
*/
  const connect = () => {
    const access_token = localStorage.getItem("accessToken");

    const Sock = new SockJS("http://localhost:8080/chat");
    /*
    const Sock = new SockJS("http://localhost:8080/chat", {
      headers: { Authorization: "Bearer asdasd" },
    });
    */
    /*
    const Sock = new SockJS("http://localhost:8080/chat", {
      transportOptions: {
        "xhr-streaming": {
          headers: {
            Authorization: `Bearer sdsdf`,
          },
        },
      },
    });
    */
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    let user_name = localStorage.getItem("username");

    setUserData({ ...userData, connected: true });

    stompClient.subscribe(
      "/user/" + userData.username + "/private",
      onPrivateMessage
    );
    userJoin();
    loadMessage();
  };

  const userJoin = () => {
    var chatMessage = {
      senderName: userData.username,
      status: "JOIN",
    };
    stompClient.send("/app/message", {}, JSON.stringify(chatMessage));

    privateChats.set(tab, []);
    setPrivateChats(new Map(privateChats));
  };

  const onPrivateMessage = (payload) => {
    console.log(payload);
    var payloadData = JSON.parse(payload.body);
    if (privateChats.get(payloadData.senderName)) {
      privateChats.get(payloadData.senderName).push(payloadData);
      setPrivateChats(new Map(privateChats));
    } else {
      let list = [];
      list.push(payloadData);
      privateChats.set(payloadData.senderName, list);
      setPrivateChats(new Map(privateChats));
    }
  };

  const onError = (err) => {
    console.log(err);
  };

  const loadMessage = () => {
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "Bearer " + localStorage.getItem("accessToken")
    );
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "*");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("http://localhost:8080/messages/customer", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.status);
      })
      .then((result) => {
        var payloadData = result.body;

        payloadData.map((el) => {
          console.log("get message", el);
          publicChats.push(el);
          setPublicChats([...publicChats]);
        });
        console.log(privateChats);
      })
      .finally(() => {
        setIsLoading(false);
      })
      .catch((error) => console.log("error", error));
  };

  const sendPrivateValue = () => {
    if (stompClient) {
      var chatMessage = {
        senderName: userData.username,
        receiverName: tab,
        message: userData.message,
        status: "MESSAGE",
      };

      if (userData.username !== tab) {
        privateChats.get(tab).push(chatMessage);
        setPrivateChats(new Map(privateChats));
      }
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: "" });
    }
  };

  const handleMessage = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, message: value });
  };

  return (
    <div className="container">
      {userData.connected ? (
        <div className="chat-box">
          <div className="member-list">
            <ul>
              <li className="member active">C-Mart</li>
            </ul>
          </div>

          <div className="chat-content">
            <ul className="chat-messages">
              {publicChats.map((chat, index) => (
                <li
                  className={`message ${
                    chat.senderName === userData.username && "self"
                  }`}
                  key={index}
                >
                  {chat.senderName !== userData.username && (
                    <div className="avatar">{chat.senderName}</div>
                  )}
                  <div className="message-data">{chat.message}</div>
                  {chat.senderName === userData.username && (
                    <div className="avatar self">{chat.senderName}</div>
                  )}
                </li>
              ))}

              {[...privateChats.get(tab)].map((chat, index) => (
                <li
                  className={`message ${
                    chat.senderName === userData.username && "self"
                  }`}
                  key={index}
                >
                  {chat.senderName !== userData.username && (
                    <div className="avatar">{chat.senderName}</div>
                  )}
                  <div className="message-data">{chat.message}</div>
                  {chat.senderName === userData.username && (
                    <div className="avatar self">{chat.senderName}</div>
                  )}
                </li>
              ))}
            </ul>

            <div className="send-message">
              <input
                type="text"
                className="input-message"
                placeholder="enter the message"
                value={userData.message}
                onChange={handleMessage}
              />
              <button
                type="button"
                className="send-button"
                onClick={sendPrivateValue}
              >
                send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="register">
          <button type="button" onClick={connect}>
            connect
          </button>
        </div>
      )}
    </div>
  );
};
export default Chat;
