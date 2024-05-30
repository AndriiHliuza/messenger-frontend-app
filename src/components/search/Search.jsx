import { React, useEffect, useState } from "react";
import { findUsersByUniqueNameStartingWith } from "../../axios/UserAPI";
import "./Search.css";
import FilteredUserItem from "./FilteredUserItem";
import { Role } from "../../utils/Role";

export default function Search(props) {

    const { chosenUsers, setChosenUsers } = props;
    const [usersToShow, setUsersToShow] = useState([]);
    const [usersUniqueNamePrefix, setUsersUniqueNamePrefix] = useState("");

    useEffect(() => {
        async function findUsersByUniqueNameStartingWithPrefix() {
            if (usersUniqueNamePrefix) {
                let response = await findUsersByUniqueNameStartingWith(usersUniqueNamePrefix);
                let users = response?.data;
                if (users) {
                    setUsersToShow(users);
                }
            } else {
                setUsersToShow([]);
            }
        }
        findUsersByUniqueNameStartingWithPrefix();
    }, [usersUniqueNamePrefix]);

    return (
        <div className="search-container">
            <h2>ADD USER</h2>
            <input
                className="search-field"
                type="text"
                placeholder="Search..."
                value={usersUniqueNamePrefix}
                onChange={(e) => setUsersUniqueNamePrefix(e.target.value)}
            />
            <div className="filtered-user-items-container">
                {
                    usersToShow.map((userToShow) => <FilteredUserItem
                        key={userToShow.username}
                        userToShow={userToShow}
                        chosenUsers={chosenUsers}
                        setChosenUsers={setChosenUsers}
                    />)
                }
            </div>
        </div>
    );
}