import { React } from "react";
import { useNavigate } from 'react-router-dom';
import "./ChatFilteredUserItem.css"
import { addNewUserToChat } from "../../../axios/ChatAPI";
import { USER_ROUTE } from "../../../config";

export default function ChatFilteredUserItem(props) {

    const navigate = useNavigate();
    const { chat, userToShow, chatMembers } = props;

    const onChatFilteredUserItemClick = () => {
        navigate(USER_ROUTE + "/" + userToShow.uniqueName);
    }

    const onChatFilteredUserItemAddButtonClick = async () => {
        let isUserAlreadyAdded = false;
        for (let i = 0; i < chatMembers.length; i++) {
            let uniqueName = chatMembers[i]?.user?.uniqueName;
            if (uniqueName === userToShow.uniqueName) {
                isUserAlreadyAdded = true;
            }
        }

        if (isUserAlreadyAdded) {
            window.alert("User is already in the group");
        } else {
            let response = await addNewUserToChat(chat?.id, userToShow?.username, userToShow);
            let data = response?.data;
            if (data) {
                window.alert("User was successfully added to the group");
            }
        }
    }

    return (
        <div className="chat-filtered-user-item-container">
            <div className="chat-filtered-user-item">
                <div
                    onClick={onChatFilteredUserItemClick}
                    className="chat-filtered-user-item-info">
                    <h4>Username:</h4>
                    <div className="chat-filtered-user-item-info-uniqueName">{userToShow.uniqueName}</div>
                </div>
                <div className="chat-filtered-user-item-add-user-button" onClick={onChatFilteredUserItemAddButtonClick}>ADD</div>
            </div>
        </div>
    );
}