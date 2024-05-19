import { authAxiosClient } from "./AxiosClient";
import {
    API_USERS_ROUTE,
    API_ADMINS_ROUTE,
    API_ROOTS_ROUTE,
    API_USER_ROUTE,
    API_ADMIN_ROUTE,
    API_ROOT_ROUTE
} from "../config";

export const getUserByUsernameAndRole = async (username, role) => {
    let route;
    switch (role) {
        case "USER":
            route = API_USER_ROUTE;
            break;
        case "ADMIN":
            route = API_ADMIN_ROUTE;
            break;
        case "ROOT":
            route = API_ROOT_ROUTE;
            break;
        default:
            route = null;
    }
    return await authAxiosClient.get(route + "?username=" + username)
        .then((response) => {
            return response
        }).catch((error) => {
            return null;
        })
}

export const getUserByUniqueNameAndRole = async (uniqueName, role) => {
    let route;
    switch (role) {
        case "USER":
            route = API_USERS_ROUTE;
            break;
        case "ADMIN":
            route = API_ADMINS_ROUTE;
            break;
        case "ROOT":
            route = API_ROOTS_ROUTE;
            break;
        default:
            route = null;
    }
    return await authAxiosClient.get(route + "/" + uniqueName)
        .then((response) => {
            return response
        }).catch((error) => {
            return null;
        })
}

export const getUserAccountByUserUsername = async (username) => {
    return await authAxiosClient.get(API_USERS_ROUTE + "/" + username + "/account")
        .then((response) => {
            return response;
        }).catch((error) => {
            return null;
        })
}

export const modifyUserAccount = async (
    username,
    userAccount
) => {
    return await authAxiosClient.patch(
        API_USERS_ROUTE + "/" + username + "/account",
        userAccount,
        {
            headers: { "Content-Type": "application/json" }
        }
    ).then((response) => {
        return response;
    }).catch((error) => {
        return null;
    })
}

export const getUsers = async (page, size, order) => {
    return await authAxiosClient.get(API_USERS_ROUTE + "?page=" + page + "&size=" + size + "&order=" + order)
        .then((response) => {
            return response;
        }).catch((error) => {
            return null;
        })
}

export const getUserSubscriptions = async (uniqueName) => {
    return await authAxiosClient.get(API_USERS_ROUTE + "/" + uniqueName + "/subscriptions")
        .then((response) => {
            return response;
        }).catch((error) => {
            console.log(error);
            return null;
        })
}

export const getUserSubscribers = async (uniqueName) => {
    return await authAxiosClient.get(API_USERS_ROUTE + "/" + uniqueName + "/subscribers")
        .then((response) => {
            return response;
        }).catch((error) => {

            return null;
        })
}

export const subscribe = async (
    subscriberUniqueName,
    subscriptionUniqueName
) => {
    return await authAxiosClient.post(
        API_USERS_ROUTE + "/" + subscriberUniqueName + "/subscriptions",
        {
            subscriptionUniqueName: subscriptionUniqueName,
            subscriberUniqueName: subscriberUniqueName,
            isSubscribed: false
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

export const isSubscribed = async (
    subscriberUniqueName,
    subscriptionUniqueName
) => {
    return await authAxiosClient.get(API_USERS_ROUTE + "/" + subscriberUniqueName + "/subscriptions/" + subscriptionUniqueName)
        .then((response) => {
            return response;
        }).catch((error) => {
            return null;
        })
}

export const unsubscribe = async (
    subscriberUniqueName,
    subscriptionUniqueName
) => {
    return await authAxiosClient.delete(API_USERS_ROUTE + "/" + subscriberUniqueName + "/subscriptions/" + subscriptionUniqueName)
        .then((response) => {
            return response;
        }).catch((error) => {
            return null;
        })
}

export const modify = async (
    username,
    formData
) => {
    return await authAxiosClient.patch(
        API_USERS_ROUTE + "/" + username,
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    ).then((response) => {
        return response;
    }).catch((error) => {
        return null;
    })
}

export const deleteUser = async (username) => {
    return await authAxiosClient.delete(API_USERS_ROUTE + "/" + username)
    .then((response) => {
        return response;
    }).catch((error) => {
        return null;
    })
}

export const getProfileImage = async (uniqueName) => {
    return await authAxiosClient.get(
        API_USERS_ROUTE + "/" + uniqueName + "/image",
        {
            responseType: "blob"
        }
    ).then((response) => {
        return response;
    }).catch((error) => {
        return null;
    })
}

export const getProfileImageMetadata = async (uniqueName) => {
    return await authAxiosClient.get(API_USERS_ROUTE + "/" + uniqueName + "/image/metadata")
        .then((response) => {
            return response;
        }).catch((error) => {
            return null;
        })
}

export const findUsersByUniqueNameStartingWith = async (uniqueNamePrefix) => {
    return await authAxiosClient.get(API_USERS_ROUTE + "/uniqueNames?prefix=" + uniqueNamePrefix)
        .then((response) => {
            return response;
        }).catch((error) => {
            return null;
        })
}