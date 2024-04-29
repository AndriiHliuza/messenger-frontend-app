import { React, useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from '../../routes/AuthenticationBasedRoute';
import LoadingPage from '../alert-pages/LoadingPage';
import NotFoundPage from '../alert-pages/NotFoundPage';
import { getChatById } from '../../../axios/ChatAPI';
import ChatPageInfo from './ChatPageInfo';
import ChatPageMessagesArea from './ChatPageMessagesArea';
import "./ChatPage.css";
import forge from "node-forge";
import CryptoJS from "crypto-js";
import { updateMessagesStatusesInChat } from '../../../axios/MessageApi';
import { MessageStatus } from '../../../utils/MessageStatus';
import { CHATS_ROUTE, USER_ROUTE } from '../../../config';
import { useAppContext } from '../../../App';

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
            // if (userChats && userChats.length === 0) {
            //     navigate(USER_ROUTE + "/" + user?.uniqueName + "/chats");
            // } else {
            //     response = await getChatById(chatId);
            // }

            if (response === null) {
                navigate(USER_ROUTE + "/" + user?.uniqueName + "/chats");
            } else {
                let returnedChat = response?.data;
            
                if (chatId === returnedChat?.id) {
                    await updateMessagesStatusesInChat(returnedChat.id, MessageStatus.READ_MESSAGE);
                    setChat(returnedChat);
                    setChatExists(true);
    
                    
                    // let userPrivateKeyString = localStorage.getItem("user-private-key");
                    // userPrivateKeyString = "-----BEGIN RSA PRIVATE KEY-----\n" + userPrivateKeyString + "\n-----END RSA PRIVATE KEY-----";
                    // let userPrivateKey = forge.pki.privateKeyFromPem(userPrivateKeyString);
                    
                    // let chatMessages = returnedChat?.messages;
                    // if (chatMessages) {
                    //     for (let i = 0; i < chatMessages.length; i++) {
                    //         let messageContent = chatMessages[i]?.content;
                    //         if (messageContent) {
                    //             let decryptedText = userPrivateKey.decrypt(forge.util.decode64(messageContent));
                    //             chatMessages[i].content = decryptedText;                           
                    //         }
                    //     }
                    //     setChat(returnedChat);
                    //     setChatExists(true);
                    // } 
                }
    
                setLoading(false);
            }            
        }

        // setTimeout(() => {
        //     getCurrentChat();
        // }, 5000); 
        getCurrentChat();
    }, [userChats]);

    return (
        isLoading
            ? <LoadingPage />
            : chatExists
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