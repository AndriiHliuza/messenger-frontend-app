import { React } from "react";
import { useNavigate } from 'react-router-dom';
import "./SubsPages.css";
import { USER_ROUTE } from "../../../config";

export default function SubsPagesUserItem(props) {

    const { user } = props;
    const navigate = useNavigate();

    const onUserItemClick = () => {
        navigate(USER_ROUTE + "/" + user?.uniqueName)
    }

    return (
        <div
            onClick={onUserItemClick}
            className="subs-page-user-item-container"
        >
            <div className="subs-page-user-item">
                <div><strong>Username:</strong> {user?.uniqueName ? user.uniqueName : "Unknown"}</div>
                <div><strong>Firstname:</strong> {user?.firstname ? user.firstname : "Unknown"}</div>
                <div><strong>Lastname:</strong> {user?.lastname ? user.lastname : "UnKnown"}</div>
            </div>
        </div>
    );
}