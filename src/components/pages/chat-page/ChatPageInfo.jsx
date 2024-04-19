import { React, useEffect, useState } from 'react';
import "./ChatPageInfo.css";
import "../../search/Search.css";
import ChatPageMember from './ChatPageMember';
import { useAppContext } from '../../../App';
import { ChatMemberRole } from '../../../utils/ChatMemberRole';
import { findUsersByUniqueNameStartingWith } from '../../../axios/UserAPI';
import FilteredUserItem from '../../search/FilteredUserItem';


export default function ChatPageInfo(props) {

    const { user } = useAppContext();
    const { chat, isMemberTabOpened } = props;
    const [chatMembers, setChatMembers] = useState([]);
    const [isAdmin, setAdmin] = useState(false);
    const [isAddUserPanelOpened, setAddUsersPanelOpened] = useState(false);

    const [usersToShow, setUsersToShow] = useState([]);
    const [usersUniqueNamePrefix, setUsersUniqueNamePrefix] = useState("");
    const [chosenUsers, setChosenUsers] = useState([]);

    const onSwitchNewUsersTab = () => {
        setUsersUniqueNamePrefix("");
        setUsersToShow([]);
        setChosenUsers([]);
        setAddUsersPanelOpened(!isAddUserPanelOpened);
    }

    const onDeleteChatButtonClick = () => {
        console.log("delete chat in ChatPageInfo");
    }

    const onCompletelyDeleteChatButtonClick = () => {
        console.log("completely delete chat in ChatPageInfo");
    }

    useEffect(() => {
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
                        <div className="filtered-user-items-container">
                            {
                                usersToShow.map((userToShow) => <div key={userToShow.username}>
                                    {userToShow.uniqueName}
                                </div>)
                            }
                        </div>
                        <div className="chat-page-button-container">
                            <div className="chat-page-button" onClick={onSwitchNewUsersTab}>Back</div>
                        </div>
                    </div>

                    : <div className="chat-page-info">
                        <div className="chat-page-info-name-container">
                            <div className="chat-page-info-name"><div className="chat-page-info-name-value">{chat.name}</div></div>
                        </div>
                        <div className="chat-members">
                            {
                                chatMembers.map((chatMember) => {
                                    return <ChatPageMember key={chatMember.user?.username} chatMember={chatMember} isCurrentUserAdmin={isAdmin} />
                                })
                            }
                        </div>
                        <div className="chat-page-operations-container">
                            <div className="chat-page-button-container">
                                <div className="chat-page-button" onClick={onSwitchNewUsersTab}>Add user</div>
                            </div>
                            {
                                isAdmin
                                    ? <>
                                        <div className="chat-page-button-container">
                                            <div className="chat-page-button" onClick={onDeleteChatButtonClick}>Delete chat for me</div>
                                        </div>
                                        <div className="chat-page-button-container">
                                            <div className="chat-page-button" onClick={onCompletelyDeleteChatButtonClick}>Delete chat for all</div>
                                        </div>
                                    </>
                                    : <div className="chat-page-button-container">
                                        <div className="chat-page-button" onClick={onCompletelyDeleteChatButtonClick}>Delete chat</div>
                                    </div>
                            }
                        </div>
                    </div>
            }
        </div>
    );
}
