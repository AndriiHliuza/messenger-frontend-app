import { React } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatPages.css";
import { USER_ROUTE } from "../../../config";
import { useAppContext } from "../../../App";

export default function ViewChatsActionsArea() {
    
    const navigate = useNavigate();
    const { user } = useAppContext();

    const onCreateChatButtonClick = () => {
        let userProfileRoute = USER_ROUTE;
        const uniqueName = user.uniqueName;
        navigate(userProfileRoute + "/" + uniqueName + "/chats/creation-panel");
    }

    return (
        <div className="view-chats-actions-area">
            <div className="view-chats-actions-panel">
                <div className="create-chat-button" onClick={onCreateChatButtonClick}>CREATE CHAT</div>
            </div>
        </div>
    );
}