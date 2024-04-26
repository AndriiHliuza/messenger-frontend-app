import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./ChatPageMember.css";
import { USER_ROUTE } from '../../../config';
import { ChatMemberRole } from '../../../utils/ChatMemberRole';
import { useAppContext } from '../../../App';
import { updateChatMember, deleteChatMemberFromChat } from '../../../axios/ChatAPI';

export default function ChatPageMember(props) {

    const navigate = useNavigate();
    const { user } = useAppContext();
    const { chatMember, isCurrentUserAdmin, chatId } = props;

    const [chatMemberInfo, setChatMemberInfo] = useState(null);
    const [isChatPageMemberActionsButtonsShown, setChatPageMemberActionsButtonsShown] = useState(false);

    useEffect(() => {
        setChatMemberInfo(chatMember?.user);
    }, [chatMember]);

    const onChatPageMemberClick = () => {
        let chatMemberUniqueName = chatMemberInfo?.uniqueName;
        if (chatMemberUniqueName) {
            navigate(USER_ROUTE + "/" + chatMemberUniqueName);
        }
    }

    const onMemberContextMenuClick = (e) => {
        e.preventDefault();
        let currentUserUsername = user?.username;
        let chatMemberUsername = chatMember?.user?.username;
        let chatMemberRole = chatMember?.role;

        if (isCurrentUserAdmin && currentUserUsername !== chatMemberUsername && chatMemberRole != ChatMemberRole.ADMIN) {
            setChatPageMemberActionsButtonsShown(true);
        }
    }

    const onMouseLeaveChatMember = () => {
        setChatPageMemberActionsButtonsShown(false);
    }

    const onSetAdminRoleToChatMemberButtonClick = async () => {
        let updatedChatMember = {
            ...chatMember,
            role: ChatMemberRole.ADMIN
        }
        let response = await updateChatMember(chatId, chatMemberInfo?.username, updatedChatMember);
        let data = response?.data;
        if (data && data?.role === ChatMemberRole.ADMIN) {
            window.alert("You have changed " + chatMemberInfo?.uniqueName + "'s status to ADMIN");
        } else {
            window.alert("Something went wrong. Member role was not updated");
        }
    }

    const onDeleteChatMemberButtonClick = async () => {
        let response = await deleteChatMemberFromChat(chatId, chatMemberInfo?.username);
        let data = response?.data;

        if (data) {
            window.alert("You have deleted " + chatMemberInfo?.uniqueName + " user from chat");
        } else {
            window.alert("Something went wrong. User " + chatMemberInfo?.uniqueName + " was not deleted from chat");
        }
    }

    return (
        <div className="chat-page-member-container">
            <div className={chatMemberInfo?.username === user?.username ? "chat-page-member current-user-within-chat-members" : "chat-page-member"}
                onContextMenu={onMemberContextMenuClick}
                onMouseLeave={onMouseLeaveChatMember}
            >
                <div className="chat-page-member-info" onClick={onChatPageMemberClick}>
                    <div className="chat-page-member-info-username"><strong>{chatMemberInfo?.uniqueName}</strong></div>
                    <div>
                        {
                            chatMember?.role === ChatMemberRole.ADMIN
                                ?
                                <>
                                    <div className="chat-page-member-info-role"><strong>ADMIN</strong></div>
                                </>
                                : ""
                        }
                    </div>
                </div>
                <div className={isChatPageMemberActionsButtonsShown ? "chat-page-member-actions-buttons-container" : "hidden-chat-page-member-actions-buttons-container"}>
                    <div className="chat-page-member-actions-buttons">
                        <div className="chat-page-member-make-admin-button" onClick={onSetAdminRoleToChatMemberButtonClick}>Make ADMIN</div>
                        <div className="chat-page-member-delete-button" onClick={onDeleteChatMemberButtonClick}>Remove</div>
                    </div>
                </div>
            </div>
        </div>
    );
}