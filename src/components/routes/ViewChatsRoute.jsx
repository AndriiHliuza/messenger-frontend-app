import { React, useState, useEffect } from "react";
import "../ViewChatsRoute.css"
import ViewChatsActionsArea from "../pages/chat-page/ViewChatsActionsArea";
import { getCurrentUserChats } from "../../axios/ChatAPI";
import { useAuthContext } from "./AuthenticationBasedRoute";
import ChatsListItem from "../pages/chat-page/ChatsListItem";
import LoadingPage from "../pages/alert-pages/LoadingPage";
import forge from "node-forge";

export default function ViewChatsRoute() {

    const [isLoading, setLoading] = useState(true);
    const { userChats, setUserChats } = useAuthContext();

    useEffect(() => {
        async function getChats() {
            let currentUserChatsResponse = await getCurrentUserChats(3);
            let currentUserChats = currentUserChatsResponse?.data;
            if (currentUserChats) {
                setUserChats(currentUserChats);
            }
            setLoading(false);
        }     
 
        getChats();
    }, []);

    return (
        isLoading
            ? <LoadingPage />
            : (
                <div className="view-chats-page">
                    <ViewChatsActionsArea />
                    <div className="chat-list-items">
                        {userChats.map((userChat) => {
                            return <ChatsListItem key={userChat.id} chat={userChat} />
                        })}
                    </div>
                </div>
            )
    );
}