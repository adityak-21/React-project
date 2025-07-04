import React, { useEffect } from "react";
import Pusher from "pusher-js";

export const PusherListener = () => {
  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("chat");
    channel.bind("message.sent", function (data) {
      alert("Received: " + data.message);
      console.log("Received message:", data.message);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);
  return null;
};

export const PusherListenerPrivate = ({ userId }) => {
  console.log("PusherListenerPrivate initialized with userId:", userId);
  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: "ap2",
    });

    const channel = pusher.subscribe(`chat.${userId}`);
    channel.bind("message.sent", function (data) {
      alert("Received: " + data.message);
      console.log("Received message:", data.message);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);
  return null;
};
