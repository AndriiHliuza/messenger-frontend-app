import { React, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { CHATS_ROUTE } from "../../../config";
import { ChatMemberRole } from "../../../utils/ChatMemberRole";
import "./ChatListItem.css";
import { useAppContext } from "../../../App";
import { MessageStatus } from "../../../utils/MessageStatus";
import { ChatType } from "../../../utils/ChatType";
import { getChatById, deleteChatById, deleteChatMemberFromChat } from "../../../axios/ChatAPI";
import forge from "node-forge";

export default function ChatsListItem(props) {

    const navigate = useNavigate();
    const { user, setInformMessage } = useAppContext();

    const { chat } = props;
    const [lastChatMessage, setLastChatMessage] = useState("");
    const [isAdmin, setAdmin] = useState(false);
    const [isNewMessagesPresent, setNewMessagesPresent] = useState(false);
    const [isChatListItemActionsButtonsShown, setChatListItemActionsButtonsShow] = useState(false);

    useEffect(() => {
        async function getChat() {
            setNewMessagesPresent(false);
            let response = await getChatById(chat?.id);
            let data = response?.data;
            if (data) {
                let chatMessages = response?.data?.messages;
                if (chatMessages && chatMessages.length !== 0) {
                    let lastMessage = chatMessages[chatMessages.length - 1];
                    if (lastMessage) {
                        let userPrivateKeyString = localStorage.getItem("user-private-key");
                        userPrivateKeyString = "-----BEGIN RSA PRIVATE KEY-----\n" + userPrivateKeyString + "\n-----END RSA PRIVATE KEY-----";
                        let userPrivateKey = forge.pki.privateKeyFromPem(userPrivateKeyString);
                        if (lastMessage?.content) {
                            let decryptedText = userPrivateKey.decrypt(forge.util.decode64(lastMessage.content));
                            setLastChatMessage({ ...lastMessage, content: decryptedText });
                        } else {
                            setLastChatMessage("");
                        }
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
            }
        }
        getChat();
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

    const onLeaveChatButtonClick = async () => {
        if (window.confirm("Are you sure you want to leave this chat?")) {
            let response = await deleteChatMemberFromChat(chat?.id, user?.username);
            let data = response?.data;
            if (!data) {
                setInformMessage("Something wen wrong. Try again");
            }
        }
    }

    const onDeleteChatButtonClick = async () => {
        if (window.confirm("Are you sure you want to leave and delete this chat?")) {
            let response = await deleteChatById(chat?.id);
            let data = response?.data;
            if (!data) {
                setInformMessage("Something went wrong. Try again!");
            }
        }
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
                                ? chat?.type === ChatType.GROUP_CHAT
                                    ? <>
                                        <div className="chat-list-item-delete-button-container">
                                            <div className="chat-list-item-delete-button" onClick={onLeaveChatButtonClick}>Leave chat</div>
                                        </div>
                                        <div className="chat-list-item-delete-button-container">
                                            <div className="chat-list-item-delete-button" onClick={onDeleteChatButtonClick}>Delete chat</div>
                                        </div>
                                    </>
                                    : <div className="chat-list-item-delete-button-container">
                                        <div className="chat-list-item-delete-button" onClick={onDeleteChatButtonClick}>Delete chat</div>
                                    </div>
                                : <div className="chat-list-item-delete-button-container">
                                    <div className="chat-list-item-delete-button" onClick={onLeaveChatButtonClick}>Leave chat</div>
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