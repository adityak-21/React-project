import React, { useState } from "react";
import axios from "axios";
import { messageNotifications } from "../api/NotificationsApi";
import { messagePrivateNotifications } from "../api/NotificationsApi";
import "../style/SendMessages.css";
import { Tooltip } from "../common/Tooltip";

const SendMessage = () => {
  const [message, setMessage] = useState("");
  const [privateMessage, setPrivateMessage] = useState("");
  const [privateUser, setPrivateUser] = useState(null);
  const handleSend = () => {
    messageNotifications({ message })
      .then((response) => {
        console.log("Message sent successfully:", response.data);
        // alert("Message sent successfully!");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        alert(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong. Please try again!"
        );
      });
    setMessage("");
  };

  const handlePrivateSend = () => {
    console.log("Private User:", privateUser);
    console.log("Private Message:", privateMessage);
    messagePrivateNotifications({
      user_id: privateUser,
      message: privateMessage,
    })
      .then((response) => {
        console.log("Message sent successfully:", response.data);
        // alert("Message sent successfully!");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        alert(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong. Please try again!"
        );
      });
    setPrivateMessage("");
    setPrivateUser("");
  };

  return (
    <div className="send-message-container">
      <Tooltip text="Send a message to all users">
        <input
          className="send-message-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
        />
      </Tooltip>
      <button className="send-message-button" onClick={handleSend}>
        Send
      </button>

      <Tooltip text="Send a message to private users">
        <input
          className="send-message-input"
          value={privateMessage}
          onChange={(e) => setPrivateMessage(e.target.value)}
          placeholder="Type your private message"
        />
        <input
          className="send-message-input"
          value={privateUser}
          onChange={(e) => setPrivateUser(e.target.value)}
          placeholder="Type the userId of the user"
        />
      </Tooltip>
      <button className="send-message-button" onClick={handlePrivateSend}>
        Send
      </button>
    </div>
  );
};

export default SendMessage;
