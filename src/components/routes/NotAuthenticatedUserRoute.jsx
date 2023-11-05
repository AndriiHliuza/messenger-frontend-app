import { React, useState, useEffect } from "react";
import { Outlet } from 'react-router-dom';
import { useAuth } from "../../utils/AuthProvider";
import AlreadyLoggedInPage from "../pages/alert-pages/AlreadyLoggedInPage";
import LoadingPage from "../pages/alert-pages/LoadingPage";

export default function NotAuthenticatedUserRoute() {

    const { user } = useAuth();

    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 100);
    }, []);

    return (
        isLoading
            ? <LoadingPage />
            : user.authenticated
                ? <AlreadyLoggedInPage />
                : <Outlet />
    )
}