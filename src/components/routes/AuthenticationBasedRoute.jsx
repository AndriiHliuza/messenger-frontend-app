import { React, useEffect, useState } from "react";
import { Outlet } from 'react-router-dom';
import { useAuth } from "../../utils/AuthProvider";
import NotLoggedInPage from "../pages/alert-pages/NotLoggedInPage";
import LoadingPage from "../pages/alert-pages/LoadingPage";

export default function AuthenticationBasedRoute() {

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
                ? <Outlet />
                : <NotLoggedInPage />
    )
}