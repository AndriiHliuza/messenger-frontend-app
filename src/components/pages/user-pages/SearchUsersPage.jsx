import { React, useState, useEffect } from "react";
import "./UserPages.css";
import UserSearchItem from "./UserSearchItem";
import "../../search/Search.css";
import { findUsersByUniqueNameStartingWith } from "../../../axios/UserAPI";
import { Role } from "../../../utils/Role";


export default function SearchUsersPage() {

    const [usersToShow, setUsersToShow] = useState([]);
    const [usersUniqueNamePrefix, setUsersUniqueNamePrefix] = useState("");

    useEffect(() => {
        async function findUsersByUniqueNameStartingWithPrefix() {
            if (usersUniqueNamePrefix) {
                let response = await findUsersByUniqueNameStartingWith(usersUniqueNamePrefix);
                let users = response?.data;
                if (users) {
                    setUsersToShow(users.slice(0, 5));
                }
            } else {
                setUsersToShow([]);
            }
        }
        findUsersByUniqueNameStartingWithPrefix();
    }, [usersUniqueNamePrefix]);

    return (
        <div className="search-user-page-container">
            <div className="search-user-page">
                <div className="search-container">
                    <h2>FIND USER</h2>
                    <input
                        className="search-field"
                        type="text"
                        placeholder="Search..."
                        value={usersUniqueNamePrefix}
                        onChange={(e) => setUsersUniqueNamePrefix(e.target.value)}
                    />
                    <div className="filtered-user-items-container">
                        {
                            usersToShow.map((userToShow) => <UserSearchItem
                                key={userToShow.username}
                                userToShow={userToShow}
                                role={Role.USER}
                            />)
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}