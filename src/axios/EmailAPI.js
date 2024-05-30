import { axiosClient } from "./AxiosClient";
import { API_USER_ROUTE } from "../config";

export const sendEmailForUserAccountActivation = async (username) => {
    return await axiosClient.post(
        API_USER_ROUTE + "/" + username + "/account/activation/email",
        {
            from: null,
            to: username,
            subject: null,
            text: null
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