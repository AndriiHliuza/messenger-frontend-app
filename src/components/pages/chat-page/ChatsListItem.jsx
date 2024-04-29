import { React, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { CHATS_ROUTE } from "../../../config";
import { ChatMemberRole } from "../../../utils/ChatMemberRole";
import "./ChatListItem.css";
import { useAppContext } from "../../../App";
import { MessageStatus } from "../../../utils/MessageStatus";

export default function ChatsListItem(props) {

    const navigate = useNavigate();
    const { user } = useAppContext();

    const { chat } = props;
    const [lastChatMessage, setLastChatMessage] = useState("");
    const [isAdmin, setAdmin] = useState(false);
    const [isNewMessagesPresent, setNewMessagesPresent] = useState(false);
    const [isChatListItemActionsButtonsShown, setChatListItemActionsButtonsShow] = useState(false);

    useEffect(() => {
        setNewMessagesPresent(false);
        let chatMessages = chat?.messages;
        if (chatMessages && chatMessages.length !== 0) {
            let lastMessage = chatMessages[chatMessages.length - 1];
            if (lastMessage) {
                setLastChatMessage(lastMessage);
                if (lastMessage.status === MessageStatus.UNREAD_MESSAGE && lastMessage?.sender?.username != user?.username) {
                    setNewMessagesPresent(true);
                }
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

    const onChatListItemContextMenuClick = (e) => {
        e.preventDefault();
        setChatListItemActionsButtonsShow(true);
    }

    const onMouseLeaveChatListItem = () => {
        setChatListItemActionsButtonsShow(false);
    }

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
                <div
                    onContextMenu={onChatListItemContextMenuClick}
                    onMouseLeave={onMouseLeaveChatListItem}
                    className="chat-list-item-info">
                    <div className="chat-list-item-name"><strong>{chat?.name ? chat.name : "Unknown chat"}</strong></div>
                    {
                        isChatListItemActionsButtonsShown
                            ? isAdmin
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
                            : ""
                    }
                </div>
                <div className="chat-list-item-last-message" onClick={onChatClick}>
                    <div className="chat-list-item-last-message-info">
                        <div className="chat-list-item-last-message-sender-uniqueName">
                            <strong>{lastChatMessage
                                ? lastChatMessage?.sender?.uniqueName
                                    ? "From: " + lastChatMessage.sender.uniqueName
                                    : "From: Unknown user"
                                : "No messages"}
                            </strong>
                        </div>
                        {
                            isNewMessagesPresent
                                ? <div className="new-chat-message-notification-container">
                                    <div className="new-chat-message-notification">NEW MESSAGE</div>
                                </div>
                                : ""
                        }
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