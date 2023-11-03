import { authAxiosClient } from "./AxiosClient";
import { API_USERS_ROUTE } from "../config";

export const getUserByUniqueName = async (uniqueName) => {
    return await authAxiosClient.get(API_USERS_ROUTE + "/" + uniqueName)
    .then((response) => {
        return response
    }).catch((error) => {
        return null;
    })
}