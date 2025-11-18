import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import mitt from "mitt";
export const events = mitt();
let stompClient = null;



export const connectWebSocket = (username) => {
    const API_URL = import.meta.env.VITE_API_URL;
    // if (stompClient && stompClient.connected) {
    //     if (onMessage) stompClient.subscribe(`/user/queue/messages`, msg =>
    //         onMessage(JSON.parse(msg.body))
    //     );

    //     if (onStatus) stompClient.subscribe(`/topic/status`, s =>
    //         onStatus(JSON.parse(s.body))
    //     );

    //     return;
    // }

    // const socket = new SockJS(`http://localhost:8080/ws-chat?username=${username}`);
    // stompClient = new Client({
    //     webSocketFactory: () => socket,
    //     reconnectDelay: 5000,
    //     // onConnect: () => {
    //     //     if (onMessage) stompClient.subscribe(`/user/queue/messages`, msg =>
    //     //         onMessage(JSON.parse(msg.body))
    //     //     );

    //     //     if (onStatus) stompClient.subscribe(`/topic/status`, s =>
    //     //         onStatus(JSON.parse(s.body))
    //     //     );
    //     // }
    // });

    // stompClient.onConnect = () => {
    //     console.log("Connected to WebSocket");

    // }
    //     stompClient.activate();


    if (stompClient) return; // prevent reconnect

    stompClient = new Client({
        webSocketFactory: () => new SockJS(`${API_URL}/ws-chat?username=${username}`),
        reconnectDelay: 5000
    });

    stompClient.onConnect = () => {
        console.log("✅ WebSocket Connected");


        stompClient.subscribe("/user/queue/messages", (msg) => {
            events.emit("message", JSON.parse(msg.body));
        });


        stompClient.subscribe("/topic/status", (s) => {
            events.emit("status", JSON.parse(s.body));
        });

        stompClient.subscribe("/user/queue/typing", (typing) => {
            events.emit("typing", JSON.parse(typing.body));
        });
    };

    stompClient.activate();

};

export const getStompClient = () => stompClient;

export function sendMsg(chatMessage) {
    if (!stompClient || !stompClient.connected) {
        console.warn("⚠ Not connected yet");
        return;
    }

    stompClient.publish({
        destination: "/app/send",
        body: JSON.stringify(chatMessage),
    });
}

export function sendTyping(senderUsername, receiverUsername) {
    if (!stompClient || !stompClient.connected) return;

    stompClient.publish({
        destination: "/app/typing",
        body: JSON.stringify({
            from: senderUsername,
            to: receiverUsername,
            typing: true
        }),
    });
}

export function sendMsgStatus(loginUsername, needStatusForUsername) {
    if (!stompClient || !stompClient.connected) return;

    stompClient.publish({
        destination: "/app/msgstatus",
        body: JSON.stringify({
            msgfrom: loginUsername,
            msgto: needStatusForUsername,
        }),
    });
}

export const disconnectWebSocket = () => {
    if (stompClient) {
        stompClient.deactivate();
        stompClient = null;
    }
};
