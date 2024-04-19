// axios url
export const BASE_URL = "http://localhost:8080";

export const API_WEB_SOCKET_URL = "http://localhost:8080/api/ws";
export const API_WEB_SOCKET_MESSAGING_URL = "/api/messaging";
export const API_WEB_SOCKET_MESSAGING_TOPIC_URL = "/api/messaging/topic";

// api routes
export const API_REGISTRATION_ROUTE = "/api/registration";
export const API_AUTHENTICATION_ROUTE = "/api/authentication";
export const API_TOKEN_VALIDATION_ROUTE = "/api/jwt/validation";
export const API_ACCESS_TOKEN_ROUTE = "/api/jwt/access";
export const API_LOGOUT_ROUTE = "/api/logout";
export const API_ENCRYPTION_KEYS_ROUTE = "/api/encryptionKeys";
export const API_USERS_ROUTE = "/api/users";
export const API_ADMINS_ROUTE = "/api/admins";
export const API_ROOTS_ROUTE = "/api/roots";
export const API_USER_ROUTE = "/api/user";
export const API_ADMIN_ROUTE = "/api/admin";
export const API_ROOT_ROUTE = "/api/root";
export const API_CHATS_ROUTE = "/api/chats";

// unathenticated user routes
export const HOME_ROUTE = "/";
export const SIGH_IN_ROUTE = "/sign-in";
export const SIGN_UP_ROUTE = "/sign-up";
export const NOT_FOUND_ROUTE = "/*";

// authenticated user routes
export const USER_ROUTE = "/users";
export const ADMIN_ROUTE = "/admin";
export const ROOT_ROUTE = "/root";
export const CHATS_ROUTE = "/chats";

// validation form regex
export const USERNAME_REGEX = /^\w+@\w+\.\w+$/;
export const PASSWORD_REGEX = /^((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%.,;])).{8,20}$/;