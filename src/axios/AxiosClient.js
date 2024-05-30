import axios from "axios";

import { BASE_URL } from "../config";
import { isUserAuthenticated } from "../utils/AuthProvider";
import { validateToken } from "./TokenAPI";

export const axiosClient = axios.create({
    baseURL: BASE_URL
});

export const authAxiosClient = axios.create({
    baseURL: BASE_URL
});

export const refreshAuthAxiosClient = axios.create({
    baseURL: BASE_URL
});

authAxiosClient.interceptors.request.use(async (request) => {
    const accessToken = localStorage.getItem("access-token");
    request.headers.Authorization = `Bearer ${accessToken}`;
    return request;
});

refreshAuthAxiosClient.interceptors.request.use((request) => {
    const refreshToken = localStorage.getItem("refresh-token");

    if (refreshToken) {
        request.headers.Authorization = `Bearer ${refreshToken}`;
    }

    return request;
});