import { authAxiosClient } from "./AxiosClient";
import { API_USERS_ROUTE, API_POSTS } from "../config";

export const getUserPosts = async (username) => {
    return await authAxiosClient.get(API_USERS_ROUTE + "/" + username + "/posts")
        .then((response) => {
            return response
        }).catch((error) => {
            return null;
        })
}

export const createPost = async (user, title, content) => {
    return await authAxiosClient.post(
        API_POSTS,
        {
            id: null,
            user: user,
            title: title,
            content: content,
            createdAt: null
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

export const deletePost = async (postId) => {
    return await authAxiosClient.delete(API_POSTS + "/" + postId)
    .then((response) => {
        return response;
    }).catch((error) => {
        return null;
    })
}