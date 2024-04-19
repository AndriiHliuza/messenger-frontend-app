import { authAxiosClient } from "./AxiosClient";
import { API_CHATS_ROUTE } from "../config";
import forge from "node-forge";

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

export const deleteMessageFromChat = async (chatId, messageId) => {
    return await authAxiosClient.delete(API_CHATS_ROUTE + "/" + chatId + "/messages/" + messageId)
    .then((response) => {
        return response;
    }).catch((error) => {
        return null;
    })
}
