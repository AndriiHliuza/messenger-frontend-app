import { authAxiosClient } from "./AxiosClient";
import { API_ENCRYPTION_KEYS_ROUTE } from "../config";

export const exchangePublicEncryptionKeys = async (username) => {
    let userPublicKey = localStorage.getItem("user-public-key");
    if (userPublicKey && username) {
        let receivedValue = await authAxiosClient.post(
            API_ENCRYPTION_KEYS_ROUTE + "/publicKey",
            {
                publicKey: userPublicKey
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
            let serverPublicKey = response?.publicKey;
            if (serverPublicKey) {
                localStorage.setItem("server-public-key", serverPublicKey);
            }
        }
    }
}