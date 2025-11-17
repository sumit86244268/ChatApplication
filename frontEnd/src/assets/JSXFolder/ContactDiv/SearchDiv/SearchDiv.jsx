import { Link } from 'react-scroll'
import axios from "axios";
import React, { useState, useEffect } from "react";
import '../../../CSSFolder/contactBox.css'
import '../../../CSSFolder/searchDiv.css'


function SearchDiv({ user, results, userDetails, inviteDiv }) {
    const safeResults = results || [];
    const defaultPic = "Image\\defaultPro.jpeg";
    const [sender, setSender] = useState("");
    // const [receiver, setReceiver] = useState("");
    const [inviteResults, setInviteResults] = useState([]);

    const data01 = (receiverValue) => {
        // setReceiver(receiverValue);
        handleSend(receiverValue);
    }

    const handleSend = async (receiverValue) => {
        try {
            const res = await sendInvite(userDetails.username, receiverValue);
            console.log("Invite sent:", res.data);
        } catch (err) {
            console.error("Error sending invite:", err);
        }
    };

    useEffect(() => {
        if (!inviteDiv) {
            fetchUsersInvites();
        }
    }, [inviteDiv]);

    const fetchUsersInvites = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/invites/received/${userDetails.username}`);
            setInviteResults(res.data);
            console.log(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const sendInvite = async (senderUsername, receiverUsername) => {
        const res = await axios.post('http://localhost:8080/api/invites/send' + `?senderUsername=` + senderUsername + `&receiverUsername=` + receiverUsername);
        console.log(res.data);
    };


    const statusSet = async (inviteId, receiverDt) => {
        try {
            const res = await axios.post(
                `http://localhost:8080/api/invites/respond`,
                null,
                { params: { inviteId, status: "ACCEPTED", receiverDt} }
            );
            console.log(res.data);
            // Refresh list after accepting
            fetchUsersInvites();
        } catch (err) {
            console.error("Error responding to invite:", err);
        }
    };

    return (

        <div className="contactBox">
            {!inviteDiv ? (
                <>
                    {inviteResults.length > 0 &&
                        inviteResults.map(inviteRS => (
                            <div className="contact" key={inviteRS.inviteId}>
                                <div className="profilePicForContactBox">
                                    <img src={inviteRS.senderProfilePic == null ? defaultPic : inviteRS.senderProfilePic} alt="" />
                                </div>
                                <div className="userDetailsForContactBox width">
                                    <div className="contactNameAndTime">
                                        <div className="userNameForContactBox width">{inviteRS.senderUsername}</div>
                                    </div>
                                    <div className="UserFullName width">{inviteRS.senderFirstName} {inviteRS.senderLastName}</div>
                                </div>
                                <div className="inviteBtn" onClick={() => statusSet(inviteRS.inviteId, inviteRS.senderUsername)}>
                                    ✔
                                </div>
                            </div>
                        ))
                    }
                </>
            ) : (
                <>
                    {safeResults.length > 0 &&
                        safeResults.map(user => (
                            <div className="contact" key={user.id}>
                                <div className="profilePicForContactBox">
                                    <img src={user.profilePic == null ? defaultPic : user.profilePic} alt="" />
                                </div>
                                <div className="userDetailsForContactBox width">
                                    <div className="contactNameAndTime">
                                        <div className="userNameForContactBox width">{user.username}</div>
                                    </div>
                                    <div className="UserFullName width">{user.firstName} {user.lastName}</div>
                                </div>
                                <div className="inviteBtn" onClick={() => data01(user.username)}>
                                    +
                                </div>
                            </div>
                        ))
                    }
                </>
            )}

        </div>
    );
}

export default SearchDiv;