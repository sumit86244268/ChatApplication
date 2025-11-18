import { Link } from 'react-scroll'
import { useState } from 'react'
import UserContact from './ContactDiv/UserContact';
import UserChats from './ChatDiv/UserChats';
import '../CSSFolder/appRender.css'

function AppRender({ user, setUser, userDetails }) {
    const [receiverDetails, setReceiverDetails] = useState("");
    return (
        <>
            <UserContact user={user} setUser={setUser} userDetails={userDetails} setReceiverDetails={setReceiverDetails}/>
            <UserChats userDetails={userDetails} receiverDetails={receiverDetails}/>
        </>

    );
}

export default AppRender;