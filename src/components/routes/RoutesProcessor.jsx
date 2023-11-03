import { React } from "react";
import { Route, Routes } from "react-router-dom";

import AuthenticationBasedRoute from "./AuthenticationBasedRoute";
import NotAuthenticatedUserRoute from "./NotAuthenticatedUserRoute";
import AdminRoute from "./AdminRoute";
import RootRoute from "./RootRoute";
import UserRoute from "./UserRoute";

import LoginPage from "../pages/auth-pages/login-page/LoginPage";
import RegistrationPage from "../pages/auth-pages/registration-page/RegistrationPage";
import HomePage from "../pages/home-page/HomePage";
import UserProfilePage from "../pages/profile-pages/user-profile/UserProfilePage"
import {
    HOME_ROUTE,
    ABOUT_ROUTE,
    CONTACT_ROUTE,
    SIGH_IN_ROUTE,
    SIGN_UP_ROUTE,
    USER_PROFILE_ROUTE,
    ADMIN_PROFILE_ROUTE,
    ROOT_PROFILE_ROUTE,
    NOT_FOUND_ROUTE
} from "../../config"
import NotFoundPage from "../pages/alert-pages/NotFoundPage";

export default function RoutesProcessor() {

    return (
        <Routes>
            {/* public routes */}
            <Route path={HOME_ROUTE} element={<HomePage />} />
            <Route path={ABOUT_ROUTE} element={<HomePage />} />
            <Route path={CONTACT_ROUTE} element={<HomePage />} />            

            {/* Routes for not authenticated users */}
            <Route element={<NotAuthenticatedUserRoute />} >
                <Route path={SIGH_IN_ROUTE} element={<LoginPage />} />
                <Route path={SIGN_UP_ROUTE} element={<RegistrationPage />} />
            </Route>

            {/* Routes for authenticated users */}
            <Route element={<AuthenticationBasedRoute />} >

                <Route element={<UserRoute />} >
                    <Route path={USER_PROFILE_ROUTE + "/:uniqueName"} element={<UserProfilePage />} />
                </Route>

                <Route element={<AdminRoute />} >
                    <Route path={ADMIN_PROFILE_ROUTE + "/:uniqueName"} element={<h1>Hello Admin</h1>} />
                </Route>

                <Route element={<RootRoute />} >
                    <Route path={ROOT_PROFILE_ROUTE + "/:uniqueName"} element={<h1>Hello Root</h1>} />
                </Route>

            </Route>

            {/* Routes for unknown endpoints */}
            <Route path={NOT_FOUND_ROUTE} element={<NotFoundPage />} />
        </Routes>
    );
}