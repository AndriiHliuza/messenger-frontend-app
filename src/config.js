// axios url
export const BASE_URL = "http://localhost:8080";

// api routes
export const REGISTRATION_ROUTE = "/api/registration";
export const AUTHENTICATION_ROUTE = "/api/authentication";
export const TOKEN_VALIDATION_ROUTE = "/api/jwt/validation";
export const ACCESS_TOKEN_ROUTE = "/api/jwt/access";
export const LOGOUT_ROUTE = "/api/logout";

// unathenticated user routes
export const HOME_ROUTE = "/";
export const ABOUT_ROUTE = "/about";
export const CONTACT_ROUTE = "/contact";
export const SIGH_IN_ROUTE = "/sign-in";
export const SIGN_UP_ROUTE = "/sign-up";
export const NOT_FOUND_ROUTE = "/*";

// authenticated user routes
export const PROFILE_ROUTE = "/user/profile";


// validation form regex
export const USERNAME_REGEX = /^\w+@\w+\.\w+$/;
export const PASSWORD_REGEX = /^((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%.,;])).{8,20}$/;