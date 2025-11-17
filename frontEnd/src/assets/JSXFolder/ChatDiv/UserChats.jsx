import { Link } from 'react-scroll'
import React, { useEffect, useState, useRef } from "react";
import NavbarChat from './Navbar/NavbarChat';
import ChatBox from './ChatBox/ChatBox';
import '../../CSSFolder/userChats.css'
import { connectWebSocket, getStompClient, disconnectWebSocket , events} from "../../JSFolder/websocket"

function UserChats({ userDetails, receiverDetails }) {
    const [userStatus, setUserStatus] = useState("");
    const [userStatusForMsg, setUserStatusForMsg] = useState(null);

    // useEffect(() => {
    //     const client = getStompClient();
    //     if (!client) return;

    //     client.onConnect = () => {
    //         client.subscribe("/topic/status", (status) => {
    //             const update = JSON.parse(status.body);
    //             setUserStatus(prev => ({
    //                 ...prev,
    //                 [update.username]: {
    //                     online: update.online,
    //                     lastSeen: update.lastSeen
    //                 }
    //             }));
    //         });
    //     };
    //     client.activate();

    //     // return () => {
    //     //     if (client) client.unsubscribe();
    //     // };
    // }, []);

    // useEffect(() => {
    //     const clientWs = getStompClient();
    //     if (!clientWs) return;

    //     const subscription = clientWs.subscribe("/topic/status", (status) => {
    //         const update = JSON.parse(status.body);
    //         setUserStatus(prev => ({
    //             ...prev,
    //             [update.username]: {
    //                 online: update.online,
    //                 lastSeen: update.lastSeen
    //             }
    //         }));
    //     });
    //     return () => subscription.unsubscribe();
    // }, []);


    // useEffect(() => {
    //     const client = getStompClient();
    //     if (!client || !client.connected) return;

    //     const sub = client.subscribe("/topic/status", (s) => {
    //         const update = JSON.parse(s.body);
    //         setUserStatus(prev => ({
    //             ...prev,
    //             [update.username]: {
    //                 online: update.online,
    //                 lastSeen: update.lastSeen
    //             }
    //         }));
    //     });

    //     return () => sub.unsubscribe();
    // }, [userDetails]);

    useEffect(() => {
        const handler = (update) => {
            setUserStatus(prev => ({
                ...prev,
                [update.username]: {
                    online: update.online,
                    lastSeen: update.lastSeen
                }
            }));
        };

        events.on("status", handler);
        return () => events.off("status", handler);
    }, []);



    return (
        <div className="chatsDiv">
            <NavbarChat receiverDetails={receiverDetails} userStatus={userStatus} setUserStatusForMsg={setUserStatusForMsg}/>
            <ChatBox userDetails={userDetails} receiverDetails={receiverDetails} userStatusForMsg={userStatusForMsg}/>
        </div>
    );
}

export default UserChats;