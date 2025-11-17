import { Link } from 'react-scroll'
import '../../../CSSFolder/slider.css'

function Slider({ setInviteDiv, inviteDiv, setSearchDiv, searchDiv }) {



    const handleInvite = () => {
            setSearchDiv("main");
            setInviteDiv(false);
    };

        const handleChat = () => {
            setSearchDiv("search");
            setInviteDiv(true);
    };




    return (
        <div className='sliderdiv'>
            <div className="slider">
                <div onClick={handleChat} className={searchDiv == "search"? "allChats silderSelect select" : "allChats silderSelect"}>All Chats</div>
                <div className="groups silderSelect">Groups</div>
                <div onClick={handleInvite} className={searchDiv != "search"? "invite silderSelect select" : "invite silderSelect"}>Invites</div>
            </div>
        </div>
    );
}

export default Slider;