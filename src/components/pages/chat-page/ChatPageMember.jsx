import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./ChatPageMember.css";
import { USER_ROUTE } from '../../../config';
import { ChatMemberRole } from '../../../utils/ChatMemberRole';
import { useAppContext } from '../../../App';

export default function ChatPageMember(props) {

    const navigate = useNavigate();
    const { user } = useAppContext();
    const { chatMember, isCurrentUserAdmin } = props;

    const [chatMemberInfo, setChatMemberInfo] = useState(null);
    const [isChatPageMemberActionsButtonsShown, setChatPageMemberActionsButtonsShown] = useState(false);

    useEffect(() => {
        setChatMemberInfo(chatMember?.user);
    }, []);

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

        if (isCurrentUserAdmin && currentUserUsername !== chatMemberUsername) {
            setChatPageMemberActionsButtonsShown(true);
        }
    }

    const onMouseLeaveChatMember = () => {
        setChatPageMemberActionsButtonsShown(false);
    }

    const onSetAdminRoleToChatMemberButtonClick = () => {
        console.log("make admin");
    }

    const onDeleteChatMemberButtonClick = () => {
        console.log("delte");
    }

    return (
        <div className="chat-page-member-container">
            <div className={chatMemberInfo?.username === user?.username ? "chat-page-member current-user-within-chat-members" : "chat-page-member"}
                onContextMenu={onMemberContextMenuClick}
                onMouseLeave={onMouseLeaveChatMember}
            >
                <div className="chat-page-member-info" onClick={onChatPageMemberClick}>
                    <div className="chat-page-member-info-username"><strong>Username:&ensp;</strong>{chatMemberInfo?.uniqueName}</div>
                    <div>
                        {
                            chatMember?.role === ChatMemberRole.ADMIN
                                ?
                                <>
                                    <strong>Role:&ensp;</strong>ADMIN
                                </>
                                : ""
                        }</div>
                    <div><strong>Status:&ensp;</strong>{chatMemberInfo?.status}</div>
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