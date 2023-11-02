import { axiosClient, authAxiosClient } from "./AxiosClient";
import { REGISTRATION_ROUTE, AUTHENTICATION_ROUTE, LOGOUT_ROUTE } from "../config";

export const register = async (
    username,
    password,
    firstname,
    lastname,
    birthday
) => {
    return await axiosClient.post(
        REGISTRATION_ROUTE,
        {
            username,
            password,
            firstname,
            lastname,
            birthday
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

export const authenticate = async (
    username,
    password
) => {
    return await axiosClient.post(
        AUTHENTICATION_ROUTE,
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
        LOGOUT_ROUTE
    ).then((response) => {
        localStorage.removeItem("access-token");
        localStorage.removeItem("refresh-token");
    });
}