import { authAxiosClient } from "./AxiosClient";
import { API_ADMINS_ROUTE, API_ADMIN_ROUTE } from "../config";

export const createAdmin = async (
    username,
    password,
    uniqueName,
    firstname,
    lastname,
    birthday
) => {
    return await authAxiosClient.post(
        API_ADMIN_ROUTE,
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

export const deleteAdmin = async (username) => {
    return await authAxiosClient.delete(API_ADMINS_ROUTE + "/" + username)
    .then((response) => {
        return response;
    }).catch((error) => {
        return null;
    })
}

export const getAdmins = async (page, size, order) => {
    return await authAxiosClient.get(API_ADMINS_ROUTE + "?page=" + page + "&size=" + size + "&order=" + order)
        .then((response) => {
            return response;
        }).catch((error) => {
            return null;
        })
}

export const findAdminsByUniqueNameStartingWith = async (uniqueNamePrefix) => {
    return await authAxiosClient.get(API_ADMINS_ROUTE + "/uniqueNames?prefix=" + uniqueNamePrefix)
        .then((response) => {
            return response;
        }).catch((error) => {
            return null;
        })
}