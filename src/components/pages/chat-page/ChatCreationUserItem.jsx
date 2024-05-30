import { React } from "react";
import "./ChatCreationUserItem.css";

export default function ChatCreationUserItem(props) {

    const { chosenUser, chosenUsers, setChosenUsers } = props;

    const onChosenUserItemRemoveButtonClick = () => {
        let chosenUsersAfterUserItemRemoving = chosenUsers.filter(user => user.username !== chosenUser.username);
        setChosenUsers(chosenUsersAfterUserItemRemoving);
    }

    return (
        <div className="chat-creation-user-item-container">
            <div className="chat-creation-user-item">
                <div className="chat-creation-user-item-info">
                    <h4>Username:</h4>
                    <div className="chat-creation-user-item-info-uniqueName">{chosenUser.uniqueName}</div>
                </div>
                <div className="chat-creation-user-item-add-user-button" onClick={onChosenUserItemRemoveButtonClick}>REMOVE</div>
            </div>
        </div>
    );
}