import { authAxiosClient } from "./AxiosClient";
import { API_CHATS_ROUTE, API_PRIVATE_CHATS_ROUTE } from "../config";

export const getCurrentUserChats = async (numberOfMessagesToRetrieveFromEveryChat) => {
    let route = API_CHATS_ROUTE;
    if (numberOfMessagesToRetrieveFromEveryChat) {
        route = route + "?numberOfMessagesToRetrieveFromEveryChat=" + numberOfMessagesToRetrieveFromEveryChat;
    }
    return await authAxiosClient.get(route)
        .then((response) => {
            return response
        }).catch((error) => {
            return null;
        })
}

export const getCurrentUserPrivateChatWithAnotherUserByAnotherUserUsername = async (anotherUserUsername) => {
    return await authAxiosClient.get(API_PRIVATE_CHATS_ROUTE + "/" + anotherUserUsername)
        .then((response) => {
            return response
        }).catch((error) => {
            return null;
        })
}

export const createChat = async (name, type, members) => {
    return await authAxiosClient.post(
        API_CHATS_ROUTE,
        {
            id: null,
            name: name,
            type: type,
            members: members,
            messages: null
        },
        {
            headers: { "Content-Type": "application/json" }
        }
    ).then((response) => {
        return response;
    }).catch((error) => {
        return null;
    })
}

export const getChatById = async (chatId) => {
    return await authAxiosClient.get(API_CHATS_ROUTE + "/" + chatId)
        .then((response) => {
            return response
        }).catch((error) => {
            return null;
        })
}

export const updateChat = async (chatId, chat) => {
    return await authAxiosClient.patch(
        API_CHATS_ROUTE + "/" + chatId,
        {
            id: chat?.id,
            name: chat?.name,
            type: chat?.type,
            members: chat?.members,
            messages: chat?.messages
        },
        {
            headers: { "Content-Type": "application/json" }
        }
    ).then((response) => {
        return response
    }).catch((error) => {
        return null;
    })
}

export const deleteChatById = async (chatId) => {
    return await authAxiosClient.delete(API_CHATS_ROUTE + "/" + chatId)
    .then((response) => {
        return response;
    }).catch((error) => {
        return null;
    })
}

export const addNewUserToChat = async (chatId, username, user) => {
    return await authAxiosClient.post(
        API_CHATS_ROUTE + "/" + chatId + "/members/" + username,
        user,
        {
            headers: { "Content-Type": "application/json" }
        }
    ).then((response) => {
        return response;
    }).catch((error) => {
        return null;
    })
}

export const updateChatMember = async (chatId, username, chatMember) => {
    let user = chatMember?.user;
    let role = chatMember?.role;
    return await authAxiosClient.patch(
        API_CHATS_ROUTE + "/" + chatId + "/members/" + username,
        {
            chatId: chatId,
            user: user,
            role: role
        },
        {
            headers: { "Content-Type": "application/json" }
        }
    ).then((response) => {
        return response;
    }).catch((error) => {
        return null;
    })
}

export const deleteChatMemberFromChat = async (chatId, username) => {
    return await authAxiosClient.delete(API_CHATS_ROUTE + "/" + chatId + "/members/" + username)
    .then((response) => {
        return response;
    }).catch((error) => {
        return null;
    })
}