import { Link } from 'react-scroll';
import axios from "axios";
import '../../../CSSFolder/searchDiv.css';
import React, { useState, useEffect } from "react";


function SearchInput({setResults, userDetails, friendsList}) {
    const [keyword, setKeyword] = useState("");


    useEffect(() => {
        if (keyword.trim() === "") {
            setResults([]);
            return;
        }

        const presentUser = userDetails.username;

        const fetchUsers = async () => {
            try {
                const res = await axios.post(`https://chatapplication-f34s.onrender.com/api/user/search`,friendsList, {
                    params: { keyword, presentUser
                    }
                });
                setResults(res.data);
                // console.log(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchUsers();
    }, [keyword]);
    return (
        <div className="searchInput">
            <input type="text" name="" id="" placeholder="Search users..." value={keyword}
                onChange={e => setKeyword(e.target.value)} />
        </div>

    )

};

export default SearchInput;
