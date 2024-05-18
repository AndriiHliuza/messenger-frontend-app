import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./ChatPageMessage.css";
import { useAppContext } from '../../../App';
import { USER_ROUTE } from '../../../config';
import { deleteMessageFromChat, getMessageStatusForUser } from '../../../axios/MessageApi';
import { getChatById } from '../../../axios/ChatAPI';
import forge from "node-forge";
import CryptoJS from 'crypto-js';

export default function ChatPageMessage(props) {

    const navigate = useNavigate();
    const { chat, setChat, message, setUpdatedMessage, isMessageUpdating, setMessageUpdating, isAdmin } = props;
    const { user } = useAppContext();
    const [isMessageFromCurrentUser, setMessageFromCurrentUser] = useState(false);
    const [senderUniqueName, setSenderUniqueName] = useState("");
    const [messageSendTime, setMessageSendTime] = useState("");
    const [messageSendDate, setMessageSendDate] = useState("");
    const [isMessageActionsButtonsShown, setMessageActionsButtonsShown] = useState(false);
    const [messageContent, setMessageContent] = useState("");
    const [messageStatus, setMessageStatus] = useState(null);

    const onMessageContextMenuClick = async (e) => {
        e.preventDefault();
        let currentUserUsername = user?.username;
        let messageUserUsername = message?.sender?.username;

        if (currentUserUsername === messageUserUsername && !isMessageUpdating) {
            let messageStatusResponse = await getMessageStatusForUser(chat.id, message.id, user.username)
            let messageStatusResponseData = messageStatusResponse?.data;
            if (messageStatusResponseData && messageStatusResponseData?.status) {
                let status = messageStatusResponseData.status.split("_")[0]
                setMessageStatus("Status: " + status);
                setMessageActionsButtonsShown(true)
            }
        }

        if (isAdmin) {
            setMessageActionsButtonsShown(true);
        }
    }

    const onMouseLeaveMessage = () => {
        setMessageActionsButtonsShown(false)
    }

    const onUpdateMessageButtonClick = () => {
        setMessageUpdating(true);
        setMessageActionsButtonsShown(false);
        setUpdatedMessage({
            id: message?.id,
            sender: message?.sender,
            chatId: message?.chatId,
            content: messageContent,
            sendTime: message?.sendTime,
            type: message?.type,
            status: message?.status
        });
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

        let aesKey = localStorage.getItem("aes-key");
        if (message?.content) {
            let decryptedText = CryptoJS.AES.decrypt(
                { ciphertext: CryptoJS.enc.Base64.parse(message?.content) },
                CryptoJS.enc.Base64.parse(aesKey),
                { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
            )
            setMessageContent(decryptedText.toString(CryptoJS.enc.Utf8));
        }

        let messageTime = message?.sendTime;

        if (messageTime) {
            let dateTime = new Date(message.sendTime);
            let time = dateTime.toTimeString().split(' ')[0];
            let date = dateTime.toISOString().split('T')[0];
            setMessageSendTime("Time: " + time);
            setMessageSendDate("Date: " + date);
        }

        if (message?.status && messageSenderUsername && currentUserUsername && messageSenderUsername === currentUserUsername) {
            let status = message.status.split("_")[0]
            setMessageStatus("Status: " + status);
        }

    }, [message]);

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
                                        : "From: " + senderUniqueName
                                    : "Unknown user"
                            }
                        </div>
                    </strong>
                </div>
                <div className="message-content">{messageContent}</div>
                {messageSendDate || messageSendDate ? <hr /> : ""}
                <div>{messageSendTime}</div>
                <div>{messageSendDate}</div>
                <div className={isMessageActionsButtonsShown ? "message-actions-buttons-and-status-container" : "hidden-message-actions-buttons-container"}>
                    <div className="message-actions-buttons-and-status">
                        <div className="message-status-container">{messageStatus}</div>
                        <div className="message-actions-buttons">
                            {
                                isAdmin && (user?.username !== message?.sender?.username)
                                    ? <div className="message-delete-button" onClick={onDeleteMessageButtonClick}>Delete</div>
                                    : <>
                                        <div className="message-update-button" onClick={onUpdateMessageButtonClick}>Update</div>
                                        <div className="message-delete-button" onClick={onDeleteMessageButtonClick}>Delete</div>
                                    </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}