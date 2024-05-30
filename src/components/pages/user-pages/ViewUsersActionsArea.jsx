import { React } from "react";
import { useNavigate } from "react-router-dom";
import "./UserPages.css";
import { USER_ROUTE } from "../../../config";

export default function ViewUsersActionsArea() {

    const navigate = useNavigate();

    const onSearchUserButtonClick = () => {
        navigate(USER_ROUTE + "/search");
    }

    return (
        <div className="view-users-actions-area">
            <div className="view-users-actions-panel">
                <div className="users-actions-area-button" onClick={onSearchUserButtonClick}>SEARCH USER</div>
            </div>
        </div>
    );
}