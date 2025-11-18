import { Link } from 'react-scroll'
import '../../../CSSFolder/navbarForContact.css'

function NavBar({ setUser, setSearchDiv, searchDiv , inviteDiv, setInviteDiv, userDetails}) {
    const handleLogout = () => {
        setUser(null);
        navigate("/login");
    };

    const handleSearch = () => {
        if(searchDiv == "main"){
            setSearchDiv("search");
            setInviteDiv(false);
        }else{
            setSearchDiv("main");
            setInviteDiv(true);
        }
    };
    return (
        <nav>
            <div className="greet">
                <div className="hello">Hello,</div>
                <div className="userName">{userDetails.firstName}</div>
            </div>
            <div className="search" onClick={handleSearch}>
                <img src="Image/icons8-search-32.png" alt="" />
            </div>
            <div className="menu" onClick={handleLogout}>
                <img src="Image/icons8-menu-vertical-32.png" alt="" />
            </div>
        </nav>
    );
}

export default NavBar;