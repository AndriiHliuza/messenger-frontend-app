import { axiosClient, authAxiosClient } from "./AxiosClient";
import { 
    API_REGISTRATION_ROUTE, 
    API_AUTHENTICATION_ROUTE, 
    API_LOGOUT_ROUTE,
    API_USER_ROUTE
} from "../config";

export const register = async (
    username,
    password,
    uniqueName,
    firstname,
    lastname,
    birthday
) => {
    return await axiosClient.post(
        API_REGISTRATION_ROUTE,
        {
            username,
            password,
            uniqueName,
            firstname,
            lastname,
            birthday
        }
    ).then((response) => {
        if (response?.data?.accessToken && response?.data?.refreshToken) {
            localStorage.setItem("access-token", response.data.accessToken);
            localStorage.setItem("refresh-token", response.data.refreshToken);
        }
        return response?.data;
    }).catch((error) => {
        return null;
    });
}

export const authenticate = async (
    username,
    password
) => {
    return await axiosClient.post(
        API_AUTHENTICATION_ROUTE,
        {
            username,
            password
        }
    ).then((response) => {
        if (response?.data?.accessToken && response?.data?.refreshToken) {
            localStorage.setItem("access-token", response.data.accessToken);
            localStorage.setItem("refresh-token", response.data.refreshToken);
        }
        return response.data;
    }).catch((error) => {
        return null;
    });
}

export const logout = async () => {
    await authAxiosClient.post(
        API_LOGOUT_ROUTE
    ).then((response) => {
        localStorage.removeItem("access-token");
        localStorage.removeItem("refresh-token");
        localStorage.removeItem("user-private-key");
        localStorage.removeItem("user-public-key");
        localStorage.removeItem("server-public-key");
        localStorage.removeItem("aes-key");
    });
}

export const activateUserAccount = async (username, activationCode) => {
    return await axiosClient.post(
        API_USER_ROUTE + "/" + username + "/account/activation",
        {
            username: username,
            activationCode: activationCode
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