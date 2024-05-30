import { authAxiosClient } from "./AxiosClient";
import { API_CHATS_ROUTE } from "../config";
import { MessageType } from "../utils/MessageType";

export const sendMessageToChat = async (chatId, content, type) => {
    return await authAxiosClient.post(
        API_CHATS_ROUTE + "/" + chatId + "/messages",
        {
            sender: null,
            chatId: chatId,
            messageId: null,
            messageNumber: 0,
            content: content,
            sendTime: null,
            type: type,
            status: null
        },
        {
            headers: { "Content-Type": "application/json" }
        }
    ).then((response) => {
        return response;
    }).catch((error) => {
        console.log(error);
        return null;
    })
}

export const updateMessageInChat = async (chatId, messageId, message) => {
    return await authAxiosClient.patch(
        API_CHATS_ROUTE + "/" + chatId + "/messages/" + messageId,
        {
            id: messageId,
            sender: message?.sender,
            chatId: chatId,
            content: message?.content,
            sendTime: message?.sendTime,
            type: MessageType.MODIFIED_MESSAGE,
            status: message?.status
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

export const getMessageStatusForUser = async (chatId, messageId, username) => {
    return await authAxiosClient.get(API_CHATS_ROUTE + "/" + chatId + "/messages/" + messageId + "/status?username=" + username)
        .then((response) => {
            return response
        }).catch((error) => {
            return null;
        })
}

export const updateMessagesStatusesInChat = async (chatId, status) => {
    return await authAxiosClient.patch(
        API_CHATS_ROUTE + "/" + chatId + "/messages",
        {
            chatId: chatId,
            status: status
        },
        {
            headers: { "Content-Type": "application/json" }
        }
    ).then((response) => {
        return response;
    }).catch((error) => {
        console.log(error);
        return null;
    })
}

export const deleteMessageFromChat = async (chatId, messageId) => {
    return await authAxiosClient.delete(API_CHATS_ROUTE + "/" + chatId + "/messages/" + messageId)
    .then((response) => {
        return response;
    }).catch((error) => {
        return null;
    })
}
