// axios url
export const BASE_URL = "http://localhost:8080";

// api routes
export const API_REGISTRATION_ROUTE = "/api/registration";
export const API_AUTHENTICATION_ROUTE = "/api/authentication";
export const API_TOKEN_VALIDATION_ROUTE = "/api/jwt/validation";
export const API_ACCESS_TOKEN_ROUTE = "/api/jwt/access";
export const API_LOGOUT_ROUTE = "/api/logout";
export const API_USERS_ROUTE = "/api/users";
export const API_ADMIN_ROUTE = "/api/admin";
export const API_ROOT_ROUTE = "/api/root";

// unathenticated user routes
export const HOME_ROUTE = "/";
export const ABOUT_ROUTE = "/about";
export const CONTACT_ROUTE = "/contact";
export const SIGH_IN_ROUTE = "/sign-in";
export const SIGN_UP_ROUTE = "/sign-up";
export const NOT_FOUND_ROUTE = "/*";

// authenticated user routes
export const USER_ROUTE = "/users";
export const ADMIN_ROUTE = "/admin";
export const ROOT_ROUTE = "/root";

// validation form regex
export const USERNAME_REGEX = /^\w+@\w+\.\w+$/;
export const PASSWORD_REGEX = /^((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%.,;])).{8,20}$/;