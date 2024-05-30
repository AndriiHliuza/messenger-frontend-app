import { React } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPages.css";
import { ADMIN_ROUTE } from "../../../config";

export default function ViewAdminsActionsArea() {

    const navigate = useNavigate();

    const onCreateAdminButtonClick = () => {
        navigate(ADMIN_ROUTE + "/creation-panel");
    }

    const onSearchAdminButtonClick = () => {
        navigate(ADMIN_ROUTE + "/search");
    }

    return (
        <div className="view-admins-actions-area">
            <div className="view-admins-actions-panel">
                <div className="admin-actions-area-button create-admin-button" onClick={onCreateAdminButtonClick}>CREATE ADMIN</div>
                <div className="admin-actions-area-button search-admin-button" onClick={onSearchAdminButtonClick}>SEARCH ADMIN</div>
            </div>
        </div>
    );
}