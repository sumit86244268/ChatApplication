import { Link } from 'react-scroll'
import NavBar from './Navbar/NavBar';
import { useState } from 'react'
import ContactBox from './ContactBox/ContactBox';
import './Slider/Silder.jsx'
import '../../CSSFolder/userContact.css'
import Slider from './Slider/Silder.jsx';
import SearchDiv from './SearchDiv/SearchDiv.jsx';
import SearchInput from './SearchDiv/SearchInput.jsx';

function UserContact({ user, setUser, userDetails , setReceiverDetails}) {
    const [searchDiv, setSearchDiv] = useState("search");
    const [results, setResults] = useState();
    const [inviteDiv, setInviteDiv] = useState(false);
    const [friendsList, setFriendsList] = useState([]);



    return (
        <div className="contactDiv">
            <NavBar user={user} setUser={setUser} setSearchDiv={setSearchDiv} searchDiv={searchDiv} inviteDiv={inviteDiv} setInviteDiv={setInviteDiv} userDetails={userDetails}/>
            {searchDiv == "main" &&  inviteDiv ? <SearchInput user={user} setResults={setResults} userDetails={userDetails} friendsList={friendsList}/> : <Slider setInviteDiv={setInviteDiv} inviteDiv={inviteDiv} setSearchDiv={setSearchDiv} searchDiv={searchDiv}/>}
            {searchDiv == "main" ? <SearchDiv user={user} results={results} userDetails={userDetails} inviteDiv={inviteDiv} /> : <ContactBox userDetails={userDetails} setReceiverDetails={setReceiverDetails} setFriendsList={setFriendsList}/>}
        </div>
    );
}

export default UserContact;