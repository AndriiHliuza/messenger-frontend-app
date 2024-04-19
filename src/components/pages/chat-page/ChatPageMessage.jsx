import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./ChatPageMessage.css";
import { useAppContext } from '../../../App';
import { USER_ROUTE } from '../../../config';
import { deleteMessageFromChat } from '../../../axios/MessageApi';
import { getChatById } from '../../../axios/ChatAPI';
import forge from "node-forge";

export default function ChatPageMessage(props) {

    const navigate = useNavigate();
    const { chat, setChat, message } = props;
    const { user } = useAppContext();
    const [isMessageFromCurrentUser, setMessageFromCurrentUser] = useState(false);
    const [senderUniqueName, setSenderUniqueName] = useState("");
    const [messageSendTime, setMessageSendTime] = useState("");
    const [messageSendDate, setMessageSendDate] = useState("");
    const [isMessageActionsButtonsShown, setMessageActionsButtonsShown] = useState(false);
    const [messageContent, setMessageContent] = useState("");

    const onMessageContextMenuClick = (e) => {
        e.preventDefault();
        let currentUserUsername = user?.username;
        let messageUserUsername = message?.sender?.username;

        if (currentUserUsername === messageUserUsername) {
            setMessageActionsButtonsShown(true)
        }
    }

    const onMouseLeaveMessage = () => {
        setMessageActionsButtonsShown(false)
    }

    const onUpdateMessageButtonClick = () => {
        console.log("update message");
    }

    const onDeleteMessageButtonClick = async () => {
        if (window.confirm("Are you sure you want to delete a message?")) {
            let messageId = message.id;
            let chatId = message.chatId;
            let responseOnMessageDeletion = await deleteMessageFromChat(chatId, messageId);
            let data = responseOnMessageDeletion?.data;
            if (data) {
                let chatId = chat.id;
                let responseOnChatReceiving = await getChatById(chatId);
                let returnedChat = responseOnChatReceiving?.data;
                if (returnedChat && chatId === returnedChat.id) {
                    setChat(returnedChat);
                }
            }
        }
    }

    const onMessageSenderUsernameClick = () => {
        navigate(USER_ROUTE + "/" + senderUniqueName);
    }

    useEffect(() => {
        let messageSenderUsername = message?.sender?.username;
        let currentUserUsername = user?.username;

        if (messageSenderUsername && currentUserUsername && messageSenderUsername === currentUserUsername) {
            setMessageFromCurrentUser(true);
        }

        let senderUserUniqueName = message?.sender?.uniqueName;

        if (senderUserUniqueName) {
            setSenderUniqueName(senderUserUniqueName);
        }

        let userPrivateKeyString = localStorage.getItem("user-private-key");
        userPrivateKeyString = "-----BEGIN RSA PRIVATE KEY-----\n" + userPrivateKeyString + "\n-----END RSA PRIVATE KEY-----";
        let userPrivateKey = forge.pki.privateKeyFromPem(userPrivateKeyString);
        if (message?.content) {
            let decryptedText = userPrivateKey.decrypt(forge.util.decode64(message.content));
            setMessageContent(decryptedText);
        }

        let messageTime = message?.sendTime;

        if (messageTime) {
            let dateTime = new Date(message.sendTime);
            let time = dateTime.toTimeString().split(' ')[0];
            let date = dateTime.toISOString().split('T')[0];
            setMessageSendTime("Time: " + time);
            setMessageSendDate("Date: " + date);
        }

    }, []);

    return (
        <div className="chat-page-message-container">
            <div
                onContextMenu={onMessageContextMenuClick}
                onMouseLeave={onMouseLeaveMessage}
                className={isMessageFromCurrentUser ? "current-user-message" : "other-user-message"}>
                <div className="message-sender-username" onClick={onMessageSenderUsernameClick}>
                    <strong>
                        <div className="message-sender-username-value">
                            {
                                message?.sender?.username
                                    ? isMessageFromCurrentUser
                                        ? ""
                                        : senderUniqueName
                                    : "Unknown user"
                            }
                        </div>
                    </strong>
                </div>
                <div className="message-content">{messageContent}</div>
                {messageSendDate || messageSendDate ? <hr /> : ""}
                <div>{messageSendTime}</div>
                <div>{messageSendDate}</div>
                <div className={isMessageActionsButtonsShown ? "message-actions-buttons-container" : "hidden-message-actions-buttons-container"}>
                    <div className="message-actions-buttons">
                        <div className="message-update-button" onClick={onUpdateMessageButtonClick}>Update</div>
                        <div className="message-delete-button" onClick={onDeleteMessageButtonClick}>Delete</div>
                    </div>
                </div>
            </div>
        </div>
    );
}