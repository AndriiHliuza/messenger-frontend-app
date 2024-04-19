import { React, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { CHATS_ROUTE } from "../../../config";
import { ChatMemberRole } from "../../../utils/ChatMemberRole";
import "./ChatListItem.css";
import { useAppContext } from "../../../App";

export default function ChatsListItem(props) {

    const navigate = useNavigate();
    const { user } = useAppContext();

    const { chat } = props;
    const [lastChatMessage, setLastChatMessage] = useState("");
    const [isAdmin, setAdmin] = useState(false);

    useEffect(() => {
        let chatMessages = chat?.messages;
        if (chatMessages && chatMessages.length !== 0) {
            let lastMessage = chatMessages[chatMessages.length - 1];
            if (lastMessage) {
                setLastChatMessage(lastMessage);
            }
        } else {
            setLastChatMessage("");
        }

        let members = chat?.members;
        let currentUserUsername = user?.username;

        let isCurrentUserhasRoleAdminInChat = members.some(
            member =>
                member?.user?.username === currentUserUsername
                && member?.role === ChatMemberRole.ADMIN
        );
        setAdmin(isCurrentUserhasRoleAdminInChat);
    }, [chat]);

    const onChatClick = () => {
        navigate(CHATS_ROUTE + "/" + chat.id);
    }

    const onChatDeleteButtonClick = () => {
        console.log("delete chat");
    }

    const onCompletelyChatDeleteButtonClick = () => {
        console.log("completely delete chat");
    }

    return (
        <div className="chat-list-item-container">
            <div className="chat-list-item">
                <div className="chat-list-item-info">
                    <div><strong>Name:</strong></div>
                    <div className="chat-list-item-name">{chat.name}</div>
                    {
                        isAdmin
                            ? <>
                                <div className="chat-list-item-delete-button-container">
                                    <div className="chat-list-item-delete-button" onClick={onChatDeleteButtonClick}>Delete chat for me</div>
                                </div>
                                <div className="chat-list-item-delete-button-container">
                                    <div className="chat-list-item-delete-button" onClick={onCompletelyChatDeleteButtonClick}>Delete chat for all</div>
                                </div>
                            </>
                            : <div className="chat-list-item-delete-button-container">
                                <div className="chat-list-item-delete-button" onClick={onChatDeleteButtonClick}>Delete chat</div>
                            </div>
                    }
                </div>
                <div className="chat-list-item-last-message" onClick={onChatClick}>
                    <div className="chat-list-item-last-message-info">
                        <div className="chat-list-item-last-message-sender-uniqueName">
                            <strong>{lastChatMessage
                                ? lastChatMessage?.sender?.uniqueName
                                    ? "Message from: " + lastChatMessage.sender.uniqueName
                                    : "Message from: Unknown user"
                                : "No messages"}
                            </strong>
                        </div>
                        <div className="chat-list-item-last-message-content">
                            {
                                lastChatMessage?.content
                                    ? "> " + lastChatMessage.content
                                    : ""
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}