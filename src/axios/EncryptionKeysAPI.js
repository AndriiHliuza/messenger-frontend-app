import { authAxiosClient } from "./AxiosClient";
import { API_ENCRYPTION_KEYS_ROUTE } from "../config";

export const exchangePublicEncryptionKeys = async (username) => {
    let userPublicKey = localStorage.getItem("user-public-key");
    if (userPublicKey && username) {
        let receivedValue = await authAxiosClient.post(
            API_ENCRYPTION_KEYS_ROUTE + "/publicKey",
            {
                encryptionKey: userPublicKey
            },
            {
                headers: { "Content-Type": "application/json" }
            }
        ).then((response) => {
            return response;
        }).catch((error) => {
            return null;
        })

        let response = receivedValue?.data;
        if (response) {
            let serverPublicKey = response?.encryptionKey;
            if (serverPublicKey) {
                localStorage.setItem("server-public-key", serverPublicKey);
            }
        }
    }
}

export const getEncryptedAesKey = async () => {
    return await authAxiosClient.get(
        API_ENCRYPTION_KEYS_ROUTE + "/aesKey")
        .then((response) => {
            return response;
        }).catch((error) => {
            return null;
        })
}