import { React, useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from '../../routes/AuthenticationBasedRoute';
import LoadingPage from '../alert-pages/LoadingPage';
import NotFoundPage from '../alert-pages/NotFoundPage';
import { getChatById } from '../../../axios/ChatAPI';
import ChatPageInfo from './ChatPageInfo';
import ChatPageMessagesArea from './ChatPageMessagesArea';
import "./ChatPage.css";
import { updateMessagesStatusesInChat } from '../../../axios/MessageApi';
import { MessageStatus } from '../../../utils/MessageStatus';
import { USER_ROUTE } from '../../../config';
import { useAppContext } from '../../../App';
import { Role } from '../../../utils/Role';

export default function ChatPage() {

    const params = useParams();
    const { user } = useAppContext();
    const navigate = useNavigate();
    const { userChats } = useAuthContext();
    const [isLoading, setLoading] = useState(true);
    const [chatExists, setChatExists] = useState(false);
    const [chat, setChat] = useState(null);
    const [isMemberTabOpened, setMemberTabOpened] = useState(false);
    const [isAdmin, setAdmin] = useState(false);

    useEffect(() => {
        async function getCurrentChat() {
            let chatId = params?.chatId;
            let response = await getChatById(chatId);

            if (response === null) {
                navigate(USER_ROUTE + "/" + user?.uniqueName + "/chats");
            } else {
                let returnedChat = response?.data;
            
                if (chatId === returnedChat?.id) {
                    await updateMessagesStatusesInChat(returnedChat.id, MessageStatus.READ_MESSAGE);
                    setChat(returnedChat);
                    setChatExists(true);
                }
    
                setLoading(false);
            }            
        }

        getCurrentChat();
    }, [userChats]);

    return (
        isLoading
            ? <LoadingPage />
            : chatExists && user?.role !== Role.ADMIN && user?.role !== Role.ROOT 
                ? (
                    <div className="chat-page-container">
                        <div className="chat-page-buttons-container">
                            <div className="chat-page-buttons">
                                <div className={isMemberTabOpened ? "chat-page-messages-button" : "chat-page-messages-button chat-page-button-color"} onClick={() => setMemberTabOpened(false)}>Messages</div>
                                <div className={isMemberTabOpened ? "chat-page-members-button chat-page-button-color" : "chat-page-members-button"} onClick={() => setMemberTabOpened(true)}>Members</div>
                            </div>
                        </div>
                        <div className="chat-page-content">
                            <ChatPageMessagesArea chat={chat} setChat={setChat} isMemberTabOpened={isMemberTabOpened} isAdmin={isAdmin} />
                            <ChatPageInfo chat={chat} isMemberTabOpened={isMemberTabOpened} isAdmin={isAdmin} setAdmin={setAdmin} />
                        </div>
                    </div>
                )
                : <NotFoundPage />
    );
}