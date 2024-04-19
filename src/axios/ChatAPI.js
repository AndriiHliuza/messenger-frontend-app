import { authAxiosClient } from "./AxiosClient";
import { API_CHATS_ROUTE } from "../config";

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