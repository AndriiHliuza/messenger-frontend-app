import { React, useState, useEffect } from "react";
import { Outlet } from 'react-router-dom';
import AlreadyLoggedInPage from "../pages/alert-pages/AlreadyLoggedInPage";
import LoadingPage from "../pages/alert-pages/LoadingPage";
import { useAppContext } from "../../App";

export default function NotAuthenticatedUserRoute() {

    const { user } = useAppContext();

    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 300);
    }, []);

    return (
        isLoading
            ? <LoadingPage />
            : user.authenticated
                ? <AlreadyLoggedInPage />
                : <Outlet />
    )
}