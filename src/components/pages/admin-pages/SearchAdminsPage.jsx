import { React, useState, useEffect } from "react";
import "../user-pages/UserPages.css";
import UserSearchItem from "../user-pages/UserSearchItem";
import "../../search/Search.css";
import { findAdminsByUniqueNameStartingWith } from "../../../axios/AdminAPI";
import { Role } from "../../../utils/Role";


export default function SearchAdminsPage() {

    const [adminsToShow, setAdminsToShow] = useState([]);
    const [adminsUniqueNamePrefix, setAdminsUniqueNamePrefix] = useState("");

    useEffect(() => {
        async function findAdminsByUniqueNameStartingWithPrefix() {
            if (adminsUniqueNamePrefix) {
                let response = await findAdminsByUniqueNameStartingWith(adminsUniqueNamePrefix);
                let users = response?.data;
                if (users) {
                    setAdminsToShow(users.slice(0, 5));
                }
            } else {
                setAdminsToShow([]);
            }
        }
        findAdminsByUniqueNameStartingWithPrefix();
    }, [adminsUniqueNamePrefix]);

    return (
        <div className="search-user-page-container">
            <div className="search-user-page">
                <div className="search-container">
                    <h2>FIND ADMIN</h2>
                    <input
                        className="search-field"
                        type="text"
                        placeholder="Search..."
                        value={adminsUniqueNamePrefix}
                        onChange={(e) => setAdminsUniqueNamePrefix(e.target.value)}
                    />
                    <div className="filtered-user-items-container">
                        {
                            adminsToShow.map((adminToShow) => <UserSearchItem
                                key={adminToShow.username}
                                userToShow={adminToShow}
                                role={Role.ADMIN}
                            />)
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}