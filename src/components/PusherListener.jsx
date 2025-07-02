import React, { useEffect } from "react";
import Pusher from "pusher-js";

export const PusherListener = () => {
  useEffect(() => {
    const pusher = new Pusher("8e42ff484c6fad5a055a", {
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

// export const PusherListenerPrivate = ({ userId }) => {
//   console.log("PusherListenerPrivate initialized with userId:", userId);
//   useEffect(() => {
//     const pusher = new Pusher("8e42ff484c6fad5a055a", {
//       cluster: "ap2",
//       authEndpoint: "http://localhost:8000/broadcasting/auth",
//       auth: {
//         headers: {
//           Authorization: "Bearer " + localStorage.getItem("access_token"),
//         },
//       },
//     });

//     const channel = pusher.subscribe(`private-user.${userId}`);
//     channel.bind("message.sent", function (data) {
//       alert("Received private message: " + data.message.content);
//       console.log("Received private message:", data.message.content);
//     });

//     return () => {
//       channel.unbind_all();
//       channel.unsubscribe();
//     };
//   }, []);
//   return null;
// };

export const PusherListenerPrivate = ({ userId }) => {
  console.log("PusherListenerPrivate initialized with userId:", userId);
  useEffect(() => {
    const pusher = new Pusher("8e42ff484c6fad5a055a", {
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
