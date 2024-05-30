import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ProfilePage.css";
import { useUserContext } from "../../../routes/UserRoute";
import { getUserByUsernameAndRole, getUserAccountByUserUsername, modifyUserAccount, deleteUser, subscribe, unsubscribe } from "../../../../axios/UserAPI";
import {
    HOME_ROUTE,
    USER_ROUTE,
    CHATS_ROUTE,
    API_WEB_SOCKET_MESSAGING_URL
} from "../../../../config";
import { useAppContext } from "../../../../App";
import { useAuthContext } from "../../../routes/AuthenticationBasedRoute";
import { NotificationType } from "../../../../utils/NotificationType";
import { getCurrentUserPrivateChatWithAnotherUserByAnotherUserUsername, createChat } from "../../../../axios/ChatAPI";
import { Role } from "../../../../utils/Role";
import { ChatType } from "../../../../utils/ChatType";
import { ChatMemberRole } from "../../../../utils/ChatMemberRole";
import { UserAccountState } from "../../../../utils/UserAccountState";

export default function ProfileActionsArea(props) {

    const { user, setUser, setInformMessage } = useAppContext();
    const { stompClient } = useAuthContext();
    const { userProfile } = useUserContext();
    const { follow, setFollow } = props;
    const navigate = useNavigate();
    const [isAccountBlocked, setAccountBlocked] = useState(false);

    useEffect(() => {
        async function getUserAccount() {
            if (userProfile?.username) {
                let response = await getUserAccountByUserUsername(userProfile?.username);
                let data = response?.data;
                if (data) {
                    if (data?.state === UserAccountState.BLOCKED) {
                        setAccountBlocked(true);
                    }
                }
            }
        }
        getUserAccount();
    }, [userProfile]);

    const onFollowClick = async () => {
        let authenticatedUserUniqueName = user.uniqueName;
        let userToFollowUniqueName = userProfile.uniqueName;
        let response = null;
        if (follow) {
            response = await unsubscribe(
                authenticatedUserUniqueName,
                userToFollowUniqueName
            )
        } else {
            response = await subscribe(
                authenticatedUserUniqueName,
                userToFollowUniqueName
            );
        }

        if (response?.data?.subscribed) {
            setFollow(true);
            let accessToken = localStorage.getItem("access-token");
            stompClient.send(
                API_WEB_SOCKET_MESSAGING_URL + "/notification",
                { Authorization: `Bearer ${accessToken}` },
                JSON.stringify({
                    senderUsername: user.username,
                    receiverUsername: userProfile.username,
                    content: "New subscriber: " + response?.data?.subscriberUniqueName,
                    time: null,
                    type: NotificationType.NEW_SUBSCRIBER_NOTIFICATION,
                    class: "notification"
                })
            );
        } else {
            setFollow(false);
        }
    }

    const onSubscriptionsButtonClick = () => {
        let userProfileRoute = USER_ROUTE;
        const uniqueName = userProfile.uniqueName;
        navigate(userProfileRoute + "/" + uniqueName + "/subscriptions");
    }

    const onSubscribersButtonClick = () => {
        let userProfileRoute = USER_ROUTE;
        const uniqueName = userProfile.uniqueName;
        navigate(userProfileRoute + "/" + uniqueName + "/subscribers");
    }

    const modifyAccount = () => {
        let userProfileRoute = USER_ROUTE;
        const uniqueName = user.uniqueName;
        navigate(userProfileRoute + "/" + uniqueName + "/account");
    }

    const deleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete accout?")) {
            let response = await deleteUser(userProfile?.username);
            let data = response?.data;
            if (data && user?.role === Role.USER) {
                navigate(HOME_ROUTE);
                setUser({
                    username: "",
                    uniqueName: "",
                    authenticated: false,
                    role: Role.VISITOR
                });
                localStorage.clear();
                setInformMessage("Account was deleted");
            } else if (data && (user?.role === Role.ADMIN || user?.role === Role.ROOT)) {
                navigate(USER_ROUTE);
                setInformMessage("Account was deleted");
            }
        }
    }

    const blockUnBlockAccount = async () => {
        if (isAccountBlocked) {
            if (window.confirm("Are you sure you want to unblock accout?")) {
                let unblockedUserAccountResponse = await modifyUserAccount(userProfile?.username, {
                    userDto: userProfile,
                    state: UserAccountState.ACTIVATED,
                    createdAt: null,
                    activatedAt: null
                });
                let unblockedUserAccountResponseData = unblockedUserAccountResponse?.data;
                if (unblockedUserAccountResponseData?.state === UserAccountState.ACTIVATED) {
                    setAccountBlocked(false);
                    setInformMessage("Account was unblocked");
                }
            }
        } else {
            if (window.confirm("Are you sure you want to block accout?")) {
                let blockedUserAccountResponse = await modifyUserAccount(userProfile?.username, {
                    userDto: userProfile,
                    state: UserAccountState.BLOCKED,
                    createdAt: null,
                    activatedAt: null
                });
                let blockedUserAccountResponseData = blockedUserAccountResponse?.data;
                if (blockedUserAccountResponseData?.state === UserAccountState.BLOCKED) {
                    setAccountBlocked(true);
                    setInformMessage("Account was blocked");
                }
            }
        }

    }

    const openChat = async () => {
        let isErrorOccured = false;
        let openedUserProfileUsername = userProfile.username;
        let privateChatResponse = await getCurrentUserPrivateChatWithAnotherUserByAnotherUserUsername(openedUserProfileUsername);
        let privateChat = privateChatResponse?.data;
        let chatId = null;
        if (privateChat) {
            chatId = privateChat.id;
        } else {
            let usersToAddToChat = [];
            let currentUserResponse = await getUserByUsernameAndRole(user.username, Role.USER);
            let currentUser = currentUserResponse?.data;
            let userProfileUserResponse = await getUserByUsernameAndRole(userProfile.username, Role.USER);
            let userProfileUser = userProfileUserResponse?.data;
            if (currentUser && userProfileUser) {
                usersToAddToChat.push({
                    chatId: null,
                    user: userProfileUser,
                    role: ChatMemberRole.ADMIN
                });

                let chatCreationResponse = await createChat(
                    "PRIVATE CHAT",
                    ChatType.PRIVATE_CHAT,
                    usersToAddToChat
                )

                let chatCreationResponseData = chatCreationResponse?.data;
                if (chatCreationResponseData) {
                    chatId = chatCreationResponseData.id;
                } else {
                    isErrorOccured = true;
                }
            } else {
                isErrorOccured = true;
            }
        }

        if (isErrorOccured) {
            window.alert("Something went wrong. Can't open chat with " + userProfile.uniqueName + ". Try again later!");
        } else {
            navigate(CHATS_ROUTE + "/" + chatId);
        }

    }

    return (
        <div className="profile-actions-area">
            <div className="profile-actions-panel">
                {
                    user?.role === Role.USER
                        ? <>
                            <div className={user.username === userProfile.username ? "profile-button modify-account-button" : "hide-button"} onClick={modifyAccount}>Modify Account</div>
                            <div className={user.username === userProfile.username ? "profile-button modify-account-button delete-account-button delete-account-button-color" : "hide-button"} onClick={deleteAccount}>Delete Account</div>
                            <div className={user.username !== userProfile.username ? "profile-button follow-button" : "hide-button"} onClick={onFollowClick}>{follow ? "Unsubscribe" : "Subscribe"}</div>
                            <div className={user.username !== userProfile.username ? "profile-button message-button" : "hide-button"} onClick={openChat}>Write message</div>
                        </>
                        : <>
                            <div className="profile-button modify-account-button delete-account-button-color" onClick={deleteAccount}>Delete Account</div>
                            <div className="profile-button modify-account-button block-account-button delete-account-button-color" onClick={blockUnBlockAccount}>{isAccountBlocked ? "Unblock Account" : "Block Account"}</div>
                        </>
                }
            </div>
            <div className="profile-subscriptions-area">
                <div className="profile-button subscribtions-button" onClick={onSubscriptionsButtonClick}>Subscriptions</div>
                <div className="profile-button subscribers-button" onClick={onSubscribersButtonClick}>Subscribers</div>
            </div>
        </div>
    );
}