import React, { useEffect, useState } from "react";
import { Link } from 'react-scroll';
import '../../../CSSFolder/navbarForChat.css';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { events } from "../../../JSFolder/websocket"


function NavbarChat({ receiverDetails, userStatus, setUserStatusForMsg }) {
    const defaultPic = "Image\\defaultPro.jpeg";
    const [lastSeen, setLastSeen] = useState("");
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const istTime = dayjs().tz("Asia/Kolkata").format("YYYY-MM-DDTHH:mm:ss");

    useEffect(() => {
        const usernameStatus = receiverDetails.senderUsername;
        const status = userStatus[usernameStatus];

        if (status?.online === undefined && receiverDetails.senderisOnline) {
            setLastSeen("Online");
            setUserStatusForMsg(true);
        } else if (status?.online) {
            setLastSeen("Online");
            setUserStatusForMsg(true);
        }
        else {
            setUserStatusForMsg(false);

            const lastSeenTime = status?.lastSeen || receiverDetails.senderLastSeen;
            if (!lastSeenTime) return;

            const date1 = new Date(lastSeenTime);
            const date2 = new Date(istTime);
            const diffMs = Math.abs(date2 - date1);
            const diffMins = Math.floor(diffMs / (1000 * 60));
            const diffhours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const diffWeeks = Math.floor(diffDay / 7);
            if (diffWeeks > 4) {
                setLastSeen("Last Seen at " + new Date(lastSeenTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: '2-digit', year: '2-digit' }));
            }
            else if (diffWeeks > 1) {
                setLastSeen("Last seen " + diffWeeks + " weeks ago!")
            }
            else if (diffDay == 7) {
                setLastSeen("Last seen week ago")
            }
            else if (diffDay > 1) {
                setLastSeen("Last seen " + diffDay + " days ago!")
            }
            else if (diffDay == 1) {
                setLastSeen("Last seen yesterday!")
            }
            else if (diffhours > 0) {
                setLastSeen("Last seen " + diffhours + " hours ago!")
            }
            else if (diffMins > 0) {
                setLastSeen("Last seen " + diffMins + " minutes ago!")
            }
            else if (diffMins < 1) {
                setLastSeen("Last seen just now")
            }
            else if (diffMs > 1) {
                setLastSeen("Offline, just a Seconds!")
            }
            else {
                setLastSeen("Good Day")
            }
        }
        // if (status?.online || receiverDetails.senderisOnline) {

        // }
    }, [userStatus, receiverDetails]);


    return (
        receiverDetails == "" ? "" : (
            <div className="chatsHeader">
                <div className="Navleft">
                    <div className="profilePicForChatBox">
                        <img src={receiverDetails.senderProfilePic == null ? defaultPic : receiverDetails.senderProfilePic} alt="" />
                    </div>
                    <div className="userDetailsForChatBox">
                        <div className="userNameAndStatus">
                            <div className="userNameForChatBox">{receiverDetails.senderFirstName} {receiverDetails.senderLastName}</div>
                            <div className="loginStatus">{lastSeen}</div>
                        </div>
                    </div>
                </div>
                <div className="menuForChat">
                    <img src="Image/icons8-menu-vertical-32.png" alt="" />
                </div>
            </div>
        )

    );
}

export default NavbarChat;
