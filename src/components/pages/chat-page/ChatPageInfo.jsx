import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./ChatPageInfo.css";
import "../../search/Search.css";
import ChatPageMember from './ChatPageMember';
import { useAppContext } from '../../../App';
import { ChatMemberRole } from '../../../utils/ChatMemberRole';
import { findUsersByUniqueNameStartingWith } from '../../../axios/UserAPI';
import ChatFilteredUserItem from './ChatFilteredUserItem';
import { updateChat, deleteChatById, deleteChatMemberFromChat } from '../../../axios/ChatAPI';
import { USER_ROUTE } from '../../../config';
import { ChatType } from '../../../utils/ChatType';

export default function ChatPageInfo(props) {

    const navigate = useNavigate();
    const { user } = useAppContext();
    const { chat, isMemberTabOpened, isAdmin, setAdmin } = props;
    const [chatMembers, setChatMembers] = useState([]);
    // const [isAdmin, setAdmin] = useState(false);
    const [isAddUserPanelOpened, setAddUsersPanelOpened] = useState(false);
    const [usersToShow, setUsersToShow] = useState([]);
    const [usersUniqueNamePrefix, setUsersUniqueNamePrefix] = useState("");
    const [isChatNameModificationButtonShown, setChatModificationButtonShown] = useState(false);
    const [chatNameIsChanging, setChatNameIsChanging] = useState(false);
    const [updatedChatName, setUpdatedChatName] = useState("");


    const onChatNameClick = (e) => {
        e.preventDefault();
        if (isAdmin) {
            setChatModificationButtonShown(true);
        }
    }

    const onMouseLeaveChatName = () => {
        setChatModificationButtonShown(false);
        setChatNameIsChanging(false);
        setUpdatedChatName(chat?.name);
    }

    const onChangeChatNameButtonClick = () => {
        setChatNameIsChanging(true);
    }

    const onSubmitChatNameChangeButtonClick = async () => {
        if (chat?.name && updatedChatName && chat?.name === updatedChatName) {
            window.alert("Chat name is the same");
        } else if (updatedChatName) {
            let response = await updateChat(chat?.id, { ...chat, name: updatedChatName });
            let data = response?.data;
            if (data) {
                window.alert("Chat name was updated");
            }
        }
    }

    const onCancelChatNameChangeButtonClick = () => {
        setChatNameIsChanging(false);
        setUpdatedChatName(chat?.name);
    }

    const onSwitchNewUsersTab = () => {
        setUsersUniqueNamePrefix("");
        setUsersToShow([]);
        setAddUsersPanelOpened(!isAddUserPanelOpened);
    }

    const onDeleteChatButtonClick = async () => {
        if (window.confirm("Are you sure you want to leave chat?")) {
            let response = await deleteChatMemberFromChat(chat?.id, user?.username);
            let data = response?.data;
            if (data) {
                navigate(USER_ROUTE + "/" + user?.uniqueName + "/chats");
            }
        }
    }

    const onCompletelyDeleteChatButtonClick = async () => {
        if (window.confirm("Are you sure you want to leave and delete chat?")) {
            let response = await deleteChatById(chat?.id);
            let data = response?.data;
            if (data) {
                navigate(USER_ROUTE + "/" + user?.uniqueName + "/chats");
            }
        }
    }

    useEffect(() => {
        setUpdatedChatName(chat?.name);
        let members = chat?.members;
        if (members && members.length !== 0) {
            setChatMembers(members);
        }

        let currentUserUsername = user?.username;

        let isCurrentUserhasRoleAdminInChat = members.some(
            member =>
                member?.user?.username === currentUserUsername
                && member?.role === ChatMemberRole.ADMIN
        );
        setAdmin(isCurrentUserhasRoleAdminInChat);
    }, [chat]);

    useEffect(() => {
        async function findUsersByUniqueNameStartingWithPrefix() {
            if (usersUniqueNamePrefix) {
                let response = await findUsersByUniqueNameStartingWith(usersUniqueNamePrefix);
                let users = response?.data;
                if (users) {
                    setUsersToShow(users);
                }
            } else {
                setUsersToShow([]);
            }
        }
        findUsersByUniqueNameStartingWithPrefix();
    }, [usersUniqueNamePrefix]);

    return (
        <div className={isMemberTabOpened ? "show-chat-page-info-container" : "chat-page-info-container"}>
            {
                isAddUserPanelOpened
                    ? <div className="add-users-container">
                        <h2>ADD USER</h2>
                        <input
                            className="search-field"
                            type="text"
                            placeholder="Search..."
                            value={usersUniqueNamePrefix}
                            onChange={(e) => setUsersUniqueNamePrefix(e.target.value)}
                        />
                        <div className="chat-filtered-user-items-container">
                            {
                                usersToShow.map((userToShow) => <ChatFilteredUserItem
                                    key={userToShow.username}
                                    chat={chat}
                                    userToShow={userToShow}
                                    chatMembers={chatMembers}
                                />)
                            }
                        </div>
                        <div className="chat-page-add-user-operation-container">
                            <div className="chat-page-button-container">
                                <div className="chat-page-button" onClick={onSwitchNewUsersTab}>Back</div>
                            </div>
                        </div>
                    </div>

                    : <div className="chat-page-info">
                        <div
                            onContextMenu={onChatNameClick}
                            onMouseLeave={onMouseLeaveChatName}
                            className={chatNameIsChanging ? "chat-page-info-name-container chat-page-changing-info-name-container" : "chat-page-info-name-container"}>
                            <div className="chat-page-info-name">
                                {
                                    chatNameIsChanging
                                        ? <textarea
                                            id="chatName"
                                            name="chatName"
                                            value={updatedChatName}
                                            placeholder={chat?.name}
                                            onChange={(event) => setUpdatedChatName(event.target.value)}
                                            className="chat-page-updated-name-textarea"
                                        ></textarea>
                                        : <div className="chat-page-info-name-value">
                                            <strong>{chat.name}</strong>
                                        </div>
                                }
                            </div>
                            {
                                isChatNameModificationButtonShown
                                    ? chatNameIsChanging
                                        ? <>
                                            <div className="chat-page-button-container">
                                                <div className="chat-page-button" onClick={onSubmitChatNameChangeButtonClick}>Submit</div>
                                            </div>
                                            <div className="chat-page-button-container">
                                                <div className="chat-page-button" onClick={onCancelChatNameChangeButtonClick}>Cancel</div>
                                            </div>
                                        </>
                                        : <div className="chat-page-button-container">
                                            <div className="chat-page-button" onClick={onChangeChatNameButtonClick}>Change name</div>
                                        </div>
                                    : ""
                            }
                        </div>
                        <div className="chat-members">
                            {
                                chatMembers.map((chatMember) => {
                                    return <ChatPageMember key={chatMember.user?.username} chatMember={chatMember} isCurrentUserAdmin={isAdmin} chatId={chat?.id} />
                                })
                            }
                        </div>
                        <div className={chat?.type === ChatType.GROUP_CHAT ? "chat-page-operations-container" : "chat-page-operations-container private-chat-page-operations-container"} >
                            {
                                chat?.type === ChatType.GROUP_CHAT
                                    ? <div className="chat-page-button-container">
                                        <div className="chat-page-button" onClick={onSwitchNewUsersTab}>Add user</div>
                                    </div>
                                    : ""
                            }
                            {
                                isAdmin
                                    ? chat?.type === ChatType.GROUP_CHAT
                                        ? <>
                                            <div className="chat-page-button-container">
                                                <div className="chat-page-button" onClick={onDeleteChatButtonClick}>Leave chat</div>
                                            </div>
                                            <div className="chat-page-button-container">
                                                <div className="chat-page-button" onClick={onCompletelyDeleteChatButtonClick}>Delete chat</div>
                                            </div>
                                        </>
                                        : <div className="chat-page-button-container">
                                            <div className="chat-page-button" onClick={onCompletelyDeleteChatButtonClick}>Delete chat</div>
                                        </div>
                                    : <div className="chat-page-button-container">
                                        <div className="chat-page-button" onClick={onDeleteChatButtonClick}>Leave chat</div>
                                    </div>
                            }
                        </div>
                    </div>
            }
        </div>
    );
}
