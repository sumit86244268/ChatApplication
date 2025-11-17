import { Link } from 'react-scroll'
import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import '../../../CSSFolder/contactBox.css'
import { events, sendMsgStatus } from "../../../JSFolder/websocket";

function ContactBox({ userDetails, setReceiverDetails, setFriendsList }) {
    const defaultPic = "Image\\defaultPro.jpeg";
    const [userResults, setUserResults] = useState([]);
    const fetchUsersDetails = async () => {
        try {
            const res = await axios.get(
                `http://localhost:8080/api/invites/userdata/${userDetails.username}`
            );
            setUserResults(res.data);
            setFriendsList(res.data);
            console.log("Contacts:", res.data);
        } catch (err) {
            console.log(err);
        }
    };


    const onClickSetMsgStatusWS = (userDataForMsg) => {
        setReceiverDetails(userDataForMsg);
        sendMsgStatus(userDetails.username, userDataForMsg.senderUsername);
    };


    useEffect(() => {
        if (userDetails.username) {
            fetchUsersDetails();
        }
    }, [userDetails]);

    return (
        <div className="contactBox">
            {userResults.length > 0 &&
                userResults.map(userDt => (
                    <div className="contact" key={userDt.inviteId} onClick={() => onClickSetMsgStatusWS(userDt)}>
                        <div className="profilePicForContactBox">
                            <img src={userDt.senderProfilePic == null ? defaultPic : userDt.senderProfilePic} alt="" />
                        </div>
                        <div className="userDetailsForContactBox">
                            <div className="contactNameAndTime">
                                <div className="userNameForContactBox">{userDt.senderUsername}</div>
                                <div className="lastChatDateAndTime"></div>
                            </div>
                            <div className="lastChat">{userDt.senderFirstName} {userDt.senderLastName}</div>
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

export default ContactBox;