import { React, useEffect, useState, createContext, useContext } from "react";
import { Outlet, useNavigate, useParams, useLocation } from 'react-router-dom';
import NotLoggedInPage from "../pages/alert-pages/NotLoggedInPage";
import LoadingPage from "../pages/alert-pages/LoadingPage";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import forge from "node-forge";
import CryptoJS from "crypto-js";
import {
    HOME_ROUTE,
    API_WEB_SOCKET_URL,
    API_WEB_SOCKET_MESSAGING_TOPIC_URL
} from "../../config";
import { getCurrentUserChats } from "../../axios/ChatAPI";
import { isUserAuthenticated } from "../../utils/AuthProvider";
import { useAppContext } from "../../App";
import { NotificationType } from "../../utils/NotificationType";
import { ChatMemberRole } from "../../utils/ChatMemberRole";
import { exchangePublicEncryptionKeys } from "../../axios/EncryptionKeysAPI";

export const AuthContext = createContext();
export const useAuthContext = () => useContext(AuthContext);

export default function AuthenticationBasedRoute() {

    const { user, setUser } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    let socket = new SockJS(API_WEB_SOCKET_URL);
    let stompClient = Stomp.over(socket);

    const [isLoading, setLoading] = useState(true);
    const [userChats, setUserChats] = useState([]);
    const [isInitialMoount, setIsInitialMount] = useState(true);

    // useEffect(() => {
    //     setTimeout(() => {
    //         setLoading(false);
    //     }, 5000);
    // }, []);

    useEffect(() => {
        async function checkIsUserAuthenticated() {
            let isAuthenticated = await isUserAuthenticated();
            if (!isAuthenticated) {
                setUser({
                    username: user.username,
                    uniqueName: user.uniqueName,
                    authenticated: isAuthenticated,
                    role: user.role
                }); 
            }     
        }
        checkIsUserAuthenticated();
    }, [location.pathname]);

    useEffect(() => {
        if (isInitialMoount && !user.authenticated) {
            setIsInitialMount(false);
            return;
        }
        exchangePublicEncryptionKeys(user.username);
        if (!stompClient.connected && user.authenticated) {
            stompClient.connect({}, onWebSocketConnected, onWebSocketConnectionError);
        }
        setLoading(false);

        return () => {
            if (stompClient.connected) {
                stompClient.disconnect(() => {
                    console.log("Disconnected from websockets")
                });
            }
        }
    }, [user]);

    const onWebSocketConnected = async () => {
        stompClient.subscribe(API_WEB_SOCKET_MESSAGING_TOPIC_URL + "/" + user.username + "/notifications", onUserNotificationReceived);
        stompClient.subscribe(API_WEB_SOCKET_MESSAGING_TOPIC_URL + "/official-channel", onOfficialChannelMessageReceived);
        
        let currentUserChatsResponse = await getCurrentUserChats(3);
        let currentUserChats = currentUserChatsResponse?.data;
        if (currentUserChats) {
            for (let i = 0; i < currentUserChats.length; i++) {
                let currentUserChat = currentUserChats[i];
                if (currentUserChat) {
                    let chatId = currentUserChat?.id;
                    if (chatId) {
                        stompClient.subscribe(API_WEB_SOCKET_MESSAGING_TOPIC_URL + "/chats/" + chatId + "/messages", onChatMessageReceived);
                    }
                }
            }
            setUserChats(currentUserChats);
        }
    };

    const onWebSocketConnectionError = () => {
        window.alert("Sorry! Error occured while conecting! We recomend to refresh the page or to sign in again!");
        navigate(HOME_ROUTE);
    };

    const onUserNotificationReceived = async (payload) => {
        let receivedNotification = payload?.body;
        if (receivedNotification) {
            let notification = JSON.parse(receivedNotification);
            if (user.username === notification?.receiverUsername) {
                let notificationContent = notification.content;
                let time = notification.time;
                let notificationType = notification.type;
                let chatId = notification?.chatId;

                switch (notificationType) {
                    case NotificationType.NEW_SUBSCRIBER_NOTIFICATION:
                        window.alert(`${notificationContent}\nTime: ${time}`);
                        break;
                    case NotificationType.NEW_CHAT_NOTIFICATION:
                        let isNewChatNotificationReceived = true;
                        for (let i = 0; i < userChats.length; i++) {
                            if (userChats[i]?.id === chatId) {
                                isNewChatNotificationReceived = false;
                            }
                        }
                        if (isNewChatNotificationReceived) {
                            stompClient.subscribe(API_WEB_SOCKET_MESSAGING_TOPIC_URL + "/chats/" + chatId + "/messages", onChatMessageReceived);
                            let currentUserChatsResponse = await getCurrentUserChats(3);
                            let currentUserChats = currentUserChatsResponse?.data;
                            let isCurrentUserCreatorOfChat = false;
                            if (currentUserChats) {
                                let userPrivateKeyString = localStorage.getItem("user-private-key");
                                userPrivateKeyString = "-----BEGIN RSA PRIVATE KEY-----\n" + userPrivateKeyString + "\n-----END RSA PRIVATE KEY-----";
                                let userPrivateKey = forge.pki.privateKeyFromPem(userPrivateKeyString);
                                for (let i = 0; i < currentUserChats.length; i++) {
                                    let currentUserChat = currentUserChats[i];
                                    if (currentUserChat) {
                                        let chatMessages = currentUserChat?.messages;
                                        if (chatMessages) {
                                            for (let i = 0; i < chatMessages.length; i++) {
                                                let messageContent = chatMessages[i]?.content;
                                                if (messageContent) {
                                                    let decryptedText = userPrivateKey.decrypt(forge.util.decode64(messageContent));
                                                    chatMessages[i].content = decryptedText;
                                                }
                                            }
                                        } 
                                    }
                                }
                                setUserChats(currentUserChats);
                                currentUserChats.forEach(currentUserChat => {
                                    if (currentUserChat?.id === chatId) {
                                        let currentUserChatMembers = currentUserChat?.members;
                                        currentUserChatMembers.forEach(currentUserChatMember => {
                                            if (currentUserChatMember?.user?.username === user.username &&
                                                currentUserChatMember?.role === ChatMemberRole.ADMIN) {
                                                isCurrentUserCreatorOfChat = true;
                                            }
                                        })
                                    }
                                });   
                            }

                            if (!isCurrentUserCreatorOfChat) {
                                window.alert(`${notificationContent}\nTime: ${time}`);
                            }
                        }
                        break;
                }
            }
        }
    };

    const onOfficialChannelMessageReceived = (payload) => {
        console.log("---------------official-channel");
        console.log(payload);
        console.log("-------------");
    };

    const onChatMessageReceived = async (payload) => {
        let payloadBody = payload?.body;
        if (payloadBody) {
            let currentUserChatsResponse = await getCurrentUserChats(3);
            let currentUserChats = currentUserChatsResponse?.data;
            if (currentUserChats) {
                let userPrivateKeyString = localStorage.getItem("user-private-key");
                userPrivateKeyString = "-----BEGIN RSA PRIVATE KEY-----\n" + userPrivateKeyString + "\n-----END RSA PRIVATE KEY-----";
                let userPrivateKey = forge.pki.privateKeyFromPem(userPrivateKeyString);
                
                for (let i = 0; i < currentUserChats.length; i++) {
                    let currentUserChat = currentUserChats[i];
                    if (currentUserChat) {
                        let chatMessages = currentUserChat?.messages;
                        if (chatMessages) {
                            for (let i = 0; i < chatMessages.length; i++) {
                                let messageContent = chatMessages[i]?.content;
                                if (messageContent) {
                                    let decryptedText = userPrivateKey.decrypt(forge.util.decode64(messageContent));
                                    chatMessages[i].content = decryptedText;
                                }
                            }
                        } 
                    }
                }
                setUserChats(currentUserChats);
            }  
        }
    };

    return (
        isLoading
            ? <LoadingPage />
            : user.authenticated
                ? (
                    <AuthContext.Provider value={{ stompClient, userChats, setUserChats, onChatMessageReceived }}>
                        <Outlet />
                    </AuthContext.Provider>
                )
                : <NotLoggedInPage />
    )
}