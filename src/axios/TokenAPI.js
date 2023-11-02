import { axiosClient, refreshAuthAxiosClient } from "./AxiosClient";
import { 
    TOKEN_VALIDATION_ROUTE,
    ACCESS_TOKEN_ROUTE
} from "../config";

export const validateToken = async (token) => {
    return await axiosClient.post(
        TOKEN_VALIDATION_ROUTE,
        { content: token },
        {
            headers: { "Content-Type": "application/json" }
        }
    ).then((response) => {
        if (response?.data) {
            return response.data.valid;
        } else {
            return false;
        }
    }).catch((error) => {
        return false;
    })
}

export const getNewAccessToken = async () => {
    return await refreshAuthAxiosClient.post(
        ACCESS_TOKEN_ROUTE
    ).then((response) => {
        return response.data.content;
    }).catch((error) => {
        return null;
    })
}