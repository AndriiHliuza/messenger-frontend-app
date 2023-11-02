import { React } from "react";
import { Outlet } from 'react-router-dom';
import { useAuth } from "../../utils/AuthProvider";
import NotLoggedInPage from "../pages/alert-pages/NotLoggedInPage";

export default function AuthenticationBasedRoute() {

    const { user } = useAuth();

    return (
        user.authenticated
            ? <Outlet />
            : <NotLoggedInPage />
    )
}