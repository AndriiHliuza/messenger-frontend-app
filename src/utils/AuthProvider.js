import { validateToken, getNewAccessToken } from '../axios/TokenAPI';

export async function isUserAuthenticated() {
    
    let isAuthenticated = false;

    let accessToken = localStorage.getItem("access-token");
    let refreshToken = localStorage.getItem("refresh-token");

    if (accessToken && refreshToken) {
        const isAccessTokenValid = await validateToken(accessToken);
        const isRefreshTokenValid = await validateToken(refreshToken);

        accessToken = null;
        refreshToken = null;

        if (isAccessTokenValid && isRefreshTokenValid) {
            isAuthenticated = true;
        } else if (isRefreshTokenValid) {
            const accessToken = await getNewAccessToken();
            if (accessToken) {
                localStorage.setItem("access-token", accessToken);
                isAuthenticated = true;
            } else {
                removeJwtsFromLocalStorage();
            }
        } else {
            removeJwtsFromLocalStorage();
        }
    }
    return isAuthenticated;
}

export function removeJwtsFromLocalStorage() {
    localStorage.removeItem("access-token");
    localStorage.removeItem("refresh-token");
    localStorage.removeItem("user-private-key");
    localStorage.removeItem("user-public-key");
    localStorage.removeItem("server-public-key");
}