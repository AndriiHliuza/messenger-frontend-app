import { React } from "react";
import { Outlet } from 'react-router-dom';
import { useAuth } from "../../utils/AuthProvider";
import AlreadyLoggedInPage from "../pages/alert-pages/AlreadyLoggedInPage";

export default function NotAuthenticatedUserRoute() {

    const { user } = useAuth();

    return (
        user.authenticated
            ? <AlreadyLoggedInPage />
            : <Outlet />
    )
}