import { React } from "react";
import { useNavigate } from 'react-router-dom';
import "./UserSearchItem.css";
import { USER_ROUTE, ADMIN_ROUTE } from "../../../config";
import { Role } from "../../../utils/Role";


export default function UserSearchItem(props) {

    const navigate = useNavigate();
    const { userToShow, role } = props;

    const onUserSearchItemClick = () => {
        if (userToShow?.uniqueName && role) {
            switch (role) {
                case Role.USER:
                navigate(USER_ROUTE + "/" + userToShow.uniqueName);
                break;

                case Role.ADMIN:
                navigate(ADMIN_ROUTE + "/" + userToShow.uniqueName);
                break;
            }  
        }
    }

    return (
        <div onClick={onUserSearchItemClick} className="user-search-item-container">
            <div className="user-search-item">
                <div><strong>Username: </strong>{userToShow?.uniqueName}</div>
                <div><strong>First name: </strong>{userToShow?.firstname}</div>
                <div><strong>Last name: </strong>{userToShow?.lastname}</div>
            </div>
        </div>
    );
}