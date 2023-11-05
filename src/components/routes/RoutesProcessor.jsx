import { React } from "react";
import { Route, Routes } from "react-router-dom";

import AuthenticationBasedRoute from "./AuthenticationBasedRoute";
import NotAuthenticatedUserRoute from "./NotAuthenticatedUserRoute";
import RoleAdminRoute from "./role-routes/RoleAdminRoute";
import RoleRootRoute from "./role-routes/RoleRootRoute";
import RoleUserRoute from "./role-routes/RoleUserRoute";

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
    USER_ROUTE,
    ADMIN_ROUTE,
    ROOT_ROUTE,
    NOT_FOUND_ROUTE
} from "../../config"
import NotFoundPage from "../pages/alert-pages/NotFoundPage";
import AdminProfilePage from "../pages/profile-pages/admin-profile/AdminProfilePage";
import RootProfilePage from "../pages/profile-pages/root-profile/RootProfilePage";
import UserRoute from "./UserRoute";
import AdminRoute from "./AdminRoute";
import RootRoute from "./RootRoute";

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

                <Route element={<RoleUserRoute />} >
                    <Route path={USER_ROUTE} element={<UserRoute />} >
                        <Route path=":uniqueName" element={<UserProfilePage />} />
                        <Route path=":uniqueName/friends" element={<h1>Hello friends</h1>} />
                    </Route>
                </Route>

                <Route element={<RoleAdminRoute />} >
                    <Route path={ADMIN_ROUTE} element={<AdminRoute />} >
                        <Route path=":uniqueName" element={<AdminProfilePage />} />
                    </Route>
                </Route>

                <Route element={<RoleRootRoute />} >
                    <Route path={ROOT_ROUTE} element={<RootRoute />} >
                        <Route path=":uniqueName" element={<RootProfilePage />} />
                    </Route>
                </Route>

            </Route>

            {/* Routes for unknown endpoints */}
            <Route path={NOT_FOUND_ROUTE} element={<NotFoundPage />} />
        </Routes>
    );
}