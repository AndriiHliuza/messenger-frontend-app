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
    SIGH_IN_ROUTE,
    SIGN_UP_ROUTE,
    USER_ROUTE,
    ADMIN_ROUTE,
    ROOT_ROUTE,
    CHATS_ROUTE,
    NOT_FOUND_ROUTE
} from "../../config"
import NotFoundPage from "../pages/alert-pages/NotFoundPage";
import AdminProfilePage from "../pages/profile-pages/admin-profile/AdminProfilePage";
import RootProfilePage from "../pages/profile-pages/root-profile/RootProfilePage";
import UserRoute from "./UserRoute";
import AdminRoute from "./AdminRoute";
import RootRoute from "./RootRoute";
import ViewUsersRoute from "./ViewUsersRoute";
import ChatPage from "../pages/chat-page/ChatPage";
import ProfileModificationPage from "../pages/profile-pages/profile-modification-page/ProfileModificationPage";
import ViewChatsRoute from "./ViewChatsRoute";
import ChatCreationPage from "../pages/chat-page/ChatCreationPage";

export default function RoutesProcessor() {

    return (
        <Routes>
            {/* public routes */}
            <Route path={HOME_ROUTE} element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />

            {/* Routes for not authenticated users */}
            <Route element={<NotAuthenticatedUserRoute />} >
                <Route path={SIGH_IN_ROUTE} element={<LoginPage />} />
                <Route path={SIGN_UP_ROUTE} element={<RegistrationPage />} />
            </Route>

            {/* Routes for authenticated users */}
            <Route element={<AuthenticationBasedRoute />} >

                <Route element={<RoleUserRoute />} >
                    <Route path={USER_ROUTE} element={<UserRoute />} >
                        <Route index element={<ViewUsersRoute />} />
                        <Route path=":uniqueName" element={<UserProfilePage />} />
                        <Route path=":uniqueName/account" element={<ProfileModificationPage />} />
                        <Route path=":uniqueName/chats" >
                            <Route index element={<ViewChatsRoute />} />
                            <Route path="creation-panel" element={<ChatCreationPage />}/>
                        </Route>
                        <Route path=":uniqueName/subscribers" element={<h1>Hello subscribers</h1>} />
                        <Route path=":uniqueName/subscriptions" element={<h1>Hello subscribtions</h1>} />
                    </Route>
                </Route>

                <Route path={CHATS_ROUTE}>
                    <Route path=":chatId" element={<ChatPage />} />
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