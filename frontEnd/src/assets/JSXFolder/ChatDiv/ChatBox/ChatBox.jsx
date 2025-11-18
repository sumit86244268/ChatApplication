import { Link } from 'react-scroll'
import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import '../../../CSSFolder/chatbox.css'
import '../../../CSSFolder/message.css'
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { connectWebSocket, getStompClient, disconnectWebSocket, events, sendMsg, sendTyping } from "../../../JSFolder/websocket"
import {apiUrl} from "../../../JSFolder/ApiLink";


function ChatBox({ userDetails, receiverDetails, userStatusForMsg }) {
    const textareaRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const [msgStatus, setMsgStatus] = useState(false);
    const [typingUser, setTypingUser] = useState("");
    const typingTimeoutRef = useRef(null);
    const defaultPic = "Image\\defaultPro.jpeg";
    const boxRef = useRef();
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const istTime = dayjs().tz("Asia/Kolkata").format("YYYY-MM-DDTHH:mm:ss");

    useEffect(() => {
        const box = boxRef.current;
        if (!box) return;

        requestAnimationFrame(() => {
            box.scrollTo({
                top: box.scrollHeight,
                behavior: "smooth",
            });
        });
    }, [messages]);


    // useEffect(() => {
    //     const box = boxRef.current;
    //     if (box) {
    //         box.scrollTop = box.scrollHeight;
    //     }
    // }, []);

    // useEffect(() => {
    //     const clientWs = getStompClient();
    //     if (!clientWs) return;

    //     clientWs.onConnect = () => {
    //         clientWs.subscribe("/user/queue/messages", (msg) => {
    //             setMessages(prev => [...prev, JSON.parse(msg.body)]);
    //         });
    //     };

    //     clientWs.activate();
    //     setClient(clientWs);
    //     // return () => {
    //     //     if (clientWs) clientWs.unsubscribe();
    //     // };
    // }, [userDetails.username, receiverDetails]);

    // useEffect(() => {
    //     const clientWs = getStompClient();
    //     if (!clientWs) return;

    //     const subscription = clientWs.subscribe("/user/queue/messages", (msg) => {
    //         setMessages(prev => [...prev, JSON.parse(msg.body)]);
    //     });

    //     setClient(clientWs);
    //     return () => subscription.unsubscribe();
    // }, [userDetails, receiverDetails]);

    // useEffect(() => {
    //     connectWebSocket(
    //         userDetails.username,
    //         (message) => {
    //             setMessages(prev => [...prev, message]);
    //         },
    //         null
    //     );
    //     const clientWs = getStompClient();
    //     setClient(clientWs);
    //     // return () => disconnectWebSocket();
    // }, [userDetails, receiverDetails]);

    // useEffect(() => {
    //     const clientWs = getStompClient();
    //     if (!clientWs || !clientWs.connected) return;

    //     const sub = clientWs.subscribe(`/user/queue/messages`, (msg) => {
    //         setMessages(prev => [...prev, JSON.parse(msg.body)]);
    //     });
    //     setClient(clientWs);
    //     return () => sub.unsubscribe();
    // }, [receiverDetails]);


    useEffect(() => {
        const handler = (msg) => {
            setMessages(prev => [...prev, msg]);
        };

        events.on("message", handler);
        return () => events.off("message", handler);
    }, []);


    // const sendMessage = () => {
    //     if (!getStompClient || !input.trim()) return;

    //     const chatMessage = {
    //         sender: userDetails.username,
    //         receiver: receiverDetails.senderUsername,
    //         content: input,
    //         timestamp: istTime
    //     };

    //     getStompClient.publish({
    //         destination: "/app/send",
    //         body: JSON.stringify(chatMessage),
    //     });

    //     setMessages((prev) => [...prev, chatMessage]);
    //     setInput("");
    // };

    const sendMessage = () => {
        if (!input.trim()) return;
        const chatMessage = {
            sender: userDetails.username,
            receiver: receiverDetails.senderUsername,
            content: input,
            timestamp: istTime,
            messageStatus: userStatusForMsg
        };

        sendMsg(chatMessage);  // ✅ send here

        setMessages(prev => [...prev, chatMessage]);
        setInput("");
    };

    useEffect(() => {
        if (!receiverDetails) return;
        axios.get(`${apiUrl}/api/chat/${userDetails.username}/${receiverDetails.senderUsername}`)
            .then(res => setMessages(res.data))
            .catch(err => console.error("Chat history error", err));
    }, [userDetails.username, receiverDetails]);

    const handleInputChange = (e) => {
        setInput(e.target.value)
        sendTyping(userDetails.username, receiverDetails.senderUsername);
    };

    useEffect(() => {

        if (receiverDetails.senderUsername !== typingUser) {
            setTyping(false);
        }

        const handleTyping = (data) => {
            if (data.from !== receiverDetails.senderUsername) return;
            setTypingUser(data.from);
            setTyping(true);

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = setTimeout(() => {
                setTyping(false);
            }, 7000);
        };

        events.on("typing", handleTyping);
        return () => {
            events.off("typing", handleTyping);

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [receiverDetails]);
    // const resizeTextarea = () => {
    //     const textarea = textareaRef.current;
    //     textarea.style.height = "auto";
    //     textarea.style.height = textarea.scrollHeight + "px";
    // };

    // const handleInput = () => {
    //     const textarea = textareaRef.current;
    //     textarea.style.height = 'auto';
    //     textarea.style.height = textarea.scrollHeight + "px";
    // }
    return (
        receiverDetails == "" ? "" : (
            <div className="mainChatBox">
                <div className="messageBox" ref={boxRef}>
                    {messages.length > 0 &&
                        messages.map((msg, index) => (

                            <div key={msg.id || msg.timestamp || index} className={userDetails.username == msg.sender ? "message messageRight" : "message messageLeft"} >
                                <div className="messageBorder">
                                    <div className={userDetails.username == msg.sender ? "messageDec right" : "messageDec left"}>
                                        <div className="messageText">{msg.content}</div>
                                        <div className="messageTimeAndStaus">
                                            <div className="timeDetails">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className={userDetails.username == msg.sender ? "StatusImg" : "StatusImg leftStatus"}>
                                                <img src={msg.messageStatus ? "Image/icons8-eye-16.png" : "Image/icons8-closed-eye-16.png"} alt="" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="messageInputbox">

                    <div className="inputDiv">
                        <div className={typing ? "typingClass typingActive" : "typingClass"}>
                        </div>
                        {/* <input type="text" name="" id="" placeholder='Message'/> */}
                        <textarea name="" id="" className='messageInput' ref={textareaRef} onChange={(e) => handleInputChange(e)} placeholder='Message' value={input}></textarea>
                    </div>
                    <div className="enterMessageBtn" onClick={sendMessage}>
                        <img src="Image/sendIcon.png" alt="" />
                    </div>
                </div>
            </div>
        )
    );
}

export default ChatBox;