import { authAxiosClient } from "./AxiosClient";
import { 
    API_USERS_ROUTE,
    API_ADMIN_ROUTE,
    API_ROOT_ROUTE
} from "../config";

export const getUserByUniqueNameAndRole = async (uniqueName, role) => {
    let route;
    switch(role) {
        case "USER":
            route = API_USERS_ROUTE;
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
    return await authAxiosClient.get(route + "/" + uniqueName)
    .then((response) => {
        return response
    }).catch((error) => {
        return null;
    })
}