import { React, useEffect, useState, createContext, useContext } from "react";
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import NotLoggedInPage from "../pages/alert-pages/NotLoggedInPage";
import LoadingPage from "../pages/alert-pages/LoadingPage";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import forge from "node-forge";
import CryptoJS from 'crypto-js';
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
import { exchangePublicEncryptionKeys, getEncryptedAesKey } from "../../axios/EncryptionKeysAPI";
import { ChatType } from "../../utils/ChatType";
import { MessageType } from "../../utils/MessageType";
import { Role } from "../../utils/Role";
import { getUserAccountByUserUsername } from "../../axios/UserAPI";
import { UserAccountState } from "../../utils/UserAccountState";

export const AuthContext = createContext();
export const useAuthContext = () => useContext(AuthContext);

export default function AuthenticationBasedRoute() {

    const { user, setUser, setInformMessage } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    let socket = new SockJS(API_WEB_SOCKET_URL);
    let stompClient = Stomp.over(socket);

    const [isLoading, setLoading] = useState(true);
    const [userChats, setUserChats] = useState([]);
    const [isInitialMount, setIsInitialMount] = useState(true);

    useEffect(() => {
        async function checkIsUserAuthenticated() {
            let isAuthenticated = await isUserAuthenticated();
            if (!isAuthenticated) {
                setInformMessage("Sorry! You is not authenticated! Please sign in again!");
                navigate(HOME_ROUTE);
                setUser({
                    username: "",
                    uniqueName: "",
                    authenticated: false,
                    role: Role.VISITOR
                });
            } else if (isAuthenticated && user?.authenticated === true && user?.username) {
                let userAccountResponse = await getUserAccountByUserUsername(user?.username);
                let userAccountData = userAccountResponse?.data;
                if (!userAccountData) {
                    let userAccountState = userAccountData?.state;
                    if (userAccountState !== UserAccountState.ACTIVATED) {
                        setInformMessage("Something went wrong! Maybe your account was blocked");
                        navigate(HOME_ROUTE);
                        setUser({
                            username: "",
                            uniqueName: "",
                            authenticated: false,
                            role: Role.VISITOR
                        });
                        localStorage.clear();
                    }
                }
            }
        }
        checkIsUserAuthenticated();
    }, [location.pathname]);

    useEffect(() => {
        if (isInitialMount && !user.authenticated) {
            setIsInitialMount(false);
            return;
        }

        async function exchangeKeys() {
            await exchangePublicEncryptionKeys(user.username);
            let aesKeyResponse = await getEncryptedAesKey();
            let aesKeyResponseData = aesKeyResponse?.data;
            if (aesKeyResponseData) {
                let userPrivateKeyString = localStorage.getItem("user-private-key");
                userPrivateKeyString = "-----BEGIN RSA PRIVATE KEY-----\n" + userPrivateKeyString + "\n-----END RSA PRIVATE KEY-----";
                let userPrivateKey = forge.pki.privateKeyFromPem(userPrivateKeyString);
                let decryptedAesKey = userPrivateKey.decrypt(forge.util.decode64(aesKeyResponseData?.encryptionKey));
                localStorage.setItem("aes-key", decryptedAesKey);
            }            
        }
        exchangeKeys();
        
        if (!stompClient.connected && user.authenticated && user.role !== Role.ADMIN && user.role !== Role.ROOT) {
            let accessToken = localStorage.getItem("access-token");
            stompClient.connect({ Authorization: `Bearer ${accessToken}` }, onWebSocketConnected, onWebSocketConnectionError);
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
        let accessToken = localStorage.getItem("access-token");
        stompClient.subscribe(API_WEB_SOCKET_MESSAGING_TOPIC_URL + "/" + user.username + "/notifications", onUserNotificationReceived, { Authorization: `Bearer ${accessToken}` });

        let currentUserChatsResponse = await getCurrentUserChats(3);
        let currentUserChats = currentUserChatsResponse?.data;
        if (currentUserChats) {
            for (let i = 0; i < currentUserChats.length; i++) {
                let currentUserChat = currentUserChats[i];
                if (currentUserChat) {
                    let chatId = currentUserChat?.id;
                    if (chatId) {
                        stompClient.subscribe(API_WEB_SOCKET_MESSAGING_TOPIC_URL + "/chats/" + chatId + "/messages", onChatMessageReceived, { Authorization: `Bearer ${accessToken}` });
                    }
                }
            }
            setUserChats(currentUserChats);
        }
    };

    const onWebSocketConnectionError = () => {
        setInformMessage("Sorry! Error occured while conecting! Please sign in again!");
        navigate(HOME_ROUTE);
        setUser({
            username: "",
            uniqueName: "",
            authenticated: false,
            role: Role.VISITOR
        });
    };

    const onUserNotificationReceived = async (payload) => {
        let receivedNotification = payload?.body;
        if (receivedNotification) {
            let notification = JSON.parse(receivedNotification);
            let notificationReceiverUsername = notification?.receiverUsername;
            if (notificationReceiverUsername && user.username === notificationReceiverUsername) {
                let notificationSenderUsername = notification?.senderUsername;
                let notificationContent = notification?.content;
                let time = notification?.time;
                let chatName = notification?.chatName;
                let notificationType = notification.type;
                let chatId = notification?.chatId;
                let chatType = notification?.chatType;

                switch (notificationType) {
                    case NotificationType.NEW_SUBSCRIBER_NOTIFICATION:
                        setInformMessage(notificationContent);
                        break;

                    case NotificationType.CREATED_NEW_CHAT_NOTIFICATION:
                    case NotificationType.USER_ADDED_TO_CHAT_NOTIFICATION:
                        let isNewChatNotificationReceived = true;
                        for (let i = 0; i < userChats.length; i++) {
                            if (userChats[i]?.id === chatId) {
                                isNewChatNotificationReceived = false;
                            }
                        }
                        if (isNewChatNotificationReceived) {
                            let accessToken = localStorage.getItem("access-token");
                            stompClient.subscribe(API_WEB_SOCKET_MESSAGING_TOPIC_URL + "/chats/" + chatId + "/messages", onChatMessageReceived, { Authorization: `Bearer ${accessToken}` });
                            let currentUserChatsResponse = await getCurrentUserChats(3);
                            let currentUserChats = currentUserChatsResponse?.data;
                            let isCurrentUserCreatorOfChat = false;
                            if (currentUserChats) {
                                for (let i = 0; i < currentUserChats.length; i++) {
                                    let currentUserChat = currentUserChats[i];
                                    if (currentUserChat) {
                                        let chatMessages = currentUserChat?.messages;
                                        if (chatMessages) {
                                            for (let i = 0; i < chatMessages.length; i++) {
                                                let messageContent = chatMessages[i]?.content;
                                                if (messageContent) {
                                                    let aesKey = localStorage.getItem("aes-key");
                                                    let decryptedText = CryptoJS.AES.decrypt(
                                                        { ciphertext: CryptoJS.enc.Base64.parse(messageContent) },
                                                        CryptoJS.enc.Base64.parse(aesKey),
                                                        { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
                                                    )
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
                            if (!isCurrentUserCreatorOfChat && chatType === ChatType.GROUP_CHAT) {
                                notificationContent = "You was added to '" + notificationContent + "' chat";
                                setInformMessage(notificationContent);
                            }
                        }
                        break;

                    case NotificationType.NEW_ADMIN_IN_CHAT_NOTIFICATION:
                        notificationContent = "You was set as ADMIN in '" + chatName + "' chat";
                        setInformMessage(notificationContent);
                        break;

                    case NotificationType.DELETED_CHAT_MEMBER_NOTIFICATION:
                        const newUserChatsAfterDeletionFromChat = userChats.filter(userChat => userChat?.id !== chatId);
                        setUserChats(newUserChatsAfterDeletionFromChat);
                        setUser({ ...user });
                        notificationContent = "You was deleted from '" + chatName + "' chat";
                        setInformMessage(notificationContent);
                        break;

                    case NotificationType.MEMBER_LEFT_CHAT_NOTIFICATION:
                        const newUserChatsAfterMemberLeftChat = userChats.filter(userChat => userChat?.id !== chatId);
                        if (user?.authenticated) {
                            setUserChats(newUserChatsAfterMemberLeftChat);
                            setUser({ ...user });
                            if (notificationSenderUsername && notificationSenderUsername === user.username) {
                                notificationContent = "You left '" + chatName + "' chat";
                                setInformMessage(notificationContent);
                            }
                        }

                        break;

                    case NotificationType.DELETED_GROUP_CHAT_NOTIFICATION:
                        const newUserChatsAfterDeletingGroupChat = userChats.filter(userChat => userChat?.id !== chatId);
                        setUserChats(newUserChatsAfterDeletingGroupChat);
                        setUser({ ...user });
                        notificationContent = "'" + chatName + "' chat was deleted";
                        setInformMessage(notificationContent);
                        break;

                    case NotificationType.DELETED_PRIVATE_CHAT_NOTIFICATION:
                        const newUserChatsAfterDeletingPrivateChat = userChats.filter(userChat => userChat?.id !== chatId);
                        setUserChats(newUserChatsAfterDeletingPrivateChat);
                        setUser({ ...user });
                        if (notificationSenderUsername && notificationSenderUsername === user.username) {

                            if (chatName) {
                                notificationContent = "You deleted '" + chatName + "' chat";
                            } else {
                                notificationContent = "You deleted Unknown chat"
                            }

                            setInformMessage(notificationContent);
                        }
                        break;
                }
            }
        }
    };

    const onChatMessageReceived = async (payload) => {
        let payloadBody = payload?.body;
        if (payloadBody) {
            let message = JSON.parse(payloadBody);
            let senderUsername = message?.sender?.username;
            let messageType = message?.type;

            if (senderUsername && messageType && senderUsername === user?.username && messageType === MessageType.CHAT_MEMBER_LEFT_CHAT) {
                return;
            }

            let currentUserChatsResponse = await getCurrentUserChats(3);
            let currentUserChats = currentUserChatsResponse?.data;
            if (currentUserChats) {
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